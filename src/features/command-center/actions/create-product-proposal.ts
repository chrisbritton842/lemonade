"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import {
    ProposalStatus,
    ProposalThreshold,
    ProposalType,
} from "@/generated/prisma/enums";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { prisma } from "@/lib/prisma";
import { commandCenterPagePath, signInPagePath } from "@/paths";

export type CreateProductProposalState = {
    success: boolean;
    errors: {
        productName?: string[];
        productDescription?: string[];
        priceDollars?: string[];
        reason?: string[];
        general?: string[];
    };
};

const schema = z.object({
    coopId: z.string().min(1),
    productName: z
        .string()
        .trim()
        .min(2, "Product name must be at least 2 characters.")
        .max(80, "Product name must be 80 characters or less."),
    productDescription: z
        .string()
        .trim()
        .max(300, "Product description must be 300 characters or less.")
        .optional(),
    priceDollars: z
        .string()
        .trim()
        .min(1, "Enter a price.")
        .regex(/^\d+(\.\d{1,2})?$/, "Enter a valid price, like 1 or 1.50."),
    reason: z
        .string()
        .trim()
        .max(500, "Reason must be 500 characters or less.")
        .optional(),
});

const dollarsToCents = (value: string) => {
    const [dollarsPart, centsPart = ""] = value.split(".");
    const dollars = Number(dollarsPart);
    const cents = Number(centsPart.padEnd(2, "0"));

    return dollars * 100 + cents;
};

const createProductProposalAction = async (
    _prevState: CreateProductProposalState,
    formData: FormData
): Promise<CreateProductProposalState> => {
    const user = await getCurrentUser();

    if (!user) {
        redirect(signInPagePath());
    }

    const parsed = schema.safeParse({
        coopId: formData.get("coopId"),
        productName: formData.get("productName"),
        productDescription: formData.get("productDescription"),
        priceDollars: formData.get("priceDollars"),
        reason: formData.get("reason"),
    });

    if (!parsed.success) {
        return {
            success: false,
            errors: parsed.error.flatten().fieldErrors,
        };
    }

    const {
        coopId,
        productName,
        productDescription,
        priceDollars,
        reason,
    } = parsed.data;

    const membership = await prisma.membership.findUnique({
        where: {
            userId_coopId: {
                userId: user.user.id,
                coopId,
            },
        },
    });

    if (!membership) {
        return {
            success: false,
            errors: {
                general: ["You do not work for this business."],
            },
        };
    }

    const priceCents = dollarsToCents(priceDollars);

    await prisma.proposal.create({
        data: {
            coopId,
            createdById: user.user.id,
            title: `Create prodcuct: ${productName}`,
            description:
                reason ||
                productDescription ||
                "A member proposed adding a new product.",
            type: ProposalType.CREATE_PRODUCT,
            status: ProposalStatus.OPEN,
            threshold: ProposalThreshold.SIMPLE_MAJORITY,
            payload: {
                productName,
                productDescription: productDescription || null,
                priceCents,
            },
        },
    });

    revalidatePath(commandCenterPagePath(coopId));

    return {
        success: true,
        errors: {},
    };
};

export { createProductProposalAction };