"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { VoteChoice } from "@/generated/prisma/enums";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { prisma } from "@/lib/prisma";
import { commandCenterPagePath, signInPagePath } from "@/paths";

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

    const membership = await prisma.membership.findUnique({
        where: {
            userId_coopId: {
                userId: user.user.id,
                coopId: coopId,
            },
        },
    });
    
    if (!membership) {
        throw new Error("You are not a member of this organization.");
    }

    const proposal = await prisma.proposal.findFirst({
        where: {
            id: proposalId,
            coopId: coopId,
            status: "OPEN",
        },
    });

    if (!proposal) {
        throw new Error("This proposal is not open for voting.");
    }

    await prisma.proposalVote.upsert({
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

    revalidatePath(commandCenterPagePath(coopId));
};

export { voteOnProposalAction };