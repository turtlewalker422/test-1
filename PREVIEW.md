# Visual Preview - Interactive Koopman MPC Interface

## 🎨 What the Interface Looks Like

### Hero Section
```
═══════════════════════════════════════════════════════════════
                 🚗 Koopman MPC Explorer

        Autonomous Driving Control
  Using Koopman Operator-Based Model Predictive Control

   Explore how mathematical operators transform nonlinear
   vehicle dynamics into efficient linear models for
   real-time autonomous driving control

               Siyuan Yu, Congkai Shen, Tulga Ersal
              University of Michigan, Ann Arbor

       [Start Interactive Tour]  [Try Simulation]

           [Animated Vehicle on Road ═══════🚗═══════]
═══════════════════════════════════════════════════════════════
```

---

### The Challenge Section
```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│      🎯          │  │       ⚡         │  │       ✨         │
│   Accuracy       │  │     Speed       │  │    Solution     │
│                  │  │                  │  │                  │
│ Nonlinear MPC    │  │  Linear MPC     │  │   LBK MPC       │
│ 133ms solve time │  │  4ms solve time │  │ 14ms solve time │
│                  │  │                  │  │                  │
│ ⚠️ Too slow for  │  │ ⚠️ Fails at     │  │ ✅ Near-NL      │
│   real-time      │  │   high speeds   │  │   accuracy!     │
└─────────────────┘  └─────────────────┘  └─────────────────┘

               Performance Comparison Chart:
        ┌──────────────────────────────────────┐
        │ 140│█                                 │
        │ 120│█                                 │
        │ 100│█                                 │
        │  80│█                                 │
        │  60│█                                 │
        │  40│█                                 │
        │  20│█      ▄    ▂                     │
        │   0└─────────────────────────────────│
        │     NL MPC  LBK   LL MPC             │
        └──────────────────────────────────────┘
```

---

### Koopman Operator Section
```
┌────────────────────────────────────────────────────────────┐
│  Understanding the Koopman Operator                        │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  [  1  ]     [  2  ]     [  3  ]                          │
│ Intuition   Visual   Mathematical                         │
│                                                            │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  LEVEL 1: The Shadow Analogy                              │
│                                                            │
│  ┌─────────────┐              ┌─────────────┐            │
│  │     🌐       │      →       │  Shadow     │            │
│  │   Sphere    │   Lifts to   │  (2D)       │            │
│  │   (3D)      │   higher     │  Nonlinear  │            │
│  │  Rotates    │   dimension  │  motion     │            │
│  │  LINEARLY   │              │             │            │
│  └─────────────┘              └─────────────┘            │
│                                                            │
│  💡 Key Insight: By "lifting" to 3D, we see the linear   │
│     pattern in the sphere's rotation!                     │
│                                                            │
│  This is what Koopman does: Lifts nonlinear vehicle      │
│  dynamics to higher dimensions where they're LINEAR!      │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│  LEVEL 2: Interactive Lifting                              │
│                                                            │
│  Try It: Polynomial Degree (ρ): [====●====] 5             │
│                                                            │
│  ┌──────────────┐    Lift     ┌──────────────┐           │
│  │ Nonlinear    │     →       │ Linear       │           │
│  │ Trajectory   │             │ Trajectory   │           │
│  │              │             │              │           │
│  │   ∿∿∿∿∿∿     │             │   ━━━━━━     │           │
│  │  Complex!    │             │   Simple!    │           │
│  └──────────────┘             └──────────────┘           │
│                                                            │
│  ┌───────────┬────────────┬──────────────┐               │
│  │  Basis    │   Model    │ Computation  │               │
│  │ Functions │  Accuracy  │     Cost     │               │
│  ├───────────┼────────────┼──────────────┤               │
│  │    127    │   High     │   Medium     │               │
│  └───────────┴────────────┴──────────────┘               │
│                                                            │
│  Basis Functions vs Degree Chart:                         │
│  ┌────────────────────────────────────┐                  │
│  │ 400│                          ●     │                  │
│  │ 300│                     ●          │                  │
│  │ 200│                ●               │                  │
│  │ 100│           ●                    │                  │
│  │   0│  ●   ●                         │                  │
│  │    └────────────────────────────────│                  │
│  │      1  2  3  4  5  6  7           │                  │
│  │         Polynomial Degree           │                  │
│  └────────────────────────────────────┘                  │
└────────────────────────────────────────────────────────────┘
```

---

