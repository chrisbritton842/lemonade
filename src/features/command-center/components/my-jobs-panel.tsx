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
        <Card.Root>
            <Card.Body>
                <Stack gap={5}>
                    <Stack gap={1}>
                        <Heading size="md">My Jobs</Heading>
                        <Text color="gray.600" fontSize="sm">
                            These are tasks that have been assigned to you.
                        </Text>
                    </Stack>

                    {activeTasks.length === 0 && reviewTasks.length === 0 && (
                        <Text color="gray.500">You do not have any jobs right now.</Text>
                    )}

                    {activeTasks.length > 0 && (
                        <Stack gap={3}>
                            <Heading size="sm">To Do</Heading>

                            {activeTasks.map((task) => (
                                <Card.Root key={task.id} variant="subtle">
                                    <Card.Body>
                                        <Stack gap={3}>
                                            <HStack justify="space-between" align="start" gap={3}>
                                                <Stack gap={1}>
                                                    <Text fontWeight="semibold">{task.title}</Text>

                                                    {task.description && (
                                                        <Text color="gray.600" fontSize="sm">
                                                            {task.description}
                                                        </Text>
                                                    )}

                                                    {task.dueDateLabel && (
                                                        <Text color="gray.500" fontSize="xs">
                                                            Due: {task.dueDateLabel}
                                                        </Text>
                                                    )}
                                                </Stack>

                                                <Badge colorPalette="yellow">
                                                    {task.points} point{task.points === 1 ? "" : "s"}
                                                </Badge>
                                            </HStack>

                                            <form action={submitTaskForReviewAction}>
                                                <input type="hidden" name="taskId" value={task.id} />
                                                <input type="hidden" name="coopId" value={coopId} />

                                                <Button
                                                  type="submit"
                                                  size="sm"
                                                  colorPalette="yellow"
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
                          <Heading size="sm">Waiting for Check</Heading>

                          {reviewTasks.map((task) => (
                            <Card.Root key={task.id} variant="subtle">
                              <Card.Body>
                                <HStack justify="space-between" align="start" gap={3}>
                                  <Stack gap={1}>
                                    <Text fontWeight="semibold">{task.title}</Text>

                                    {task.description && (
                                        <Text color="gray.600" fontSize="sm">
                                            {task.description}
                                        </Text>
                                    )}
                                  </Stack>

                                  <Badge colorPalette="orange">Needs Review</Badge>
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