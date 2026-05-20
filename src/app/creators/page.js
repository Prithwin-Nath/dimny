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

  const totalEarnings = clips.reduce(
    (sum, clip) =>
      sum +
      (((clip.views || 0) / 1000) * 0.3),
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

      {/* BACKGROUND GLOW */}
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
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.1,
          }}
          className="mb-14"
        >

          <h1 className="text-5xl lg:text-6xl font-black mb-4">
            Creator Dashboard
          </h1>

          <p className="text-zinc-400 text-lg">
            Submit and manage your clips.
          </p>

        </motion.div>

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

          </div>

        </div>

        {/* FORM */}
        <motion.form
          initial={{
            opacity: 0,
            y: 25,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.2,
          }}
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
                className="w-full p-5 rounded-2xl bg-black border border-white/10 outline-none focus:border-orange-500 focus:shadow-[0_0_25px_rgba(255,140,0,0.15)] transition-all duration-300"
              />

            </div>

            {/* BUTTON */}
            <motion.button
              whileHover={{
                scale: 1.02,
              }}
              whileTap={{
                scale: 0.98,
              }}
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-orange-400 to-orange-600 py-4 rounded-2xl font-bold text-lg transition-all duration-300 disabled:opacity-50 shadow-xl shadow-orange-500/20"
            >

              {loading
                ? "Submitting..."
                : "Submit Clip"}

            </motion.button>

          </div>

        </motion.form>

        {/* CLIPS */}
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            delay: 0.3,
          }}
          className="mt-16"
        >

          <div className="flex items-center justify-between mb-8">

            <h2 className="text-3xl font-black">
              Submitted Clips
            </h2>

            <div className="bg-orange-500/10 border border-orange-500/20 px-4 py-2 rounded-2xl text-orange-400 font-semibold">
              {clips.length} Clips
            </div>

          </div>

          <div className="space-y-5">

            {clips.length === 0 ? (
              <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-10 text-center text-zinc-500">
                No clips submitted yet.
              </div>
            ) : (
              clips.map((clip, index) => (
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
                  whileHover={{
                    scale: 1.01,
                  }}
                  className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 hover:border-orange-500/20 transition-all duration-300"
                >

                  <div className="flex items-center gap-3 mb-5">

                    <span className="bg-orange-500/20 text-orange-400 px-4 py-1 rounded-full text-sm uppercase font-semibold border border-orange-500/10">
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

                  <div className="space-y-4">

                    <a
                      href={clip.link}
                      target="_blank"
                      className="break-all text-zinc-300 hover:text-orange-400 transition-all duration-300 block"
                    >
                      {clip.link}
                    </a>

                    {/* STATS */}
                    <div className="flex flex-wrap items-center gap-3">

                      {/* VIEWS */}
                      <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-2xl">
                        <p className="text-xs text-zinc-500 mb-1">
                          Views
                        </p>

                        <p className="font-bold text-white">
                          {clip.views || 0}
                        </p>
                      </div>

                      {/* EARNINGS */}
                      <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-2xl">
                        <p className="text-xs text-zinc-500 mb-1">
                          Earnings
                        </p>

                        <p className="font-bold text-orange-400">
                          $
                          {(
                            ((clip.views || 0) / 1000) *
                            0.3
                          ).toFixed(2)}
                        </p>
                      </div>

                      {/* DATE */}
                      <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-2xl">
                        <p className="text-xs text-zinc-500 mb-1">
                          Submitted
                        </p>

                        <p className="font-bold text-white">
                          {new Date(
                            clip.created_at
                          ).toLocaleDateString()}
                        </p>
                      </div>

                    </div>

                  </div>

                </motion.div>
              ))
            )}

          </div>

        </motion.div>

      </div>

    </motion.main>
  );
}