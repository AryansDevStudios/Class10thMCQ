export function sanitizeTimestamps<T>(obj: any): T {
  if (obj === null || obj === undefined) return obj as T;
  if (typeof obj?.toMillis === "function") return obj.toMillis();
  if (Array.isArray(obj)) return obj.map(sanitizeTimestamps) as unknown as T;
  if (typeof obj === "object") {
    const newObj: any = {};
    for (const key in obj) {
      newObj[key] = sanitizeTimestamps(obj[key]);
    }
    return newObj as T;
  }
  return obj as T;
}
