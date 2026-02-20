// ===== MOBILE MENU TOGGLE =====
/**
 * Obsługuje otwarcie/zamknięcie hamburger menu na mobilnych
 */
function initMobileMenu() {
    const toggle = document.getElementById('mobileMenuToggle');
    const mobileNav = document.getElementById('mobileNav');
    const mainNav = document.getElementById('mainNav');
    
    if (!toggle) {
        console.log('Mobile menu toggle not found');
        return;
    }
    
    // Toggle menu
    toggle.addEventListener('click', () => {
        console.log('Toggle clicked, adding active class');
        toggle.classList.toggle('active');
        mobileNav.classList.toggle('active');
    });
    
    // Zamknij menu przy kliknięciu na link
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            mobileNav.classList.remove('active');
        });
    });
    
    // Zamknij menu przy resize na desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            toggle.classList.remove('active');
            mobileNav.classList.remove('active');
        }
    });
}

initMobileMenu();

// ===== NOTIFICATION SYSTEM =====
/**
 * System powiadomień - wyświetla notyfikacje na dole ekranu
 * Obsługuje typy: 'success' (zielony) i 'info' (niebieski)
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    Object.assign(notification.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        padding: '16px 24px',
        borderRadius: '8px',
        backgroundColor: type === 'success' ? '#dc2626' : '#3b82f6',
        color: 'white',
        fontWeight: '500',
        zIndex: '9999',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
        opacity: '0',
        transform: 'translateX(100px)',
        transition: 'all 0.3s ease-out'
    });
    
    document.body.appendChild(notification);
    
    // Animacja wjazdu
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Usuń po 4 sekundach
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100px)';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// ===== SMOOTH SCROLL & ACTIVE NAV =====
/**
 * Smooth scroll do sekcji przy kliknięciu na linki nawigacyjne
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== SCROLL ANIMATIONS =====
/**
 * Obserwuje elementy i dodaje animacji gdy wjeżdżają w viewport
 * Obsługuje: service-card, service-item, testimonial-card
 */
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            scrollObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.service-item, .testimonial-card, .portfolio-card, .stat-card, .team-member, .value-card').forEach(element => {
    element.classList.add('scroll-animate');
    scrollObserver.observe(element);
});

// ===== HOVER EFFECT NA SERVICE CARDS =====
/**
 * Dodaje efekt uniesienia karty przy najechaniu myszą
 */
function initHoverEffects() {
    // Hover effect jest teraz obsługiwany przez CSS
}

initHoverEffects();

// ===== EMAIL.JS INITIALIZATION =====
/**
 * Inicjalizuje EmailJS dla wysyłania emaili z formularza kontaktowego
 * 
 * INSTRUKCJA KONFIGURACJI:
 * 1. Utwórz bezpłatne konto na https://emailjs.com
 * 2. Skopiuj swój Public Key z ustawień
 * 3. Zastąp poniższy klucz swoim Public Key
 * 4. Skonfiguruj Email Service i Template w EmailJS dashboard
 * 5. Zaktualizuj service_feniks_contact i template_feniks_form
 * 
 * Konfiguracja EmailJS:
 * - Service Name: Gmail/Outlook/Custom (gmail_service)
 * - Template Name: feniks_contact_form
 * - Template Variables: user_name, user_email, user_phone, user_address, subject, message
 */
emailjs.init("nJ5sH5Yz_HhR7t1X5");  // ZAMIEŃ NA SWÓJ PUBLIC KEY

// ===== FORM VALIDATION =====
/**
 * Waliduje pola formularza z feedback'iem w real-time
 * Obsługuje: email, telefon, wymagane pola
 */
function initFormValidation() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    const inputs = contactForm.querySelectorAll('input, textarea');
    
    // Walidacja na blur (opuszczenie pola)
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => {
            if (input.classList.contains('invalid')) {
                validateField(input);
            }
        });
    });
}

function validateField(field) {
    const fieldName = field.name;
    const value = field.value.trim();
    const errorElement = document.querySelector(`.form-error[data-field="${fieldName}"]`);
    let isValid = true;
    let errorMessage = '';
    
    // Walidacja wymaganych pól
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'To pole jest wymagane';
    }
    // Walidacja emaila
    else if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Podaj prawidłowy adres e-mail';
        }
    }
    // Walidacja telefonu (jeśli wypełniony)
    else if (field.type === 'tel' && value) {
        const phoneRegex = /^[\d\s\-\+\(\)]{9,}$/;
        if (!phoneRegex.test(value)) {
            isValid = false;
            errorMessage = 'Podaj prawidłowy numer telefonu';
        }
    }
    
    // Aktualizuj klasy i komunikaty
    field.classList.remove('invalid', 'valid');
    if (errorElement) {
        errorElement.classList.remove('show');
    }
    
    if (!isValid) {
        field.classList.add('invalid');
        if (errorElement) {
            errorElement.textContent = errorMessage;
            errorElement.classList.add('show');
        }
    } else if (value) {
        field.classList.add('valid');
    }
    
    return isValid;
}

