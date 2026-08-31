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

export type CreateJobOpeningProposalState = {
    success: boolean;
    errors: {
        jobTitle?: string[];
        jobDescription?: string[];
        role?: string[];
        reason?: string[];
        general?: string[];
    };
};

const schema = z.object({
    coopId: z.string().min(1),
    jobTitle: z
        .string()
        .trim()
        .min(2, "Job post title must be at least 2 characters.")
        .max(80, "Job post title must be 80 characters or less."),
    jobDescription: z
        .string()
        .trim()
        .max(500, "Job description must be 500 characters or less.")
        .optional(),
    role: z
        .string()
        .min(1, "Choose a role for this job opening.")
        .pipe(z.nativeEnum(CoopRole)),
    reason: z
        .string()
        .trim()
        .max(500, "Reason must be 500 characters or less.")
        .optional(),
});

const createJobOpeningProposalAction = async (
    _prevState: CreateJobOpeningProposalState,
    formData: FormData
): Promise<CreateJobOpeningProposalState> => {
    const user = await getCurrentUser();

    if (!user) {
        redirect(signInPagePath());
    }

    const parsed = schema.safeParse({
        coopId: formData.get("coopId"),
        jobTitle: formData.get("jobTitle"),
        jobDescription: formData.get("jobDescription"),
        role: formData.get("role"),
        reason: formData.get("reason"),
    });

    if (!parsed.success) {
        return {
            success: false,
            errors: parsed.error.flatten().fieldErrors,
        };
    }

    const { coopId, jobTitle, jobDescription, role, reason } = parsed.data;

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
                general: ["You do not work for this business."]
            },
        };
    }

    await prisma.proposal.create({
        data: {
            coopId,
            createdById: user.user.id,
            title: `Create job opening: ${jobTitle}`,
            description:
                reason ||
                jobDescription ||
                "A member proposed creating a new job opening.",
            type: ProposalType.CREATE_JOB_OPENING,
            status: ProposalStatus.OPEN,
            threshold: ProposalThreshold.TWO_THIRDS,
            payload: {
                jobTitle,
                jobDescription: jobDescription || null,
                role,
            },
        },
    });

    revalidatePath(commandCenterPagePath(coopId));

    return {
        success: true,
        errors: {},
    };
};

export { createJobOpeningProposalAction };