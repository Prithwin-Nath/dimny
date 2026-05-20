"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function AdminPage() {

  const [clips, setClips] = useState([]);
  const [password, setPassword] =
    useState("");

  const [authorized, setAuthorized] =
    useState(false);

  const [message, setMessage] =
    useState("");

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

  const login = () => {
    if (password === ADMIN_PASSWORD) {
      setAuthorized(true);
    } else {
      showMessage("Wrong password");
    }
  };

  const fetchClips = async () => {

    const { data } = await supabase
      .from("clips")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    setClips(data || []);
  };

  const updateViews = async (
    id,
    views
  ) => {

    const { error } = await supabase
      .from("clips")
      .update({
        views,
      })
      .eq("id", id);

    if (!error) {

      setClips((prev) =>
        prev.map((clip) =>
          clip.id === id
            ? {
                ...clip,
                views,
              }
            : clip
        )
      );

      showMessage("Views updated");
    }
  };

  const updateStatus = async (
    id,
    status
  ) => {

    const updateData =
      status === "payouted"
        ? {
            status,
            views: 0,
          }
        : {
            status,
          };

    const { error } = await supabase
      .from("clips")
      .update(updateData)
      .eq("id", id);

    if (!error) {

      setClips((prev) =>
        prev.map((clip) =>
          clip.id === id
            ? {
                ...clip,
                ...updateData,
              }
            : clip
        )
      );

      showMessage(
        `Clip ${status}`
      );
    }
  };

  const deleteClip = async (id) => {

    const confirmDelete =
      window.confirm(
        "Delete this clip?"
      );

    if (!confirmDelete) return;

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

      showMessage("Clip deleted");
    }
  };

  const pending = clips.filter(
    (c) => c.status === "pending"
  );

  const approved = clips.filter(
    (c) => c.status === "approved"
  );

  const rejected = clips.filter(
    (c) => c.status === "rejected"
  );

  const payouted = clips.filter(
    (c) => c.status === "payouted"
  );

  const renderSection = (
    title,
    data
  ) => (
    <div className="mb-16">

      <h2 className="text-4xl font-black mb-6">
        {title}
      </h2>

      <div className="space-y-5">

        {data.map((clip) => {

          const payableViews =
            Math.min(
              clip.views || 0,
              300000
            );

          const earnings =
            (payableViews / 1000) *
            0.3;

          return (
            <div
              key={clip.id}
              className="bg-white/5 border border-white/10 rounded-3xl p-6"
            >

              <p className="text-orange-400 font-bold mb-2">
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

              <div className="flex gap-4 flex-wrap mb-6">

                <div className="bg-black/40 p-4 rounded-2xl">

                  <p className="text-xs text-zinc-500">
                    Views
                  </p>

                  <input
                    type="number"
                    defaultValue={
                      clip.views || 0
                    }
                    onBlur={(e) =>
                      updateViews(
                        clip.id,
                        Number(
                          e.target.value
                        )
                      )
                    }
                    className="bg-transparent outline-none font-bold"
                  />

                </div>

                <div className="bg-black/40 p-4 rounded-2xl">

                  <p className="text-xs text-zinc-500">
                    Earnings
                  </p>

                  <p className="font-bold text-green-400">
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
                  className={`px-5 py-3 rounded-2xl font-bold transition ${
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
                  className={`px-5 py-3 rounded-2xl font-bold transition ${
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
                  className={`px-5 py-3 rounded-2xl font-bold transition ${
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
                  className="bg-white/10 border border-white/10 px-5 py-3 rounded-2xl"
                >
                  Delete
                </button>

              </div>

            </div>
          );
        })}

      </div>

    </div>
  );

  if (!authorized) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">

        <div className="w-full max-w-md bg-white/5 p-8 rounded-3xl border border-white/10">

          <h1 className="text-5xl font-black mb-6 text-center">
            Admin Access
          </h1>

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            className="w-full p-4 rounded-2xl bg-black border border-white/10 mb-5"
          />

          <button
            onClick={login}
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
        <div className="fixed top-5 right-5 bg-white/10 px-5 py-3 rounded-2xl z-50">
          {message}
        </div>
      )}

      <h1 className="text-6xl font-black mb-14">
        Admin Dashboard
      </h1>

      {renderSection(
        "Pending Clips",
        pending
      )}

      {renderSection(
        "Approved Clips",
        approved
      )}

      {renderSection(
        "Rejected Clips",
        rejected
      )}

      {renderSection(
        "Payouted Clips",
        payouted
      )}

    </main>
  );
}