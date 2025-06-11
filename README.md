# 🌌 3D Solar System Simulation

link (https://solar-system-3d-xi.vercel.app/)

A stunning interactive 3D Solar System built with **Three.js**, demonstrating advanced front-end development skills including real-time animation, 3D transformations, and responsive UI design.

---

## 🚀 Features

### ✨ Core Simulation
- **Full Solar System**: Sun + 8 planets (Mercury to Neptune)
- **Realistic Scale**: Sizes and distances based on astronomical data
- **Orbital Mechanics**: Planets orbit the Sun with accurate relative speeds
- **Planet Rotation**: Each planet spins on its own axis
- **Saturn’s Rings**: Accurate and dynamic ring system
- **Starfield**: 1000+ dynamic stars to simulate deep space

### 🎮 Interactive Controls
- 🎚 **Speed Sliders**: Adjust orbital speed of each planet (0–5x)
- 🚀 **Master Speed Control**: Adjust entire simulation speed
- ⏸️ **Pause / Resume**: Toggle animation playback
- 🔄 **Reset**: Reset all speeds to default values
- 🛰️ **Camera**: Orbit, zoom, and pan the 3D scene

### 📱 Responsive User Experience
- ✅ **Mobile-Friendly**: Works seamlessly across all screen sizes
- ℹ️ **Planet Tooltips**: Hover/click to view planet info
- ⚡ **Smooth Animations**: Delta time ensures 60fps performance
- ⏳ **Loading Screen**: Modern and responsive loading UX

---

## 🛠️ Technologies Used

- [Three.js](https://threejs.org/) – 3D rendering and graphics
- **Vanilla JavaScript** – No frameworks used
- **HTML5 + CSS3** – Semantic markup and responsive design

---
### Key Components
-	Scene Setup: Camera, lighting, and renderer configuration
-	Solar System Creation: Procedural planet and orbit generation
-	Animation System: Frame-rate independent timing using THREE.Clock
- Control System: UI integration with 3D animation
- Interaction System: Mouse/touch handling for camera and tooltips
---

### Project Structure

```
solar-system-3d/
├── index.html      # Main HTML structure
├── style.css       # Complete styling and responsive design
├── app.js          # Core Three.js application logic
└── README.md       # This documentation
```

---

## ✨ Code Highlights
```javascript
1. 🌍 Planetary Orbit System
const planetGroup = new THREE.Group();
const planet = createPlanet(planetData);
planetGroup.add(planet);

const orbitalSpeed = (2 * Math.PI) / (planetData.orbitalPeriod * 0.01);
planetGroup.rotation.y += orbitalSpeed * deltaTime * currentSpeed;


// Orbital animation with realistic timing
const orbitalSpeed = (2 * Math.PI) / (planetData.orbitalPeriod * 0.01);
planetGroup.rotation.y += orbitalSpeed * deltaTime * currentSpeed;

2. Speed Control Implementation
updatePlanetSpeed(planetName, speed) {
    this.planetSpeeds[planetName] = speed;
    // Real-time speed adjustment without animation interruption
}

3. Responsive Camera Setup
handleResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
}

```
---
### Controls
- Mouse/Touch: Rotate and zoom camera view
- Speed Sliders: Adjust individual planet orbital speeds
- Pause Button: Stop/start all animations
- Reset Button: Restore default speeds
- Panel Toggle: Show/hide control panel
---
### Programming Concepts Showcased
-	3D mathematics and transformations
-	Real-time animation and rendering
-	Event-driven architecture
-	Responsive web design
-	Performance optimization
---
### Assignment Compliance
This project fulfills all requirements of the frontend developer assignment:
- 3D Solar System: Complete implementation with Sun and 8 planets
- Speed Controls: Individual planet speed adjustment in real-time
- Responsive Design: Works on mobile and desktop
- Three.js Usage: Pure Three.js implementation without CSS animations
- Interactive Features: Camera controls, tooltips, and UI integration
- Professional Code: Clean, commented, and well-structured
- Bonus Features: Pause/resume, background stars, responsive UI
---
### Conclusion
This 3D Solar System Simulation demonstrates advanced frontend development capabilities, combining 3D graphics programming, user interface design, and astronomical accuracy into a polished, interactive experience. The code is production-ready and showcases modern web development best practices.
