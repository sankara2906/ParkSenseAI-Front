import React, { useRef, Component } from 'react';
import * as THREE from 'three';
import { useGLTF, Html, Sparkles } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

// 1. NEON LOAD SPINNER
export function HtmlLoadingSpinner() {
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center gap-4 bg-[#050816]/95 p-6 rounded-lg border border-[#00E5FF]/20 backdrop-blur-md z-50">
        <div className="w-12 h-12 rounded-full border-4 border-t-[#00E5FF] border-white/10 animate-spin"></div>
        <p className="font-heading text-xs text-[#00E5FF] tracking-wider uppercase animate-pulse">
          INITIALIZING ELECTRIC VEHICLE...
        </p>
      </div>
    </Html>
  );
}

// 2. ERROR BOUNDARY
class ModelErrorBoundary extends Component {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.warn("Sedan GLB failed to load, falling back to procedural:", error);
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// 3. PROCEDURAL SEDAN MODEL (FALLBACK)
function ProceduralCar({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  steeringAngle = 0,
  wheelRotation = 0,
  bodyTilt = 0,
  suspensionOffset = 0,
  headlightsActive = true,
  brakeLightsActive = false,
  headlightBreathingIntensity = 1.0,
}) {
  const neonColor = '#00E5FF';

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Sparkles for premium dust effect */}
      <Sparkles count={40} scale={4} size={1.2} speed={0.3} color={neonColor} />

      {/* Underglow */}
      <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.5, 1.25]} />
        <meshBasicMaterial color={neonColor} transparent opacity={0.55} toneMapped={false} />
      </mesh>

      {/* Chassis Body - Matte Black */}
      <group position={[0, suspensionOffset, 0]} rotation={[0, 0, bodyTilt]}>
        {/* Main Body */}
        <mesh position={[0, 0.1, 0]}>
          <boxGeometry args={[2.3, 0.22, 1.1]} />
          <meshStandardMaterial color="#09090B" roughness={0.25} metalness={0.9} />
        </mesh>
        
        {/* Cabin Roof - Panoramic Glass */}
        <mesh position={[-0.1, 0.35, 0]}>
          <boxGeometry args={[1.1, 0.3, 0.9]} />
          <meshStandardMaterial color="#00E5FF" transparent opacity={0.4} roughness={0} metalness={1.0} />
        </mesh>

        {/* DRL Neon Blue Front Headlights */}
        <group position={[1.15, 0.12, 0]}>
          <mesh position={[0, 0, 0.38]}>
            <boxGeometry args={[0.04, 0.05, 0.18]} />
            <meshBasicMaterial color="#00E5FF" toneMapped={false} />
          </mesh>
          <mesh position={[0, 0, -0.38]}>
            <boxGeometry args={[0.04, 0.05, 0.18]} />
            <meshBasicMaterial color="#00E5FF" toneMapped={false} />
          </mesh>
          
          {headlightsActive && (
            <>
              <spotLight 
                position={[0.1, 0, 0.38]} 
                target-position={[3, -0.4, 0.38]} 
                intensity={3.0 * headlightBreathingIntensity} 
                distance={12} 
                angle={Math.PI / 6} 
                penumbra={0.5} 
                color="#00E5FF" 
              />
              <spotLight 
                position={[0.1, 0, -0.38]} 
                target-position={[3, -0.4, -0.38]} 
                intensity={3.0 * headlightBreathingIntensity} 
                distance={12} 
                angle={Math.PI / 6} 
                penumbra={0.5} 
                color="#00E5FF" 
              />
            </>
          )}
        </group>

        {/* Tail LED Bar */}
        <group position={[-1.15, 0.15, 0]}>
          <mesh>
            <boxGeometry args={[0.03, 0.04, 0.95]} />
            <meshStandardMaterial 
              color="#EF4444" 
              emissive="#EF4444" 
              emissiveIntensity={brakeLightsActive ? 4.0 : 0.4} 
              roughness={0.1} 
            />
          </mesh>
        </group>
      </group>

      {/* Rims and Tires */}
      {/* Front Left */}
      <group position={[0.68, -0.01, 0.56]} rotation={[0, steeringAngle, 0]}>
        <mesh rotation={[wheelRotation, 0, 0]}>
          <cylinderGeometry args={[0.28, 0.28, 0.22, 24]} />
          <meshStandardMaterial color="#111827" roughness={0.8} />
        </mesh>
      </group>
      {/* Front Right */}
      <group position={[0.68, -0.01, -0.56]} rotation={[0, steeringAngle, 0]}>
        <mesh rotation={[wheelRotation, 0, 0]}>
          <cylinderGeometry args={[0.28, 0.28, 0.22, 24]} />
          <meshStandardMaterial color="#111827" roughness={0.8} />
        </mesh>
      </group>
      {/* Rear Left */}
      <group position={[-0.68, -0.01, 0.56]}>
        <mesh rotation={[wheelRotation, 0, 0]}>
          <cylinderGeometry args={[0.28, 0.28, 0.24, 24]} />
          <meshStandardMaterial color="#111827" roughness={0.8} />
        </mesh>
      </group>
      {/* Rear Right */}
      <group position={[-0.68, -0.01, -0.56]}>
        <mesh rotation={[wheelRotation, 0, 0]}>
          <cylinderGeometry args={[0.28, 0.28, 0.24, 24]} />
          <meshStandardMaterial color="#111827" roughness={0.8} />
        </mesh>
      </group>
    </group>
  );
}

