"use client";

import { motion } from "framer-motion";
import Navbar from "../../components/Navbar";

export default function PaymentsPage() {
  const paymentMethods = [
    {
      icon: "💳",
      title: "PayPal",
      desc: "Fast international payouts for creators worldwide.",
    },
    {
      icon: "🪙",
      title: "Crypto",
      desc: "Receive payments through supported cryptocurrencies.",
    },
    {
      icon: "📱",
      title: "GPay",
      desc: "Quick payments for supported regions.",
    },
  ];

  const stats = [
    {
      value: "$0.30",
      label: "Per 1,000 Views",
    },
    {
      value: "$300",
      label: "Weekly Cap",
    },
    {
      value: "7 Days",
      label: "Payment Speed",
    },
  ];

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

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20">

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
          className="text-center mb-16"
        >

          <p className="text-orange-400 uppercase tracking-[0.3em] text-sm mb-4">
            Creator Revenue
          </p>

          <h1 className="text-5xl lg:text-7xl font-black mb-6">
            Creator
            <span className="block bg-gradient-to-r from-orange-300 via-orange-500 to-orange-700 bg-clip-text text-transparent">
              Payments
            </span>
          </h1>

          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Earn money through accepted DIMNY clips and
            grow your payouts based on performance.
          </p>

        </motion.div>

        {/* STATS */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">

          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: index * 0.1,
              }}
              whileHover={{
                scale: 1.02,
              }}
              className="bg-white/[0.03] border border-white/10 rounded-[32px] p-8 backdrop-blur-xl text-center hover:border-orange-500/20 transition-all duration-300"
            >

              <h2 className="text-5xl font-black text-orange-400 mb-3">
                {stat.value}
              </h2>

              <p className="text-zinc-400 text-lg">
                {stat.label}
              </p>

            </motion.div>
          ))}

        </div>

        {/* MAIN GRID */}
        <div className="grid lg:grid-cols-2 gap-8">

          {/* LEFT */}
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
              delay: 0.3,
            }}
            className="bg-white/[0.03] border border-white/10 rounded-[32px] p-8 backdrop-blur-xl"
          >

            <h2 className="text-3xl font-black mb-8">
              Payment Information
            </h2>

            <div className="space-y-5">

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-400">
                  💰
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-1">
                    Earnings
                  </h3>

                  <p className="text-zinc-400">
                    Payments are calculated using approved
                    clips and verified organic views.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-400">
                  📈
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-1">
                    Performance Boost
                  </h3>

                  <p className="text-zinc-400">
                    High-performing creators can receive
                    increased CPM rates and bonuses.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-400">
                  ⚡
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-1">
                    Fast Processing
                  </h3>

                  <p className="text-zinc-400">
                    Payouts are usually processed within
                    7 business days after review.
                  </p>
                </div>
              </div>

            </div>

          </motion.div>

          {/* RIGHT */}
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
              delay: 0.4,
            }}
            className="bg-white/[0.03] border border-white/10 rounded-[32px] p-8 backdrop-blur-xl"
          >

            <h2 className="text-3xl font-black mb-8">
              Supported Methods
            </h2>

            <div className="space-y-5">

              {paymentMethods.map((method, index) => (
                <motion.div
                  key={index}
                  whileHover={{
                    scale: 1.02,
                  }}
                  className="flex items-center gap-5 bg-black/30 border border-white/5 rounded-3xl p-5 hover:border-orange-500/20 transition-all duration-300"
                >

                  <div className="w-16 h-16 rounded-3xl bg-orange-500/10 flex items-center justify-center text-3xl">
                    {method.icon}
                  </div>

                  <div>
                    <h3 className="text-xl font-bold mb-1">
                      {method.title}
                    </h3>

                    <p className="text-zinc-400">
                      {method.desc}
                    </p>
                  </div>

                </motion.div>
              ))}

            </div>

          </motion.div>

        </div>

        {/* NOTICE */}
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
            delay: 0.5,
          }}
          className="mt-16 rounded-[32px] border border-orange-500/20 bg-gradient-to-b from-orange-500/10 to-transparent p-10 text-center"
        >

          <h2 className="text-3xl font-black mb-4">
            Important Notice
          </h2>

          <p className="text-zinc-400 max-w-3xl mx-auto leading-relaxed">
            Fake engagement, botted traffic, or manipulated views
            will result in disqualification from payouts.
            DIMNY only rewards verified organic performance.
          </p>

        </motion.div>

      </div>

    </motion.main>
  );
}