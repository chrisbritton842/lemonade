import { ZodError } from 'zod';

export const EMPTY_ACTION_STATE: ActionState = {
    message: "",
    fieldErrors: {},
    timestamp: Date.now(),
};

export type ActionState = {
    status?: "SUCCESS" | "ERROR";
    message: string;
    payload?: FormData;
    fieldErrors: Record<string, string[] | undefined>;
    timestamp: number;
};

export const toActionState = (
    status: ActionState["status"],
    message: string,
    formData?: FormData
): ActionState => {
    return {
        status,
        message,
        fieldErrors: {},
        payload: formData,
        timestamp: Date.now(),
    };
};

export const fromErrorToActionState = (
    error: unknown,
    formData?: FormData
): ActionState => {
    if (error instanceof ZodError) {
        // if validation error with Zod, return first error message
        return {
            status: "ERROR",
            message: "",
            payload: formData,
            fieldErrors: error.flatten().fieldErrors,
            timestamp: Date.now()
        };
    } else if (error instanceof Error) {
        // if another error instance, return error message
        // e.g. database error
        return {
            status: "ERROR",
            message: error.message,
            payload: formData,
            fieldErrors: {},
            timestamp: Date.now(),
        };
    } else {
        // if not an error instance but something else crashed
        // return generic error message
        return {
            status: "ERROR",
            message: "An unknown error occurred.",
            payload: formData,
            fieldErrors: {},
            timestamp: Date.now(),
        };
    }
};