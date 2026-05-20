import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const youtubeApiKey = process.env.YOUTUBE_API_KEY;

export async function GET() {
  try {
    // CHECK ENV VARIABLES
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({
        error: "Missing Supabase environment variables",
      });
    }

    const supabase = createClient(
      supabaseUrl,
      supabaseKey
    );

    // GET CLIPS
    const { data: clips, error } = await supabase
      .from("clips")
      .select("*")
      .eq("platform", "youtube");

    if (error) {
      return NextResponse.json({
        error: error.message,
      });
    }

    // EXTRACT VIDEO ID
    function extractVideoId(url) {
      try {
        const parsed = new URL(url);

        if (parsed.hostname.includes("youtu.be")) {
          return parsed.pathname.slice(1);
        }

        if (parsed.pathname.includes("/shorts/")) {
          return parsed.pathname.split("/shorts/")[1];
        }

        return parsed.searchParams.get("v");
      } catch {
        return null;
      }
    }

    // UPDATE EACH CLIP
    for (const clip of clips) {
      const videoId = extractVideoId(clip.link);

      if (!videoId) continue;

      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=statistics&key=${youtubeApiKey}`
      );

      const data = await response.json();

      const views =
        data.items?.[0]?.statistics?.viewCount || 0;

      await supabase
        .from("clips")
        .update({
          views: Number(views),
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