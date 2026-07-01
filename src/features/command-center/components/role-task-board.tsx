import {
    Badge,
    Button,
    Card,
    Heading,
    HStack,
    SimpleGrid,
    Stack,
    Text,
} from "@chakra-ui/react";
import { takeTaskAction } from "@/features/command-center/actions/take-task";
import type {
    CommandCenterRoleName,
    CommandCenterTask,
} from "@/features/command-center/types";

type RoleTaskBoardProps = {
    coopId: string;
    tasks: CommandCenterTask[];
};

const roleOrder: CommandCenterRoleName[] = [
    "BOARD_OF_DIRECTORS",
    "PRODUCTION",
    "CUSTOMER_SERVICE",
    "INVENTORY",
    "MARKETING",
    "ACCOUNTING",
];

const roleLabels: Record<CommandCenterRoleName, string> = {
    MEMBER: "General",
    BOARD_OF_DIRECTORS: "Board of Directors",
    PRODUCTION: "Production",
    CUSTOMER_SERVICE: "Customer Service",
    INVENTORY: "Supplies",
    MARKETING: "Marketing",
    ACCOUNTING: "Accounting",
};

const RoleTaskBoard = ({ coopId, tasks }: RoleTaskBoardProps) => {
    const availableTasks = tasks.filter((task) => task.status === "AVAILABLE");

    return (
        <Card.Root>
            <Card.Body>
                <Stack gap={5}>
                    <Stack gap={1}>
                        <Heading size="md">Task Board</Heading>
                        <Text color="gray.600" fontSize="sm">
                            Choose tasks from your business role below.
                        </Text>
                    </Stack>

                    <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} gap={4}>
                        {roleOrder.map((role) => {
                            const roleTasks = availableTasks.filter(
                                (task) => task.role === role
                            );

                            return (
                                <Card.Root key={role} variant="outline">
                                    <Card.Body>
                                        <Stack gap={3}>
                                            <Heading size="sm">{roleLabels[role]}</Heading>

                                            {roleTasks.length === 0 ? (
                                                <Text color="gray.500" fontSize="sm">
                                                    No jobs available.
                                                </Text>
                                            ) : (
                                                roleTasks.map((task) => (
                                                    <TaskCard key={task.id} coopId={coopId} task={task} />
                                                ))
                                            )}
                                        </Stack>
                                    </Card.Body>
                                </Card.Root>
                            );
                        })}
                    </SimpleGrid>
                </Stack>
            </Card.Body>
        </Card.Root>
    );
};

type TaskCardProps = {
    coopId: string;
    task: CommandCenterTask;
};

const TaskCard = ({ coopId, task }: TaskCardProps) => {
    return (
        <Card.Root variant="subtle">
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

                    <form action={takeTaskAction}>
                        <input type="hidden" name="taskId" value={task.id} />
                        <input type="hidden" name="coopId" value={coopId} />

                        <Button type="submit" size="sm" colorPalette="yellow">
                            Take job
                        </Button>
                    </form>
                </Stack>
            </Card.Body>
        </Card.Root>
    );
};

export { RoleTaskBoard };