import * as THREE from "three";

export function createSchoolObjects() {
  const group = new THREE.Group();
  
  // Create floating books
  const books = createBooks();
  group.add(books);
  
  // Create floating pencils
  const pencils = createPencils();
  group.add(pencils);
  
  // Create floating geometric shapes
  const shapes = createShapes();
  group.add(shapes);
  
  return group;
}

function createBooks() {
  const group = new THREE.Group();
  const bookGeometry = new THREE.BoxGeometry(0.5, 0.7, 0.1);
  
  for (let i = 0; i < 15; i++) {
    const color = new THREE.Color().setHSL(Math.random() * 0.2 + 0.5, 0.65, 0.6);
    const material = new THREE.MeshPhongMaterial({ color });
    const book = new THREE.Mesh(bookGeometry, material);
    
    book.position.set(
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10
    );
    book.rotation.set(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    );
    group.add(book);
  }
  
  return group;
}

function createPencils() {
  const group = new THREE.Group();
  const pencilGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1, 6);
  const pencilMaterial = new THREE.MeshPhongMaterial({ color: 0xffd700 });
  
  for (let i = 0; i < 10; i++) {
    const pencil = new THREE.Mesh(pencilGeometry, pencilMaterial);
    pencil.position.set(
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10
    );
    pencil.rotation.set(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    );
    group.add(pencil);
  }
  
  return group;
}

function createShapes() {
  const group = new THREE.Group();
  const geometries = [
    new THREE.TetrahedronGeometry(0.3),
    new THREE.OctahedronGeometry(0.3),
    new THREE.DodecahedronGeometry(0.3)
  ];
  
  for (let i = 0; i < 12; i++) {
    const geometry = geometries[Math.floor(Math.random() * geometries.length)];
    const color = new THREE.Color().setHSL(Math.random() * 0.2 + 0.5, 0.75, 0.65);
    const material = new THREE.MeshPhongMaterial({ color, transparent: true, opacity: 0.8 });
    const shape = new THREE.Mesh(geometry, material);
    
    shape.position.set(
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10
    );
    shape.rotation.set(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    );
    group.add(shape);
  }
  
  return group;
}