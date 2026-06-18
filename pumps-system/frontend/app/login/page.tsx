"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/services/api";
import "./login.css";

export default function LoginPage() {
  const router = useRouter();

  const [user, setUser] = useState({
    username: "",
    password: "",
  });

  const handleLogin = async () => {
    try {
      await login(user);
      alert("✅ Login success");
      router.push("/");
    } catch {
      alert("❌ Wrong data");
    }
  };

  return (
    <div className="container">

      {/* LEFT */}
      <div className="left">
        <div>
          <h1>Pump System</h1>
          <p>Real-time pump monitoring & analytics</p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="right">
        <div className="card">
          <h2>Login</h2>

          <input
            className="input"
            placeholder="Username"
            onChange={(e) =>
              setUser({ ...user, username: e.target.value })
            }
          />

          <input
            className="input"
            type="password"
            placeholder="Password"
            onChange={(e) =>
              setUser({ ...user, password: e.target.value })
            }
          />

          <button className="button" onClick={handleLogin}>
            Login
          </button>

          <p className="link" onClick={() => router.push("/register")}>
            Don't have an account? Register
          </p>
        </div>
      </div>
    </div>
  );
}
