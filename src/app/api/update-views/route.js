import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

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

    const { data: clips, error } = await supabase
      .from("clips")
      .select("*")
      .eq("platform", "youtube");

    if (error) {
      return NextResponse.json({
        error: error.message,
      });
    }

    for (const clip of clips) {
      try {
        let videoId = null;

        // youtube shorts
        if (clip.link.includes("/shorts/")) {
          videoId = clip.link.split("/shorts/")[1]?.split("?")[0];
        }

        // youtube watch
        if (clip.link.includes("watch?v=")) {
          videoId = clip.link.split("watch?v=")[1]?.split("&")[0];
        }

        if (!videoId) continue;

        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=statistics&key=${YOUTUBE_API_KEY}`
        );

        const data = await response.json();

        if (!data.items || !data.items[0]) continue;

        const views = Number(
          data.items[0].statistics.viewCount || 0
        );

        await supabase
          .from("clips")
          .update({
            views,
          })
          .eq("id", clip.id);

      } catch (err) {
        console.log("Clip update failed:", err);
      }
    }

    return NextResponse.json({
      success: true,
    });

  } catch (err) {
    return NextResponse.json({
      error: err.message,
    });
  }
}