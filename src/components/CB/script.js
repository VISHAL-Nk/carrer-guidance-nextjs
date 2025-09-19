
// UI translations for supported languages
const uiTranslations = {
  en: {
    title: "Career Guidance Chatbot",
    welcome: "👋 Welcome to your Career Guidance Chatbot!",
    description: "Ask me anything about career choices, roadmap building, or college search strategies. I'm here to help you succeed!",
    chooseLang: "Choose language:",
    inputPlaceholder: "Type your message...",
    send: "Send",
    mic: "🎤"
  },
  hi: {
    title: "करियर मार्गदर्शन चैटबोट",
    welcome: "👋 अपने करियर मार्गदर्शन चैटबोट में आपका स्वागत है!",
    description: "मुझसे करियर विकल्प, रोडमैप, या कॉलेज खोज के बारे में कुछ भी पूछें। मैं आपकी सफलता में मदद करने के लिए यहाँ हूँ!",
    chooseLang: "भाषा चुनें:",
    inputPlaceholder: "अपना संदेश लिखें...",
    send: "भेजें",
    mic: "🎤"
  }
};

const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const micBtn = document.getElementById("mic-btn");
const langSelect = document.getElementById("lang-select");

function updateUIText(lang) {
  const t = uiTranslations[lang] || uiTranslations["en"];
  document.querySelector(".chat-title").textContent = t.title;
  document.querySelector(".chat-welcome h2").textContent = t.welcome;
  document.querySelector(".chat-welcome p").textContent = t.description;
  document.querySelector("label[for='lang-select']").textContent = t.chooseLang;
  userInput.placeholder = t.inputPlaceholder;
  sendBtn.textContent = t.send;
  micBtn.textContent = t.mic;
}

// Update UI text on language change
langSelect.addEventListener("change", () => {
  updateUIText(getSelectedLang());
});

// Initial UI text
updateUIText(getSelectedLang());

function getSelectedLang() {
  return langSelect ? langSelect.value : (navigator.language || "en");
}


function appendMessage(sender, text) {
  const msgWrapper = document.createElement("div");
  msgWrapper.classList.add("bubble", sender);

  if (sender === "bot") {
    const avatar = document.createElement("img");
    avatar.src = "https://img.icons8.com/color/32/000000/robot.png";
    avatar.alt = "Bot";
    avatar.className = "bot-avatar";
    msgWrapper.appendChild(avatar);
  }

  const msgText = document.createElement("span");
  msgText.textContent = text;
  msgWrapper.appendChild(msgText);

  chatBox.appendChild(msgWrapper);
  chatBox.scrollTop = chatBox.scrollHeight;
}


async function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  appendMessage("user", text);
  userInput.value = "";

  const selectedLang = getSelectedLang();
  const res = await fetch("http://localhost:3000/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: text, lang: selectedLang })
  });

  const data = await res.json();
  appendMessage("bot", data.reply);
  speakText(data.reply, selectedLang);
}


function startVoiceInput() {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = getSelectedLang();
  recognition.start();

  recognition.onresult = (event) => {
    const speechText = event.results[0][0].transcript;
    userInput.value = speechText;
    sendMessage();
  };

  recognition.onerror = (err) => {
    console.error("Voice input error:", err);
  };
}



// Map language codes to proper speech synthesis codes
const speechLangMap = {
  en: "en-US",
  hi: "hi-IN"
 
};

function speakText(text, lang = "en-US") {
  const synthLang = speechLangMap[lang] || "en-US";
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = synthLang;
  speechSynthesis.speak(utterance);
}


sendBtn.addEventListener("click", sendMessage);
micBtn.addEventListener("click", startVoiceInput);
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});