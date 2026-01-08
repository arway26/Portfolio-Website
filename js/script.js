// ============================================================================
// PORTFOLIO JAVASCRIPT - FINAL CLEAN VERSION
// ============================================================================

document.addEventListener('DOMContentLoaded', init);

function init() {
    setupThemeToggle(); // Set theme first
    setupSmoothScrolling();
    setupScrollAnimations();
    setup3DProjectCards();
    setupSkillsCarousel();
    setupBlobBackgrounds();
    addInteractiveFeatures();
    triggerTypingEffect();
    setupProjectLinks();
}

// ============================================================================
// PARALLAX STARS BACKGROUND
// ============================================================================

function multipleBoxShadow(n, color) {
    let value = '';
    for (let i = 0; i < n; i++) {
        const x = Math.floor(Math.random() * 2000);
        const y = Math.floor(Math.random() * 2000);
        value += `${x}px ${y}px ${color}`;
        if (i < n - 1) {
            value += ', ';
        }
    }
    return value;
}

function setupParallaxStars() {
    const stars = document.getElementById('stars');
    const stars2 = document.getElementById('stars2');
    const stars3 = document.getElementById('stars3');
    
    // Check if dark mode is active
    const isDarkMode = document.body.classList.contains('dark');
    const starColor = isDarkMode ? '#FFF' : '#4A5568'; // White for dark mode, dark gray for light mode
    
    if (stars) {
        const shadowsSmall = multipleBoxShadow(700, starColor);
        stars.style.setProperty('--star-shadow', shadowsSmall);
        stars.style.boxShadow = shadowsSmall;
        // Force opacity for dark mode
        if (isDarkMode) {
            stars.style.opacity = '1';
        }
    }
    
    if (stars2) {
        const shadowsMedium = multipleBoxShadow(200, starColor);
        stars2.style.setProperty('--star-shadow', shadowsMedium);
        stars2.style.boxShadow = shadowsMedium;
        // Force opacity for dark mode
        if (isDarkMode) {
            stars2.style.opacity = '1';
        }
    }
    
    if (stars3) {
        const shadowsBig = multipleBoxShadow(100, starColor);
        stars3.style.setProperty('--star-shadow', shadowsBig);
        stars3.style.boxShadow = shadowsBig;
        // Force opacity for dark mode
        if (isDarkMode) {
            stars3.style.opacity = '1';
        }
    }
}


// ============================================================================
// THEME TOGGLE - LOCAL STORAGE
// ============================================================================

function setupThemeToggle() {
    const toggle = document.getElementById('themeToggle');
    const body = document.body;
    const html = document.documentElement;
    const savedTheme = localStorage.getItem('portfolioTheme');
    
    if (savedTheme === 'dark') {
        body.classList.add('dark');
        html.classList.add('dark-mode');
        toggle.checked = true;
    }
    
    toggle.addEventListener('change', () => {
        if (toggle.checked) {
            body.classList.add('dark');
            html.classList.add('dark-mode');
            localStorage.setItem('portfolioTheme', 'dark');
        } else {
            body.classList.remove('dark');
            html.classList.remove('dark-mode');
            localStorage.setItem('portfolioTheme', 'light');
        }
    });
}




// ============================================================================
// UI FEATURES
// ============================================================================

function setupSmoothScrolling() {
    document.querySelectorAll('nav a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('header').offsetHeight;
                window.scrollTo({ top: target.offsetTop - headerHeight - 20, behavior: 'smooth' });
                updateActiveNavLink(this);
            }
        });
    });
    window.addEventListener('scroll', debounce(updateActiveNavOnScroll, 10));
}

function updateActiveNavLink(activeLink) {
    document.querySelectorAll('nav a').forEach(link => link.classList.remove('active'));
    activeLink.classList.add('active');
}

function updateActiveNavOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const headerHeight = document.querySelector('header').offsetHeight;
    const scrollPos = window.scrollY + headerHeight + 100;
    
    sections.forEach(section => {
        const top = section.offsetTop;
        const bottom = top + section.offsetHeight;
        const navLink = document.querySelector(`nav a[href="#${section.id}"]`);
        
        if (scrollPos >= top && scrollPos < bottom && navLink) {
            document.querySelectorAll('nav a').forEach(link => link.classList.remove('active'));
            navLink.classList.add('active');
        }
    });
}

function setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                if (entry.target.id === 'about') triggerTypingEffect();
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    document.querySelectorAll('section').forEach(section => observer.observe(section));
}

// ============================================================================
// 3D PROJECT CARDS ROTATION
// ============================================================================

function setup3DProjectCards() {
    // Cards now flip on hover via CSS, no JavaScript needed
}

// ============================================================================
// SKILLS CAROUSEL
// ============================================================================

