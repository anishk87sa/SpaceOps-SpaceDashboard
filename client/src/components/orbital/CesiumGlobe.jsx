import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as Cesium from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';
import {
  propagateSatellite,
  calculateOrbitTrajectoryPositions,
} from '../../services/orbital/satellitePropagation';
import {
  RotateCcw,
  Compass,
  Eye,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Layers,
  Radio,
  Play,
  Pause,
} from 'lucide-react';

/**
 * Category color definitions for satellite point markers
 */
const CATEGORY_COLORS = {
  stations: Cesium.Color.fromCssColorString('#38BDF8'), // Cyan
  earth_observation: Cesium.Color.fromCssColorString('#34D399'), // Emerald
  weather: Cesium.Color.fromCssColorString('#0284C7'), // Sky Blue
  navigation: Cesium.Color.fromCssColorString('#FBBF24'), // Amber
  science: Cesium.Color.fromCssColorString('#A855F7'), // Purple
  communications: Cesium.Color.fromCssColorString('#FB7185'), // Rose
  other: Cesium.Color.fromCssColorString('#94A3B8'), // Slate
};

export function CesiumGlobe({
  satellites = [],
  selectedSatellite = null,
  onSelectSatellite = () => {},
  showOrbitTrajectory = true,
  isFollowing = false,
  onToggleFollow = () => {},
  simulationTime = new Date(),
  isPlaying = true,
  speedMultiplier = 1,
  className = '',
}) {
  const containerRef = useRef(null);
  const viewerRef = useRef(null);
  const pointsCollectionRef = useRef(null);
  const pointPrimitiveMapRef = useRef(new Map()); // noradId -> PointPrimitive
  const trajectoryEntityRef = useRef(null);
  const selectionIndicatorEntityRef = useRef(null);
  const isAutoRotatingRef = useRef(true);
  const isUserInteractingRef = useRef(false);
  const interactionTimeoutRef = useRef(null);

  const [autoRotate, setAutoRotate] = useState(true);
  const [imageryMode, setImageryMode] = useState('dark'); // 'dark' | 'standard'

  // Update autoRotate ref
  useEffect(() => {
    isAutoRotatingRef.current = autoRotate;
  }, [autoRotate]);

  // 1. Initialize Cesium Viewer
  useEffect(() => {
    if (!containerRef.current) return;

    // Use OpenStreetMap / Natural Earth imagery as dependable baseline
    let imageryProvider;
    try {
      imageryProvider = new Cesium.OpenStreetMapImageryProvider({
        url: 'https://tile.openstreetmap.org/',
      });
    } catch (e) {
      imageryProvider = new Cesium.TileMapServiceImageryProvider({
        url: Cesium.buildModuleUrl('Assets/Textures/NaturalEarthII'),
      });
    }

    const viewer = new Cesium.Viewer(containerRef.current, {
      animation: false,
      timeline: false,
      baseLayerPicker: false,
      geocoder: false,
      homeButton: false,
      sceneModePicker: false,
      navigationHelpButton: false,
      fullscreenButton: false,
      infoBox: false,
      selectionIndicator: false,
      imageryProvider,
      scene3DOnly: true,
      shouldAnimate: true,
    });

    viewerRef.current = viewer;

    const scene = viewer.scene;
    const globe = scene.globe;

    // Aerospace Dark Theme Styling
    scene.backgroundColor = Cesium.Color.fromCssColorString('#070B14');
    globe.baseColor = Cesium.Color.fromCssColorString('#0D1422');
    globe.enableLighting = true;
    if (scene.skyAtmosphere) {
      scene.skyAtmosphere.show = true;
      scene.skyAtmosphere.hueShift = 0.05;
      scene.skyAtmosphere.saturationShift = 0.1;
      scene.skyAtmosphere.brightnessShift = -0.15;
    }

    // High performance point primitive collection for satellites
    const pointsCollection = new Cesium.PointPrimitiveCollection();
    scene.primitives.add(pointsCollection);
    pointsCollectionRef.current = pointsCollection;

    // Initial Camera Position: High orbit view over Atlantic & Europe
    viewer.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(-30.0, 20.0, 22000000.0),
      orientation: {
        heading: 0.0,
        pitch: -Cesium.Math.PI_OVER_TWO,
        roll: 0.0,
      },
    });

    // Detect user interaction to pause auto-rotation smoothly
    const handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);

    handler.setInputAction(() => {
      isUserInteractingRef.current = true;
      if (interactionTimeoutRef.current) {
        clearTimeout(interactionTimeoutRef.current);
      }
    }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

    handler.setInputAction(() => {
      interactionTimeoutRef.current = setTimeout(() => {
        isUserInteractingRef.current = false;
      }, 5000); // Resume slow rotation 5 seconds after release
    }, Cesium.ScreenSpaceEventType.LEFT_UP);

    handler.setInputAction(() => {
      isUserInteractingRef.current = true;
      if (interactionTimeoutRef.current) {
        clearTimeout(interactionTimeoutRef.current);
      }
      interactionTimeoutRef.current = setTimeout(() => {
        isUserInteractingRef.current = false;
      }, 4000);
    }, Cesium.ScreenSpaceEventType.WHEEL);

    // Click handler for picking satellite point primitives
    handler.setInputAction((movement) => {
      const picked = scene.pick(movement.position);
      if (picked && picked.primitive && picked.primitive._satelliteData) {
        onSelectSatellite(picked.primitive._satelliteData);
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    // Frame Tick Listener: handles automatic rotation & follow mode
    const removePostRender = scene.postRender.addEventListener(() => {
      // Automatic rotation when enabled and not user-dragging
      if (
        isAutoRotatingRef.current &&
        !isUserInteractingRef.current &&
        !viewerRef.current?.selectedEntity &&
        !isFollowing
      ) {
        scene.camera.rotate(Cesium.Cartesian3.UNIT_Z, 0.00035);
      }
    });

    // Cleanup on unmount
    return () => {
      removePostRender();
      handler.destroy();
      if (interactionTimeoutRef.current) clearTimeout(interactionTimeoutRef.current);
      if (pointsCollectionRef.current && !pointsCollectionRef.current.isDestroyed()) {
        scene.primitives.remove(pointsCollectionRef.current);
      }
      if (!viewer.isDestroyed()) {
        viewer.destroy();
      }
      viewerRef.current = null;
      pointPrimitiveMapRef.current.clear();
    };
  }, []);

  // 2. Populate and Update Satellite Markers
  useEffect(() => {
    const viewer = viewerRef.current;
    const pointsCollection = pointsCollectionRef.current;
    if (!viewer || !pointsCollection || pointsCollection.isDestroyed()) return;

    const existingMap = pointPrimitiveMapRef.current;

    // Synchronize point primitives with satellite catalog
    satellites.forEach((sat) => {
      const noradId = sat.noradId;
      const prop = propagateSatellite(sat, simulationTime);
      if (!prop || !prop.cartesian3) return;

      const categoryColor = CATEGORY_COLORS[sat.category] || CATEGORY_COLORS.other;
      const isSelected = selectedSatellite?.noradId === noradId;

      let point = existingMap.get(noradId);
      if (!point) {
        // Create new point primitive
        point = pointsCollection.add({
          position: prop.cartesian3,
          color: categoryColor,
          pixelSize: isSelected ? 12 : sat.category === 'stations' ? 9 : 6,
          outlineColor: Cesium.Color.fromCssColorString('#070B14'),
          outlineWidth: isSelected ? 3 : 1.5,
        });
        point._satelliteData = sat;
        existingMap.set(noradId, point);
      } else {
        // Update existing primitive position and style
        point.position = prop.cartesian3;
        point.color = categoryColor;
        point.pixelSize = isSelected ? 12 : sat.category === 'stations' ? 9 : 6;
        point.outlineWidth = isSelected ? 3 : 1.5;
        point._satelliteData = sat;
      }
    });
  }, [satellites, simulationTime, selectedSatellite]);

  // 3. Selection Highlight & Orbital Trajectory Polyline
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer || viewer.isDestroyed()) return;

    // Clean up previous trajectory
    if (trajectoryEntityRef.current) {
      viewer.entities.remove(trajectoryEntityRef.current);
      trajectoryEntityRef.current = null;
    }

    if (selectionIndicatorEntityRef.current) {
      viewer.entities.remove(selectionIndicatorEntityRef.current);
      selectionIndicatorEntityRef.current = null;
    }

    if (!selectedSatellite) return;

    // Calculate genuine orbit trajectory points
    if (showOrbitTrajectory) {
      const trajectoryPoints = calculateOrbitTrajectoryPositions(
        selectedSatellite,
        simulationTime,
        120
      );

      if (trajectoryPoints.length > 2) {
        const trajectoryEntity = viewer.entities.add({
          name: `${selectedSatellite.name} Orbit Path`,
          polyline: {
            positions: trajectoryPoints,
            width: 2.2,
            material: new Cesium.PolylineGlowMaterialProperty({
              glowPower: 0.25,
              taperPower: 0.8,
              color: Cesium.Color.fromCssColorString('#38BDF8'),
            }),
            arcType: Cesium.ArcType.NONE,
          },
        });
        trajectoryEntityRef.current = trajectoryEntity;
      }
    }

    // Add selected satellite glowing halo indicator
    const currentProp = propagateSatellite(selectedSatellite, simulationTime);
    if (currentProp && currentProp.cartesian3) {
      const indicator = viewer.entities.add({
        position: currentProp.cartesian3,
        point: {
          pixelSize: 18,
          color: Cesium.Color.fromCssColorString('rgba(56, 189, 248, 0.4)'),
          outlineColor: Cesium.Color.fromCssColorString('#38BDF8'),
          outlineWidth: 2,
        },
      });
      selectionIndicatorEntityRef.current = indicator;
    }
  }, [selectedSatellite, showOrbitTrajectory, simulationTime]);

  // 4. Follow Mode Camera Tracking
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer || viewer.isDestroyed() || !isFollowing || !selectedSatellite) return;

    const prop = propagateSatellite(selectedSatellite, simulationTime);
    if (prop && prop.cartesian3) {
      // Position camera at an offset looking toward the satellite
      const currentCameraPosition = viewer.camera.position;
      const targetCartesian = prop.cartesian3;

      // Keep distance consistent
      const currentDistance = Cesium.Cartesian3.distance(currentCameraPosition, targetCartesian);
      const targetDistance = Math.min(Math.max(currentDistance, 2500000.0), 12000000.0);

      // Smoothly update camera focus
      viewer.camera.lookAt(
        targetCartesian,
        new Cesium.HeadingPitchRange(
          viewer.camera.heading,
          viewer.camera.pitch || -0.5,
          targetDistance
        )
      );
    }
  }, [isFollowing, selectedSatellite, simulationTime]);

  // Fly-to action for selected satellite
  const handleFlyToSatellite = useCallback(() => {
    const viewer = viewerRef.current;
    if (!viewer || !selectedSatellite) return;

    const prop = propagateSatellite(selectedSatellite, simulationTime);
    if (prop && prop.cartesian3) {
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(
          prop.longitude,
          prop.latitude,
          Math.max(prop.altitudeKm * 1000 * 5, 2500000.0)
        ),
        duration: 1.8,
      });
    }
  }, [selectedSatellite, simulationTime]);

  // Reset Camera to Default Global Orbit View
  const handleResetCamera = useCallback(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;

    // Disconnect lookAt constraints if active
    viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);

    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(-30.0, 20.0, 22000000.0),
      orientation: {
        heading: 0.0,
        pitch: -Cesium.Math.PI_OVER_TWO,
        roll: 0.0,
      },
      duration: 1.5,
    });
  }, []);

  // Zoom controls
  const handleZoom = useCallback((inOut) => {
    const viewer = viewerRef.current;
    if (!viewer) return;
    const camera = viewer.camera;
    const amount = inOut === 'in' ? 3000000.0 : -3000000.0;
    camera.zoomIn(amount);
  }, []);

  return (
    <div className={`relative w-full h-full overflow-hidden select-none bg-[#070B14] ${className}`}>
      {/* Primary Cesium Canvas Mounting Element */}
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        style={{ minHeight: '400px' }}
      />

      {/* Floating Aerospace Camera & Simulation HUD Controls */}
      <div className="absolute top-4 left-4 z-20 flex flex-col space-y-2 pointer-events-auto">
        <div className="flex items-center space-x-1.5 p-1 rounded-xl bg-[#0D1422]/90 border border-[#263449] backdrop-blur-md shadow-2xl">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-2 rounded-lg text-xs font-mono transition-all flex items-center space-x-1.5 cursor-pointer ${
              autoRotate
                ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40'
                : 'text-slate-400 hover:text-white hover:bg-[#162338]'
            }`}
            title={autoRotate ? 'Pause Earth Rotation' : 'Enable Automatic Earth Rotation'}
          >
            <RotateCcw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin-slow' : ''}`} />
            <span className="text-[11px] font-semibold">{autoRotate ? 'SPIN ON' : 'SPIN OFF'}</span>
          </button>

          <div className="h-4 w-px bg-[#263449]" />

          <button
            onClick={handleResetCamera}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-[#162338] transition-colors cursor-pointer"
            title="Reset Global Earth Camera"
          >
            <Compass className="w-4 h-4" />
          </button>

          <button
            onClick={() => handleZoom('in')}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-[#162338] transition-colors cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <button
            onClick={() => handleZoom('out')}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-[#162338] transition-colors cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>

        {/* Following Status Banner if follow mode is active */}
        {isFollowing && selectedSatellite && (
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono backdrop-blur-md shadow-lg animate-pulse">
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
            <span>FOLLOWING: {selectedSatellite.name}</span>
            <button
              onClick={onToggleFollow}
              className="ml-2 text-[10px] uppercase underline text-slate-400 hover:text-white cursor-pointer"
            >
              Detach
            </button>
          </div>
        )}
      </div>

      {/* Target Focus Button if satellite is selected */}
      {selectedSatellite && (
        <div className="absolute top-4 right-4 z-20 flex items-center space-x-2 pointer-events-auto">
          <button
            onClick={handleFlyToSatellite}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#0D1422]/90 hover:bg-[#162338] border border-sky-500/40 text-sky-400 text-xs font-mono backdrop-blur-md transition-all shadow-xl cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>FOCUS TARGET</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default CesiumGlobe;
