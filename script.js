const { useEffect, useRef, useState } = React;

function EarthMap() {
    const containerRef = useRef(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const rendererRef = useRef(null);
    const globeRef = useRef(null);
    const [zoom, setZoom] = useState(1);
    const isDragging = useRef(false);
    const previousMousePosition = useRef({ x: 0, y: 0 });
    const rotationRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        // Initialize Three.js scene
        const scene = new THREE.Scene();
        sceneRef.current = scene;

        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;

        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 10000);
        camera.position.z = 2.5;
        cameraRef.current = camera;

        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            precision: 'highp',
            powerPreference: 'high-performance'
        });
        
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setClearColor(0x000814, 1);
        renderer.shadowMap.enabled = true;
        rendererRef.current = renderer;
        
        containerRef.current.appendChild(renderer.domElement);

        // Create Earth sphere with texture
        const geometry = new THREE.SphereGeometry(1, 128, 128);

        // Create detailed Earth texture
        const canvas = document.createElement('canvas');
        canvas.width = 4096;
        canvas.height = 2048;
        const ctx = canvas.getContext('2d');

        // Ocean base
        ctx.fillStyle = '#0d47a1';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Continents with gradient
        ctx.fillStyle = '#2e7d32';
        
        // Add continents (simplified world map)
        const continents = [
            // North America
            { x: 200, y: 300, w: 500, h: 400 },
            // South America
            { x: 400, y: 700, w: 300, h: 400 },
            // Europe & Africa
            { x: 1100, y: 200, w: 600, h: 800 },
            // Asia
            { x: 1800, y: 250, w: 1000, h: 500 },
            // Australia
            { x: 2200, y: 1200, w: 300, h: 250 },
            // Antarctica
            { x: 0, y: 1800, w: canvas.width, h: 248 }
        ];

        continents.forEach(cont => {
            ctx.fillRect(cont.x, cont.y, cont.w, cont.h);
        });

        // Add grid lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;

        // Latitude lines
        for (let i = 0; i <= 18; i++) {
            const y = i * canvas.height / 18;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }

        // Longitude lines
        for (let i = 0; i <= 36; i++) {
            const x = i * canvas.width / 36;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }

        // Add clouds effect
        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        for (let i = 0; i < 30; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const size = Math.random() * 100 + 50;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }

        const texture = new THREE.CanvasTexture(canvas);
        texture.anisotropy = renderer.capabilities.maxAnisotropy;

        const material = new THREE.MeshStandardMaterial({
            map: texture,
            roughness: 0.8,
            metalness: 0.1,
            emissive: 0x1a3a52,
            emissiveIntensity: 0.2
        });

        const globe = new THREE.Mesh(geometry, material);
        globeRef.current = globe;
        globe.castShadow = true;
        globe.receiveShadow = true;
        scene.add(globe);

        // Create atmosphere glow
        const atmosphereGeometry = new THREE.SphereGeometry(1.05, 64, 64);
        const atmosphereMaterial = new THREE.MeshPhongMaterial({
            color: 0x4da6ff,
            emissive: 0x003d82,
            emissiveIntensity: 0.2,
            transparent: true,
            opacity: 0.1,
            side: THREE.BackSide
        });
        const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
        scene.add(atmosphere);

        // Add stars background
        const starsGeometry = new THREE.BufferGeometry();
        const starsMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.08,
            sizeAttenuation: true
        });

        const starsPositions = new Float32Array();
        for (let i = 0; i < 2000; i++) {
            const x = (Math.random() - 0.5) * 200;
            const y = (Math.random() - 0.5) * 200;
            const z = (Math.random() - 0.5) * 200;
            starsPositions.push(x, y, z);
        }

        starsGeometry.setAttribute('position', new THREE.BufferAttribute(starsPositions, 3));
        const stars = new THREE.Points(starsGeometry, starsMaterial);
        scene.add(stars);

        // Lighting setup
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 3, 5);
        directionalLight.castShadow = true;
        scene.add(directionalLight);

        const pointLight = new THREE.PointLight(0x4da6ff, 0.3);
        pointLight.position.set(-5, -3, -5);
        scene.add(pointLight);

        // Mouse event handlers
        const onMouseDown = (e) => {
            isDragging.current = true;
            previousMousePosition.current = { x: e.clientX, y: e.clientY };
        };

        const onMouseMove = (e) => {
            if (!isDragging.current) return;

            const deltaX = e.clientX - previousMousePosition.current.x;
            const deltaY = e.clientY - previousMousePosition.current.y;

            rotationRef.current.y += deltaX * 0.005;
            rotationRef.current.x += deltaY * 0.005;

            rotationRef.current.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, rotationRef.current.x));

            globe.rotation.y = rotationRef.current.y;
            globe.rotation.x = rotationRef.current.x;
            atmosphere.rotation.copy(globe.rotation);

            previousMousePosition.current = { x: e.clientX, y: e.clientY };
        };

        const onMouseUp = () => {
            isDragging.current = false;
        };

        const onMouseWheel = (e) => {
            e.preventDefault();
            const zoomSpeed = 0.1;
            const newZoom = zoom + (e.deltaY > 0 ? zoomSpeed : -zoomSpeed);
            const constrainedZoom = Math.max(0.5, Math.min(3, newZoom));
            setZoom(constrainedZoom);
        };

        // Touch support
        let touchStartDistance = 0;
        
        const onTouchStart = (e) => {
            if (e.touches.length === 2) {
                const dx = e.touches[0].clientX - e.touches[1].clientX;
                const dy = e.touches[0].clientY - e.touches[1].clientY;
                touchStartDistance = Math.sqrt(dx * dx + dy * dy);
            } else if (e.touches.length === 1) {
                isDragging.current = true;
                previousMousePosition.current = { 
                    x: e.touches[0].clientX, 
                    y: e.touches[0].clientY 
                };
            }
        };

        const onTouchMove = (e) => {
            if (e.touches.length === 2) {
                const dx = e.touches[0].clientX - e.touches[1].clientX;
                const dy = e.touches[0].clientY - e.touches[1].clientY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const delta = distance - touchStartDistance;
                
                const zoomSpeed = 0.1;
                const newZoom = zoom + (delta > 0 ? -zoomSpeed : zoomSpeed);
                const constrainedZoom = Math.max(0.5, Math.min(3, newZoom));
                setZoom(constrainedZoom);
                
                touchStartDistance = distance;
            } else if (e.touches.length === 1 && isDragging.current) {
                const deltaX = e.touches[0].clientX - previousMousePosition.current.x;
                const deltaY = e.touches[0].clientY - previousMousePosition.current.y;

                rotationRef.current.y += deltaX * 0.005;
                rotationRef.current.x += deltaY * 0.005;

                rotationRef.current.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, rotationRef.current.x));

                globe.rotation.y = rotationRef.current.y;
                globe.rotation.x = rotationRef.current.x;
                atmosphere.rotation.copy(globe.rotation);

                previousMousePosition.current = { 
                    x: e.touches[0].clientX, 
                    y: e.touches[0].clientY 
                };
            }
        };

        const onTouchEnd = () => {
            isDragging.current = false;
        };

        // Event listeners
        renderer.domElement.addEventListener('mousedown', onMouseDown);
        renderer.domElement.addEventListener('mousemove', onMouseMove);
        renderer.domElement.addEventListener('mouseup', onMouseUp);
        renderer.domElement.addEventListener('wheel', onMouseWheel, { passive: false });
        renderer.domElement.addEventListener('touchstart', onTouchStart, { passive: false });
        renderer.domElement.addEventListener('touchmove', onTouchMove, { passive: false });
        renderer.domElement.addEventListener('touchend', onTouchEnd);

        // Window resize handler
        const handleResize = () => {
            const newWidth = containerRef.current.clientWidth;
            const newHeight = containerRef.current.clientHeight;
            
            camera.aspect = newWidth / newHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(newWidth, newHeight);
        };

        window.addEventListener('resize', handleResize);

        // Animation loop
        let animationId;
        const animate = () => {
            animationId = requestAnimationFrame(animate);

            // Auto-rotate when not dragging
            if (!isDragging.current) {
                rotationRef.current.y += 0.0001;
                globe.rotation.y = rotationRef.current.y;
                atmosphere.rotation.y = rotationRef.current.y;
            }

            // Update camera zoom
            camera.position.z = 2.5 / zoom;

            renderer.render(scene, camera);
        };

        animate();

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            renderer.domElement.removeEventListener('mousedown', onMouseDown);
            renderer.domElement.removeEventListener('mousemove', onMouseMove);
            renderer.domElement.removeEventListener('mouseup', onMouseUp);
            renderer.domElement.removeEventListener('wheel', onMouseWheel);
            renderer.domElement.removeEventListener('touchstart', onTouchStart);
            renderer.domElement.removeEventListener('touchmove', onTouchMove);
            renderer.domElement.removeEventListener('touchend', onTouchEnd);
            
            cancelAnimationFrame(animationId);
            
            geometry.dispose();
            material.dispose();
            starsGeometry.dispose();
            starsMaterial.dispose();
            atmosphereGeometry.dispose();
            atmosphereMaterial.dispose();
            renderer.dispose();
            
            if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
                containerRef.current.removeChild(renderer.domElement);
            }
        };
    }, [zoom]);

    return (
        <div style={{
            width: '100vw',
            height: '100vh',
            margin: 0,
            padding: 0,
            overflow: 'hidden',
            backgroundColor: '#000814',
            fontFamily: "'Inter', system-ui, sans-serif"
        }}>
            {/* Canvas Container */}
            <div
                ref={containerRef}
                style={{
                    width: '100%',
                    height: '100%',
                    position: 'relative'
                }}
            />

            {/* UI Overlay */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                pointerEvents: 'none'
            }}>
                {/* Header */}
                <div style={{
                    position: 'absolute',
                    top: 30,
                    left: 30,
                    color: '#ffffff',
                    zIndex: 10,
                    pointerEvents: 'auto'
                }}>
                    <h1 style={{
                        margin: 0,
                        fontSize: '32px',
                        fontWeight: 700,
                        letterSpacing: '-0.5px',
                        textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                    }}>
                        🌍 Earth Map
                    </h1>
                    <p style={{
                        margin: '8px 0 0 0',
                        fontSize: '14px',
                        color: '#94a3b8',
                        fontWeight: 400
                    }}>
                        Interactive 3D Globe Explorer
                    </p>
                </div>

                {/* Control Panel */}
                <div style={{
                    position: 'absolute',
                    bottom: 30,
                    left: 30,
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(148, 163, 184, 0.2)',
                    borderRadius: '12px',
                    padding: '20px',
                    color: '#ffffff',
                    maxWidth: '300px',
                    zIndex: 10,
                    pointerEvents: 'auto'
                }}>
                    <h3 style={{
                        margin: '0 0 12px 0',
                        fontSize: '14px',
                        fontWeight: 600,
                        color: '#e2e8f0',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                    }}>
                        Controls
                    </h3>
                    <ul style={{
                        margin: 0,
                        padding: '0 0 0 20px',
                        fontSize: '13px',
                        color: '#cbd5e1',
                        lineHeight: '1.8'
                    }}>
                        <li>🖱️ Drag to rotate</li>
                        <li>🔍 Scroll to zoom</li>
                        <li>📱 Touch to explore</li>
                        <li>🌐 Double-tap zoom (mobile)</li>
                    </ul>
                </div>

                {/* Stats Panel */}
                <div style={{
                    position: 'absolute',
                    bottom: 30,
                    right: 30,
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(148, 163, 184, 0.2)',
                    borderRadius: '12px',
                    padding: '20px',
                    color: '#ffffff',
                    fontSize: '12px',
                    zIndex: 10,
                    pointerEvents: 'auto',
                    fontFamily: "'Courier New', monospace",
                    minWidth: '180px'
                }}>
                    <div style={{ marginBottom: '8px', color: '#94a3b8' }}>
                        Zoom Level: <span style={{ color: '#60a5fa' }}>{zoom.toFixed(2)}x</span>
                    </div>
                    <div style={{ color: '#94a3b8' }}>
                        Status: <span style={{ color: '#10b981' }}>Ready</span>
                    </div>
                    <div style={{ marginTop: '8px', fontSize: '11px', color: '#475569' }}>
                        Three.js • React 18
                    </div>
                </div>
            </div>
        </div>
    );
}

// Render app
ReactDOM.createRoot(document.getElementById('root')).render(<EarthMap />);
