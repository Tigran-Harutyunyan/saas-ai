import * as z from "zod";
import { toTypedSchema } from "@vee-validate/zod";

export const formSchema = toTypedSchema(
    z.object({
        prompt: z.string().min(1, {
            message: "Prompt is required."
        }),
    })
);