// 4. REALISTIC 3D ELECTRIC SEDAN (GLB LOADED + PBR STYLED)
function GLTFCar({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  steeringAngle = 0,
  wheelRotation = 0,
  bodyTilt = 0,
  suspensionOffset = 0,
  headlightsActive = true,
  brakeLightsActive = false,
  headlightBreathingIntensity = 1.0,
}) {
  const gltf = useGLTF('/models/electric_sedan.glb');

  // Clone scene to manipulate nodes independently
  const clonedScene = React.useMemo(() => gltf.scene.clone(), [gltf.scene]);

  // Style car parts dynamically matching premium EV design language
  React.useEffect(() => {
    clonedScene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        const name = child.name.toLowerCase();

        // Matte black paint body paint
        if (
          name.includes('body') || 
          name.includes('paint') || 
          name.includes('hood') || 
          name.includes('door') || 
          name.includes('fender') || 
          name.includes('bumper') ||
          name.includes('chassis')
        ) {
          child.material = new THREE.MeshStandardMaterial({
            color: '#09090B',
            metalness: 0.95,
            roughness: 0.25,
            envMapIntensity: 2.2,
          });
        }

        // Glass panoramic roof and windows
        else if (
          name.includes('glass') || 
          name.includes('window') || 
          name.includes('windshield') || 
          name.includes('roof')
        ) {
          child.material = new THREE.MeshStandardMaterial({
            color: '#00E5FF',
            transparent: true,
            opacity: 0.4,
            roughness: 0.0,
            metalness: 1.0,
          });
        }

        // Alloy Rims
        else if (name.includes('rim') || name.includes('alloy') || name.includes('spoke')) {
          child.material = new THREE.MeshStandardMaterial({
            color: '#E2E8F0',
            metalness: 1.0,
            roughness: 0.1,
          });
        }

        // Rubber tires
        else if (name.includes('tire') || name.includes('rubber')) {
          child.material = new THREE.MeshStandardMaterial({
            color: '#111827',
            roughness: 0.8,
            metalness: 0.1,
          });
        }

        // LED Headlights / DRL
        else if (name.includes('headlight') || name.includes('drl') || name.includes('light_f')) {
          child.material = new THREE.MeshBasicMaterial({
            color: '#00E5FF',
            toneMapped: false,
          });
        }

        // Tail Lights Emissive Red
        else if (name.includes('taillight') || name.includes('light_r') || name.includes('brake')) {
          child.material = new THREE.MeshStandardMaterial({
            color: '#EF4444',
            emissive: '#EF4444',
            emissiveIntensity: brakeLightsActive ? 4.0 : 0.4,
            roughness: 0.1,
          });
        }
      }
    });
  }, [clonedScene, brakeLightsActive]);

  // Animate wheels in frame loop
  useFrame(() => {
    const frontWheels = [];
    const rearWheels = [];

    clonedScene.traverse((child) => {
      if (child.name.toLowerCase().includes('wheel') && !child.name.toLowerCase().includes('steering')) {
        const name = child.name.toLowerCase();
        if (name.includes('front') || name.includes('_fl') || name.includes('_fr') || name.includes('steer')) {
          frontWheels.push(child);
        } else {
          rearWheels.push(child);
        }
      }
    });

    // Spin wheels and steer front axles
    frontWheels.forEach((wheel) => {
      wheel.rotation.x = wheelRotation;
      wheel.rotation.y = steeringAngle;
    });

    rearWheels.forEach((wheel) => {
      wheel.rotation.x = wheelRotation;
    });

    // Apply suspension bounce and body roll tilt
    clonedScene.position.y = suspensionOffset;
    clonedScene.rotation.z = bodyTilt;
  });

  return (
    <group position={position} rotation={rotation}>
      {/* Floating Sparkles around the car */}
      <Sparkles count={45} scale={4} size={1.4} speed={0.4} color="#00E5FF" />

      {/* 3D Model Instance. Scale tailored for electric_sedan geometry */}
      <primitive 
        object={clonedScene} 
        scale={scale * 0.9} 
      />

      {/* Underglow Neon */}
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.5, 1.2]} />
        <meshBasicMaterial color="#00E5FF" transparent opacity={0.6} toneMapped={false} />
      </mesh>

      {/* Headlights Spotlight projections */}
      {headlightsActive && (
        <group>
          <spotLight
            position={[1.1, 0.15, 0.38]}
            target-position={[4.0, -0.4, 0.38]}
            intensity={3.0 * headlightBreathingIntensity}
            distance={12}
            angle={Math.PI / 6}
            penumbra={0.5}
            color="#00E5FF"
          />
          <spotLight
            position={[1.1, 0.15, -0.38]}
            target-position={[4.0, -0.4, -0.38]}
            intensity={3.0 * headlightBreathingIntensity}
            distance={12}
            angle={Math.PI / 6}
            penumbra={0.5}
            color="#00E5FF"
          />
        </group>
      )}

      {/* Tail light LED bar */}
      <mesh position={[-1.1, 0.16, 0]}>
        <boxGeometry args={[0.02, 0.04, 0.9]} />
        <meshStandardMaterial 
          color="#EF4444" 
          emissive="#EF4444" 
          emissiveIntensity={brakeLightsActive ? 4.0 : 0.4} 
          roughness={0.1} 
        />
      </mesh>
    </group>
  );
}

// 5. MASTER INTEGRATOR
export default function CarModel(props) {
  return (
    <ModelErrorBoundary fallback={<ProceduralCar {...props} />}>
      <GLTFCar {...props} />
    </ModelErrorBoundary>
  );
}
