import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Stars, Html } from '@react-three/drei';
import * as THREE from 'three';
import CarModel from '../three/CarModel';

// 🅿 Individual Parking Slot Bay containing a custom car
function ParkingBaySlot({ position, label, status, selected, children, onSelect }) {
  const colorMap = {
    available: '#22C55E',
    occupied: '#EF4444',
    charging: '#8B5CF6',
    vip: '#F59E0B'
  };
  const color = colorMap[status] || '#00D9FF';

  return (
    <group position={position}>
      {/* Slot asphalt plate */}
      <mesh receiveShadow position={[0, -0.09, 0]}>
        <boxGeometry args={[1.7, 0.04, 2.5]} />
        <meshStandardMaterial color="#0A1224" roughness={0.6} />
      </mesh>

      {/* Grid Border outlines */}
      <mesh position={[-0.85, -0.06, 0]}>
        <boxGeometry args={[0.03, 0.03, 2.5]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.2} />
      </mesh>
      <mesh position={[0.85, -0.06, 0]}>
        <boxGeometry args={[0.03, 0.03, 2.5]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.2} />
      </mesh>
      <mesh position={[0, -0.06, -1.25]}>
        <boxGeometry args={[1.7, 0.03, 0.03]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.2} />
      </mesh>

      {/* Blinking glow indicators based on slot selection */}
      <mesh position={[0, -0.065, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.66, 2.46]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={selected ? 0.6 : 0.2} 
          wireframe 
        />
      </mesh>

      {/* Overhead Status Sensor */}
      <mesh position={[0, 1.3, -1.2]}>
        <cylinderGeometry args={[0.012, 0.012, 0.45]} />
        <meshStandardMaterial color="#475569" />
      </mesh>
      <mesh position={[0, 1.55, -1.2]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <pointLight position={[0, 1.5, -1.2]} intensity={1.2} color={color} distance={0.8} />

      {/* Slot label HTML */}
      <Html position={[0, -0.2, 1.15]} transform distanceFactor={5.5}>
        <div className="px-2 py-0.5 rounded bg-[#0A1224]/90 border border-white/10 text-white font-mono text-[5.5px] tracking-widest font-extrabold whitespace-nowrap">
          {label}
        </div>
      </Html>

      {/* Renders the passed car child model */}
      {children}
    </group>
  );
}

// ⚡ EV Charging Pillar next to center SUV
function EVCharger({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.35, 0]}>
        <boxGeometry args={[0.18, 0.6, 0.14]} />
        <meshStandardMaterial color="#1E293B" metalness={0.8} />
      </mesh>
      <mesh position={[0, 0.5, 0.075]}>
        <boxGeometry args={[0.08, 0.08, 0.01]} />
        <meshBasicMaterial color="#8B5CF6" />
      </mesh>
    </group>
  );
}

// 📹 Mounted surveillance camera scanning
function CCTVScanner({ position }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = Math.sin(clock.getElapsedTime() * 1.5) * 0.45;
    }
  });

  return (
    <group position={position}>
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.6]} />
        <meshStandardMaterial color="#475569" />
      </mesh>
      <group ref={ref} position={[0, 0.6, 0]}>
        <mesh position={[0, 0, 0.05]}>
          <boxGeometry args={[0.05, 0.04, 0.1]} />
          <meshStandardMaterial color="#0F172A" />
        </mesh>
        {/* Glowing holographic radar cone */}
        <mesh position={[0, -0.18, 0.15]} rotation={[Math.PI / 6, 0, 0]}>
          <coneGeometry args={[0.15, 0.35, 16, 1, true]} />
          <meshBasicMaterial color="#00D9FF" transparent opacity={0.06} wireframe />
        </mesh>
      </group>
    </group>
  );
}

