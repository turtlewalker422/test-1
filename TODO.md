# TODO: Interactive Web Interface for Koopman Operator-Based Autonomous Driving MPC

## Paper Summary
**Title:** Autonomous Driving using Linear Model Predictive Control with a Koopman Operator based Bilinear Vehicle Model

**Core Topic:** This paper presents a real-time Model Predictive Control (MPC) system for autonomous vehicles that uses the Koopman operator to create a bilinear vehicle model. The approach bridges the gap between computationally expensive nonlinear MPC (accurate but slow) and standard linear MPC (fast but inaccurate), achieving near-nonlinear accuracy with linear computational efficiency.

**Key Innovation:** A linearized bilinear Koopman (LBK) model that captures control-affine dynamics (coupling between vehicle states and control inputs) - something traditional linear Koopman models miss.

---

## Phase 1: Foundation & Core Concepts Visualization

### 1.1 Landing Page & Navigation
- [ ] Create hero section with animated autonomous vehicle performing lane change
- [ ] Add interactive navigation menu with sections:
  - Introduction to the Problem
  - Understanding Koopman Operators
  - Vehicle Dynamics & Models
  - Model Predictive Control (MPC)
  - Interactive Simulations
  - Research Results
  - Try It Yourself

### 1.2 Problem Statement Section
- [ ] Visual comparison timeline showing evolution of autonomous driving control
- [ ] Interactive diagram explaining the "trilemma":
  - **Accuracy** (nonlinear models)
  - **Speed** (linear models)
  - **Real-time constraints** (critical for safety)
- [ ] Animated infographic showing where vehicles fail with different controllers
- [ ] Click-through scenarios demonstrating:
  - Low speed → all methods work
  - High speed → linear MPC fails, nonlinear too slow
  - Emergency maneuvers → need for better solution

### 1.3 Koopman Operator Explained (Progressive Complexity)
- [ ] **Level 1 (Beginner):** Simple analogy visualization
  - Use shadow metaphor: 2D nonlinear shadow → 3D linear object
  - Interactive 3D rotation showing how lifting reveals linear structure

- [ ] **Level 2 (Intermediate):** Mathematical intuition
  - Animated transformation: nonlinear spiral → linear trajectory in higher dimension
  - Interactive slider showing different "lifting functions"
  - Before/After comparison with real vehicle state evolution

- [ ] **Level 3 (Advanced):** Full mathematical framework
  - EDMD algorithm visualization
  - Basis function selector (polynomial degree 1-7)
  - Real-time error metrics display
  - Interactive equation explorer with LaTeX rendering

---

## Phase 2: Vehicle Dynamics & Model Comparison

### 2.1 Bicycle Model Visualization
- [ ] Interactive 3D vehicle model showing:
  - Center of gravity (CG)
  - Front/rear axles (Lf, Lr distances)
  - Tire forces (Fyf, Fyr) as vectors
  - Slip angles (αf, αr) highlighted

- [ ] State vector display with real-time updates:
  - x, y (global position) - animated on map
  - r (yaw rate) - rotating compass
  - v (lateral speed) - side arrow
  - ψ (yaw angle) - heading indicator
  - u (longitudinal speed) - forward arrow

- [ ] Control input visualization:
  - ax (longitudinal acceleration) - throttle/brake pedal
  - δf (steering angle) - animated steering wheel

### 2.2 Model Comparison Dashboard
- [ ] Four-panel comparison showing:
  1. **Locally Linear (LL)** - traditional Jacobian linearization
  2. **Linear Koopman (LK)** - standard Koopman without control-affine
  3. **Bilinear Koopman (BK)** - full bilinear with control-affine
  4. **Linearized Bilinear Koopman (LBK)** - the proposed method

- [ ] Interactive controls:
  - Polynomial degree selector (ρ = 1 to 7)
  - Refreshing time slider (0.25s to 2.5s)
  - Speed selector (low/medium/high)
  - Scenario complexity selector

- [ ] Real-time accuracy visualization:
  - RMSE graphs for each state variable
  - Color-coded trajectory comparison
  - Error heat map over time
  - Performance vs. complexity trade-off chart

### 2.3 Control-Affine Dynamics Demonstration
- [ ] Interactive visualization explaining control-affine terms
- [ ] Side-by-side comparison:
  - Without control-affine (LK model) - shows large errors
  - With control-affine (BK/LBK model) - shows accuracy
- [ ] Mathematical breakdown showing where coupling matters most
- [ ] Real vehicle scenario where this makes critical difference

---

## Phase 3: Model Predictive Control (MPC) Interactive

