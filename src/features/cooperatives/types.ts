import type { CoopRole } from "@/generated/prisma/enums";

export type BusinessCardJobOpening = {
    id: string;
    title: string;
    role: CoopRole;
};

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

export type BusinessPageJobOpening = {
    id: string;
    title: string;
    description: string | null;
    role: CoopRole;
};