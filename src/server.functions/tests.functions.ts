import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  addDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { dbServer } from "../lib/firebase.server";
import type { TestDoc } from "../lib/types";
import { sanitizeTimestamps } from "../lib/sanitize";

export const getTestsFn = createServerFn({ method: "GET" }).handler(async () => {
  const snap = await getDocs(query(collection(dbServer(), "tests"), orderBy("startAt", "desc")));
  return sanitizeTimestamps<TestDoc[]>(
    snap.docs.map((d) => ({ id: d.id, ...(d.data() as TestDoc) })),
  );
});

export const getTestByIdFn = createServerFn({ method: "GET" })
  .inputValidator(z.object({ testId: z.string() }))
  .handler(async ({ data }) => {
    const snap = await getDoc(doc(dbServer(), "tests", data.testId));
    if (!snap.exists()) {
      return null;
    }
    return sanitizeTimestamps<TestDoc>({ id: snap.id, ...(snap.data() as TestDoc) });
  });

export const createTestFn = createServerFn({ method: "POST" })
  .inputValidator(z.any()) // Validation done in component for simplicity of migration
  .handler(async ({ data }) => {
    const testData = data as Omit<TestDoc, "id">;
    const ref = await addDoc(collection(dbServer(), "tests"), testData);
    return { id: ref.id };
  });

export const updateTestFn = createServerFn({ method: "POST" })
  .inputValidator(z.any())
  .handler(async ({ data }) => {
    const { id, ...testData } = data as TestDoc;
    await updateDoc(doc(dbServer(), "tests", id as string), testData);
    return { success: true };
  });

export const deleteTestFn = createServerFn({ method: "POST" })
  .inputValidator(z.object({ testId: z.string() }))
  .handler(async ({ data }) => {
    await deleteDoc(doc(dbServer(), "tests", data.testId));
    return { success: true };
  });
