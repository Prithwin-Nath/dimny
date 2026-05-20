"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../../components/Navbar";
import { supabase } from "../../lib/supabase";

export default function CreatorsPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    link: "",
    platform: "youtube",
  });

  const [loading, setLoading] = useState(false);
  const [clips, setClips] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    checkUser();
  }, []);

  // CHECK USER
  const checkUser = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      router.push("/auth");
      return;
    }

    fetchClips();
  };

  // FETCH CLIPS
  const fetchClips = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("clips")
      .select("*")
      .eq("user_email", user.email)
      .order("created_at", {
        ascending: false,
      });

    setClips(data || []);
  };

  // TOAST
  const showMessage = (text) => {
    setMessage(text);

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const username =
      user.user_metadata?.username || "Unknown";

    const { data: existing } = await supabase
      .from("clips")
      .select("*")
      .eq("link", form.link);

    if (existing && existing.length > 0) {
      showMessage("⚠️ Clip already submitted.");
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from("clips")
      .insert([
        {
          link: form.link,
          platform: form.platform,
          status: "pending",
          user_email: user.email,
          username,
          views: 0,
        },
      ]);

    if (!error) {
      showMessage("✅ Clip submitted!");

      setForm({
        link: "",
        platform: "youtube",
      });

      fetchClips();
    }

    setLoading(false);
  };

  // REQUEST PAYOUT
  const requestPayout = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    // ONLY APPROVED CLIPS COUNT
    const approvedClips = clips.filter(
      (clip) => clip.status === "approved"
    );

    // MAX 300K VIEWS PER VIDEO
    const payoutViews = approvedClips.reduce(
      (sum, clip) =>
        sum + Math.min(clip.views || 0, 300000),
      0
    );

    const payoutAmount =
      (payoutViews / 1000) * 0.3;

    if (payoutAmount <= 0) {
      showMessage("⚠️ No payout available yet.");
      return;
    }

    const { error } = await supabase
      .from("payout_requests")
      .insert([
        {
          user_email: user.email,
          username:
            user.user_metadata?.username ||
            "Unknown",
          amount: payoutAmount,
          total_views: payoutViews,
          status: "pending",
        },
      ]);

    if (!error) {
      showMessage("✅ Payout requested!");
    } else {
      showMessage("❌ Failed to request payout.");
    }
  };

  // PLATFORM STYLE
  const platformStyle = (type) =>
    `flex-1 py-4 rounded-2xl border transition-all duration-300 font-semibold ${
      form.platform === type
        ? "bg-gradient-to-r from-orange-400 to-orange-600 text-white border-orange-500 shadow-lg shadow-orange-500/20 scale-[1.02]"
        : "bg-black border-white/10 hover:bg-white/10"
    }`;

  // STATUS STYLE
  const statusStyle = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-500/20 text-green-400 border border-green-500/20";

      case "rejected":
        return "bg-red-500/20 text-red-400 border border-red-500/20";

      default:
        return "bg-yellow-500/20 text-yellow-300 border border-yellow-500/20";
    }
  };

  // TOTAL STATS
  const totalViews = clips.reduce(
    (sum, clip) => sum + (clip.views || 0),
    0
  );

  // ONLY COUNT 300K MAX PER VIDEO
  const totalEarnings = clips.reduce(
    (sum, clip) =>
      sum +
      ((Math.min(clip.views || 0, 300000) /
        1000) *
        0.3),
    0
  );

  return (
    <motion.main
      initial={{
        opacity: 0,
        y: 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.5,
      }}
      className="min-h-screen bg-black text-white overflow-hidden relative"
    >

      {/* BACKGROUND */}
      <div className="absolute top-[-250px] left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-orange-500/10 blur-[140px] rounded-full pointer-events-none" />

      <Navbar />

      {/* TOAST */}
      <AnimatePresence>

        {message && (
          <motion.div
            initial={{
              opacity: 0,
              y: -20,
              scale: 0.9,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: -20,
              scale: 0.9,
            }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50"
          >

            <div className="bg-zinc-900/95 border border-white/10 backdrop-blur-2xl rounded-3xl px-6 py-4 flex items-center gap-4 shadow-2xl">

              <div className="w-12 h-12 rounded-2xl bg-orange-500/20 flex items-center justify-center text-orange-400 text-xl">
                ✦
              </div>

              <div>
                <p className="font-bold">
                  DIMNY
                </p>

                <p className="text-sm text-zinc-400">
                  {message}
                </p>
              </div>

            </div>

          </motion.div>
        )}

      </AnimatePresence>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-20">

        {/* HEADER */}
        <div className="mb-14">

          <h1 className="text-5xl lg:text-6xl font-black mb-4">
            Creator Dashboard
          </h1>

          <p className="text-zinc-400 text-lg">
            Submit and manage your clips.
          </p>

        </div>

        {/* TOTAL STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">

          {/* TOTAL VIEWS */}
          <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6">

            <p className="text-zinc-500 text-sm mb-2">
              Total Views
            </p>

            <h2 className="text-5xl font-black text-orange-400">
              {totalViews.toLocaleString()}
            </h2>

          </div>

          {/* TOTAL EARNINGS */}
          <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6">

            <p className="text-zinc-500 text-sm mb-2">
              Total Earnings
            </p>

            <h2 className="text-5xl font-black text-green-400">
              ${totalEarnings.toFixed(2)}
            </h2>

            <p className="text-xs text-zinc-500 mt-2">
              Max 300K views counted per video
            </p>

          </div>

        </div>

        {/* PAYOUT BUTTON */}
        <div className="mb-10">

          <button
            onClick={requestPayout}
            className="bg-gradient-to-r from-green-400 to-green-600 px-8 py-4 rounded-2xl font-bold text-lg shadow-xl"
          >
            Request Payout
          </button>

        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="bg-white/[0.03] border border-white/10 rounded-[32px] p-8 backdrop-blur-xl shadow-2xl"
        >

          <div className="flex flex-col gap-8">

            {/* PLATFORM */}
            <div>

              <p className="mb-4 text-zinc-400">
                Select Platform
              </p>

              <div className="grid grid-cols-3 gap-3">

                <button
                  type="button"
                  onClick={() =>
                    setForm({
                      ...form,
                      platform: "youtube",
                    })
                  }
                  className={platformStyle("youtube")}
                >
                  YouTube
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setForm({
                      ...form,
                      platform: "tiktok",
                    })
                  }
                  className={platformStyle("tiktok")}
                >
                  TikTok
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setForm({
                      ...form,
                      platform: "instagram",
                    })
                  }
                  className={platformStyle("instagram")}
                >
                  Instagram
                </button>

              </div>

            </div>

            {/* LINK */}
            <div>

              <p className="mb-4 text-zinc-400">
                Video Link
              </p>

              <input
                type="url"
                placeholder="Paste your clip..."
                value={form.link}
                onChange={(e) =>
                  setForm({
                    ...form,
                    link: e.target.value,
                  })
                }
                required
                className="w-full p-5 rounded-2xl bg-black border border-white/10 outline-none"
              />

            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-orange-400 to-orange-600 py-4 rounded-2xl font-bold text-lg"
            >

              {loading
                ? "Submitting..."
                : "Submit Clip"}

            </button>

          </div>

        </form>

      </div>

    </motion.main>
  );
}