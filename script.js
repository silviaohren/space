// ============================================
//   CONFIGURAZIONE
// ============================================
const CONFIG = {
    // Password per l'area riservata (in produzione, usare un sistema più sicuro)
    UPLOAD_PASSWORD: 'bastacinema42'
};

// ============================================
//   LANGUAGE SWITCHING
// ============================================
function switchLanguage(lang) {
    // Update button states
    const langEnBtn = document.getElementById('lang-en');
    const langItBtn = document.getElementById('lang-it');
    
    if (langEnBtn && langItBtn) {
        langEnBtn.classList.remove('active');
        langItBtn.classList.remove('active');
        
        if (lang === 'en') {
            langEnBtn.classList.add('active');
        } else if (lang === 'it') {
            langItBtn.classList.add('active');
        }
    }
    
    // Show/hide content based on language
    const bioContentEn = document.getElementById('bio-content-en');
    const bioContentIt = document.getElementById('bio-content-it');
    
    if (bioContentEn && bioContentIt) {
        if (lang === 'en') {
            bioContentEn.style.display = 'block';
            bioContentIt.style.display = 'none';
        } else if (lang === 'it') {
            bioContentEn.style.display = 'none';
            bioContentIt.style.display = 'block';
        }
    }
    
    // Save language preference
    localStorage.setItem('preferred-language', lang);
}

function initLanguageSwitcher() {
    // Check for saved language preference
    const savedLang = localStorage.getItem('preferred-language') || 'en';
    switchLanguage(savedLang);
}

// ============================================
//   GESTIONE NAVIGAZIONE
// ============================================
function showPage(pageId, clickedLink) {
    console.log('showPage called with pageId:', pageId);
    
    // Nascondi tutte le pagine
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    
    // Mostra la pagina selezionata
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        console.log('Found target page:', pageId);
        targetPage.classList.add('active');
        if (pageId === 'wavetable-page') {
            console.log('Initializing wavetable...');
            initWavetable();
        }
    } else {
        console.error('Target page not found:', pageId);
    }
    
    // Show/hide language switcher based on page
    const languageSwitcher = document.getElementById('bio-language-switcher');
    if (languageSwitcher) {
        if (pageId === 'bio-page') {
            languageSwitcher.style.display = 'flex';
            // Initialize language switcher when BIO page is shown
            initLanguageSwitcher();
        } else {
            languageSwitcher.style.display = 'none';
        }
    }
    
    // Se è stato passato un link (non per il bottone alieno)
    if (clickedLink) {
        updateNavigation(clickedLink);
        updateURL(clickedLink.getAttribute('href'));
    }
    
    return false; // Previene l'azione predefinita del link
}

function updateNavigation(activeLink) {
    // Rimuovi classe active da tutti i link ma preserva menu-green
    const links = document.querySelectorAll('.nav-menu a');
    links.forEach(link => {
        const isGreen = link.classList.contains('menu-green');
        link.classList.remove('active');
        // Ripristina la classe menu-green se necessario
        if (isGreen && !link.classList.contains('menu-green')) {
            link.classList.add('menu-green');
        }
    });
    
    // Aggiungi classe active al link cliccato
    activeLink.classList.add('active');
}

function updateURL(hash) {
    // Aggiorna URL senza causare refresh della pagina
    if (history.pushState) {
        history.pushState(null, null, hash);
    } else {
        location.hash = hash;
    }
}

// ============================================
//   GESTIONE POSTER STRAPPATI
// ============================================
function initTornPosters() {
    // Aggiungi interazione di click per ogni poster strappato
    const tornPosters = document.querySelectorAll('.torn-poster');
    tornPosters.forEach(poster => {
        poster.addEventListener('click', function(e) {
            // Close all other posters
            tornPosters.forEach(p => {
                if (p !== this) p.classList.remove('active');
            });
            // Toggle this one
            this.classList.toggle('active');
        });
    });
}

// ============================================
//   GESTIONE AREA RISERVATA
// ============================================
function checkPassword() {
    const passwordInput = document.getElementById('access-password');
    const password = passwordInput.value;
    
    if (password === CONFIG.UPLOAD_PASSWORD) {
        showUploadContent();
        saveAuthentication();
    } else {
        showPasswordError();
    }
}

function showUploadContent() {
    // Nascondi il form di accesso
    const passwordForm = document.getElementById('password-form-container');
    if (passwordForm) {
        passwordForm.style.display = 'none';
    }
    
    // Mostra il contenuto protetto
    const uploadContent = document.getElementById('upload-content');
    if (uploadContent) {
        uploadContent.style.display = 'block';
    }
}

function showPasswordError() {
    alert('Password non corretta. Riprova.');
    // Pulisci il campo password
    const passwordInput = document.getElementById('access-password');
    if (passwordInput) {
        passwordInput.value = '';
        passwordInput.focus();
    }
}

function saveAuthentication() {
    // Salva un flag in sessionStorage
    sessionStorage.setItem('authenticated', 'true');
}

function checkAuthentication() {
    if (sessionStorage.getItem('authenticated') === 'true') {
        const passwordForm = document.getElementById('password-form-container');
        const uploadContent = document.getElementById('upload-content');
        
        if (passwordForm && uploadContent) {
            passwordForm.style.display = 'none';
            uploadContent.style.display = 'block';
        }
    }
}

// ============================================
//   LOGOUT FUNCTIONALITY
// ============================================
function logout() {
    // Rimuovi l'autenticazione
    sessionStorage.removeItem('authenticated');
    
    // Nascondi il contenuto protetto
    const uploadContent = document.getElementById('upload-content');
    if (uploadContent) {
        uploadContent.style.display = 'none';
    }
    
    // Mostra di nuovo il form di accesso
    const passwordForm = document.getElementById('password-form-container');
    if (passwordForm) {
        passwordForm.style.display = 'block';
    }
    
    // Pulisci il campo password
    const passwordInput = document.getElementById('access-password');
    if (passwordInput) {
        passwordInput.value = '';
    }
    
    // Torna alla pagina principale
    showPage('film-page', document.querySelector('.nav-menu a[href="#film"]'));
}

// ============================================
//   FILE UPLOAD FUNCTIONALITY
// ============================================
function initFileUpload() {
    const fileUpload = document.getElementById('file-upload');
    const fileUploadContainer = document.querySelector('.file-upload-container');
    
    if (fileUpload && fileUploadContainer) {
        // Drag and drop functionality
        fileUploadContainer.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.style.borderColor = 'var(--accent-color)';
            this.style.backgroundColor = 'rgba(255, 77, 109, 0.1)';
        });
        
        fileUploadContainer.addEventListener('dragleave', function(e) {
            e.preventDefault();
            this.style.borderColor = 'rgba(255, 77, 109, 0.3)';
            this.style.backgroundColor = 'transparent';
        });
        
        fileUploadContainer.addEventListener('drop', function(e) {
            e.preventDefault();
            this.style.borderColor = 'rgba(255, 77, 109, 0.3)';
            this.style.backgroundColor = 'transparent';
            
            const files = e.dataTransfer.files;
            handleFileUpload(files);
        });
        
        // Click to upload
        fileUpload.addEventListener('change', function(e) {
            const files = e.target.files;
            handleFileUpload(files);
        });
    }
}

