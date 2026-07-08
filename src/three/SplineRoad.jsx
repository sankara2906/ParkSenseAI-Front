import React, { useRef } from 'react';
import * as THREE from 'three';
import { Text } from '@react-three/drei';

// Shared spline points spanning the 10 landing checkpoints
export const ROAD_POINTS = [
  new THREE.Vector3(-25, 0, -35),   // Hero (Scene 1)
  new THREE.Vector3(-15, 0, -18),   // Problem (Scene 2)
  new THREE.Vector3(-2, 0, -4),     // Solution (Scene 3)
  new THREE.Vector3(8, 0, 4),       // How It Works (Scene 4)
  new THREE.Vector3(15, 0, -2),     // Live AI Demo (Scene 5)
  new THREE.Vector3(6, 0, -14),     // Dashboard Preview (Scene 6)
  new THREE.Vector3(-5, 0, -20),    // Features (Scene 7)
  new THREE.Vector3(-15, 0, -18),   // Technology (Scene 8)
  new THREE.Vector3(-22, 0, -12),   // Stats (Scene 9)
  new THREE.Vector3(-25, 0, -5),    // CTA entrance (Scene 10)
];

export const splineCurve = new THREE.CatmullRomCurve3(ROAD_POINTS);

// Pre-calculate points for rendering the road edges
const roadPoints = splineCurve.getPoints(100);
const roadTubeGeometry = new THREE.TubeGeometry(splineCurve, 100, 1.8, 8, false);

