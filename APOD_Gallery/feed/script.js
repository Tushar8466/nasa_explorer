const API_KEY = "BPYHJB6Zf3g6N0aSexLlkZIGli8MN54tn7bJ5nxc";
const feedContainer = document.getElementById("apod-feed");

async function fetchDailyApod() {
    try {
        const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`);
        const data = await response.json();
        
        displaySingleApod(data);
    } catch (error) {
        console.error("Error fetching NASA data:", error);
        feedContainer.innerHTML = `
            <div class="loading">
                <p>Could not load the cosmic anomaly. Please try again later.</p>
            </div>
        `;
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

document.addEventListener("DOMContentLoaded", fetchDailyApod);
