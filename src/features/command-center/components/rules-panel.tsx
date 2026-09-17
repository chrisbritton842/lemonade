import {
    Card,
    Heading,
    Stack,
    Text,
} from "@chakra-ui/react";
import type { CommandCenterRule } from "@/features/command-center/types";

type RulesPanelProps = {
    rules: CommandCenterRule[];
};

const RulesPanel = ({ rules }: RulesPanelProps) => {
    const activeRules = rules.filter((rule) => rule.isActive);

    return (
        <Card.Root>
            <Card.Body>
                <Stack gap={5}>
                    <Stack gap={1}>
                        <Heading size="md">Business Rules</Heading>
                    </Stack>

                    {activeRules.length === 0 ? (
                        <Text color="gray.600" fontSize="sm">
                            No rules yet. Members can propose rules in the proposals panel.
                        </Text>
                    ) : (
                        <Stack gap={3}>
                            {activeRules.map((rule) => (
                                <Card.Root key={rule.id} variant="subtle">
                                    <Card.Body>
                                        <Stack gap={1}>
                                            <Text color="gray.700" fontSize="sm">{rule.text}</Text>
                                        </Stack>
                                    </Card.Body>
                                </Card.Root>
                            ))}
                        </Stack>
                    )}
                </Stack>
            </Card.Body>
        </Card.Root>
    );
};

export { RulesPanel };