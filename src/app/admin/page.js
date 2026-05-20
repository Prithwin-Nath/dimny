"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function AdminPage() {
  const [clips, setClips] = useState([]);
  const [payouts, setPayouts] = useState([]);

  const [loading, setLoading] = useState(false);

  const [authorized, setAuthorized] = useState(false);
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");

  const ADMIN_PASSWORD = "richu2105";

  const showMessage = (text) => {
    setMessage(text);

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  const checkPassword = async () => {
    if (password === ADMIN_PASSWORD) {
      setAuthorized(true);

      fetchClips();
      fetchPayouts();
    } else {
      showMessage("❌ Wrong password.");
    }
  };

  const fetchClips = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("clips")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) {
      setClips(data || []);
    }

    setLoading(false);
  };

  const fetchPayouts = async () => {
    const { data, error } = await supabase
      .from("payout_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) {
      setPayouts(data || []);
    }
  };

  // UPDATE PAYOUT STATUS
  const updatePayoutStatus = async (
    payout,
    status
  ) => {
    const { error } = await supabase
      .from("payout_requests")
      .update({ status })
      .eq("id", payout.id);

    if (!error) {

      // IF PAID -> RESET CLIP VIEWS
      if (status === "paid") {

        const userClips = clips.filter(
          (clip) =>
            clip.user_email === payout.user_email &&
            clip.status === "approved"
        );

        for (const clip of userClips) {
          await supabase
            .from("clips")
            .update({
              views: 0,
            })
            .eq("id", clip.id);
        }

        fetchClips();
      }

      fetchPayouts();

      showMessage(`✅ Payout ${status}`);
    }
  };

  // UPDATE CLIP STATUS
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
            ? { ...clip, status }
            : clip
        )
      );

      showMessage(`✅ Clip ${status}`);
    }
  };

  // UPDATE VIEWS
  const updateViews = async (
    id,
    views
  ) => {
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
    }
  };

  // DELETE CLIP
  const deleteClip = async (id) => {
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

      showMessage("🗑 Clip deleted.");
    }
  };

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

  const totalPayouts = payouts.reduce(
    (sum, payout) =>
      sum + (payout.amount || 0),
    0
  );

  if (!authorized) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">

        <div className="w-full max-w-md bg-white/[0.04] border border-white/10 rounded-[36px] p-8">

          <h1 className="text-5xl font-black mb-6 text-center">
            Admin Access
          </h1>

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
            className="w-full p-4 rounded-2xl bg-black border border-white/10 outline-none mb-5"
          />

          <button
            onClick={checkPassword}
            className="w-full bg-orange-500 py-4 rounded-2xl font-bold"
          >
            Enter Dashboard
          </button>

        </div>

      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-12">

      {message && (
        <div className="fixed top-5 right-5 bg-zinc-900 border border-white/10 px-6 py-4 rounded-2xl z-50">
          {message}
        </div>
      )}

      <h1 className="text-6xl font-black mb-10">
        Admin Dashboard
      </h1>

      {/* STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-5 mb-14">

        <div className="bg-white/5 p-6 rounded-3xl">
          <p>Total Clips</p>
          <h2 className="text-4xl font-black">
            {total}
          </h2>
        </div>

        <div className="bg-yellow-500/10 p-6 rounded-3xl">
          <p>Pending</p>
          <h2 className="text-4xl font-black text-yellow-400">
            {pending}
          </h2>
        </div>

        <div className="bg-green-500/10 p-6 rounded-3xl">
          <p>Approved</p>
          <h2 className="text-4xl font-black text-green-400">
            {approved}
          </h2>
        </div>

        <div className="bg-red-500/10 p-6 rounded-3xl">
          <p>Rejected</p>
          <h2 className="text-4xl font-black text-red-400">
            {rejected}
          </h2>
        </div>

        <div className="bg-orange-500/10 p-6 rounded-3xl">
          <p>Total Views</p>
          <h2 className="text-4xl font-black text-orange-400">
            {totalViews.toLocaleString()}
          </h2>
        </div>

        <div className="bg-blue-500/10 p-6 rounded-3xl">
          <p>Total Requested</p>
          <h2 className="text-4xl font-black text-blue-400">
            ${totalPayouts.toFixed(2)}
          </h2>
        </div>

      </div>

      {/* PAYOUT REQUESTS */}
      <div className="mb-16">

        <h2 className="text-4xl font-black mb-6">
          Payout Requests
        </h2>

        <div className="space-y-5">

          {payouts.map((payout) => (
            <div
              key={payout.id}
              className="bg-white/[0.03] border border-white/10 rounded-3xl p-6"
            >

              <p className="text-orange-400 font-bold mb-2">
                @{payout.username}
              </p>

              <p className="text-zinc-400 mb-2">
                {payout.user_email}
              </p>

              <p className="text-5xl font-black mb-4 text-green-400">
                ${payout.amount}
              </p>

              <p className="text-zinc-500 mb-6 capitalize">
                Status: {payout.status}
              </p>

              <div className="flex gap-3 flex-wrap">

                <button
                  onClick={() =>
                    updatePayoutStatus(
                      payout,
                      "approved"
                    )
                  }
                  className={`px-5 py-3 rounded-2xl font-semibold ${
                    payout.status === "approved"
                      ? "bg-green-500 text-white"
                      : "bg-green-500/20 text-green-400"
                  }`}
                >
                  Approve
                </button>

                <button
                  onClick={() =>
                    updatePayoutStatus(
                      payout,
                      "rejected"
                    )
                  }
                  className={`px-5 py-3 rounded-2xl font-semibold ${
                    payout.status === "rejected"
                      ? "bg-red-500 text-white"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  Reject
                </button>

                <button
                  onClick={() =>
                    updatePayoutStatus(
                      payout,
                      "paid"
                    )
                  }
                  className={`px-5 py-3 rounded-2xl font-semibold ${
                    payout.status === "paid"
                      ? "bg-blue-500 text-white"
                      : "bg-blue-500/20 text-blue-400"
                  }`}
                >
                  Mark Paid
                </button>

              </div>

            </div>
          ))}

        </div>

      </div>

      {/* CLIPS */}
      <div className="space-y-8">

        {clips.map((clip) => {

          const payableViews = Math.min(
            clip.views || 0,
            300000
          );

          const earnings =
            clip.status === "approved"
              ? (payableViews / 1000) * 0.3
              : 0;

          return (
            <div
              key={clip.id}
              className="bg-white/[0.03] border border-white/10 rounded-[36px] p-8"
            >

              <div className="flex flex-col gap-6">

                <div>

                  <p className="text-orange-400 font-bold">
                    @{clip.username}
                  </p>

                  <p className="text-zinc-500 text-sm mb-3">
                    {clip.user_email}
                  </p>

                  <a
                    href={clip.link}
                    target="_blank"
                    className="break-all"
                  >
                    {clip.link}
                  </a>

                </div>

                <div className="flex flex-wrap gap-4">

                  <div className="bg-black/40 p-4 rounded-2xl">
                    <p className="text-zinc-500 text-xs">
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
                      className="bg-transparent outline-none text-white font-bold"
                    />
                  </div>

                  <div className="bg-black/40 p-4 rounded-2xl">
                    <p className="text-zinc-500 text-xs">
                      Earnings
                    </p>

                    <p className="font-bold text-green-400">
                      ${earnings.toFixed(2)}
                    </p>
                  </div>

                </div>

                <div className="flex gap-3 flex-wrap">

                  <button
                    onClick={() =>
                      updateStatus(
                        clip.id,
                        "approved"
                      )
                    }
                    className={`px-5 py-3 rounded-2xl font-semibold ${
                      clip.status === "approved"
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
                    className={`px-5 py-3 rounded-2xl font-semibold ${
                      clip.status === "rejected"
                        ? "bg-red-500 text-white"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    Reject
                  </button>

                  <button
                    onClick={() =>
                      deleteClip(clip.id)
                    }
                    className="bg-white/5 border border-white/10 px-5 py-3 rounded-2xl"
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