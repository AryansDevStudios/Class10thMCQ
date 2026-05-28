import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Student = {
  srNo: string;
  name: string;
  section: "A" | "B" | "H";
  whatsapp?: string;
};

type AuthState = {
  student: Student | null;
  isAdmin: boolean;
  loginStudent: (s: Student) => void;
  logoutStudent: () => void;
  setAdmin: (v: boolean) => void;
};

const AuthCtx = createContext<AuthState | null>(null);

const STUDENT_KEY = "atp.student";
const ADMIN_KEY = "atp.admin";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [student, setStudent] = useState<Student | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    try {
      const s = localStorage.getItem(STUDENT_KEY);
      if (s) setStudent(JSON.parse(s));
      setIsAdmin(localStorage.getItem(ADMIN_KEY) === "1");
    } catch {}
  }, []);

  const loginStudent = (s: Student) => {
    localStorage.setItem(STUDENT_KEY, JSON.stringify(s));
    setStudent(s);
  };
  const logoutStudent = () => {
    localStorage.removeItem(STUDENT_KEY);
    setStudent(null);
  };
  const setAdmin = (v: boolean) => {
    if (v) localStorage.setItem(ADMIN_KEY, "1");
    else localStorage.removeItem(ADMIN_KEY);
    setIsAdmin(v);
  };

  return (
    <AuthCtx.Provider value={{ student, isAdmin, loginStudent, logoutStudent, setAdmin }}>
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
