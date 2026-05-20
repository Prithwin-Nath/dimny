import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

// EXTRACT VIDEO ID
function extractVideoId(url) {
  try {
    const parsed = new URL(url);

    // youtu.be links
    if (parsed.hostname.includes("youtu.be")) {
      return parsed.pathname.slice(1);
    }

    // youtube shorts
    if (parsed.pathname.includes("/shorts/")) {
      return parsed.pathname.split("/shorts/")[1];
    }

    // normal youtube links
    return parsed.searchParams.get("v");
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    // GET ALL YOUTUBE CLIPS
    const { data: clips, error } = await supabase
      .from("clips")
      .select("*")
      .eq("platform", "youtube");

    if (error) {
      return NextResponse.json({
        error: error.message,
      });
    }

    // LOOP THROUGH EACH CLIP
    for (const clip of clips) {
      const videoId = extractVideoId(clip.link);

      if (!videoId) continue;

      // FETCH YOUTUBE STATS
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=statistics&key=${YOUTUBE_API_KEY}`
      );

      const data = await response.json();

      const views =
        data.items?.[0]?.statistics?.viewCount || 0;

      // UPDATE SUPABASE
      await supabase
        .from("clips")
        .update({
          views: Number(views),
          status: "approved",
        })
        .eq("id", clip.id);
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