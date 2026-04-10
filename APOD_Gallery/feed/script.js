const feedContainer = document.getElementById("apod-feed");
const galleryGrid = document.getElementById("gallery-grid");
const galleryContainer = document.getElementById("apod-gallery");
const galleryLoading = document.getElementById("gallery-loading");
const dailyControls = document.getElementById("daily-controls");

const API_KEY = 'BPYHJB6Zf3g6N0aSexLlkZIGli8MN54tn7bJ5nxc';

async function fetchDailyApod(date = null) {
    feedContainer.innerHTML = `<div class="loading">Aligning the telescopes...</div>`;
    
    try {
        const dateQuery = date ? `&date=${date}` : "";
        const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}${dateQuery}`);
        
        if (!response.ok) {
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

async function fetchGalleryApod() {
    galleryGrid.innerHTML = "";
    galleryLoading.style.display = "block";
    
    try {
        // Fetch 12 random images for the gallery
        const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&count=12`);
        
        if (!response.ok) throw new Error(`Gallery distortion: ${response.status}`);

        const data = await response.json();
        displayGallery(data);
    } catch (error) {
        console.error("Error fetching gallery data:", error);
        galleryGrid.innerHTML = `<p class="loading">The gallery is currently obscured by a nebula. Please try again soon.</p>`;
    } finally {
        galleryLoading.style.display = "none";
    }
}

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

function displayGallery(data) {
    galleryGrid.innerHTML = "";
    
    data.forEach((item, index) => {
        if (item.media_type !== "image") return; // Only show images in gallery

        const card = document.createElement("div");
        card.className = "gallery-item";
        
        // Truncate description for the card
        const shortDesc = item.explanation.length > 150 
            ? item.explanation.substring(0, 150) + "..." 
            : item.explanation;

        card.innerHTML = `
            <div class="gallery-image-wrapper">
                <img src="${item.url}" alt="${item.title}" loading="lazy">
            </div>
            <div class="gallery-item-info">
                <p class="gallery-date">${item.date}</p>
                <h3>${item.title}</h3>
                <p class="gallery-desc">${shortDesc}</p>
                <span class="read-more">View Full Story →</span>
            </div>
        `;

        card.addEventListener("click", () => {
            // Switch to daily view and show this specific image
            switchToDaily();
            fetchDailyApod(item.date);
            document.getElementById("apod-date").value = item.date;
        });

        galleryGrid.appendChild(card);
    });

    if (window.gsap) {
        gsap.from(".gallery-item", {
            duration: 0.8,
            opacity: 0,
            scale: 0.8,
            stagger: 0.1,
            ease: "back.out(1.7)"
        });
    }
}

// View Switching Logic
const btnDaily = document.getElementById("view-daily");
const btnGallery = document.getElementById("view-gallery");

btnDaily.addEventListener("click", switchToDaily);
btnGallery.addEventListener("click", switchToGallery);

function switchToDaily() {
    btnDaily.classList.add("active");
    btnGallery.classList.remove("active");
    feedContainer.classList.add("active");
    galleryContainer.classList.remove("active");
    dailyControls.style.display = "flex";
}

function switchToGallery() {
    btnDaily.classList.remove("active");
    btnGallery.classList.add("active");
    feedContainer.classList.remove("active");
    galleryContainer.classList.add("active");
    dailyControls.style.display = "none";
    
    if (galleryGrid.children.length === 0) {
        fetchGalleryApod();
    }
}

// Date Picker initialization
const datePicker = document.getElementById("apod-date");
const todayStr = new Date().toISOString().split('T')[0];
datePicker.max = todayStr;
datePicker.value = todayStr; // Set default to today

datePicker.addEventListener("change", (e) => {
    fetchDailyApod(e.target.value);
});

// Theme Toggle Logic
const themeToggle = document.getElementById("theme-toggle");
const body = document.body;

const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light") {
    body.classList.add("light-mode");
}

themeToggle.addEventListener("click", () => {
    body.classList.toggle("light-mode");
    const isLight = body.classList.contains("light-mode");
    localStorage.setItem("theme", isLight ? "light" : "dark");
});

document.addEventListener("DOMContentLoaded", () => {
    // Fetch today's image on load by default
    fetchDailyApod(todayStr);
});
