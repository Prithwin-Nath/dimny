"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();

  const [isLogin, setIsLogin] = useState(true);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // AUTO LOGIN
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session) {
      router.push("/creators");
    }
  };

  // TOAST
  const showMessage = (text) => {
    setMessage(text);

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  // AUTH
  const handleAuth = async (e) => {
    e.preventDefault();

    setLoading(true);

    // LOGIN
    if (isLogin) {
      const { error } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (error) {
        console.log(error);
        showMessage(error.message);
      } else {
        showMessage("✅ Logged in!");

        setTimeout(() => {
          router.push("/creators");
        }, 1000);
      }
    }

    // SIGNUP
    else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username,
          },
        },
      });

      if (error) {
        console.log(error);
        showMessage(error.message);
      } else {
        showMessage("✅ Account created!");

        setTimeout(() => {
          router.push("/creators");
        }, 1000);
      }
    }

    setLoading(false);
  };

  return (
    <motion.main
      initial={{
        opacity: 0,
        scale: 0.98,
      }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      transition={{
        duration: 0.5,
        ease: "easeInOut",
      }}
      className="min-h-screen bg-black text-white flex items-center justify-center px-6 overflow-hidden relative"
    >

      {/* BACKGROUND */}
      <div className="absolute inset-0 overflow-hidden">

        <motion.div
          animate={{
            x: [0, 40, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
          }}
          className="absolute w-[500px] h-[500px] bg-orange-500/20 blur-[120px] rounded-full top-[-100px] left-[-100px]"
        />

        <motion.div
          animate={{
            x: [0, -40, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
          }}
          className="absolute w-[400px] h-[400px] bg-orange-400/10 blur-[120px] rounded-full bottom-[-100px] right-[-100px]"
        />

      </div>

      {/* TOAST */}
      <AnimatePresence>

        {message && (
          <motion.div
            initial={{
              opacity: 0,
              y: -20,
              scale: 0.9,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: -20,
              scale: 0.9,
            }}
            className="fixed top-10 left-1/2 -translate-x-1/2 z-50"
          >

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

          </motion.div>
        )}

      </AnimatePresence>

      {/* CARD */}
      <motion.div
        initial={{
          opacity: 0,
          y: 40,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          delay: 0.2,
        }}
        className="relative z-10 w-full max-w-md bg-white/[0.04] border border-white/10 rounded-[36px] p-8 backdrop-blur-2xl shadow-2xl"
      >

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
            delay: 0.3,
          }}
          className="mb-10 text-center"
        >

          <motion.div
            whileHover={{
              scale: 1.05,
              rotate: 3,
            }}
            className="w-20 h-20 rounded-[28px] bg-gradient-to-br from-orange-400 to-orange-600 mx-auto flex items-center justify-center text-3xl font-black shadow-xl shadow-orange-500/20 mb-6"
          >
            D
          </motion.div>

          <h1 className="text-5xl font-black mb-3">
            {isLogin
              ? "Welcome Back"
              : "Create Account"}
          </h1>

          <p className="text-zinc-400">
            {isLogin
              ? "Login to your creator dashboard"
              : "Join the DIMNY creator platform"}
          </p>

        </motion.div>

        {/* FORM */}
        <form
          onSubmit={handleAuth}
          className="flex flex-col gap-5"
        >

          {/* USERNAME */}
          <AnimatePresence>

            {!isLogin && (
              <motion.div
                initial={{
                  opacity: 0,
                  height: 0,
                }}
                animate={{
                  opacity: 1,
                  height: "auto",
                }}
                exit={{
                  opacity: 0,
                  height: 0,
                }}
              >

                <p className="text-sm text-zinc-400 mb-3">
                  Username
                </p>

                <input
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) =>
                    setUsername(e.target.value)
                  }
                  required={!isLogin}
                  className="w-full p-4 rounded-2xl bg-black border border-white/10 outline-none focus:border-orange-500 focus:shadow-[0_0_25px_rgba(255,140,0,0.15)] transition-all duration-300"
                />

              </motion.div>
            )}

          </AnimatePresence>

          {/* EMAIL */}
          <motion.div
            whileFocus={{
              scale: 1.01,
            }}
          >

            <p className="text-sm text-zinc-400 mb-3">
              Email
            </p>

            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
              className="w-full p-4 rounded-2xl bg-black border border-white/10 outline-none focus:border-orange-500 focus:shadow-[0_0_25px_rgba(255,140,0,0.15)] transition-all duration-300"
            />

          </motion.div>

          {/* PASSWORD */}
          <motion.div
            whileFocus={{
              scale: 1.01,
            }}
          >

            <p className="text-sm text-zinc-400 mb-3">
              Password
            </p>

            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
              className="w-full p-4 rounded-2xl bg-black border border-white/10 outline-none focus:border-orange-500 focus:shadow-[0_0_25px_rgba(255,140,0,0.15)] transition-all duration-300"
            />

          </motion.div>

          {/* BUTTON */}
          <motion.button
            whileHover={{
              scale: 1.02,
            }}
            whileTap={{
              scale: 0.98,
            }}
            type="submit"
            disabled={loading}
            className="mt-3 bg-gradient-to-r from-orange-400 to-orange-600 py-4 rounded-2xl font-bold text-lg transition-all duration-300 disabled:opacity-50 shadow-xl shadow-orange-500/20"
          >

            {loading
              ? "Please wait..."
              : isLogin
              ? "Login"
              : "Create Account"}

          </motion.button>

        </form>

        {/* SWITCH */}
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            delay: 0.4,
          }}
          className="mt-8 text-center"
        >

          <p className="text-zinc-500">

            {isLogin
              ? "Don't have an account?"
              : "Already have an account?"}

            <button
              onClick={() =>
                setIsLogin(!isLogin)
              }
              className="ml-2 text-orange-400 hover:text-orange-300 transition"
            >
              {isLogin
                ? "Sign Up"
                : "Login"}
            </button>

          </p>

        </motion.div>

      </motion.div>

    </motion.main>
  );
}