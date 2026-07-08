import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';

export default function ParkingLot({
  slots = [],
  onSlotClick = null,
  rotate = true,
}) {
  const lotRef = useRef();
  const [hoveredSlot, setHoveredSlot] = useState(null);

  // Slow rotation for presentation
  useFrame((state) => {
    if (rotate && lotRef.current) {
      lotRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.1) * 0.3;
    }
  });

  // Render color based on slot status
  const getSlotColor = (status, isHovered) => {
    if (isHovered) return '#FFFFFF'; // Highlight white on hover
    switch (status) {
      case 'Available':
        return '#00E5FF'; // Neon Cyan
      case 'Occupied':
        return '#EF4444'; // Red
      case 'Reserved':
        return '#3B82F6'; // Blue
      default:
        return '#4B5563';
    }
  };

  return (
    <group ref={lotRef} position={[0, -0.5, 0]}>
      {/* Grid Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[14, 8]} />
        <meshStandardMaterial color="#0B1120" roughness={0.7} metalness={0.2} />
      </mesh>

      {/* Grid Lines */}
      <gridHelper args={[14, 14, '#1E293B', '#111827']} position={[0, 0, 0]} />

      {/* Outer Border Glowing Line */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[7.2, 7.3, 4]} />
        <meshBasicMaterial color="#3B82F6" opacity={0.3} transparent />
      </mesh>

      {/* Render Slots */}
      {slots.map((slot) => {
        const isHovered = hoveredSlot === slot.id;
        const color = getSlotColor(slot.status, isHovered);

        return (
          <group
            key={slot.id}
            position={slot.position}
            onPointerOver={(e) => {
              e.stopPropagation();
              setHoveredSlot(slot.id);
            }}
            onPointerOut={() => setHoveredSlot(null)}
            onClick={(e) => {
              e.stopPropagation();
              if (onSlotClick) onSlotClick(slot);
            }}
          >
            {/* Slot Border Lines */}
            <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[1.1, 1.15, 4, 1, Math.PI / 4]} />
              <meshBasicMaterial color={color} />
            </mesh>

            {/* Glowing Ground Indicator */}
            <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[2.0, 1.0]} />
              <meshBasicMaterial
                color={color}
                transparent
                opacity={isHovered ? 0.35 : 0.1}
              />
            </mesh>

            {/* Slot Label (e.g. A1, A2) */}
            <Text
              position={[0, 0.05, 0.7]}
              rotation={[-Math.PI / 2, 0, 0]}
              fontSize={0.22}
              font="https://fonts.gstatic.com/s/jetbrainsmono/v18/tU3q0W-55Y7aCQRwSXCFIL33_z5mOcW_8w.woff2"
              color={color}
            >
              {slot.id}
            </Text>

            {/* Occupied Slot Car Model Representation */}
            {slot.status === 'Occupied' && (
              <group scale={0.7} position={[0, 0.15, 0]}>
                {/* Simplified car body */}
                <mesh>
                  <boxGeometry args={[1.6, 0.3, 0.8]} />
                  <meshStandardMaterial color="#1E293B" metalness={0.8} roughness={0.2} />
                </mesh>
                {/* Glowing neon contour */}
                <mesh position={[0, 0, 0]}>
                  <boxGeometry args={[1.62, 0.32, 0.82]} />
                  <meshBasicMaterial color="#EF4444" wireframe />
                </mesh>
                {/* Windshield */}
                <mesh position={[0.2, 0.25, 0]}>
                  <boxGeometry args={[0.5, 0.2, 0.7]} />
                  <meshStandardMaterial color="#111827" />
                </mesh>
              </group>
            )}

            {/* Reserved Overlay Car representation (Virtual outline) */}
            {slot.status === 'Reserved' && (
              <group scale={0.7} position={[0, 0.15, 0]}>
                <mesh>
                  <boxGeometry args={[1.6, 0.3, 0.8]} />
                  <meshBasicMaterial color="#3B82F6" wireframe />
                </mesh>
              </group>
            )}
          </group>
        );
      })}
    </group>
  );
}
