"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { evaluateProposalVote } from "@/features/command-center/lib/evaluate-proposal-vote";
import {
    ProposalStatus,
    VoteChoice,
} from "@/generated/prisma/enums";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { prisma } from "@/lib/prisma";
import { commandCenterPagePath, signInPagePath } from "@/paths";
import { applyPassedProposal } from "../lib/proposals/apply-passed-proposal";

const voteOnProposalAction = async (formData: FormData): Promise<void> => {
    const user = await getCurrentUser();

    if (!user) {
        redirect(signInPagePath());
    }

    const proposalId = String(formData.get("proposalId") ?? "");
    const coopId = String(formData.get("coopId") ?? "");
    const choice = String(formData.get("choice") ?? "");

    if (!proposalId || !coopId) {
        throw new Error("Missing proposal information.");
    }

    if (!Object.values(VoteChoice).includes(choice as VoteChoice)) {
        throw new Error("Invalid vote choice.");
    }

    await prisma.$transaction(async (tx) => {
        const membership = await prisma.membership.findUnique({
            where: {
                userId_coopId: {
                    userId: user.user.id,
                    coopId: coopId,
                },
            },
        });

        if (!membership) {
            throw new Error("You do not work for this business.");
        }

        const proposal = await tx.proposal.findFirst({
            where: {
                id: proposalId,
                coopId: coopId,
                status: ProposalStatus.OPEN,
            },
        });

        if (!proposal) {
            throw new Error("This proposal is not open for voting.");
        }

        await tx.proposalVote.upsert({
            where: {
                proposalId_userId: {
                    proposalId: proposalId,
                    userId: user.user.id,
                },
            },
            create: {
                proposalId: proposalId,
                userId: user.user.id,
                choice: choice as VoteChoice,
            },
            update: {
                choice: choice as VoteChoice,
            },
        });

        const eligibleMemberCount = await tx.membership.count({
            where: {
                coopId,
            },
        });

        const votes = await tx.proposalVote.findMany({
            where: {
                proposalId,
            },
            select: {
                choice: true,
            },
        });

        const yesVotes = votes.filter(
            (vote) => vote.choice === VoteChoice.YES
        ).length;

        const noVotes = votes.filter(
            (vote) => vote.choice === VoteChoice.NO
        ).length;

        const abstainVotes = votes.filter(
            (vote) => vote.choice === VoteChoice.ABSTAIN
        ).length;

        const nextStatus = evaluateProposalVote({
            eligibleMemberCount,
            yesVotes,
            noVotes,
            abstainVotes,
            threshold: proposal.threshold,
            type: proposal.type,
        });

        if (nextStatus !== ProposalStatus.OPEN) {
            await tx.proposal.update({
                where: {
                    id: proposal.id,
                },
                data: {
                    status: nextStatus,
                },
            });

            if (nextStatus === ProposalStatus.PASSED) {
                await applyPassedProposal({
                    tx,
                    proposalId: proposal.id,
                });
            }
        }
    });

    revalidatePath(commandCenterPagePath(coopId));
};

export { voteOnProposalAction };