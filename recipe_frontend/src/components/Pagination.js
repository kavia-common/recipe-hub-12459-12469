import React from "react";

/**
 * Simple next/prev pagination with page size display.
 */
export default function Pagination({ page, pageSize, onPageChange, isEnd }) {
  const prev = () => onPageChange(Math.max(1, page - 1));
  const next = () => onPageChange(page + 1);
  return (
    <div style={{ display: "flex", gap: 8, justifyContent: "center", padding: 12 }}>
      <button className="btn small outline" onClick={prev} disabled={page <= 1}>Prev</button>
      <span style={{ alignSelf: "center" }}>Page {page}</span>
      <button className="btn small outline" onClick={next} disabled={isEnd}>Next</button>
    </div>
  );
}
