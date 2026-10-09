import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";

type TransactionClient = Prisma.TransactionClient;

const updateBusinessPayloadSchema = z.object({
    businessName: z.string().trim().min(2).max(80),
    businessDescription: z.string().trim().max(300).nullable().optional(),
});

type UpdateBusinessProposal = {
    id: string;
    coopId: string;
    payload: Prisma.JsonValue | null;
    appliedAt: Date | null;
};

type ApplyUpdateBusinessProposalInput = {
    tx: TransactionClient;
    proposal: UpdateBusinessProposal;
};

const applyUpdateBusinessProposal = async ({
    tx,
    proposal,
}: ApplyUpdateBusinessProposalInput) => {
    if (proposal.appliedAt) {
        return;
    }

    const parsed = updateBusinessPayloadSchema.safeParse(proposal.payload);

    if (!parsed.success) {
        throw new Error("Invalid payload for update business proposal.");
    }

    const { businessName, businessDescription } = parsed.data;

    const coop = await tx.cooperative.findUnique({
        where: {
            id: proposal.coopId,
        },
        select: {
            id: true,
        },
    });

    if (!coop) {
        throw new Error("Cannot update a business that does not exist.");
    }

    await tx.cooperative.update({
        where: {
            id: proposal.coopId,
        },
        data: {
            name: businessName,
            description: businessDescription || null,
        },
    });

    await tx.proposal.update({
        where: {
            id: proposal.id,
        },
        data: {
            appliedAt: new Date(),
        },
    });
};

export { applyUpdateBusinessProposal };