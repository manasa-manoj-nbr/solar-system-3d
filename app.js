class SolarSystemSimulation {
    constructor() {
        // Core Three.js components
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.clock = new THREE.Clock();
        
        // Solar system objects
        this.sun = null;
        this.planets = [];
        this.planetMeshes = [];
        this.planetGroups = [];
        this.starField = null;
        
        // Animation state
        this.isAnimating = true;
        this.masterSpeed = 1.0;
        this.planetSpeeds = {};
        
        // UI elements
        this.tooltip = null;
        this.controlPanel = null;
        this.isPanelCollapsed = false;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        
        // Planet data with realistic scaling
        this.planetData = [
            { name: "Mercury", radius: 0.38, distance: 6, orbitalPeriod: 88, rotationSpeed: 0.1, color: "#8C7853" },
            { name: "Venus", radius: 0.95, distance: 8, orbitalPeriod: 225, rotationSpeed: 0.05, color: "#FFC649" },
            { name: "Earth", radius: 1.0, distance: 10, orbitalPeriod: 365, rotationSpeed: 0.1, color: "#6B93D6" },
            { name: "Mars", radius: 0.53, distance: 12, orbitalPeriod: 687, rotationSpeed: 0.1, color: "#CD5C5C" },
            { name: "Jupiter", radius: 2.0, distance: 16, orbitalPeriod: 4333, rotationSpeed: 0.2, color: "#D8CA9D" },
            { name: "Saturn", radius: 1.8, distance: 20, orbitalPeriod: 10759, rotationSpeed: 0.18, color: "#FAD5A5", hasRings: true },
            { name: "Uranus", radius: 1.2, distance: 25, orbitalPeriod: 30687, rotationSpeed: 0.12, color: "#4FD0E3" },
            { name: "Neptune", radius: 1.1, distance: 30, orbitalPeriod: 60190, rotationSpeed: 0.11, color: "#4B70DD" }
        ];
        
        this.sunData = { radius: 2.5, color: "#FDB813" };
        
        // Initialize the simulation
        this.init();
    }
    
    async init() {
        try {
            await this.setupScene();
            await this.setupLights();
            await this.setupCamera();
            await this.setupRenderer();
            await this.setupControls();
            
            await this.createSolarSystem();
            await this.createStarField();
            
            this.setupUI();
            this.setupEventListeners();
            
            // Start animation
            this.startAnimation();
            this.hideLoadingScreen();
            
            console.log('Solar system initialized successfully');
        } catch (error) {
            console.error('Failed to initialize solar system:', error);
        }
    }
    
    async setupScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000011);
    }
    
    async setupLights() {
        // Ambient light for overall illumination
        const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
        this.scene.add(ambientLight);
        
        // Point light from the sun
        const sunLight = new THREE.PointLight(0xffffff, 1.5, 100);
        sunLight.position.set(0, 0, 0);
        this.scene.add(sunLight);
        
        // Directional light for better planet visibility
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
        directionalLight.position.set(10, 10, 5);
        this.scene.add(directionalLight);
    }
    
    async setupCamera() {
        const aspect = window.innerWidth / window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);
        this.camera.position.set(0, 25, 50);
        this.camera.lookAt(0, 0, 0);
    }
    
    async setupRenderer() {
        const canvas = document.getElementById('solar-system-canvas');
        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: true
        });
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }
    
    async setupControls() {
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.minDistance = 5;
        this.controls.maxDistance = 100;
        this.controls.enablePan = true;
        this.controls.autoRotate = false;
    }
    
    async createSolarSystem() {
        // Create the Sun first
        await this.createSun();
        
        // Create planets
        for (let i = 0; i < this.planetData.length; i++) {
            await this.createPlanet(this.planetData[i], i);
        }
        
        console.log('Created', this.planets.length, 'planets');
    }
    
    async createSun() {
        const geometry = new THREE.SphereGeometry(this.sunData.radius, 32, 32);
        const material = new THREE.MeshBasicMaterial({
            color: this.sunData.color,
            emissive: this.sunData.color,
            emissiveIntensity: 0.2
        });
        
        this.sun = new THREE.Mesh(geometry, material);
        this.sun.userData = { 
            name: 'Sun', 
            type: 'sun',
            info: 'The center of our solar system - a massive ball of hot plasma'
        };
        this.scene.add(this.sun);
        
        // Add sun glow effect
        const glowGeometry = new THREE.SphereGeometry(this.sunData.radius * 1.2, 32, 32);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: this.sunData.color,
            transparent: true,
            opacity: 0.1
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        this.scene.add(glow);
        
        console.log('Sun created');
    }
    
    async createPlanet(planetInfo, index) {
        // Create planet group for orbit
        const planetGroup = new THREE.Group();
        this.scene.add(planetGroup);
        
        // Create planet mesh
        const geometry = new THREE.SphereGeometry(planetInfo.radius, 24, 24);
        const material = new THREE.MeshPhongMaterial({
            color: planetInfo.color,
            shininess: 30
        });
        
        const planet = new THREE.Mesh(geometry, material);
        planet.position.x = planetInfo.distance;
        planet.userData = {
            name: planetInfo.name,
            type: 'planet',
            info: `Distance: ${planetInfo.distance} units, Orbital Period: ${planetInfo.orbitalPeriod} Earth days`,
            originalSpeed: 1.0
        };
        
        planetGroup.add(planet);
        
        // Create Saturn's rings
        if (planetInfo.hasRings) {
            this.createSaturnRings(planet, planetInfo.radius);
        }
        
        // Store references
        this.planetGroups.push(planetGroup);
        this.planetMeshes.push(planet);
        this.planets.push({
            group: planetGroup,
            mesh: planet,
            data: planetInfo,
            angle: Math.random() * Math.PI * 2,
            speed: 1.0
        });
        
        // Initialize planet speed
        this.planetSpeeds[planetInfo.name] = 1.0;
        
        console.log('Created planet:', planetInfo.name);
    }
    
    createSaturnRings(planet, planetRadius) {
        const ringGeometry = new THREE.RingGeometry(planetRadius * 1.2, planetRadius * 1.8, 32);
        const ringMaterial = new THREE.MeshPhongMaterial({
            color: 0xcccccc,
            transparent: true,
            opacity: 0.5,
            side: THREE.DoubleSide
        });
        
        const rings = new THREE.Mesh(ringGeometry, ringMaterial);
        rings.rotation.x = Math.PI / 2;
        rings.rotation.z = Math.PI / 6; // Tilt the rings
        planet.add(rings);
    }
    
    async createStarField() {
        const starsGeometry = new THREE.BufferGeometry();
        const starsCount = 1000;
        const positions = new Float32Array(starsCount * 3);
        
        for (let i = 0; i < starsCount * 3; i++) {
            positions[i] = (Math.random() - 0.5) * 200;
        }
        
        starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const starsMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.5,
            sizeAttenuation: false
        });
        
        this.starField = new THREE.Points(starsGeometry, starsMaterial);
        this.scene.add(this.starField);
        
        console.log('Star field created');
    }
    
    setupUI() {
        this.tooltip = document.getElementById('planet-tooltip');
        this.setupControlPanel();
        this.setupMouseEvents();
    }
    
    setupControlPanel() {
        const planetControlsContainer = document.getElementById('planet-controls');
        
        // Create controls for each planet
        this.planetData.forEach(planet => {
            const controlDiv = document.createElement('div');
            controlDiv.className = 'planet-control';
            controlDiv.innerHTML = `
                <div class="planet-control-header">
                    <span class="planet-color" style="background-color: ${planet.color}"></span>
                    <span class="form-label">${planet.name}</span>
                    <span class="speed-value" id="${planet.name.toLowerCase()}-speed">1.0x</span>
                </div>
                <input type="range" class="speed-slider" id="${planet.name.toLowerCase()}-slider" 
                       min="0" max="5" step="0.1" value="1" data-planet="${planet.name}">
            `;
            planetControlsContainer.appendChild(controlDiv);
            
            // Add event listener for this planet's slider
            const slider = controlDiv.querySelector('.speed-slider');
            slider.addEventListener('input', (e) => {
                const speed = parseFloat(e.target.value);
                this.planetSpeeds[planet.name] = speed;
                document.getElementById(`${planet.name.toLowerCase()}-speed`).textContent = `${speed.toFixed(1)}x`;
                console.log(`${planet.name} speed set to ${speed}x`);
            });
        });
    }
    
    setupEventListeners() {
        // Master controls
        document.getElementById('pause-resume').addEventListener('click', () => {
            this.isAnimating = !this.isAnimating;
            document.getElementById('pause-resume').textContent = this.isAnimating ? 'Pause' : 'Resume';
            console.log('Animation', this.isAnimating ? 'resumed' : 'paused');
        });
        
        document.getElementById('reset-speeds').addEventListener('click', () => {
            this.resetAllSpeeds();
        });
        
        document.getElementById('master-speed').addEventListener('input', (e) => {
            this.masterSpeed = parseFloat(e.target.value);
            document.getElementById('master-speed-value').textContent = `${this.masterSpeed.toFixed(1)}x`;
            console.log('Master speed set to', this.masterSpeed);
        });
        
        document.getElementById('reset-camera').addEventListener('click', () => {
            this.resetCamera();
        });
        
        document.getElementById('panel-toggle').addEventListener('click', () => {
            this.togglePanel();
        });
        
        // Window resize
        window.addEventListener('resize', () => {
            this.onWindowResize();
        });
    }
    
    setupMouseEvents() {
        const canvas = this.renderer.domElement;
        
        const onMouseMove = (event) => {
            if (!this.controls.enabled) return;
            
            // Calculate mouse position in normalized device coordinates
            const rect = canvas.getBoundingClientRect();
            this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
            
            // Update the raycaster
            this.raycaster.setFromCamera(this.mouse, this.camera);
            
            // Check for intersections with all celestial bodies
            const intersects = this.raycaster.intersectObjects([this.sun, ...this.planetMeshes]);
            
            if (intersects.length > 0) {
                const object = intersects[0].object;
                this.showTooltip(event, object.userData);
                canvas.style.cursor = 'pointer';
            } else {
                this.hideTooltip();
                canvas.style.cursor = 'grab';
            }
        };
        
        canvas.addEventListener('mousemove', onMouseMove);
        canvas.addEventListener('mouseleave', () => {
            this.hideTooltip();
            canvas.style.cursor = 'default';
        });
    }
    
    showTooltip(event, userData) {
        const tooltip = this.tooltip;
        const nameElement = document.getElementById('tooltip-name');
        const infoElement = document.getElementById('tooltip-info');
        
        nameElement.textContent = userData.name;
        infoElement.textContent = userData.info || 'No additional information';
        
        // Position tooltip relative to canvas
        const rect = this.renderer.domElement.getBoundingClientRect();
        tooltip.style.left = (event.clientX - rect.left + 10) + 'px';
        tooltip.style.top = (event.clientY - rect.top - 10) + 'px';
        tooltip.classList.remove('hidden');
    }
    
    hideTooltip() {
        this.tooltip.classList.add('hidden');
    }
    
    resetAllSpeeds() {
        this.masterSpeed = 1.0;
        document.getElementById('master-speed').value = 1.0;
        document.getElementById('master-speed-value').textContent = '1.0x';
        
        this.planetData.forEach(planet => {
            this.planetSpeeds[planet.name] = 1.0;
            document.getElementById(`${planet.name.toLowerCase()}-slider`).value = 1.0;
            document.getElementById(`${planet.name.toLowerCase()}-speed`).textContent = '1.0x';
        });
        
        console.log('All speeds reset to 1.0x');
    }
    
    resetCamera() {
        this.camera.position.set(0, 25, 50);
        this.controls.target.set(0, 0, 0);
        this.controls.update();
        console.log('Camera reset to default position');
    }
    
    togglePanel() {
        this.isPanelCollapsed = !this.isPanelCollapsed;
        document.body.classList.toggle('panel-collapsed', this.isPanelCollapsed);
        document.getElementById('panel-toggle').textContent = this.isPanelCollapsed ? 'Show' : 'Hide';
    }
    
    startAnimation() {
        console.log('Starting animation loop');
        this.animate();
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        const delta = this.clock.getDelta();
        
        if (this.isAnimating) {
            this.updateAnimation(delta);
        }
        
        if (this.controls) {
            this.controls.update();
        }
        
        this.renderer.render(this.scene, this.camera);
    }
    
    updateAnimation(delta) {
        // Rotate the sun
        if (this.sun) {
            this.sun.rotation.y += delta * 0.2;
        }
        
        // Update planets
        this.planets.forEach((planetObj, index) => {
            const planet = planetObj.data;
            const group = planetObj.group;
            const mesh = planetObj.mesh;
            
            // Calculate orbital speed (faster for inner planets)
            const baseOrbitalSpeed = 0.5 / Math.sqrt(planet.distance); // Kepler's law approximation
            const currentSpeed = this.planetSpeeds[planet.name] * this.masterSpeed;
            const orbitalSpeed = baseOrbitalSpeed * currentSpeed * delta;
            
            // Update orbital position
            planetObj.angle += orbitalSpeed;
            group.rotation.y = planetObj.angle;
            
            // Rotate planet on its axis
            mesh.rotation.y += planet.rotationSpeed * delta * currentSpeed * 5;
        });
        
        // Rotate star field slowly
        if (this.starField) {
            this.starField.rotation.y += delta * 0.001;
        }
    }
    
    onWindowResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
        
        console.log('Window resized to', width, 'x', height);
    }
    
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                console.log('Loading screen hidden');
            }, 500);
        }, 1000);
    }
}

// Initialize the solar system when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing solar system...');
    const solarSystem = new SolarSystemSimulation();
});

// Handle page visibility changes for performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('Page hidden - animation will continue but may slow down');
    } else {
        console.log('Page visible - animation resumed at full speed');
    }
});