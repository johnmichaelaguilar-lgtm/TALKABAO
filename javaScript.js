// ====== CONFIG ======
const API_KEY = "freeapi_222328d7-e9f"; // your FreeAPITools key
const API_URL = "https://freeapitools.dev/api/v1/translate";

// ====== DOM ELEMENTS ======
const inputText = document.getElementById("inputText");
const targetLang = document.getElementById("targetLang");
const translateBtn = document.getElementById("translateBtn");
const translatedText = document.getElementById("translatedText");
const status = document.getElementById("status");
const speakBtn = document.getElementById("speakBtn");
const serviceToggle = document.getElementById("serviceToggle");

// ====== TRANSLATE FUNCTION ======
async function translateText() {
    const text = inputText.value.trim();
    const lang = targetLang.value;

    if (!text) {
        alert("Please type some text to translate!");
        return;
    }

    status.textContent = "Status: Translating...";
    translatedText.textContent = "";

    try {
        let response, data;

        if (serviceToggle.checked) {
            // Use PHP backend
            response = await fetch("translate.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: text, target: lang })
            });
            data = await response.json();
        } else {
            // Direct API call
            response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-API-Key": API_KEY
                },
                body: JSON.stringify({ text: text, target: lang, source: "en" })
            });
            data = await response.json();
        }

        if (data.error) throw new Error(data.error);

        translatedText.textContent = data.translated_text || "No translation returned.";
        status.textContent = "Status: Ready";

    } catch (err) {
        console.error(err);
        status.textContent = "Status: Error! See console for details.";
        alert("Translation failed: " + err.message);
    }
}

// ====== SPEAK FUNCTION ======
function speakText() {
    const text = translatedText.textContent;
    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
}

// ====== EVENT LISTENERS ======
translateBtn.addEventListener("click", translateText);
speakBtn.addEventListener("click", speakText);

// Enter key triggers translation
inputText.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        translateText();
    }
});