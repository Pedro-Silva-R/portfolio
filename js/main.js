/**
 * Portfolio OS - Unified Strategy & Interaction Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log('Portafolio PS v1.0.25 Inicializado');
    
    // 1. Unified Navigation Handler
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.sidenav-link');
    
    navLinks.forEach(link => {
        // Reset active state
        link.classList.remove('active');
        
        // Match current page
        const linkPath = link.getAttribute('href');
        if (linkPath === currentPath) {
            link.classList.add('active');
            // Inline style backup for exact Stitch color
            link.style.color = 'var(--color-tertiary)';
        }
    });

    // 2. Neo-Brutalist Button Hover Effects
    const disruptiveButtons = document.querySelectorAll('.btn-identity, .btn-connect');
    disruptiveButtons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            btn.style.setProperty('--mouse-x', `${x}px`);
            btn.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // 3. Image Frame Parallax (Subtle)
    const frames = document.querySelectorAll('.image-frame img, .story-image img');
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        frames.forEach(img => {
            const speed = 0.05;
            img.style.transform = `scale(1.1) translateY(${scrolled * speed}px)`;
        });
    });

    // 4. Smooth Scroll for internal anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            if (this.getAttribute('href') !== '#') {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // 5. Contact Form Logic (EmailJS & Validation)
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        // Initialize EmailJS (Placeholder - User should replace this)
        const PUBLIC_KEY = "TU_PUBLIC_KEY_AQUÍ";
        if (typeof emailjs !== 'undefined') {
            emailjs.init(PUBLIC_KEY);
        }

        const statusMsg = document.getElementById('form-status');
        const charCounter = document.getElementById('char-current');
        const messageArea = document.getElementById('message');
        const submitBtn = document.getElementById('submit-btn');

        // Real-time Character Counter
        messageArea.addEventListener('input', (e) => {
            const count = e.target.value.length;
            charCounter.textContent = count;
            if (count > 900) {
                charCounter.style.color = 'var(--color-secondary)';
            } else {
                charCounter.style.color = 'var(--color-on-surface-variant)';
            }
        });

        // Real-time Validation on Blur
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                validateField(input);
            });
            // Clear error on re-entry
            input.addEventListener('input', () => {
                input.parentElement.classList.remove('invalid');
                input.setAttribute('aria-invalid', 'false');
            });
        });

        function validateField(field) {
            let isValid = true;
            if (field.required && !field.value.trim()) {
                isValid = false;
            } else if (field.type === 'email') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                isValid = emailRegex.test(field.value);
            } else if (field.minLength && field.value.length < field.minLength) {
                isValid = false;
            }

            if (!isValid) {
                field.parentElement.classList.add('invalid');
                field.setAttribute('aria-invalid', 'true');
            } else {
                field.parentElement.classList.remove('invalid');
                field.setAttribute('aria-invalid', 'false');
            }
            return isValid;
        }

        // Form Submission
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Final Validation Check
            let formIsValid = true;
            let firstInvalidInput = null;

            inputs.forEach(input => {
                if (!validateField(input)) {
                    formIsValid = false;
                    if (!firstInvalidInput) firstInvalidInput = input;
                }
            });

            if (!formIsValid) {
                statusMsg.textContent = 'Por favor revisa los campos en rojo y corrige los errores.';
                statusMsg.className = 'form-status-msg status-error';
                if (firstInvalidInput) firstInvalidInput.focus();
                return;
            }

            // Update UI to Sending State
            submitBtn.disabled = true;
            submitBtn.textContent = 'ENVIANDO...';
            statusMsg.textContent = 'INICIANDO CONEXIÓN...';
            statusMsg.className = 'form-status-msg status-pending';

            // EmailJS Transmission
            // Replace with your Service ID and Template ID
            const SERVICE_ID = "TU_SERVICE_ID_AQUÍ";
            const TEMPLATE_ID = "TU_TEMPLATE_ID_AQUÍ";

            emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, contactForm)
                .then(() => {
                    statusMsg.textContent = '¡Mensaje enviado con éxito! Responderé a la brevedad. 🚀';
                    statusMsg.className = 'form-status-msg status-success';
                    contactForm.reset();
                    charCounter.textContent = "0";
                    submitBtn.textContent = 'ENVIAR_MENSAJE';
                    submitBtn.disabled = false;
                }, (error) => {
                    console.error('EmailJS Error:', error);
                    statusMsg.textContent = 'Error de conexión. Intenta de nuevo o escríbeme por WhatsApp.';
                    statusMsg.className = 'form-status-msg status-error';
                    submitBtn.textContent = 'REINTENTAR';
                    submitBtn.disabled = false;
                });
        });
    }

    // 6. Dynamic Copyright Year
    const yearElement = document.getElementById('copyright-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // 7. Mobile Navigation Drawer
    const menuToggle = document.getElementById('menu-toggle');
    const menuClose = document.getElementById('menu-close');
    const mobileNavDrawer = document.getElementById('mobile-nav-drawer');
    const mobileNavOverlay = document.getElementById('mobile-nav-overlay');

    if (menuToggle && menuClose && mobileNavDrawer && mobileNavOverlay) {
        function openMenu() {
            mobileNavDrawer.classList.add('active');
            mobileNavOverlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // Evita el scroll trasero
        }

        function closeMenu() {
            mobileNavDrawer.classList.remove('active');
            mobileNavOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }

        menuToggle.addEventListener('click', openMenu);
        menuClose.addEventListener('click', closeMenu);
        mobileNavOverlay.addEventListener('click', closeMenu);

        // Auto highlight current section logic for mobile menu
        const mobileLinks = mobileNavDrawer.querySelectorAll('.mobile-nav-link');
        mobileLinks.forEach(link => {
            link.classList.remove('active');
            const linkPath = link.getAttribute('href');
            if (linkPath === currentPath) {
                link.classList.add('active');
            }
        });
    }
});
