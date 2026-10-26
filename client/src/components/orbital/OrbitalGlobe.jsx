import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Play, Pause, RotateCcw, Eye, Satellite, Radio, Info } from 'lucide-react';

export function OrbitalGlobe({
  satellites = [],
  selectedSatelliteId = null,
  onSelectSatellite = () => {},
  height = '500px',
  interactive = true,
  showControls = true,
}) {
  const containerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [selectedSat, setSelectedSat] = useState(null);

  // Sync external selection
  useEffect(() => {
    if (selectedSatelliteId && satellites.length > 0) {
      const found = satellites.find((s) => s.id === selectedSatelliteId);
      if (found) setSelectedSat(found);
    }
  }, [selectedSatelliteId, satellites]);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const heightPx = containerRef.current.clientHeight;

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x070b14);

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / heightPx, 0.1, 1000);
    camera.position.set(0, 3, 6);

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, heightPx);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x38bdf8, 1.8);
    dirLight.position.set(5, 3, 5);
    scene.add(dirLight);

    const sunLight = new THREE.DirectionalLight(0xfff7ed, 1.2);
    sunLight.position.set(-6, -2, -4);
    scene.add(sunLight);

    // 5. Earth Globe
    const earthRadius = 1.8;
    const earthGroup = new THREE.Group();
    scene.add(earthGroup);

    // Earth Sphere Core
    const earthGeo = new THREE.SphereGeometry(earthRadius, 48, 48);
    const earthMat = new THREE.MeshPhongMaterial({
      color: 0x0f1c30,
      emissive: 0x050c18,
      specular: 0x38bdf8,
      shininess: 25,
      wireframe: false,
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    earthGroup.add(earthMesh);

    // Lat/Lon Wireframe Grid
    const gridGeo = new THREE.SphereGeometry(earthRadius * 1.002, 24, 18);
    const gridMat = new THREE.MeshBasicMaterial({
      color: 0x1e3a5f,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    const gridMesh = new THREE.Mesh(gridGeo, gridMat);
    earthGroup.add(gridMesh);

    // Atmosphere Outer Glow
    const atmosGeo = new THREE.SphereGeometry(earthRadius * 1.08, 36, 36);
    const atmosMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.12,
      side: THREE.BackSide,
    });
    const atmosMesh = new THREE.Mesh(atmosGeo, atmosMat);
    earthGroup.add(atmosMesh);

    // 6. Starfield Background
    const starsGeo = new THREE.BufferGeometry();
    const starCount = 1200;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 120;
      starPositions[i + 1] = (Math.random() - 0.5) * 120;
      starPositions[i + 2] = (Math.random() - 0.5) * 120;
    }
    starsGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starsMat = new THREE.PointsMaterial({ color: 0x94a3b8, size: 0.6, transparent: true, opacity: 0.7 });
    const starPoints = new THREE.Points(starsGeo, starsMat);
    scene.add(starPoints);

    // 7. Satellite Orbit Rings & Meshes
    const satMeshes = [];
    const orbitLines = [];

    const satDataList = satellites.length > 0 ? satellites : [
      { id: 'sat-1', name: 'International Space Station', altitudeKm: 420, inclinationDeg: 51.6, color: '#38BDF8' },
      { id: 'sat-2', name: 'Sentinel-6 Michael Freilich', altitudeKm: 1336, inclinationDeg: 66.0, color: '#34D399' },
      { id: 'sat-3', name: 'Landsat 9 Earth Imager', altitudeKm: 705, inclinationDeg: 98.2, color: '#818CF8' },
      { id: 'sat-4', name: 'Hubble Space Telescope', altitudeKm: 535, inclinationDeg: 28.5, color: '#FBBF24' },
      { id: 'sat-5', name: 'Starlink Fleet Node-4182', altitudeKm: 550, inclinationDeg: 53.2, color: '#FB7185' },
    ];

    satDataList.forEach((sat, idx) => {
      const orbitR = earthRadius + (sat.altitudeKm || 500) / 1200;
      const incRad = ((sat.inclinationDeg || 45) * Math.PI) / 180;
      const raanRad = (idx * 65 * Math.PI) / 180;

      // Orbit Curve
      const segments = 64;
      const points = [];
      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        const xOrb = orbitR * Math.cos(theta);
        const yOrb = orbitR * Math.sin(theta);

        const x = xOrb * Math.cos(raanRad) - yOrb * Math.cos(incRad) * Math.sin(raanRad);
        const z = xOrb * Math.sin(raanRad) + yOrb * Math.cos(incRad) * Math.cos(raanRad);
        const y = yOrb * Math.sin(incRad);

        points.push(new THREE.Vector3(x, y, z));
      }

      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
      const isSelected = selectedSat?.id === sat.id;
      const lineMat = new THREE.LineBasicMaterial({
        color: new THREE.Color(isSelected ? '#38BDF8' : sat.color || '#263449'),
        transparent: true,
        opacity: isSelected ? 0.9 : 0.45,
      });
      const line = new THREE.Line(lineGeo, lineMat);
      scene.add(line);
      orbitLines.push(line);

      // Satellite Mesh
      const satGeo = new THREE.SphereGeometry(0.065, 12, 12);
      const satMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(sat.color || '#38BDF8'),
        emissive: new THREE.Color(sat.color || '#38BDF8'),
        emissiveIntensity: 0.8,
      });
      const satMesh = new THREE.Mesh(satGeo, satMat);
      satMesh.userData = { sat, points, orbitSpeed: 0.003 + idx * 0.0008, currentStep: idx * 12 };
      scene.add(satMesh);
      satMeshes.push(satMesh);
    });

    // 8. Mouse & Interactive Controls
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseDown = (e) => {
      if (!interactive) return;
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      const rect = containerRef.current.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (!isDragging || !interactive) return;

      const deltaMove = {
        x: e.clientX - previousMousePosition.x,
        y: e.clientY - previousMousePosition.y,
      };

      earthGroup.rotation.y += deltaMove.x * 0.005;
      earthGroup.rotation.x += deltaMove.y * 0.005;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = (e) => {
      isDragging = false;
      if (!interactive) return;

      // Raycast for satellite selection
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(satMeshes);
      if (intersects.length > 0) {
        const clickedSat = intersects[0].object.userData.sat;
        setSelectedSat(clickedSat);
        onSelectSatellite(clickedSat);
      }
    };

    const onWheel = (e) => {
      if (!interactive) return;
      e.preventDefault();
      camera.position.z = Math.max(3.2, Math.min(10, camera.position.z + e.deltaY * 0.005));
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    domElement.addEventListener('wheel', onWheel, { passive: false });

    // 9. Resize Handling
    const handleResize = () => {
      if (!containerRef.current) return;
      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    // 10. Animation Loop
    let animationId;
    let timeAcc = 0;

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      if (isPlaying) {
        earthGroup.rotation.y += 0.001 * speedMultiplier;
        timeAcc += 0.001 * speedMultiplier;

        // Move satellites along orbital curves
        satMeshes.forEach((mesh) => {
          mesh.userData.currentStep = (mesh.userData.currentStep + mesh.userData.orbitSpeed * speedMultiplier * 10) % 64;
          const idxFloor = Math.floor(mesh.userData.currentStep);
          const p = mesh.userData.points[idxFloor] || mesh.userData.points[0];
          mesh.position.set(p.x, p.y, p.z);
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    // 11. Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      domElement.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domElement.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', handleResize);

      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }

      // Dispose geometries and materials
      earthGeo.dispose();
      earthMat.dispose();
      gridGeo.dispose();
      gridMat.dispose();
      atmosGeo.dispose();
      atmosMat.dispose();
      starsGeo.dispose();
      starsMat.dispose();
      renderer.dispose();
    };
  }, [satellites, isPlaying, speedMultiplier, interactive]);

  const activeSat = selectedSat || (satellites.length > 0 ? satellites[0] : null);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden glass-panel border border-slate-800" style={{ height }}>
      {/* 3D Canvas Mounting Node */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Aerospace HUD Overlays */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-slate-950/80 border border-cyan-500/30 text-cyan-400 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
          <span>ORBITAL RECONNAISSANCE 3D</span>
        </div>
        <p className="text-[11px] text-slate-400 font-mono mt-1">
          Target: {activeSat?.name || 'Earth Geocentric Grid'}
        </p>
      </div>

      {/* Selected Object Telemetry Badge */}
      {activeSat && (
        <div className="absolute top-4 right-4 z-10 p-3.5 rounded-xl bg-slate-950/85 border border-slate-800 text-xs font-mono max-w-xs backdrop-blur-md shadow-xl">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
            <span className="font-bold text-cyan-300 truncate">{activeSat.name}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/40">
              {activeSat.orbitType || 'LEO'}
            </span>
          </div>
          <div className="space-y-1 text-slate-400 text-[11px]">
            <div className="flex justify-between">
              <span>Altitude:</span>
              <span className="text-slate-200">{activeSat.altitudeKm ? `${activeSat.altitudeKm} km` : 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span>Inclination:</span>
              <span className="text-slate-200">{activeSat.inclinationDeg ? `${activeSat.inclinationDeg}°` : 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span>Period:</span>
              <span className="text-slate-200">{activeSat.periodMinutes ? `${activeSat.periodMinutes} min` : 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <span className={activeSat.status === 'operational' ? 'text-emerald-400' : 'text-amber-400'}>
                {(activeSat.status || 'nominal').toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Simulation Controls */}
      {showControls && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-950/85 border border-slate-800 backdrop-blur-md text-xs font-mono">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1.5 rounded hover:bg-slate-800 text-cyan-400 transition-colors"
            title={isPlaying ? 'Pause Simulation' : 'Resume Simulation'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <div className="h-4 w-px bg-slate-800" />
          <button
            onClick={() => setSpeedMultiplier(1)}
            className={`px-2 py-0.5 rounded text-[11px] ${speedMultiplier === 1 ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'}`}
          >
            1x
          </button>
          <button
            onClick={() => setSpeedMultiplier(5)}
            className={`px-2 py-0.5 rounded text-[11px] ${speedMultiplier === 5 ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'}`}
          >
            5x
          </button>
          <button
            onClick={() => setSpeedMultiplier(25)}
            className={`px-2 py-0.5 rounded text-[11px] ${speedMultiplier === 25 ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'}`}
          >
            25x
          </button>
        </div>
      )}
    </div>
  );
}

export default OrbitalGlobe;
