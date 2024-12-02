// lib/three/starField.ts

import * as THREE from "three";

export const createStarField = (isDarkMode: boolean): THREE.Points => {
  const starsGeometry = new THREE.BufferGeometry();
  const starsMaterial = new THREE.PointsMaterial({
    color: isDarkMode ? 0xffffff : 0x000000,
    size: 0.1,
    transparent: true,
    opacity: 0.8,
  });

  const starsVertices: number[] = [];
  const starVelocities: THREE.Vector3[] = [];

  for (let i = 0; i < 5000; i++) {
    const x = (Math.random() - 0.5) * 2000;
    const y = (Math.random() - 0.5) * 2000;
    const z = (Math.random() - 0.5) * 2000;
    starsVertices.push(x, y, z);

    const velocity = new THREE.Vector3(
      Math.random() * 0.01 - 0.0005,
      Math.random() * 0.01 - 0.0005,
      Math.random() * 0.01 - 0.0005
    );
    starVelocities.push(velocity);
  }

  starsGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(starsVertices, 3)
  );

  return new THREE.Points(starsGeometry, starsMaterial);
};

export const animateStars = (points: THREE.Points, starVelocities: THREE.Vector3[]) => {
  const starsGeometry = points.geometry as THREE.BufferGeometry;
  const positions = starsGeometry.attributes.position.array as Float32Array;

  for (let i = 0; i < positions.length; i += 3) {
    const velocity = starVelocities[i / 3];
    positions[i] += velocity.x;
    positions[i + 1] += velocity.y;
    positions[i + 2] += velocity.z;

    if (positions[i] >= 5000 || positions[i] < -1000) {
      positions[i] = (Math.random() - 0.5) * 2000;
    }
    if (positions[i + 1] >= 5000 || positions[i + 1] < -1000) {
      positions[i + 1] = (Math.random() - 0.5) * 2000;
    }
    if (positions[i + 2] >= 5000 || positions[i + 2] < -1000) {
      positions[i + 2] = (Math.random() - 0.5) * 2000;
    }
  }
  starsGeometry.attributes.position.needsUpdate = true;
};