function setupSkillsCarousel() {
    const carouselList = document.querySelector('.carousel__list');
    const carouselItems = document.querySelectorAll('.carousel__item');
    
    if (!carouselList || !carouselItems.length) {
        return;
    }
    
    const elems = Array.from(carouselItems);
    
    carouselList.addEventListener('click', function (event) {
        var clickedElement = event.target;
        var carouselItem = clickedElement.closest('.carousel__item');
        
        if (!carouselItem) {
            return;
        }
        
        var currentPos = parseInt(carouselItem.dataset.pos);
        if (currentPos === 0) {
            return; // Already active
        }
        
        update(carouselItem);
    });
    
    const update = function(newActive) {
        const newActivePos = parseInt(newActive.dataset.pos);
        
        const current = elems.find((elem) => parseInt(elem.dataset.pos) === 0);
        const prev = elems.find((elem) => parseInt(elem.dataset.pos) === -1);
        const next = elems.find((elem) => parseInt(elem.dataset.pos) === 1);
        const first = elems.find((elem) => parseInt(elem.dataset.pos) === -2);
        const last = elems.find((elem) => parseInt(elem.dataset.pos) === 2);
        const second = elems.find((elem) => parseInt(elem.dataset.pos) === -3);
        const secondLast = elems.find((elem) => parseInt(elem.dataset.pos) === 3);
        
        if (current) {
            current.classList.remove('carousel__item_active');
        }
        
        const itemsToUpdate = [current, prev, next, first, last, second, secondLast].filter(Boolean);
        
        itemsToUpdate.forEach(item => {
            var itemPos = parseInt(item.dataset.pos);
            item.dataset.pos = getPos(itemPos, newActivePos);
        });
    };
    
    const getPos = function (current, active) {
        const diff = current - active;
        
        if (Math.abs(current - active) > 3) {
            return -current;
        }
        
        return diff;
    };
}

// ============================================================================
// BLOB BACKGROUND SETUP
// ============================================================================

function setupBlobBackgrounds() {
    const blobContainers = document.querySelectorAll('.blob-bg');
    if (!blobContainers.length) return;

    const getSafePercentage = (margin) =>
        Math.round(Math.random() * (100 - 2 * margin)) + margin;

    blobContainers.forEach(blobBg => {
        if (blobBg.dataset.initialized === 'true') return;
        blobBg.dataset.initialized = 'true';

        const safeArea = 6;
        let colors = [];
        const colorAttr = blobBg.getAttribute('data-colors');

        try {
            colors = JSON.parse(colorAttr);
        } catch (error) {
            colors = [];
        }

        if (!Array.isArray(colors) || colors.length === 0) {
            colors = ['#667eea', '#764ba2'];
        }

        const blobCount = parseInt(blobBg.getAttribute('data-blob-count'), 10) || 3;

        for (let i = 0; i < blobCount; i++) {
            const blob = document.createElement('div');
            blob.classList.add('blob');
            blob.style.top = `${getSafePercentage(safeArea)}%`;
            blob.style.left = `${getSafePercentage(safeArea)}%`;
            blob.style.animationDelay = `${(Math.random() - 0.5) * 8 * (i + 1)}s`;
            blob.style.backgroundColor = colors[i % colors.length];
            blobBg.appendChild(blob);
        }
    });
}



function addInteractiveFeatures() {
    document.querySelectorAll('.project-card, .hobby-card, .achievement-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            if (!this.classList.contains('collapsed')) {
                this.style.transform = 'translateY(-10px) scale(1.02)';
                this.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
            }
        });
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    });
    
    const headerTitle = document.querySelector('header h1');
    if (headerTitle) {
        headerTitle.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }
}

function triggerTypingEffect() {
    const tagline = document.querySelector('.tagline');
    if (tagline && !tagline.classList.contains('typed')) {
        tagline.classList.add('typed');
        const text = tagline.textContent;
        tagline.textContent = '';
        let i = 0;
        const type = () => {
            if (i < text.length) {
                tagline.textContent += text.charAt(i);
                i++;
                setTimeout(type, 50);
            }
        };
        setTimeout(type, 500);
    }
}


function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

// ============================================================================
// PROJECT LINKS
// ============================================================================

function setupProjectLinks() {
    // Make Labbi project card clickable
    const labbiProject = document.getElementById('labbiProject');
    if (labbiProject) {
        labbiProject.style.cursor = 'pointer';
        labbiProject.addEventListener('click', function() {
            window.open('https://github.com/arway26/Labbi', '_blank', 'noopener,noreferrer');
        });
    }
    
    // Make Horse Racing Database project card clickable
    const horseRacingProject = document.getElementById('horseRacingProject');
    if (horseRacingProject) {
        horseRacingProject.style.cursor = 'pointer';
        // Note: Add GitHub repository URL when available
        horseRacingProject.addEventListener('click', function() {
            // Placeholder - update with actual GitHub repository URL
            // window.open('https://github.com/arway26/HorseRacingDatabase', '_blank', 'noopener,noreferrer');
            console.log('Horse Racing Database project - GitHub link to be added');
        });
    }
    
    // Make Portfolio project card clickable
    const portfolioProject = document.getElementById('portfolioProject');
    if (portfolioProject) {
        portfolioProject.style.cursor = 'pointer';
        portfolioProject.addEventListener('click', function() {
            window.open('https://github.com/arway26/Portfolio-Website', '_blank', 'noopener,noreferrer');
        });
    }
}