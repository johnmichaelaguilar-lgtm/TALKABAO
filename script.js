// 1. Elements
const btn = document.getElementById('translateBtn');
const input = document.getElementById('sourceText');
const output = document.getElementById('output');
const sourceSelect = document.getElementById('sourceLang');
const targetSelect = document.getElementById('targetLang');

// 2. List of multiple reliable mirrors for 2026
const MIRRORS = [
    "https://translate.plausibility.cloud/api/v1",
    "https://lingva.lunar.icu/api/v1",
    "https://translate.igna.wtf/api/v1"
];

// 3. Helper: Save to History
function saveToHistory(source, result, from, to) {
    let history = JSON.parse(localStorage.getItem("talkabao_data")) || [];
    const entry = {
        source: source,
        result: result,
        from: from,
        to: to,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    history.unshift(entry);
    if (history.length > 25) history.pop(); // Keep storage clean
    localStorage.setItem("talkabao_data", JSON.stringify(history));
}

// 4. The Main Translation Function (with Mirror Failover)
async function performTranslation(text, source, target) {
    for (let baseUrl of MIRRORS) {
        try {
            const url = `${baseUrl}/${source}/${target}/${encodeURIComponent(text)}`;
            const response = await fetch(url, { signal: AbortSignal.timeout(5000) });
            
            if (!response.ok) continue; 

            const data = await response.json();
            if (data.translation) return data.translation;
        } catch (err) {
            console.log(`Mirror ${baseUrl} failed, trying next...`);
            continue; 
        }
    }
    throw new Error("All servers are currently busy.");
}

// 5. Button Click Event
btn.addEventListener('click', async () => {
    const text = input.value.trim();
    if (!text) return;

    btn.disabled = true;
    btn.innerText = "Connecting...";
    output.innerText = "Searching for active server...";

    try {
        const result = await performTranslation(text, sourceSelect.value, targetSelect.value);
        
        // Show result
        output.innerText = result;
        output.style.color = "#000";

        // PUSH TO HISTORY
        saveToHistory(text, result, sourceSelect.value, targetSelect.value);

    } catch (err) {
        output.innerText = "❌ All free services are busy. Please try again in 1 minute.";
        output.style.color = "red";
    } finally {
        btn.disabled = false;
        btn.innerText = "Translate";
    }
});

// 6. Audio Logic
const bgMusic = document.getElementById("bgMusic");
const muteBtn = document.getElementById("muteBtn");

bgMusic.volume = 0.05; 
bgMusic.muted = true;  

const startAndUnmute = () => {
    bgMusic.muted = false; 
    bgMusic.play().catch(() => {});
    document.removeEventListener("click", startAndUnmute);
};

document.addEventListener("click", startAndUnmute);

muteBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation(); 
    
    bgMusic.muted = !bgMusic.muted;
    muteBtn.style.opacity = bgMusic.muted ? "0.5" : "1";
    
    if (!bgMusic.muted && bgMusic.paused) {
        bgMusic.play();
    }
});
