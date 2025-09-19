"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

// Self-contained floating chatbot widget with UI + logic combined.
// - Bottom-right floating button opens a glass dialog
// - Language switch (en/hi)
// - Mic input via Web Speech API (if available)
// - Speech synthesis for bot replies
// - Sends messages to "/chat" endpoint (adjust if needed)

const uiTranslations = {
  en: {
    title: "Career Guidance Chatbot",
    welcome: "👋 Welcome to your Career Guidance Chatbot!",
    description:
      "Ask me anything about career choices, roadmap building, or college search strategies. I'm here to help you succeed!",
    chooseLang: "Choose language:",
    inputPlaceholder: "Type your message...",
    send: "Send",
    mic: "🎤",
    open: "Chat",
    close: "Close",
  },
  hi: {
    title: "करियर मार्गदर्शन चैटबोट",
    welcome: "👋 अपने करियर मार्गदर्शन चैटबोट में आपका स्वागत है!",
    description:
      "मुझसे करियर विकल्प, रोडमैप, या कॉलेज खोज के बारे में कुछ भी पूछें। मैं आपकी सफलता में मदद करने के लिए यहाँ हूँ!",
    chooseLang: "भाषा चुनें:",
    inputPlaceholder: "अपना संदेश लिखें...",
    send: "भेजें",
    mic: "🎤",
    open: "चैट",
    close: "बंद करें",
  },
};

