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
 * Obsługuje: service-card, service-item, portfolio-card
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

document.querySelectorAll('.service-item, .portfolio-card, .stat-card, .team-member, .value-card').forEach(element => {
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
            
            // Zbierz całą zawartość (paragrafów i list)
            let description = '';
            const children = this.querySelectorAll('p, ul, li');
            
            // Jeśli są listy, rebuild je prawidłowo
            let currentList = null;
            children.forEach(el => {
                if (el.tagName === 'P') {
                    if (currentList) {
                        description += currentList;
                        currentList = null;
                    }
                    description += `<p>${el.innerHTML}</p>`;
                } else if (el.tagName === 'UL') {
                    const listItems = el.querySelectorAll('li');
                    let listHTML = '<ul style="margin: 10px 0 0 20px; padding-left: 0;">';
                    listItems.forEach(li => {
                        listHTML += `<li>${li.textContent}</li>`;
                    });
                    listHTML += '</ul>';
                    description += listHTML;
                }
            });
            
            modalBody.innerHTML = `
                <div class="modal-service-icon">${icon}</div>
                <h3 class="modal-service-title">${title}</h3>
                <div class="modal-service-description">${description}</div>
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

// ===== PORTFOLIO GALLERY =====
/**
 * Obsługuje wyświetlanie galerii projektów
 * Dynamicznie wczytuje zdjęcia z katalogów projektów
 */

/**
 * Lista wszystkich projektów - ładowana z projects-manifest.json
 */
let allProjects = [];

/**
 * Ładuje listę projektów z projects-manifest.json
 */
async function loadProjectsManifest() {
    try {
        console.log('[MANIFEST] Fetching projects-manifest.json...');
        const response = await fetch('projects-manifest.json');
        console.log('[MANIFEST] Fetch response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('[MANIFEST] Raw data:', data);
        
        allProjects = data.projects || [];
        console.log('[MANIFEST] Loaded projects:', allProjects);
        console.log('[MANIFEST] Total projects loaded:', allProjects.length);
        return allProjects;
    } catch (error) {
        console.error('[MANIFEST] Error loading projects manifest:', error);
        console.error('[MANIFEST] Error details:', error.message);
        
        // Fallback - jeśli manifest się nie ładuje, użyj hardcoded listy
        console.warn('[MANIFEST] Using fallback projects list');
        allProjects = [
            'budowa_stropu_przeciwpozarowego',
            'dostawa_montaz_serwis_samoczynnych_urzadzen_gasinczych',
            'montaz_AED',
            'montaz_klap_przeciwpozarowych',
            'montaz_oznakowania',
            'montaz_systemu_detekcji_gazu',
            'obsluga_duzych_inwestycji',
            'przeglad_hydrantu',
            'serwis_systemu_gaszenia_gazem',
            'serwis_systemu_oddymiania',
            'sprzedaz_AED',
            'sprzedaz_defibrylatrow',
            'sprzedaz_i_serwis_sprzetu_ppoz',
            'sprzedaz_sprzetu',
            'szkolenie_przeciwpozarowe',
            'zabezpieczenie_tras_kablowych',
            'zabudowa_przeciwpozarowa_glownego_zasilania_obiektu',
            'zabudowa_przeciwpozarowa_w_scianie_odpornosci_ogniowej'
        ];
        return allProjects;
    }
}

/**
 * Zwraca URL placeholdera SVG
 */
function getPlaceholderImage(projectName) {
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23333' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='20' fill='%23999'%3EBrak zdjęć%3C/text%3E%3C/svg%3E`;
}

/**
 * Formatuje nazwę projektu na czytelną etykietę
 * montaz_klap_przeciwpożarowych -> Montaż Klap Przeciwpożarowych
 */
function formatProjectName(projectName) {
    return projectName
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

/**
 * Generuje karty portfolio z listy projektów
 */
function generatePortfolioCards() {
    console.log('[PORTFOLIO] generatePortfolioCards called');
    
    const portfolioGrid = document.getElementById('portfolioGrid');
    console.log('[PORTFOLIO] portfolioGrid:', portfolioGrid ? 'found' : 'NOT FOUND');
    
    if (!portfolioGrid) {
        console.error('[PORTFOLIO] portfolioGrid not found!');
        return;
    }
    
    console.log(`[PORTFOLIO] Generating ${allProjects.length} project cards...`);
    
    for (const projectName of allProjects) {
        const projectTitle = formatProjectName(projectName);
        
        const projectCard = document.createElement('div');
        projectCard.className = 'portfolio-project';
        projectCard.setAttribute('data-project', projectName);
        projectCard.innerHTML = `
            <div class="portfolio-image-container">
                <img src="${getPlaceholderImage(projectName)}" alt="${projectTitle}" class="portfolio-image">
                <div class="portfolio-overlay">
                    <h3>${projectTitle}</h3>
                    <p>Kliknij aby zobaczyć realizacje</p>
                </div>
            </div>
            <div class="portfolio-content">
                <h3>${projectTitle}</h3>
            </div>
            <div class="portfolio-gallery" style="display: none;">
            </div>
        `;
        
        portfolioGrid.appendChild(projectCard);
        console.log(`[PORTFOLIO] Created card: ${projectName}`);
        
        // Załaduj obrazy dla tej karty w tle
        loadProjectImages(projectName).then(images => {
            console.log(`[PORTFOLIO] Loaded ${images.length} images for ${projectName}`);
            
            // Jeśli są obrazy, zmień preview
            if (images.length > 0) {
                const imgElement = projectCard.querySelector('.portfolio-image');
                imgElement.src = images[0];
            }
            
            // Dodaj wszystkie obrazy do galerii
            const gallery = projectCard.querySelector('.portfolio-gallery');
            images.forEach((imagePath, idx) => {
                const img = document.createElement('img');
                img.src = imagePath;
                img.alt = `${projectTitle} - Zdjęcie ${idx + 1}`;
                gallery.appendChild(img);
            });
        }).catch(error => {
            console.error(`[PORTFOLIO] Error loading images for ${projectName}:`, error);
        });
    }
    
    console.log('[PORTFOLIO] All portfolio cards generated!');
}

/**
 * Mapa projektów do nazw plików zdjęć
 * Umożliwia elastyczną obsługę różnych konwencji nazewnictwa
 */
const projectImagesMap = {
    "budowa_stropu_przeciwpożarowego": ["PHOTO-2026-03-03-17-25-58.jpg"],
    "montaz_klap_przeciwpożarowych": ["montaz_klap.jpeg"],
    "montaz_oznakowania": ["montaz_oznakowania.jpeg", "motaz_oznakowania.jpeg"],
    "montaż_AED": ["PHOTO-2026-03-03-17-35-54.jpg"],
    "montaż_systemu_detekcji_gazu": ["PHOTO-2026-03-03-17-22-01.jpg"],
    "obsługa_dużych_inwestycji": ["obsluga_duzych_inwestycji.jpeg"],
    "serwis_systemu_gaszenia_gazem": ["serwis_systemu_gaszenia_gazem.jpeg"],
    "serwis_systemu_oddymiania": ["PHOTO-2026-03-03-17-23-33.jpg"],
    "sprzedaż_AED": ["PHOTO-2026-03-03-17-36-38.jpg"],
    "sprzedaż_i_serwis_sprzętu_ppoż": ["PHOTO-2026-03-03-17-40-55.jpg"],
    "sprzedaż_sprzętu": ["PHOTO-2026-03-03-17-40-27.jpg"],
    "sprzedaż_defibrylatorów": ["PHOTO-2026-03-03-17-35-34.jpg"],
    "szkolenie_przeciwpożarowe": ["PHOTO-2026-03-03-17-39-06.jpg", "PHOTO-2026-03-03-17-39-50.jpg", "PHOTO-2026-03-03-17-42-58.jpg"],
    "zabezpieczenie_tras_kablowych": ["PHOTO-2026-03-03-17-29-15.jpg", "PHOTO-2026-03-03-17-32-13.jpg", "PHOTO-2026-03-03-17-33-13.jpg", "img1.jpeg"]
};

async function loadProjectGalleries() {
    console.log('[GALLERY] Starting to load all project galleries...');
    const projects = document.querySelectorAll('.portfolio-project');
    console.log(`[GALLERY] Found ${projects.length} portfolio projects in DOM`);
    
    for (const project of projects) {
        const projectName = project.getAttribute('data-project');
        const gallery = project.querySelector('.portfolio-gallery');
        
        if (!projectName || !gallery) {
            console.warn(`[GALLERY] Skipping - projectName: ${projectName}, gallery: ${!!gallery}`);
            continue;
        }
        
        console.log(`[GALLERY] Processing: ${projectName}`);
        const images = await loadProjectImages(projectName);
        console.log(`[GALLERY] Adding ${images.length} images to gallery for ${projectName}`);
        
        // Dodaj zdjęcia do galerii
        images.forEach((imagePath, idx) => {
            const img = document.createElement('img');
            img.src = imagePath;
            img.alt = `${projectName} - Zdjęcie ${idx + 1}`;
            gallery.appendChild(img);
            console.log(`[GALLERY] Image ${idx + 1} added: ${imagePath}`);
        });
    }
    
    console.log('[GALLERY] All galleries loaded!');
}

/**
 * Wczytuje zdjęcia z katalogu projektu
 * Korzysta z mapy projektów do znalezienia odpowiednich plików
 */
async function loadProjectImages(projectName) {
    const images = [];
    const basePath = `projekty/${projectName}`;
    
    console.log(`[LOAD] Project: ${projectName}`);
    
    // Użyj mapy projektów lub spróbuj domyślnej konwencji
    const imageFiles = projectImagesMap[projectName] || tryDefaultNamingConventions(projectName);
    
    console.log(`[LOAD] Trying ${imageFiles.length} file(s)`);
    
    // Sprawdź czy każdy plik istnieje i dodaj do listy
    for (const fileName of imageFiles) {
        const imagePath = `${basePath}/${fileName}`;
        const exists = await checkImageExists(imagePath);
        if (exists) {
            console.log(`[LOAD] ✓ Added to gallery: ${imagePath}`);
            images.push(imagePath);
        }
    }
    
    console.log(`[LOAD] Total images found: ${images.length}`);
    return images;
}

/**
 * Próbuje domyślne konwencje nazewnictwa jeśli projekt nie jest w mapie
 */
function tryDefaultNamingConventions(projectName) {
    const images = [];
    
    // Spróbuj obu rozszerzeń: .jpeg i .jpg
    const extensions = ['jpg', 'jpeg', 'png'];
    
    // Próba 1: image_1.jpg, image_2.jpg, itd (główny format)
    for (let i = 1; i <= 20; i++) {
        for (const ext of extensions) {
            images.push(`image_${i}.${ext}`);
        }
    }
    
    // Próba 2: img1.jpg, img2.jpg, itd (fallback)
    for (let i = 1; i <= 20; i++) {
        for (const ext of extensions) {
            images.push(`img${i}.${ext}`);
        }
    }
    
    return images;
}

/**
 * Sprawdza czy zdjęcie istnieje - zamiast fetch, spróbuj załadować image tag
 */
function checkImageExists(imagePath) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            console.log(`    [CHECK] ${imagePath}: ✓ (loaded successfully)`);
            resolve(true);
        };
        img.onerror = () => {
            console.log(`    [CHECK] ${imagePath}: ✗ (failed to load)`);
            resolve(false);
        };
        img.src = imagePath;
    });
}

