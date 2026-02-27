import { useState, useRef, useEffect } from "react";
import "./App.css";
import abyImg from "./aby.jpg";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = input;
    setInput("");
    setLoading(true);
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);

    try {
      const res = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });
      const data = await res.json();
      const botReply = data.reply || data.error || "...";
      setMessages((prev) => [...prev, { role: "bot", text: botReply }]);
    } catch {
      setMessages((prev) => [...prev, { role: "bot", text: "Connection error!" }]);
    }
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="page">
      <div className="card">

        {/* Header */}
        <header className="header">
          <div className="header-left">
            <img src={abyImg} alt="avatar" className="avatar" />
            <div>
              <p className="ai-name">ai.by</p>
              <p className="ai-status"><span className="dot" />Enthum chothikam</p>
            </div>
          </div>
          <p className="tagline">.</p>
        </header>

        {/* Messages */}
        <div className="chatbox">
          {messages.length === 0 && (
            <div className="empty">
              <div className="empty-icon">✦</div>
              <p className="empty-title">Hello there</p>
              <p className="empty-sub">Start a conversation below</p>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`row ${msg.role}`}>
              {msg.role === "bot" && (
                <img src={abyImg} alt="avatar" className="msg-avatar" />
              )}
              <div className={`bubble ${msg.role}`}>{msg.text}</div>
            </div>
          ))}

          {loading && (
            <div className="row bot">
              <img src={abyImg} alt="avatar" className="msg-avatar" />
              <div className="bubble bot typing">
                <span /><span /><span />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="input-area">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Write a message..."
          />
          <button onClick={sendMessage} disabled={loading} className={input.trim() ? "active" : ""}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>

      </div>
    </div>
  );
}

export default App;