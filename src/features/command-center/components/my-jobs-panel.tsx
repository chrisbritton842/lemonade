import {
    Badge,
    Button,
    Card,
    Heading,
    HStack,
    Stack,
    Text,
} from "@chakra-ui/react";
import { submitTaskForReviewAction } from "@/features/command-center/actions/submit-task-for-review";
import type { CommandCenterTask } from "@/features/command-center/types";

type MyJobsPanelProps = {
    coopId: string;
    tasks: CommandCenterTask[];
};

const MyJobsPanel = ({ coopId, tasks }: MyJobsPanelProps) => {
    const activeTasks = tasks.filter((task) => task.status === "ASSIGNED");
    const reviewTasks = tasks.filter((task) => task.status === "NEEDS_REVIEW");

    return (
        <Card.Root bg="app.surface" borderColor="app.border">
            <Card.Body>
                <Stack gap={5}>
                    <Stack gap={1}>
                        <Heading size="md" color="app.text">My Jobs</Heading>
                        <Text color="app.mutedText" fontSize="sm">
                            These are tasks that have been assigned to you.
                        </Text>
                    </Stack>

                    {activeTasks.length === 0 && reviewTasks.length === 0 && (
                        <Text color="app.mutedText">You do not have any jobs right now.</Text>
                    )}

                    {activeTasks.length > 0 && (
                        <Stack gap={3}>
                            <Heading size="sm" color="app.text">To Do</Heading>

                            {activeTasks.map((task) => (
                                <Card.Root key={task.id} bg="app.subtleSurface" borderColor="app.border">
                                    <Card.Body>
                                        <Stack gap={3}>
                                            <HStack justify="space-between" align="start" gap={3} wrap="wrap">
                                                <Stack gap={1} minW={0}>
                                                    <Text fontWeight="semibold" color="app.text">{task.title}</Text>

                                                    {task.description && (
                                                        <Text color="app.mutedText" fontSize="sm">
                                                            {task.description}
                                                        </Text>
                                                    )}

                                                    {task.dueDateLabel && (
                                                        <Text color="app.mutedText" fontSize="xs">
                                                            Due: {task.dueDateLabel}
                                                        </Text>
                                                    )}
                                                </Stack>

                                                <Badge colorPalette="brand" variant="subtle">
                                                    {task.points} point{task.points === 1 ? "" : "s"}
                                                </Badge>
                                            </HStack>

                                            <form action={submitTaskForReviewAction}>
                                                <input type="hidden" name="taskId" value={task.id} />
                                                <input type="hidden" name="coopId" value={coopId} />

                                                <Button
                                                  type="submit"
                                                  size="sm"
                                                  colorPalette="brand"
                                                >
                                                    I&apos;m done!
                                                </Button>
                                            </form>
                                        </Stack>
                                    </Card.Body>
                                </Card.Root>
                            ))}
                        </Stack>
                    )}

                    {reviewTasks.length > 0 && (
                        <Stack gap={3}>
                          <Heading size="sm" color="app.text">Waiting for Check</Heading>

                          {reviewTasks.map((task) => (
                            <Card.Root key={task.id} bg="app.subtleSurface" borderColor="app.border">
                              <Card.Body>
                                <HStack justify="space-between" align="start" gap={3} wrap="wrap">
                                  <Stack gap={1} minW={0}>
                                    <Text fontWeight="semibold" color="app.text">{task.title}</Text>

                                    {task.description && (
                                        <Text color="app.mutedText" fontSize="sm">
                                            {task.description}
                                        </Text>
                                    )}
                                  </Stack>

                                  <Badge colorPalette="indigo" variant="subtle">Needs Review</Badge>
                                </HStack>
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

export { MyJobsPanel };