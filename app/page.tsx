"use client";

import * as THREE from "three";
import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Html,
  useProgress,
  ScrollControls,
  Scroll,
  useScroll,
} from "@react-three/drei";

import { Car } from "@/components/carComponent";
import { MapContainer } from "@/components/mapContainerComponent";

function Loader() {
  const { progress } = useProgress();
  return <Html center>{progress} % loaded</Html>;
}

const ScrollIndicator: React.FC = () => {
  const scrollData = useScroll();
  const [isVisible, setIsVisible] = useState(true);

  useFrame(() => {
    if (scrollData.offset > 0.05) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
  });

  return (
    <div
      className={`absolute left-[50vw] top-[90vh] -ml-6 w-12 ${isVisible ? "block" : "hidden"}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="h-12 w-12 animate-bounce"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m9 12.75 3 3m0 0 3-3m-3 3v-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
      </svg>
    </div>
  );
};

export default function Home() {
  const lightRef = useRef<THREE.DirectionalLight>(null);

  return (
    <main className="h-screen w-screen">
      <Canvas camera={{ position: [0, 25, -80], fov: 75 }}>
        <Suspense fallback={<Loader />}>
          <ScrollControls pages={4} damping={0.5} distance={0.5}>
            <ambientLight intensity={1} />
            <directionalLight
              ref={lightRef}
              position={[0, 1, 0]}
              intensity={5}
            />
            <Car lightRef={lightRef} />
            <Scroll html>
              <ScrollIndicator />
              <div className="absolute top-[300vh] h-dvh w-dvw p-8">
                <MapContainer />
              </div>
            </Scroll>
          </ScrollControls>
        </Suspense>
      </Canvas>
    </main>
  );
}
