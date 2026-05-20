import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const youtubeApiKey = process.env.YOUTUBE_API_KEY;

function extractVideoId(url) {
  try {
    const parsed = new URL(url);

    // youtu.be links
    if (parsed.hostname.includes("youtu.be")) {
      return parsed.pathname.slice(1);
    }

    // youtube shorts links
    if (parsed.pathname.includes("/shorts/")) {
      return parsed.pathname
        .split("/shorts/")[1]
        .split("?")[0];
    }

    // normal youtube links
    return parsed.searchParams.get("v");
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    // CHECK ENV VARIABLES
    if (!supabaseUrl || !supabaseKey || !youtubeApiKey) {
      return NextResponse.json({
        error: "Missing environment variables",
      });
    }

    const supabase = createClient(
      supabaseUrl,
      supabaseKey
    );

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

    // LOOP THROUGH CLIPS
    for (const clip of clips) {
      const videoId = extractVideoId(clip.link);

      if (!videoId) {
        console.log("Invalid URL:", clip.link);
        continue;
      }

      // FETCH YOUTUBE DATA
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=statistics&key=${youtubeApiKey}`
      );

      const data = await response.json();

      const realViews =
        Number(
          data.items?.[0]?.statistics?.viewCount
        ) || 0;

      // MAX 300K COUNTED
      const cappedViews = Math.min(realViews, 300000);

      // UPDATE DATABASE
      await supabase
        .from("clips")
        .update({
          views: cappedViews,
        })
        .eq("id", clip.id);

      console.log(
        `Updated ${clip.link} -> ${cappedViews} views`
      );
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