"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "../../components/Navbar";

export default function ApplyPage() {
  return (
    <motion.main
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.5,
        ease: "easeInOut",
      }}
      className="min-h-screen bg-black text-white overflow-hidden relative"
    >

      {/* ORANGE GLOW */}
      <div className="absolute top-[-250px] left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-orange-500/10 blur-[140px] rounded-full pointer-events-none" />

      <Navbar />

      <section className="relative z-10 px-6 py-16 lg:px-24">

        {/* HEADER */}
        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.1,
          }}
          className="max-w-4xl mx-auto text-center mb-16"
        >

          <p className="text-orange-400 uppercase tracking-[0.3em] text-sm mb-4">
            Sponsorship Program
          </p>

          <h1 className="text-5xl lg:text-7xl font-black leading-tight">
            Start
            <span className="block bg-gradient-to-r from-orange-300 via-orange-500 to-orange-700 bg-clip-text text-transparent">
              Earning
            </span>
          </h1>

          <p className="mt-6 text-zinc-400 text-lg max-w-2xl mx-auto">
            Join the DIMNY Creator Program and earn by posting
            high-quality Roblox content across TikTok,
            YouTube Shorts, Instagram Reels, and YouTube videos.
          </p>

        </motion.div>

        {/* REQUIREMENTS */}
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6 mb-16">

          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.2,
            }}
            className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-6 hover:bg-white/[0.07] hover:-translate-y-1 transition-all duration-300"
          >

            <div className="text-3xl mb-3">
              🔐
            </div>

            <h3 className="text-xl font-bold mb-2">
              1. Login Required
            </h3>

            <p className="text-zinc-400">
              Create an account and stay logged in to access
              the creator dashboard and submit clips.
            </p>

          </motion.div>

          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.3,
            }}
            className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-6 hover:bg-white/[0.07] hover:-translate-y-1 transition-all duration-300"
          >

            <div className="text-3xl mb-3">
              💬
            </div>

            <h3 className="text-xl font-bold mb-2">
              2. Join Our Discord
            </h3>

            <p className="text-zinc-400">
              Open a ticket in our Discord server and communicate
              with the DIMNY team directly.
            </p>

          </motion.div>

          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.4,
            }}
            className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-6 hover:bg-white/[0.07] hover:-translate-y-1 transition-all duration-300"
          >

            <div className="text-3xl mb-3">
              📈
            </div>

            <h3 className="text-xl font-bold mb-2">
              3. Post Content
            </h3>

            <p className="text-zinc-400">
              Upload original content, send your link,
              and earn based on real organic views.
            </p>

          </motion.div>

        </div>

        {/* MAIN GRID */}
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8">

          {/* LEFT */}
          <div className="space-y-8">

            {/* PLATFORMS */}
            <motion.div
              initial={{
                opacity: 0,
                y: 30,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.5,
              }}
              className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-8"
            >

              <h2 className="text-2xl font-bold mb-4 text-orange-400">
                🎥 Supported Platforms
              </h2>

              <ul className="space-y-2 text-zinc-300">
                <li>• YouTube Shorts</li>
                <li>• TikTok</li>
                <li>• Instagram Reels</li>
                <li>• YouTube Long-form</li>
              </ul>

            </motion.div>

            {/* PAYMENTS */}
            <motion.div
              initial={{
                opacity: 0,
                y: 30,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.6,
              }}
              className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-8"
            >

              <h2 className="text-2xl font-bold mb-4 text-orange-400">
                💸 Payment Details
              </h2>

              <ul className="space-y-3 text-zinc-300">
                <li>• Standard Rate: $0.30 per 1,000 views</li>
                <li>• High-performing creators: up to $0.50 per 1,000 views</li>
                <li>• Maximum payout: $300 per week</li>
                <li>• Payments sent within 7 days</li>
                <li>• PayPal, Crypto, and GPay supported</li>
              </ul>

            </motion.div>

            {/* TRAFFIC */}
            <motion.div
              initial={{
                opacity: 0,
                y: 30,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.7,
              }}
              className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-8"
            >

              <h2 className="text-2xl font-bold mb-4 text-orange-400">
                📊 Traffic Rules
              </h2>

              <ul className="space-y-3 text-zinc-300">
                <li>• 100% organic views only</li>
                <li>• No bots or fake boosting</li>
                <li>• Maximum counted views: 200K</li>
                <li>• Recommended minimum: 2K views</li>
              </ul>

            </motion.div>

          </div>

          {/* RIGHT */}
          <div className="space-y-8">

            {/* REQUIREMENTS */}
            <motion.div
              initial={{
                opacity: 0,
                y: 30,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.8,
              }}
              className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-8"
            >

              <h2 className="text-2xl font-bold mb-4 text-orange-400">
                🎬 Content Requirements
              </h2>

              <ul className="space-y-3 text-zinc-300">
                <li>• Roblox-related content only</li>
                <li>• Include clips/assets provided by us</li>
                <li>• Send your link after uploading</li>
                <li>• Discuss campaigns inside tickets</li>
              </ul>

            </motion.div>

            {/* RULES */}
            <motion.div
              initial={{
                opacity: 0,
                y: 30,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.9,
              }}
              className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-8"
            >

              <h2 className="text-2xl font-bold mb-4 text-orange-400">
                📌 Program Rules
              </h2>

              <ul className="space-y-3 text-zinc-300">
                <li>• No fake engagement</li>
                <li>• Follow platform guidelines</li>
                <li>• Be respectful and professional</li>
                <li>• Violations may remove payout eligibility</li>
              </ul>

            </motion.div>

            {/* APPLY */}
            <motion.div
              initial={{
                opacity: 0,
                y: 30,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 1,
              }}
              className="rounded-3xl border border-orange-500/20 bg-gradient-to-b from-orange-500/10 to-transparent p-8"
            >

              <h2 className="text-2xl font-bold mb-4 text-orange-400">
                🚀 How to Apply
              </h2>

              <ol className="space-y-3 text-zinc-300">
                <li>1. Create or login to DIMNY</li>
                <li>2. Join our Discord server</li>
                <li>3. Open a support ticket</li>
                <li>4. Send your social links</li>
                <li>5. Wait for approval</li>
              </ol>

              <div className="flex flex-col sm:flex-row gap-4 mt-8">

                <Link
                  href="/auth"
                  className="flex-1 text-center px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-400 to-orange-600 hover:scale-105 transition duration-300 font-semibold shadow-[0_0_25px_rgba(255,140,0,0.25)]"
                >
                  Login / Sign Up
                </Link>

                <a
                  href="https://discord.gg/XePVKRtf5"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center px-6 py-3 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 hover:scale-105 transition font-semibold"
                >
                  Join Discord
                </a>

              </div>

            </motion.div>

          </div>

        </div>

        {/* FOOTER */}
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            delay: 1.1,
          }}
          className="max-w-4xl mx-auto mt-16 text-center"
        >

          <p className="text-zinc-500 text-sm">
            This campaign currently applies to the
            StarPets Standard Creator Sponsorship Program.
          </p>

        </motion.div>

      </section>

    </motion.main>
  );
}