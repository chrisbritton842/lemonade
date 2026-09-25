import type { CoopRole } from "@/generated/prisma/enums";

export type JobOpeningApplicationTarget = {
    id: string;
    title: string;
    role: CoopRole;
};

export type BusinessCardJobOpening = JobOpeningApplicationTarget;

export type BusinessCardCoop = {
    id: string;
    name: string;
    description: string | null;
    memberCount: number;
    taskCount: number;
    eventCount: number;
    jobOpenings: BusinessCardJobOpening[];
    isMember: boolean;
};

export type BusinessPageJobOpening = JobOpeningApplicationTarget & {
    description: string | null;
};