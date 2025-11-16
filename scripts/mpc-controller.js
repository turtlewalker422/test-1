/**
 * Model Predictive Control (MPC) Controllers
 * Simplified implementation for demonstration
 */

class MPCController {
    constructor(modelType = 'lbk') {
        this.modelType = modelType; // 'nl', 'lbk', or 'll'
        this.predictionHorizon = 3.0; // seconds
        this.controlHorizon = 0.5; // seconds
        this.sampleTime = 0.1; // seconds

        // Cost function weights
        this.weights = {
            delta: 1.0,
            ax: 0.1,
            y: 10.0,
            psi: 5.0
        };

        this.vehicleModel = new VehicleModel();
        this.koopmanModels = new KoopmanModels();
    }

    // Simplified MPC - generates control based on current state and obstacles
    solve(currentState, obstacles, targetLane = 0) {
        // Simplified control law for demonstration
        const [x, y, r, v, psi, u] = currentState;

        let delta = 0;
        let ax = 0;

        // Lane keeping
        const yError = y - targetLane;
        const psiError = psi;

        // Proportional control for steering
        delta = -0.5 * yError - 0.3 * psiError;

        // Obstacle avoidance
        for (const obstacle of obstacles) {
            if (x >= obstacle.xStart && x <= obstacle.xEnd) {
                // In obstacle zone - steer to opening
                const openingY = obstacle.opening;
                const distanceToOpening = Math.abs(y - openingY);

                if (distanceToOpening > 0.5) {
                    const steerDirection = y < openingY ? 1 : -1;
                    delta += steerDirection * 0.3;
                }
            }
        }

        // Limit steering angle
        delta = Math.max(-0.5, Math.min(0.5, delta));

        // Speed control
        const targetSpeed = 15; // m/s for low speed, 26 for high speed
        const speedError = targetSpeed - u;
        ax = 0.5 * speedError;
        ax = Math.max(-5, Math.min(5, ax));

        // Calculate solve time (simulated)
        let solveTime;
        if (this.modelType === 'nl') {
            solveTime = 0.133; // 133ms for nonlinear MPC
        } else if (this.modelType === 'lbk') {
            solveTime = 0.014; // 14ms for LBK MPC
        } else {
            solveTime = 0.004; // 4ms for linear MPC
        }

        return {
            delta,
            ax,
            solveTime,
            cost: this.calculateCost(delta, ax, yError, psiError)
        };
    }

    calculateCost(delta, ax, yError, psiError) {
        return (
            this.weights.delta * delta * delta +
            this.weights.ax * ax * ax +
            this.weights.y * yError * yError +
            this.weights.psi * psiError * psiError
        );
    }

    setWeights(weights) {
        this.weights = { ...this.weights, ...weights };
    }

    setHorizons(predictionHorizon, controlHorizon) {
        this.predictionHorizon = predictionHorizon;
        this.controlHorizon = controlHorizon;
    }
}

window.MPCController = MPCController;
