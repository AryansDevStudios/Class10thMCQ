import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db, FIREBASE_CONFIGURED } from "@/lib/firebase";

type StudentRow = {
  srNo: string;
  name: string;
  section: string;
  password: string;
  whatsapp?: string;
};

export const Route = createFileRoute("/admin/students")({
  component: StudentsPage,
});

function StudentsPage() {
  const [rows, setRows] = useState<StudentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  const load = async () => {
    if (!FIREBASE_CONFIGURED) {
      setLoading(false);
      return;
    }
    const snap = await getDocs(collection(db(), "students"));
    setRows(
      snap.docs
        .map((d) => d.data() as StudentRow)
        .sort((a, b) => (a.section + a.srNo).localeCompare(b.section + b.srNo))
    );
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const resetPwd = async (srNo: string) => {
    const next = prompt("New password for " + srNo + ":");
    if (!next) return;
    await updateDoc(doc(db(), "students", srNo), { password: next });
    load();
  };

  const remove = async (srNo: string) => {
    if (!confirm("Delete student " + srNo + "?")) return;
    await deleteDoc(doc(db(), "students", srNo));
    load();
  };

  const filtered = rows.filter((r) =>
    [r.srNo, r.name, r.section].some((v) => v.toLowerCase().includes(filter.toLowerCase()))
  );

  return (
    <div>
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Students</h1>
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Search…"
          className="input max-w-xs"
        />
      </header>

      <p className="mt-2 text-xs text-amber-700">
        Passwords are stored in plain text per requirements — visible to administration.
      </p>

      {loading ? (
        <p className="mt-6 text-sm text-slate-500">Loading…</p>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
              <tr>
                <th className="px-3 py-2">Sr. No.</th>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Section</th>
                <th className="px-3 py-2">Password</th>
                <th className="px-3 py-2">WhatsApp</th>
                <th className="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.srNo} className="border-t border-slate-100">
                  <td className="px-3 py-2 font-mono">{r.srNo}</td>
                  <td className="px-3 py-2">{r.name}</td>
                  <td className="px-3 py-2">10-{r.section}</td>
                  <td className="px-3 py-2 font-mono">{r.password}</td>
                  <td className="px-3 py-2 font-mono">{r.whatsapp || "-"}</td>
                  <td className="px-3 py-2 text-right">
                    <button onClick={() => resetPwd(r.srNo)} className="text-blue-600 hover:underline text-xs mr-3">
                      Reset password
                    </button>
                    <button onClick={() => remove(r.srNo)} className="text-red-600 hover:underline text-xs">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="px-3 py-8 text-center text-slate-500">No students.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
