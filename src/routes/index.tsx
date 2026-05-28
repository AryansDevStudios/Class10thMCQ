import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { GraduationCap, ShieldCheck } from "lucide-react";
import { FIREBASE_CONFIGURED } from "@/lib/firebase";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Class 10th MCQ Test" },
      { name: "description", content: "Real-time MCQ testing platform for MP Public School." },
    ],
  }),
  component: Home,
});

function Home() {
  const { student, isAdmin } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (student) navigate({ to: "/student" });
    else if (isAdmin) navigate({ to: "/admin" });
  }, [student, isAdmin, navigate]);
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="mx-auto max-w-4xl px-6 py-20">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Class 10th MCQ Test
          </h1>
          <p className="mt-3 text-slate-600">
            Secure, real-time MCQ tests for MP Public School, Anandnagar Maharajganj.
          </p>
        </div>

        {!FIREBASE_CONFIGURED && (
          <div className="mt-8 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
            <strong>Setup required:</strong> Edit <code>src/lib/firebase.ts</code> and paste your
            Firebase Web App config. Then enable Firestore in the Firebase console and apply the
            rules from <code>src/lib/firestore.rules.txt</code>.
          </div>
        )}

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          <Link
            to="/student/login"
            className="group rounded-xl border border-slate-200 bg-white p-8 shadow-sm transition hover:border-blue-400 hover:shadow-md"
          >
            <GraduationCap className="h-10 w-10 text-blue-600" />
            <h2 className="mt-4 text-xl font-semibold text-slate-900">Student</h2>
            <p className="mt-2 text-sm text-slate-600">
              Log in with your Sr. No. to take active tests.
            </p>
          </Link>

          <Link
            to="/admin"
            className="group rounded-xl border border-slate-200 bg-white p-8 shadow-sm transition hover:border-emerald-400 hover:shadow-md"
          >
            <ShieldCheck className="h-10 w-10 text-emerald-600" />
            <h2 className="mt-4 text-xl font-semibold text-slate-900">Management / Teacher</h2>
            <p className="mt-2 text-sm text-slate-600">
              Create tests, schedule windows, view live results.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
