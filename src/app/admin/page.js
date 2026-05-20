// app/admin/page.jsx

"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function AdminPage() {
  const [clips, setClips] = useState([]);
  const [authorized, setAuthorized] = useState(false);
  const [password, setPassword] = useState("");

  const ADMIN_PASSWORD = "richu2105";

  useEffect(() => {
    if (authorized) {
      fetchClips();
    }
  }, [authorized]);

  const fetchClips = async () => {
    const { data } = await supabase
      .from("clips")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    setClips(data || []);
  };

  const updateStatus = async (
    id,
    status
  ) => {
    const updateData = {
      status,
    };

    if (status === "payouted") {
      updateData.payout_status = "paid";
    }

    await supabase
      .from("clips")
      .update(updateData)
      .eq("id", id);

    fetchClips();
  };

  const updateViews = async (
    id,
    views
  ) => {
    await supabase
      .from("clips")
      .update({ views })
      .eq("id", id);

    fetchClips();
  };

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
            className="w-full p-4 rounded-2xl bg-black border border-white/10 outline-none mb-5"
          />

          <button
            onClick={() => {
              if (
                password === ADMIN_PASSWORD
              ) {
                setAuthorized(true);
              }
            }}
            className="w-full bg-orange-500 py-4 rounded-2xl font-bold"
          >
            Enter Dashboard
          </button>

        </div>

      </main>
    );
  }

  const pendingClips = clips.filter(
    (clip) => clip.status === "pending"
  );

  const approvedClips = clips.filter(
    (clip) =>
      clip.status === "approved" &&
      clip.payout_status !== "paid"
  );

  const rejectedClips = clips.filter(
    (clip) => clip.status === "rejected"
  );

  const payoutedClips = clips.filter(
    (clip) => clip.payout_status === "paid"
  );

  const renderSection = (
    title,
    color,
    data
  ) => (
    <div className="mb-20">

      <h2 className={`text-4xl font-black mb-8 ${color}`}>
        {title}
      </h2>

      <div className="space-y-6">

        {data.map((clip) => {

          const earnings =
            clip.payout_status === "paid"
              ? 0
              : (Math.min(
                  clip.views || 0,
                  300000
                ) /
                  1000) *
                0.3;

          return (
            <div
              key={clip.id}
              className="bg-white/[0.03] border border-white/10 rounded-[36px] p-8"
            >

              <p className="text-orange-400 font-bold mb-1">
                @{clip.username}
              </p>

              <p className="text-zinc-500 text-sm mb-4">
                {clip.user_email}
              </p>

              <a
                href={clip.link}
                target="_blank"
                className="break-all block mb-6"
              >
                {clip.link}
              </a>

              <div className="flex flex-wrap gap-4 mb-6">

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
                  className={`px-5 py-3 rounded-2xl font-bold ${
                    clip.status === "approved" &&
                    clip.payout_status !== "paid"
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
                  className={`px-5 py-3 rounded-2xl font-bold ${
                    clip.status === "rejected"
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
                  className={`px-5 py-3 rounded-2xl font-bold ${
                    clip.payout_status === "paid"
                      ? "bg-blue-500 text-white"
                      : "bg-blue-500/20 text-blue-400"
                  }`}
                >
                  Payouted
                </button>

              </div>

            </div>
          );
        })}

      </div>

    </div>
  );

  return (
    <main className="min-h-screen bg-black text-white px-6 py-12">

      <h1 className="text-6xl font-black mb-16">
        Admin Dashboard
      </h1>

      {renderSection(
        "Pending Clips",
        "text-yellow-400",
        pendingClips
      )}

      {renderSection(
        "Approved Clips",
        "text-green-400",
        approvedClips
      )}

      {renderSection(
        "Rejected Clips",
        "text-red-400",
        rejectedClips
      )}

      {renderSection(
        "Payouted Clips",
        "text-blue-400",
        payoutedClips
      )}

    </main>
  );
}