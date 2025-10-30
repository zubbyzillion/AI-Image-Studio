// @ts-nocheck
import { getUploadAuthParams } from "@imagekit/next/server";

export async function GET() {
    try {
        // generate authentication parameters using ImageKit SDK

        const { token, expire, signature } = getUploadAuthParams({
            privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
            publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
        });
        return Response.json({
            token,
            expire,
            signature,
            publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
        })
    } catch (error) {
        console.error(error);
        return Response.json(
            { error: "Failed to generate upload authentication" },
            { status: 500 }
        )
    }
}