import React, { useCallback, useMemo, useState } from "react";
import { recommendTitles } from "../api/titles";
import "./note-title.css";
import { useToast } from "./Toast";

/**
 * PUBLIC_INTERFACE
 * Modal wrapper component.
 * Renders children inside a centered modal with a backdrop.
 */
export function Modal({ title = "", onClose, children }) {
  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="btn small outline" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * NoteTitleRecommender allows users to paste or type note content,
 * request recommended titles from the backend, and pick a title.
 *
 * Props:
 * - open: boolean - control modal visibility
 * - onClose: () => void - called when the user closes the modal
 * - onUseTitle: (title: string) => void - called when user selects "Use this title"
 * - initialContent?: string - optional initial note content
 */
export default function NoteTitleRecommender({ open = false, onClose = () => {}, onUseTitle = () => {}, initialContent = "" }) {
  const [content, setContent] = useState(initialContent);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState("");
  const { notify } = useToast();

  const canRequest = useMemo(() => content.trim().length > 0 && !loading, [content, loading]);

  const requestSuggestions = useCallback(async () => {
    if (!canRequest) return;
    setLoading(true);
    setError("");
    setSuggestions([]);
    try {
      const { suggestions: suggs } = await recommendTitles({ content: content.trim() });
      setSuggestions(suggs);
      if (!suggs.length) {
        notify({ type: "info", message: "No suggestions returned. Try modifying your content." });
      }
    } catch (e) {
      const msg = e?.uiMessage || e?.message || "Failed to get recommendations.";
      setError(msg);
      notify({ type: "error", message: msg });
    } finally {
      setLoading(false);
    }
  }, [canRequest, content, notify]);

  const handleUse = (title) => {
    if (typeof onUseTitle === "function") {
      onUseTitle(title);
    }
    if (typeof onClose === "function") {
      onClose();
    }
  };

  if (!open) return null;

  return (
    <Modal title="Recommend a Title" onClose={onClose}>
      <div className="recommender">
        <label className="block">
          <div className="label">Note content</div>
          <textarea
            rows={8}
            placeholder="Paste your note content here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </label>
        <div className="actions">
          <button className="btn" onClick={requestSuggestions} disabled={!canRequest}>
            {loading ? <span className="loading-inline"><span className="spinner" /> Requesting...</span> : "Get recommended titles"}
          </button>
          <button className="btn outline" onClick={onClose}>Close</button>
        </div>

        {error && <div className="error">{error}</div>}

        <div className="suggestions">
          {loading && <p className="muted"><span className="spinner" /> Generating suggestions...</p>}
          {!loading && suggestions.length > 0 && (
            <>
              <div className="label">Suggestions</div>
              <ul className="suggestion-list">
                {suggestions.map((s, idx) => (
                  <li key={idx} className="suggestion-item">
                    <div className="title">{s}</div>
                    <div className="row">
                      <button className="btn small" onClick={() => handleUse(s)}>Use this title</button>
                      <button
                        className="btn small outline"
                        onClick={() => navigator.clipboard?.writeText(s).catch(() => {})}
                        title="Copy to clipboard"
                      >
                        Copy
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}
