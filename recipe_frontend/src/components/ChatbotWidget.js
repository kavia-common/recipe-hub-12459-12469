import React, { useCallback, useMemo, useRef, useState, useEffect } from "react";
import { sendChatMessage } from "../api/chatbot";
import "./chatbot.css";
import { useToast } from "./Toast";

/**
 * ChatbotWidget renders a floating chat assistant that talks to the backend /chatbot endpoint.
 * It keeps a local conversation state and appends assistant responses.
 */
export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    // seed with a light system prompt so assistant understands context (optional, not sent as system if backend requires)
    return [
      { role: "assistant", content: "Hi! Ask me anything about recipes — ingredients, substitutions, or cooking tips." },
    ];
  });
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const listRef = useRef(null);
  const { notify } = useToast();

  const canSend = useMemo(() => input.trim().length > 0 && !sending, [input, sending]);

  const scrollToBottom = useCallback(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, open, scrollToBottom]);

  const onSend = useCallback(async () => {
    if (!canSend) return;
    const userText = input.trim();
    setInput("");
    const nextMessages = [...messages, { role: "user", content: userText }];

    // Optimistically add user message
    setMessages(nextMessages);
    setSending(true);

    try {
      // Build payload history excluding the initial greeting that has role assistant but isn't part of model context
      // We'll include only 'user' and 'assistant' messages following the greeting, but greeting isn't necessary for the model.
      const history = nextMessages
        .filter((m, idx) => !(idx === 0 && m.role === "assistant"))
        .map((m) => ({ role: m.role, content: m.content }));

      const data = await sendChatMessage({ messages: history });

      // Extract assistant message in a robust way:
      let assistantReply = "";
      try {
        const choice = Array.isArray(data?.choices) ? data.choices[0] : null;
        assistantReply = choice?.message?.content || "";
      } catch {
        // ignore
      }
      if (!assistantReply) {
        assistantReply = "Sorry, I couldn't generate a response.";
      }

      setMessages((prev) => [...prev, { role: "assistant", content: assistantReply }]);
    } catch (err) {
      const msg = err?.uiMessage || "Chat failed. Please try again.";
      notify({ type: "error", message: msg });
      // Append an error-style assistant message
      setMessages((prev) => [...prev, { role: "assistant", content: "⚠️ " + msg }]);
    } finally {
      setSending(false);
    }
  }, [canSend, input, messages, notify]);

  const onKeyDown = (e) => {
    if ((e.key === "Enter" || e.keyCode === 13) && (e.ctrlKey || e.metaKey)) {
      // allow multiline with enter; send on Ctrl/Cmd+Enter
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="chatbot-root" aria-live="polite">
      {!open && (
        <button
          className="chatbot-fab"
          onClick={() => setOpen(true)}
          aria-label="Open chatbot"
          title="Open chatbot"
        >
          💬
        </button>
      )}
      {open && (
        <div className="chatbot-panel">
          <div className="chatbot-header">
            <div className="chatbot-title">
              <span className="dot" /> Recipe Assistant
            </div>
            <div className="chatbot-actions">
              <button
                className="btn small outline"
                onClick={() => setMessages([{ role: "assistant", content: "Conversation cleared. How can I help?" }])}
                title="Clear conversation"
              >
                Clear
              </button>
              <button className="btn small" onClick={() => setOpen(false)} aria-label="Close chatbot" title="Close">
                ✕
              </button>
            </div>
          </div>

          <div className="chatbot-messages" ref={listRef}>
            {messages.map((m, idx) => (
              <div key={idx} className={`bubble ${m.role === "user" ? "user" : "assistant"}`}>
                <div className="bubble-inner">{m.content}</div>
              </div>
            ))}
            {sending && (
              <div className="bubble assistant">
                <div className="bubble-inner">
                  <span className="spinner" /> Thinking...
                </div>
              </div>
            )}
          </div>

          <div className="chatbot-input">
            <textarea
              rows={2}
              placeholder="Ask for recipe ideas, substitutions, or cooking tips... (Ctrl/Cmd+Enter to send)"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              aria-label="Type your message"
            />
            <button className="btn" onClick={onSend} disabled={!canSend} aria-label="Send message">
              {sending ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