export default function SplineRoad({ scrollProgress = 0, barrierOpen = false }) {
  const gateRef = useRef();

  // Animate the parking barrier gate arm opening when progress > 0.9
  const gateAngle = barrierOpen ? -Math.PI / 2 : 0;

  // We place streetlights along the road at specific intervals
  const streetlightCount = 8;
  const streetlights = [];
  for (let i = 1; i < streetlightCount; i++) {
    const t = i / streetlightCount;
    const pos = splineCurve.getPointAt(t);
    const tangent = splineCurve.getTangentAt(t).normalize();
    
    // Perpendicular vector for offset on the side of the road
    const sideOffset = new THREE.Vector3(-tangent.z, 0, tangent.x).multiplyScalar(2.4);
    const lightPos = pos.clone().add(sideOffset);
    streetlights.push({ id: i, pos: lightPos, target: pos.clone() });
  }

  // Predefined building boxes on the sides of the path to make the city feel alive
  const buildings = [
    { id: 'bld-1', pos: [-32, 6, -30], args: [8, 12, 8] },
    { id: 'bld-2', pos: [12, 10, -28], args: [12, 20, 10] },
    { id: 'bld-3', pos: [-18, 8, -4], args: [6, 16, 6] },
    { id: 'bld-4', pos: [22, 9, 8], args: [10, 18, 10] },
    { id: 'bld-5', pos: [20, 7, -18], args: [8, 14, 8] },
    { id: 'bld-6', pos: [-3, 11, -30], args: [14, 22, 12] },
    { id: 'bld-7', pos: [-30, 8, -12], args: [9, 16, 9] },
  ];

  return (
    <group>
      {/* FLAT GROUND MATRIX */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#050816" roughness={0.9} metalness={0.1} />
      </mesh>

      {/* EXTENDED CYBERPUNK ASPHALT ROAD */}
      <mesh geometry={roadTubeGeometry} position={[0, -0.04, 0]} scale={[1, 0.02, 1]}>
        <meshStandardMaterial color="#0B1120" roughness={0.5} metalness={0.8} />
      </mesh>

      {/* NEON BLUE EDGE GUIDELINES */}
      <mesh geometry={new THREE.TubeGeometry(splineCurve, 100, 0.03, 4, false)} position={[0, 0.01, 0]}>
        <meshBasicMaterial color="#00E5FF" />
      </mesh>

      {/* STREETLIGHTS */}
      {streetlights.map((sl) => (
        <group key={sl.id} position={[sl.pos.x, 0, sl.pos.z]}>
          {/* Post */}
          <mesh position={[0, 1.5, 0]}>
            <cylinderGeometry args={[0.06, 0.08, 3, 8]} />
            <meshStandardMaterial color="#1E293B" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Light Cap */}
          <mesh position={[0, 3.05, 0]}>
            <boxGeometry args={[0.3, 0.1, 0.6]} />
            <meshStandardMaterial color="#0F172A" />
          </mesh>
          {/* Emissive Lamp */}
          <mesh position={[0, 2.98, 0]}>
            <boxGeometry args={[0.22, 0.05, 0.52]} />
            <meshBasicMaterial color="#3B82F6" />
          </mesh>
          {/* SpotLight projecting downwards */}
          <spotLight
            position={[0, 2.8, 0]}
            target-position={[sl.target.x - sl.pos.x, 0, sl.target.z - sl.pos.z]}
            intensity={1.5}
            distance={8}
            angle={Math.PI / 4}
            penumbra={0.6}
            color="#00E5FF"
            castShadow
          />
        </group>
      ))}

      {/* FUTURISTIC BUILDINGS */}
      {buildings.map((b) => (
        <group key={b.id} position={b.pos}>
          {/* Solid Structure */}
          <mesh>
            <boxGeometry args={b.args} />
            <meshStandardMaterial color="#090D1A" roughness={0.8} metalness={0.9} />
          </mesh>
          {/* Neon Window Contours (Cyberpunk grid aesthetics) */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[b.args[0] + 0.02, b.args[1] + 0.02, b.args[2] + 0.02]} />
            <meshBasicMaterial color="#3B82F6" wireframe opacity={0.15} transparent />
          </mesh>
        </group>
      ))}

      {/* PARKING SLOT (Final CTA Scene) */}
      <group position={[-25.5, 0, 0]}>
        {/* Designated Parking Box Outline */}
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2.5, 4]} />
          <meshBasicMaterial color={barrierOpen ? '#10B981' : '#3B82F6'} wireframe />
        </mesh>
        <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2.4, 3.9]} />
          <meshBasicMaterial color={barrierOpen ? '#10B981' : '#3B82F6'} transparent opacity={0.1} />
        </mesh>
        
        {/* Navigation Arrows on Ground */}
        <group position={[0, 0.02, 2.5]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.2, 0.5, 4]} />
            <meshBasicMaterial color="#00E5FF" />
          </mesh>
        </group>
      </group>

      {/* SECURITY GATE BARRIER */}
      <group position={[-25.5, 0, -2]}>
        {/* Left Post */}
        <mesh position={[-1.3, 0.5, 0]}>
          <cylinderGeometry args={[0.1, 0.12, 1, 8]} />
          <meshStandardMaterial color="#1E293B" />
        </mesh>
        {/* Right Post */}
        <mesh position={[1.3, 0.5, 0]}>
          <cylinderGeometry args={[0.1, 0.12, 1, 8]} />
          <meshStandardMaterial color="#1E293B" />
        </mesh>
        {/* Rotating Barrier Arm */}
        <group position={[-1.2, 0.8, 0]}>
          <mesh
            ref={gateRef}
            position={[1.2, 0, 0]}
            rotation={[0, 0, gateAngle]}
            style={{ transition: 'transform 1s ease' }}
          >
            <boxGeometry args={[2.4, 0.08, 0.08]} />
            <meshBasicMaterial color="#EF4444" />
          </mesh>
        </group>
      </group>

      {/* NEON MARQUEE AT ENTRANCE */}
      <group position={[-25.5, 2.5, -2.5]}>
        {/* Signboard Backing */}
        <mesh>
          <boxGeometry args={[4, 0.8, 0.1]} />
          <meshStandardMaterial color="#050816" roughness={0.1} />
        </mesh>
        {/* Border Glow */}
        <mesh>
          <boxGeometry args={[4.05, 0.85, 0.12]} />
          <meshBasicMaterial color="#00E5FF" wireframe />
        </mesh>
        {/* Marquee Text */}
        <Text
          position={[0, 0, 0.07]}
          fontSize={0.2}
          font="https://fonts.gstatic.com/s/spacegrotesk/v15/V8mDoD3Q5R-c-BQC4gdy1vycx2GGDJF8.woff2"
          color="#00E5FF"
        >
          PARKSENSE AI
        </Text>
      </group>
    </group>
  );
}
