/**
 * Қазақ есептері — App Logic
 * Particles, parallax, measurements, problems, contact form
 */

document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initNavbar();
    initReveal();
    initParallax();
});

/* =====================================================================
   FLOATING PARTICLES
   ===================================================================== */
function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    const colors = [
        'rgba(0, 229, 255, 0.25)',
        'rgba(255, 193, 7, 0.2)',
        'rgba(124, 77, 255, 0.2)',
        'rgba(0, 184, 212, 0.15)'
    ];

    for (let i = 0; i < 25; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        const size = Math.random() * 4 + 2;
        p.style.width = size + 'px';
        p.style.height = size + 'px';
        p.style.left = Math.random() * 100 + '%';
        p.style.background = colors[Math.floor(Math.random() * colors.length)];
        p.style.animationDuration = (Math.random() * 20 + 15) + 's';
        p.style.animationDelay = (Math.random() * 20) + 's';
        container.appendChild(p);
    }
}

/* =====================================================================
   NAVBAR
   ===================================================================== */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const burger = document.getElementById('navBurger');
    const menu = document.getElementById('mobileMenu');

    if (navbar) {
        const onScroll = () => {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    if (burger && menu) {
        burger.addEventListener('click', () => {
            menu.classList.toggle('open');
            burger.classList.toggle('active');
        });

        // Close on link click
        menu.querySelectorAll('.mobile-link').forEach(link => {
            link.addEventListener('click', () => {
                menu.classList.remove('open');
                burger.classList.remove('active');
            });
        });
    }
}

/* =====================================================================
   SCROLL REVEAL
   ===================================================================== */
function initReveal() {
    const els = document.querySelectorAll('.reveal, .nav-card, .measure-card, .problem-card, .info-block');
    if (!els.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.06, rootMargin: '0px 0px -30px 0px' });

    els.forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(24px)';
        el.style.transition = `all 0.6s ${i * 0.05}s cubic-bezier(0.4, 0, 0.2, 1)`;
        observer.observe(el);
    });
}

/* =====================================================================
   PARALLAX / MOUSE TRACKING
   ===================================================================== */
function initParallax() {
    const ornaments = document.querySelectorAll('.floating-ornament');
    const centerOrnament = document.getElementById('centerOrnament');
    if (!ornaments.length && !centerOrnament) return;

    let mouseX = 0, mouseY = 0;
    let currentX = 0, currentY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    function animateParallax() {
        currentX += (mouseX - currentX) * 0.05;
        currentY += (mouseY - currentY) * 0.05;

        ornaments.forEach(el => {
            const speed = parseFloat(el.dataset.speed) || 0.02;
            const x = currentX * speed * 100;
            const y = currentY * speed * 100;
            el.style.transform = `translate(${x}px, ${y}px)`;
        });

        if (centerOrnament) {
            const cx = currentX * 8;
            const cy = currentY * 8;
            centerOrnament.style.transform = `translate(${cx}px, ${cy}px)`;
        }

        requestAnimationFrame(animateParallax);
    }

    requestAnimationFrame(animateParallax);
}

/* =====================================================================
   MEASUREMENTS RENDERER
   ===================================================================== */
function renderMeasurements() {
    const container = document.getElementById('measurementsContainer');
    if (!container || typeof MEASUREMENTS === 'undefined') return;

    const categories = Object.keys(MEASUREMENTS);

    categories.forEach(catKey => {
        const meta = CATEGORY_META[catKey];
        const items = MEASUREMENTS[catKey];

        const section = document.createElement('div');
        section.className = 'measurement-category reveal';

        const label = document.createElement('h2');
        label.className = 'category-label';
        label.innerHTML = `<span class="category-label-icon">${meta.icon}</span> ${meta.label}`;
        section.appendChild(label);

        const grid = document.createElement('div');
        grid.className = 'measurement-grid';

        items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'measure-card';

            // Check for illustration
            const hasIllust = typeof MEASURE_ILLUSTRATIONS !== 'undefined' && MEASURE_ILLUSTRATIONS[item.name];
            const illustHtml = hasIllust
                ? `<div class="measure-illustration"><img src="${MEASURE_ILLUSTRATIONS[item.name]}" alt="${item.name} — ${item.desc}" loading="lazy"></div>`
                : '';

            card.innerHTML = `
                ${illustHtml}
                <h3 class="measure-name">${item.name}</h3>
                <p class="measure-desc">${item.desc}</p>
                <div class="measure-bar-wrap">
                    <div class="measure-bar-label">
                        <span>${item.kazakh}</span>
                        <span>${item.metric} ${item.unit}</span>
                    </div>
                    <div class="measure-bar">
                        <div class="measure-bar-fill" data-percent="${item.barPercent}" style="width: 0%"></div>
                    </div>
                </div>
                <div class="measure-compare">
                    <span class="measure-compare-icon">↔️</span>
                    <span class="measure-compare-text">1 ${item.kazakh} = <strong>${item.metric} ${item.unit}</strong></span>
                </div>
            `;

            grid.appendChild(card);
        });

        section.appendChild(grid);
        container.appendChild(section);
    });

    // Animate bars on scroll
    animateBars();
    // Re-init reveal for new elements
    initReveal();
}

