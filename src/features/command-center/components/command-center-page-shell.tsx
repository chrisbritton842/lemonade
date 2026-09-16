import {
    SimpleGrid,
    Stack,
} from "@chakra-ui/react";
import type {
    CommandCenterCalendarEvent,
    CommandCenterChatMessage,
    CommandCenterCoop,
    CommandCenterEvent,
    CommandCenterMembership,
    CommandCenterProposal,
    CommandCenterTask,
} from "@/features/command-center/types";
import { CommandCenterHero } from "./command-center-hero";
import { CoopCalendar } from "./coop-calendar";
import { MyJobsPanel } from "./my-jobs-panel";
import { NextEventBanner } from "./next-event-banner";
import { ProposalsPanel } from "./proposals-panel";
import { RoleTaskBoard } from "./role-task-board";
import { TeamChatPanel } from "./team-chat-panel";

type CommandCenterPageShellProps = {
    coop: CommandCenterCoop;
    membership: CommandCenterMembership;
    nextEvent: CommandCenterEvent | null;
    tasks: CommandCenterTask[];
    availableTasks: CommandCenterTask[];
    proposals: CommandCenterProposal[];
    currentUserIsBoardMember: boolean;
    events: CommandCenterCalendarEvent[];
    messages: CommandCenterChatMessage[];
};

const CommandCenterPageShell = ({
    coop,
    membership,
    nextEvent,
    tasks,
    availableTasks,
    proposals,
    currentUserIsBoardMember,
    events,
    messages,
}: CommandCenterPageShellProps) => {
    return (
        <Stack gap={6}>
            <NextEventBanner event={nextEvent} />
            <CommandCenterHero coop={coop} roles={membership.roles} />

            <SimpleGrid columns={{ base: 1, xl: 4}} gap={6}>
                <Stack gap={6} gridColumn={{ base: "auto", xl: "span 3" }}>
                    <MyJobsPanel coopId={coop.id} tasks={tasks} />
                    <ProposalsPanel coopId={coop.id} proposals={proposals} currentUserIsBoardMember={currentUserIsBoardMember}/>
                    <RoleTaskBoard coopId={coop.id} tasks={availableTasks} />
                    <CoopCalendar events={events} />
                </Stack>

                <Stack gap={6}>
                    <TeamChatPanel coopId={coop.id} messages={messages} />
                </Stack>
            </SimpleGrid>
        </Stack>
    );
};

export { CommandCenterPageShell };