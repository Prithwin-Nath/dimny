"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Navbar() {
  const router = useRouter();

  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    setLoggedIn(!!session);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();

    setLoggedIn(false);

    router.push("/auth");
  };

  return (
    <nav className="w-full border-b border-white/10 bg-black/80 backdrop-blur-xl sticky top-0 z-50 overflow-hidden">

      <div className="max-w-7xl mx-auto px-4 lg:px-12 h-24 flex items-center justify-between">

        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3 shrink-0">

          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-2xl font-black shadow-xl shadow-orange-500/30 shrink-0">
            D
          </div>

          <div className="hidden sm:block">
            <h1 className="text-3xl md:text-4xl font-black leading-none">
              DIMNY
            </h1>

            <p className="text-zinc-500 text-sm">
              Creator Platform
            </p>
          </div>

        </Link>

        {/* NAV LINKS */}
        <div className="flex items-center gap-4 md:gap-10 text-sm md:text-lg overflow-x-auto scrollbar-hide">

          <Link
            href="/"
            className="hover:text-orange-400 transition whitespace-nowrap"
          >
            Home
          </Link>

          <Link
            href="/faq"
            className="hover:text-orange-400 transition whitespace-nowrap"
          >
            FAQ
          </Link>

          {/* HIDE PAYMENTS ON SMALL MOBILE */}
          <Link
            href="/payments"
            className="hidden sm:block hover:text-orange-400 transition whitespace-nowrap"
          >
            Payments
          </Link>

          <Link
            href="/creators"
            className="hover:text-orange-400 transition whitespace-nowrap"
          >
            Dashboard
          </Link>

        </div>

        {/* AUTH BUTTON */}
        <div className="shrink-0 ml-3">

          {loggedIn ? (
            <button
              onClick={handleLogout}
              className="bg-black border border-white/10 px-4 md:px-8 py-3 rounded-2xl font-bold hover:border-orange-500 transition-all duration-300 text-white text-sm md:text-base"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/auth"
              className="bg-gradient-to-r from-orange-400 to-orange-600 px-4 md:px-8 py-3 rounded-2xl font-bold hover:scale-105 transition-all duration-300 shadow-xl shadow-orange-500/20 text-sm md:text-base"
            >
              Login
            </Link>
          )}

        </div>

      </div>

    </nav>
  );
}