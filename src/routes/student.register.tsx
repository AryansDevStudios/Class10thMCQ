import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db, FIREBASE_CONFIGURED } from "@/lib/firebase";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/student/register")({
  component: StudentRegister,
});

function StudentRegister() {
  const navigate = useNavigate();
  const { loginStudent } = useAuth();
  const [srNo, setSrNo] = useState("");
  const [name, setName] = useState("");
  const [section, setSection] = useState<"A" | "B" | "H">("A");
  const [password, setPassword] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!FIREBASE_CONFIGURED) {
      setError("Firebase not configured. See homepage notice.");
      return;
    }
    if (!srNo.trim() || !name.trim() || !password || !whatsapp.trim()) {
      setError("All fields are required.");
      return;
    }
    if (!/^\d{4}$/.test(srNo.trim())) {
      setError("Sr. No. must be exactly 4 digits.");
      return;
    }
    if (!/^\d{10}$/.test(whatsapp.trim())) {
      setError("WhatsApp number must be exactly 10 digits.");
      return;
    }
    setLoading(true);
    try {
      const ref = doc(db(), "students", srNo.trim());
      const existing = await getDoc(ref);
      if (existing.exists()) {
        setError("That Sr. No. is already registered. Try logging in.");
        return;
      }
      await setDoc(ref, {
        srNo: srNo.trim(),
        name: name.trim(),
        class: "10",
        section,
        password,
        whatsapp: whatsapp.trim(),
        createdAt: serverTimestamp(),
      });
      loginStudent({ srNo: srNo.trim(), name: name.trim(), section, whatsapp: whatsapp.trim() });
      navigate({ to: "/student" });
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
        <h1 className="mt-3 text-2xl font-bold text-slate-900">Student Registration</h1>
        <p className="mt-1 text-sm text-slate-600">Class 10 only.</p>
        <form onSubmit={onSubmit} className="mt-6 space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <Field label="Sr. No.">
            <input value={srNo} onChange={(e) => setSrNo(e.target.value)} required placeholder="e.g. 1234" maxLength={4} className="input" />
            <p className="mt-1 text-xs text-slate-500">Exactly 4 digits.</p>
          </Field>
          <Field label="Name">
            <input value={name} onChange={(e) => setName(e.target.value)} required className="input" />
          </Field>
          <Field label="Class">
            <input value="10" disabled className="input bg-slate-100" />
          </Field>
          <Field label="Section">
            <select value={section} onChange={(e) => setSection(e.target.value as "A" | "B" | "H")} className="input">
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="H">H</option>
            </select>
          </Field>
          <Field label="Password">
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="input" />
            <p className="mt-1 text-xs text-slate-500">
              Note: passwords are stored in plain text so administration can help if you forget it.
            </p>
          </Field>
          <Field label="WhatsApp Number">
            <input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} required placeholder="e.g. 9876543210" maxLength={10} className="input" />
            <p className="mt-1 text-xs text-slate-500">Exactly 10 digits. Used for sending test results.</p>
          </Field>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button disabled={loading} className="btn-primary w-full">
            {loading ? "Creating…" : "Register"}
          </button>
          <p className="text-center text-sm text-slate-600">
            Already registered?{" "}
            <Link to="/student/login" className="text-blue-600 hover:underline">
              Login
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
