import OpenAI from 'openai';

import { checkSubscription } from "@/lib/subscription";
import { incrementApiLimit, checkApiLimit } from "@/lib/api-limit";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export default defineEventHandler(async (event) => {

    const { auth } = event.context;

    const userId = auth?.userId;

    const { messages } = await readBody(event);

    if (!(userId)) {
        throw createError({
            statusCode: 401,
            statusMessage: "Unauthorized"
        });
    }

    if (!messages) {
        throw createError({
            statusCode: 400,
            statusMessage: "Messages are required"
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
        const chatCompletion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages,
        });

        if (!isPro) {
            await incrementApiLimit(userId);
        }

        return chatCompletion.choices[0].message;

    } catch (error) {
        console.log("[CONVERSATION_ERROR]", error);
        return createError({
            statusCode: 500,
            statusMessage: "Internal Error"
        });
    }
}); 