import {
    Box,
    Container,
    Grid,
    GridItem,
    Stack,
} from "@chakra-ui/react";
import type {
    CommandCenterCalendarEvent,
    CommandCenterChatMessage,
    CommandCenterCoop,
    CommandCenterEditableEvent,
    CommandCenterEvent,
    CommandCenterMembership,
    CommandCenterProduct,
    CommandCenterProposal,
    CommandCenterRule,
    CommandCenterTask,
} from "@/features/command-center/types";
import { CommandCenterHero } from "./command-center-hero";
import { CoopCalendar } from "./coop-calendar";
import { MyJobsPanel } from "./my-jobs-panel";
import { NextEventBanner } from "./next-event-banner";
import { ProductsPanel } from "./products-panel";
import { ProposalsPanel } from "./proposals-panel";
import { RoleTaskBoard } from "./role-task-board";
import { RulesPanel } from "./rules-panel";
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
    products: CommandCenterProduct[];
    rules: CommandCenterRule[];
    editableEvents: CommandCenterEditableEvent[];
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
    products,
    rules,
    editableEvents,
}: CommandCenterPageShellProps) => {
    return (
        <Box
            bg="app.bg"
            color="app.text"
            minH="calc(100vh - 80px)"
        >
            <Container maxW="7xl" py={8}>
                <Stack gap={6}>
                    <NextEventBanner event={nextEvent} />

                    <CommandCenterHero coop={coop} roles={membership.roles} />

                    <Grid
                        templateColumns={{
                            base: "minmax(0, 1fr)",
                            xl: "minmax(0, 3fr) minmax(280px, 1fr)",
                        }}
                        gap={6}
                        alignItems="start"
                    >
                        <GridItem minW={0}>
                            <Stack gap={6}>
                                <RoleTaskBoard coopId={coop.id} tasks={availableTasks} />
                                <MyJobsPanel coopId={coop.id} tasks={tasks} />
                                <ProposalsPanel coopId={coop.id} coopName={coop.name} coopDescription={coop.description} proposals={proposals} editableEvents={editableEvents} currentUserIsBoardMember={currentUserIsBoardMember}/>
                                <ProductsPanel products={products} />
                            </Stack>
                        </GridItem>
                        
                        <GridItem minW={0}>
                            <Stack gap={6}>
                                <RulesPanel rules={rules} />
                                <TeamChatPanel coopId={coop.id} messages={messages} />
                                <CoopCalendar events={events} />
                            </Stack>
                        </GridItem>
                    </Grid>
                </Stack>
            </Container>
        </Box>
    );
};

export { CommandCenterPageShell };