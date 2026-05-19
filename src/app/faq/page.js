"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../../components/Navbar";

export default function FAQPage() {
  const [openFAQ, setOpenFAQ] = useState(null);

  const faqs = [
    {
      question: "How do I submit clips?",
      answer:
        "Login to your DIMNY account and use the Creator Dashboard to submit your clip links.",
    },
    {
      question: "When do I get paid?",
      answer:
        "Payments are usually processed weekly after your views are verified.",
    },
    {
      question: "What platforms are supported?",
      answer:
        "We currently support TikTok, YouTube Shorts, Instagram Reels, and YouTube videos.",
    },
    {
      question: "Can I submit multiple clips?",
      answer:
        "Yes. You can submit as many clips as you want as long as they follow the guidelines.",
    },
    {
      question: "What happens if my clip gets rejected?",
      answer:
        "Rejected clips usually break content rules, use fake engagement, or don't meet campaign requirements.",
    },
    {
      question: "How are views counted?",
      answer:
        "Only organic and verified views count toward payouts. Fake or botted traffic is not allowed.",
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

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-20">

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
          className="mb-16 text-center"
        >

          <p className="text-orange-400 uppercase tracking-[0.3em] text-sm mb-4">
            Support Center
          </p>

          <h1 className="text-5xl lg:text-6xl font-black mb-6">
            Frequently Asked
            <span className="block bg-gradient-to-r from-orange-300 via-orange-500 to-orange-700 bg-clip-text text-transparent">
              Questions
            </span>
          </h1>

          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Everything creators need to know about submissions,
            payouts, approvals, and the DIMNY sponsorship program.
          </p>

        </motion.div>

        {/* FAQ LIST */}
        <div className="space-y-5">

          {faqs.map((faq, index) => (
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
                delay: index * 0.08,
              }}
              className="bg-white/[0.03] border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl hover:border-orange-500/20 transition-all duration-300"
            >

              {/* QUESTION */}
              <button
                onClick={() =>
                  setOpenFAQ(
                    openFAQ === index ? null : index
                  )
                }
                className="w-full flex items-center justify-between text-left p-7"
              >

                <h2 className="text-xl lg:text-2xl font-bold">
                  {faq.question}
                </h2>

                <motion.div
                  animate={{
                    rotate:
                      openFAQ === index ? 45 : 0,
                  }}
                  transition={{
                    duration: 0.2,
                  }}
                  className="text-3xl text-orange-400"
                >
                  +
                </motion.div>

              </button>

              {/* ANSWER */}
              <AnimatePresence>

                {openFAQ === index && (
                  <motion.div
                    initial={{
                      height: 0,
                      opacity: 0,
                    }}
                    animate={{
                      height: "auto",
                      opacity: 1,
                    }}
                    exit={{
                      height: 0,
                      opacity: 0,
                    }}
                    transition={{
                      duration: 0.25,
                    }}
                  >

                    <div className="px-7 pb-7">

                      <div className="h-px bg-white/10 mb-5" />

                      <p className="text-zinc-400 leading-relaxed">
                        {faq.answer}
                      </p>

                    </div>

                  </motion.div>
                )}

              </AnimatePresence>

            </motion.div>
          ))}

        </div>

        {/* FOOTER CARD */}
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
            Still Need Help?
          </h2>

          <p className="text-zinc-400 mb-8 max-w-2xl mx-auto">
            If your question wasn't answered here,
            contact the DIMNY support team directly
            through Discord.
          </p>

          <a
            href="https://discord.gg/XePVKRtf5"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-400 to-orange-600 hover:scale-105 active:scale-100 transition-all duration-300 font-bold shadow-xl shadow-orange-500/20"
          >
            Join Discord
          </a>

        </motion.div>

      </div>

    </motion.main>
  );
}