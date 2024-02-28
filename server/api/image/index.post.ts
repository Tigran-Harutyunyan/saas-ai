import OpenAI from 'openai';

import { checkSubscription } from "@/lib/subscription";
import { incrementApiLimit, checkApiLimit } from "@/lib/api-limit";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export default defineEventHandler(async (event) => {

    const { auth } = event.context;

    const userId = auth?.userId;

    const { prompt, amount = 1, resolution = "512x512" } = await readBody(event);

    if (!(userId)) {
        throw createError({
            statusCode: 401,
            statusMessage: "Unauthorized"
        });
    }

    if (!prompt) {
        throw createError({
            statusCode: 400,
            statusMessage: "Prompt is required"
        });
    }

    if (!amount) {
        throw createError({
            statusCode: 400,
            statusMessage: "Amount is required"
        });
    }

    if (!resolution) {
        throw createError({
            statusCode: 400,
            statusMessage: "resolution is required"
        });
    } 

    const freeTrial = await checkApiLimit(userId);
    const isPro = await checkSubscription(userId);

    if (!freeTrial && !isPro) {
        throw createError({
            statusCode: 403,
            statusMessage: "Free trial has expired. Please upgrade to pro."
        });
    }

    try {
         
        const response = await openai.images.generate   ({
            prompt,
            n: parseInt(amount, 10),
            size: resolution,
          });

        if (!isPro) {
            await incrementApiLimit(userId);
        }

        return response.data;

    } catch (error) {
        console.log("[IMAGE_ERROR]", error);
        return createError({
            statusCode: 500,
            statusMessage: "Internal Error"
        });
    }
}); 