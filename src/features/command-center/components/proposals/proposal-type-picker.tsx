"use client";

import { Button, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import { CommandCenterProposalType } from "@/features/command-center/types";

type ProposalTypePickerProps = {
    onSelectType: (type: CommandCenterProposalType) => void;
};

const proposalTypes: {
    type: CommandCenterProposalType;
    label: string;
    description: string;
}[] = [
    {
        type: "GENERAL",
        label: "General Proposal",
        description: "Propose a new idea for the business."
    },
    {
        type: "CREATE_TASK",
        label: "Create Task",
        description: "Propose a new task."
    },
    {
        type: "CREATE_PRODUCT",
        label: "Create New Product",
        description: "Propose a new product to sell."
    },
    {
        type: "CREATE_EVENT",
        label: "Create Event",
        description: "Propose a sales day, meeting, supply run, or other event.",
    },
    {
        type: "UPDATE_EVENT",
        label: "Change Event Details",
        description: "Propose changes to an event."
    },
    {
        type: "UPDATE_NAME",
        label: "Change Business Name",
        description: "Propose a change to the business name."
    },
    {
        type: "CREATE_JOB_OPENING",
        label: "Create Job Opening",
        description: "Propose a new job opening."
    }
];

const ProposalTypePicker = ({ onSelectType }: ProposalTypePickerProps) => {
    return (
        <SimpleGrid columns={{ base: 1, sm: 2 }} gap={3}>
            {proposalTypes.map((proposalType) => (
                <Button
                    key={proposalType.type}
                    type="button"
                    variant="outline"
                    justifyContent="start"
                    h="auto"
                    py={4}
                    whiteSpace="normal"
                    onClick={() => onSelectType(proposalType.type)}
                >
                    <Stack gap={1} align="start">
                        <Text fontWeight="semibold">{proposalType.label}</Text>
                        <Text fontSize="xs" color="gray.600" textAlign="left">
                            {proposalType.description}
                        </Text>
                    </Stack>
                </Button>
            ))}
        </SimpleGrid>
    );
};

export { ProposalTypePicker };