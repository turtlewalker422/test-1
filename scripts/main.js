/**
 * Main Application - Koopman Operator MPC Interactive Interface
 * Ties together all modules and handles user interactions
 */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚗 Koopman MPC Explorer - Initializing...');

    // ========================================
    // NAVIGATION
    // ========================================

    const nav = document.getElementById('mainNav');
    const navLinks = document.querySelectorAll('.nav-link');
    const navToggle = document.getElementById('navToggle');

    // Smooth scroll and active state
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 70;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }

                // Update active state
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });

    // Sticky navigation on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // ========================================
    // KOOPMAN OPERATOR - LEVEL SELECTOR
    // ========================================

    const levelBtns = document.querySelectorAll('.level-btn');
    const learningContents = document.querySelectorAll('.learning-content');

    levelBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const level = this.getAttribute('data-level');

            // Update button states
            levelBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // Update content
            learningContents.forEach(content => {
                content.classList.remove('active');
                if (content.getAttribute('data-content') === level) {
                    content.classList.add('active');
                }
            });
        });
    });

    // ========================================
    // POLYNOMIAL DEGREE SLIDER
    // ========================================

    const polyDegreeSlider = document.getElementById('polyDegree');
    const polyDegreeValue = document.getElementById('polyDegreeValue');
    const basisCountEl = document.getElementById('basisCount');
    const accuracyValueEl = document.getElementById('accuracyValue');
    const computationValueEl = document.getElementById('computationValue');

    // Basis function counts from paper (Figure 1)
    const basisFunctions = [6, 16, 36, 71, 127, 211, 331];

    if (polyDegreeSlider) {
        polyDegreeSlider.addEventListener('input', function() {
            const degree = parseInt(this.value);
            polyDegreeValue.textContent = degree;

            // Update basis function count
            const basisCount = basisFunctions[degree - 1];
            basisCountEl.textContent = basisCount;

            // Update accuracy indicator
            if (degree <= 2) {
                accuracyValueEl.textContent = 'Low';
                accuracyValueEl.style.color = '#e74c3c';
            } else if (degree <= 5) {
                accuracyValueEl.textContent = 'High';
                accuracyValueEl.style.color = '#2ecc71';
            } else {
                accuracyValueEl.textContent = 'Overfitting';
                accuracyValueEl.style.color = '#f39c12';
            }

            // Update computation cost
            if (degree <= 3) {
                computationValueEl.textContent = 'Low';
                computationValueEl.style.color = '#2ecc71';
            } else if (degree <= 5) {
                computationValueEl.textContent = 'Medium';
                computationValueEl.style.color = '#f39c12';
            } else {
                computationValueEl.textContent = 'High';
                computationValueEl.style.color = '#e74c3c';
            }

            // Update basis chart if available
            updateBasisChart(degree);
        });

        // Initialize
        polyDegreeSlider.dispatchEvent(new Event('input'));
    }

    // ========================================
    // VEHICLE CONTROL INPUTS
    // ========================================

    const controlAx = document.getElementById('controlAx');
    const axValue = document.getElementById('axValue');
    const controlDelta = document.getElementById('controlDelta');
    const deltaValue = document.getElementById('deltaValue');

    if (controlAx) {
        controlAx.addEventListener('input', function() {
            axValue.textContent = parseFloat(this.value).toFixed(1);
            if (window.vehicleVisualization) {
                window.vehicleVisualization.updateControls(
                    parseFloat(this.value),
                    parseFloat(controlDelta.value)
                );
            }
        });
    }

    if (controlDelta) {
        controlDelta.addEventListener('input', function() {
            deltaValue.textContent = parseFloat(this.value).toFixed(2);
            if (window.vehicleVisualization) {
                window.vehicleVisualization.updateControls(
                    parseFloat(controlAx.value),
                    parseFloat(this.value)
                );
            }
        });
    }

    // ========================================
    // MODEL COMPARISON CONTROLS
    // ========================================

    const refreshTimeSlider = document.getElementById('refreshTime');
    const refreshTimeValue = document.getElementById('refreshTimeValue');
    const runComparisonBtn = document.getElementById('runComparison');

    if (refreshTimeSlider) {
        refreshTimeSlider.addEventListener('input', function() {
            refreshTimeValue.textContent = this.value;
        });
    }

    if (runComparisonBtn) {
        runComparisonBtn.addEventListener('click', function() {
            const refreshTime = parseFloat(refreshTimeSlider.value);
            runModelComparison(refreshTime);
        });
    }

    // ========================================
    // MPC PARAMETER CONTROLS
    // ========================================

    const mpcParams = {
        np: { slider: document.getElementById('paramNp'), display: document.getElementById('npValue') },
        nc: { slider: document.getElementById('paramNc'), display: document.getElementById('ncValue') },
        ns: { slider: document.getElementById('paramNs'), display: document.getElementById('nsValue') }
    };

    Object.entries(mpcParams).forEach(([key, elements]) => {
        if (elements.slider) {
            elements.slider.addEventListener('input', function() {
                elements.display.textContent = this.value;
                if (window.mpcVisualization) {
                    window.mpcVisualization.updateParameters();
                }
            });
        }
    });

    // ========================================
    // COST FUNCTION WEIGHTS
    // ========================================

    const costWeights = {
        delta: { slider: document.getElementById('weightDelta'), display: document.getElementById('wDeltaValue') },
        ax: { slider: document.getElementById('weightAx'), display: document.getElementById('wAxValue') },
        y: { slider: document.getElementById('weightY'), display: document.getElementById('wYValue') },
        psi: { slider: document.getElementById('weightPsi'), display: document.getElementById('wPsiValue') }
    };

    Object.entries(costWeights).forEach(([key, elements]) => {
        if (elements.slider) {
            elements.slider.addEventListener('input', function() {
                elements.display.textContent = parseFloat(this.value).toFixed(elements.slider.step < 1 ? 2 : 1);
            });
        }
    });

    // ========================================
    // SIMULATION CONTROLS
    // ========================================

    const scenarioBtns = document.querySelectorAll('.scenario-btn');
    const startSimBtn = document.getElementById('startSim');
    const pauseSimBtn = document.getElementById('pauseSim');
    const resetSimBtn = document.getElementById('resetSim');
    const playbackSpeedSlider = document.getElementById('playbackSpeed');
    const playbackSpeedValue = document.getElementById('playbackSpeedValue');

    let currentScenario = 'low';

    scenarioBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            scenarioBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentScenario = this.getAttribute('data-scenario');
        });
    });

    if (playbackSpeedSlider) {
        playbackSpeedSlider.addEventListener('input', function() {
            playbackSpeedValue.textContent = this.value;
        });
    }

    if (startSimBtn) {
        startSimBtn.addEventListener('click', function() {
            const enabledControllers = {
                nl: document.getElementById('enableNL').checked,
                lbk: document.getElementById('enableLBK').checked,
                ll: document.getElementById('enableLL').checked
            };

            const playbackSpeed = parseFloat(playbackSpeedSlider.value);

            if (window.simulation) {
                window.simulation.start(currentScenario, enabledControllers, playbackSpeed);
                startSimBtn.disabled = true;
                pauseSimBtn.disabled = false;
            }
        });
    }

    if (pauseSimBtn) {
        pauseSimBtn.addEventListener('click', function() {
            if (window.simulation) {
                window.simulation.pause();
                startSimBtn.disabled = false;
                pauseSimBtn.disabled = true;
            }
        });
    }

    if (resetSimBtn) {
        resetSimBtn.addEventListener('click', function() {
            if (window.simulation) {
                window.simulation.reset();
                startSimBtn.disabled = false;
                pauseSimBtn.disabled = true;
            }
        });
    }

    // ========================================
    // GLOSSARY TABS
    // ========================================

    const glossaryTabs = document.querySelectorAll('.glossary-tab');
    const glossaryContents = document.querySelectorAll('.glossary-content');

    glossaryTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');

            glossaryTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            glossaryContents.forEach(content => {
                content.classList.remove('active');
                if (content.getAttribute('data-content') === targetTab) {
                    content.classList.add('active');
                }
            });
        });
    });

    // ========================================
    // TOUR MODAL
    // ========================================

    const startTourBtn = document.getElementById('startTour');
    const tourModal = document.getElementById('tourModal');
    const modalClose = document.querySelector('.modal-close');

    if (startTourBtn) {
        startTourBtn.addEventListener('click', function(e) {
            e.preventDefault();
            tourModal.classList.add('active');
        });
    }

    if (modalClose) {
        modalClose.addEventListener('click', function() {
            tourModal.classList.remove('active');
        });
    }

    // Close modal on outside click
    tourModal.addEventListener('click', function(e) {
        if (e.target === tourModal) {
            tourModal.classList.remove('active');
        }
    });

    // ========================================
    // INITIALIZE VISUALIZATIONS
    // ========================================

    setTimeout(() => {
        initializeAllVisualizations();
    }, 100);

    // ========================================
    // RENDER MATH EQUATIONS
    // ========================================

    if (typeof renderMathInElement !== 'undefined') {
        setTimeout(() => {
            renderMathInElement(document.body, {
                delimiters: [
                    {left: "$$", right: "$$", display: true},
                    {left: "$", right: "$", display: false}
                ],
                throwOnError: false
            });
        }, 500);
    }

    console.log('✅ Koopman MPC Explorer - Ready!');
});

