/**
 * Simulation Engine
 * Runs the lane change simulation with multiple controllers
 */

class Simulation {
    constructor() {
        this.running = false;
        this.paused = false;
        this.time = 0;
        this.dt = 0.05; // 50ms timestep
        this.playbackSpeed = 1.0;

        this.controllers = {};
        this.vehicles = {};
        this.trajectories = {};
        this.metrics = {};

        this.scenario = null;
        this.animationFrame = null;
    }

    start(scenarioType, enabledControllers, playbackSpeed = 1.0) {
        console.log(`Starting simulation: ${scenarioType}`);

        this.running = true;
        this.paused = false;
        this.time = 0;
        this.playbackSpeed = playbackSpeed;

        // Setup scenario
        this.setupScenario(scenarioType);

        // Initialize controllers and vehicles
        this.controllers = {};
        this.vehicles = {};
        this.trajectories = {};
        this.metrics = {};

        if (enabledControllers.nl) {
            this.controllers.nl = new MPCController('nl');
            this.vehicles.nl = new VehicleModel();
            this.trajectories.nl = [];
            this.metrics.nl = { cost: 0, solveTime: 0, status: 'Running' };
        }

        if (enabledControllers.lbk) {
            this.controllers.lbk = new MPCController('lbk');
            this.vehicles.lbk = new VehicleModel();
            this.trajectories.lbk = [];
            this.metrics.lbk = { cost: 0, solveTime: 0, status: 'Running' };
        }

        if (enabledControllers.ll) {
            this.controllers.ll = new MPCController('ll');
            this.vehicles.ll = new VehicleModel();
            this.trajectories.ll = [];
            this.metrics.ll = { cost: 0, solveTime: 0, status: 'Running' };
        }

        // Start animation loop
        this.lastTimestamp = performance.now();
        this.update();
    }

    setupScenario(scenarioType) {
        if (scenarioType === 'low') {
            this.scenario = {
                initialSpeed: 15, // m/s
                obstacles: [
                    { xStart: 21, xEnd: 30, opening: 3.0, width: 3.6 },
                    { xStart: 60, xEnd: 70, opening: 0.6, width: 3.6 },
                    { xStart: 100, xEnd: 120, opening: 2.4, width: 3.6 }
                ],
                targetLane: 0,
                duration: 10 // seconds
            };
        } else if (scenarioType === 'high') {
            this.scenario = {
                initialSpeed: 26, // m/s
                obstacles: [
                    { xStart: 21, xEnd: 30, opening: 3.0, width: 3.6 },
                    { xStart: 60, xEnd: 70, opening: 0.6, width: 3.6 },
                    { xStart: 100, xEnd: 120, opening: 2.4, width: 3.6 }
                ],
                targetLane: 0,
                duration: 8 // seconds
            };
        }

        // Set initial states for all vehicles
        Object.values(this.vehicles).forEach(vehicle => {
            vehicle.setState([0, 3.6, 0, 0, 0, this.scenario.initialSpeed]);
        });
    }

    update(timestamp) {
        if (!this.running || this.paused) return;

        // Calculate delta time
        if (!this.lastTimestamp) this.lastTimestamp = timestamp;
        const elapsed = (timestamp - this.lastTimestamp) / 1000; // Convert to seconds
        this.lastTimestamp = timestamp;

        // Update simulation time
        this.time += elapsed * this.playbackSpeed;

        // Check if simulation should stop
        if (this.time >= this.scenario.duration) {
            this.stop();
            return;
        }

        // Update each controller and vehicle
        Object.keys(this.controllers).forEach(type => {
            const controller = this.controllers[type];
            const vehicle = this.vehicles[type];

            // Solve MPC
            const currentState = vehicle.getState();
            const control = controller.solve(currentState, this.scenario.obstacles, this.scenario.targetLane);

            // Apply control
            vehicle.setControl([control.ax, control.delta]);

            // Step simulation
            vehicle.stepRK4(this.dt);

            // Record trajectory
            this.trajectories[type].push([...vehicle.getState()]);

            // Update metrics
            this.metrics[type].cost += control.cost * this.dt;
            this.metrics[type].solveTime = control.solveTime;

            // Check for collisions
            const [x, y] = vehicle.getState();
            for (const obstacle of this.scenario.obstacles) {
                if (x >= obstacle.xStart && x <= obstacle.xEnd) {
                    const distToOpening = Math.abs(y - obstacle.opening);
                    if (distToOpening > obstacle.width / 2) {
                        this.metrics[type].status = 'Collision!';
                    }
                }
            }
        });

        // Update UI
        this.updateUI();

        // Continue animation loop
        this.animationFrame = requestAnimationFrame(this.update.bind(this));
    }

    updateUI() {
        // Update time display
        const simTimeEl = document.getElementById('simTime');
        if (simTimeEl) simTimeEl.textContent = this.time.toFixed(2) + 's';

        // Update metrics for each controller
        Object.keys(this.metrics).forEach(type => {
            const solveTimeEl = document.getElementById(`solveTime-${type}`);
            const costEl = document.getElementById(`cost-${type}`);
            const statusEl = document.getElementById(`status-${type}`);

            if (solveTimeEl) solveTimeEl.textContent = (this.metrics[type].solveTime * 1000).toFixed(1) + 'ms';
            if (costEl) costEl.textContent = this.metrics[type].cost.toFixed(2);
            if (statusEl) {
                statusEl.textContent = this.metrics[type].status;
                statusEl.className = this.metrics[type].status === 'Collision!' ? 'badge badge-error' : 'badge badge-success';
            }
        });

        // Update canvas visualization
        if (window.Visualizations && window.Visualizations.updateSimulation) {
            window.Visualizations.updateSimulation(this.vehicles, this.scenario);
        }

        // Update trajectory plots
        if (window.Visualizations && window.Visualizations.updateTrajectoryPlots) {
            window.Visualizations.updateTrajectoryPlots(this.trajectories);
        }
    }

    pause() {
        this.paused = true;
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
    }

    resume() {
        this.paused = false;
        this.lastTimestamp = performance.now();
        this.update();
    }

    stop() {
        this.running = false;
        this.paused = false;
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }

        // Mark all as complete
        Object.keys(this.metrics).forEach(type => {
            if (this.metrics[type].status !== 'Collision!') {
                this.metrics[type].status = 'Complete';
            }
        });

        this.updateUI();
    }

    reset() {
        this.stop();
        this.time = 0;
        this.trajectories = {};
        this.metrics = {};

        // Reset UI
        const simTimeEl = document.getElementById('simTime');
        if (simTimeEl) simTimeEl.textContent = '0.00s';

        // Clear canvases
        if (window.Visualizations && window.Visualizations.clearSimulation) {
            window.Visualizations.clearSimulation();
        }
    }
}

// Create global simulation instance
window.simulation = new Simulation();
