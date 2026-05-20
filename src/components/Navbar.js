"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full border-b border-white/10 bg-black/80 backdrop-blur-xl sticky top-0 z-50">

      <div className="max-w-7xl mx-auto px-6 lg:px-12 h-24 flex items-center justify-between">

        {/* LOGO TEXT */}
        <Link
          href="/"
          className="flex items-center gap-3"
        >

          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-2xl font-black shadow-xl shadow-orange-500/30">
            D
          </div>

          <div>

            <h1 className="text-4xl font-black leading-none">
              DIMNY
            </h1>

            <p className="text-zinc-500 text-sm">
              Creator Platform
            </p>

          </div>

        </Link>

        {/* NAV LINKS */}
        <div className="hidden md:flex items-center gap-12 text-lg">

          <Link
            href="/"
            className="hover:text-orange-400 transition"
          >
            Home
          </Link>

          <Link
            href="/faq"
            className="hover:text-orange-400 transition"
          >
            FAQ
          </Link>

          <Link
            href="/creators"
            className="hover:text-orange-400 transition"
          >
            Creator Dashboard
          </Link>

          <Link
            href="/apply"
            className="hover:text-orange-400 transition"
          >
            Start Clipping
          </Link>

        </div>

        {/* LOGIN BUTTON */}
        <Link
          href="/auth"
          className="bg-gradient-to-r from-orange-400 to-orange-600 px-8 py-4 rounded-2xl font-bold hover:scale-105 transition-all duration-300 shadow-xl shadow-orange-500/20"
        >
          Login
        </Link>

      </div>

    </nav>
  );
}