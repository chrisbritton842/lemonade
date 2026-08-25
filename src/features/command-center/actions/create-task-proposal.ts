"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import {
    CoopRole,
    ProposalStatus,
    ProposalThreshold,
    ProposalType,
} from "@/generated/prisma/enums";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { prisma } from "@/lib/prisma";
import { commandCenterPagePath, signInPagePath } from "@/paths";

export type CreateTaskProposalState = {
    success: boolean;
    errors: {
        taskTitle?: string[];
        taskDescription?: string[];
        role?: string[];
        points?: string[];
        dueDate?: string[];
        reason?: string[];
        general?: string[];
    };
};

const schema = z.object({
    coopId: z.string().min(1),
    taskTitle: z
        .string()
        .trim()
        .min(2, "Task title must be at least 2 characters.")
        .max(80, "Task title must be 80 characters or less."),
    taskDescription: z
        .string()
        .trim()
        .max(300, "Task description must be 300 characters or less.")
        .optional(),
    role: z
        .string()
        .optional()
        .transform((value) => (value === "" ? undefined : value))
        .pipe(z.nativeEnum(CoopRole).optional()),
    points: z.coerce
        .number()
        .int("Points must be a whole number.")
        .min(1, "Points must be at least 1.")
        .max(3, "Points cannot be more than 3."),
    dueDate: z
        .string()
        .optional()
        .transform((value) => (value === "" ? undefined : value)),
    reason: z
        .string()
        .trim()
        .max(500, "Reason must be 500 characters or less.")
        .optional(),
});

const createTaskProposalAction = async (
    _prevState: CreateTaskProposalState,
    formData: FormData
) : Promise<CreateTaskProposalState> => {
    const user = await getCurrentUser();

    if (!user) {
        redirect(signInPagePath());
    }

    const parsed = schema.safeParse({
        coopId: formData.get("coopId"),
        taskTitle: formData.get("taskTitle"),
        taskDescription: formData.get("taskDescription"),
        role: formData.get("role"),
        points: formData.get("points"),
        dueDate: formData.get("dueDate"),
        reason: formData.get("reason"),
    });

    if (!parsed.success) {
        return {
            success: false,
            errors: parsed.error.flatten().fieldErrors,
        };
    }

    const {
        coopId,
        taskTitle,
        taskDescription,
        role,
        points,
        dueDate,
        reason,
    } = parsed.data;

    const membership = await prisma.membership.findUnique({
        where: {
            userId_coopId: {
                userId: user.user.id,
                coopId,
            },
        },
    });

    if (!membership) {
        return {
            success: false,
            errors: {
                general: ["You do not work for this business."],
            },
        };
    }

    await prisma.proposal.create({
        data: {
            coopId,
            createdById: user.user.id,
            title: `Create task: ${taskTitle}`,
            description:
                reason ||
                taskDescription ||
                "A member proposed creating a new task.",
            type: ProposalType.CREATE_TASK,
            status: ProposalStatus.OPEN,
            threshold: ProposalThreshold.SIMPLE_MAJORITY,
            payload: {
                taskTitle,
                taskDescription: taskDescription || null,
                role: role || null,
                points,
                dueDate: dueDate || null,
            },
        },
    });

    revalidatePath(commandCenterPagePath(coopId));

    return {
        success: true,
        errors: {},
    };
};

export { createTaskProposalAction };