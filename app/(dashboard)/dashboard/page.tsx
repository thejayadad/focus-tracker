"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type View = "form" | "check-email";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [view, setView] = useState<View>("form");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If user is already logged in, bounce them to dashboard
  useEffect(() => {
    let isMounted = true;
    supabase.auth.getUser().then(({ data }) => {
      if (!isMounted) return;
      if (data.user) router.replace("/dashboard");
    });
    return () => {
      isMounted = false;
    };
  }, [router, supabase]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    if (data.user) {
      router.push("/dashboard");
      router.refresh();
    }
  }

  async function onSignup() {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    // If email confirmations are ON, session will be null until confirmed
    if (!data.session) {
      setView("check-email");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  async function onResend() {
    setLoading(true);
    setError(null);

    // Re-trigger signUp to resend confirmation (Supabase behavior depends on settings)
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setView("check-email");
  }

  return (
    <main style={{ padding: 24, maxWidth: 420 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>Login</h1>
      <p style={{ opacity: 0.8 }}>Sign in to your focus tracker.</p>

      {view === "check-email" ? (
        <div
          style={{
            marginTop: 16,
            padding: 12,
            border: "1px solid #ddd",
            borderRadius: 12,
          }}
        >
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>Check your email</h2>
          <p style={{ marginTop: 6, opacity: 0.85 }}>
            We sent a confirmation link to <strong>{email}</strong>.
            <br />
            Confirm your email, then come back and sign in.
          </p>

          {error ? (
            <div style={{ color: "crimson", marginTop: 10 }}>{error}</div>
          ) : null}

          <div style={{ marginTop: 12, display: "flex", gap: 10 }}>
            <button type="button" onClick={() => setView("form")} style={{ padding: 10 }}>
              Back
            </button>

            <button
              type="button"
              onClick={onResend}
              disabled={loading}
              style={{ padding: 10 }}
            >
              {loading ? "Working…" : "Resend email"}
            </button>
          </div>
        </div>
      ) : (
        <form
          onSubmit={onSubmit}
          style={{ marginTop: 16, display: "grid", gap: 12 }}
        >
          <label>
            <div>Email</div>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              style={{ width: "100%", padding: 10 }}
            />
          </label>

          <label>
            <div>Password</div>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
              style={{ width: "100%", padding: 10 }}
            />
          </label>

          {error ? <div style={{ color: "crimson" }}>{error}</div> : null}

          <button type="submit" disabled={loading} style={{ padding: 10 }}>
            {loading ? "Working…" : "Sign in"}
          </button>

          <button type="button" onClick={onSignup} disabled={loading} style={{ padding: 10 }}>
            {loading ? "Working…" : "Create account"}
          </button>
        </form>
      )}
    </main>
  );
}
