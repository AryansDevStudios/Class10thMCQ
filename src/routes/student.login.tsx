import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db, FIREBASE_CONFIGURED } from "@/lib/firebase";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/student/login")({
  component: StudentLogin,
});

function StudentLogin() {
  const navigate = useNavigate();
  const { loginStudent } = useAuth();
  const [srNo, setSrNo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!FIREBASE_CONFIGURED) {
      setError("Firebase not configured. See homepage notice.");
      return;
    }
    setLoading(true);
    try {
      const snap = await getDoc(doc(db(), "students", srNo.trim()));
      if (!snap.exists()) {
        setError("No student with that Sr. No.");
      } else {
        const data = snap.data() as { password: string; name: string; section: "A" | "B" | "H" };
        if (data.password !== password) {
          setError("Incorrect password. Ask administration to reset it.");
        } else {
          loginStudent({ srNo: srNo.trim(), name: data.name, section: data.section });
          navigate({ to: "/student" });
        }
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-16">
      <div className="mx-auto max-w-md">
        <Link to="/" className="text-sm text-slate-600 hover:text-slate-900">← Back to home</Link>
        <h1 className="mt-3 text-2xl font-bold text-slate-900">Student Login</h1>
        <form onSubmit={onSubmit} className="mt-6 space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <Field label="Sr. No.">
            <input
              value={srNo}
              onChange={(e) => setSrNo(e.target.value)}
              required
              className="input"
              autoFocus
            />
          </Field>
          <Field label="Password">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input"
            />
          </Field>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button disabled={loading} className="btn-primary w-full">
            {loading ? "Signing in…" : "Sign In"}
          </button>
          <p className="text-center text-sm text-slate-600">
            New student?{" "}
            <Link to="/student/register" className="text-blue-600 hover:underline">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