// ========================================
// HELPER FUNCTIONS
// ========================================

function initializeAllVisualizations() {
    console.log('Initializing visualizations...');

    // Hero animation
    if (window.Visualizations) {
        window.Visualizations.initHeroAnimation();
        window.Visualizations.initPerformanceChart();
        window.Visualizations.initShadowCanvas();
        window.Visualizations.initLiftingDemo();
        window.Visualizations.initBasisChart();
        window.Visualizations.initVehicleCanvas();
        window.Visualizations.initMPCHorizonCanvas();
        window.Visualizations.initComparisonChart();
        window.Visualizations.initResultCharts();
    }
}

function updateBasisChart(degree) {
    if (window.Visualizations && window.Visualizations.updateBasisChart) {
        window.Visualizations.updateBasisChart(degree);
    }
}

function runModelComparison(refreshTime) {
    console.log(`Running model comparison with ${refreshTime}s refresh time...`);

    // Simulate model comparison
    const models = ['bk', 'lbk', 'lk', 'll'];

    // RMSE data from paper (Table 1) - normalized values for 0.5s
    const rmseData = {
        0.25: { bk: 0.25, lbk: 0.26, lk: 5.48, ll: 0.84 },
        0.5: { bk: 0.38, lbk: 0.33, lk: 22.6, ll: 7.68 },
        0.75: { bk: 0.50, lbk: 0.43, lk: 38.4, ll: 15.2 },
        1.0: { bk: 0.63, lbk: 0.55, lk: 51.2, ll: 24.8 },
        1.25: { bk: 0.76, lbk: 0.71, lk: 62.3, ll: 36.2 },
        1.5: { bk: 0.89, lbk: 1.05, lk: 71.8, ll: 49.5 },
        1.75: { bk: 1.04, lbk: 1.42, lk: 79.9, ll: 64.3 },
        2.0: { bk: 1.20, lbk: 1.82, lk: 86.8, ll: 80.2 },
        2.25: { bk: 1.38, lbk: 2.25, lk: 92.6, ll: 96.8 },
        2.5: { bk: 1.56, lbk: 2.71, lk: 97.4, ll: 113.9 }
    };

    const data = rmseData[refreshTime] || rmseData[0.5];

    models.forEach(model => {
        const element = document.getElementById(`rmse-${model}`);
        if (element) {
            element.textContent = data[model].toFixed(2);

            // Color code by performance
            if (data[model] < 1) {
                element.style.color = '#2ecc71';
            } else if (data[model] < 5) {
                element.style.color = '#f39c12';
            } else {
                element.style.color = '#e74c3c';
            }
        }
    });

    // Update comparison chart if available
    if (window.Visualizations && window.Visualizations.updateComparisonChart) {
        window.Visualizations.updateComparisonChart(refreshTime, data);
    }
}

// Utility function for animating numbers
function animateNumber(element, start, end, duration) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            element.textContent = end.toFixed(2);
            clearInterval(timer);
        } else {
            element.textContent = current.toFixed(2);
        }
    }, 16);
}

// Export for use in other modules
window.AppUtils = {
    animateNumber,
    runModelComparison
};
