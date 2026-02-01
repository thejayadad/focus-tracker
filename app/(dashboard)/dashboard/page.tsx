import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  async function signOut() {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/login");
  }

  return (
    <main style={{ padding: 24, maxWidth: 720 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>Dashboard</h1>
      <p style={{ opacity: 0.8, marginTop: 6 }}>
        Signed in as: <strong>{user.email}</strong>
      </p>

      <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
        <form action={signOut}>
          <button type="submit" style={{ padding: 10 }}>
            Sign out
          </button>
        </form>
      </div>

      <p style={{ marginTop: 24, opacity: 0.7 }}>
        Next: add Techniques CRUD, then Sessions CRUD, then the Timer UI.
      </p>
    </main>
  );
}
