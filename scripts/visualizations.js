/**
 * Visualizations Module
 * Handles all canvas drawings and Chart.js visualizations
 */

window.Visualizations = (function() {
    'use strict';

    // Chart instances
    const charts = {};

    // ========================================
    // HERO ANIMATION
    // ========================================

    function initHeroAnimation() {
        const canvas = document.getElementById('heroCanvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        let animationTime = 0;

        function animate() {
            ctx.clearRect(0, 0, width, height);

            // Draw road
            ctx.fillStyle = '#34495e';
            ctx.fillRect(0, height * 0.5, width, height * 0.3);

            // Lane markings
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.lineWidth = 2;
            ctx.setLineDash([20, 15]);
            ctx.beginPath();
            ctx.moveTo(0, height * 0.65);
            ctx.lineTo(width, height * 0.65);
            ctx.stroke();
            ctx.setLineDash([]);

            // Animated vehicle
            const vehicleX = (Math.sin(animationTime * 0.001) * 0.3 + 0.5) * width;
            const vehicleY = height * 0.65 + Math.sin(animationTime * 0.002) * 30;

            // Draw vehicle
            ctx.save();
            ctx.translate(vehicleX, vehicleY);

            // Vehicle body
            ctx.fillStyle = '#3498db';
            ctx.fillRect(-30, -15, 60, 30);

            // Wheels
            ctx.fillStyle = '#2c3e50';
            ctx.fillRect(-25, -20, 15, 10);
            ctx.fillRect(10, -20, 15, 10);
            ctx.fillRect(-25, 10, 15, 10);
            ctx.fillRect(10, 10, 15, 10);

            ctx.restore();

            animationTime += 16;
            requestAnimationFrame(animate);
        }

        animate();
    }

    // ========================================
    // PERFORMANCE COMPARISON CHART
    // ========================================

    function initPerformanceChart() {
        const canvas = document.getElementById('performanceChart');
        if (!canvas || typeof Chart === 'undefined') return;

        const ctx = canvas.getContext('2d');

        charts.performance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['NL MPC', 'LBK MPC', 'LL MPC'],
                datasets: [{
                    label: 'Solve Time (ms)',
                    data: [133, 14, 4],
                    backgroundColor: ['#f39c12', '#2ecc71', '#3498db'],
                    borderColor: ['#d68910', '#27ae60', '#2980b9'],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    title: {
                        display: true,
                        text: 'Computational Performance (Lower is Better)'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: { display: true, text: 'Time (ms)' }
                    }
                }
            }
        });
    }

    // ========================================
    // SHADOW CANVAS (Koopman Analogy)
    // ========================================

    function initShadowCanvas() {
        const canvas = document.getElementById('shadowCanvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        let angle = 0;

        function animate() {
            ctx.clearRect(0, 0, width, height);

            // Draw 3D sphere (simplified)
            const centerX = width * 0.3;
            const centerY = height * 0.3;
            const radius = 60;

            // Sphere
            ctx.fillStyle = '#667eea';
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.fill();

            // Highlight
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.beginPath();
            ctx.arc(centerX - 20, centerY - 20, 25, 0, Math.PI * 2);
            ctx.fill();

            // Shadow (2D projection)
            const shadowX = width * 0.7;
            const shadowY = height * 0.65;
            const shadowWidth = radius * 1.5 * (0.7 + 0.3 * Math.sin(angle));
            const shadowHeight = radius * 0.3;

            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.save();
            ctx.translate(shadowX, shadowY);
            ctx.scale(1, 0.5);
            ctx.beginPath();
            ctx.ellipse(0, 0, shadowWidth, shadowHeight, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

            // Rotation arrow
            ctx.strokeStyle = '#764ba2';
            ctx.lineWidth = 3;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius + 30, -Math.PI / 2, angle - Math.PI / 2);
            ctx.stroke();
            ctx.setLineDash([]);

            angle += 0.02;
            requestAnimationFrame(animate);
        }

        animate();
    }

    // ========================================
    // LIFTING DEMO
    // ========================================

    function initLiftingDemo() {
        // Original space (nonlinear trajectory)
        const originalCanvas = document.getElementById('originalSpace');
        if (originalCanvas) {
            const ctx = originalCanvas.getContext('2d');
            const width = originalCanvas.width;
            const height = originalCanvas.height;

            let t = 0;

            function animateOriginal() {
                ctx.clearRect(0, 0, width, height);

                // Draw axes
                ctx.strokeStyle = '#ddd';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(50, height / 2);
                ctx.lineTo(width - 50, height / 2);
                ctx.moveTo(width / 2, 50);
                ctx.lineTo(width / 2, height - 50);
                ctx.stroke();

                // Draw nonlinear trajectory
                ctx.strokeStyle = '#e74c3c';
                ctx.lineWidth = 3;
                ctx.beginPath();

                for (let i = 0; i < 100; i++) {
                    const angle = (i / 100) * Math.PI * 2;
                    const x = width / 2 + 120 * Math.cos(angle);
                    const y = height / 2 + 80 * Math.sin(angle) * Math.cos(angle * 2);

                    if (i === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }

                ctx.stroke();

                // Current point
                const currentX = width / 2 + 120 * Math.cos(t);
                const currentY = height / 2 + 80 * Math.sin(t) * Math.cos(t * 2);

                ctx.fillStyle = '#e74c3c';
                ctx.beginPath();
                ctx.arc(currentX, currentY, 6, 0, Math.PI * 2);
                ctx.fill();

                t += 0.02;
                requestAnimationFrame(animateOriginal);
            }

            animateOriginal();
        }

        // Lifted space (linear trajectory)
        const liftedCanvas = document.getElementById('liftedSpace');
        if (liftedCanvas) {
            const ctx = liftedCanvas.getContext('2d');
            const width = liftedCanvas.width;
            const height = liftedCanvas.height;

            let t2 = 0;

            function animateLifted() {
                ctx.clearRect(0, 0, width, height);

                // Draw axes
                ctx.strokeStyle = '#ddd';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(50, height / 2);
                ctx.lineTo(width - 50, height / 2);
                ctx.moveTo(width / 2, 50);
                ctx.lineTo(width / 2, height - 50);
                ctx.stroke();

                // Draw linear trajectory
                ctx.strokeStyle = '#2ecc71';
                ctx.lineWidth = 3;
                ctx.beginPath();

                const startX = 80;
                const startY = height - 80;
                const endX = width - 80;
                const endY = 80;

                ctx.moveTo(startX, startY);
                ctx.lineTo(endX, endY);
                ctx.stroke();

                // Current point
                const progress = (t2 % (Math.PI * 2)) / (Math.PI * 2);
                const currentX = startX + (endX - startX) * progress;
                const currentY = startY + (endY - startY) * progress;

                ctx.fillStyle = '#2ecc71';
                ctx.beginPath();
                ctx.arc(currentX, currentY, 6, 0, Math.PI * 2);
                ctx.fill();

                t2 += 0.02;
                requestAnimationFrame(animateLifted);
            }

            animateLifted();
        }
    }

    // ========================================
    // BASIS CHART
    // ========================================

    function initBasisChart() {
        const canvas = document.getElementById('basisChart');
        if (!canvas || typeof Chart === 'undefined') return;

        const ctx = canvas.getContext('2d');

        const basisData = [6, 16, 36, 71, 127, 211, 331];

        charts.basis = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['1', '2', '3', '4', '5', '6', '7'],
                datasets: [{
                    label: 'Number of Basis Functions',
                    data: basisData,
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    fill: true,
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: { title: { display: true, text: 'Polynomial Degree (ρ)' } },
                    y: { title: { display: true, text: 'Basis Functions' } }
                }
            }
        });
    }

    function updateBasisChart(degree) {
        if (!charts.basis) return;

        // Highlight selected degree
        const highlightData = new Array(7).fill(null);
        highlightData[degree - 1] = [6, 16, 36, 71, 127, 211, 331][degree - 1];

        if (charts.basis.data.datasets.length < 2) {
            charts.basis.data.datasets.push({
                label: 'Selected',
                data: highlightData,
                borderColor: '#e74c3c',
                backgroundColor: 'rgba(231, 76, 60, 0.3)',
                pointRadius: 8,
                pointHoverRadius: 10
            });
        } else {
            charts.basis.data.datasets[1].data = highlightData;
        }

        charts.basis.update();
    }

    // ========================================
    // VEHICLE CANVAS
    // ========================================

    function initVehicleCanvas() {
        const canvas = document.getElementById('vehicleCanvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        function drawVehicle(ax, delta) {
            ctx.clearRect(0, 0, width, height);

            const centerX = width / 2;
            const centerY = height / 2;

            // Draw vehicle body
            ctx.fillStyle = '#3498db';
            ctx.fillRect(centerX - 30, centerY - 50, 60, 100);

            // CG marker
            ctx.fillStyle = '#e74c3c';
            ctx.beginPath();
            ctx.arc(centerX, centerY, 5, 0, Math.PI * 2);
            ctx.fill();

            // Lf and Lr distances
            ctx.strokeStyle = '#2ecc71';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 3]);
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(centerX, centerY - 60);
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(centerX, centerY + 65);
            ctx.stroke();
            ctx.setLineDash([]);

            // Labels
            ctx.fillStyle = '#2c3e50';
            ctx.font = '14px monospace';
            ctx.fillText('CG', centerX + 10, centerY);
            ctx.fillText('Lf', centerX + 10, centerY - 30);
            ctx.fillText('Lr', centerX + 10, centerY + 40);

            // Front wheel (steered)
            ctx.save();
            ctx.translate(centerX, centerY - 60);
            ctx.rotate(delta || 0);
            ctx.fillStyle = '#2c3e50';
            ctx.fillRect(-15, -8, 30, 16);
            ctx.restore();

            // Rear wheel
            ctx.fillStyle = '#2c3e50';
            ctx.fillRect(centerX - 15, centerY + 65 - 8, 30, 16);

            // Tire forces (if controls are applied)
            if (delta && Math.abs(delta) > 0.01) {
                drawForceVector(ctx, centerX - 20, centerY - 60, Math.sin(delta) * 50, -30, '#e74c3c');
                drawForceVector(ctx, centerX + 20, centerY - 60, Math.sin(delta) * 50, -30, '#e74c3c');
                ctx.fillStyle = '#2c3e50';
                ctx.font = '12px monospace';
                ctx.fillText('Fyf', centerX - 60, centerY - 90);
            }

            // Velocity vectors
            drawForceVector(ctx, centerX, centerY, 0, -60, '#2ecc71');
            ctx.fillStyle = '#2c3e50';
            ctx.font = '12px monospace';
            ctx.fillText('u', centerX + 5, centerY - 70);
        }

        function drawForceVector(ctx, x, y, dx, dy, color) {
            ctx.strokeStyle = color;
            ctx.fillStyle = color;
            ctx.lineWidth = 2;

            // Line
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + dx, y + dy);
            ctx.stroke();

            // Arrowhead
            const angle = Math.atan2(dy, dx);
            ctx.beginPath();
            ctx.moveTo(x + dx, y + dy);
            ctx.lineTo(x + dx - 10 * Math.cos(angle - Math.PI / 6), y + dy - 10 * Math.sin(angle - Math.PI / 6));
            ctx.lineTo(x + dx - 10 * Math.cos(angle + Math.PI / 6), y + dy - 10 * Math.sin(angle + Math.PI / 6));
            ctx.closePath();
            ctx.fill();
        }

        // Initial draw
        drawVehicle(0, 0);

        // Store for updates
        window.vehicleVisualization = {
            updateControls: function(ax, delta) {
                drawVehicle(ax, delta);
            }
        };
    }

    // ========================================
    // MPC HORIZON CANVAS
    // ========================================

    function initMPCHorizonCanvas() {
        const canvas = document.getElementById('mpcHorizonCanvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        let animationTime = 0;

        function animate() {
            ctx.clearRect(0, 0, width, height);

            const margin = 50;
            const timelineY = height / 2;

            // Timeline
            ctx.strokeStyle = '#2c3e50';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(margin, timelineY);
            ctx.lineTo(width - margin, timelineY);
            ctx.stroke();

            // Current time
            const currentX = margin + 100 + (animationTime % 200);
            ctx.fillStyle = '#e74c3c';
            ctx.beginPath();
            ctx.arc(currentX, timelineY, 6, 0, Math.PI * 2);
            ctx.fill();

            // Prediction horizon
            const npPixels = 300;
            ctx.fillStyle = 'rgba(52, 152, 219, 0.2)';
            ctx.fillRect(currentX, timelineY - 40, npPixels, 80);
            ctx.strokeStyle = '#3498db';
            ctx.lineWidth = 2;
            ctx.strokeRect(currentX, timelineY - 40, npPixels, 80);

            // Control horizon
            const ncPixels = 100;
            ctx.fillStyle = 'rgba(231, 76, 60, 0.2)';
            ctx.fillRect(currentX, timelineY - 30, ncPixels, 60);
            ctx.strokeStyle = '#e74c3c';
            ctx.lineWidth = 2;
            ctx.strokeRect(currentX, timelineY - 30, ncPixels, 60);

            // Executed control
            ctx.strokeStyle = '#2ecc71';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(currentX - 20, timelineY);
            ctx.lineTo(currentX, timelineY);
            ctx.stroke();

            // Labels
            ctx.fillStyle = '#2c3e50';
            ctx.font = '14px sans-serif';
            ctx.fillText('Now', currentX - 15, timelineY + 25);
            ctx.fillText('Np (3s)', currentX + npPixels / 2 - 30, timelineY - 50);
            ctx.fillText('Nc (0.5s)', currentX + ncPixels / 2 - 35, timelineY + 50);

            animationTime += 0.5;
            requestAnimationFrame(animate);
        }

        animate();
    }

    // ========================================
    // MODEL COMPARISON CHART
    // ========================================

    function initComparisonChart() {
        const canvas = document.getElementById('comparisonChart');
        if (!canvas || typeof Chart === 'undefined') return;

        const ctx = canvas.getContext('2d');

        charts.comparison = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['0.25', '0.5', '0.75', '1.0', '1.25', '1.5', '1.75', '2.0', '2.25', '2.5'],
                datasets: [
                    {
                        label: 'BK Model',
                        data: [0.25, 0.38, 0.50, 0.63, 0.76, 0.89, 1.04, 1.20, 1.38, 1.56],
                        borderColor: '#3498db',
                        backgroundColor: 'rgba(52, 152, 219, 0.1)',
                        tension: 0.3
                    },
                    {
                        label: 'LBK Model',
                        data: [0.26, 0.33, 0.43, 0.55, 0.71, 1.05, 1.42, 1.82, 2.25, 2.71],
                        borderColor: '#2ecc71',
                        backgroundColor: 'rgba(46, 204, 113, 0.1)',
                        tension: 0.3
                    },
                    {
                        label: 'LL Model',
                        data: [0.84, 7.68, 15.2, 24.8, 36.2, 49.5, 64.3, 80.2, 96.8, 113.9],
                        borderColor: '#f39c12',
                        backgroundColor: 'rgba(243, 156, 18, 0.1)',
                        tension: 0.3
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: true, position: 'top' },
                    title: {
                        display: true,
                        text: 'Model Error vs Refreshing Time'
                    }
                },
                scales: {
                    x: { title: { display: true, text: 'Refreshing Time (s)' } },
                    y: { title: { display: true, text: 'Normalized RMSE' }, type: 'logarithmic' }
                }
            }
        });
    }

    // ========================================
    // RESULT CHARTS
    // ========================================

    function initResultCharts() {
        // High Speed Chart
        const highSpeedCanvas = document.getElementById('highSpeedChart');
        if (highSpeedCanvas && typeof Chart !== 'undefined') {
            const ctx = highSpeedCanvas.getContext('2d');

            charts.highSpeed = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['NL MPC', 'LBK MPC', 'LL MPC'],
                    datasets: [{
                        label: 'Normalized Cost',
                        data: [1.000, 1.037, 1.195],
                        backgroundColor: ['#2ecc71', '#3498db', '#f39c12']
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: { y: { beginAtZero: true } }
                }
            });
        }

        // Computation Time Chart
        const compTimeCanvas = document.getElementById('compTimeChart');
        if (compTimeCanvas && typeof Chart !== 'undefined') {
            const ctx = compTimeCanvas.getContext('2d');

            charts.compTime = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['NL MPC', 'LBK MPC', 'LL MPC'],
                    datasets: [{
                        label: 'Solve Time (s)',
                        data: [0.133, 0.014, 0.018],
                        backgroundColor: ['#e74c3c', '#2ecc71', '#3498db']
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: { y: { beginAtZero: true } }
                }
            });
        }
    }

    // ========================================
    // SIMULATION VISUALIZATION
    // ========================================

    function updateSimulation(vehicles, scenario) {
        const canvas = document.getElementById('simulationCanvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        ctx.clearRect(0, 0, width, height);

        // Draw road
        const roadY = height * 0.5;
        const roadHeight = height * 0.4;

        ctx.fillStyle = '#34495e';
        ctx.fillRect(0, roadY, width, roadHeight);

        // Lane markings
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 2;
        ctx.setLineDash([20, 10]);
        for (let i = 1; i < 3; i++) {
            const y = roadY + (roadHeight / 3) * i;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }
        ctx.setLineDash([]);

        // Draw obstacles
        if (scenario && scenario.obstacles) {
            ctx.fillStyle = 'rgba(231, 76, 60, 0.5)';
            scenario.obstacles.forEach(obs => {
                const xStart = (obs.xStart / 200) * width;
                const xEnd = (obs.xEnd / 200) * width;
                ctx.fillRect(xStart, roadY, xEnd - xStart, roadHeight);
            });
        }

        // Draw vehicles
        const colors = { nl: '#f39c12', lbk: '#2ecc71', ll: '#3498db' };
        let yOffset = 0;

        Object.entries(vehicles).forEach(([type, vehicle]) => {
            const state = vehicle.getState();
            const [x, y] = state;

            const vehicleX = (x / 200) * width;
            const vehicleY = roadY + roadHeight / 2 + (y * 10);

            ctx.fillStyle = colors[type];
            ctx.fillRect(vehicleX - 15, vehicleY - 8, 30, 16);

            yOffset += 20;
        });
    }

    function clearSimulation() {
        const canvas = document.getElementById('simulationCanvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // ========================================
    // PUBLIC API
    // ========================================

    return {
        initHeroAnimation,
        initPerformanceChart,
        initShadowCanvas,
        initLiftingDemo,
        initBasisChart,
        updateBasisChart,
        initVehicleCanvas,
        initMPCHorizonCanvas,
        initComparisonChart,
        initResultCharts,
        updateSimulation,
        clearSimulation
    };

})();
