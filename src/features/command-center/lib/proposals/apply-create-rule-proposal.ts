import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";

type TransactionClient = Prisma.TransactionClient;

const schema = z.object({
    ruleText: z
        .string()
        .trim()
        .min(5)
        .max(200),
});

type CreateRuleProposal = {
    id: string;
    coopId: string;
    payload: Prisma.JsonValue | null;
    appliedAt: Date | null;
};

type ApplyCreateRuleProposalInput = {
    tx: TransactionClient;
    proposal: CreateRuleProposal;
};

const applyCreateRuleProposal = async ({
    tx,
    proposal,
}: ApplyCreateRuleProposalInput) => {
    if (proposal.appliedAt) {
        return;
    }

    const existingRule = await tx.rule.findUnique({
        where: {
            sourceProposalId: proposal.id,
        },
        select: {
            id: true,
        },
    });

    if (existingRule) {
        await tx.proposal.update({
            where: {
                id: proposal.id,
            },
            data: {
                appliedAt: new Date(),
            },
        });

        return;
    }

    const parsed = schema.safeParse(proposal.payload);

    if (!parsed.success) {
        throw new Error("Invalid create rule proposal payload.");
    }

    const { ruleText } = parsed.data;

    await tx.rule.create({
        data: {
            coopId: proposal.coopId,
            text: ruleText,
            isActive: true,
            sourceProposalId: proposal.id,
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

export { applyCreateRuleProposal };