function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required], input[type="email"]');
    let isFormValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isFormValid = false;
        }
    });
    
    return isFormValid;
}

initFormValidation();

// ===== FORM SUBMISSION =====
/**
 * Obsługuje wysyłanie formularza kontaktowego poprzez EmailJS
 * Zbiera dane, waliduje pola, CAPTCHA i wysyła email
 * Obsługuje success/error notifications
 */
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Waliduj wszystkie pola
            if (!validateForm(contactForm)) {
                showNotification('Sprawdź czy wszystkie pola są prawidłowo wypełnione', 'info');
                return;
            }
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Wysyłanie...';
            
            try {
                // Przygotuj dane dla EmailJS
                const templateParams = {
                    user_name: contactForm.querySelector('input[name="user_name"]').value,
                    user_email: contactForm.querySelector('input[name="user_email"]').value,
                    user_phone: contactForm.querySelector('input[name="user_phone"]').value,
                    user_address: contactForm.querySelector('input[name="user_address"]').value,
                    subject: contactForm.querySelector('input[name="subject"]').value,
                    message: contactForm.querySelector('textarea[name="message"]').value
                };
                
                // Wyślij email
                const response = await emailjs.send(
                    'service_feniks_contact',  // Service ID
                    'template_feniks_form',     // Template ID
                    templateParams
                );
                
                console.log('Email wysłany pomyślnie:', response);
                showNotification('✓ Dziękujemy za przesłanie wiadomości! Wkrótce się skontaktujemy.', 'success');
                
                // Reset formularza
                contactForm.reset();
                contactForm.querySelectorAll('input, textarea').forEach(field => {
                    field.classList.remove('valid', 'invalid');
                });
                
            } catch (error) {
                console.error('Błąd wysyłania emailu:', error);
                showNotification('Błąd wysyłania wiadomości. Spróbuj później lub skontaktuj się bezpośrednio: 663 335 998', 'info');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        });
    }
}

initContactForm();

// ===== HEADER SCROLL EFFECT =====
/**
 * Zmienia shadow headera w zależności od pozycji scrollu
 */
function initHeaderScrollEffect() {
    const header = document.querySelector('.header');
    if (!header) return;

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.style.boxShadow = '0 4px 20px rgba(220, 38, 38, 0.2)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.5)';
        }
    });
}

initHeaderScrollEffect();

// ===== LAZY LOAD IMAGES =====
/**
 * Leniwi ładuje obrazy gdy pojawiają się w widoku
 * Wymaga atrybutu data-src na obrazach
 */
function initLazyLoadImages() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img').forEach(img => imageObserver.observe(img));
    }
}

initLazyLoadImages();

// ===== FAQ ACCORDION =====
/**
 * Accordion widget dla FAQ - otwiera/zamyka odpowiedzi na pytania
 * Zawiera animacje i zarządzanie aria-expanded
 */
function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        question.addEventListener('click', () => {
            const isExpanded = question.getAttribute('aria-expanded') === 'true';
            
            // Zamknij wszystkie inne itemy
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    const otherQuestion = otherItem.querySelector('.faq-question');
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    otherQuestion.setAttribute('aria-expanded', 'false');
                    otherAnswer.classList.remove('active');
                }
            });
            
            // Toggle current item
            question.setAttribute('aria-expanded', !isExpanded);
            answer.classList.toggle('active');
        });
    });
}

initFAQAccordion();

// ===== SERVICE MODAL =====
/**
 * Modal do wyświetlania pełnego opisu usługi po kliknięciu
 * Pokazuje blur background i rozszerzającą się kartę
 */
function initServiceModal() {
    const modal = document.getElementById('serviceModal');
    const closeBtn = document.getElementById('closeModal');
    const modalBody = document.getElementById('modalBody');
    
    // Otwórz modal przy kliknięciu na usługę
    document.querySelectorAll('.service-item').forEach(item => {
        item.addEventListener('click', function() {
            const icon = this.querySelector('.service-item-icon').textContent;
            const title = this.querySelector('h4').textContent;
            const description = this.querySelector('p').textContent;
            
            modalBody.innerHTML = `
                <div class="modal-service-icon">${icon}</div>
                <h3 class="modal-service-title">${title}</h3>
                <p class="modal-service-description">${description}</p>
            `;
            
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Disable scrolling
        });
    });
    
    // Zamknij modal
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto'; // Enable scrolling
    }
    
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Zamknij na ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

initServiceModal();

// ===== INIT & LOG =====
console.log('FENIKS - Strona załadowana pomyślnie! 🚀');
