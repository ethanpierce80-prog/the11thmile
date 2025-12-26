/* app.js - Core Logic */

let isMetric = false; // Default to Miles

// Initialize Page State
function initPage() {
    // 1. Check for saved 5k time in LocalStorage
    const savedTime = localStorage.getItem('user5kTime');
    const inputField = document.getElementById('globalPace') || document.getElementById('sessionPace');
    
    if (savedTime && inputField) {
        inputField.value = savedTime;
    }
}

// Tab Switching (Home Page)
function switchTab(tabId, btn) {
    // Hide all content
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));

    // Show specific content
    document.getElementById(tabId).classList.add('active');
    btn.classList.add('active');
}

// Toggle Metric/Imperial
function toggleUnits() {
    isMetric = !isMetric;
    const btn = document.getElementById('unitBtn');
    
    if(isMetric) {
        btn.innerText = "Display: KM";
        btn.style.background = "#fff"; 
        btn.style.border = "2px solid var(--accent)";
    } else {
        btn.innerText = "Display: Miles";
        btn.style.background = "var(--accent)";
        btn.style.border = "none";
    }

    // Trigger the specific page calculation update
    if (typeof updatePageCalc === "function") {
        updatePageCalc();
    }
}

// Input Formatting (Auto-adds colon)
function formatInput(input) {
    let value = input.value.replace(/[^0-9]/g, ''); // Remove non-numbers
    
    if (value.length > 4) value = value.substring(0, 4); // Max 4 digits

    if (value.length > 2) {
        value = value.substring(0, value.length - 2) + ':' + value.substring(value.length - 2);
    }
    
    input.value = value;

    // Save to local storage for persistence across pages
    if(value.length >= 3) {
        localStorage.setItem('user5kTime', value);
    }

    // Real-time calculation
    if (typeof updatePageCalc === "function") {
        updatePageCalc();
    }
}

// Helper: MM:SS to Total Seconds
function parseTime(timeString) {
    if (!timeString || !timeString.includes(':')) return null;
    const parts = timeString.split(':');
    const min = parseInt(parts[0]);
    const sec = parseInt(parts[1]);
    return (min * 60) + sec;
}

// Helper: Total Seconds to MM:SS
function formatTime(totalSeconds) {
    if (isNaN(totalSeconds) || totalSeconds <= 0) return "--:--";
    
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    
    // Pad seconds with zero if needed
    const secStr = seconds < 10 ? "0" + seconds : seconds;
    
    return minutes + ":" + secStr;
}