### 3.1 MPC Fundamentals
- [ ] Animated explanation of MPC concept:
  - Prediction horizon visualization
  - Control horizon overlay
  - Receding horizon principle animation
  - Constraint visualization (speed limits, steering limits, obstacles)

- [ ] Interactive MPC parameter tuner:
  - Prediction horizon (Np) slider: 1-5 seconds
  - Control horizon (Nc) slider: 0.1-1 second
  - Sampling time (Ns) slider: 0.05-0.2 seconds
  - Show effect on computation time and trajectory quality

### 3.2 Cost Function Builder
- [ ] Interactive weight adjustment for cost terms:
  - wδf (steering effort) - slider with real-time effect
  - wax (acceleration effort) - slider with real-time effect
  - wy (lane keeping error) - slider with real-time effect
  - wψ (heading error) - slider with real-time effect

- [ ] Live trajectory update as weights change
- [ ] Cost breakdown pie chart
- [ ] Trade-off visualizer (comfort vs. speed vs. safety)

### 3.3 Constraint Visualizer
- [ ] Interactive constraint editor:
  - Steering angle limits (-δfmax to δfmax)
  - Acceleration limits (axmin to axmax)
  - Speed limits (umin to umax)
  - Lane boundaries (ymin to ymax)
  - Heading constraints (ψmin to ψmax)

- [ ] "Drivable tube" concept visualization:
  - 3D tube showing safe corridor
  - Obstacle zones in red
  - Safe passages highlighted
  - Vehicle trajectory threading through

---

## Phase 4: Interactive Simulations & Scenarios

### 4.1 Lane Change Scenario Builder
- [ ] Drag-and-drop scenario editor:
  - Place obstacles at custom x positions
  - Set obstacle dimensions (width, length)
  - Define initial vehicle state (position, speed, heading)
  - Set target lane

- [ ] Pre-configured scenarios:
  - **Low Speed (15 m/s):** Three obstacles, gentle maneuver
  - **High Speed (26 m/s):** Three obstacles, aggressive maneuver
  - **Random Scenarios:** Latin hypercube sampling visualization
  - **Edge Cases:** Maximum speed scenarios

### 4.2 Real-Time Simulation Comparison
- [ ] Split-screen simultaneous simulation:
  - Nonlinear MPC (benchmark) - gold standard
  - LL MPC (traditional) - baseline
  - LBK MPC (proposed) - our method

- [ ] Live metrics dashboard:
  - Computational time per iteration
  - Total cost accumulated
  - Safety margin to obstacles
  - Success/failure indicator
  - Speed profile
  - Steering commands

- [ ] Playback controls:
  - Play/Pause
  - Speed adjustment (0.25x to 4x)
  - Step-by-step mode
  - Rewind/fast-forward

### 4.3 Statistical Analysis Viewer
- [ ] Results from 50 randomized scenarios:
  - Box plots showing cost distribution
  - Computation time comparison (bar chart)
  - Success rate percentages
  - Performance vs. speed correlation

- [ ] Interactive filtering:
  - Filter by speed range
  - Filter by obstacle configuration
  - Filter by success/failure
  - Highlight specific scenarios

---

## Phase 5: Deep Dive Technical Sections

### 5.1 Basis Function Explorer
- [ ] Polynomial basis function visualizer for degree ρ = 1 to 7
- [ ] Show number of basis functions vs. degree (Fig. 1 from paper)
- [ ] Interactive basis function composition:
  - Select which state variables to include
  - See resulting lifted space dimension
  - Understand computational trade-offs

### 5.2 EDMD Algorithm Walkthrough
- [ ] Step-by-step animated explanation:
  1. Generate training trajectories (show 5000 paths)
  2. Sample states and derivatives (ξ, ζ → p, q)
  3. Lift to higher dimension (Φ function)
  4. Linear regression (minimize ||KP - Q||)
  5. Extract Koopman operator K*

- [ ] Data collection visualization:
  - Random trajectory generator
  - Sampling strategy demonstration
  - Matrix assembly animation
  - Pseudo-inverse computation

### 5.3 Linearization Strategy Deep Dive
- [ ] Bilinear to linear transformation explanation:
  - Show bilinear term: Σ ξj(0) Nj ζ
  - Demonstrate "freezing" coupling states at t=0
  - Compare: full bilinear vs. linearized bilinear
  - Show when approximation breaks down

- [ ] Interactive horizon length tester:
  - Slider for receding horizon length
  - Show accuracy degradation over time
  - Explain why refreshing helps

---

## Phase 6: Educational & Engagement Features

