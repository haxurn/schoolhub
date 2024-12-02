"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useTheme } from "next-themes";
import { createStarField } from "@/lib/three/starField";
import { createSchoolObjects } from "@/lib/three/schoolObjects";

const ThreeBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!containerRef.current || !mounted) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    if (theme !== "dark") {
      const ambientLight = new THREE.AmbientLight(0x10ffff, 0.1);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0x10ffff, 0.1);
      directionalLight.position.set(5, 5, 5);
      scene.add(directionalLight);

      const schoolObjects = createSchoolObjects();
      scene.add(schoolObjects);
    } else {
      const stars = createStarField(true);
      scene.add(stars);
    }

    camera.position.z = 8;

    const animate = () => {
      requestAnimationFrame(animate);
      scene.traverse((object) => {
        if (object instanceof THREE.Group || object instanceof THREE.Points) {
          object.rotation.x += 0.0005;
          object.rotation.y += 0.0005;
        }
      });

      renderer.render(scene, camera);
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
    };

    window.addEventListener("resize", handleResize);
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (containerRef.current?.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          object.material.dispose();
        }
      });
      renderer.dispose();
    };
  }, [theme, mounted]);

  if (!mounted) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 -z-10"
      style={{
        background: theme === "dark"
          ? "radial-gradient(circle at center, #1a237e 0%, #000000 100%)"
          : "radial-gradient(circle at center, #f0f4ff 0%, #ffffff 100%)"
      }}
    />
  );
};

export default ThreeBackground;
