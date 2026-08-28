import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";

type TransactionClient = Prisma.TransactionClient;

const createProductPayloadSchema = z.object({
    productName: z
        .string()
        .trim()
        .min(2)
        .max(80),
    productDescription: z
        .string()
        .trim()
        .max(300)
        .nullable()
        .optional(),
    priceCents: z
        .number()
        .int()
        .min(1)
        .max(100_000),
});

type CreateProductProposal = {
    id: string;
    coopId: string;
    payload: Prisma.JsonValue | null;
    appliedAt: Date | null;
};

const applyCreateProductProposal = async ({
    tx,
    proposal,
}: {
    tx: TransactionClient;
    proposal: CreateProductProposal;
}) => {
    if (proposal.appliedAt) {
        return;
    }

    const existingProduct = await tx.product.findUnique({
        where: {
            sourceProposalId: proposal.id,
        },
    });

    if (existingProduct) {
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

    const payload = createProductPayloadSchema.parse(proposal.payload);

    await tx.product.create({
        data: {
            coopId: proposal.coopId,
            name: payload.productName,
            description: payload.productDescription || null,
            priceCents: payload.priceCents,
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

export { applyCreateProductProposal };