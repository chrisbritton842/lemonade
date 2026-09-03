import { CoopRole } from "@/generated/prisma/enums";

const roleLabels: Record<CoopRole, string> = {
    [CoopRole.MEMBER]: "Partner",
    [CoopRole.BOARD_OF_DIRECTORS]: "Board Member",
    [CoopRole.PRODUCTION]: "Production Coordinator",
    [CoopRole.CUSTOMER_SERVICE]: "Customer Service Representative",
    [CoopRole.INVENTORY]: "Inventory Coordinator",
    [CoopRole.MARKETING]: "Marketing Coordinator",
    [CoopRole.ACCOUNTING]: "Treasurer",
};

export { roleLabels };