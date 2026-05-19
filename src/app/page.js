"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "../components/Navbar";

export default function HomePage() {
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
      <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-orange-500/10 blur-[140px] rounded-full pointer-events-none" />

      <Navbar />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-32 relative z-10">

        {/* HERO */}
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
            duration: 0.5,
          }}
          className="text-center"
        >

          <p className="text-orange-400 font-semibold tracking-widest uppercase mb-6">
            DIMNY CREATOR PROGRAM
          </p>

          <h1 className="text-7xl lg:text-8xl font-black leading-none mb-8">
            Start Clipping
            <br />
            Earn Money
          </h1>

          <p className="text-zinc-400 text-xl max-w-2xl mx-auto leading-relaxed mb-12">
            Submit viral clips, grow with creators,
            and get rewarded through DIMNY.
          </p>

          <Link
            href="/apply"
            className="inline-flex items-center justify-center bg-gradient-to-r from-orange-400 to-orange-600 px-8 py-4 rounded-2xl text-lg font-bold hover:scale-105 active:scale-100 transition-all duration-300 shadow-2xl shadow-orange-500/20"
          >
            Start Clipping
          </Link>

        </motion.div>

        {/* FEATURES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24">

          {/* CARD 1 */}
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
            className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 hover:bg-white/[0.05] hover:-translate-y-1 transition-all duration-300"
          >

            <div className="text-4xl mb-5">
              🎬
            </div>

            <h2 className="text-2xl font-bold mb-3">
              Submit Clips
            </h2>

            <p className="text-zinc-400 leading-relaxed">
              Upload your best clips from
              YouTube, TikTok, or Instagram.
            </p>

          </motion.div>

          {/* CARD 2 */}
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
            className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 hover:bg-white/[0.05] hover:-translate-y-1 transition-all duration-300"
          >

            <div className="text-4xl mb-5">
              ⚡
            </div>

            <h2 className="text-2xl font-bold mb-3">
              Fast Reviews
            </h2>

            <p className="text-zinc-400 leading-relaxed">
              DIMNY admins review and approve
              clips quickly and smoothly.
            </p>

          </motion.div>

          {/* CARD 3 */}
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
            className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 hover:bg-white/[0.05] hover:-translate-y-1 transition-all duration-300"
          >

            <div className="text-4xl mb-5">
              💰
            </div>

            <h2 className="text-2xl font-bold mb-3">
              Get Paid
            </h2>

            <p className="text-zinc-400 leading-relaxed">
              Earn money based on approved
              clips and overall performance.
            </p>

          </motion.div>

        </div>

      </div>

    </motion.main>
  );
}