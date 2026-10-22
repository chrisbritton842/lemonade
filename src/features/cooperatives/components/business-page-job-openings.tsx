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
            <Heading size="lg" color="app.text">Job Openings</Heading>

            {jobOpenings.length === 0 ? (
                <Card.Root
                    bg="app.surface"
                    borderColor="app.border"
                >
                    <Card.Body>
                        <Text color="app.mutedText">
                            There are no job openings at this time.
                        </Text>
                    </Card.Body>
                </Card.Root>
            ) : (
                <Stack gap={3}>
                    {jobOpenings.map((jobOpening) => (
                        <Card.Root 
                            key={jobOpening.id}
                            bg="app.surface"
                            borderColor="app.border"
                        >
                            <Card.Body>
                                <Stack gap={4}>
                                    <HStack justify="space-between" align="start" gap={3} wrap="wrap">
                                        <Stack gap={1} minW={0}>
                                            <Heading
                                                size="sm"
                                                color="app.text"
                                                overflowWrap="anywhere"
                                            >
                                                {jobOpening.title}
                                            </Heading>

                                            {jobOpening.description && (
                                                <Text
                                                    color="app.mutedText"
                                                    fontSize="sm"
                                                    whiteSpace="pre-wrap"
                                                    overflowWrap="anywhere"
                                                >
                                                    {jobOpening.description}
                                                </Text>
                                            )}
                                        </Stack>

                                        <Badge colorPalette="brand" variant="subtle">
                                            {roleLabels[jobOpening.role]}
                                        </Badge>
                                    </HStack>

                                    {!isMember && (
                                        <Button
                                            type="button"
                                            colorPalette="brand"
                                            size="sm"
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