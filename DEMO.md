# 🚗 Interactive Koopman MPC Demo

## Quick Start

The web server is running! Access the interactive interface at:

**http://localhost:8080/index.html**

Simply open this URL in your web browser.

---

## What to Explore

### 1. **Hero Section** (Top)
- Watch the animated vehicle driving on the road
- See the problem trilemma: Accuracy vs Speed vs Real-time
- Click "Start Interactive Tour" for guided experience

### 2. **The Challenge Section**
- Hover over the three cards (Accuracy, Speed, Solution)
- See the performance comparison chart
- Notice how LBK MPC is the sweet spot (14ms - near-NL accuracy)

### 3. **Koopman Operator Section** ⭐
**Try this:** Click the learning level buttons (1, 2, 3)
- **Level 1 - Intuition:** Watch the rotating sphere casting a shadow
  - The shadow (2D) moves nonlinearly
  - The sphere (3D) rotates linearly
  - This is the Koopman concept!

- **Level 2 - Visual:**
  - See the nonlinear trajectory become linear when lifted
  - Drag the polynomial degree slider (ρ: 1-7)
  - Watch the basis function count change: 6→16→36→71→127→211→331
  - See accuracy vs computation trade-off

- **Level 3 - Mathematical:**
  - Full EDMD algorithm with 5 steps
  - All equations from the paper

### 4. **Vehicle Dynamics Section**
**Try this:** Adjust the control sliders
- Move the "ax (accel)" slider → see the vehicle respond
- Move the "δf (steer)" slider → see the steering angle and tire forces
- Watch the tire force vectors appear!

**Model Comparison:**
- Set refreshing time (0.25s to 2.5s)
- Click "Run Comparison"
- See RMSE values for all 4 models:
  - BK (Bilinear Koopman) - green = good
  - LBK (Linearized Bilinear) - green = good
  - LK (Linear Koopman) - red = bad
  - LL (Locally Linearized) - orange = moderate

### 5. **MPC Section**
- Watch the animated prediction horizon visualization
- Adjust MPC parameters (Np, Nc, Ns) with sliders
- Tune cost function weights:
  - Steering effort
  - Acceleration effort
  - Lane keeping
  - Heading error

### 6. **Interactive Simulation** 🎮 ⭐⭐⭐
**This is the main attraction!**

**Setup:**
1. Choose scenario: "Low Speed (15 m/s)" or "High Speed (26 m/s)"
2. Select controllers to compare:
   - ☑ Nonlinear MPC (NL) - gold standard
   - ☑ LBK MPC (Proposed) - our method
   - ☑ Linear MPC (LL) - baseline

3. Adjust playback speed (0.25x to 4x)

4. Click **"▶ Start Simulation"**

**Watch:**
- Three vehicles performing lane changes simultaneously
- Avoiding obstacles (red zones)
- Real-time metrics updating:
  - NL MPC: ~133ms solve time
  - LBK MPC: ~14ms solve time
  - LL MPC: ~4ms solve time

**Key Observation:**
- At **low speed**: All three succeed
- At **high speed**: LL MPC fails (hits obstacle!), while NL and LBK succeed

**This demonstrates the paper's key finding:** LBK MPC achieves near-nonlinear accuracy with linear computational speed!

### 7. **Research Results Section**
- See the statistical analysis from 50 scenarios
- Interactive charts showing:
  - High speed performance (LBK only 3.7% worse than NL, LL is 19.5% worse)
  - Computation time (LBK is 9.5x faster than NL)
- Fidelity comparison table with actual RMSE values from the paper

### 8. **Glossary Section**
- Click between "Key Terms" and "References" tabs
- Hover over glossary cards
- Read definitions of technical terms

---

## Cool Interactive Features

### Animations to Watch
1. **Hero vehicle** - continuously driving
2. **Shadow sphere** - rotating and casting shadow
3. **Lifting demo** - nonlinear ↔ linear transformation
4. **MPC horizon** - moving prediction window
5. **Simulation** - three vehicles racing through obstacles

### Things to Click/Drag
- ✅ All sliders (polynomial degree, control inputs, MPC parameters, weights)
- ✅ Scenario buttons
- ✅ Learning level buttons (1, 2, 3)
- ✅ Glossary tabs
- ✅ Navigation menu (smooth scroll to sections)
- ✅ Simulation controls (start, pause, reset)

### Best Demo Flow (5 minutes)

1. **Start at top** - scroll down to see overview
2. **Jump to Koopman section** - click Level 1, then Level 2
   - Drag polynomial degree slider
   - Watch the analogy animations
3. **Vehicle section** - move the steering slider
   - See tire forces appear
   - Run model comparison
4. **Simulation** - the grand finale!
   - Select "High Speed (26 m/s)"
   - Enable all three controllers
   - Click Start
   - Watch LL MPC fail while LBK succeeds
5. **Results** - see the statistical proof

---

## Technical Notes

- **No installation needed** - pure HTML/CSS/JavaScript
- **CDN dependencies** - KaTeX for math, Chart.js for graphs
- **Responsive** - works on mobile, tablet, desktop
- **Print-friendly** - try Print Preview!

---

## Paper Data Integrated

All data from the paper is accurately represented:
- ✅ Figure 1: Basis function counts [6, 16, 36, 71, 127, 211, 331]
- ✅ Table 1: RMSE values at different refresh times
- ✅ Figure 7: Statistical performance data
- ✅ All equations with proper LaTeX rendering

---

## Questions to Explore

While exploring, ask yourself:
- Why does the shadow analogy help understand Koopman operators?
- What happens to accuracy when polynomial degree is too high? (overfitting!)
- Why does LL MPC fail at high speeds?
- How does LBK capture control-affine dynamics?
- What's the trade-off in the cost function weights?

Enjoy the demo! 🎉
