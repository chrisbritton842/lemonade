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

export type CommandCenterEventType =
    | "SALES_DAY"
    | "MEETING"
    | "SUPPLY_RUN"
    | "PREP_WORK"
    | "BOARD_MEETING"
    | "MARKETING_OUTREACH"
    | "OTHER";

export type CommandCenterEventStatus =
    | "PROPOSED"
    | "CONFIRMED"
    | "NEEDS_APPROVAL"
    | "CANCELLED";

export type CommandCenterCalendarEvent = {
    id: string;
    title: string;
    description: string | null;
    location: string | null;
    type: CommandCenterEventType;
    status: CommandCenterEventStatus;
    dateKey: string;
    dateLabel: string;
    timeLabel: string;
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
    description: string | null;
    priceCents: number;
    isActive: boolean;
};

export type CommandCenterRule = {
    id: string;
    text: string;
    isActive: boolean;
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
    | "CREATE_EVENT"
    | "UPDATE_EVENT"
    | "CREATE_TASK"
    | "CREATE_PRODUCT"
    | "UPDATE_PRODUCT"
    | "DELETE_PRODUCT"
    | "CREATE_RULE"
    | "UPDATE_RULE"
    | "DELETE_RULE"
    | "UPDATE_NAME"
    | "UPDATE_LOGO"
    | "CREATE_JOB_OPENING"
    | "HIRE_APPLICANT"
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

export type CommandCenterChatMessage = {
    id: string;
    content: string;
    authorName: string;
    createdAtLabel: string;
};