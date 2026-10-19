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
        <Card.Root bg="app.surface" borderColor="app.border">
            <Card.Body>
                <Stack gap={5}>
                    <Heading size="md" color="app.text">
                        Business Rules
                    </Heading>

                    {activeRules.length === 0 ? (
                        <Text color="app.mutedText" fontSize="sm">
                            No rules yet. Members can propose rules in the proposals panel.
                        </Text>
                    ) : (
                        <Stack gap={3}>
                            {activeRules.map((rule) => (
                                <Card.Root key={rule.id} bg="app.subtleSurface" borderColor="app.border">
                                    <Card.Body>
                                        <Text
                                            color="app.text"
                                            fontSize="sm"
                                            overflowWrap="anywhere"
                                        >
                                            {rule.text}
                                        </Text>
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