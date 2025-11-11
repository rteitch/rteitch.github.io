document.addEventListener('DOMContentLoaded', function() {
    // --- Data for Online Tools ---
    const tools = [
        {
            name: "Typing Test",
            description: "A simple, clean typing test application to measure your typing speed and accuracy. Inspired by Monkeytype.",
            url: "typing-test.html",
            image: "img/ketikanid.png"
        },
        {
            name: "Simple Calculator",
            description: "A basic calculator for everyday arithmetic operations.",
            url: "#", // Placeholder for now
            image: "img/calculator.png" // Assuming you'll create this image
        },
        {
            name: "Unit Converter",
            description: "Convert between various units of measurement (length, weight, temperature, etc.).",
            url: "#", // Placeholder for now
            image: "img/unit-converter.png" // Assuming you'll create this image
        }
    ];

    // --- Function to Render Tools ---
    function renderTools() {
        const toolsGrid = document.getElementById('tools-grid');
        if (!toolsGrid) return;

        tools.forEach(tool => {
            const toolCard = document.createElement('div');
            toolCard.className = 'project-card'; // Re-use project-card styling
            toolCard.innerHTML = `
                <img src="${tool.image}" alt="${tool.name}">
                <h3>${tool.name}</h3>
                <p>${tool.description}</p>
                <a href="${tool.url}" class="tool-link" target="_blank">Go to Tool</a>
            `;
            toolsGrid.appendChild(toolCard);
        });
    }

    // --- Function to Update Time ---
    function updateTime() {
        const timeElement = document.getElementById('time');
        if (timeElement) {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            timeElement.textContent = `${hours}:${minutes}`;
        }
    }

    // --- Section Navigation Logic ---
    const sections = document.querySelectorAll('.window');
    const navLinks = document.querySelectorAll('.main-nav a, .dock-link');
    const mainNav = document.querySelector('.main-nav');
    const hamburgerMenu = document.querySelector('.hamburger-menu');

    function showSection(targetId) {
        sections.forEach(section => {
            section.classList.remove('active');
        });
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.classList.add('active');
        }
        // Close mobile nav if open
        if (mainNav.classList.contains('active')) {
            mainNav.classList.remove('active');
            hamburgerMenu.classList.remove('active');
        }
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Prevent default for internal links
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                showSection(targetId);
            }
            // External links will open normally
        });
    });

    // Hamburger menu toggle
    if (hamburgerMenu) {
        hamburgerMenu.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            hamburgerMenu.classList.toggle('active');
        });
    }

    // --- Initial Page Load ---
    
    // Set initial time and schedule updates
    updateTime();
    setInterval(updateTime, 60000);

    // Render the tools into their section
    renderTools();

    // Show the 'home' section by default
    showSection('home');
});