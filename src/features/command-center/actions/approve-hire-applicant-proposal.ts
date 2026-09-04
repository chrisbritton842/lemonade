"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { applyHireApplicantProposal } from "@/features/command-center/lib/proposals/apply-hire-applicant-proposal";
import {
    CoopRole,
    ProposalStatus,
    ProposalType,
} from "@/generated/prisma/enums";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { prisma } from "@/lib/prisma";
import {
    businessesPagePath,
    commandCenterPagePath,
    signInPagePath,
} from "@/paths";

const approveHireApplicantProposalAction = async (
    formData: FormData
): Promise<void> => {
    const user = await getCurrentUser();

    if (!user) {
        redirect(signInPagePath());
    }

    const proposalId = String(formData.get("proposalId") ?? "");
    const coopId = String(formData.get("coopId") ?? "");

    if (!proposalId || !coopId) {
        throw new Error("Missing proposal information.");
    }

    await prisma.$transaction(async (tx) => {
        const boardMembership = await tx.membership.findFirst({
            where: {
                userId: user.user.id,
                coopId,
                roles: {
                    some: {
                        role: CoopRole.BOARD_OF_DIRECTORS,
                    },
                },
            },
        });

        if (!boardMembership) {
            throw new Error("Only board members can approve hire proposals.");
        }

        const proposal = await tx.proposal.findFirst({
            where: {
                id: proposalId,
                coopId,
                type: ProposalType.HIRE_APPLICANT,
                status: ProposalStatus.NEEDS_REVIEW,
            },
            select: {
                id: true,
                coopId: true,
                type: true,
                status: true,
                payload: true,
                appliedAt: true,
            },
        });

        if (!proposal) {
            throw new Error("This hire proposal is not ready for approval.");
        }

        await applyHireApplicantProposal({
            tx,
            proposal,
        });
    });

    revalidatePath(commandCenterPagePath(coopId));
    revalidatePath(businessesPagePath());
};

export { approveHireApplicantProposalAction };