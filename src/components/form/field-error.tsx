import { ActionState } from "@/components/form/utils/to-action-state";

type FieldErrorProps = {
    actionState: ActionState;
    name: string;
};

const FieldError = ({ actionState, name }: FieldErrorProps) => {
    const message = actionState.fieldErrors[name]?.[0];

    if (!message) return null;

    return <p className="mt-2 text-sm text-red-600">{message}</p>;
};

export { FieldError };