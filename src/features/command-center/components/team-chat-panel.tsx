import {
    Button,
    Card,
    Heading,
    HStack,
    Stack,
    Text,
    Textarea,
} from "@chakra-ui/react";
import { createChatMessageAction } from "@/features/command-center/actions/create-chat-message";
import type { CommandCenterChatMessage } from "@/features/command-center/types";

type TeamChatPanelProps = {
    coopId: string;
    messages: CommandCenterChatMessage[];
};

const TeamChatPanel = ({ coopId, messages }: TeamChatPanelProps) => {
    return (
        <Card.Root>
            <Card.Body>
                <Stack gap={5}>
                    <Stack gap={1}>
                        <Heading size="md">Team Chat</Heading>
                        <Text color="gray.600" fontSize="sm">
                            Send messages to co-workers.
                        </Text>
                    </Stack>

                    {messages.length === 0 ? (
                        <Text color="gray.600" fontSize="sm">
                            No messages yet. Say hello to your team!
                        </Text>
                        ) : (
                            <Stack gap={3}>
                                {messages.map((message) => (
                                    <Card.Root key={message.id} variant="subtle">
                                        <Card.Body py={3}>
                                            <Stack gap={1}>
                                                <HStack justify="space-between" gap={3}>
                                                    <Text fontWeight="semibold" fontSize="sm">
                                                        {message.authorName}
                                                    </Text>
                                                    <Text color="gray.500" fontSize="xs">
                                                        {message.createdAtLabel}
                                                    </Text>
                                                </HStack>

                                                <Text color="gray.700" fontSize="sm">
                                                    {message.content}
                                                </Text>
                                            </Stack>
                                        </Card.Body>
                                    </Card.Root>
                                ))}
                            </Stack>
                        )}

                        <form action={createChatMessageAction}>
                            <Stack gap={3}>
                                <input type="hidden" name="coopId" value={coopId} />

                                <Textarea
                                    name="content"
                                    placeholder="Write a message..."
                                    rows={3}
                                    maxLength={300}
                                />

                                <Button
                                    type="submit"
                                    colorPalette="yellow"
                                    size="sm"
                                    alignSelf="end"
                                >
                                    Send
                                </Button>
                            </Stack>
                        </form>
                </Stack>
            </Card.Body>
        </Card.Root>
    );
};

export { TeamChatPanel };