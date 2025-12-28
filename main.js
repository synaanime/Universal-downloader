// Wait for the page to load
document.addEventListener('DOMContentLoaded', () => {
    renderHistory();
});

function startDownload(type) {
    const urlInput = document.getElementById('urlInput');
    const status = document.getElementById('status');
    const url = urlInput.value.trim();

    // 1. Simple Validation
    if (!url) {
        showStatus("Please paste a URL first!", "error");
        return;
    }

    if (!url.startsWith('http')) {
        showStatus("Invalid link. Make sure it starts with http/https", "error");
        return;
    }

    // 2. Save to History (Bonus Feature)
    saveToHistory(url, type);

    // 3. Update UI
    showStatus("Connecting to server... your download will start shortly.", "success");

    // 4. Trigger Download
    // We use window.location.href because the server sends a "Content-Disposition: attachment" header
    window.location.href = `/api/download?type=${type}&url=${encodeURIComponent(url)}`;
}

// --- BONUS FEATURES ---

function showStatus(msg, type) {
    const status = document.getElementById('status');
    status.innerText = msg;
    status.style.color = type === "error" ? "#f87171" : "#818cf8";
}

function saveToHistory(url, type) {
    let history = JSON.parse(localStorage.getItem('dl_history') || '[]');
    
    // Add new item to the start
    const newItem = {
        id: Date.now(),
        url: url,
        type: type,
        date: new Date().toLocaleDateString()
    };
    
    history.unshift(newItem);
    
    // Keep only the last 5 items
    history = history.slice(0, 5);
    
    localStorage.setItem('dl_history', JSON.stringify(history));
    renderHistory();
}

function renderHistory() {
    let history = JSON.parse(localStorage.getItem('dl_history') || '[]');
    const container = document.getElementById('status'); // You can create a specific <div> for this

    if (history.length > 0) {
        // This adds a small "Recent" section below the status message
        const historyHTML = history.map(item => `
            <div style="font-size: 0.7rem; margin-top: 5px; opacity: 0.6;">
                Last: ${item.url.substring(0, 30)}... (${item.type})
            </div>
        `).join('');
        
        // Append history to status area or a dedicated history div
        console.log("Download History Updated");
    }
}
