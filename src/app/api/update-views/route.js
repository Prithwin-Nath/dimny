import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const YOUTUBE_API_KEY =
  process.env.YOUTUBE_API_KEY;

function extractVideoId(url) {

  try {

    // shorts
    if (url.includes("/shorts/")) {
      return url
        .split("/shorts/")[1]
        ?.split("?")[0];
    }

    // watch?v=
    if (url.includes("watch?v=")) {
      return url
        .split("watch?v=")[1]
        ?.split("&")[0];
    }

    // youtu.be
    if (url.includes("youtu.be/")) {
      return url
        .split("youtu.be/")[1]
        ?.split("?")[0];
    }

    return null;

  } catch {
    return null;
  }
}

export async function GET() {

  try {

    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.SUPABASE_SERVICE_ROLE_KEY ||
      !YOUTUBE_API_KEY
    ) {
      return NextResponse.json({
        error: "Missing environment variables",
      });
    }

    const { data: clips, error } =
      await supabase
        .from("clips")
        .select("*")
        .eq("platform", "youtube");

    if (error) {
      return NextResponse.json({
        error: error.message,
      });
    }

    let updated = 0;

    for (const clip of clips) {

      try {

        const videoId =
          extractVideoId(clip.link);

        if (!videoId) {
          console.log(
            "Invalid video ID:",
            clip.link
          );
          continue;
        }

        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=statistics&key=${YOUTUBE_API_KEY}`
        );

        const data =
          await response.json();

        if (
          !data.items ||
          !data.items[0]
        ) {
          console.log(
            "No data for:",
            videoId
          );
          continue;
        }

        const views = Number(
          data.items[0].statistics
            .viewCount || 0
        );

        await supabase
          .from("clips")
          .update({
            views,
          })
          .eq("id", clip.id);

        updated++;

      } catch (err) {

        console.log(
          "Clip update failed:",
          err
        );
      }
    }

    return NextResponse.json({
      success: true,
      updated,
    });

  } catch (err) {

    return NextResponse.json({
      error: err.message,
    });
  }
}