"use client";

import {
    Button,
    Dialog,
    Heading,
    Portal,
    Stack,
    Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { CommandCenterProposalType } from "@/features/command-center/types";
import { CreateEventProposalForm } from "./forms/create-event-proposal-form";
import { CreateJobOpeningProposalForm } from "./forms/create-job-opening-proposal-form";
import { CreateProductProposalForm } from "./forms/create-product-proposal-form";
import { CreateTaskProposalForm } from "./forms/create-task-proposal-form";
import { GeneralProposalForm } from "./forms/general-proposal-form";
import { ProposalTypePicker } from "./proposal-type-picker";

type NewProposalDialogProps = {
    coopId: string;
};

const NewProposalDialog = ({ coopId }: NewProposalDialogProps) => {
    const [open, setOpen] = useState(false);
    const [selectedType, setSelectedType] =
        useState<CommandCenterProposalType | null>(null);

    const resetDialog = () => {
        setSelectedType(null);
    };

    const closeDialog = () => {
        setOpen(false);
        resetDialog();
    };

    return (
        <Dialog.Root
            open={open}
            onOpenChange={(details) => {
                setOpen(details.open);

                if (!details.open) {
                    resetDialog();
                }
            }}
            size="lg"
            placement="center"
        >
            <Dialog.Trigger asChild>
                <Button colorPalette="yellow" size="sm">
                    New Proposal
                </Button>
            </Dialog.Trigger>

            <Portal>
                <Dialog.Backdrop />

                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Stack gap={1}>
                                <Dialog.Title asChild>
                                    <Heading size="md">
                                        {selectedType
                                            ? "Create Proposal"
                                            : "Select Proposal Type"}
                                    </Heading>
                                </Dialog.Title>

                                <Text color="gray.600" fontSize="sm">
                                    {selectedType
                                        ? "Fill out the form below to create a new proposal."
                                        : "Select the type of proposal you want to create."}
                                </Text>
                            </Stack>
                        </Dialog.Header>

                        <Dialog.Body>
                            {!selectedType && (
                                <ProposalTypePicker
                                    onSelectType={setSelectedType}
                                />
                            )}

                            {selectedType === "GENERAL" && (
                                <GeneralProposalForm
                                    coopId={coopId}
                                    onBack={() => setSelectedType(null)}
                                    onSuccess={closeDialog}
                                />
                            )}

                            {selectedType === "CREATE_TASK" && (
                                <CreateTaskProposalForm
                                    coopId={coopId}
                                    onBack={() => setSelectedType(null)}
                                    onSuccess={closeDialog}
                                />
                            )}

                            {selectedType === "CREATE_PRODUCT" && (
                                <CreateProductProposalForm
                                    coopId={coopId}
                                    onBack={() => setSelectedType(null)}
                                    onSuccess={closeDialog}
                                />
                            )}

                            {selectedType === "CREATE_JOB_OPENING" && (
                                <CreateJobOpeningProposalForm
                                    coopId={coopId}
                                    onBack={() => setSelectedType(null)}
                                    onSuccess={closeDialog}
                                />
                            )}

                            {selectedType === "CREATE_EVENT" && (
                                <CreateEventProposalForm
                                    coopId={coopId}
                                    onBack={() => setSelectedType(null)}
                                    onSuccess={closeDialog}
                                />
                            )}
                        </Dialog.Body>

                        <Dialog.CloseTrigger />
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
};

export { NewProposalDialog };