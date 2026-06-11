import {
    Stack,
} from "@chakra-ui/react";
import type {
    CommandCenterCoop,
    CommandCenterEvent,
    CommandCenterMembership,
} from "@/features/command-center/types";
import { CommandCenterHero } from "./command-center-hero";
import { NextEventBanner } from "./next-event-banner";

type CommandCenterPageShellProps = {
    coop: CommandCenterCoop;
    membership: CommandCenterMembership;
    nextEvent: CommandCenterEvent | null;
};

const CommandCenterPageShell = ({
    coop,
    membership,
    nextEvent,
}: CommandCenterPageShellProps) => {
    return (
        <Stack gap={6}>
            <NextEventBanner event={nextEvent} />

            <CommandCenterHero coop={coop} roles={membership.roles} />
        </Stack>
    );
};

export { CommandCenterPageShell };