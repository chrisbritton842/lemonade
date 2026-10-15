import {
    Badge,
    Card,
    Heading,
    HStack,
    Stack,
    Text,
} from "@chakra-ui/react";
import type { CommandCenterCoop, CommandCenterMembership } from "@/features/command-center/types";

type CommandCenterHeroProps = {
    coop: CommandCenterCoop;
    roles: CommandCenterMembership["roles"];
};

const roleLabels: Record<string, string> = {
    BOARD_OF_DIRECTORS: "Board of Directors",
    PRODUCTION: "Production",
    CUSTOMER_SERVICE: "Customer Service",
    INVENTORY: "Inventory",
    MARKETING: "Marketing",
    ACCOUNTING: "Accounting",
};

const CommandCenterHero = ({ coop, roles }: CommandCenterHeroProps) => {
    return (
        <Card.Root
            bg="app.surface"
            borderColor="app.border"
        >
            <Card.Body>
                <Stack gap={4}>
                    <Stack gap={1}>
                        <Heading size="xl" color="app.text">{coop.name}</Heading>

                        {coop.description && (
                            <Text color="app.mutedText">{coop.description}</Text>
                        )}
                    </Stack>

                    <HStack gap={2} wrap="wrap">
                        <Text fontWeight="medium" color="app.text">Your Roles:</Text>

                        {roles.length > 0 ? (
                            roles.map((r) => (
                                <Badge key={r.role} colorPalette="brand" variant="subtle">
                                    {roleLabels[r.role] ?? r.role}
                                </Badge>
                            ))
                        ) : (
                            <Text color="app.mutedText">No roles assigned</Text>
                        )}
                    </HStack>
                </Stack>
            </Card.Body>
        </Card.Root>
    );
};

export { CommandCenterHero };