function handleFileUpload(files) {
    if (files.length === 0) return;
    
    // Simulate file upload (in a real app, you'd upload to a server)
    console.log('Files to upload:', files);
    
    // Show upload progress
    showUploadProgress(files);
    
    // In a real application, you would:
    // 1. Create FormData
    // 2. Send to server via fetch/XMLHttpRequest
    // 3. Show real progress
    // 4. Handle success/error responses
}

function showUploadProgress(files) {
    // Create a simple progress notification
    const uploadArea = document.querySelector('.upload-area');
    if (uploadArea) {
        const progressDiv = document.createElement('div');
        progressDiv.className = 'upload-progress';
        progressDiv.innerHTML = `
            <div style="background: rgba(255, 77, 109, 0.1); padding: 1rem; border-radius: 8px; margin-top: 1rem;">
                <p style="margin: 0; color: var(--accent-color);">📤 Caricamento ${files.length} file...</p>
                <div style="background: rgba(255, 255, 255, 0.1); height: 4px; border-radius: 2px; margin-top: 0.5rem;">
                    <div style="background: var(--accent-color); height: 100%; width: 0%; border-radius: 2px; transition: width 0.3s ease;" id="progress-bar"></div>
                </div>
            </div>
        `;
        
        uploadArea.appendChild(progressDiv);
        
        // Simulate progress
        let progress = 0;
        const progressBar = progressDiv.querySelector('#progress-bar');
        const interval = setInterval(() => {
            progress += 10;
            progressBar.style.width = progress + '%';
            
            if (progress >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    progressDiv.innerHTML = `
                        <div style="background: rgba(16, 185, 129, 0.1); padding: 1rem; border-radius: 8px; margin-top: 1rem;">
                            <p style="margin: 0; color: #10b981;">✅ File caricati con successo!</p>
                        </div>
                    `;
                    setTimeout(() => progressDiv.remove(), 3000);
                }, 500);
            }
        }, 200);
    }
}

// ============================================
//   GESTIONE FORM CONTATTO
// ============================================
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
}

function handleContactSubmit(event) {
    // Qui puoi aggiungere validazione aggiuntiva se necessario
    // Il form viene inviato automaticamente a Web3Forms
    console.log('Form di contatto inviato');
}

// ============================================
//   UTILITY FUNCTIONS
// ============================================
function handleHashNavigation() {
    const hash = window.location.hash;
    if (hash) {
        const targetLink = document.querySelector(`.nav-menu a[href="${hash}"]`);
        if (targetLink) {
            const pageId = targetLink.getAttribute('href').replace('#', '') + '-page';
            showPage(pageId, targetLink);
        }
    }
}

// ============================================
//   INIZIALIZZAZIONE
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // Inizializza la navigazione basata sull'URL
    handleHashNavigation();
    
    // Hide language switcher by default (only shows on BIO page)
    const languageSwitcher = document.getElementById('bio-language-switcher');
    if (languageSwitcher) {
        languageSwitcher.style.display = 'none';
    }
    
    // Inizializza i poster strappati
    initTornPosters();
    
    // Controlla se l'utente è già autenticato
    checkAuthentication();
    
    // Inizializza il form di contatto
    initContactForm();
    
    // Inizializza i form di upload
    initUploadForms();
    
    // Aggiungi event listener per il tasto Enter nel form password
    const passwordInput = document.getElementById('access-password');
    if (passwordInput) {
        passwordInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                checkPassword();
            }
        });
    }
    
    // Nuova inizializzazione per i player circolari
    initializeCircularPlayers();
    
    // Re-inizializza i player quando si cambia pagina
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            setTimeout(() => {
                initializeCircularPlayers();
            }, 100);
        });
    });

    // COMMERCIAL POSTER COLOR LOGIC
    const commercialCards = document.querySelectorAll('.commercial-card');
    commercialCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Remove .active from all
            commercialCards.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
        });
        card.addEventListener('mouseleave', function(e) {
            // Only remove .active if not clicked (optional: keep active until another is clicked)
            // this.classList.remove('active');
        });
    });

    // Hide CAMBIA INFO SITO when a category is selected
    const categorySelect = document.getElementById('project-category');
    const cambiaInfoSitoSection = Array.from(document.querySelectorAll('.upload-section')).find(section => section.querySelector('h4') && section.querySelector('h4').textContent.includes('CAMBIA INFO SITO'));
    if (categorySelect && cambiaInfoSitoSection) {
        categorySelect.addEventListener('change', function() {
            if (categorySelect.value) {
                cambiaInfoSitoSection.style.display = 'none';
            } else {
                cambiaInfoSitoSection.style.display = '';
            }
        });
    }

    // AJAX upload feedback for CAMBIA INFO SITO mini-forms
    document.querySelectorAll('.upload-section .project-form').forEach(form => {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        const messageDiv = form.querySelector('.upload-message');
        messageDiv.textContent = 'Caricamento in corso...';
        messageDiv.style.color = '#3284c9';

        const formData = new FormData(form);
        fetch(form.action, {
          method: 'POST',
          body: formData
        })
        .then(response => {
          if (response.ok) {
            messageDiv.textContent = 'Caricamento completato!';
            messageDiv.style.color = '#10b981';
            form.reset();
          } else {
            throw new Error('Errore server');
          }
        })
        .catch(() => {
          messageDiv.textContent = 'Errore durante il caricamento. Riprova.';
          messageDiv.style.color = '#ff4d6d';
        });
      });
    });
});

// ============================================
//   GESTIONE BROWSER BACK/FORWARD
// ============================================
window.addEventListener('popstate', function() {
    handleHashNavigation();
});

// ============================================
//   GESTIONE FORM UPLOAD
// ============================================
function showCategoryForm() {
    const categorySelect = document.getElementById('project-category');
    const selectedCategory = categorySelect.value;
    
    // Nascondi tutti i form
    const allForms = document.querySelectorAll('.upload-form');
    allForms.forEach(form => {
        form.style.display = 'none';
    });
    
    // Mostra il form selezionato
    if (selectedCategory) {
        const targetForm = document.getElementById(selectedCategory + '-form');
        if (targetForm) {
            targetForm.style.display = 'block';
            
            // Scroll smooth al form
            targetForm.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }
    }
}

function resetForm(formId) {
    const form = document.getElementById(formId);
    if (form) {
        // Reset del form
        form.querySelector('form').reset();
        
        // Reset del dropdown principale
        const categorySelect = document.getElementById('project-category');
        if (categorySelect) {
            categorySelect.value = '';
        }
        
        // Nascondi il form
        form.style.display = 'none';
        
        // Scroll in cima alla pagina
        window.scrollTo({ 
            top: 0, 
            behavior: 'smooth' 
        });
    }
}

// ============================================
//   GESTIONE SUBMIT FORM
// ============================================
function initUploadForms() {
    const forms = document.querySelectorAll('.project-form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmit(this);
        });
    });
}

function handleFormSubmit(form) {
    // Raccogli i dati del form
    const formData = new FormData(form);
    const projectData = {};
    
    // Converti FormData in oggetto
    for (let [key, value] of formData.entries()) {
        projectData[key] = value;
    }
    
    // Determina la categoria dal form
    const formId = form.closest('.upload-form').id;
    const category = formId.replace('-form', '');
    projectData.category = category;
    
    // Simula l'upload (in una vera app, invieresti al server)
    console.log('Dati progetto da caricare:', projectData);
    
    // Mostra messaggio di successo
    showUploadSuccess(category);
    
    // Reset del form
    form.reset();
    
    // Reset del dropdown principale
    const categorySelect = document.getElementById('project-category');
    if (categorySelect) {
        categorySelect.value = '';
    }
    
    // Nascondi il form
    const formContainer = form.closest('.upload-form');
    if (formContainer) {
        formContainer.style.display = 'none';
    }
}

function showUploadSuccess(category) {
    // Crea un messaggio di successo
    const successDiv = document.createElement('div');
    successDiv.className = 'upload-success';
    successDiv.innerHTML = `
        <div style="
            background: rgba(16, 185, 129, 0.1); 
            border: 1px solid #10b981; 
            border-radius: 8px; 
            padding: 1.5rem; 
            margin: 2rem 0;
            text-align: center;
        ">
            <div style="font-size: 3rem; margin-bottom: 1rem;">✅</div>
            <h4 style="color: #10b981; margin-bottom: 0.5rem;">Progetto ${category.toUpperCase()} caricato con successo!</h4>
            <p style="color: rgba(255, 255, 255, 0.8); margin: 0;">Il progetto è stato aggiunto al tuo portfolio.</p>
        </div>
    `;
    
    // Inserisci il messaggio dopo il dropdown
    const categorySection = document.querySelector('.category-selector');
    if (categorySection) {
        categorySection.parentNode.insertBefore(successDiv, categorySection.nextSibling);
    }
    
    // Rimuovi il messaggio dopo 5 secondi
    setTimeout(() => {
        if (successDiv.parentNode) {
            successDiv.parentNode.removeChild(successDiv);
        }
    }, 5000);
}

// ============================================
// PLAYER AUDIO CIRCOLARE PER LIBRARIES
// ============================================
function initializeCircularPlayers() {
    const players = document.querySelectorAll('.player-circle');
    
    players.forEach(player => {
        player.addEventListener('click', function(e) {
            e.stopPropagation(); // Previene l'apertura della scheda
            
            const isPlaying = this.classList.contains('playing');
            
            if (isPlaying) {
                // Pausa
                this.classList.remove('playing');
                this.querySelector('.play-icon').textContent = '▶';
            } else {
                // Play
                // Ferma tutti gli altri player
                players.forEach(p => {
                    p.classList.remove('playing');
                    p.querySelector('.play-icon').textContent = '▶';
                });
                
                // Avvia questo player
                this.classList.add('playing');
                this.querySelector('.play-icon').textContent = '⏸';
                
                // Simula la riproduzione audio (qui potresti integrare un vero player audio)
                console.log('Playing audio for:', this.closest('.library-card').querySelector('.scheda-titolo').textContent);
            }
        });
    });
}

// ============================================
//   INIZIALIZZAZIONE WAVETABLE PAGE
// ============================================
function initWavetable() {
    console.log('initWavetable called');
    const waveContainer = document.getElementById('waveContainer');
    const mouseCursor = document.getElementById('mouseCursor');
    console.log('waveContainer found:', !!waveContainer);
    console.log('mouseCursor found:', !!mouseCursor);
    if (!waveContainer || !mouseCursor) {
        console.error('Required elements not found for wavetable');
        return;
    }

    // Rimuovi eventuali nodi precedenti
    const nodesToRemove = waveContainer.querySelectorAll('.wave-node');
    nodesToRemove.forEach(node => node.remove());

    // Rimuovi vecchi event listener (clona il nodo per rimuovere tutti i listener)
    const newWaveContainer = waveContainer.cloneNode(true);
    waveContainer.parentNode.replaceChild(newWaveContainer, waveContainer);

    // Aggiorna i riferimenti
    const waveContainerRef = document.getElementById('waveContainer');
    const mouseCursorRef = document.getElementById('mouseCursor');

    const nodeSpacing = 20;
    const waveSpeed = 80;
    const maxWaveRadius = 200;
    const waveIntensity = 2;
    const wavePause = 150;
    const asciiChars = [
        '·', ':', '·', ':', '·', ':', '·', ':', '·', ':',
        '▁', '▂', '▃', '▄', '▅', '▆', '▇', '█', '▇', '▆', '▅', '▄', '▃', '▂', '▁',
        '░', '▒', '▓', '█', '▓', '▒', '░',
        '⠁', '⠉', '⠋', '⠛', '⠟', '⠿', '⠟', '⠛', '⠋', '⠉', '⠁',
        '○', '◎', '●', '◎', '○'
    ];
    let nodes = [];
    let gridWidth, gridHeight;
    let lastWaveTime = 0;
    let isMouseOver = false;
    let mouseX = 0, mouseY = 0;
    let waveInterval = null;

    function createGrid() {
        const nodesToRemove = waveContainerRef.querySelectorAll('.wave-node');
        nodesToRemove.forEach(node => node.remove());
        nodes = [];
        gridWidth = waveContainerRef.clientWidth;
        gridHeight = waveContainerRef.clientHeight;
        const numCols = Math.floor(gridWidth / nodeSpacing);
        const numRows = Math.floor(gridHeight / nodeSpacing);
        for (let i = 0; i < numRows; i++) {
            for (let j = 0; j < numCols; j++) {
                const x = j * nodeSpacing + nodeSpacing / 2;
                const y = i * nodeSpacing + nodeSpacing / 2;
                const node = document.createElement('div');
                node.className = 'wave-node';
                node.style.left = `${x}px`;
                node.style.top = `${y}px`;
                const charIndex = Math.floor(Math.random() * asciiChars.length);
                node.textContent = asciiChars[charIndex];
                waveContainerRef.appendChild(node);
                nodes.push({
                    element: node,
                    x: x,
                    y: y,
                    originalChar: node.textContent,
                    charIndex: charIndex
                });
            }
        }
    }
    function createWave(centerX, centerY) {
        const now = Date.now();
        if (now - lastWaveTime < wavePause) return;
        lastWaveTime = now;
        nodes.forEach(node => {
            const dx = node.x - centerX;
            const dy = node.y - centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance <= maxWaveRadius) {
                const delay = distance * waveSpeed / 100;
                setTimeout(() => {
                    const wavePhase = (distance / 30) * Math.PI * waveIntensity;
                    const amplitude = Math.cos(wavePhase) * Math.max(0, 1 - distance / maxWaveRadius);
                    if (Math.abs(amplitude) > 0.7) {
                        node.element.className = 'wave-node active-1';
                        node.element.textContent = asciiChars[(node.charIndex + 15) % asciiChars.length];
                    } else if (Math.abs(amplitude) > 0.4) {
                        node.element.className = 'wave-node active-2';
                        node.element.textContent = asciiChars[(node.charIndex + 10) % asciiChars.length];
                    } else if (Math.abs(amplitude) > 0.1) {
                        node.element.className = 'wave-node active-3';
                        node.element.textContent = asciiChars[(node.charIndex + 5) % asciiChars.length];
                    }
                    setTimeout(() => {
                        node.element.className = 'wave-node';
                        node.element.textContent = node.originalChar;
                    }, 300);
                }, delay);
            }
        });
    }
    function handleMouseMove(e) {
        const rect = waveContainerRef.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
        mouseCursorRef.style.left = `${mouseX}px`;
        mouseCursorRef.style.top = `${mouseY}px`;
    }
    function handleMouseEnter() {
        isMouseOver = true;
        if (!waveInterval) {
            waveInterval = setInterval(() => {
                if (isMouseOver) {
                    createWave(mouseX, mouseY);
                }
            }, wavePause);
        }
        mouseCursorRef.style.display = 'block';
    }
    function handleMouseLeave() {
        isMouseOver = false;
        mouseCursorRef.style.display = 'none';
        if (waveInterval) {
            clearInterval(waveInterval);
            waveInterval = null;
        }
    }
    createGrid();
    window.addEventListener('resize', createGrid);
    waveContainerRef.addEventListener('mousemove', handleMouseMove);
    waveContainerRef.addEventListener('mouseenter', handleMouseEnter);
    waveContainerRef.addEventListener('mouseleave', handleMouseLeave);
    waveContainerRef.style.cursor = 'none';
    mouseCursorRef.style.display = 'none';
} 

// ============================================
//   LIBRARIES UPLOAD CROPPING TOOL LOGIC (UPDATED FOR TWO FILES, BOTH CROPPABLE)
// ============================================
let libCropper = null;
let libCroppedDataUrl = null;
let libCropped16x9DataUrl = null;

function initLibrariesCropper() {
  const poster16x9Input = document.getElementById('lib-poster-16x9');
  const poster1x1Input = document.getElementById('lib-poster-1x1');
  const cropperModal = document.getElementById('lib-cropper-modal');
  const cropperImage = document.getElementById('lib-cropper-image');
  const cropBtn = document.getElementById('lib-cropper-crop-btn');
  const cancelBtn = document.getElementById('lib-cropper-cancel-btn');
  const poster16x9Preview = document.getElementById('lib-poster-16x9-preview');
  const poster1x1Preview = document.getElementById('lib-poster-1x1-preview');
  const cropPreview = document.getElementById('lib-crop-preview');

  let cropMode = null; // '16x9' or '1x1'

  if (poster16x9Input) {
    poster16x9Input.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (!file) return;
      cropMode = '16x9';
      const reader = new FileReader();
      reader.onload = function(evt) {
        cropperImage.src = evt.target.result;
        cropperImage.style.display = 'block';
        cropperImage.onload = function() {
          cropperModal.style.display = 'flex';
          if (libCropper) {
            libCropper.destroy();
            libCropper = null;
          }
          libCropper = new Cropper(cropperImage, {
            aspectRatio: 16/9,
            viewMode: 1,
            autoCropArea: 1,
            movable: true,
            zoomable: true,
            rotatable: false,
            scalable: false,
            responsive: true,
            background: false,
          });
        };
      };
      reader.readAsDataURL(file);
    });
  }

  if (poster1x1Input) {
    poster1x1Input.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (!file) return;
      cropMode = '1x1';
      const reader = new FileReader();
      reader.onload = function(evt) {
        cropperImage.src = evt.target.result;
        cropperImage.style.display = 'block';
        cropperImage.onload = function() {
          cropperModal.style.display = 'flex';
          if (libCropper) {
            libCropper.destroy();
            libCropper = null;
          }
          libCropper = new Cropper(cropperImage, {
            aspectRatio: 1,
            viewMode: 1,
            autoCropArea: 1,
            movable: true,
            zoomable: true,
            rotatable: false,
            scalable: false,
            responsive: true,
            background: false,
          });
        };
      };
      reader.readAsDataURL(file);
    });
  }

  cropBtn.addEventListener('click', function() {
    if (libCropper) {
      if (cropMode === '16x9') {
        const canvas = libCropper.getCroppedCanvas({ width: 800, height: 450 });
        libCropped16x9DataUrl = canvas.toDataURL('image/png');
        poster16x9Preview.innerHTML = `<div style='text-align:center;'><strong>Immagine 16:9:</strong><br><img src='${libCropped16x9DataUrl}' style='max-width:220px; max-height:120px; border-radius:10px; margin-top:0.5rem;'></div>`;
      } else if (cropMode === '1x1') {
        const canvas = libCropper.getCroppedCanvas({ width: 400, height: 400 });
        libCroppedDataUrl = canvas.toDataURL('image/png');
        poster1x1Preview.innerHTML = `<div style='text-align:center;'><img src='${libCroppedDataUrl}' style='max-width:120px; max-height:120px; border-radius:10px; margin-top:0.5rem;'></div>`;
        // Remove or clear cropPreview
        cropPreview.innerHTML = '';
      }
      cropperModal.style.display = 'none';
      libCropper.destroy();
      libCropper = null;
      cropMode = null;
    }
  });

  cancelBtn.addEventListener('click', function() {
    cropperModal.style.display = 'none';
    if (libCropper) {
      libCropper.destroy();
      libCropper = null;
    }
    if (cropMode === '16x9') {
      poster16x9Input.value = '';
      poster16x9Preview.innerHTML = '';
    } else if (cropMode === '1x1') {
      poster1x1Input.value = '';
      poster1x1Preview.innerHTML = '';
      cropPreview.innerHTML = '';
    }
    cropperImage.style.display = 'none';
    cropMode = null;
  });
}

// ============================================
//   DYNAMIC LIBRARIES PROJECTS (STAND-INS ONLY)
// ============================================
const librariesProjects = [
  {
    title: 'cornwall',
    location: 'St Ives',
    year: '2025',
    role: 'Sound Designer',
    audio: '',
    img16_9: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    img1_1: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
  },
  {
    title: 'ocean waves',
    location: 'Biarritz',
    year: '2024',
    role: 'Composer',
    audio: '',
    img16_9: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80',
    img1_1: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
  },
  {
    title: 'forest sounds',
    location: 'Black Forest',
    year: '2023',
    role: 'Field Recordist',
    audio: '',
    img16_9: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80',
    img1_1: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
  },
  {
    title: 'city nights',
    location: 'Tokyo',
    year: '2022',
    role: 'Producer',
    audio: '',
    img16_9: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
    img1_1: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=400&q=80',
  },
];

function renderLibraries() {
  const grid = document.querySelector('.library-mini-grid');
  const fullPosterContainer = document.getElementById('library-full-poster-container');
  if (!grid || !fullPosterContainer) return;
  grid.innerHTML = '';
  librariesProjects.forEach((proj, idx) => {
    const mini = document.createElement('div');
    mini.className = 'library-mini-poster';
    mini.setAttribute('data-index', idx);
    mini.innerHTML = `
      <img src="${proj.img1_1}" alt="${proj.title} mini-poster" />
      <div class="library-mini-title">${proj.title}</div>
    `;
    mini.addEventListener('click', (e) => {
      e.stopPropagation();
      // Remove .active from all mini-posters
      document.querySelectorAll('.library-mini-poster').forEach(el => el.classList.remove('active'));
      mini.classList.add('active');
      showLibraryFullPoster(idx);
    });
    grid.appendChild(mini);
  });
  // Add 4 demo posters
  const demoPosters = [
    {
      title: 'demo one',
      location: 'Berlin',
      year: '2026',
      role: 'Demo Artist',
      img16_9: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80',
      img1_1: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
    },
    {
      title: 'demo two',
      location: 'Oslo',
      year: '2027',
      role: 'Demo Composer',
      img16_9: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80',
      img1_1: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
    },
    {
      title: 'demo three',
      location: 'Lisbon',
      year: '2028',
      role: 'Demo Field',
      img16_9: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
      img1_1: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=400&q=80',
    },
    {
      title: 'demo four',
      location: 'Paris',
      year: '2029',
      role: 'Demo Producer',
      img16_9: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
      img1_1: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    },
  ];
  for (let i = 0; i < demoPosters.length; i++) {
    const idx = librariesProjects.length + i;
    const demo = demoPosters[i];
    const mini = document.createElement('div');
    mini.className = 'library-mini-poster';
    mini.setAttribute('data-index', idx);
    mini.innerHTML = `
      <img src="${demo.img1_1}" alt="${demo.title} mini-poster" />
      <div class="library-mini-title">${demo.title}</div>
    `;
    mini.addEventListener('click', (e) => {
      e.stopPropagation();
      document.querySelectorAll('.library-mini-poster').forEach(el => el.classList.remove('active'));
      mini.classList.add('active');
      // Show modal with demo info
      const fullPosterContainer = document.getElementById('library-full-poster-container');
      if (!fullPosterContainer) return;
      fullPosterContainer.style.display = 'block';
      fullPosterContainer.classList.remove('hide');
      setTimeout(() => { fullPosterContainer.classList.add('show'); }, 10);
      const fullImg = document.getElementById('library-full-img');
      fullImg.src = demo.img16_9;
      fullImg.alt = demo.title + ' full-poster';
      fullImg.classList.add('color');
      document.getElementById('library-full-title').textContent = demo.title;
      document.getElementById('library-full-info').innerHTML = `Location: ${demo.location}<br>Year: ${demo.year}<br>Role: ${demo.role}`;
      const audioPlayerDiv = document.getElementById('library-full-audio-player');
      audioPlayerDiv.innerHTML = renderMinimalAudioPlayer('sounds/ex snia_demo.mp3');
      initMinimalAudioPlayer(audioPlayerDiv);
      // Add close on outside click
      function closeOnOutside(e) {
        if (e.target === fullPosterContainer) {
          fullPosterContainer.classList.remove('show');
          fullPosterContainer.classList.add('hide');
          setTimeout(() => { fullPosterContainer.style.display = 'none'; fullPosterContainer.classList.remove('hide'); }, 200);
          document.removeEventListener('mousedown', closeOnOutside);
          fullImg.classList.remove('color');
          document.querySelectorAll('.library-mini-poster').forEach(el => el.classList.remove('active'));
        }
      }
      document.removeEventListener('mousedown', closeOnOutside);
      setTimeout(() => {
        document.addEventListener('mousedown', closeOnOutside);
      }, 20);
    });
    grid.appendChild(mini);
  }
}

function renderCustomAudioPlayer(audioUrl) {
  return `
    <div class="custom-audio-player" data-audio="${audioUrl}">
      <button class="audio-play-btn" aria-label="Play/Pause">▶</button>
      <div class="audio-progress-container">
        <div class="audio-progress-bar"></div>
      </div>
      <span class="audio-time">0:00 / 0:00</span>
      <audio src="${audioUrl}" preload="auto"></audio>
    </div>
  `;
}

function renderMinimalAudioPlayer(audioUrl) {
  // New speaker SVG from icons/speaker.svg
  const speakerSVG = `<svg class='audio-volume-svg' width='22' height='22' viewBox='0 0 256 256' fill='none' xmlns='http://www.w3.org/2000/svg' style='filter: drop-shadow(0 1px 2px #000);'><g><g><path fill='#fff' d='M206.7,81.5c-5-0.8-9.6,2.5-10.4,7.4c-0.8,5,2.5,9.6,7.4,10.4c14.2,2.4,24.2,14.9,24.2,30.2c0,14.7-10.3,27.4-24.5,30.2c-4.9,1-8.2,5.8-7.1,10.7c0.9,4.3,4.6,7.3,8.9,7.3c0.6,0,1.2,0,1.8-0.2c22.7-4.4,39.1-24.7,39.1-47.9C246,105.5,229.4,85.3,206.7,81.5L206.7,81.5z'/><path fill='#fff' d='M168.4,1.8c-3-1.6-6.5-1.5-9.3,0.4L68.3,73.6H38c-15.4,0-28,11-28,24.5l0.5,59.8c0,13.4,12.5,24.3,28,24.3h30.2l90.4,71.6c1.5,1.1,3.3,1.5,5.1,1.5c1.5,0,2.9-0.4,4.3-1c2.9-1.6,4.8-4.7,4.8-8.1V9.8C173.2,6.4,171.3,3.3,168.4,1.8z M155.1,229.3l-78.6-63.6c-1.5-1-3.2-1.5-5-1.5h-33c-5.8,0-9.9-3.2-9.9-6.3L28.1,98c0-3,4.1-6.3,9.9-6.3h33c1.8,0,3.6-0.5,5.1-1.5l79.1-63.4L155.1,229.3L155.1,229.3z'/></g></g></svg>`;
  // Play SVG
  const playSVG = `<svg class='audio-play-svg' width='22' height='22' viewBox='0 0 256 256' fill='none' xmlns='http://www.w3.org/2000/svg' style='filter: drop-shadow(0 1px 2px #000);'><g><g><g><path fill='#fff' d='M33.5,10.8c-2.1,1-4,3-4.8,5.1c-0.5,1.1-0.6,35.3-0.6,112.3c0,122.3-0.3,113.1,3.7,116.2c1.8,1.4,2.7,1.6,5.3,1.6l3.2-0.1l92.4-55.5c68.7-41.2,92.8-56,93.7-57.4c1.8-2.6,1.8-7.3,0-9.9c-1-1.4-25-16.1-93.7-57.3C33.3,6.1,37.9,8.8,33.5,10.8z M200.6,128c0.1,0.2-34.6,21.2-77.1,46.7l-77.2,46.3v-93V35l77.1,46.3C165.8,106.8,200.6,127.8,200.6,128z'/></g></g></g></svg>`;
  // Pause SVG
  const pauseSVG = `<svg class='audio-play-svg' width='22' height='22' viewBox='0 0 256 256' fill='none' xmlns='http://www.w3.org/2000/svg' style='filter: drop-shadow(0 1px 2px #000);'><g><g><g><path fill='#fff' d='M40.2,10.5c-1.2,0.4-2.8,1.2-3.5,1.9c-3.3,3.1-3.1-4.3-3.1,115.7v111.1l1.4,2c0.7,1.2,2.3,2.6,3.5,3.3c2.1,1.2,3,1.3,28,1.3c25.1,0,25.9-0.1,27.5-1.3c0.9-0.7,2.2-2,2.9-2.9c1.3-1.6,1.3-1.8,1.6-111.7c0.2-60.5,0.1-111-0.1-112.1c-0.5-2.4-2-4.6-4.4-6.4c-1.6-1.2-2.4-1.3-26.6-1.4C51.8,10,41.5,10.1,40.2,10.5z M79.9,127.9v99l-13.7,0.2l-13.8,0.1v-99.3V28.6l13.8,0.1l13.7,0.2V127.9z'/><path fill='#fff' d='M164,10.4c-1,0.3-2.8,1.6-3.9,2.7l-2.1,2.2V128v112.7l2.5,2.4c3.3,3.1,4.1,3.1,32,2.9c21.9-0.2,23.1-0.2,25.1-1.5c1.2-0.7,2.7-2.1,3.5-3.3l1.4-2V127.9V16.7l-1.4-2c-0.7-1.2-2.3-2.6-3.5-3.3c-2.1-1.2-3.1-1.3-27-1.4C177.1,10,165,10.1,164,10.4z M203.7,127.9v99.3l-13.7-0.1l-13.8-0.2l-0.2-98.4c-0.1-54.1,0-98.8,0.2-99.2c0.2-0.5,3.6-0.7,13.9-0.7h13.6V127.9z'/></g></g></g></svg>`;
  return `
    <button class="audio-play-btn" aria-label="Play/Pause">${playSVG}</button>
    <div class="audio-player-right">
      <div class="audio-seek"><div class="audio-seek-bar"></div></div>
      <span class="audio-time">0:00 / 0:00</span>
      <div class="audio-volume">
        <span class="audio-volume-icon" aria-label="Volume">${speakerSVG}</span>
        <input type="range" min="0" max="1" step="0.01" value="1">
      </div>
    </div>
    <audio src="${audioUrl || ''}" preload="auto"></audio>
  `;
}

function initMinimalAudioPlayer(container) {
  const audio = container.querySelector('audio');
  const playBtn = container.querySelector('.audio-play-btn');
  const seek = container.querySelector('.audio-seek');
  const seekBar = container.querySelector('.audio-seek-bar');
  const timeDisplay = container.querySelector('.audio-time');
  const volume = container.querySelector('input[type=range]');
  const volIcon = container.querySelector('.audio-volume-icon');
  const volWrap = container.querySelector('.audio-volume');
  // Remove waveform logic
  let raf;
  // Get SVGs for toggling
  const playSVG = playBtn.innerHTML;
  const pauseSVG = `<svg class='audio-play-svg' width='22' height='22' viewBox='0 0 256 256' fill='none' xmlns='http://www.w3.org/2000/svg' style='filter: drop-shadow(0 1px 2px #000);'><g><g><g><path fill='#fff' d='M40.2,10.5c-1.2,0.4-2.8,1.2-3.5,1.9c-3.3,3.1-3.1-4.3-3.1,115.7v111.1l1.4,2c0.7,1.2,2.3,2.6,3.5,3.3c2.1,1.2,3,1.3,28,1.3c25.1,0,25.9-0.1,27.5-1.3c0.9-0.7,2.2-2,2.9-2.9c1.3-1.6,1.3-1.8,1.6-111.7c0.2-60.5,0.1-111-0.1-112.1c-0.5-2.4-2-4.6-4.4-6.4c-1.6-1.2-2.4-1.3-26.6-1.4C51.8,10,41.5,10.1,40.2,10.5z M79.9,127.9v99l-13.7,0.2l-13.8,0.1v-99.3V28.6l13.8,0.1l13.7,0.2V127.9z'/><path fill='#fff' d='M164,10.4c-1,0.3-2.8,1.6-3.9,2.7l-2.1,2.2V128v112.7l2.5,2.4c3.3,3.1,4.1,3.1,32,2.9c21.9-0.2,23.1-0.2,25.1-1.5c1.2-0.7,2.7-2.1,3.5-3.3l1.4-2V127.9V16.7l-1.4-2c-0.7-1.2-2.3-2.6-3.5-3.3c-2.1-1.2-3.1-1.3-27-1.4C177.1,10,165,10.1,164,10.4z M203.7,127.9v99.3l-13.7-0.1l-13.8-0.2l-0.2-98.4c-0.1-54.1,0-98.8,0.2-99.2c0.2-0.5,3.6-0.7,13.9-0.7h13.6V127.9z'/></g></g></g></svg>`;
  function formatTime(sec) {
    sec = Math.floor(sec);
    return `${Math.floor(sec/60)}:${('0'+(sec%60)).slice(-2)}`;
  }
  function updateProgress() {
    const current = audio.currentTime;
    const duration = audio.duration || 0;
    seekBar.style.width = duration ? ((current / duration) * 100) + '%' : '0%';
    timeDisplay.textContent = `${formatTime(current)} / ${formatTime(duration)}`;
    if (!audio.paused) raf = requestAnimationFrame(updateProgress);
  }
  playBtn.addEventListener('click', () => {
    if (audio.paused) {
      audio.play();
      playBtn.innerHTML = pauseSVG;
      raf = requestAnimationFrame(updateProgress);
    } else {
      audio.pause();
      playBtn.innerHTML = playSVG;
      cancelAnimationFrame(raf);
    }
  });
  audio.addEventListener('ended', () => {
    playBtn.innerHTML = playSVG;
    seekBar.style.width = '0%';
    timeDisplay.textContent = `0:00 / ${formatTime(audio.duration)}`;
  });
  audio.addEventListener('loadedmetadata', () => {
    timeDisplay.textContent = `0:00 / ${formatTime(audio.duration)}`;
  });
  seek.addEventListener('click', (e) => {
    const rect = seek.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audio.currentTime = percent * audio.duration;
    updateProgress();
  });
  // Volume slider show/hide
  volIcon.addEventListener('click', (e) => {
    e.stopPropagation();
    volWrap.classList.toggle('show-slider');
  });
  // Hide slider when clicking outside
  document.addEventListener('mousedown', function hideSlider(ev) {
    if (!volWrap.contains(ev.target)) volWrap.classList.remove('show-slider');
  });
  // Volume logic
  volume.addEventListener('input', () => {
    audio.volume = volume.value;
  });
}

