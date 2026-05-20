"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminPage() {

  const [clips, setClips] = useState([]);
  const [message, setMessage] = useState("");

  const [password, setPassword] =
    useState("");

  const [authorized, setAuthorized] =
    useState(false);

  const ADMIN_PASSWORD = "richu2105";

  useEffect(() => {
    if (authorized) {
      fetchClips();
    }
  }, [authorized]);

  const showMessage = (text) => {

    setMessage(text);

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  const fetchClips = async () => {

    const { data, error } =
      await supabase
        .from("clips")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

    if (!error) {
      setClips(data || []);
    }
  };

  const updateStatus = async (
    id,
    status
  ) => {

    const { error } = await supabase
      .from("clips")
      .update({ status })
      .eq("id", id);

    if (!error) {

      setClips((prev) =>
        prev.map((clip) =>
          clip.id === id
            ? {
                ...clip,
                status,
                views:
                  status === "payouted"
                    ? 0
                    : clip.views,
              }
            : clip
        )
      );

      // RESET VIEWS AFTER PAYOUT
      if (status === "payouted") {

        await supabase
          .from("clips")
          .update({
            views: 0,
          })
          .eq("id", id);
      }

      showMessage(
        `✅ Clip ${status}`
      );
    }
  };

  const deleteClip = async (id) => {

    const confirmed =
      window.confirm(
        "Delete this clip?"
      );

    if (!confirmed) return;

    const { error } = await supabase
      .from("clips")
      .delete()
      .eq("id", id);

    if (!error) {

      setClips((prev) =>
        prev.filter(
          (clip) => clip.id !== id
        )
      );

      showMessage(
        "🗑️ Clip deleted."
      );
    }
  };

  const pendingClips = clips.filter(
    (clip) =>
      clip.status === "pending"
  );

  const approvedClips = clips.filter(
    (clip) =>
      clip.status === "approved"
  );

  const rejectedClips = clips.filter(
    (clip) =>
      clip.status === "rejected"
  );

  const payoutedClips = clips.filter(
    (clip) =>
      clip.status === "payouted"
  );

  const renderSection = (
    title,
    data
  ) => (

    <div className="mb-16">

      <h2 className="text-4xl font-black mb-8">
        {title}
      </h2>

      <div className="space-y-6">

        {data.length === 0 ? (

          <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-10 text-zinc-500">
            No clips here.
          </div>

        ) : (

          data.map((clip) => {

            const earnings =
              ((clip.views || 0) /
                1000) *
              0.3;

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
                className="bg-white/[0.03] border border-white/10 rounded-[36px] p-8"
              >

                <div className="flex flex-col gap-6">

                  <div>

                    <p className="text-orange-400 font-bold text-xl">
                      @{clip.username}
                    </p>

                    <p className="text-zinc-500 text-sm mb-4">
                      {clip.user_email}
                    </p>

                    <a
                      href={clip.link}
                      target="_blank"
                      className="break-all text-white"
                    >
                      {clip.link}
                    </a>

                  </div>

                  <div className="flex flex-wrap gap-4">

                    <div className="bg-black/40 px-5 py-4 rounded-2xl">

                      <p className="text-zinc-500 text-sm">
                        Views
                      </p>

                      <p className="text-3xl font-black">
                        {(
                          clip.views || 0
                        ).toLocaleString()}
                      </p>

                    </div>

                    <div className="bg-black/40 px-5 py-4 rounded-2xl">

                      <p className="text-zinc-500 text-sm">
                        Earnings
                      </p>

                      <p className="text-3xl font-black text-green-400">
                        $
                        {earnings.toFixed(
                          2
                        )}
                      </p>

                    </div>

                  </div>

                  <div className="flex flex-wrap gap-3">

                    <button
                      onClick={() =>
                        updateStatus(
                          clip.id,
                          "approved"
                        )
                      }
                      className={`px-5 py-3 rounded-2xl font-bold transition-all ${
                        clip.status ===
                        "approved"
                          ? "bg-green-500 text-white"
                          : "bg-green-500/20 text-green-400"
                      }`}
                    >
                      Approve
                    </button>

                    <button
                      onClick={() =>
                        updateStatus(
                          clip.id,
                          "rejected"
                        )
                      }
                      className={`px-5 py-3 rounded-2xl font-bold transition-all ${
                        clip.status ===
                        "rejected"
                          ? "bg-red-500 text-white"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      Reject
                    </button>

                    <button
                      onClick={() =>
                        updateStatus(
                          clip.id,
                          "payouted"
                        )
                      }
                      className={`px-5 py-3 rounded-2xl font-bold transition-all ${
                        clip.status ===
                        "payouted"
                          ? "bg-blue-500 text-white"
                          : "bg-blue-500/20 text-blue-400"
                      }`}
                    >
                      Payouted
                    </button>

                    <button
                      onClick={() =>
                        deleteClip(
                          clip.id
                        )
                      }
                      className="bg-white/5 border border-white/10 px-5 py-3 rounded-2xl"
                    >
                      Delete
                    </button>

                  </div>

                </div>

              </motion.div>
            );
          })
        )}

      </div>

    </div>
  );

  if (!authorized) {

    return (

      <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">

        <div className="w-full max-w-md bg-white/[0.03] border border-white/10 rounded-[36px] p-8">

          <h1 className="text-5xl font-black mb-6 text-center">
            Admin Access
          </h1>

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            className="w-full p-5 rounded-2xl bg-black border border-white/10 outline-none mb-5"
          />

          <button
            onClick={() => {

              if (
                password ===
                ADMIN_PASSWORD
              ) {

                setAuthorized(
                  true
                );

              } else {

                showMessage(
                  "❌ Wrong password."
                );
              }
            }}
            className="w-full bg-gradient-to-r from-orange-400 to-orange-600 py-4 rounded-2xl font-bold text-lg"
          >
            Enter Dashboard
          </button>

        </div>

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
              className="fixed top-10 left-1/2 -translate-x-1/2 bg-zinc-900 border border-white/10 rounded-2xl px-6 py-4"
            >
              {message}
            </motion.div>
          )}

        </AnimatePresence>

      </main>
    );
  }

  return (

    <main className="min-h-screen bg-black text-white px-6 py-12">

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
            className="fixed top-10 left-1/2 -translate-x-1/2 z-50"
          >

            <div className="bg-zinc-900 border border-white/10 rounded-2xl px-6 py-4">
              {message}
            </div>

          </motion.div>
        )}

      </AnimatePresence>

      <h1 className="text-6xl font-black mb-16">
        Admin Dashboard
      </h1>

      {renderSection(
        "Pending Clips",
        pendingClips
      )}

      {renderSection(
        "Approved Clips",
        approvedClips
      )}

      {renderSection(
        "Rejected Clips",
        rejectedClips
      )}

      {renderSection(
        "Payouted Clips",
        payoutedClips
      )}

    </main>
  );
}