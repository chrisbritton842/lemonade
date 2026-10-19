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
        <Card.Root bg="app.surface" borderColor="app.border">
            <Card.Body>
                <Stack gap={5}>
                    <Stack gap={1}>
                        <Heading size="md" color="app.text">Task Board</Heading>
                        <Text color="app.mutedText" fontSize="sm">
                            Choose tasks from your business role below.
                        </Text>
                    </Stack>

                    <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} gap={4}>
                        {roleOrder.map((role) => {
                            const roleTasks = availableTasks.filter(
                                (task) => task.role === role
                            );

                            return (
                                <Card.Root key={role} bg="slate.50" borderColor="app.border">
                                    <Card.Body>
                                        <Stack gap={3}>
                                            <Heading size="sm" color="app.text">{roleLabels[role]}</Heading>

                                            {roleTasks.length === 0 ? (
                                                <Text color="app.mutedText" fontSize="sm">
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
        <Card.Root bg="app.subtleSurface" borderColor="app.border">
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

                    <form action={takeTaskAction}>
                        <input type="hidden" name="taskId" value={task.id} />
                        <input type="hidden" name="coopId" value={coopId} />

                        <Button type="submit" size="sm" colorPalette="brand">
                            Take job
                        </Button>
                    </form>
                </Stack>
            </Card.Body>
        </Card.Root>
    );
};

export { RoleTaskBoard };