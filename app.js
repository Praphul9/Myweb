// Darklight Technology LTD - JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initializeNavigation();
    initializeMobileMenu();
    initializeScrollEffects();
    initializeAnimations();
    initializeCareerButtons();
    initializeHeroButtons();
    
    // Debug: Log all sections found
    console.log('Sections found:', Array.from(document.querySelectorAll('section[id]')).map(s => s.id));
});

// Navigation functionality
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    // Handle navigation link clicks
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const href = this.getAttribute('href');
            console.log('Navigation clicked:', href);
            
            if (href && href.startsWith('#')) {
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);
                
                console.log('Target section found:', targetSection ? 'yes' : 'no', targetId);
                
                if (targetSection) {
                    // Close mobile menu if open
                    closeMobileMenu();
                    
                    // Smooth scroll to section
                    scrollToSection(targetSection);
                    
                    // Update active navigation link
                    updateActiveNavLink(this);
                } else {
                    console.error('Section not found:', targetId);
                }
            }
        });
    });

    // Update active navigation link on scroll
    window.addEventListener('scroll', debounce(function() {
        let current = '';
        const headerHeight = document.querySelector('.header').offsetHeight;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }, 100));
}

// Initialize hero buttons
function initializeHeroButtons() {
    const heroButtons = document.querySelectorAll('.hero-actions .btn');
    console.log('Hero buttons found:', heroButtons.length);
    
    heroButtons.forEach((button, index) => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const href = this.getAttribute('href');
            console.log('Hero button clicked:', href, 'button index:', index);
            
            if (href && href.startsWith('#')) {
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);
                
                console.log('Hero button target section:', targetId, 'found:', targetSection ? 'yes' : 'no');
                
                if (targetSection) {
                    scrollToSection(targetSection);
                } else {
                    console.error('Hero button target section not found:', targetId);
                }
            }
        });
    });
}

// Scroll to section helper function
function scrollToSection(targetSection) {
    const headerHeight = document.querySelector('.header').offsetHeight;
    const targetPosition = targetSection.offsetTop - headerHeight - 20;
    
    console.log('Scrolling to position:', targetPosition);
    
    // Use both methods to ensure compatibility
    if ('scrollBehavior' in document.documentElement.style) {
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    } else {
        // Fallback smooth scroll
        smoothScrollTo(targetPosition);
    }
}

// Smooth scroll fallback
function smoothScrollTo(targetPosition, duration = 800) {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        const ease = easeInOutCubic(progress);
        
        window.scrollTo(0, startPosition + distance * ease);
        
        if (timeElapsed < duration) {
            requestAnimationFrame(animation);
        }
    }

    function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    }

    requestAnimationFrame(animation);
}

// Mobile menu functionality
function initializeMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');
    
    if (mobileMenuBtn && nav) {
        mobileMenuBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleMobileMenu();
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            const isClickInsideNav = nav.contains(e.target);
            const isClickOnMenuBtn = mobileMenuBtn.contains(e.target);
            
            if (!isClickInsideNav && !isClickOnMenuBtn && nav.classList.contains('mobile-menu-open')) {
                closeMobileMenu();
            }
        });

        // Close mobile menu on window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                closeMobileMenu();
            }
        });
    }
}

function toggleMobileMenu() {
    const nav = document.querySelector('.nav');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    
    if (nav && mobileMenuBtn) {
        const isOpen = nav.classList.contains('mobile-menu-open');
        
        if (isOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }
}

function openMobileMenu() {
    const nav = document.querySelector('.nav');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    
    if (nav && mobileMenuBtn) {
        nav.classList.add('mobile-menu-open');
        mobileMenuBtn.classList.add('active');
        document.body.classList.add('menu-open');
    }
}

function closeMobileMenu() {
    const nav = document.querySelector('.nav');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    
    if (nav && mobileMenuBtn) {
        nav.classList.remove('mobile-menu-open');
        mobileMenuBtn.classList.remove('active');
        document.body.classList.remove('menu-open');
    }
}

function updateActiveNavLink(activeLink) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    activeLink.classList.add('active');
}

// Scroll effects
function initializeScrollEffects() {
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', debounce(function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }, 10));
}

