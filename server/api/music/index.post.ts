import Replicate from "replicate";

import { checkSubscription } from "@/lib/subscription";
import { incrementApiLimit, checkApiLimit } from "@/lib/api-limit";

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN!,
});

export default defineEventHandler(async (event) => {

    const { auth } = event.context;

    const userId = auth?.userId;

    const { prompt } = await readBody(event);

    if (!(userId)) {
        throw createError({
            statusCode: 401,
            statusMessage: "Unauthorized"
        });
    }

    if (!prompt) {
        throw createError({
            statusCode: 400,
            statusMessage: "Prompt are required"
        });
    }

    const freeTrial = await checkApiLimit(userId);
    const isPro = await checkSubscription(userId);

    if (!freeTrial && !isPro) {
        throw createError({
            statusCode: 403,
            statusMessage: "Free trial has expired. Please upgrade to pro.",
        });
    }

    try {
        const response = await replicate.run(
            "riffusion/riffusion:8cf61ea6c56afd61d8f5b9ffd14d7c216c0a93844ce2d82ac1c9ecc9c7f24e05",
            {
                input: {
                    prompt_a: prompt
                }
            }
        );

        if (!isPro) {
            await incrementApiLimit(userId);
        }

        return response;

    } catch (error) {
        console.log("[MUSIC_ERROR]", error);
        return createError({
            statusCode: 500,
            statusMessage: "Internal Error"
        });
    }
}); 