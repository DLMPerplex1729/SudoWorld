'use client';

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface CubeView3DProps {
  cube: number[][][];
  selectedCell: { x: number; y: number; z: number } | null;
  onCellClick: (x: number, y: number, z: number) => void;
}

const CubeView3D: React.FC<CubeView3DProps> = ({ cube, selectedCell, onCellClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(5, 5, 5);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5);
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Create cube cells
    const cellSize = 0.4;
    const groupGeometry = new THREE.Group();

    for (let x = 0; x < 4; x++) {
      for (let y = 0; y < 4; y++) {
        for (let z = 0; z < 4; z++) {
          const geometry = new THREE.BoxGeometry(cellSize, cellSize, cellSize);
          const material = new THREE.MeshStandardMaterial({
            color: selectedCell && selectedCell.x === x && selectedCell.y === y && selectedCell.z === z
              ? 0x3b82f6
              : 0xcccccc,
            wireframe: false
          });
          const mesh = new THREE.Mesh(geometry, material);
          mesh.position.set(x * cellSize - 0.6, y * cellSize - 0.6, z * cellSize - 0.6);
          mesh.userData = { x, y, z };
          groupGeometry.add(mesh);
        }
      }
    }

    scene.add(groupGeometry);

    // Mouse interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseClick = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(groupGeometry.children);

      if (intersects.length > 0) {
        const object = intersects[0].object as any;
        const { x, y, z } = object.userData;
        onCellClick(x, y, z);
      }
    };

    renderer.domElement.addEventListener('click', onMouseClick);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      groupGeometry.rotation.x += 0.001;
      groupGeometry.rotation.y += 0.001;
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      renderer.domElement.removeEventListener('click', onMouseClick);
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, [cube, selectedCell, onCellClick]);

  return <div ref={containerRef} style={{ width: '100%', height: '500px' }} />;
};

export default CubeView3D;
