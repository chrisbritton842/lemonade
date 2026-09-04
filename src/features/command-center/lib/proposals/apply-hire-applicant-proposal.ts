import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
import {
    JobApplicationStatus,
    JobOpeningStatus,
    ProposalStatus,
    ProposalType,
} from "@/generated/prisma/enums";

type TransactionClient = Prisma.TransactionClient;

const hireApplicantPayloadSchema = z.object({
    applicationId: z.string().min(1),
    jobOpeningId: z.string().min(1),
    applicantId: z.string().min(1),
});

type HireApplicantProposal = {
    id: string;
    coopId: string;
    type: ProposalType;
    status: ProposalStatus;
    payload: Prisma.JsonValue | null;
    appliedAt: Date | null;
};

const applyHireApplicantProposal = async ({
    tx,
    proposal,
}: {
    tx: TransactionClient;
    proposal: HireApplicantProposal;
}) => {
    if (proposal.type !== ProposalType.HIRE_APPLICANT) {
        throw new Error("This is not a hire applicant proposal.");
    }

    if (proposal.status !== ProposalStatus.NEEDS_REVIEW) {
        throw new Error("This hire proposal is not ready for board review.");
    }

    if (proposal.appliedAt) {
        return;
    }

    const payload = hireApplicantPayloadSchema.parse(proposal.payload);

    const application = await tx.jobApplication.findFirst({
        where: {
            id: payload.applicationId,
            jobOpeningId: payload.jobOpeningId,
            applicantId: payload.applicantId,
            hireProposalId: proposal.id,
            jobOpening: {
                coopId: proposal.coopId,
            },
        },
        include: {
            jobOpening: {
                select: {
                    id: true,
                    role: true,
                    status: true,
                },
            },
        },
    });

    if (!application) {
        throw new Error("Could not find the job application for this proposal.");
    }

    if (application.jobOpening.status !== JobOpeningStatus.OPEN) {
        throw new Error("This job opening is no longer open.");
    }

    let membership = await tx.membership.findUnique({
        where: {
            userId_coopId: {
                userId: application.applicantId,
                coopId: proposal.coopId,
            },
        },
    });

    if (!membership) {
        membership = await tx.membership.create({
            data: {
                userId: application.applicantId,
                coopId: proposal.coopId,
            },
        });
    }

    await tx.membershipRole.upsert({
        where: {
            membershipId_role: {
                membershipId: membership.id,
                role: application.jobOpening.role,
            },
        },
        update: {},
        create: {
            membershipId: membership.id,
            role: application.jobOpening.role,
        },
    });

    await tx.jobApplication.update({
        where: {
            id: application.id,
        },
        data: {
            status: JobApplicationStatus.HIRED,
        },
    });

    await tx.jobOpening.update({
        where: {
            id: application.jobOpeningId,
        },
        data: {
            status: JobOpeningStatus.FILLED,
        },
    });

    const otherApplications = await tx.jobApplication.findMany({
        where: {
            jobOpeningId: application.jobOpeningId,
            id: {
                not: application.id,
            },
            status: JobApplicationStatus.PENDING,
            hireProposalId: {
                not: null,
            },
        },
        select: {
            id: true,
            hireProposalId: true,
        },
    });

    if (otherApplications.length > 0) {
        await tx.jobApplication.updateMany({
            where: {
                id: {
                    in: otherApplications.map((otherApplication) => otherApplication.id),
                },
            },
            data: {
                status: JobApplicationStatus.REJECTED,
            },
        });

        await tx.proposal.updateMany({
            where: {
                id: {
                    in: otherApplications
                        .map((otherApplication) => otherApplication.hireProposalId)
                        .filter(Boolean) as string[],
                },
                type: ProposalType.HIRE_APPLICANT,
                status: {
                    in: [ProposalStatus.OPEN, ProposalStatus.NEEDS_REVIEW],
                },
            },
            data: {
                status: ProposalStatus.CANCELLED,
            },
        });
    }

    await tx.proposal.update({
        where: {
            id: proposal.id,
        },
        data: {
            status: ProposalStatus.APPROVED,
            appliedAt: new Date(),
        },
    });
};

export { applyHireApplicantProposal };