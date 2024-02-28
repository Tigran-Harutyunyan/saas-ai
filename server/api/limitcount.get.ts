import prismadb from "@/lib/prismadb";

export default defineEventHandler(async (event) => {

    const { auth } = event.context;

    const userId = auth.userId;

    if (!(userId)) {
        throw createError({
            statusCode: 401,
            statusMessage: "Unauthorized"
        });
    }

    try {

        if (!userId) {
            return 0;
        }

        const userApiLimit = await prismadb.userApiLimit.findUnique({
            where: {
                userId
            }
        });

        if (!userApiLimit) {
            return 0;
        }

        return userApiLimit.count;

    } catch (error) {
        console.log("[API_LIMIT]", error);
        return createError({
            statusCode: 500,
            statusMessage: "Internal Error"
        });
    }
}); 