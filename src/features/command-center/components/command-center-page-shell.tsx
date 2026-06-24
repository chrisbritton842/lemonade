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

type CommandCenterPageShellProps = {
    coop: CommandCenterCoop;
    membership: CommandCenterMembership;
    nextEvent: CommandCenterEvent | null;
    tasks: CommandCenterTask[];
};

const CommandCenterPageShell = ({
    coop,
    membership,
    nextEvent,
    tasks,
}: CommandCenterPageShellProps) => {
    return (
        <Stack gap={6}>
            <NextEventBanner event={nextEvent} />
            <CommandCenterHero coop={coop} roles={membership.roles} />
            < MyJobsPanel coopId={coop.id} tasks={tasks} />
        </Stack>
    );
};

export { CommandCenterPageShell };