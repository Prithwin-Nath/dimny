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

  // FETCH CLIPS
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

  // UPDATE VIEWS
  const updateViews = async (id, views) => {
    const { error } = await supabase
      .from("clips")
      .update({ views })
      .eq("id", id);

    if (!error) {
      setClips((prev) =>
        prev.map((clip) =>
          clip.id === id
            ? { ...clip, views }
            : clip
        )
      );

      showMessage("👀 Views updated.");
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

  const totalViews = clips.reduce(
    (sum, clip) =>
      sum + (clip.views || 0),
    0
  );

  // $0.30 PER 1K VIEWS
  const totalPayouts = clips
    .filter((clip) => clip.status === "approved")
    .reduce(
      (sum, clip) =>
        sum +
        (((clip.views || 0) / 1000) * 0.3),
      0
    );

  const topCreator = Object.entries(
    clips.reduce((acc, clip) => {
      const user = clip.username || "Unknown";

      acc[user] =
        (acc[user] || 0) +
        (clip.views || 0);

      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1])[0];

  // LOGIN SCREEN
  if (!authorized) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center px-6 relative overflow-hidden">

        <div className="absolute top-[-150px] left-[-150px] w-[500px] h-[500px] bg-orange-500/20 blur-[140px] rounded-full" />

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

  return (
    <main className="min-h-screen bg-black text-white px-6 lg:px-12 py-12 overflow-x-hidden relative">

      {/* BG */}
      <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-orange-500/10 blur-[140px] rounded-full pointer-events-none" />

      {/* TOAST */}
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
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-5 mb-12 relative z-10">

        <div className="bg-white/[0.03] border border-white/10 rounded-[28px] p-6">
          <p className="text-zinc-500 text-sm mb-2">
            Total Clips
          </p>

          <h2 className="text-4xl font-black">
            {total}
          </h2>
        </div>

        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-[28px] p-6">
          <p className="text-yellow-200/70 text-sm mb-2">
            Pending
          </p>

          <h2 className="text-4xl font-black text-yellow-400">
            {pending}
          </h2>
        </div>

        <div className="bg-green-500/10 border border-green-500/20 rounded-[28px] p-6">
          <p className="text-green-200/70 text-sm mb-2">
            Approved
          </p>

          <h2 className="text-4xl font-black text-green-400">
            {approved}
          </h2>
        </div>

        <div className="bg-red-500/10 border border-red-500/20 rounded-[28px] p-6">
          <p className="text-red-200/70 text-sm mb-2">
            Rejected
          </p>

          <h2 className="text-4xl font-black text-red-400">
            {rejected}
          </h2>
        </div>

        <div className="bg-orange-500/10 border border-orange-500/20 rounded-[28px] p-6">
          <p className="text-orange-200/70 text-sm mb-2">
            Total Views
          </p>

          <h2 className="text-4xl font-black text-orange-400">
            {totalViews.toLocaleString()}
          </h2>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/20 rounded-[28px] p-6">
          <p className="text-blue-200/70 text-sm mb-2">
            Total Payouts
          </p>

          <h2 className="text-4xl font-black text-blue-400">
            ${totalPayouts.toFixed(2)}
          </h2>
        </div>

      </div>

      {/* TOP CREATOR */}
      {topCreator && (
        <div className="mb-10 bg-gradient-to-r from-orange-500/10 to-orange-400/5 border border-orange-500/20 rounded-[32px] p-8 relative z-10">

          <p className="text-orange-300 text-sm mb-2">
            Top Creator
          </p>

          <h2 className="text-5xl font-black text-orange-400 mb-2">
            @{topCreator[0]}
          </h2>

          <p className="text-zinc-400 text-lg">
            {topCreator[1].toLocaleString()} total views
          </p>

        </div>
      )}

      {/* CLIPS */}
      <div className="flex flex-col gap-8 relative z-10">

        {clips.map((clip) => {

          const earnings =
            ((clip.views || 0) / 1000) * 0.3;

          return (

            <div
              key={clip.id}
              className="bg-white/[0.03] border border-white/10 rounded-[36px] p-8 backdrop-blur-xl shadow-2xl"
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

                  <p className="text-orange-400 font-bold mb-2">
                    @{clip.username}
                  </p>

                  <p className="text-zinc-500 text-sm mb-4">
                    {clip.user_email}
                  </p>

                  <a
                    href={clip.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg break-all hover:text-orange-400 transition"
                  >
                    {clip.link}
                  </a>

                  {/* ANALYTICS */}
                  <div className="flex flex-wrap gap-4 mt-6">

                    {/* VIEWS */}
                    <div className="bg-black/40 border border-white/10 px-5 py-4 rounded-2xl">

                      <p className="text-zinc-500 text-xs mb-1">
                        Views
                      </p>

                      <input
                        type="number"
                        defaultValue={clip.views || 0}
                        onBlur={(e) =>
                          updateViews(
                            clip.id,
                            Number(e.target.value)
                          )
                        }
                        className="w-32 bg-transparent outline-none text-white font-bold"
                      />

                    </div>

                    {/* EARNINGS */}
                    <div className="bg-black/40 border border-white/10 px-5 py-4 rounded-2xl">

                      <p className="text-zinc-500 text-xs mb-1">
                        Earnings
                      </p>

                      <p className="text-green-400 font-bold">
                        ${earnings.toFixed(2)}
                      </p>

                    </div>

                  </div>

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
          );
        })}

      </div>

    </main>
  );
}