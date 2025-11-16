# Quick Start Guide - View the Demo Locally

## Method 1: Direct File Access (Easiest)

1. **Clone or download this repository** to your local machine
2. **Navigate to the folder** in your file explorer
3. **Double-click `index.html`** to open it in your web browser

That's it! No server needed - it runs entirely in the browser.

---

## Method 2: Using a Local Server (If needed)

If you want to run a local server on your machine:

### Python (if installed):
```bash
cd /path/to/test-1
python3 -m http.server 8080
```

Then open: http://localhost:8080/index.html

### Node.js (if installed):
```bash
cd /path/to/test-1
npx serve
```

### VS Code:
Install "Live Server" extension, right-click `index.html` → "Open with Live Server"

---

## What You'll Get

A fully interactive web interface with:
- ✅ Animated visualizations (no server needed - runs in browser)
- ✅ Interactive controls and simulations
- ✅ All equations rendered with KaTeX (loaded from CDN)
- ✅ Charts with Chart.js (loaded from CDN)
- ✅ Complete lane change simulation

---

## Files You Need (All Included)

```
index.html          ← Open this in your browser
styles/main.css
scripts/
  ├── main.js
  ├── vehicle-model.js
  ├── koopman-model.js
  ├── mpc-controller.js
  ├── simulation.js
  └── visualizations.js
data/
  └── paper124.pdf
```

All JavaScript dependencies (KaTeX, Chart.js) are loaded from CDN, so you just need these files!

---

## Browser Compatibility

Works best in:
- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari

Modern browsers with JavaScript enabled.

---

## Troubleshooting

**Math equations not rendering?**
- Make sure you have internet connection (KaTeX loads from CDN)
- Try refreshing the page

**Charts not showing?**
- Check internet connection (Chart.js loads from CDN)
- Check browser console for errors (F12)

**Animations not smooth?**
- Use a modern browser
- Close other tabs to free up resources

---

## Repository Location

This code is in the branch:
`claude/init-repo-setup-0112bNDEkCSMM5d6rfqLNWZ7`

To get it:
```bash
git clone <your-repo-url>
git checkout claude/init-repo-setup-0112bNDEkCSMM5d6rfqLNWZ7
cd test-1
# Now open index.html in your browser!
```
