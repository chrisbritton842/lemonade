import {
    Badge,
    Button,
    Card,
    HStack,
    Stack,
    Text,
} from "@chakra-ui/react";
import NextLink from "next/link";
import type { BusinessCardCoop } from "@/features/cooperatives/types";
import {
    businessPagePath,
    commandCenterPagePath,
} from "@/paths";
import { BusinessCardJobOpenings } from "./business-card-job-openings";

type BusinessCardProps = {
    coop: BusinessCardCoop;
};

const BusinessCard = ({ coop }: BusinessCardProps) => {
    const hasOpenJobOpenings = coop.jobOpenings.length > 0;

    return (
        <Card.Root>
            <Card.Body>
                <Stack gap={4}>
                    <Stack gap={2}>
                        <HStack justify="space-between" align="start" gap={3}>
                            <Text fontWeight="bold" fontSize="lg">
                                {coop.name}
                            </Text>

                            <HStack gap={2} wrap="wrap" justify="end">
                                {coop.isMember && (
                                    <Badge colorPalette="yellow">Member</Badge>
                                )}

                                {hasOpenJobOpenings && (
                                    <Badge colorPalette="green" variant="subtle">
                                        Now Hiring!
                                    </Badge>
                                )}
                            </HStack> 
                        </HStack>

                        <Text color="gray.600" fontSize="sm">
                            {coop.description || "No description yet."}
                        </Text>
                    </Stack>

                    <HStack gap={2} wrap="wrap">
                        <Badge variant="outline">
                            {coop.memberCount} member{coop.memberCount === 1 ? "" : "s"}
                        </Badge>

                        <Badge variant="outline">
                            {coop.taskCount} job{coop.taskCount === 1 ? "" : "s"}
                        </Badge>

                        <Badge variant="outline">
                            {coop.eventCount} event{coop.eventCount === 1 ? "" : "s"}
                        </Badge>

                        {hasOpenJobOpenings && (
                            <Badge variant="outline">
                                {coop.jobOpenings.length} opening
                                {coop.jobOpenings.length === 1 ? "" : "s"}
                            </Badge>
                        )}
                    </HStack>

                    {!coop.isMember && coop.jobOpenings.length > 0 && (
                        <BusinessCardJobOpenings
                            coopId={coop.id}
                            coopName={coop.name}
                            jobOpenings={coop.jobOpenings}
                        />
                    )}

                    <HStack gap={3} wrap="wrap">
                        <Button asChild colorPalette="yellow" size="sm">
                            <NextLink href={businessPagePath(coop.id)}>
                                View Business
                            </NextLink>
                        </Button>

                        {coop.isMember && (
                            <Button asChild colorPalette="yellow" size="sm">
                                <NextLink href={commandCenterPagePath(coop.id)}>
                                    Open Command Center
                                </NextLink>
                            </Button>
                        )}
                    </HStack>
                </Stack>
            </Card.Body>
        </Card.Root>
    );
};

export { BusinessCard };