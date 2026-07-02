import { redirect } from "next/navigation";
import { CommandCenterPageShell } from "@/features/command-center/components/command-center-page-shell";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { prisma } from "@/lib/prisma";
import { homePagePath, signInPagePath } from "@/paths";

type CommandCenterPageProps = {
    params: Promise<{
        businessId: string;
    }>;
};

const formatEventDate = (date: Date) => {
    return date.toLocaleString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
    });
};

const CommandCenterPage = async ({ params }: CommandCenterPageProps) => {
    const { businessId } = await params;

    const currentUser = await getCurrentUser();

    if (!currentUser) {
        redirect(signInPagePath());
    }

    const now = new Date();

    const coop = await prisma.cooperative.findUnique({
        where: {
            id: businessId,
        },
        include: {
            memberships: {
                where: {
                    userId: currentUser.user.id,
                },
                include: {
                    roles: true,
                },
            },
            events: {
                where: {
                    startsAt: {
                        gte: now,
                    },
                    status: {
                        not: "CANCELLED",
                    },
                },
                orderBy: {
                    startsAt: "asc",
                },
            },
        },
    });

    if (!coop) {
        redirect(homePagePath());
    }

    const membership = coop.memberships[0];

    if (!membership) {
        redirect(homePagePath());
    }

    const nextEvent = coop.events[0]
        ? {
              id: coop.events[0].id,
              title: coop.events[0].title,
              startsAtLabel: formatEventDate(coop.events[0].startsAt),
              location: coop.events[0].location,
              status: coop.events[0].status,
          }
        : null;

    const myTasks = await prisma.task.findMany({
        where: {
            coopId: coop.id,
            assignedToId: currentUser.user.id,
            status: {
                in: ["ASSIGNED", "NEEDS_REVIEW"],
            },
        },
        orderBy: [
            {
                dueDate: "asc",
            },
            {
                createdAt: "desc",
            },
        ],
    });

    const formatDate = (date: Date | null) => {
        if (!date) return null;

        return date.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
        });
    };

    const myTaskItems = myTasks.map((task) => ({
        id: task.id,
        title: task.title,
        description: task.description,
        role: task.role,
        points: task.points,
        status: task.status,
        dueDateLabel: formatDate(task.dueDate),
    }));

    const availableTasks = await prisma.task.findMany({
        where: {
            coopId: coop.id,
            status: "AVAILABLE",
        },
        orderBy: [
            {
                dueDate: "asc",
            },
            {
                createdAt: "desc",
            },
        ],
    });

    const availableTaskItems = availableTasks.map((task) => ({
        id: task.id,
        title: task.title,
        description: task.description,
        role: task.role,
        points: task.points,
        status: task.status,
        dueDateLabel: formatDate(task.dueDate),
    }));

    return (
        <CommandCenterPageShell
            coop={{
                id: coop.id,
                name: coop.name,
                description: coop.description,
            }}
            membership={{
                roles: membership.roles.map((membershipRole) => ({
                    role: membershipRole.role,
                })),
            }}
            nextEvent={nextEvent}
            tasks={myTaskItems}
            availableTasks={availableTaskItems}
        />
    );
};

export default CommandCenterPage;