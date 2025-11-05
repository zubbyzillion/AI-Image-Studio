// @ts-nocheck
import { getUploadAuthParams } from "@imagekit/next/server";

export async function GET() {
  try {
    console.log("PRIVATE_KEY:", !!process.env.IMAGEKIT_PRIVATE_KEY);
console.log("PUBLIC_KEY:", !!process.env.IMAGEKIT_PUBLIC_KEY);

    // const currentTime = Math.floor(Date.now() / 1000); // current time in seconds
    // const expire = currentTime + 60 * 60; // 1 hour ahead

    // Generate authentication parameters using ImageKit SDK
    // const { token, signature } = getUploadAuthParams({
    //   privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,
    //   publicKey: process.env.IMAGEKIT_PUBLIC_KEY as string,
    //   expire,
    //   // Optional: expire time in seconds (max 1 hour)
    //   // expire: 30 * 60, // 30 minutes
    // });
    const currentTime = Math.floor(Date.now() / 1000);
    const expire = currentTime + 60 * 60; // 1 hour ahead

    const authParams = getUploadAuthParams({
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
      expire,
    });

    // Add a 30-min expire timestamp manually for the client only

        return new Response(
      JSON.stringify({
        token: authParams.token,
        signature: authParams.signature,
        expire, // ✅ include it
        publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Upload auth error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate upload authentication" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

//     return Response.json({
//       token,
//       expire,
//       signature,
//       publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
//     });
//   } catch (error) {
//     console.error("Upload auth error:", error);
//     return Response.json(
//       { error: "Failed to generate upload authentication" },
//       { status: 500 }
//     );
//   }
}