function animateBars() {
    const bars = document.querySelectorAll('.measure-bar-fill');
    if (!bars.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const percent = entry.target.dataset.percent;
                setTimeout(() => {
                    entry.target.style.width = percent + '%';
                }, 200);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    bars.forEach(bar => observer.observe(bar));
}

/* =====================================================================
   CONVERTER RENDERER
   ===================================================================== */
function renderConverters() {
    const container = document.getElementById('converterSliders');
    if (!container || typeof CONVERTERS === 'undefined') return;

    CONVERTERS.forEach((conv, index) => {
        const row = document.createElement('div');
        row.className = 'converter-row';

        const id = `slider_${index}`;
        const resultId = `result_${index}`;

        row.innerHTML = `
            <div class="converter-label">
                <span>${conv.icon}</span>
                <span>${conv.from} → ${conv.to}</span>
            </div>
            <div class="converter-slider-wrap">
                <input type="range" id="${id}" min="1" max="${conv.max}" value="1" step="1">
            </div>
            <div class="converter-result">
                <span class="converter-value" id="${resultId}_from">1</span>
                <span class="converter-unit">${conv.from}</span>
                <span class="converter-arrow">=</span>
                <span class="converter-value" id="${resultId}_to">${conv.factor.toFixed(2)}</span>
                <span class="converter-unit">${conv.to}</span>
            </div>
        `;

        container.appendChild(row);

        // Bind slider
        const slider = document.getElementById(id);
        slider.addEventListener('input', () => {
            const val = parseFloat(slider.value);
            document.getElementById(`${resultId}_from`).textContent = val;
            document.getElementById(`${resultId}_to`).textContent = (val * conv.factor).toFixed(2);
        });
    });
}

/* =====================================================================
   PROBLEMS RENDERER
   ===================================================================== */
function renderProblems(filterKey = 'all') {
    const grid = document.getElementById('problemsGrid');
    if (!grid || typeof PROBLEMS === 'undefined') return;

    grid.innerHTML = '';
    let allProblems = [];

    const categories = filterKey === 'all' ? Object.keys(PROBLEMS) : [filterKey];

    categories.forEach(catKey => {
        if (!PROBLEMS[catKey]) return;
        const meta = CATEGORY_LABELS[catKey];

        PROBLEMS[catKey].forEach(problem => {
            allProblems.push({ ...problem, category: catKey, meta });
        });
    });

    allProblems.forEach((problem, index) => {
        const card = document.createElement('div');
        card.className = 'problem-card';
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `all 0.5s ${index * 0.06}s cubic-bezier(0.4, 0, 0.2, 1)`;

        let dots = '';
        for (let i = 0; i < 3; i++) {
            dots += `<span class="diff-dot ${i < problem.difficulty ? 'on' : ''}"></span>`;
        }

        const ansId = `answer_${problem.category}_${problem.id}`;
        const btnId = `btn_${problem.category}_${problem.id}`;

        card.innerHTML = `
            <div class="problem-card-header">
                <span class="problem-card-tag ${problem.category}">
                    ${problem.meta.icon} ${problem.meta.label}
                </span>
                <h3 class="problem-card-title">${problem.title}</h3>
            </div>
            <div class="problem-card-body">
                <p class="problem-card-text">${problem.text}</p>
                <div class="difficulty" title="Күрделілік: ${problem.difficulty}/3">${dots}</div>
            </div>
            <div class="problem-card-footer">
                <button class="reveal-btn" id="${btnId}">
                    💡 Жауабын көру
                </button>
            </div>
            <div class="problem-answer" id="${ansId}">
                <div class="answer-box">
                    <div class="answer-label">✅ Жауап</div>
                    <p class="answer-text">${problem.answer}</p>
                </div>
                ${problem.explanation ? `
                <div class="explain-box">
                    <div class="explain-label">📖 Түсіндірме</div>
                    <p class="explain-text">${problem.explanation}</p>
                </div>
                ` : ''}
            </div>
        `;

        grid.appendChild(card);

        // Bind reveal
        const btn = card.querySelector(`#${btnId}`);
        const answerDiv = card.querySelector(`#${ansId}`);

        btn.addEventListener('click', () => {
            const isOpen = answerDiv.classList.contains('show');
            answerDiv.classList.toggle('show');
            btn.classList.toggle('active');
            btn.textContent = isOpen ? '💡 Жауабын көру' : '🔒 Жауапты жасыру';
        });
    });

    // Animate cards
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            grid.querySelectorAll('.problem-card').forEach(c => {
                c.style.opacity = '1';
                c.style.transform = 'translateY(0)';
            });
        });
    });
}

/* =====================================================================
   FILTER TABS
   ===================================================================== */
function initFilterTabs() {
    const tabs = document.querySelectorAll('.filter-tab');
    if (!tabs.length) return;

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            renderProblems(tab.dataset.filter);
        });
    });
}

/* =====================================================================
   CONTACT FORM
   ===================================================================== */
function initContactForm() {
    const form = document.getElementById('contactForm');
    const success = document.getElementById('formSuccess');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Simulate send
        const btn = form.querySelector('.submit-btn');
        btn.textContent = 'Жіберілуде...';
        btn.disabled = true;

        setTimeout(() => {
            form.reset();
            btn.textContent = 'Жіберу →';
            btn.disabled = false;
            success.classList.add('show');

            setTimeout(() => {
                success.classList.remove('show');
            }, 5000);
        }, 1500);
    });
}

