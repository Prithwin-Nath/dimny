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

  const fetchClips = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("clips")
      .select("*")
      .eq("user_email", user.email)
      .order("created_at", {
        ascending: false,
      });

    if (!error) {
      setClips(data || []);
    }
  };

  const showMessage = (text) => {
    setMessage(text);

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

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

  const platformStyle = (type) =>
    `flex-1 py-4 rounded-2xl border transition-all duration-300 font-semibold ${
      form.platform === type
        ? "bg-gradient-to-r from-orange-400 to-orange-600 text-white border-orange-500"
        : "bg-black border-white/10 hover:bg-white/10"
    }`;

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

  // APPROVED ONLY FOR TOP STATS
  const approvedOnly = clips.filter(
    (clip) => clip.status === "approved"
  );

  const totalViews = approvedOnly.reduce(
    (sum, clip) => sum + (clip.views || 0),
    0
  );

  const totalEarnings = approvedOnly.reduce(
    (sum, clip) =>
      sum +
      ((Math.min(clip.views || 0, 300000) /
        1000) *
        0.3),
    0
  );

  // SECTIONS
  const pendingClips = clips.filter(
    (clip) => clip.status === "pending"
  );

  const approvedClips = clips.filter(
    (clip) => clip.status === "approved"
  );

  const rejectedClips = clips.filter(
    (clip) => clip.status === "rejected"
  );

  // CARD
  const renderClipCard = (
    clip,
    index
  ) => {

    const cappedViews = Math.min(
      clip.views || 0,
      300000
    );

    const earnings =
      (cappedViews / 1000) * 0.3;

    return (
      <motion.div
        key={clip.id}
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          delay: index * 0.05,
        }}
        className="bg-white/[0.03] border border-white/10 rounded-3xl p-6"
      >

        <div className="flex items-center gap-3 mb-5">

          <span className="bg-orange-500/20 text-orange-400 px-4 py-1 rounded-full text-sm uppercase font-semibold">
            {clip.platform}
          </span>

          <span
            className={`px-4 py-1 rounded-full text-sm capitalize font-semibold ${statusStyle(
              clip.status
            )}`}
          >
            {clip.status}
          </span>

        </div>

        <a
          href={clip.link}
          target="_blank"
          className="break-all text-zinc-300 hover:text-orange-400 block mb-5"
        >
          {clip.link}
        </a>

        <div className="flex flex-wrap gap-3">

          <div className="bg-white/5 border border-white/10 px-5 py-3 rounded-2xl min-w-[140px]">

            <p className="text-xs text-zinc-500 mb-1">
              Views
            </p>

            <p className="font-black text-2xl text-white">
              {(clip.views || 0).toLocaleString()}
            </p>

          </div>

          <div className="bg-white/5 border border-white/10 px-5 py-3 rounded-2xl min-w-[140px]">

            <p className="text-xs text-zinc-500 mb-1">
              Earnings
            </p>

            <p className="font-black text-2xl text-green-400">
              ${earnings.toFixed(2)}
            </p>

          </div>

        </div>

      </motion.div>
    );
  };

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden relative">

      {/* BG */}

      <div className="absolute top-[-250px] left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-orange-500/10 blur-[140px] rounded-full pointer-events-none" />

      <Navbar />

      {/* TOAST */}

      <AnimatePresence>
        {message && (
          <motion.div
            initial={{
              opacity: 0,
              y: -20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -20,
            }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="bg-zinc-900 border border-white/10 rounded-3xl px-6 py-4">
              {message}
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

        {/* TOP STATS */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">

          <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6">

            <p className="text-zinc-500 text-sm mb-2">
              Approved Views
            </p>

            <h2 className="text-5xl font-black text-orange-400">
              {totalViews.toLocaleString()}
            </h2>

          </div>

          <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6">

            <p className="text-zinc-500 text-sm mb-2">
              Approved Earnings
            </p>

            <h2 className="text-5xl font-black text-green-400">
              ${totalEarnings.toFixed(2)}
            </h2>

          </div>

        </div>

        {/* DISCORD BUTTON */}

        <div className="mb-10">

          <a
            href="https://discord.gg/XePVKRtf5"
            target="_blank"
            className="inline-block bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-4 rounded-2xl font-bold text-lg"
          >
            Open Discord Ticket
          </a>

        </div>

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="bg-white/[0.03] border border-white/10 rounded-[32px] p-8"
        >

          <div className="flex flex-col gap-8">

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

        {/* PENDING */}

        <div className="mt-20 mb-16">

          <h2 className="text-3xl font-black mb-6 text-yellow-400">
            Pending Clips
          </h2>

          <div className="space-y-5">

            {pendingClips.length === 0 ? (
              <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-10 text-center text-zinc-500">
                No pending clips.
              </div>
            ) : (
              pendingClips.map(renderClipCard)
            )}

          </div>

        </div>

        {/* APPROVED */}

        <div className="mb-16">

          <h2 className="text-3xl font-black mb-6 text-green-400">
            Approved Clips
          </h2>

          <div className="space-y-5">

            {approvedClips.length === 0 ? (
              <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-10 text-center text-zinc-500">
                No approved clips.
              </div>
            ) : (
              approvedClips.map(renderClipCard)
            )}

          </div>

        </div>

        {/* REJECTED */}

        <div>

          <h2 className="text-3xl font-black mb-6 text-red-400">
            Rejected Clips
          </h2>

          <div className="space-y-5">

            {rejectedClips.length === 0 ? (
              <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-10 text-center text-zinc-500">
                No rejected clips.
              </div>
            ) : (
              rejectedClips.map(renderClipCard)
            )}

          </div>

        </div>

      </div>

    </main>
  );
}