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
            "anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351",
            {
                input: {
                    fps: 24,
                    model: "xl",
                    width: 1024,
                    height: 576,
                    prompt: "Clown fish swimming in a coral reef, beautiful, 8k, perfect, award winning, national geographic",
                    batch_size: 1,
                    num_frames: 24,
                    init_weight: 0.5,
                    guidance_scale: 17.5,
                    negative_prompt: "very blue, dust, noisy, washed out, ugly, distorted, broken",
                    remove_watermark: false,
                    num_inference_steps: 50
                }
            }

        );

        if (!isPro) {
            await incrementApiLimit(userId);
        }

        return response;

    } catch (error) {
        console.log("[VIDEO_ERROR]", error);
        return createError({
            statusCode: 500,
            statusMessage: "Internal Error"
        });
    }
}); 