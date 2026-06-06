import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { collection, doc, getDoc, getDocs, updateDoc, setDoc } from "firebase/firestore";
import { dbServer } from "../lib/firebase.server";
import type { Submission } from "../lib/types";
import { sanitizeTimestamps } from "../lib/sanitize";

export const getStudentSubmissionFn = createServerFn({ method: "GET" })
  .inputValidator(z.object({ testId: z.string(), srNo: z.string() }))
  .handler(async ({ data }) => {
    const snap = await getDoc(doc(dbServer(), "tests", data.testId, "submissions", data.srNo));
    if (!snap.exists()) {
      return null;
    }
    return sanitizeTimestamps<Submission>(snap.data() as Submission);
  });

export const getMultipleStudentSubmissionsFn = createServerFn({ method: "POST" })
  .inputValidator(z.object({ srNo: z.string(), testIds: z.array(z.string()) }))
  .handler(async ({ data }) => {
    const results = await Promise.all(
      data.testIds.map(async (testId) => {
        try {
          const sub = await getDoc(doc(dbServer(), "tests", testId, "submissions", data.srNo));
          return sub.exists() && (sub.data() as any).submittedAt ? testId : null;
        } catch {
          return null;
        }
      }),
    );
    return results.filter((x): x is string => !!x);
  });

export const submitTestFn = createServerFn({ method: "POST" })
  .inputValidator(z.any())
  .handler(async ({ data }) => {
    const { testId, srNo, updateData } = data as {
      testId: string;
      srNo: string;
      updateData: Partial<Submission>;
    };
    await setDoc(doc(dbServer(), "tests", testId, "submissions", srNo), updateData, {
      merge: true,
    });
    return { success: true };
  });

export const getTestSubmissionsFn = createServerFn({ method: "GET" })
  .inputValidator(z.object({ testId: z.string() }))
  .handler(async ({ data }) => {
    const snap = await getDocs(collection(dbServer(), "tests", data.testId, "submissions"));
    return sanitizeTimestamps<Submission[]>(
      snap.docs.map((d) => ({ srNo: d.id, ...(d.data() as Submission) })),
    );
  });
