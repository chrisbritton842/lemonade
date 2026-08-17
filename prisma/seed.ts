import { CoopRole,TaskStatus } from "../src/generated/prisma/enums";
import { prisma } from "../src/lib/prisma";

const main = async () => {
    const user = await prisma.user.findFirst({
        orderBy: {
            createdAt: "asc",
        },
    });

    if (!user) {
        throw new Error("No user found. Sign up first before seeding tasks.");
    }

    const coop = await prisma.cooperative.findFirst({
        where: {
            memberships: {
                some: {
                    userId: user.id,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    if (!coop) {
        throw new Error("No cooperative found. Create a business first.")
    }

    await prisma.task.createMany({
        data: [
            {
                coopId: coop.id,
                title: "Make sign for lemonade stand",
                description: "Create a colorful sign for the stand.",
                assignedToId: user.id,
                points: 2,
                status: TaskStatus.ASSIGNED,
                dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24),
            },
            {
                coopId: coop.id,
                title: "Bring cups",
                description: "Bring enough cups for the first sales day.",
                assignedToId: user.id,
                points: 1,
                status: TaskStatus.ASSIGNED,
                dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
            },
            {
                coopId: coop.id,
                title: "Choose lemonade recipe", 
                description: "Find a lemonade recipe and test it.",
                assignedToId: user.id,
                points: 1,
                status: TaskStatus.NEEDS_REVIEW,
            },
            {
                coopId: coop.id,
                title: "Buy lemons",
                description: "Get lemons before the sales day.",
                assignedToId: null,
                role: CoopRole.INVENTORY,
                points: 2,
                status: TaskStatus.AVAILABLE,
            },
            {
                coopId: coop.id,
                title: "Count starting cash",
                description: "Check how much change the stand has before selling.",
                assignedToId: null,
                role: CoopRole.ACCOUNTING,
                points: 2,
                status: TaskStatus.AVAILABLE,
            },
            {
                coopId: coop.id,
                title: "Make posters",
                description: "Create signs for the stand.",
                assignedToId: null,
                role: CoopRole.MARKETING,
                points: 2,
                status: TaskStatus.AVAILABLE,
            },
            {
                coopId: coop.id,
                title: "Make social media post",
                description: "Create a post for social media to promote the stand.",
                assignedToId: null,
                role: CoopRole.MARKETING,
                points: 1,
                status: TaskStatus.AVAILABLE,
            },
            {
                coopId: coop.id,
                title: "Mix lemonade",
                description: "Mix the lemonade for the stand.",
                assignedToId: null,
                role: CoopRole.PRODUCTION,
                points: 2,
                status: TaskStatus.AVAILABLE,
            },
        ],
    });

    console.log(`Seeded tasks for ${coop.name}.`);
};

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });