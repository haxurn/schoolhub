"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useTheme } from "next-themes";
import { createStarField, animateStars } from "@/lib/three/starField";
import { createSchoolObjects } from "@/lib/three/schoolObjects";
import styles from '@/styles/ThreeBackground.module.css';

const ThreeBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const starVelocitiesRef = useRef<THREE.Vector3[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!containerRef.current || !mounted) return;

    const container = containerRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    let stars: THREE.Points | null = null;
    if (theme !== "dark") {
      const ambientLight = new THREE.AmbientLight(0x10ffff, 0.5);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0x10ffff, 0.8);
      directionalLight.position.set(5, 5, 5);
      scene.add(directionalLight);

      const schoolObjects = createSchoolObjects();
      scene.add(schoolObjects);
    } else {
      stars = createStarField(true);
      scene.add(stars);

      // Initialize star velocities for animation
      starVelocitiesRef.current = Array.from(
        { length: stars.geometry.attributes.position.count },
        () => new THREE.Vector3(
          Math.random() * 0.001 - 0.0005,
          Math.random() * 0.001 - 0.0005,
          Math.random() * 0.001 - 0.0005
        )
      );
    }

    camera.position.z = 8;

    const animate = () => {
      requestAnimationFrame(animate);
      if (stars) {
        animateStars(stars, starVelocitiesRef.current);
      }
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
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
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
      className={`${styles['fixed-inset']} ${theme === 'dark' ? styles.dark : ''}`}
    />
  );
};

export default ThreeBackground;
