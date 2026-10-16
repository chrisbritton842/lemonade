import {
    Badge,
    Button,
    Card,
    Heading,
    HStack,
    Stack,
    Text,
} from "@chakra-ui/react";
import { approveHireApplicantProposalAction } from "@/features/command-center/actions/approve-hire-applicant-proposal";
import { voteOnProposalAction } from "@/features/command-center/actions/vote-on-proposal";
import type {
    CommandCenterEditableEvent,
    CommandCenterProposal,
    CommandCenterVoteChoice,
} from "@/features/command-center/types";
import { NewProposalDialog } from "./proposals/new-proposal-dialog";

type ProposalsPanelProps = {
    coopId: string;
    coopName: string;
    coopDescription: string | null;
    proposals: CommandCenterProposal[];
    editableEvents: CommandCenterEditableEvent[];
    currentUserIsBoardMember: boolean;
};

const proposalTypeLabels: Record<string, string> = {
    GENERAL: "Propose Idea",
    CREATE_EVENT: "Create Event",
    UPDATE_EVENT: "Update Event",
    CREATE_TASK: "Create Task",
    CREATE_PRODUCT: "Add New Product",
    UPDATE_PRODUCT: "Update Product",
    DELETE_PRODUCT: "Remove Product",
    CREATE_RULE: "Add New Rule",
    UPDATE_RULE: "Update Rule",
    DELETE_RULE: "Remove Rule",
    UPDATE_BUSINESS: "Update Business",
    UPDATE_LOGO: "Change Logo",
    CREATE_JOB_OPENING: "Create Job Opening",
    HIRE_APPLICANT: "Hire New Member",
    REMOVE_MEMBER: "Remove Member",
};

const proposalStatusLabels: Record<string, string> = {
    OPEN: "Open",
    PASSED: "Passed",
    FAILED: "Failed",
    NEEDS_REVIEW: "Needs Review",
    APPROVED: "Approved",
    REJECTED: "Rejected",
    CANCELLED: "Cancelled",
};

const ProposalsPanel = ({ coopId, coopName, coopDescription, proposals, editableEvents, currentUserIsBoardMember }: ProposalsPanelProps) => {
    const openProposals = proposals.filter(
        (proposal) => proposal.status === "OPEN"
    );

    const closedProposals = proposals.filter(
        (proposal) => proposal.status !== "OPEN"
    );

    return (
        <Card.Root bg="app.surface" borderColor="app.border">
            <Card.Body>
                <Stack gap={5}>
                    <HStack justify="space-between" align="start" gap={4} wrap="wrap">
                        <Stack gap={1}>
                            <Heading size="md" color="app.text">Proposals</Heading>
                            <Text color="app.mutedText" fontSize="sm">
                                Proposals are ideas that members can vote on to
                                make decisions for the business.
                            </Text>
                        </Stack>

                        <NewProposalDialog coopId={coopId} editableEvents={editableEvents} currentBusinessName={coopName} currentBusinessDescription={coopDescription}/>
                    </HStack>

                    {proposals.length === 0 && (
                        <Text color="app.mutedText" fontSize="sm">
                            There are no proposals yet.
                        </Text>
                    )}

                    {openProposals.length > 0 && (
                        <Stack gap={3}>
                            <Heading size="sm" color="app.text">Open Proposals</Heading>

                            {openProposals.map((proposal) => (
                                <ProposalCard
                                    key={proposal.id}
                                    coopId={coopId}
                                    proposal={proposal}
                                    currentUserIsBoardMember={currentUserIsBoardMember}
                                />
                            ))}
                        </Stack>
                    )}

                    {closedProposals.length > 0 && (
                        <Stack gap={3}>
                            <Heading size="sm" color="app.text">Closed Proposals</Heading>

                            {closedProposals.map((proposal) => (
                                <ProposalCard
                                    key={proposal.id}
                                    coopId={coopId}
                                    proposal={proposal}
                                    currentUserIsBoardMember={currentUserIsBoardMember}
                                />
                            ))}
                        </Stack>
                    )}
                </Stack>
            </Card.Body>
        </Card.Root>
    );
};

