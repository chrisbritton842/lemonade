import {
    Badge,
    Card,
    Heading,
    HStack,
    Stack,
    Text,
} from "@chakra-ui/react";
import {
    Boxes,
    Calculator,
    GlassWater,
    Handshake,
    type LucideIcon,
    Megaphone,
    UserRound,
    UsersRound,
} from "lucide-react";
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

const roleIcons: Record<string, LucideIcon> = {
    BOARD_OF_DIRECTORS: UsersRound,
    PRODUCTION: GlassWater,
    CUSTOMER_SERVICE: Handshake,
    INVENTORY: Boxes,
    MARKETING: Megaphone,
    ACCOUNTING: Calculator,
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
                        {roles.length > 0 ? (
                            roles.map((r) => {
                                const RoleIcon = roleIcons[r.role] ?? UserRound;

                                return (
                                    <Badge
                                        key={r.role}
                                        colorPalette="brand"
                                        variant="subtle"
                                        gap={2}
                                        px={3}
                                        py={1.5}
                                    >
                                        <RoleIcon size={16} aria-hidden="true" />
                                        {roleLabels[r.role] ?? r.role}
                                    </Badge>
                                );
                            })
                        ) : (
                            <Text color="app.mutedText" fontSize="sm">
                                No roles assigned
                            </Text>
                        )}
                    </HStack>
                </Stack>
            </Card.Body>
        </Card.Root>
    );
};

export { CommandCenterHero };