const speechLangMap = {
  en: "en-US",
  hi: "hi-IN",
};

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [lang, setLang] = useState("en");
  const t = uiTranslations[lang] || uiTranslations.en;

  const [messages, setMessages] = useState([
    { sender: "bot", text: t.welcome },
    { sender: "bot", text: t.description },
  ]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const chatRef = useRef(null);
  const recognitionRef = useRef(null);

  // Keep welcome messages in sync with language
  useEffect(() => {
    setMessages([
      { sender: "bot", text: t.welcome },
      { sender: "bot", text: t.description },
    ]);
  }, [t.welcome, t.description]);

  // Auto-scroll on new messages
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const canUseSpeech = useMemo(() => {
    return (
      typeof window !== "undefined" &&
      ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)
    );
  }, []);

  const speak = useCallback((text) => {
    if (typeof window === "undefined") return;
    try {
      const synthLang = speechLangMap[lang] || "en-US";
      const utter = new window.SpeechSynthesisUtterance(text);
      utter.lang = synthLang;
      window.speechSynthesis?.speak(utter);
    } catch (e) {
      // no-op if unsupported
    }
  }, [lang]);

  const startVoiceInput = useCallback(async () => {
    if (!canUseSpeech) return;
    try {
      // Request mic permission to improve reliability on some browsers
      if (navigator?.mediaDevices?.getUserMedia) {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      }
      const Rec =
        typeof window !== "undefined" &&
        (window.SpeechRecognition || window.webkitSpeechRecognition);
      if (!Rec) return;
      const recognition = new Rec();
      recognition.lang = speechLangMap[lang] || "en-US";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (e) => {
        const speechText = e.results?.[0]?.[0]?.transcript || "";
        if (speechText) {
          setInput(speechText);
          setTimeout(() => handleSend(speechText), 0);
        }
      };
      recognition.onerror = () => setIsListening(false);
      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  }, [canUseSpeech, lang]);

  const stopVoiceInput = useCallback(() => {
    try {
      recognitionRef.current?.stop?.();
    } catch {}
  }, []);

  const handleSend = useCallback(
    async (forcedText) => {
      const text = (forcedText ?? input).trim();
      if (!text || isSending) return;
      setIsSending(true);
      setMessages((prev) => [...prev, { sender: "user", text }]);
      setInput("");

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text, lang }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  const replyRaw = data?.reply ?? "Sorry, I couldn't understand that.";
  // Normalize common formatting: preserve newlines and light markdown
  const reply = String(replyRaw);
  setMessages((prev) => [...prev, { sender: "bot", text: reply }]);
        speak(reply);
      } catch (err) {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "There was a problem reaching the server." },
        ]);
      } finally {
        setIsSending(false);
      }
    },
    [input, isSending, lang, speak]
  );

  const toggleOpen = () => setIsOpen((v) => !v);

  return (
    <>
      {/* Floating action button */}
      <div className="fixed z-40 bottom-6 right-6">
        <button
          type="button"
          onClick={toggleOpen}
          className="relative inline-flex items-center gap-2 px-4 py-3 rounded-full shadow-lg ring-1 ring-black/10 text-white bg-gradient-to-r from-pink-500 via-fuchsia-500 to-indigo-500 hover:from-pink-400 hover:to-indigo-400 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-pink-400"
          aria-expanded={isOpen}
          aria-controls="chatbot-dialog"
        >
          <img
            src="https://img.icons8.com/color/32/000000/robot.png"
            alt="Bot"
            className="h-6 w-6 select-none"
          />
          <span className="font-medium">{t.open}</span>
        </button>
      </div>

      {/* Dialog */}
      {isOpen && (
        <div
          id="chatbot-dialog"
          role="dialog"
          aria-modal="true"
          aria-label={t.title}
          className="fixed z-50 bottom-24 right-6 w-[min(92vw,380px)] max-h-[70vh] flex flex-col glass bg-white/90 dark:bg-[#0b1220]/80 backdrop-blur-md ring-1 ring-black/10 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-black/10/5">
            <div className="flex items-center gap-3">
              <img
                src="https://img.icons8.com/color/40/000000/robot.png"
                alt="Bot"
                className="h-8 w-8"
              />
              <div className="flex flex-col">
                <span className="chat-title text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {t.title}
                </span>
                <label htmlFor="lang-select" className="text-[11px] text-gray-600 dark:text-gray-300">
                  {t.chooseLang}
                </label>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <select
                id="lang-select"
                className="px-2 py-1 text-xs rounded-md bg-gray-100/90 dark:bg-gray-800/60 text-gray-800 dark:text-gray-100 border border-black/10 focus:outline-none"
                value={lang}
                onChange={(e) => setLang(e.target.value)}
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी</option>
              </select>
              <button
                type="button"
                onClick={toggleOpen}
                className="text-xs px-2 py-1 rounded-md bg-gray-200/80 dark:bg-gray-700/60 text-gray-800 dark:text-gray-100 hover:bg-gray-200/90"
                aria-label={t.close}
              >
                {t.close}
              </button>
            </div>
          </div>

          {/* Welcome section (collapsed height) */}
          <div className="px-4 pt-3 pb-2 text-xs text-gray-700 dark:text-gray-200">
            <h2 className="font-semibold mb-1">{t.welcome}</h2>
            <p className="leading-relaxed">{t.description}</p>
          </div>

          {/* Chat area */}
          <div
            ref={chatRef}
            className="flex-1 px-3 pb-3 overflow-y-auto space-y-2 scroll-smooth"
          >
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={
                  m.sender === "user"
                    ? "flex justify-end"
                    : "flex justify-start"
                }
              >
                {m.sender === "bot" && (
                  <img
                    src="https://img.icons8.com/color/28/000000/robot.png"
                    alt="Bot"
                    className="h-6 w-6 mr-2 self-end"
                  />
                )}
                <div
                  className={
                    m.sender === "user"
                      ? "max-w-[80%] rounded-2xl px-3 py-2 text-sm text-white bg-gradient-to-r from-fuchsia-500 to-indigo-500 shadow whitespace-pre-wrap"
                      : "max-w-[80%] rounded-2xl px-3 py-2 text-sm text-gray-900 dark:text-gray-100 bg-white/90 dark:bg-gray-900/60 ring-1 ring-black/5 whitespace-pre-wrap prose prose-sm dark:prose-invert"
                  }
                >
                  {formatMessage(m.text)}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <form
            className="flex items-center gap-2 p-3 border-t border-black/10/5"
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.inputPlaceholder}
              className="flex-1 text-sm px-3 py-2 rounded-xl bg-gray-100/90 dark:bg-gray-800/70 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
            <button
              type="button"
              onClick={isListening ? stopVoiceInput : startVoiceInput}
              disabled={!canUseSpeech}
              title={canUseSpeech ? t.mic : "Speech not supported"}
              className={`px-3 py-2 rounded-xl ${isListening ? 'bg-red-500 text-white' : 'bg-gray-200/80 dark:bg-gray-700/70 text-gray-800 dark:text-gray-100 hover:bg-gray-200'} disabled:opacity-50`}
            >
              {isListening ? '■' : t.mic}
            </button>
            <button
              type="submit"
              disabled={isSending}
              className="px-4 py-2 rounded-xl text-white bg-gradient-to-r from-pink-500 to-indigo-500 hover:from-pink-400 hover:to-indigo-400 shadow disabled:opacity-60"
            >
              {t.send}
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export default Chatbot;

// Lightweight text formatter: supports **bold**, *italic*, and `code`, preserves line breaks.
// Returns React elements without using dangerouslySetInnerHTML.
function formatMessage(text) {
  const parts = [];
  const lines = String(text).split(/\n/);
  const pushFormatted = (str, keyBase) => {
    // Tokenize for code `...`
    const codeSplit = str.split(/(`[^`]+`)/g);
    codeSplit.forEach((seg, i) => {
      if (!seg) return;
      if (seg.startsWith("`") && seg.endsWith("`")) {
        parts.push(
          <code key={`${keyBase}-code-${i}`} className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 border border-black/10">
            {seg.slice(1, -1)}
          </code>
        );
      } else {
        // Bold **...** then italic *...*
        const boldSplit = seg.split(/(\*\*[^*]+\*\*)/g);
        boldSplit.forEach((bseg, j) => {
          if (!bseg) return;
          if (bseg.startsWith("**") && bseg.endsWith("**")) {
            parts.push(<strong key={`${keyBase}-b-${i}-${j}`}>{bseg.slice(2, -2)}</strong>);
          } else {
            const italicSplit = bseg.split(/(\*[^*]+\*)/g);
            italicSplit.forEach((iseg, k) => {
              if (!iseg) return;
              if (iseg.startsWith("*") && iseg.endsWith("*")) {
                parts.push(<em key={`${keyBase}-i-${i}-${j}-${k}`}>{iseg.slice(1, -1)}</em>);
              } else {
                parts.push(<span key={`${keyBase}-t-${i}-${j}-${k}`}>{iseg}</span>);
              }
            });
          }
        });
      }
    });
  };
  lines.forEach((line, idx) => {
    if (idx > 0) parts.push(<br key={`br-${idx}`} />);
    pushFormatted(line, `l${idx}`);
  });
  return parts;
}
