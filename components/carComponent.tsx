import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF, useScroll } from "@react-three/drei";

export const Car: React.FC<{
  lightRef: React.RefObject<THREE.DirectionalLight>;
}> = ({ lightRef }) => {
  // load car model
  const { scene } = useGLTF("/model3.glb");
  const { camera } = useThree();
  camera.lookAt(scene.position);
  const scrollData = useScroll();

  // find the led meshes
  let front_led_light: THREE.Mesh | null = null;
  let rear_led_light: THREE.Mesh | null = null;
  scene.traverse((child) => {
    if (child.name === "front_led_light_strip") {
      front_led_light = child as THREE.Mesh;
    }
    if (child.name === "rear_led_red_light") {
      rear_led_light = child as THREE.Mesh;
    }
  });

  // get led material
  let front_led_light_material: THREE.MeshStandardMaterial = front_led_light!
    .material as THREE.MeshStandardMaterial;
  let rear_led_light_material: THREE.MeshStandardMaterial = rear_led_light!
    .material as THREE.MeshStandardMaterial;

  useFrame(() => {
    // start animating when we hit 0.15 and slowly ramp up intensity till 0.5
    if (scrollData.offset < 0.05) {
      lightRef.current!.position.x = 0;
      lightRef.current!.position.y = 0;
      front_led_light_material.color.setScalar(0);
      front_led_light_material.emissive.setScalar(0);

      camera.position.x = 0;
      camera.position.z = -80;
      camera.lookAt(scene.position);
    }
    if (scrollData.offset > 0.05 && scrollData.offset <= 0.15) {
      // first section for lights
      const noramlizedOffset = (scrollData.offset - 0.05) / 0.1;
      front_led_light_material.color.setScalar(noramlizedOffset);
      front_led_light_material.emissive.setScalar(noramlizedOffset);
    }
    if (scrollData.offset > 0.15 && scrollData.offset <= 0.25) {
      lightRef.current!.position.y = 1;
      const noramlizedOffset =
        1 - ((scrollData.offset - 0.15) / (0.25 - 0.15)) * 2;
      lightRef.current!.position.x = noramlizedOffset;
    }
    if (scrollData.offset > 0.25 && scrollData.offset <= 0.45) {
      lightRef.current!.position.y = 1;
      const noramlizedOffset =
        1 - ((scrollData.offset - 0.25) / (0.45 - 0.25)) * 2;
      lightRef.current!.position.x = noramlizedOffset;

      camera.position.x = ((scrollData.offset - 0.25) / (0.45 - 0.25)) * 100;
      camera.position.z =
        ((scrollData.offset - 0.25) / (0.45 - 0.25)) * 80 - 80;
      camera.lookAt(scene.position);
    }

    if (scrollData.offset > 0.45 && scrollData.offset <= 0.65) {
      camera.position.x =
        100 - ((scrollData.offset - 0.45) / (0.65 - 0.45)) * 100;
      camera.position.z = ((scrollData.offset - 0.45) / (0.65 - 0.45)) * 80;
      camera.lookAt(scene.position);
    }

    if (scrollData.offset > 0.65 && scrollData.offset <= 0.75) {
      rear_led_light_material.emissiveIntensity = 2;
      rear_led_light_material.emissive.setRGB(0.8, 0.002, 0);
    }
  });

  return <primitive object={scene} scale={0.5} />;
};
