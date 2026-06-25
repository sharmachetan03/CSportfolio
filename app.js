document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       SCROLL PROGRESS & NAVBAR STYLING
       ========================================================================== */
    const progressBar = document.getElementById('scroll-progress');
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    const updateScrollEffects = () => {
        // Calculate scroll progress percentage
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        
        if (progressBar) {
            progressBar.style.width = `${scrollPercent}%`;
        }

        // Toggle navbar scroll state class
        if (navbar) {
            if (scrollTop > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        // Highlight active navbar link based on current section top offsets
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.clientHeight;
            if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === currentSectionId) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', updateScrollEffects);
    updateScrollEffects(); // Trigger once on initialization

    /* ==========================================================================
       MOBILE NAVIGATION TOGGLE
       ========================================================================== */
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
        });

        // Close menu and restore scroll when navigating
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });
    }

    /* ==========================================================================
       COPY TO CLIPBOARD WITH TOAST FEEDBACK
       ========================================================================== */
    const emailBadge = document.getElementById('copy-email');
    const phoneBadge = document.getElementById('copy-phone');
    const toast = document.getElementById('toast');
    let toastTimeout;

    const copyTextToClipboard = (text, label) => {
        navigator.clipboard.writeText(text).then(() => {
            showToast(`Copied ${label} to clipboard!`);
        }).catch(err => {
            console.error('Failed to copy to clipboard: ', err);
            // Fallback for older browsers
            const textArea = document.createElement("textarea");
            textArea.value = text;
            textArea.style.position = "fixed";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                document.execCommand('copy');
                showToast(`Copied ${label} to clipboard!`);
            } catch (fallbackErr) {
                showToast('Failed to copy. Please copy manually.');
            }
            document.body.removeChild(textArea);
        });
    };

    const showToast = (message) => {
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add('show');

        // Clear any active timers to prevent flickering toast states
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 2500);
    };

    if (emailBadge) {
        emailBadge.addEventListener('click', () => {
            const email = emailBadge.getAttribute('data-clipboard');
            copyTextToClipboard(email, 'email address');
        });
    }

    if (phoneBadge) {
        phoneBadge.addEventListener('click', () => {
            const phone = phoneBadge.getAttribute('data-clipboard');
            copyTextToClipboard(phone, 'phone number');
        });
    }

    /* ==========================================================================
       SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
       ========================================================================== */
    const timelineItems = document.querySelectorAll('.timeline-item');
    const skillMeters = document.querySelectorAll('.meter-fill');

    // Observer for fade-in slide-up timeline items
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    timelineItems.forEach(item => {
        revealObserver.observe(item);
    });

    // Observer for animated skill bars filling
    const skillObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const meter = entry.target;
                const width = meter.style.width;
                // Force recalculation by setting width to 0 first and then to target width
                meter.style.width = '0';
                setTimeout(() => {
                    meter.style.width = width;
                }, 100);
                observer.unobserve(meter);
            }
        });
    }, {
        threshold: 0.2
    });

    skillMeters.forEach(meter => {
        skillObserver.observe(meter);
    });
});
