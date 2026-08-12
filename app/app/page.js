"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabaseClient";

const COLOR = {
  bg: "#0B0B0C",
  bgCard: "#151517",
  border: "#232326",
  text: "#F3F1EC",
  textDim: "#8B8B8F",
  signal: "#FF4D2E",
};

export default function Home() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [count, setCount] = useState(null);
  const supabase = createClient();

  useEffect(() => {
    loadCount();
  }, []);

  async function loadCount() {
    const { count } = await supabase
      .from("waitlist")
      .select("*", { count: "exact", head: true });
    setCount(count ?? 0);
  }

  async function joinWaitlist(e) {
    e.preventDefault();
    setMsg("");
    const trimmed = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setMsg("that doesn't look like a real email.");
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({
      email: trimmed,
      options: {
        emailRedirectTo:
          typeof window !== "undefined" ? window.location.origin : undefined,
      },
    });

    if (error) {
      setMsg("something went wrong — try again.");
      return;
    }
    setMsg("check your email — click the link to lock in your spot.");
    setEmail("");
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        fontFamily: "system-ui, sans-serif",
        color: COLOR.text,
      }}
    >
      <div style={{ textAlign: "center", maxWidth: 420 }}>
        <div
          style={{
            fontWeight: 700,
            letterSpacing: "0.15em",
            fontSize: 14,
            color: COLOR.textDim,
            marginBottom: 8,
          }}
        >
          THE TEN
        </div>
        <h1 style={{ fontSize: 28, margin: "0 0 12px", lineHeight: 1.2 }}>
          Ten random slots. 24 hours. Every midnight.
        </h1>
        <p style={{ color: COLOR.textDim, fontSize: 14, marginBottom: 28 }}>
          Join the waitlist. Every night, ten random people get a slot.
          No guarantees, no skipping the line.
        </p>

        <form
          onSubmit={joinWaitlist}
          style={{ display: "flex", gap: 8, marginBottom: 12 }}
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            style={{
              flex: 1,
              background: COLOR.bgCard,
              border: `1px solid ${COLOR.border}`,
              borderRadius: 8,
              color: COLOR.text,
              padding: "12px 14px",
              fontSize: 14,
            }}
          />
          <button
            type="submit"
            style={{
              background: COLOR.signal,
              color: "#0B0B0C",
              border: "none",
              borderRadius: 8,
              padding: "12px 20px",
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            Join
          </button>
        </form>

        {msg && (
          <div style={{ fontSize: 13, color: COLOR.textDim, marginBottom: 20 }}>
            {msg}
          </div>
        )}

        {count !== null && (
          <div
            style={{
              fontFamily: "monospace",
              fontSize: 13,
              color: COLOR.textDim,
            }}
          >
            {count} people waiting
          </div>
        )}
      </div>
    </main>
  );
}