### Vehicle Dynamics Section
```
┌────────────────────────────────────────────────────────────┐
│  3-DOF Bicycle Model                                       │
├────────────────────────────────────────────────────────────┤
│                                                            │
│         [Vehicle Visualization]                            │
│              Front Wheel                                   │
│                  ╔═╗    ← Fyf (tire force)                │
│                  ║ ║                                       │
│           Lf →   ║ ║                                       │
│                  ╚═╝                                       │
│                   │                                        │
│                  ●CG  ← u (forward velocity)              │
│                   │                                        │
│           Lr →   ╔═╗                                       │
│                  ║ ║                                       │
│              Rear Wheel                                    │
│                                                            │
│  States (ξ):                Controls (ζ):                 │
│  ┌─────────────────────┐   ┌──────────────────────┐      │
│  │ x: 0.0 m (position) │   │ ax: [═══●═══] 0.0   │      │
│  │ y: 0.0 m            │   │ δf: [═══●═══] 0.00  │      │
│  │ r: 0.0 rad/s (yaw)  │   │                      │      │
│  │ v: 0.0 m/s (lateral)│   │                      │      │
│  │ ψ: 0.0 rad (heading)│   │                      │      │
│  │ u: 15.0 m/s (speed) │   │                      │      │
│  └─────────────────────┘   └──────────────────────┘      │
│                                                            │
│  Model Comparison: Refreshing Time [═══●═══] 0.5s        │
│                                                            │
│  ┌─────────┬─────────┬─────────┬─────────┐              │
│  │ BK      │ LBK     │ LK      │ LL      │              │
│  │ Bilinear│Lineariz.│ Linear  │ Locally │              │
│  │ Koopman │Bilinear │ Koopman │ Linear  │              │
│  ├─────────┼─────────┼─────────┼─────────┤              │
│  │RMSE:0.38│RMSE:0.33│RMSE:22.6│RMSE:7.68│              │
│  │  ✅ Good│  ✅ Good│  ❌ Bad │⚠️ Medium│              │
│  └─────────┴─────────┴─────────┴─────────┘              │
└────────────────────────────────────────────────────────────┘
```

---

### Interactive Simulation Section (★ The Main Event!)
```
┌────────────────────────────────────────────────────────────┐
│  Interactive Lane Change Simulation                        │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  Select Scenario:                                          │
│  [Low Speed (15 m/s)] [High Speed (26 m/s)] [Custom]     │
│                                                            │
│  Controllers to Compare:                                   │
│  ☑ Nonlinear MPC (NL)                                     │
│  ☑ LBK MPC (Proposed)                                     │
│  ☑ Linear MPC (LL)                                        │
│                                                            │
│  Playback Speed: [═══●═══] 1.0x                           │
│                                                            │
│  [▶ Start] [⏸ Pause] [↻ Reset]                           │
│                                                            │
├────────────────────────────────────────────────────────────┤
│  Simulation View:                                          │
│                                                            │
│  ════════════════════════════════════════════════         │
│                       ▓▓▓▓▓                               │
│  ─ ─ ─ ─ 🚙🚗🚕 ─ ─ ▓▓▓▓▓ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─          │
│                  ↑    ▓▓▓▓▓                               │
│               Vehicles  (Obstacle)                         │
│  ════════════════════════════════════════════════         │
│                                                            │
│  Time: 2.45s | Speed: 26.0 m/s | Position: (65.2, 1.8)   │
│                                                            │
├────────────────────────────────────────────────────────────┤
│  Real-Time Performance Metrics:                            │
│                                                            │
│  ┌─────────────┬─────────────┬─────────────┐             │
│  │ NL MPC      │ LBK MPC     │ LL MPC      │             │
│  ├─────────────┼─────────────┼─────────────┤             │
│  │Solve: 133ms │Solve: 14ms  │Solve: 4ms   │             │
│  │Cost: 45.2   │Cost: 48.3   │Cost: 89.7   │             │
│  │✅ Running   │✅ Running   │❌ Collision!│             │
│  └─────────────┴─────────────┴─────────────┘             │
│                                                            │
│  📊 State Trajectories:                                   │
│  [Graph: Y position]  [Graph: Lateral speed]              │
│  [Graph: Yaw rate]    [Graph: Yaw angle]                  │
└────────────────────────────────────────────────────────────┘

KEY OBSERVATION:
At high speed, LL MPC CRASHES into the obstacle!
LBK MPC successfully navigates through - proving it captures
the nonlinear dynamics better while remaining computationally fast!
```

---

