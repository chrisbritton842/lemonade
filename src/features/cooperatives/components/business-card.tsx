import {
    Badge,
    Button,
    Card,
    HStack,
    Stack,
    Text,
} from "@chakra-ui/react";
import NextLink from "next/link";
import {
    businessPagePath,
    commandCenterPagePath,
} from "@/paths";

type BusinessCardProps = {
    coop: {
        id: string;
        name: string;
        description: string | null;
        memberCount: number;
        taskCount: number;
        eventCount: number;
        isMember: boolean;
    };
};

const BusinessCard = ({ coop }: BusinessCardProps) => {
    return (
        <Card.Root>
            <Card.Body>
                <Stack gap={4}>
                    <Stack gap={2}>
                        <HStack justify="space-between" align="start" gap={3}>
                            <Text fontWeight="bold" fontSize="lg">
                                {coop.name}
                            </Text>

                            {coop.isMember && (
                                <Badge colorPalette="yellow">Member</Badge>
                            )}
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
                    </HStack>

                    <HStack gap={3} wrap="wrap">
                        {coop.isMember ? (
                            <Button asChild colorPalette="yellow" size="sm">
                                <NextLink href={commandCenterPagePath(coop.id)}>
                                    Open Command Center
                                </NextLink>
                            </Button>
                        ) : (
                            <Button asChild colorPalette="yellow" size="sm">
                                <NextLink href={businessPagePath(coop.id)}>
                                    View Business
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