type ProposalCardProps = {
    coopId: string;
    proposal: CommandCenterProposal;
    currentUserIsBoardMember: boolean;
};

const ProposalCard = ({ coopId, proposal, currentUserIsBoardMember }: ProposalCardProps) => {
    const isOpen = proposal.status === "OPEN";

    const canApproveHireApplicant =
        currentUserIsBoardMember &&
        proposal.type === "HIRE_APPLICANT" &&
        proposal.status === "NEEDS_REVIEW";

    return (
        <Card.Root
            bg="app.subtleSurface"
            borderColor="app.border"
        >
            <Card.Body>
                <Stack gap={4}>
                    <HStack justify="space-between" align="start" gap={3} wrap="wrap">
                        <Stack gap={1} minW={0}>
                            <HStack gap={2} wrap="wrap">
                                <Text fontWeight="semibold" color="app.text">{proposal.title}</Text>

                                <Badge colorPalette="brand" variant="subtle">
                                    {proposalTypeLabels[proposal.type] ?? proposal.type}
                                </Badge>

                                <Badge variant="outline" color="app.mutedText" borderColor="app.border">
                                    {proposalStatusLabels[proposal.status] ?? proposal.status}
                                </Badge>
                            </HStack>

                            <Text color="app.mutedText" fontSize="sm">
                                {proposal.description}
                            </Text>

                            <Text color="app.mutedText" fontSize="xs">
                                Proposed by {proposal.createdByName} on {proposal.createdAtLabel}
                            </Text>
                        </Stack>
                    </HStack>

                    <HStack gap={3} wrap="wrap">
                        <Badge colorPalette="brand" variant="subtle">Yes: {proposal.yesVotes}</Badge>
                        <Badge colorPalette="indigo" variant="subtle">No: {proposal.noVotes}</Badge>
                        <Badge bg="slate.100" color="slate.700">Abstain: {proposal.abstainVotes}</Badge>
                    </HStack>

                    {proposal.currentUserVote && (
                        <Text color="app.mutedText" fontSize="sm">
                            Your vote: {formatVoteChoice(proposal.currentUserVote)}
                        </Text>
                    )}

                    {isOpen && (
                        <HStack gap={2} wrap="wrap">
                            <VoteButton
                                coopId={coopId}
                                proposalId={proposal.id}
                                choice="YES"
                                label="Yes"
                            />
                            <VoteButton
                                coopId={coopId}
                                proposalId={proposal.id}
                                choice="NO"
                                label="No"
                            />
                            <VoteButton
                                coopId={coopId}
                                proposalId={proposal.id}
                                choice="ABSTAIN"
                                label="Abstain"
                            />
                        </HStack>
                    )}

                    {canApproveHireApplicant && (
                        <form action={approveHireApplicantProposalAction}>
                            <input type="hidden" name="coopId" value={coopId} />
                            <input type="hidden" name="proposalId" value={proposal.id} />

                            <Button type="submit" colorPalette="brand" size="sm">
                                Approve Hire
                            </Button>
                        </form>
                    )}
                </Stack>
            </Card.Body>
        </Card.Root>
    );
};

type VoteButtonProps = {
    coopId: string;
    proposalId: string;
    choice: CommandCenterVoteChoice;
    label: string;
};

const VoteButton = ({ coopId, proposalId, choice, label }: VoteButtonProps) => {
    return (
        <form action={voteOnProposalAction}>
            <input type="hidden" name="coopId" value={coopId} />
            <input type="hidden" name="proposalId" value={proposalId} />
            <input type="hidden" name="choice" value={choice} />
            <Button type="submit" size="sm" variant="outline" colorPalette="brand">
                {label}
            </Button>
        </form>
    );
};

const formatVoteChoice = (choice: CommandCenterVoteChoice) => {
    switch (choice) {
        case "YES":
            return "Yes";
        case "NO":
            return "No";
        case "ABSTAIN":
            return "Abstain";
        default:
            return choice;
    }
};

export { ProposalsPanel };