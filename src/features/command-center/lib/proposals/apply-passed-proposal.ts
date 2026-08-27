import type { Prisma } from "@/generated/prisma/client";
import {
    ProposalStatus,
    ProposalType,
} from "@/generated/prisma/enums";
import { applyCreateProductProposal } from "./apply-create-product-proposal";
import { applyCreateTaskProposal } from "./apply-create-task-proposal";
import { applyUpdateNameProposal } from "./apply-update-name-proposal";

type TransactionClient = Prisma.TransactionClient;

const applyPassedProposal = async ({
    tx,
    proposalId,
}: {
    tx: TransactionClient;
    proposalId: string;
}) => {
    const proposal = await tx.proposal.findUnique({
        where: {
            id: proposalId,
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
        return;
    }

    if (proposal.status !== ProposalStatus.PASSED) {
        return;
    }

    if (proposal.appliedAt) {
        return;
    }

    if (proposal.type === ProposalType.CREATE_TASK) {
        await applyCreateTaskProposal({ tx, proposal });
        return;
    }

    if (proposal.type === ProposalType.CREATE_PRODUCT) {
        await applyCreateProductProposal({ tx, proposal });
        return;
    }

    if (proposal.type === ProposalType.UPDATE_NAME) {
        await applyUpdateNameProposal({ tx, proposal });
        return;
    }
};

export { applyPassedProposal };