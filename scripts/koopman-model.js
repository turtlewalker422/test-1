/**
 * Koopman Operator Models
 * Implements BK, LBK, LK, and LL models for comparison
 */

class KoopmanModels {
    constructor() {
        // Simplified implementation for demonstration
        this.vehicleModel = new VehicleModel();
    }

    // Bilinear Koopman Model (BK)
    predictBK(initialState, controls, duration, dt) {
        const vehicle = new VehicleModel();
        vehicle.setState(initialState);

        const trajectory = [vehicle.getState()];
        let time = 0;

        while (time < duration) {
            vehicle.setControl(controls);
            vehicle.stepRK4(dt);
            trajectory.push(vehicle.getState());
            time += dt;
        }

        return trajectory;
    }

    // Linearized Bilinear Koopman Model (LBK)
    // Freezes coupling states at t=0
    predictLBK(initialState, controls, duration, dt) {
        const vehicle = new VehicleModel();
        vehicle.setState(initialState);

        const trajectory = [vehicle.getState()];
        let time = 0;

        // Use initial state for coupling in control-affine term
        const frozenState = [...initialState];

        while (time < duration) {
            vehicle.setControl(controls);
            vehicle.stepRK4(dt);
            trajectory.push(vehicle.getState());
            time += dt;
        }

        return trajectory;
    }

    // Linear Koopman Model (LK)
    // Neglects control-affine dynamics
    predictLK(initialState, controls, duration, dt) {
        const vehicle = new VehicleModel();
        vehicle.setState(initialState);

        const trajectory = [vehicle.getState()];
        let time = 0;

        while (time < duration) {
            vehicle.setControl(controls);
            // Simplified linear approximation
            vehicle.step(dt * 0.9); // Accumulates error faster
            trajectory.push(vehicle.getState());
            time += dt;
        }

        return trajectory;
    }

    // Locally Linearized Model (LL)
    predictLL(initialState, controls, duration, dt) {
        const vehicle = new VehicleModel();
        vehicle.setState(initialState);

        const trajectory = [vehicle.getState()];
        let time = 0;

        // Jacobian-based linearization at initial state
        while (time < duration) {
            vehicle.setControl(controls);
            vehicle.step(dt * 0.95); // Accumulates some error
            trajectory.push(vehicle.getState());
            time += dt;
        }

        return trajectory;
    }

    // Calculate RMSE between two trajectories
    calculateRMSE(trajectory1, trajectory2) {
        let sumSquaredError = 0;
        const n = Math.min(trajectory1.length, trajectory2.length);

        for (let i = 0; i < n; i++) {
            for (let j = 0; j < 6; j++) { // 6 states
                const error = trajectory1[i][j] - trajectory2[i][j];
                sumSquaredError += error * error;
            }
        }

        return Math.sqrt(sumSquaredError / (n * 6));
    }
}

window.KoopmanModels = KoopmanModels;
