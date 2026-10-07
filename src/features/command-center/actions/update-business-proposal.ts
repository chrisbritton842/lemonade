"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import {
    ProposalStatus,
    ProposalThreshold,
    ProposalType,
    VoteChoice,
} from "@/generated/prisma/enums";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { prisma } from "@/lib/prisma";
import { commandCenterPagePath, signInPagePath } from "@/paths";

export type UpdateBusinessProposalState = {
    success: boolean;
    errors: {
        businessName?: string[];
        businessDescription?: string[];
        reason?: string[];
        general?: string[];
    };
};

const updateBusinessProposalSchema = z.object({
    coopId: z.string().min(1),
    businessName: z
        .string()
        .trim()
        .min(2, "Business name must be at least 2 characters.")
        .max(80, "Business name must be 80 characters or less."),
    businessDescription: z
        .string()
        .trim()
        .max(300, "Description must be 300 characters or less.")
        .optional(),
    reason: z
        .string()
        .trim()
        .max(300, "Reason must be 300 characters or less.")
        .optional(),
});

const updateBusinessProposalAction = async (
    _previousState: UpdateBusinessProposalState,
    formData: FormData
): Promise<UpdateBusinessProposalState> => {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        redirect(signInPagePath());
    }

    const parsed = updateBusinessProposalSchema.safeParse({
        coopId: formData.get("coopId"),
        businessName: formData.get("businessName"),
        businessDescription: formData.get("businessDescription") || undefined,
        reason: formData.get("reason") || undefined,
    });

    if (!parsed.success) {
        return {
            success: false,
            errors: parsed.error.flatten().fieldErrors,
        };
    }

    const { coopId, businessName, businessDescription, reason } = parsed.data;

    const result = await prisma.$transaction(async (tx) => {
        const membership = await tx.membership.findUnique({
            where: {
                userId_coopId: {
                    userId: currentUser.user.id,
                    coopId,
                },
            },
            select: {
                id: true,
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

        const coop = await tx.cooperative.findUnique({
            where: {
                id: coopId,
            },
            select: {
                id: true,
                name: true,
                description: true,
            },
        });

        if (!coop) {
            return {
                success: false,
                errors: {
                    general: ["Business not found."],
                }
            }
        }

        await tx.proposal.create({
            data: {
                coopId,
                createdById: currentUser.user.id,
                title: "Update business details",
                description:
                    reason ||
                    "This proposal is to update the business details.",
                type: ProposalType.UPDATE_BUSINESS,
                status: ProposalStatus.OPEN,
                threshold: ProposalThreshold.SIMPLE_MAJORITY,
                payload: {
                    businessName,
                    businessDescription: businessDescription || null,
                },
                votes: {
                    create: {
                        userId: currentUser.user.id,
                        choice: VoteChoice.YES,
                    },
                },
            },
        });

        return {
            success: true,
            errors: {},
        };
    });

    if (result.success) {
        revalidatePath(commandCenterPagePath(coopId));
    }

    return result;
}

export { updateBusinessProposalAction };