// Animation effects
function initializeAnimations() {
    // Animate cards on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe all cards for animation
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        observer.observe(card);
    });

    // Observe section titles
    const sectionTitles = document.querySelectorAll('.section-title');
    sectionTitles.forEach(title => {
        observer.observe(title);
    });
}

// Initialize career application buttons
function initializeCareerButtons() {
    const careerButtons = document.querySelectorAll('.career-card .btn');
    console.log('Career buttons found:', careerButtons.length);
    
    careerButtons.forEach((button, index) => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('Career button clicked:', index);
            
            const careerCard = this.closest('.career-card');
            if (careerCard) {
                const positionElement = careerCard.querySelector('h4');
                const position = positionElement ? positionElement.textContent : 'Unknown Position';
                console.log('Position found:', position);
                showApplicationModal(position);
            } else {
                console.error('Career card not found for button:', index);
            }
        });
    });
}

function showApplicationModal(position) {
    console.log('Showing modal for position:', position);
    
    // Remove any existing modals
    const existingModal = document.querySelector('.modal-overlay');
    if (existingModal) {
        existingModal.remove();
    }

    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;

    // Create modal content
    const modal = document.createElement('div');
    modal.style.cssText = `
        background: #242529;
        border: 1px solid #2a2b30;
        border-radius: 12px;
        padding: 32px;
        max-width: 500px;
        width: 90%;
        text-align: center;
        color: #ffffff;
        transform: scale(0.9);
        transition: transform 0.3s ease;
        position: relative;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
    `;

    const closeButton = document.createElement('button');
    closeButton.innerHTML = '×';
    closeButton.style.cssText = `
        position: absolute;
        top: 16px;
        right: 16px;
        background: none;
        border: none;
        color: #a0a0a0;
        font-size: 24px;
        cursor: pointer;
        padding: 4px;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        transition: background 0.3s ease;
    `;

    const content = document.createElement('div');
    content.innerHTML = `
        <h3 style="color: #185adb; margin-bottom: 16px; font-size: 24px; font-weight: 600;">${position} Position</h3>
        <p style="color: #a0a0a0; margin-bottom: 24px; font-size: 16px; line-height: 1.5;">Thank you for your interest in the ${position} position!</p>
        <p style="color: #a0a0a0; margin-bottom: 24px; font-size: 16px; line-height: 1.5;">Please send your resume and cover letter to:</p>
        <p style="color: #ffc947; font-weight: 600; margin-bottom: 24px; font-size: 18px;">careers@darklighttech.com</p>
        <button class="modal-close-btn" style="background: #185adb; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-size: 16px; cursor: pointer; transition: background 0.3s ease; font-weight: 500;">Got it!</button>
    `;

    modal.appendChild(closeButton);
    modal.appendChild(content);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Close button functionality
    const closeModal = function() {
        console.log('Closing modal');
        overlay.style.opacity = '0';
        modal.style.transform = 'scale(0.9)';
        setTimeout(() => {
            if (overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
        }, 300);
    };

    closeButton.addEventListener('click', closeModal);
    content.querySelector('.modal-close-btn').addEventListener('click', closeModal);

    // Close on overlay click
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            closeModal();
        }
    });

    // Close on escape key
    const escapeHandler = function(e) {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', escapeHandler);
        }
    };
    document.addEventListener('keydown', escapeHandler);

    // Add hover effects
    closeButton.addEventListener('mouseenter', function() {
        this.style.background = '#2a2b30';
    });
    closeButton.addEventListener('mouseleave', function() {
        this.style.background = 'none';
    });

    const gotItBtn = content.querySelector('.modal-close-btn');
    gotItBtn.addEventListener('mouseenter', function() {
        this.style.background = '#1450c4';
    });
    gotItBtn.addEventListener('mouseleave', function() {
        this.style.background = '#185adb';
    });

    // Animate in
    requestAnimationFrame(() => {
        overlay.style.opacity = '1';
        modal.style.transform = 'scale(1)';
    });
}

// Add loading state management
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});

// Utility function to debounce events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeMobileMenu();
    }
});

// Initialize theme handling
function initializeTheme() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
}

// Call theme initialization
initializeTheme();

// Add error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
});

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', function() {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            if (perfData) {
                console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
            }
        }, 0);
    });
}