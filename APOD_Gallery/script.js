document.addEventListener("DOMContentLoaded", () => {
    const heading = document.querySelector("h1");
    if (!heading) return;
    const text = heading.innerText;
    heading.innerHTML = text.split("").map(char => {
        if (char === " ") return `<span style="display:inline-block">&nbsp;</span>`;
        return `<span class="char" style="display:inline-block">${char}</span>`;
    }).join("");

    gsap.from(".char", {
        duration: 1.2,
        y: 100,
        opacity: 0,
        stagger: 0.05,
        ease: "power4.out",
        scale: 0.5,
        skewX: 15,
        delay: 0.3
    });

    gsap.to("h1", {
        y: -10,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 2.5
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
});
