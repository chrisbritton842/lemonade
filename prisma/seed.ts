import {
    CoopRole,
    ProposalStatus,
    ProposalThreshold,
    ProposalType,
    TaskStatus,
    VoteChoice,
} from "../src/generated/prisma/enums";
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

    const demoMember = await prisma.user.upsert({
        where: {
            username: "demo_member",
        },
        update: {},
        create: {
            username: "demo_member",
            displayName: "Demo Member",
        },
    });

    const demoMembership = await prisma.membership.upsert({
        where: {
            userId_coopId: {
                userId: demoMember.id,
                coopId: coop.id,
            },
        },
        update: {},
        create: {
            userId: demoMember.id,
            coopId: coop.id,
        },
    });

    await prisma.membershipRole.upsert({
        where: {
            membershipId_role: {
                membershipId: demoMembership.id,
                role: CoopRole.MARKETING,
            },
        },
        update: {},
        create: {
            membershipId: demoMembership.id,
            role: CoopRole.MARKETING,
        },
    });

    await prisma.task.deleteMany({
        where: {
            coopId: coop.id,
        },
    });

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

    await prisma.proposal.deleteMany({
        where: {
            coopId: coop.id,
        },
    });

    await prisma.proposal.create({
        data: {
            coopId: coop.id,
            title: "Sell strawberry lemonade",
            description: "Add strawberry lemonade as a special flavor for the next sales day.",
            type: ProposalType.CREATE_PRODUCT,
            status: ProposalStatus.OPEN,
            threshold: ProposalThreshold.SIMPLE_MAJORITY,
            createdById: user.id,
            votes: {
                create: [
                    {
                        userId: user.id,
                        choice: VoteChoice.YES,
                    },
                    {
                        userId: demoMember.id,
                        choice: VoteChoice.YES,
                    },
                ],
            },
        },
    });

    await prisma.proposal.create({
        data: {
            coopId: coop.id,
            title: "Change sales day location",
            description: "Move the sales day to the park instead of the school.",
            type: ProposalType.UPDATE_SALES_DAY_LOCATION,
            status: ProposalStatus.OPEN,
            threshold: ProposalThreshold.SIMPLE_MAJORITY,
            createdById: demoMember.id,
            votes: {
                create: [
                    {
                        userId: user.id,
                        choice: VoteChoice.NO,
                    },
                    {
                        userId: demoMember.id,
                        choice: VoteChoice.YES,
                    },
                ],
            },
        },
    });

    await prisma.proposal.create({
        data: {
            coopId: coop.id,
            title: "Change sales day time",
            description: "Move the sales day to 3pm instead of 2pm.",
            type: ProposalType.UPDATE_SALES_DAY_TIME,
            status: ProposalStatus.OPEN,
            threshold: ProposalThreshold.SIMPLE_MAJORITY,
            createdById: user.id,
        },
    });

    await prisma.proposal.create({
        data: {
            coopId: coop.id,
            title: "Advertise on social media",
            description: "Promote the lemonade stand on social media platforms.",
            type: ProposalType.CREATE_TASK,
            status: ProposalStatus.OPEN,
            threshold: ProposalThreshold.SIMPLE_MAJORITY,
            createdById: demoMember.id,
        },
    });

    await prisma.proposal.create({
        data: {
            coopId: coop.id,
            title: "Change our voting rule",
            description: "Require two-thirds majority for big money decisions.",
            type: ProposalType.UPDATE_RULE,
            status: ProposalStatus.NEEDS_REVIEW,
            threshold: ProposalThreshold.TWO_THIRDS,
            createdById: user.id,
            votes: {
                create: [
                    {
                        userId: user.id,
                        choice: VoteChoice.YES,
                    },
                    {
                        userId: demoMember.id,
                        choice: VoteChoice.YES,
                    },
                ],
            },
        },
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