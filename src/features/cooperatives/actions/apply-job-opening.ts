"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import {
    JobApplicationStatus,
    JobOpeningStatus,
    ProposalStatus,
    ProposalThreshold,
    ProposalType,
} from "@/generated/prisma/enums";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { prisma } from "@/lib/prisma";
import { businessesPagePath, signInPagePath } from "@/paths";

export type ApplyJobOpeningState = {
    success: boolean;
    errors: {
        jobOpeningId?: string[];
        response?: string[];
        general?: string[];
    };
};

const schema = z.object({
    coopId: z.string().min(1),
    jobOpeningId: z.string().min(1, "Choose a job opening."),
    response: z
        .string()
        .trim()
        .min(10, "Response must be at least 10 characters long.")
        .max(1000, "Response must be at most 1000 characters long."),
});

const applyJobOpeningAction = async (
    _prevState: ApplyJobOpeningState,
    formData: FormData
): Promise<ApplyJobOpeningState> => {
    const user = await getCurrentUser();

    if (!user) {
        redirect(signInPagePath());
    }

    const parsed = schema.safeParse({
        coopId: formData.get("coopId"),
        jobOpeningId: formData.get("jobOpeningId"),
        response: formData.get("response"),
    });

    if (!parsed.success) {
        return {
            success: false,
            errors: parsed.error.flatten().fieldErrors,
        };
    }

    const { coopId, jobOpeningId, response } = parsed.data;

    try {
        await prisma.$transaction(async (tx) => {
            const existingMembership = await tx.membership.findUnique({
                where: {
                    userId_coopId: {
                        userId: user.user.id,
                        coopId,
                    },
                },
            });

            if (existingMembership) {
                throw new Error("You already work for this business.");
            }

            const jobOpening = await tx.jobOpening.findFirst({
                where: {
                    id: jobOpeningId,
                    coopId,
                    status: JobOpeningStatus.OPEN,
                },
                select: {
                    id: true,
                    title: true,
                    role: true,
                },
            });

            if (!jobOpening) {
                throw new Error("This job opening is no longer available.");
            }

            const existingApplication = await tx.jobApplication.findUnique({
                where: {
                    jobOpeningId_applicantId: {
                        jobOpeningId,
                        applicantId: user.user.id,
                    },
                },
            });

            if (existingApplication) {
                throw new Error("You have already applied for this job opening.");
            }

            const application = await tx.jobApplication.create({
                data: {
                    jobOpeningId,
                    applicantId: user.user.id,
                    response,
                    status: JobApplicationStatus.PENDING,
                },
            });

            const proposal = await tx.proposal.create({
                data: {
                    coopId,
                    createdById: user.user.id,
                    title: `Hire applicant for ${jobOpening.role}`,
                    description: response,
                    type: ProposalType.HIRE_APPLICANT,
                    status: ProposalStatus.OPEN,
                    threshold: ProposalThreshold.TWO_THIRDS,
                    payload: {
                        applicationId: application.id,
                        jobOpeningId: jobOpening.id,
                        applicantId: user.user.id,
                        role: jobOpening.role,
                        response,
                    },
                },
            });

            await tx.jobApplication.update({
                where: {
                    id: application.id,
                },
                data: {
                    hireProposalId: proposal.id,
                },
            });
        });
    } catch (error) {
        return {
            success: false,
            errors: {
                general: [error instanceof Error ? error.message : "An unknown error occurred."],
            },
        };
    }

    revalidatePath(businessesPagePath());

    return {
        success: true,
        errors: {},
    };
};

export { applyJobOpeningAction };