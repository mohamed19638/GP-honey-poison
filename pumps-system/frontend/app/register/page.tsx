"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "@/services/api";
import "../login/login.css"; 

export default function RegisterPage() {
  const router = useRouter();

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    phone: "",
  });

  const handleRegister = async () => {
    try {
      await register(user);

      alert("✅ Registered successfully");
      router.push("/login");

    } catch (err: any) {
      if (err.message.includes("exists")) {
        alert("⚠️ User already exists");
      } else {
        alert("❌ Error");
      }
    }
  };

  return (
    <div className="container">

    
      <div className="left">
        <div>
          <h1>Pump System</h1>
          <p>Create your account to monitor pumps in real-time</p>
        </div>
      </div>

     
      <div className="right">
        <div className="card">
          <h2>Register</h2>

          <input
            className="input"
            placeholder="First Name"
            onChange={(e) =>
              setUser({ ...user, firstName: e.target.value })
            }
          />

          <input
            className="input"
            placeholder="Last Name"
            onChange={(e) =>
              setUser({ ...user, lastName: e.target.value })
            }
          />

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

          <input
            className="input"
            placeholder="Phone"
            onChange={(e) =>
              setUser({ ...user, phone: e.target.value })
            }
          />

          <button className="button" onClick={handleRegister}>
            Register
          </button>

          <p className="link" onClick={() => router.push("/login")}>
            Already have an account? Login
          </p>
        </div>
      </div>
    </div>
  );
}