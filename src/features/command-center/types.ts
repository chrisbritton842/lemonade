export type CommandCenterRole = {
    role: string;
};

export type CommandCenterCoop = {
    id: string;
    name: string;
    description: string | null;
};

export type CommandCenterMembership = {
    roles: CommandCenterRole[];
}

export type CommandCenterEvent = {
    id: string;
    title: string;
    startsAtLabel: string;
    location?: string | null;
    status?: "CONFIRMED" | "PROPOSED" | "NEEDS_APPROVAL" | "CANCELLED";
};

export type CommandCenterTask = {
    id: string;
    title: string;
    role: string;
    status?: string;
};

export type CommandCenterProposal = {
    id: string;
    title: string;
    status: string;
};

export type CommandCenterProduct = {
    id: string;
    name: string;
    priceCents: number;
};

export type CommandCenterRule = {
    id: string;
    title: string;
    description: string;
};

export type CommandCenterMessage = {
    id: string;
    authorName: string;
    body: string;
    createdAtLabel: string;
};