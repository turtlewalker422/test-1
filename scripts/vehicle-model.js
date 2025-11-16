/**
 * Vehicle Dynamics Model - 3-DOF Bicycle Model
 * Implements the bicycle model from the paper with linear tire forces
 */

class VehicleModel {
    constructor() {
        // Vehicle parameters from typical sedan
        this.M = 1500; // Mass (kg)
        this.Izz = 2500; // Yaw moment of inertia (kg⋅m²)
        this.Lf = 1.2; // Distance from CG to front axle (m)
        this.Lr = 1.3; // Distance from CG to rear axle (m)
        this.g = 9.81; // Gravity (m/s²)

        // Tire parameters
        this.Caf = 80000; // Front cornering stiffness (N/rad)
        this.Car = 80000; // Rear cornering stiffness (N/rad)

        // State: [x, y, r, v, psi, u]
        this.state = [0, 0, 0, 0, 0, 15];

        // Control: [ax, delta_f]
        this.control = [0, 0];
    }

    // Calculate vertical loads
    getFzf() {
        return (this.M * this.Lr * this.g) / (this.Lf + this.Lr);
    }

    getFzr() {
        return (this.M * this.Lf * this.g) / (this.Lf + this.Lr);
    }

    // Calculate slip angles
    getSlipAngles(v, r, u, delta_f) {
        const alpha_f = Math.atan2(v + this.Lf * r, u) - delta_f;
        const alpha_r = Math.atan2(v - this.Lr * r, u);
        return { alpha_f, alpha_r };
    }

    // Calculate tire forces
    getTireForces(alpha_f, alpha_r) {
        const Fzf = this.getFzf();
        const Fzr = this.getFzr();
        const Fyf = this.Caf * Fzf * alpha_f;
        const Fyr = this.Car * Fzr * alpha_r;
        return { Fyf, Fyr };
    }

    // State derivatives: d/dt[x, y, r, v, psi, u]
    stateDerivative(state, control) {
        const [x, y, r, v, psi, u] = state;
        const [ax, delta_f] = control;

        const { alpha_f, alpha_r } = this.getSlipAngles(v, r, u, delta_f);
        const { Fyf, Fyr } = this.getTireForces(alpha_f, alpha_r);

        const dx = u * Math.cos(psi) - v * Math.sin(psi);
        const dy = u * Math.sin(psi) + v * Math.cos(psi);
        const dr = (Fyf * this.Lf - Fyr * this.Lr) / this.Izz;
        const dv = (Fyf + Fyr) / this.M - u * r;
        const dpsi = r;
        const du = ax;

        return [dx, dy, dr, dv, dpsi, du];
    }

    // Euler integration
    step(dt) {
        const derivatives = this.stateDerivative(this.state, this.control);
        for (let i = 0; i < this.state.length; i++) {
            this.state[i] += derivatives[i] * dt;
        }
        return this.state;
    }

    // RK4 integration (more accurate)
    stepRK4(dt) {
        const k1 = this.stateDerivative(this.state, this.control);

        const state2 = this.state.map((s, i) => s + k1[i] * dt / 2);
        const k2 = this.stateDerivative(state2, this.control);

        const state3 = this.state.map((s, i) => s + k2[i] * dt / 2);
        const k3 = this.stateDerivative(state3, this.control);

        const state4 = this.state.map((s, i) => s + k3[i] * dt);
        const k4 = this.stateDerivative(state4, this.control);

        for (let i = 0; i < this.state.length; i++) {
            this.state[i] += (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]) * dt / 6;
        }

        return this.state;
    }

    setState(newState) {
        this.state = [...newState];
    }

    setControl(newControl) {
        this.control = [...newControl];
    }

    getState() {
        return [...this.state];
    }

    reset() {
        this.state = [0, 0, 0, 0, 0, 15];
        this.control = [0, 0];
    }
}

// Export for use in other modules
window.VehicleModel = VehicleModel;
