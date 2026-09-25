"use client";

import {
    Button,
    Dialog,
    Field,
    HStack,
    Portal,
    Stack,
    Text,
    Textarea,
} from "@chakra-ui/react";
import { useActionState, useEffect } from "react";
import {
    applyJobOpeningAction,
    type ApplyJobOpeningState,
} from "@/features/cooperatives/actions/apply-job-opening";
import { roleLabels } from "@/features/cooperatives/lib/role-labels";
import type { JobOpeningApplicationTarget } from "@/features/cooperatives/types";

type ApplyJobOpeningDialogProps = {
    coopId: string;
    coopName: string;
    jobOpening: JobOpeningApplicationTarget | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

const initialState: ApplyJobOpeningState = {
    success: false,
    errors: {},
};

const ApplyJobOpeningDialog = ({
    coopId,
    coopName,
    jobOpening,
    open,
    onOpenChange,
}: ApplyJobOpeningDialogProps) => {
    const [state, action, pending] = useActionState(applyJobOpeningAction, initialState);

    useEffect(() => {
        if (state.success) {
            onOpenChange(false);
        }
    }, [state.success, onOpenChange]);

    return (
        <Dialog.Root
            open={open}
            onOpenChange={(details) => onOpenChange(details.open)}
            placement="center"
            size="md"
        >
            <Portal>
                <Dialog.Backdrop />

                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Stack gap={1}>
                                <Dialog.Title>Apply for This Job</Dialog.Title>

                                <Text color="gray.600" fontSize="sm">
                                    Apply to join {coopName}.
                                </Text>
                            </Stack>
                        </Dialog.Header>

                        <Dialog.Body>
                            {jobOpening && (
                                <form action={action}>
                                    <Stack gap={5}>
                                        {state.errors.general?.[0] && (
                                            <Text color="red.600" fontSize="sm">
                                                {state.errors.general[0]}
                                            </Text>
                                        )}

                                        <input type="hidden" name="coopId" value={coopId} />
                                        <input type="hidden" name="jobOpeningId" value={jobOpening.id} />

                                        <Stack gap={1}>
                                            <Text fontWeight="semibold">
                                                {roleLabels[jobOpening.role]}
                                            </Text>

                                            <Text color="gray.600" fontSize="sm">
                                                {jobOpening.title}
                                            </Text>
                                        </Stack>

                                        <Field.Root
                                            invalid={Boolean(state.errors.response?.[0])}
                                            required
                                        >
                                            <Field.Label>
                                                Why are you the best candidate for this role?
                                            </Field.Label>

                                            <Textarea
                                                name="response"
                                                placeholder="Write your response here..."
                                                rows={5}
                                                disabled={pending}
                                            />

                                            <Field.ErrorText>
                                                {state.errors.response?.[0]}
                                            </Field.ErrorText>
                                        </Field.Root>

                                        <HStack justify="end" gap={3}>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                disabled={pending}
                                                onClick={() => onOpenChange(false)}
                                            >
                                                Cancel
                                            </Button>

                                            <Button
                                                type="submit"
                                                colorPalette="green"
                                                loading={pending}
                                            >
                                                Submit Application
                                            </Button>
                                        </HStack>
                                    </Stack>
                                </form>
                            )}
                        </Dialog.Body>

                        <Dialog.CloseTrigger />
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
};

export { ApplyJobOpeningDialog };