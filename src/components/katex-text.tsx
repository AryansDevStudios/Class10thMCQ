import "katex/dist/katex.min.css";
import pkg from "react-katex";
const { BlockMath, InlineMath } = pkg;
import { Fragment } from "react";

// Renders a string that mixes plain text with $...$ inline math and $$...$$
// block math. Safe for chemistry/math equations.

export function KatexText({ text }: { text: string }) {
  if (!text) return null;
  const parts: Array<{ type: "text" | "inline" | "block"; value: string }> = [];
  let i = 0;
  while (i < text.length) {
    if (text[i] === "$" && text[i + 1] === "$") {
      const end = text.indexOf("$$", i + 2);
      if (end === -1) {
        parts.push({ type: "text", value: text.slice(i) });
        break;
      }
      parts.push({ type: "block", value: text.slice(i + 2, end) });
      i = end + 2;
    } else if (text[i] === "$") {
      const end = text.indexOf("$", i + 1);
      if (end === -1) {
        parts.push({ type: "text", value: text.slice(i) });
        break;
      }
      parts.push({ type: "inline", value: text.slice(i + 1, end) });
      i = end + 1;
    } else {
      const nextDollar = text.indexOf("$", i);
      const end = nextDollar === -1 ? text.length : nextDollar;
      parts.push({ type: "text", value: text.slice(i, end) });
      i = end;
    }
  }
  return (
    <span className="katex-text">
      {parts.map((p, idx) => {
        if (p.type === "text") return <Fragment key={idx}>{p.value}</Fragment>;
        try {
          return p.type === "inline" ? (
            <InlineMath key={idx} math={p.value} />
          ) : (
            <BlockMath key={idx} math={p.value} />
          );
        } catch {
          return <code key={idx}>{p.value}</code>;
        }
      })}
    </span>
  );
}