// Main Smart Parking Scene Loader
function ParkingScene() {
  const groupRef = useRef();
  const [selectedCar, setSelectedCar] = useState(2); // SUV default selected

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 0.8) * 0.03;
      groupRef.current.rotation.y = t * 0.07; // platforms rotate slowly
    }
  });

  // Telemetries based on selected index
  const selectedStats = {
    1: { name: 'MODEL: PARKSENSE COUPE-GT', plate: 'MH12 AB 1101', status: 'STATUS: SECURED & MONITORING', charge: 'BATTERY: 94%' },
    2: { name: 'MODEL: PARKSENSE SUV-EV', plate: 'MH12 AB 2202', status: 'STATUS: EV CHARGING ACTIVE', charge: 'BATTERY: 67%' },
    3: { name: 'MODEL: PARKSENSE TRK-CYBER', plate: 'MH12 AB 3303', status: 'STATUS: SECURED (VIP SLOT)', charge: 'BATTERY: 82%' }
  };
  const activeStats = selectedStats[selectedCar];

  return (
    <group ref={groupRef}>
      
      {/* Platform Cylinder base */}
      <mesh receiveShadow position={[0, -0.15, 0]}>
        <cylinderGeometry args={[3.3, 3.5, 0.1, 64]} />
        <meshStandardMaterial color="#0f172a" roughness={0.5} metalness={0.9} />
      </mesh>
      <mesh position={[0, -0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.3, 3.33, 64]} />
        <meshBasicMaterial color="#00D9FF" />
      </mesh>

      {/* 🅿 SLOT A01: Sports Coupe */}
      <ParkingBaySlot 
        position={[-1.7, 0, 0]} 
        label="SLOT A01" 
        status="occupied" 
        selected={selectedCar === 1}
      >
        <CarModel 
          scale={0.78} 
          rotation={[0, Math.PI / 2, 0]} 
          bodyColor="#00D9FF" 
          headlightsActive={selectedCar === 1} 
          onClick={(e) => {
            e.stopPropagation();
            setSelectedCar(1);
          }} 
        />
      </ParkingBaySlot>

      {/* 🅿 SLOT A02: EV SUV (Charging) */}
      <ParkingBaySlot 
        position={[0, 0, 0]} 
        label="SLOT A02 (EV ZONE)" 
        status="charging" 
        selected={selectedCar === 2}
      >
        <CarModel 
          scale={0.78} 
          rotation={[0, Math.PI / 2, 0]} 
          bodyColor="#8B5CF6" 
          headlightsActive={selectedCar === 2} 
          onClick={(e) => {
            e.stopPropagation();
            setSelectedCar(2);
          }} 
        />
      </ParkingBaySlot>

      {/* 🅿 SLOT A03: Cybertruck */}
      <ParkingBaySlot 
        position={[1.7, 0, 0]} 
        label="SLOT A03 (VIP ZONE)" 
        status="vip" 
        selected={selectedCar === 3}
      >
        <CarModel 
          scale={0.78} 
          rotation={[0, Math.PI / 2, 0]} 
          bodyColor="#F59E0B" 
          headlightsActive={selectedCar === 3} 
          onClick={(e) => {
            e.stopPropagation();
            setSelectedCar(3);
          }} 
        />
      </ParkingBaySlot>

      {/* EV Station node */}
      <EVCharger position={[0.7, 0, -1.0]} />

      {/* Scanning cameras */}
      <CCTVScanner position={[-2.4, -0.1, -1.8]} />
      <CCTVScanner position={[2.4, -0.1, -1.8]} />

      {/* Floating Holographic Diagnostic HUD */}
      <Html position={[0, 0.9, 0]} transform distanceFactor={5.5}>
        <div className="px-3.5 py-2 rounded-xl bg-[#0A1224]/95 border border-[#00D9FF]/30 text-left space-y-1 shadow-[0_0_15px_rgba(0,217,255,0.25)] select-none">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00FFC6] animate-pulse"></span>
            <span className="text-[#00FFC6] text-[6.5px] font-mono font-extrabold tracking-wider">DIAGNOSTIC TELEMETRY</span>
          </div>
          <p className="text-white text-[7.5px] font-mono font-bold leading-none mt-1">{activeStats.name}</p>
          <p className="text-slate-400 text-[6.5px] font-mono leading-none">{activeStats.plate} • {activeStats.charge}</p>
          <p className="text-[#00D9FF] text-[6.5px] font-mono leading-none">{activeStats.status}</p>
        </div>
      </Html>

    </group>
  );
}

export default function SmartCity3D() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setMouse({ x: x * 0.1, y: y * 0.1 });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="w-full h-full min-h-[380px] relative">
      <Canvas shadows>
        <color attach="background" args={['#050814']} />
        <fog attach="fog" args={['#050814', 6, 14]} />

        <PerspectiveCamera 
          makeDefault 
          fov={34} 
          position={[7.5 + mouse.x * 3, 5.5 + mouse.y * 3, 7.5]} 
        />

        <OrbitControls 
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 2.3}
          minPolarAngle={Math.PI / 3.8}
        />

        {/* Cinematic illumination */}
        <ambientLight intensity={1.8} color="#ffffff" />
        <directionalLight position={[0, 10, 0]} intensity={2.5} color="#ffffff" />
        <pointLight position={[5, 8, 5]} intensity={50} color="#00D9FF" castShadow />
        <pointLight position={[-5, 5, -5]} intensity={30} color="#8B5CF6" />
        
        {/* Soft glowing stars background */}
        <Stars radius={100} depth={50} count={110} factor={3} saturation={0.5} fade speed={1} />

        {/* 3D Parking Bay Scene */}
        <ParkingScene />

        {/* Blueprint Floor Grid */}
        <gridHelper args={[22, 22, '#00D9FF', '#0d1628']} position={[0, -0.16, 0]} />
      </Canvas>
    </div>
  );
}
