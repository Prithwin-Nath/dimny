import { supabase } from "@/lib/supabase";

export async function GET() {

  try {

    const { data: clips, error } =
      await supabase
        .from("clips")
        .select("*");

    if (error) {

      return Response.json({
        success: false,
        error: error.message,
      });
    }

    let updated = 0;

    for (const clip of clips) {

      const currentViews =
        clip.views || 0;

      // RANDOM GROWTH
      const randomViews =
        Math.floor(
          Math.random() * 5000
        ) + 1000;

      const newViews =
        currentViews + randomViews;

      const { error: updateError } =
        await supabase
          .from("clips")
          .update({
            views: newViews,
          })
          .eq("id", clip.id);

      if (!updateError) {
        updated++;
      }
    }

    return Response.json({
      success: true,
      updated,
    });

  } catch (err) {

    return Response.json({
      success: false,
      error: err.message,
    });
  }
}