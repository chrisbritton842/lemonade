import {
    ProposalStatus,
    ProposalThreshold,
    ProposalType,
} from "@/generated/prisma/enums";

type EvaluateProposalVoteInput = {
    eligibleMemberCount: number;
    yesVotes: number;
    noVotes: number;
    abstainVotes: number;
    threshold: ProposalThreshold;
    type: ProposalType;
};

const reviewRequiredTypes = new Set<ProposalType>([
    ProposalType.UPDATE_LOGO,
    ProposalType.HIRE_APPLICANT,
    ProposalType.REMOVE_MEMBER,
    ProposalType.DELETE_RULE,
    ProposalType.DELETE_PRODUCT,
]);

const getPassedStatus = (type: ProposalType) => {
    return reviewRequiredTypes.has(type)
        ? ProposalStatus.NEEDS_REVIEW
        : ProposalStatus.PASSED
};

const getRequiredYesVotes = ({
    eligibleMemberCount,
    threshold,
}: {
    eligibleMemberCount: number;
    threshold: ProposalThreshold;
}) => {
    if (threshold === ProposalThreshold.TWO_THIRDS) {
        return Math.ceil((eligibleMemberCount * 2) / 3);
    }

    return Math.floor(eligibleMemberCount / 2) + 1;
};

const evaluateProposalVote = ({
    eligibleMemberCount,
    yesVotes,
    noVotes,
    abstainVotes,
    threshold,
    type,
}: EvaluateProposalVoteInput) => {
    const requiredYesVotes = getRequiredYesVotes({
        eligibleMemberCount,
        threshold,
    });

    const totalVotes = yesVotes + noVotes + abstainVotes;

    const remainingVotes = Math.max(eligibleMemberCount - totalVotes, 0);

    const hasEnoughYesVotes = yesVotes >= requiredYesVotes;

    const cannotReachEnoughYesVotes =
        yesVotes + remainingVotes < requiredYesVotes;

    if (hasEnoughYesVotes) {
        return getPassedStatus(type);
    }

    if (cannotReachEnoughYesVotes) {
        return ProposalStatus.FAILED;
    }

    return ProposalStatus.OPEN;
};

export { evaluateProposalVote, getRequiredYesVotes };