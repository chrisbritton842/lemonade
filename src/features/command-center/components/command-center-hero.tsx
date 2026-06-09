import {
    Badge,
    Card,
    Heading,
    HStack,
    Stack,
    Text,
} from "@chakra-ui/react";

type CommandCenterHeroProps = {
    coop: {
        name: string;
        description: string | null;
    };
    roles: {
        role: string;
    }[];
};

const roleLabels: Record<string, string> = {
    BOARD_OF_DIRECTORS: "Board",
    PRODUCTION: "Production",
    CUSTOMER_SERVICE: "Customer Service",
    INVENTORY: "Inventory",
    MARKETING: "Marketing",
    ACCOUNTING: "Accounting",
};

const CommandCenterHero = ({ coop, roles }: CommandCenterHeroProps) => {
    return (
        <Card.Root>
            <Card.Body>
                <Stack gap={4}>
                    <Stack gap={1}>
                        <Heading size="xl">{coop.name}</Heading>

                        {coop.description && (
                            <Text color="gray.600">{coop.description}</Text>
                        )}
                    </Stack>

                    <HStack gap={2} wrap="wrap">
                        <Text fontWeight="medium">Your Roles:</Text>

                        {roles.length > 0 ? (
                            roles.map((r) => (
                                <Badge key={r.role} colorPalette="yellow">
                                    {roleLabels[r.role] ?? r.role}
                                </Badge>
                            ))
                        ) : (
                            <Text color="gray.500">No roles assigned</Text>
                        )}
                    </HStack>
                </Stack>
            </Card.Body>
        </Card.Root>
    );
};

export { CommandCenterHero };