### 6.1 Guided Learning Path
- [ ] Progressive tutorial system:
  - **Level 1:** "What is autonomous driving control?" (10 min)
  - **Level 2:** "Why do we need MPC?" (15 min)
  - **Level 3:** "Understanding the Koopman operator" (20 min)
  - **Level 4:** "Building the controller" (25 min)
  - **Level 5:** "Analyzing the results" (15 min)

- [ ] Knowledge check quizzes after each section
- [ ] Achievement badges for completion
- [ ] Certificate of completion (downloadable)

### 6.2 Interactive Glossary
- [ ] Hoverable terms throughout with pop-up definitions
- [ ] Key terms include:
  - Koopman operator, EDMD, DMD
  - Bilinear systems, control-affine dynamics
  - MPC, prediction horizon, receding horizon
  - Bicycle model, slip angle, cornering stiffness
  - Drivable tube, cost function, constraints
  - Lifting function, basis functions

### 6.3 "Try It Yourself" Sandbox
- [ ] Full parameter control sandbox:
  - Design your own scenario
  - Adjust all MPC parameters
  - Choose model type
  - Set initial conditions
  - Add custom obstacles

- [ ] Challenge modes:
  - "Beat the benchmark" - try to outperform NL MPC
  - "Fastest safe maneuver" - minimize time
  - "Smoothest ride" - minimize control effort
  - "Tight squeeze" - navigate narrow passages

### 6.4 Comparison Tools
- [ ] Before/After model comparison
- [ ] Side-by-side scenario runner
- [ ] Parameter sensitivity analyzer
- [ ] "What if?" scenario explorer

---

## Phase 7: Data Visualization & Results

### 7.1 Figure Reproductions (Interactive)
- [ ] **Figure 1:** Basis functions vs. degree (interactive bar chart)
- [ ] **Figure 2:** Normalized RMSE by state variable (animated line graph)
- [ ] **Figure 3:** NRMSE vs. refreshing time (multi-line interactive)
- [ ] **Figure 4:** Vehicle states comparison (synchronized plots)
- [ ] **Figure 5:** Low speed paths (animated trajectories)
- [ ] **Figure 6:** High speed paths (animated trajectories)
- [ ] **Figure 7:** Statistical analysis (interactive box plots)

### 7.2 Table Data Presentations
- [ ] **Table 1:** NRMSE values - sortable, filterable table
- [ ] **Table 2:** Scenario settings - interactive parameter display
- [ ] Heat map representations of performance data
- [ ] Export capabilities (CSV, JSON, images)

### 7.3 Performance Dashboard
- [ ] Real-time metrics:
  - Computational efficiency (solve time)
  - Trajectory cost comparison
  - Safety margin metrics
  - Model fidelity scores

- [ ] Historical performance tracking
- [ ] Comparison against benchmarks
- [ ] Statistical significance indicators

---

## Phase 8: Advanced Features

### 8.1 Code Playground
- [ ] Embedded code editor (Monaco/CodeMirror)
- [ ] Pre-loaded examples:
  - Bicycle model implementation
  - EDMD algorithm
  - MPC formulation
  - Koopman lifting functions

- [ ] Run simulations from custom code
- [ ] Visualize results in real-time
- [ ] Share code snippets

### 8.2 Data Download & API
- [ ] Download training data (5000 trajectories)
- [ ] Export simulation results
- [ ] API endpoints for:
  - Running simulations
  - Querying model parameters
  - Retrieving performance metrics

### 8.3 3D Visualization Mode
- [ ] Full 3D environment with:
  - Terrain/road surface
  - Vehicle model with suspension
  - Tire force vectors
  - Trajectory ribbon in 3D space
  - Camera controls (orbit, pan, zoom)

### 8.4 Mobile Responsiveness
- [ ] Touch-friendly controls for mobile
- [ ] Simplified views for small screens
- [ ] Swipe gestures for scenario navigation
- [ ] Responsive chart resizing

---

## Phase 9: Polish & User Experience

### 9.1 Visual Design System
- [ ] Color scheme:
  - Primary: Deep blue (engineering/trust)
  - Secondary: Bright cyan (technology/innovation)
  - Accent: Orange (attention/action)
  - Success: Green, Warning: Yellow, Error: Red

- [ ] Typography:
  - Headings: Modern sans-serif (Inter, Roboto)
  - Body: Readable sans-serif
  - Code: Monospace (Fira Code, JetBrains Mono)
  - Math: KaTeX/MathJax rendering

