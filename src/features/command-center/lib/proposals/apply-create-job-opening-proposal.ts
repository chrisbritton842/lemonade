import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
import { CoopRole, JobOpeningStatus } from "@/generated/prisma/enums";

type TransactionClient = Prisma.TransactionClient;

const createJobOpeningPayloadSchema = z.object({
    jobTitle: z
        .string()
        .trim()
        .min(2)
        .max(80),
    jobDescription: z
        .string()
        .trim()
        .max(500)
        .nullable()
        .optional(),
    role: z.nativeEnum(CoopRole),
});

type CreateJobOpeningProposal = {
    id: string;
    coopId: string;
    payload: Prisma.JsonValue | null;
    appliedAt: Date | null;
};

const applyCreateJobOpeningProposal = async ({
    tx,
    proposal,
}: {
    tx: TransactionClient;
    proposal: CreateJobOpeningProposal;
}) => {
    if (proposal.appliedAt) {
        return;
    }

    const existingJobOpening = await tx.jobOpening.findUnique({
        where: {
            sourceProposalId: proposal.id,
        },
    });

    if (existingJobOpening) {
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

    const payload = createJobOpeningPayloadSchema.parse(proposal.payload);

    await tx.jobOpening.create({
        data: {
            coopId: proposal.coopId,
            title: payload.jobTitle,
            description: payload.jobDescription || null,
            role: payload.role,
            status: JobOpeningStatus.OPEN,
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

export { applyCreateJobOpeningProposal };