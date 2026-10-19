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
        <Card.Root bg="app.surface" borderColor="app.border">
            <Card.Body>
                <Stack gap={5}>
                    <Stack gap={1}>
                        <Heading size="md" color="app.text">Team Chat</Heading>
                        <Text color="app.mutedText" fontSize="sm">
                            Send messages to co-workers.
                        </Text>
                    </Stack>

                    {messages.length === 0 ? (
                        <Text color="app.mutedText" fontSize="sm">
                            No messages yet. Say hello to your team!
                        </Text>
                        ) : (
                            <Stack gap={3}>
                                {messages.map((message) => (
                                    <Card.Root key={message.id} bg="app.subtleSurface" borderColor="app.border">
                                        <Card.Body py={3}>
                                            <Stack gap={1}>
                                                <HStack justify="space-between" align="start" gap={3}>
                                                    <Text fontWeight="semibold" fontSize="sm" color="brand.fg" minW={0} overflowWrap="anywhere">
                                                        {message.authorName}
                                                    </Text>
                                                    <Text color="app.mutedText" fontSize="xs" flexShrink={0}>
                                                        {message.createdAtLabel}
                                                    </Text>
                                                </HStack>

                                                <Text color="app.text" fontSize="sm" whiteSpace="pre-wrap" overflowWrap="anywhere">
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
                                    aria-label="Message to your team"
                                    placeholder="Write a message..."
                                    rows={3}
                                    maxLength={300}
                                    required
                                    bg="app.surface"
                                    color="app.text"
                                    borderColor="app.border"
                                    focusRingColor="brand.focusRing"
                                    _placeholder={{
                                        color: "app.mutedText",
                                    }}
                                />

                                <Button
                                    type="submit"
                                    colorPalette="brand"
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