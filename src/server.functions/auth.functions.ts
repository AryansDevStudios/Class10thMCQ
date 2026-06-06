import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { dbServer } from "../lib/firebase.server";
import { getServerConfig } from "../config.server";

export const adminLoginFn = createServerFn({ method: "POST" })
  .inputValidator(z.object({ code: z.string() }))
  .handler(async ({ data }) => {
    const config = getServerConfig();
    if (data.code !== config.adminCode) {
      throw new Error("Invalid admin code");
    }
    return { success: true };
  });

export const studentLoginFn = createServerFn({ method: "POST" })
  .inputValidator(z.object({ srNo: z.string(), password: z.string() }))
  .handler(async ({ data }) => {
    const snap = await getDoc(doc(dbServer(), "students", data.srNo));
    if (!snap.exists()) {
      throw new Error("No student with that Sr. No.");
    }
    const studentData = snap.data() as { password: string; name: string; section: "A" | "B" | "H" };
    if (studentData.password !== data.password) {
      throw new Error("Incorrect password. Ask administration to reset it.");
    }
    return {
      srNo: data.srNo,
      name: studentData.name,
      section: studentData.section,
    };
  });

export const studentRegisterFn = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      srNo: z.string(),
      name: z.string(),
      section: z.enum(["A", "B", "H"]),
      password: z.string(),
      whatsapp: z.string(),
    }),
  )
  .handler(async ({ data }) => {
    const ref = doc(dbServer(), "students", data.srNo);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      throw new Error("That Sr. No. is already registered. If this is you, please log in.");
    }

    await setDoc(ref, {
      name: data.name,
      section: data.section,
      password: data.password,
      whatsapp: data.whatsapp,
    });

    return {
      srNo: data.srNo,
      name: data.name,
      section: data.section,
    };
  });
