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

export type CreateRuleProposalState = {
    success: boolean;
    errors: {
        ruleText?: string[];
        reason?: string[];
        general?: string[];
    };
};

const schema = z.object({
    coopId: z.string().min(1),
    ruleText: z
        .string()
        .trim()
        .min(5, "Rule must be at least 5 characters.")
        .max(200, "Rule must be 200 characters or less."),
    reason: z
        .string()
        .trim()
        .max(300, "Reason must be 300 characters or less.")
        .optional(),
});

const createRuleProposalAction = async (
    _previousState: CreateRuleProposalState,
    formData: FormData
): Promise<CreateRuleProposalState> => {
    const user = await getCurrentUser();

    if (!user) {
        redirect(signInPagePath());
    }

    const parsed = schema.safeParse({
        coopId: formData.get("coopId"),
        ruleText: formData.get("ruleText"),
        reason: formData.get("reason") || undefined,
    });

    if (!parsed.success) {
        return {
            success: false,
            errors: parsed.error.flatten().fieldErrors,
        };
    }

    const { coopId, ruleText, reason } = parsed.data;

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

    await prisma.proposal.create({
        data: {
            coopId,
            createdById: user.user.id,
            title: "Create a new rule",
            description: reason || ruleText,
            type: ProposalType.CREATE_RULE,
            status: ProposalStatus.OPEN,
            threshold: ProposalThreshold.SIMPLE_MAJORITY,
            payload: {
                ruleText,
            },
        },
    });

    revalidatePath(commandCenterPagePath(coopId));

    return {
        success: true,
        errors: {},
    };
};

export { createRuleProposalAction };