### Research Results Section
```
┌────────────────────────────────────────────────────────────┐
│  Research Results (50 Randomized Scenarios)                │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  High Speed Performance:                                   │
│  ┌────────────────────────────────────┐                  │
│  │ 1.20│        ▇▇▇                    │                  │
│  │ 1.10│    ▇▇▇ ▇▇▇                    │                  │
│  │ 1.00│▇▇▇ ▇▇▇ ▇▇▇                    │                  │
│  │ 0.90│▇▇▇ ▇▇▇ ▇▇▇                    │                  │
│  │      NL  LBK  LL                    │                  │
│  │    1.00 1.037 1.195 (normalized)   │                  │
│  └────────────────────────────────────┘                  │
│                                                            │
│  Key Finding: LBK only 3.7% worse than NL                 │
│              LL is 19.5% worse than NL                    │
│                                                            │
│  Computational Performance:                                │
│  ┌────────────────────────────────────┐                  │
│  │ 0.14│█                               │                  │
│  │ 0.12│█                               │                  │
│  │ 0.10│█                               │                  │
│  │ 0.08│█                               │                  │
│  │ 0.06│█                               │                  │
│  │ 0.04│█                               │                  │
│  │ 0.02│█    ▄ ▂                        │                  │
│  │ 0.00└─────────────────────────────  │                  │
│  │      NL  LBK LL                     │                  │
│  │    133ms 14ms 18ms                  │                  │
│  └────────────────────────────────────┘                  │
│                                                            │
│  Key Finding: LBK is 9.5x FASTER than NL!                 │
│                                                            │
│  Model Fidelity Table (RMSE at 0.5s refresh):             │
│  ┌──────┬──────┬──────┬──────┬──────┐                    │
│  │Model │ Pos  │ v    │ r    │ ψ    │                    │
│  ├──────┼──────┼──────┼──────┼──────┤                    │
│  │BK    │ 0.49 │ 0.26 │ 0.26 │ 0.51 │ ✅                 │
│  │LBK   │ 0.53 │ 0.15 │ 0.29 │ 0.36 │ ✅                 │
│  │LL    │ 3.78 │13.32 │ 5.04 │ 8.56 │ ⚠️                 │
│  │LK    │21.93 │30.54 │17.48 │20.03 │ ❌                 │
│  └──────┴──────┴──────┴──────┴──────┘                    │
└────────────────────────────────────────────────────────────┘
```

---

## 🎬 Interactive Elements

### What You Can Click/Drag:
✅ Learning level buttons (1, 2, 3)
✅ Polynomial degree slider (1-7)
✅ Vehicle control sliders (steering, acceleration)
✅ Refreshing time slider (0.25-2.5s)
✅ MPC parameter sliders (Np, Nc, Ns)
✅ Cost function weight sliders
✅ Scenario buttons (Low/High speed)
✅ Simulation controls (Start/Pause/Reset)
✅ Playback speed (0.25x - 4x)
✅ Navigation menu (smooth scroll)
✅ Glossary tabs

### What Animates Automatically:
🎬 Hero vehicle driving on road
🎬 Rotating sphere casting shadow
🎬 Nonlinear ↔ Linear transformation
🎬 MPC prediction horizon moving
🎬 Three vehicles in simulation

---

## 📐 Mathematical Equations Rendered

All equations from the paper, beautifully rendered:

```
Koopman Operator:
  𝒦f(ξ(t), ζ(t)) = ∂f/∂ξ · dξ/dt = ∂f/∂ξ · F(ξ(t), ζ(t))

Bilinear Form:
  ξ̃̇ = Ãξ̃ + B̃ζ̃ + Σⱼ ξ̃ⱼÑⱼζ̃
       └────────┘   └──────────┘
        Linear    Control-affine
                   (KEY!)

Linearization:
  ξ̃̇ = Āξ̃ + B̄ζ̃ = Ãξ̃ + [B̃ + Σⱼ ξ̃ⱼ(0)Ñⱼ]ζ̃
                              └─────────┘
                         Freeze at t=0!

Cost Function:
  J = ∫[wδf δf² + wax ax² + wy εy² + wψ εψ²] dt
```

---

## 🎯 The "Aha!" Moment

When you run the **high-speed simulation**, you'll see:

1. **Blue (LL MPC)** crashes into obstacle → Standard linear models fail
2. **Orange (NL MPC)** succeeds but solves slowly → Nonlinear works but too slow
3. **Green (LBK MPC)** succeeds AND solves fast → Best of both worlds!

This visually proves the paper's contribution: **LBK captures the crucial control-affine dynamics that make the difference between success and failure at high speeds.**

---

To see all this in action, simply download the repository and open `index.html`!
