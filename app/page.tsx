"use client";

import * as THREE from "three";
import { Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Html, useProgress, ScrollControls, Scroll } from "@react-three/drei";

import { Car } from "@/components/carComponent";
import { MapContainer } from "@/components/mapContainerComponent";

function Loader() {
  const { progress } = useProgress();
  return <Html center>{progress} % loaded</Html>;
}

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
              intensity={10}
            />
            <Car lightRef={lightRef} />
            <Scroll html>
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
