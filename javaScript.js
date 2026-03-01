// Replace the fetch in translateText() with your backend URL
const backendURL = "https://johnmichaelaguilar.atwebpages.com/translate.php"; // <-- your PHP host URL

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
        const response = await fetch(backendURL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: text, target: lang })
        });

        const data = await response.json();

        if (data.error) throw new Error(data.error);

        translatedText.textContent = data.translated_text || "No translation returned.";
        status.textContent = "Status: Ready";
    } catch (err) {
        console.error(err);
        status.textContent = "Status: Error! See console for details.";
        alert("Translation failed: " + err.message);
    }
}