function showLibraryFullPoster(idx) {
  const proj = librariesProjects[idx];
  const fullPosterContainer = document.getElementById('library-full-poster-container');
  if (!proj || !fullPosterContainer) return;
  fullPosterContainer.style.display = 'block';
  fullPosterContainer.classList.remove('hide');
  setTimeout(() => { fullPosterContainer.classList.add('show'); }, 10);
  const fullImg = document.getElementById('library-full-img');
  fullImg.src = proj.img16_9;
  fullImg.alt = proj.title + ' full-poster';
  fullImg.classList.add('color');
  document.getElementById('library-full-title').textContent = proj.title;
  document.getElementById('library-full-info').innerHTML = `Location: ${proj.location}<br>Year: ${proj.year}<br>Role: ${proj.role}`;
  // Render minimal custom audio player with test audio
  const audioPlayerDiv = document.getElementById('library-full-audio-player');
  audioPlayerDiv.innerHTML = renderMinimalAudioPlayer('sounds/ex snia_demo.mp3');
  initMinimalAudioPlayer(audioPlayerDiv);
  // Add close on outside click
  function closeOnOutside(e) {
    if (e.target === fullPosterContainer) {
      fullPosterContainer.classList.remove('show');
      fullPosterContainer.classList.add('hide');
      setTimeout(() => { fullPosterContainer.style.display = 'none'; fullPosterContainer.classList.remove('hide'); }, 200);
      document.removeEventListener('mousedown', closeOnOutside);
      // Remove .color from full-poster img
      fullImg.classList.remove('color');
      // Remove .active from all mini-posters
      document.querySelectorAll('.library-mini-poster').forEach(el => el.classList.remove('active'));
    }
  }
  document.removeEventListener('mousedown', closeOnOutside);
  setTimeout(() => {
    document.addEventListener('mousedown', closeOnOutside);
  }, 20);
}

document.addEventListener('DOMContentLoaded', function() {
  renderLibraries();
  // Add minimize button logic
  const minimizeBtn = document.getElementById('library-full-minimize');
  const fullPosterContainer = document.getElementById('library-full-poster-container');
  if (minimizeBtn && fullPosterContainer) {
    minimizeBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      fullPosterContainer.classList.remove('show');
      fullPosterContainer.classList.add('hide');
      setTimeout(() => { fullPosterContainer.style.display = 'none'; fullPosterContainer.classList.remove('hide'); }, 200);
      // Remove .color from full-poster img
      document.getElementById('library-full-img').classList.remove('color');
      // Remove .active from all mini-posters
      document.querySelectorAll('.library-mini-poster').forEach(el => el.classList.remove('active'));
    });
  }
  initLibrariesCropper();
}); 

// ============================================
//   BIO PROFILE PIC CROPPER LOGIC (4:3)
// ============================================
let bioCropper = null;
let bioCroppedDataUrl = null;

function initBioCropper() {
  const bioPicInput = document.getElementById('bio-pic');
  const bioCropperModal = document.getElementById('bio-cropper-modal');
  const bioCropperImage = document.getElementById('bio-cropper-image');
  const bioCropBtn = document.getElementById('bio-cropper-crop-btn');
  const bioCancelBtn = document.getElementById('bio-cropper-cancel-btn');
  const bioCropPreview = document.getElementById('bio-crop-preview');

  if (!bioPicInput) return;

  bioPicInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(evt) {
      bioCropperImage.src = evt.target.result;
      bioCropperImage.style.display = 'block';
      bioCropperImage.onload = function() {
        bioCropperModal.style.display = 'flex';
        if (bioCropper) {
          bioCropper.destroy();
          bioCropper = null;
        }
        bioCropper = new Cropper(bioCropperImage, {
          aspectRatio: 3/4, // vertical portrait
          viewMode: 1,
          autoCropArea: 1,
          movable: true,
          zoomable: true,
          rotatable: false,
          scalable: false,
          responsive: true,
          background: false,
        });
      };
    };
    reader.readAsDataURL(file);
  });

  bioCropBtn.addEventListener('click', function() {
    if (bioCropper) {
      const canvas = bioCropper.getCroppedCanvas({ width: 300, height: 400 });
      bioCroppedDataUrl = canvas.toDataURL('image/png');
      bioCropPreview.innerHTML = `<div style='text-align:center;'><strong>Anteprima 3:4:</strong><br><img src='${bioCroppedDataUrl}' style='max-width:135px; max-height:180px; border-radius:10px; margin-top:0.5rem;'></div>`;
      bioCropperModal.style.display = 'none';
      bioCropper.destroy();
      bioCropper = null;
    }
  });

  bioCancelBtn.addEventListener('click', function() {
    bioCropperModal.style.display = 'none';
    if (bioCropper) {
      bioCropper.destroy();
      bioCropper = null;
    }
    bioPicInput.value = '';
    bioCropPreview.innerHTML = '';
    bioCropperImage.style.display = 'none';
  });
}

document.addEventListener('DOMContentLoaded', function() {
  initBioCropper();
}); 

// ============================================
//   FILM POSTER EXPAND FUNCTIONALITY
// ============================================
function expandFilmPoster(event) {
    event.stopPropagation(); // Prevent the torn poster click event
    
    const modal = document.getElementById('film-expanded-modal');
    if (modal) {
        modal.style.display = 'flex';
        // Trigger animation after a small delay
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }
}

function closeFilmPoster() {
    const modal = document.getElementById('film-expanded-modal');
    if (modal) {
        modal.classList.remove('show');
        // Hide modal after animation completes
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
        
        // Restore body scroll
        document.body.style.overflow = '';
    }
}

// Close modal when clicking outside the content
document.addEventListener('DOMContentLoaded', function() {
    const filmModal = document.getElementById('film-expanded-modal');
    const documentaryModal = document.getElementById('documentary-expanded-modal');
    
    if (filmModal) {
        filmModal.addEventListener('click', function(e) {
            if (e.target === filmModal) {
                closeFilmPoster();
            }
        });
    }
    
    if (documentaryModal) {
        documentaryModal.addEventListener('click', function(e) {
            if (e.target === documentaryModal) {
                closeDocumentaryPoster();
            }
        });
    }
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const filmModal = document.getElementById('film-expanded-modal');
            const documentaryModal = document.getElementById('documentary-expanded-modal');
            
            if (filmModal && filmModal.style.display === 'flex') {
                closeFilmPoster();
            }
            if (documentaryModal && documentaryModal.style.display === 'flex') {
                closeDocumentaryPoster();
            }
        }
    });
});

// ============================================
//   DOCUMENTARY POSTER EXPAND FUNCTIONALITY
// ============================================
function expandDocumentaryPoster(event) {
    event.stopPropagation(); // Prevent the torn poster click event
    
    const modal = document.getElementById('documentary-expanded-modal');
    if (modal) {
        modal.style.display = 'flex';
        // Trigger animation after a small delay
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }
}

