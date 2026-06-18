

"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <div className="flex justify-between items-center p-4 bg-black text-white">
      <h1 className="text-lg">Pumps Dashboard</h1>

      <div className="flex gap-4">
        <Link href="/login">Login</Link>
        <Link href="/register">Register</Link>
      </div>
    </div>
  );
}