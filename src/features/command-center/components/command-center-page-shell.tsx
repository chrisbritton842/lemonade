import {
    Stack,
} from "@chakra-ui/react";
import type {
    CommandCenterCoop,
    CommandCenterEvent,
    CommandCenterMembership,
    CommandCenterTask,
} from "@/features/command-center/types";
import { CommandCenterHero } from "./command-center-hero";
import { MyJobsPanel } from "./my-jobs-panel";
import { NextEventBanner } from "./next-event-banner";
import { RoleTaskBoard } from "./role-task-board";

type CommandCenterPageShellProps = {
    coop: CommandCenterCoop;
    membership: CommandCenterMembership;
    nextEvent: CommandCenterEvent | null;
    tasks: CommandCenterTask[];
    availableTasks: CommandCenterTask[];
};

const CommandCenterPageShell = ({
    coop,
    membership,
    nextEvent,
    tasks,
    availableTasks,
}: CommandCenterPageShellProps) => {
    return (
        <Stack gap={6}>
            <NextEventBanner event={nextEvent} />
            <CommandCenterHero coop={coop} roles={membership.roles} />
            <RoleTaskBoard coopId={coop.id} tasks={availableTasks} />
            <MyJobsPanel coopId={coop.id} tasks={tasks} />
        </Stack>
    );
};

export { CommandCenterPageShell };