function initPortfolioGallery() {
    const projects = document.querySelectorAll('.portfolio-project');
    console.log(`[CLICK] Setting up click handlers for ${projects.length} projects`);
    
    projects.forEach((project, idx) => {
        project.addEventListener('click', function(e) {
            console.log(`[CLICK] Portfolio card ${idx} clicked!`);
            e.stopPropagation();
            
            const gallery = this.querySelector('.portfolio-gallery');
            const images = gallery ? gallery.querySelectorAll('img') : [];
            const title = this.querySelector('.portfolio-overlay h3').textContent;
            
            console.log(`[CLICK] Gallery element found: ${!!gallery}`);
            console.log(`[CLICK] Images in gallery: ${images.length}`);
            console.log(`[CLICK] Title: ${title}`);
            
            if (images.length === 0) {
                console.error('[CLICK] ERROR: No images found in gallery!');
                console.error('[CLICK] Gallery HTML:', gallery ? gallery.innerHTML : 'NO GALLERY');
                return;
            }
            
            // Zbierz wszystkie obrazy z galerii
            const imageSources = Array.from(images).map(img => img.src);
            console.log(`[CLICK] Image sources:`, imageSources);
            
            // Stwórz modal dla galerii
            const galleryModal = document.createElement('div');
            galleryModal.className = 'gallery-modal';
            galleryModal.innerHTML = `
                <div class="gallery-modal-content">
                    <button class="gallery-close-btn">&times;</button>
                    <div class="gallery-container">
                        <div class="gallery-main">
                            <img src="${imageSources[0]}" alt="${title}" class="gallery-main-image">
                        </div>
                        <div class="gallery-title">
                            <h2>${title}</h2>
                        </div>
                        ${imageSources.length > 1 ? `
                            <div class="gallery-thumbnails">
                                ${imageSources.map((imgSrc, idx) => `
                                    <img src="${imgSrc}" alt="Zdjęcie ${idx + 1}" class="gallery-thumb" data-index="${idx}">
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
            
            document.body.appendChild(galleryModal);
            document.body.style.overflow = 'hidden';
            console.log('[CLICK] Modal created and added to DOM');
            
            // Obsługa zmiany zdjęcia po kliknięciu na miniaturę
            const thumbnails = galleryModal.querySelectorAll('.gallery-thumb');
            const mainImage = galleryModal.querySelector('.gallery-main-image');
            
            thumbnails.forEach(thumb => {
                thumb.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const index = thumb.dataset.index;
                    mainImage.src = imageSources[index];
                    
                    // Usuń active z poprzedniej miniatury
                    galleryModal.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('active'));
                    thumb.classList.add('active');
                });
            });
            
            // Ustaw pierwszą miniaturę jako aktywną
            if (thumbnails.length > 0) {
                thumbnails[0].classList.add('active');
            }
            
            // Zamknij modal
            const closeBtn = galleryModal.querySelector('.gallery-close-btn');
            closeBtn.addEventListener('click', () => {
                galleryModal.remove();
                document.body.style.overflow = 'auto';
                console.log('[CLICK] Modal closed via close button');
            });
            
            galleryModal.addEventListener('click', (e) => {
                if (e.target === galleryModal) {
                    galleryModal.remove();
                    document.body.style.overflow = 'auto';
                    console.log('[CLICK] Modal closed via background click');
                }
            });
            
            // Zamknij na ESC
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && galleryModal.parentElement) {
                    galleryModal.remove();
                    document.body.style.overflow = 'auto';
                    console.log('[CLICK] Modal closed via ESC key');
                }
            });
        });
    });
}

// ===== INIT PORTFOLIO =====
// Ładuj manifest i inicjalizuj portfolio
async function initPortfolio() {
    console.log('[INIT] Starting portfolio initialization...');
    
    // Ładuj manifest projeków
    await loadProjectsManifest();
    console.log('[INIT] Manifest loaded!');
    
    // Generuj karty portfolio
    generatePortfolioCards();
    console.log('[INIT] Portfolio cards generated!');
    
    // Po wygenerowaniu kart ustaw click handler
    initPortfolioGallery();
    console.log('[INIT] Click handlers attached!');
}

// Inicjalizuj portfolio gdy strona się załaduje
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPortfolio);
} else {
    initPortfolio();
}

// ===== INIT & LOG =====
console.log('FENIKS - Strona załadowana pomyślnie! 🚀');
