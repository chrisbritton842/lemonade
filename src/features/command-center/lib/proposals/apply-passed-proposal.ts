import type { Prisma } from "@/generated/prisma/client";
import {
    ProposalStatus,
    ProposalType,
} from "@/generated/prisma/enums";
import { applyCreateEventProposal } from "./apply-create-event-proposal";
import { applyCreateJobOpeningProposal } from "./apply-create-job-opening-proposal";
import { applyCreateProductProposal } from "./apply-create-product-proposal";
import { applyCreateTaskProposal } from "./apply-create-task-proposal";

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
            createdById: true,
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

    if (proposal.type === ProposalType.CREATE_JOB_OPENING) {
        await applyCreateJobOpeningProposal({ tx, proposal });
        return;
    }

    if (proposal.type === ProposalType.CREATE_EVENT) {
        await applyCreateEventProposal({ tx, proposal });
        return;
    }
};

export { applyPassedProposal };