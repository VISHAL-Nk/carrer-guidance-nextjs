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
    listening: "Listening...",
    micDisabled: "Microphone not available",
    micPermissionDenied: "Microphone permission denied. Please allow access and try again.",
    micError: "Speech recognition error. Please try again.",
    noSpeechDetected: "No speech detected. Please try speaking again.",
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
    listening: "सुन रहा हूँ...",
    micDisabled: "माइक्रोफ़ोन उपलब्ध नहीं",
    micPermissionDenied: "माइक्रोफ़ोन की अनुमति नहीं मिली। कृपया अनुमति दें और फिर से कोशिश करें।",
    micError: "स्पीच रिकग्निशन में त्रुटि। कृपया फिर से कोशिश करें।",
    noSpeechDetected: "कोई आवाज़ नहीं मिली। कृपया दोबारा बोलने की कोशिश करें।",
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
  const [speechError, setSpeechError] = useState(null);

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

  // Check if speech recognition is available
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isAvailable = !!(window.SpeechRecognition || window.webkitSpeechRecognition);
      console.log("Speech recognition available:", isAvailable);
    }
  }, []);

  const canUseSpeech = useMemo(() => {
    return (
      typeof window !== "undefined" &&
      !!(window.SpeechRecognition || window.webkitSpeechRecognition)
    );
  }, []);

  const speak = useCallback((text) => {
    if (typeof window === "undefined") return;
    try {
      const synthLang = speechLangMap[lang] || "en-US";
      const utter = new window.SpeechSynthesisUtterance(text);
      utter.lang = synthLang;
      utter.rate = 0.9;
      utter.pitch = 1;
      window.speechSynthesis?.speak(utter);
    } catch (e) {
      console.warn("Speech synthesis failed:", e);
    }
  }, [lang]);

  const showErrorMessage = useCallback((errorType) => {
    let errorMessage;
    switch (errorType) {
      case 'permission-denied':
        errorMessage = t.micPermissionDenied;
        break;
      case 'no-speech':
        errorMessage = t.noSpeechDetected;
        break;
      default:
        errorMessage = t.micError;
    }
    
    setSpeechError(errorMessage);
    setTimeout(() => setSpeechError(null), 3000);
  }, [t]);

  const startVoiceInput = useCallback(async () => {
    if (!canUseSpeech || isListening) return;
    
    setSpeechError(null);
    
    try {
      // First, explicitly request microphone permission
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Stop the stream immediately since we only needed it for permission
        stream.getTracks().forEach(track => track.stop());
      } catch (permissionError) {
        console.error("Microphone permission denied:", permissionError);
        showErrorMessage('permission-denied');
        return;
      }

      // Create a new SpeechRecognition instance using the same approach as the working code
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        console.warn("Speech recognition not supported");
        showErrorMessage('not-supported');
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = false; // Set to false for better control
      recognition.interimResults = true; // Enable interim results like the working code
      recognition.lang = speechLangMap[lang] || "en-US";

      recognition.onstart = () => {
        console.log("Speech recognition started");
        setIsListening(true);
        setSpeechError(null);
      };

      recognition.onresult = (event) => {
        // Use the same logic as the working code
        const transcript = event.results[event.results.length - 1][0].transcript;
        console.log("Speech recognized:", transcript);
        
        // Only set final results to input
        if (event.results[event.results.length - 1].isFinal) {
          setInput(transcript.trim());
          setIsListening(false);
        }
      };

      recognition.onend = () => {
        console.log("Speech recognition ended");
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
        
        // Handle specific errors with user-friendly messages
        switch (event.error) {
          case 'not-allowed':
          case 'permission-denied':
            showErrorMessage('permission-denied');
            break;
          case 'no-speech':
            showErrorMessage('no-speech');
            break;
          case 'network':
            showErrorMessage('network');
            break;
          default:
            showErrorMessage('general');
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (error) {
      console.error("Error starting speech recognition:", error);
      setIsListening(false);
      showErrorMessage('general');
    }
  }, [canUseSpeech, lang, isListening, showErrorMessage]);

  const stopVoiceInput = useCallback(() => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.error("Error stopping speech recognition:", error);
      }
    }
    setIsListening(false);
  }, [isListening]);

  // Cleanup recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // Ignore cleanup errors
        }
      }
    };
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
        const reply = String(replyRaw);
        
        setMessages((prev) => [...prev, { sender: "bot", text: reply }]);
        speak(reply);
      } catch (err) {
        console.error("Chat error:", err);
        const errorMessage = lang === "hi" 
          ? "सर्वर से जुड़ने में समस्या हुई।"
          : "Sorry, there was a problem connecting to the server. Please try again.";
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: errorMessage },
        ]);
      } finally {
        setIsSending(false);
      }
    },
    [input, isSending, lang, speak]
  );

  const toggleOpen = () => setIsOpen((v) => !v);

  const handleMicClick = useCallback(() => {
    if (isListening) {
      stopVoiceInput();
    } else {
      startVoiceInput();
    }
  }, [isListening, startVoiceInput, stopVoiceInput]);

  // Determine microphone button state
  const getMicButtonState = () => {
    if (!canUseSpeech) return 'disabled';
    if (isListening) return 'listening';
    // Don't rely on stored permission status for UI state
    return 'ready';
  };

  const micButtonState = getMicButtonState();

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

          {/* Welcome section */}
          <div className="px-4 pt-3 pb-2 text-xs text-gray-700 dark:text-gray-200">
            <h2 className="font-semibold mb-1">{t.welcome}</h2>
            <p className="leading-relaxed">{t.description}</p>
          </div>

          {/* Error message for speech recognition */}
          {speechError && (
            <div className="mx-4 mb-2 p-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p className="text-xs text-red-700 dark:text-red-300">{speechError}</p>
            </div>
          )}

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
            {isListening && (
              <div className="flex justify-start">
                <img
                  src="https://img.icons8.com/color/28/000000/robot.png"
                  alt="Bot"
                  className="h-6 w-6 mr-2 self-end"
                />
                <div className="max-w-[80%] rounded-2xl px-3 py-2 text-sm text-gray-500 bg-white/90 dark:bg-gray-900/60 ring-1 ring-black/5 italic flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  {t.listening}
                </div>
              </div>
            )}
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
              disabled={isListening}
            />
            <button
              type="button"
              onClick={handleMicClick}
              disabled={micButtonState === 'disabled'}
              title={
                micButtonState === 'disabled' 
                  ? t.micDisabled
                  : micButtonState === 'listening'
                  ? "Stop listening"
                  : "Start voice input"
              }
              className={`px-3 py-2 rounded-xl transition-all duration-200 ${
                micButtonState === 'listening'
                  ? 'bg-red-500 text-white hover:bg-red-600 animate-pulse' 
                  : micButtonState === 'ready'
                  ? 'bg-gray-200/80 dark:bg-gray-700/70 text-gray-800 dark:text-gray-100 hover:bg-gray-300/80 dark:hover:bg-gray-600/70'
                  : 'bg-gray-100/50 dark:bg-gray-800/50 text-gray-400 cursor-not-allowed'
              }`}
            >
              {micButtonState === 'listening' ? '⏹️' : t.mic}
            </button>
            <button
              type="submit"
              disabled={isSending || !input.trim()}
              className="px-4 py-2 rounded-xl text-white bg-gradient-to-r from-pink-500 to-indigo-500 hover:from-pink-400 hover:to-indigo-400 shadow disabled:opacity-60 disabled:cursor-not-allowed transition-opacity"
            >
              {isSending ? "..." : t.send}
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