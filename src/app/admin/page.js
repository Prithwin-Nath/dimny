"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function AdminPage() {
  const [clips, setClips] = useState([]);
  const [loading, setLoading] = useState(false);

  const [authorized, setAuthorized] = useState(false);
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");

  const ADMIN_PASSWORD = "richu2105";

  // MESSAGE
  const showMessage = (text) => {
    setMessage(text);

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  // LOGIN
  const checkPassword = async () => {
    if (password === ADMIN_PASSWORD) {
      setAuthorized(true);
      fetchClips();
    } else {
      showMessage("❌ Wrong password.");
    }
  };

  // FETCH
  const fetchClips = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("clips")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) {
      setClips(data || []);
    } else {
      console.log(error);
    }

    setLoading(false);
  };

  // UPDATE STATUS
  const updateStatus = async (id, status) => {
    const { error } = await supabase
      .from("clips")
      .update({ status })
      .eq("id", id);

    if (!error) {
      setClips((prev) =>
        prev.map((clip) =>
          clip.id === id
            ? { ...clip, status }
            : clip
        )
      );

      if (status === "approved") {
        showMessage("✅ Clip approved.");
      }

      if (status === "rejected") {
        showMessage("❌ Clip rejected.");
      }
    } else {
      console.log(error);
    }
  };

  // DELETE
  const deleteClip = async (id) => {
    const { error } = await supabase
      .from("clips")
      .delete()
      .eq("id", id);

    if (!error) {
      setClips((prev) =>
        prev.filter((clip) => clip.id !== id)
      );

      showMessage("🗑 Clip deleted.");
    } else {
      console.log(error);
      showMessage("❌ Failed to delete.");
    }
  };

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

  // LOGIN SCREEN
  if (!authorized) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center px-6 relative overflow-hidden">

        {/* BG GLOW */}
        <div className="absolute top-[-150px] left-[-150px] w-[500px] h-[500px] bg-orange-500/20 blur-[140px] rounded-full" />

        {/* MESSAGE */}
        {message && (
          <div className="fixed top-10 left-1/2 -translate-x-1/2 z-50">

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

          </div>
        )}

        {/* LOGIN CARD */}
        <div className="relative z-10 w-full max-w-md bg-white/[0.04] border border-white/10 rounded-[36px] p-8 backdrop-blur-2xl shadow-2xl">

          <div className="text-center mb-10">

            <div className="w-20 h-20 rounded-[28px] bg-gradient-to-br from-orange-400 to-orange-600 mx-auto flex items-center justify-center text-3xl font-black shadow-xl shadow-orange-500/20 mb-6">
              A
            </div>

            <h1 className="text-5xl font-black mb-3">
              Admin Access
            </h1>

            <p className="text-zinc-400">
              Enter your admin password
            </p>

          </div>

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                checkPassword();
              }
            }}
            className="w-full p-4 rounded-2xl bg-black border border-white/10 outline-none focus:border-orange-500 transition-all duration-300 mb-5"
          />

          <button
            onClick={checkPassword}
            className="w-full bg-gradient-to-r from-orange-400 to-orange-600 py-4 rounded-2xl font-bold text-lg hover:scale-[1.02] active:scale-100 transition-all duration-300 shadow-xl shadow-orange-500/20"
          >
            Enter Dashboard
          </button>

        </div>

      </main>
    );
  }

  // STATS
  const total = clips.length;

  const pending = clips.filter(
    (clip) => clip.status === "pending"
  ).length;

  const approved = clips.filter(
    (clip) => clip.status === "approved"
  ).length;

  const rejected = clips.filter(
    (clip) => clip.status === "rejected"
  ).length;

  return (
    <main className="min-h-screen bg-black text-white px-6 lg:px-12 py-12 overflow-x-hidden relative">

      {/* TOP GLOW */}
      <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-orange-500/10 blur-[140px] rounded-full pointer-events-none" />

      {/* MESSAGE */}
      {message && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-50">

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

        </div>
      )}

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-12 relative z-10">

        <div>

          <h1 className="text-6xl font-black mb-3">
            Admin Dashboard
          </h1>

          <p className="text-zinc-400 text-lg">
            Moderate creator submissions
          </p>

        </div>

        <button
          onClick={fetchClips}
          className="bg-white/5 border border-white/10 px-5 py-3 rounded-2xl hover:bg-white/10 hover:scale-105 transition-all duration-300"
        >
          Refresh
        </button>

      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-12 relative z-10">

        <div className="bg-white/[0.03] border border-white/10 rounded-[28px] p-6 backdrop-blur-xl shadow-2xl">
          <p className="text-zinc-500 text-sm mb-2">
            Total Clips
          </p>

          <h2 className="text-5xl font-black">
            {total}
          </h2>
        </div>

        <div className="bg-yellow-500/10 border border-yellow-500/10 rounded-[28px] p-6 backdrop-blur-xl shadow-2xl">
          <p className="text-yellow-200/70 text-sm mb-2">
            Pending
          </p>

          <h2 className="text-5xl font-black text-yellow-400">
            {pending}
          </h2>
        </div>

        <div className="bg-green-500/10 border border-green-500/10 rounded-[28px] p-6 backdrop-blur-xl shadow-2xl">
          <p className="text-green-200/70 text-sm mb-2">
            Approved
          </p>

          <h2 className="text-5xl font-black text-green-400">
            {approved}
          </h2>
        </div>

        <div className="bg-red-500/10 border border-red-500/10 rounded-[28px] p-6 backdrop-blur-xl shadow-2xl">
          <p className="text-red-200/70 text-sm mb-2">
            Rejected
          </p>

          <h2 className="text-5xl font-black text-red-400">
            {rejected}
          </h2>
        </div>

      </div>

      {/* GROUPED USERS */}
      <div className="flex flex-col gap-8 relative z-10">

        {Object.entries(
          clips.reduce((groups, clip) => {
            const username =
              clip.username || "Unknown";

            if (!groups[username]) {
              groups[username] = [];
            }

            groups[username].push(clip);

            return groups;
          }, {})
        ).map(([username, userClips]) => (

          <div
            key={username}
            className="bg-white/[0.03] border border-white/10 rounded-[36px] p-8 backdrop-blur-xl shadow-2xl"
          >

            {/* USER HEADER */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 border-b border-white/10 pb-6 mb-6">

              <div className="flex items-center gap-4">

                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-2xl font-black shadow-lg shadow-orange-500/20">
                  {username.charAt(0).toUpperCase()}
                </div>

                <div>

                  <p className="text-zinc-500 text-sm mb-1">
                    Creator
                  </p>

                  <h2 className="text-3xl font-black text-orange-400">
                    @{username}
                  </h2>

                  <p className="text-zinc-500 text-sm mt-2">
                    {userClips[0]?.user_email}
                  </p>

                </div>

              </div>

              <div className="bg-orange-500/10 border border-orange-500/10 text-orange-400 px-5 py-3 rounded-2xl">
                {userClips.length} Clips
              </div>

            </div>

            {/* CLIPS */}
            <div className="flex flex-col gap-5">

              {userClips.map((clip) => (
                <div
                  key={clip.id}
                  className="bg-black/40 border border-white/10 rounded-[28px] p-6 hover:bg-white/[0.05] hover:border-orange-500/20 hover:shadow-2xl hover:shadow-orange-500/5 transition-all duration-300"
                >

                  <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">

                    {/* INFO */}
                    <div className="flex-1">

                      <div className="flex items-center gap-3 flex-wrap mb-4">

                        <span className="px-4 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs uppercase tracking-widest">
                          {clip.platform}
                        </span>

                        <span
                          className={`px-4 py-1 rounded-full text-xs font-bold tracking-wide backdrop-blur-xl ${statusStyle(
                            clip.status
                          )}`}
                        >
                          {clip.status}
                        </span>

                      </div>

                      <a
                        href={clip.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lg break-all hover:text-orange-400 transition"
                      >
                        {clip.link}
                      </a>

                    </div>

                    {/* ACTIONS */}
                    <div className="flex flex-wrap gap-3">

                      <button
                        onClick={() =>
                          updateStatus(
                            clip.id,
                            "approved"
                          )
                        }
                        className="bg-green-500/20 text-green-400 border border-green-500/20 px-5 py-3 rounded-2xl hover:bg-green-500/30 hover:scale-105 transition-all duration-300"
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
                        className="bg-red-500/20 text-red-400 border border-red-500/20 px-5 py-3 rounded-2xl hover:bg-red-500/30 hover:scale-105 transition-all duration-300"
                      >
                        Reject
                      </button>

                      <button
                        onClick={() =>
                          deleteClip(clip.id)
                        }
                        className="bg-white/5 border border-white/10 px-5 py-3 rounded-2xl hover:bg-white/10 hover:scale-105 transition-all duration-300"
                      >
                        Delete
                      </button>

                    </div>

                  </div>

                </div>
              ))}

            </div>

          </div>
        ))}

      </div>

    </main>
  );
}