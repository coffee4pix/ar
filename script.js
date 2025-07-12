import * as THREE from 'three';
import { ARButton } from 'three/examples/jsm/webxr/ARButton.js';

// SCENE SETUP
const scene = new THREE.Scene();

// CAMERA
const camera = new THREE.PerspectiveCamera();
scene.add(camera);

// RENDERER
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.xr.enabled = true;
document.body.appendChild(renderer.domElement);

// AR Button
document.body.appendChild(ARButton.createButton(renderer, { requiredFeatures: ['hit-test'] }));

// TEXTURE LOADING
const loader = new THREE.TextureLoader();

const textures = {
  sun: loader.load('/textures/2k_sun.jpg'),
  mercury: loader.load('/textures/2k_mercury.jpg'),
  venus: loader.load('/textures/2k_venus_surface.jpg'),
  earth: loader.load('/textures/2k_earth_daymap.jpg'),
  moon: loader.load('/textures/2k_moon.jpg'),
  mars: loader.load('/textures/2k_mars.jpg')
};

// LIGHT
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(1, 2, 3);
scene.add(light);

// GEOMETRY
const sphereGeometry = new THREE.SphereGeometry(0.05, 32, 32);

// MATERIALS
const materials = {
  sun: new THREE.MeshBasicMaterial({ map: textures.sun }),
  mercury: new THREE.MeshStandardMaterial({ map: textures.mercury }),
  venus: new THREE.MeshStandardMaterial({ map: textures.venus }),
  earth: new THREE.MeshStandardMaterial({ map: textures.earth }),
  moon: new THREE.MeshStandardMaterial({ map: textures.moon }),
  mars: new THREE.MeshStandardMaterial({ map: textures.mars })
};

// SOLAR SYSTEM SETUP
const sun = new THREE.Mesh(sphereGeometry, materials.sun);
sun.scale.setScalar(3);
scene.add(sun);

const planets = [
  {
    name: "Mercury",
    radius: 0.2,
    distance: 0.3,
    speed: 0.01,
    material: materials.mercury,
    moons: [],
  },
  {
    name: "Venus",
    radius: 0.25,
    distance: 0.45,
    speed: 0.008,
    material: materials.venus,
    moons: [],
  },
  {
    name: "Earth",
    radius: 0.3,
    distance: 0.6,
    speed: 0.005,
    material: materials.earth,
    moons: [
      {
        name: "Moon",
        radius: 0.1,
        distance: 0.15,
        speed: 0.015,
      },
    ],
  },
  {
    name: "Mars",
    radius: 0.28,
    distance: 0.8,
    speed: 0.003,
    material: materials.mars,
    moons: [
      {
        name: "Phobos",
        radius: 0.08,
        distance: 0.1,
        speed: 0.02,
      },
      {
        name: "Deimos",
        radius: 0.06,
        distance: 0.14,
        speed: 0.015,
      },
    ],
  },
];

const planetMeshes = [];

planets.forEach((planet) => {
  const mesh = new THREE.Mesh(sphereGeometry, planet.material);
  mesh.scale.setScalar(planet.radius);
  sun.add(mesh);
  planet.mesh = mesh;

  planet.moons.forEach((moon) => {
    const moonMesh = new THREE.Mesh(sphereGeometry, materials.moon);
    moonMesh.scale.setScalar(moon.radius);
    mesh.add(moonMesh);
    moon.mesh = moonMesh;
  });

  planetMeshes.push(planet);
});

// CLOCK
const clock = new THREE.Clock();

// ANIMATE
renderer.setAnimationLoop(() => {
  const elapsed = clock.getElapsedTime();

  planetMeshes.forEach((planet) => {
    const angle = elapsed * planet.speed;
    planet.mesh.position.x = Math.sin(angle) * planet.distance;
    planet.mesh.position.z = Math.cos(angle) * planet.distance;

    planet.moons.forEach((moon) => {
      const moonAngle = elapsed * moon.speed;
      moon.mesh.position.x = Math.sin(moonAngle) * moon.distance;
      moon.mesh.position.z = Math.cos(moonAngle) * moon.distance;
    });
  });

  renderer.render(scene, camera);
});
