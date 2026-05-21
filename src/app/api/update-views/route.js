import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";

const API_KEY = process.env.YOUTUBE_API_KEY;

export async function GET() {

  try {

    const { data: clips, error } = await supabase
      .from("clips")
      .select("*")
      .eq("platform", "youtube");

    if (error) {

      return NextResponse.json({
        success: false,
        error,
      });
    }

    let updated = 0;

    for (const clip of clips) {

      try {

        let videoId = "";

        // SHORTS
        if (clip.link.includes("/shorts/")) {

          videoId =
            clip.link
              .split("/shorts/")[1]
              ?.split("?")[0];

        }

        // NORMAL YOUTUBE LINK
        else if (clip.link.includes("v=")) {

          videoId =
            clip.link
              .split("v=")[1]
              ?.split("&")[0];
        }

        if (!videoId) continue;

        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoId}&key=${API_KEY}`
        );

        const data = await response.json();

        const views =
          data?.items?.[0]?.statistics?.viewCount;

        if (!views) continue;

        await supabase
          .from("clips")
          .update({
            views: Number(views),
          })
          .eq("id", clip.id);

        updated++;

      } catch (err) {

        console.log(err);
      }
    }

    return NextResponse.json({
      success: true,
      updated,
    });

  } catch (error) {

    return NextResponse.json({
      success: false,
      error,
    });
  }
}