- [ ] Animations:
  - Smooth transitions (300ms ease-in-out)
  - Loading states with skeleton screens
  - Micro-interactions on buttons/controls
  - Physics-based vehicle animations

### 9.2 Accessibility
- [ ] WCAG 2.1 AA compliance
- [ ] Keyboard navigation throughout
- [ ] Screen reader support with ARIA labels
- [ ] High contrast mode option
- [ ] Font size adjustment controls
- [ ] Color-blind friendly palette options

### 9.3 Performance Optimization
- [ ] Lazy loading for heavy simulations
- [ ] Web Workers for computation-heavy tasks
- [ ] Canvas/WebGL for smooth animations
- [ ] Asset optimization (images, fonts)
- [ ] Code splitting for faster initial load

### 9.4 Help & Documentation
- [ ] Inline help tooltips
- [ ] Video tutorials embedded
- [ ] FAQ section
- [ ] "How to read this graph" guides
- [ ] Troubleshooting common issues

---

## Phase 10: Additional Resources & Extensions

### 10.1 Related Research
- [ ] Links to referenced papers with summaries
- [ ] Related work in autonomous driving
- [ ] Koopman operator applications beyond vehicles
- [ ] MPC variations and extensions

### 10.2 Further Learning
- [ ] Recommended textbooks
- [ ] Online courses
- [ ] Research groups and labs
- [ ] Conferences and workshops

### 10.3 Real-World Context
- [ ] How this fits in modern autonomous vehicles
- [ ] Industry applications (Tesla, Waymo, etc.)
- [ ] Regulatory considerations
- [ ] Future research directions

### 10.4 Citation & Credits
- [ ] Proper citation of the paper
- [ ] Author information and links
- [ ] Acknowledgments
- [ ] License information
- [ ] Source code repository link

---

## Technical Implementation Stack

### Frontend Framework
- **Core:** React or Vue.js for component architecture
- **3D Graphics:** Three.js for vehicle and environment visualization
- **Charts:** D3.js or Chart.js for data visualization
- **Math Rendering:** KaTeX or MathJax for equations
- **Animation:** GSAP or Framer Motion
- **State Management:** Redux or Zustand

### Simulation Engine
- **Physics:** Custom JavaScript implementation or port of Python simulation
- **Numerical Methods:** numeric.js or math.js for matrix operations
- **Optimization:** WebAssembly port of optimization libraries (optional)
- **Web Workers:** For heavy computational tasks

### Styling & UI
- **CSS Framework:** Tailwind CSS for utility-first styling
- **Component Library:** shadcn/ui or custom components
- **Icons:** Lucide React or Heroicons
- **Responsive Design:** Mobile-first approach

### Data & Assets
- **Data Format:** JSON for simulation parameters and results
- **Images:** SVG for diagrams, WebP for photos
- **Fonts:** Google Fonts or system fonts
- **3D Models:** GLTF/GLB format for vehicle models

---

## Success Metrics

### User Engagement
- [ ] Average time on site > 10 minutes
- [ ] Completion rate of guided tutorials > 60%
- [ ] Interaction rate with simulations > 80%
- [ ] Return visitor rate > 30%

### Educational Effectiveness
- [ ] Quiz scores improvement > 40%
- [ ] User comprehension survey scores > 4/5
- [ ] "Share" rate > 15%
- [ ] Positive feedback rate > 85%

### Technical Performance
- [ ] Page load time < 3 seconds
- [ ] Simulation FPS > 30
- [ ] Mobile performance score > 90
- [ ] Accessibility score > 95

---

## Timeline Estimate

- **Phase 1-2:** Foundation & Models (2 weeks)
- **Phase 3-4:** MPC & Simulations (2 weeks)
- **Phase 5-6:** Technical Deep Dives & Education (2 weeks)
- **Phase 7-8:** Visualizations & Advanced Features (1.5 weeks)
- **Phase 9-10:** Polish & Resources (1 week)

**Total:** ~8-9 weeks for full implementation

---

## Priority Levels

**P0 (Must Have):**
- Landing page with basic navigation
- Koopman operator explanation (Levels 1-2)
- Model comparison dashboard
- Lane change simulation (one scenario)
- Basic MPC parameter controls

**P1 (Should Have):**
- All interactive simulations
- Full scenario builder
- Statistical analysis viewer
- Guided learning path
- All figure reproductions

**P2 (Nice to Have):**
- Code playground
- 3D visualization mode
- Advanced customization
- Data export/API
- Achievement system

**P3 (Future Enhancement):**
- Multi-language support
- User accounts and saved scenarios
- Community sharing features
- AR/VR exploration modes
- Real vehicle integration demos
