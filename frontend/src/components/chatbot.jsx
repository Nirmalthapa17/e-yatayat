import React, { useState, useRef, useEffect } from "react";
import Fuse from "fuse.js";
import { siteKnowledge } from "../data/knowledge";
import "./chatbot.css";

// Configure Fuse to search across multiple fields for better accuracy
const fuse = new Fuse(siteKnowledge, {
  keys: ["topic", "content", "keywords"],
  threshold: 0.4, // Lower is stricter, 0.4 is a good balance for fuzzy matching
  ignoreLocation: true,
});

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    { 
      sender: "bot", 
      text: "Namaste! 🙏 I'm your e-Yatayat Assistant. I can help with Verification, License/Bluebook renewals, or Tax Rates. What's on your mind?" 
    }
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  // Auto-scroll to the latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (open) scrollToBottom();
  }, [messages, isTyping, open]);

  /**
   * Logic to find the best answer from siteKnowledge
   */
  function getAIAnswer(question) {
    const q = question.toLowerCase().trim();
    
    // 1. Fuzzy Search using Fuse.js
    const results = fuse.search(q);
    
    if (results.length > 0) {
      return results[0].item.content;
    }

    // 2. Specialized Fallback for "Tax" (If the user just types 'tax')
    if (q.includes("tax") || q.includes("rate")) {
      return "Are you asking about 'Bike Tax Rates' or 'Car Tax Rates'? Please specify!";
    }

    // 3. Default Fallback
    const fallback = siteKnowledge.find(k => k.topic === "unknown");
    return fallback ? fallback.content : "I'm sorry, I don't have information on that. Try asking about license, bluebook, or tax rates.";
  }

  /**
   * Handles sending a message
   */
  function handleSend(textToSend = input) {
    if (!textToSend.trim()) return;

    // Add user message to UI
    setMessages(prev => [...prev, { sender: "user", text: textToSend }]);
    setInput("");
    setIsTyping(true);

    // Simulate "Bot is thinking" delay
    setTimeout(() => {
      const botReply = getAIAnswer(textToSend);
      setMessages(prev => [...prev, { sender: "bot", text: botReply }]);
      setIsTyping(false);
    }, 900);
  }

  return (
    <>
      {/* Floating Action Button */}
      <div className={`chatbot-fab ${open ? "active" : ""}`} onClick={() => setOpen(!open)}>
        {open ? "✖" : "🤖"}
      </div>

      {open && (
        <div className="chatbot-window shadow-lg">
          {/* Header */}
          <div className="chatbot-header">
            <div className="d-flex align-items-center">
              <span className="bot-avatar-mini me-2">🤖</span>
              <div className="text-start">
                <p className="m-0 fw-bold" style={{ fontSize: '0.9rem' }}>e-Yatayat AI</p>
                <small className="opacity-75" style={{ fontSize: '0.7rem' }}>Online | Official Assistant</small>
              </div>
            </div>
            <button className="btn-close-chat" onClick={() => setOpen(false)}>—</button>
          </div>

          {/* Messages Body */}
          <div className="chatbot-body">
            {messages.map((msg, idx) => (
              <div key={idx} className={`${msg.sender}-msg-container`}>
                <div className={`${msg.sender}-msg shadow-sm`}>
                  {msg.text.split('\n').map((line, i) => (
                    <span key={i}>{line}<br/></span>
                  ))}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="bot-msg-container">
                <div className="bot-msg typing shadow-sm">
                  <span>●</span><span>●</span><span>●</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Chips */}
          <div className="chatbot-suggestions scroll-hide">
            <button onClick={() => handleSend("Tax Rates")}>💰 Tax Rates</button>
            <button onClick={() => handleSend("How to verify account?")}>🪪 Verification</button>
            <button onClick={() => handleSend("Renew License")}>🆔 License</button>
            <button onClick={() => handleSend("Renew Bluebook")}>🚗 Bluebook</button>
            <button onClick={() => handleSend("Late Fines")}>⚠️ Fines</button>
          </div>

          {/* Input Footer */}
          <div className="chatbot-footer">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSend()}
              placeholder="Ask me a question..."
              autoFocus
            />
            <button className="btn-send" onClick={() => handleSend()} disabled={!input.trim()}>
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}