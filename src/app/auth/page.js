"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();

  const [isLogin, setIsLogin] = useState(true);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // CHECK SESSION
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

  // MESSAGE
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
      const { error } =
        await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username,
            },
          },
        });

      if (error) {
        showMessage(error.message);
      } else {
        showMessage("✅ Account created! Check your email.");

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
      }}
      animate={{
        opacity: 1,
      }}
      className="min-h-screen bg-black text-white flex items-center justify-center px-6 relative overflow-hidden"
    >

      {/* BACKGROUND */}
      <div className="absolute inset-0 overflow-hidden">

        <motion.div
          animate={{
            x: [0, 40, 0],
            y: [0, -40, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
          }}
          className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] rounded-full bg-orange-500/20 blur-[120px]"
        />

        <motion.div
          animate={{
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
          }}
          className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] rounded-full bg-orange-400/10 blur-[120px]"
        />

      </div>

      {/* MESSAGE */}
      <AnimatePresence>

        {message && (
          <motion.div
            initial={{
              opacity: 0,
              y: -20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -20,
            }}
            className="fixed top-10 left-1/2 -translate-x-1/2 z-50"
          >

            <div className="bg-zinc-900 border border-white/10 rounded-3xl px-6 py-4 shadow-2xl backdrop-blur-xl">
              {message}
            </div>

          </motion.div>
        )}

      </AnimatePresence>

      {/* CARD */}
      <motion.div
        initial={{
          opacity: 0,
          y: 30,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="relative z-10 w-full max-w-md bg-white/[0.04] border border-white/10 rounded-[36px] p-8 backdrop-blur-2xl shadow-2xl"
      >

        {/* LOGO */}
        <div className="text-center mb-10">

          <div className="w-20 h-20 rounded-[28px] bg-gradient-to-br from-orange-400 to-orange-600 mx-auto flex items-center justify-center text-3xl font-black shadow-xl shadow-orange-500/20 mb-6">
            D
          </div>

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

        </div>

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
                  className="w-full p-4 rounded-2xl bg-black border border-white/10 outline-none focus:border-orange-500 transition-all"
                />

              </motion.div>
            )}

          </AnimatePresence>

          {/* EMAIL */}
          <div>

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
              className="w-full p-4 rounded-2xl bg-black border border-white/10 outline-none focus:border-orange-500 transition-all"
            />

          </div>

          {/* PASSWORD */}
          <div>

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
              className="w-full p-4 rounded-2xl bg-black border border-white/10 outline-none focus:border-orange-500 transition-all"
            />

          </div>

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
            className="mt-3 bg-gradient-to-r from-orange-400 to-orange-600 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-orange-500/20"
          >

            {loading
              ? "Please wait..."
              : isLogin
              ? "Login"
              : "Create Account"}

          </motion.button>

        </form>

        {/* SWITCH */}
        <div className="mt-8 text-center">

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

        </div>

      </motion.div>

    </motion.main>
  );
}