import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
import { CoopRole, TaskStatus } from "@/generated/prisma/enums";

type TransactionClient = Prisma.TransactionClient;

const isValidDateOnly = (value: string) => {
    const [year, month, day] = value.split("-").map(Number);

    if (!year || !month || !day) {
        return false;
    }

    const date = new Date(Date.UTC(year, month - 1, day));

    return (
        date.getUTCFullYear() === year &&
        date.getUTCMonth() === month - 1 &&
        date.getUTCDate() === day
    );
};

const createTaskPayloadSchema = z.object({
    taskTitle: z
        .string()
        .trim()
        .min(2)
        .max(80),
    taskDescription: z
        .string()
        .trim()
        .max(300)
        .nullable()
        .optional(),
    role: z
        .nativeEnum(CoopRole)
        .nullable()
        .optional(),
    points: z
        .number()
        .int()
        .min(1)
        .max(3),
    dueDate: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/)
        .refine(isValidDateOnly)
        .nullable()
        .optional(),
});

type CreateTaskProposal = {
    id: string;
    coopId: string;
    payload: Prisma.JsonValue | null;
    appliedAt: Date | null;
};

const parseDueDate = (dueDate: string | null | undefined) => {
    if (!dueDate) {
        return null;
    }

    const [year, month, day] = dueDate.split("-").map(Number);

    return new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
};

const applyCreateTaskProposal = async ({
    tx,
    proposal,
}: {
    tx: TransactionClient;
    proposal: CreateTaskProposal;
}) => {
    if (proposal.appliedAt) {
        return;
    }

    const existingTask = await tx.task.findUnique({
        where: {
            sourceProposalId: proposal.id,
        },
    });

    if (existingTask) {
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

    const payload = createTaskPayloadSchema.parse(proposal.payload);

    await tx.task.create({
        data: {
            coopId: proposal.coopId,
            title: payload.taskTitle,
            description: payload.taskDescription || null,
            role: payload.role || null,
            points: payload.points,
            dueDate: parseDueDate(payload.dueDate),
            status: TaskStatus.AVAILABLE,
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

export { applyCreateTaskProposal };

