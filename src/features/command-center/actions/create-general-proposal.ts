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

export type CreateGeneralProposalState = {
    success: boolean;
    errors: {
        title?: string[];
        description?: string[];
        general?: string[];
    };
};

const schema = z.object({
    coopId: z.string().min(1),
    title: z.string().trim().min(2, "Title must be at least 2 characters long.").max(80),
    description: z
        .string()
        .trim()
        .min(5, "Description must be at least 5 characters long.")
        .max(500),
});

const createGeneralProposalAction = async (
    _prevState: CreateGeneralProposalState,
    formData: FormData
): Promise<CreateGeneralProposalState> => {
    const user = await getCurrentUser();

    if (!user) {
        redirect(signInPagePath());
    }

    const parsed = schema.safeParse({
        coopId: formData.get("coopId"),
        title: formData.get("title"),
        description: formData.get("description"),
    });

    if (!parsed.success) {
        return {
            success: false,
            errors: parsed.error.flatten().fieldErrors,
        };
    }

    const { coopId, title, description } = parsed.data;

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
                general: ["You do not work for this business."]
            },
        };
    }

    await prisma.proposal.create({
        data: {
            coopId,
            createdById: user.user.id,
            title,
            description,
            type: ProposalType.GENERAL,
            status: ProposalStatus.OPEN,
            threshold: ProposalThreshold.SIMPLE_MAJORITY,
        },
    });

    revalidatePath(commandCenterPagePath(coopId));

    return {
        success: true,
        errors: {},
    };
};

export { createGeneralProposalAction };