function closeDocumentaryPoster() {
    const modal = document.getElementById('documentary-expanded-modal');
    if (modal) {
        modal.classList.remove('show');
        // Hide modal after animation completes
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
        
        // Restore body scroll
        document.body.style.overflow = '';
    }
}

// ============================================
//   ASCII ART GENERATOR (DISABLED - SEE BELOW)
// ============================================
/*
function initAsciiArt() {
    console.log('Initializing ASCII art...');
    const asciiImages = document.querySelectorAll('.ascii-mono, .ascii-3color, .ascii-full');
    console.log('Found ASCII images:', asciiImages.length);
    asciiImages.forEach((img, index) => {
        console.log(`Processing image ${index + 1}:`, img.src);
        generateAsciiArt(img);
    });
}

function generateAsciiArt(imgElement) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = function() {
        console.log('Image loaded:', imgElement.src);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas size (wider for better ASCII rendering)
        const maxWidth = 160;
        const maxHeight = 40;
        const scale = Math.min(maxWidth / img.width, maxHeight / img.height);
        // Stretch horizontally by 40%
        const stretch = 1.4;
        canvas.width = Math.floor(img.width * scale * stretch);
        canvas.height = Math.floor(img.height * scale);
        
        console.log('Canvas size:', canvas.width, 'x', canvas.height);
        
        // Draw and scale image, stretching horizontally
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // ASCII character set (from dark to light)
        const asciiChars = ' .:-=+*#%@';
        
        // Generate ASCII art
        let asciiArt = '';
        for (let y = 0; y < canvas.height; y++) {
            for (let x = 0; x < canvas.width; x++) {
                const index = (y * canvas.width + x) * 4;
                const r = data[index];
                const g = data[index + 1];
                const b = data[index + 2];
                
                // Convert to grayscale
                const gray = 0.299 * r + 0.587 * g + 0.114 * b;
                
                // Map brightness to ASCII character
                const charIndex = Math.floor((gray / 255) * (asciiChars.length - 1));
                asciiArt += asciiChars[charIndex];
            }
            asciiArt += '\n';
        }
        
        // Create ASCII display
        const asciiContainer = document.createElement('div');
        asciiContainer.className = 'ascii-container';
        
        // Determine color scheme based on class
        let colorScheme = 'mono';
        if (imgElement.classList.contains('ascii-3color')) {
            colorScheme = '3color';
        } else if (imgElement.classList.contains('ascii-full')) {
            colorScheme = 'full';
        }
        
        console.log('Color scheme:', colorScheme);
        
        // Create colored ASCII
        const coloredAscii = createColoredAscii(asciiArt, imageData, colorScheme);
        asciiContainer.innerHTML = coloredAscii;
        
        // Replace image with ASCII
        imgElement.style.display = 'none';
        imgElement.parentNode.appendChild(asciiContainer);
        
        // Save ASCII art as file
        const filename = `ascii-portrait-3color-${Date.now()}.html`;
        saveAsciiArt(coloredAscii, filename);
        
        console.log('ASCII art generated for:', imgElement.src);
    };
    
    img.onerror = function() {
        console.error('Failed to load image:', imgElement.src);
    };
    
    img.src = imgElement.src;
}

function createColoredAscii(asciiText, imageData, colorScheme) {
    const lines = asciiText.split('\n');
    let coloredAscii = '';
    
    for (let y = 0; y < lines.length; y++) {
        const line = lines[y];
        for (let x = 0; x < line.length; x++) {
            const char = line[x];
            if (char === ' ') {
                coloredAscii += '&nbsp;';
                continue;
            }
            
            const index = (y * imageData.width + x) * 4;
            const r = imageData.data[index];
            const g = imageData.data[index + 1];
            const b = imageData.data[index + 2];
            
            let color;
            switch (colorScheme) {
                case 'mono':
                    color = '#ffffff';
                    break;
                case '3color':
                    // 3-color scheme: white, pink, blue
                    const brightness = (r + g + b) / 3;
                    if (brightness > 170) {
                        color = '#ffffff';
                    } else if (brightness > 85) {
                        color = '#ff98ff';
                    } else {
                        color = '#3284c9';
                    }
                    break;
                case 'full':
                    color = `rgb(${r}, ${g}, ${b})`;
                    break;
                default:
                    color = '#ffffff';
            }
            
            coloredAscii += `<span style=\"color: ${color};\">${char}</span>`;
        }
        coloredAscii += '\n';
    }
    
    // Wrap in <pre> for correct framing
    return `<pre style=\"margin:0;line-height:1;\">${coloredAscii}</pre>`;
}

// ============================================
//   SAVE ASCII ART AS FILE
// ============================================
function saveAsciiArt(asciiHtml, filename) {
    // Create a complete HTML document with the ASCII art
    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ASCII Portrait - ${filename}</title>
    <style>
        body {
            margin: 0;
            padding: 20px;
            background: #000;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            font-family: 'Courier New', monospace;
        }
        .ascii-container {
            font-family: 'Courier New', monospace;
            font-size: 8px;
            line-height: 1.25;
            letter-spacing: 0.12em;
            white-space: pre;
            text-align: center;
            background: #000;
            padding: 1rem;
            border-radius: 8px;
            max-width: 900px;
            max-height: 400px;
            overflow-x: auto;
            overflow-y: auto;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            box-sizing: border-box;
        }
        .ascii-container pre {
            margin: 0;
            padding: 0;
            background: none;
            color: inherit;
            font-family: inherit;
            font-size: inherit;
            line-height: 1.25;
            letter-spacing: 0.12em;
            text-align: left;
            display: block;
            width: 100%;
            box-sizing: border-box;
        }
        .ascii-container span {
            display: inline-block;
            width: 1ch;
            height: 1em;
        }
    </style>
</head>
<body>
    <div class="ascii-container">
        ${asciiHtml}
    </div>
</body>
</html>`;

    // Create blob and download
    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log(`ASCII art saved as: ${filename}`);
}
*/

// ============================================
//   INITIALIZE ASCII ART ON PAGE LOAD (DISABLED)
// ============================================
// document.addEventListener('DOMContentLoaded', function() {
//     console.log('DOM loaded, setting up ASCII art...');
//     
//     // Override the showPage function to initialize ASCII art
//     const originalShowPage = window.showPage;
//     window.showPage = function(pageId, clickedLink) {
//         originalShowPage(pageId, clickedLink);
//         if (pageId === 'temp-page' || pageId === 'bio-page') {
//             console.log(`${pageId} shown, initializing ASCII art...`);
//             setTimeout(initAsciiArt, 500);
//         }
//     };
// });
// 
// if (document.getElementById('temp-page') && document.getElementById('temp-page').classList.contains('active')) {
//     setTimeout(initAsciiArt, 500);
// }
// if (document.getElementById('bio-page') && document.getElementById('bio-page').classList.contains('active')) {
//     setTimeout(initAsciiArt, 500);
// }