"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import { supabase } from "../../lib/supabase";

export default function CreatorsPage() {

  const router = useRouter();

  const [clips, setClips] = useState([]);

  const [form, setForm] = useState({
    link: "",
    platform: "youtube",
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    checkUser();
  }, []);

  const showMessage = (text) => {
    setMessage(text);

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

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

    const { data } = await supabase
      .from("clips")
      .select("*")
      .eq("user_email", user.email)
      .order("created_at", {
        ascending: false,
      });

    setClips(data || []);
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data: existing } = await supabase
      .from("clips")
      .select("*")
      .eq("link", form.link);

    if (existing?.length > 0) {
      showMessage("Clip already submitted");
      return;
    }

    await supabase
      .from("clips")
      .insert([
        {
          link: form.link,
          platform: form.platform,
          user_email: user.email,
          username:
            user.user_metadata?.username ||
            "Unknown",
          status: "pending",
          views: 0,
        },
      ]);

    showMessage("Clip submitted");

    setForm({
      link: "",
      platform: "youtube",
    });

    fetchClips();
  };

  const approvedClips = clips.filter(
    (clip) => clip.status === "approved"
  );

  const totalViews = approvedClips.reduce(
    (sum, clip) =>
      sum + (clip.views || 0),
    0
  );

  const totalMoney = approvedClips.reduce(
    (sum, clip) =>
      sum +
      ((Math.min(
        clip.views || 0,
        300000
      ) /
        1000) *
        0.3),
    0
  );

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

      <h2 className="text-3xl font-black mb-6">
        {title}
      </h2>

      <div className="space-y-5">

        {data.map((clip) => {

          const earnings =
            ((Math.min(
              clip.views || 0,
              300000
            ) /
              1000) *
              0.3);

          return (
            <div
              key={clip.id}
              className="bg-white/5 border border-white/10 p-6 rounded-3xl"
            >

              <p className="text-orange-400 mb-3 uppercase">
                {clip.platform}
              </p>

              <a
                href={clip.link}
                target="_blank"
                className="break-all block mb-4"
              >
                {clip.link}
              </a>

              <div className="flex gap-4 flex-wrap">

                <div className="bg-black/40 px-4 py-3 rounded-2xl">
                  <p className="text-zinc-500 text-xs">
                    Views
                  </p>

                  <p className="font-bold">
                    {(clip.views || 0).toLocaleString()}
                  </p>
                </div>

                <div className="bg-black/40 px-4 py-3 rounded-2xl">
                  <p className="text-zinc-500 text-xs">
                    Earnings
                  </p>

                  <p className="font-bold text-green-400">
                    ${earnings.toFixed(2)}
                  </p>
                </div>

              </div>

            </div>
          );
        })}

      </div>

    </div>
  );

  return (
    <main className="min-h-screen bg-black text-white">

      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-20">

        {message && (
          <div className="mb-6 bg-white/10 p-4 rounded-2xl">
            {message}
          </div>
        )}

        <h1 className="text-6xl font-black mb-10">
          Creator Dashboard
        </h1>

        <div className="grid md:grid-cols-2 gap-5 mb-10">

          <div className="bg-white/5 p-6 rounded-3xl">
            <p>Approved Views</p>

            <h2 className="text-5xl font-black text-orange-400">
              {totalViews.toLocaleString()}
            </h2>
          </div>

          <div className="bg-white/5 p-6 rounded-3xl">
            <p>Available Balance</p>

            <h2 className="text-5xl font-black text-green-400">
              ${totalMoney.toFixed(2)}
            </h2>
          </div>

        </div>

        <a
          href="https://discord.gg/XePVKRtf5"
          target="_blank"
          className="inline-block bg-green-500 px-8 py-4 rounded-2xl font-bold mb-10"
        >
          Open Payout Ticket
        </a>

        <form
          onSubmit={handleSubmit}
          className="bg-white/5 p-8 rounded-3xl mb-16"
        >

          <input
            type="url"
            required
            value={form.link}
            onChange={(e) =>
              setForm({
                ...form,
                link: e.target.value,
              })
            }
            placeholder="Paste clip link"
            className="w-full p-5 rounded-2xl bg-black border border-white/10 mb-5"
          />

          <button className="bg-orange-500 px-8 py-4 rounded-2xl font-bold">
            Submit Clip
          </button>

        </form>

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

      </div>

    </main>
  );
}