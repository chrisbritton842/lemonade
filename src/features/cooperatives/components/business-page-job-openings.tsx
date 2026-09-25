"use client";

import {
    Badge,
    Button,
    Card,
    Heading,
    HStack,
    Stack,
    Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { ApplyJobOpeningDialog } from "@/features/cooperatives/components/apply-job-opening-dialog";
import { roleLabels } from "@/features/cooperatives/lib/role-labels";
import type { BusinessPageJobOpening } from "@/features/cooperatives/types";

type BusinessPageJobOpeningsProps = {
    coopId: string;
    coopName: string;
    jobOpenings: BusinessPageJobOpening[];
    isMember: boolean;
};

const BusinessPageJobOpenings = ({
    coopId,
    coopName,
    jobOpenings,
    isMember,
}: BusinessPageJobOpeningsProps) => {
    const [selectedJobOpening, setSelectedJobOpening] =
    useState<BusinessPageJobOpening | null>(null);

    return (
        <Stack gap={4}>
            <Heading size="lg">Job Openings</Heading>

            {jobOpenings.length === 0 ? (
                <Card.Root>
                    <Card.Body>
                        <Text color="gray.600">
                            There are no job openings at this time.
                        </Text>
                    </Card.Body>
                </Card.Root>
            ) : (
                <Stack gap={3}>
                    {jobOpenings.map((jobOpening) => (
                        <Card.Root key={jobOpening.id}>
                            <Card.Body>
                                <Stack gap={4}>
                                    <HStack justify="space-between" align="start" gap={3}>
                                        <Stack gap={1}>
                                            <Heading size="sm">{jobOpening.title}</Heading>

                                            {jobOpening.description && (
                                                <Text color="gray.600" fontSize="sm">
                                                    {jobOpening.description}
                                                </Text>
                                            )}
                                        </Stack>

                                        <Badge colorPalette="blue" variant="subtle">
                                            {roleLabels[jobOpening.role]}
                                        </Badge>
                                    </HStack>

                                    {!isMember && (
                                        <Button
                                            colorPalette="yellow"
                                            alignSelf="start"
                                            onClick={() => setSelectedJobOpening(jobOpening)}
                                        >
                                            Apply for This Job
                                        </Button>
                                    )}
                                </Stack>
                            </Card.Body>
                        </Card.Root>
                    ))}
                </Stack>
            )}

            {selectedJobOpening && (
                <ApplyJobOpeningDialog
                    key={selectedJobOpening?.id ?? "no-job-selected"}
                    coopId={coopId}
                    coopName={coopName}
                    jobOpening={selectedJobOpening}
                    open={Boolean(selectedJobOpening)}
                    onOpenChange={(open) => {
                        if (!open) {
                            setSelectedJobOpening(null);
                        }
                    }}
                />
            )}
        </Stack>
    );
};

export { BusinessPageJobOpenings };