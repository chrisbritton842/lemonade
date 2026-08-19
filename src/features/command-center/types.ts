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

export type CommandCenterTaskStatus = "AVAILABLE" | "ASSIGNED" | "NEEDS_REVIEW" | "COMPLETE" | "CANCELLED";

export type CommandCenterRoleName = "MEMBER" | "BOARD_OF_DIRECTORS" | "PRODUCTION" | "CUSTOMER_SERVICE" | "INVENTORY" | "MARKETING" | "ACCOUNTING";

export type CommandCenterTask = {
    id: string;
    title: string;
    description: string | null;
    role: CommandCenterRoleName | null;
    points: number;
    status: CommandCenterTaskStatus;
    dueDateLabel: string | null;
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

export type CommandCenterVoteChoice = "YES" | "NO" | "ABSTAIN";

export type CommandCenterProposalStatus =
    | "OPEN"
    | "PASSED"
    | "FAILED"
    | "NEEDS_REVIEW"
    | "APPROVED"
    | "REJECTED"
    | "CANCELLED";

export type CommandCenterProposalType =
    | "GENERAL"
    | "UPDATE_SALES_DAY_TIME"
    | "UPDATE_SALES_DAY_LOCATION"
    | "CREATE_TASK"
    | "CREATE_PRODUCT"
    | "UPDATE_PRODUCT"
    | "DELETE_PRODUCT"
    | "CREATE_RULE"
    | "UPDATE_RULE"
    | "DELETE_RULE"
    | "UPDATE_NAME"
    | "UPDATE_LOGO"
    | "HIRE_MEMBER"
    | "REMOVE_MEMBER";

export type CommandCenterProposal = {
    id: string;
    title: string;
    description: string | null;
    type: CommandCenterProposalType;
    status: CommandCenterProposalStatus;
    createdByName: string;
    createdAtLabel: string;
    yesVotes: number;
    noVotes: number;
    abstainVotes: number;
    currentUserVote: CommandCenterVoteChoice | null;
};