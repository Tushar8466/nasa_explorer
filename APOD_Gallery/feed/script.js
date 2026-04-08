
const feedContainer = document.getElementById("apod-feed");

async function fetchDailyApod(date = null) {
    feedContainer.innerHTML = `<div class="loading">Aligning the telescopes...</div>`;
    
    try {
        const dateQuery = date ? `&date=${date}` : "";
        const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=BPYHJB6Zf3g6N0aSexLlkZIGli8MN54tn7bJ5nxc${dateQuery}`);
        
        if (!response.ok) {
            // Handle NASA 500/404 errors by trying yesterday if it's the current day
            if (!date) {
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                return fetchDailyApod(yesterday.toISOString().split('T')[0]);
            }
            throw new Error(`Cosmic disturbance: ${response.status}`);
        }

        const data = await response.json();
        displaySingleApod(data);
    } catch (error) {
        console.error("Error fetching NASA data:", error);
        feedContainer.innerHTML = `
            <div class="loading">
                <p>Could not load the cosmic anomaly for this date. <br> Please try a different point in time.</p>
            </div>
        `;
    }
}

// Date Picker initialization
const datePicker = document.getElementById("apod-date");
const todayStr = new Date().toISOString().split('T')[0];
datePicker.max = todayStr; // Prevent future travel

datePicker.addEventListener("change", (e) => {
    fetchDailyApod(e.target.value);
});

function displaySingleApod(data) {
    feedContainer.innerHTML = ""; // Clear loader

    const mediaHtml = data.media_type === "video"
        ? `<div class="apod-image-container">
             <iframe src="${data.url}" width="100%" height="500px" frameborder="0" allowfullscreen></iframe>
           </div>`
        : `<div class="apod-image-container">
             <img src="${data.url}" alt="${data.title}">
           </div>`;

    feedContainer.innerHTML = `
        <div class="apod-content-wrapper">
            <h2 class="apod-title">${data.title}</h2>
            ${mediaHtml}
            <div class="apod-text">
                <p class="apod-description">${data.explanation}</p>
            </div>
        </div>
    `;

    // Simple entrance animation if GSAP exists
    if (window.gsap) {
        gsap.from(".apod-content-wrapper > *", {
            duration: 1,
            opacity: 0,
            y: 20,
            stagger: 0.2,
            ease: "power2.out"
        });
    }
}

// Theme Toggle Logic
const themeToggle = document.getElementById("theme-toggle");
const body = document.body;

// Check for saved theme
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light") {
    body.classList.add("light-mode");
}

themeToggle.addEventListener("click", () => {
    body.classList.toggle("light-mode");
    const isLight = body.classList.contains("light-mode");
    localStorage.setItem("theme", isLight ? "light" : "dark");
});

document.addEventListener("DOMContentLoaded", fetchDailyApod);
