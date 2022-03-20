import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
import LightSphere from "./light-sphere";
import LightSphereGrid from "./light-sphere-grid";
import { convertToMorse } from "./utilities/morse-code";
import { Vector2 } from "three";
import { map } from "./utilities/math";

let gridUpdateIntervalInSecs = 0.25;
let patterns = {
	flickering: "flickering",
	wave_horizontal: "wave_horizontal",
	wave_circle: "wave_circle",
};
/**
 * Base
 */
// Debug
const gui = new dat.GUI();
const debugValues = {
	gridUpdateIntervalInSecs: 0.25,
	pattern: patterns.flickering,
};

// gui.add(debugValues, "gridUpdateIntervalInSecs", 0.01, 2, 0.1);
gui.add(debugValues, "pattern", patterns).onChange((v) => {
	console.log("Begin new pattern: " + v);

	if (v == patterns.flickering) {
		beginFlickerPattern();
	}
	if (v == patterns.wave_horizontal) {
		beginWaveHorizontalPattern();
	}
	if (v == patterns.wave_circle) {
		beginWaveCirclePattern();
	}
});

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */

/**
 * Test mesh
 */
const lightSpheres = [];
let spacing = 15;

for (let i = -7; i <= 7; i++) {
	for (let j = -7; j <= 7; j++) {
		const distance = new THREE.Vector2(i, j).distanceTo(new Vector2(0, 0));
		const maxDistance = Math.sqrt(7 * 7);
		const height = map(distance, 0, Math.sqrt(7 * 7), 30, 0);
		const lightSphere = new LightSphere({
			position: new THREE.Vector3(
				i * spacing,
				// Math.cos(distance) * 15 + (maxDistance - distance) * 10,
				Math.sin(i / 2 + (j / 10) * (-j / 8)) * spacing * 3 +
					Math.cos(j / 3 + (i / 10) * (-i / 8)) * spacing * 2,
				j * spacing
			),
			size: 7,
			gridPosition: new THREE.Vector2(i, j),
		});

		scene.add(lightSphere.getMesh());
		lightSpheres.push(lightSphere);
	}
}

// const lightSphereGrid = new LightSphereGrid();

// lightSphereGrid.addGridToScene(scene);

scene.background = new THREE.CubeTextureLoader()
	.setPath("textures/cubeMaps/tent/HD/")
	.load(["px.png", "nx.png", "py.png", "ny.png", "pz.png", "nz.png"]);

/**
 * LIGHT SOURCE
 */
const light = new THREE.AmbientLight(0x404040); // soft white light
scene.add(light);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.75);
scene.add(directionalLight);

/**
 * Sizes
 */
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
};

window.addEventListener("resize", () => {
	// Update sizes
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;

	// Update camera
	camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix();

	// Update renderer
	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
	75,
	sizes.width / sizes.height,
	0.1,
	1000
);
camera.position.set(0.25, -50.25, -300);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.25;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Patterns
 */
let currInterval;

function beginWaveHorizontalPattern() {
	clearInterval(currInterval);

	let currWavePos = -7;
	currInterval = setInterval(() => {
		if (currWavePos > 7) currWavePos = -7;

		lightSpheres.forEach((lightSphere) => {
			if (lightSphere.gridPosition.x == currWavePos) {
				lightSphere.toggleLightOn();
			}
		});

		currWavePos++;
	}, 150);
}

function beginWaveCirclePattern() {
	clearInterval(currInterval);

	let currWavePos = 0;
	currInterval = setInterval(() => {
		if (currWavePos > 14) currWavePos = 0;

		lightSpheres.forEach((lightSphere) => {
			const x = Math.abs(lightSphere.gridPosition.x);
			const y = Math.abs(lightSphere.gridPosition.y);
			if (x + y == currWavePos) {
				lightSphere.toggleLightOn();
			}
		});

		currWavePos++;
	}, 150);
}

function beginFlickerPattern() {
	clearInterval(currInterval);

	currInterval = setInterval(() => {
		lightSpheres.forEach((lightSphere) => {
			if (Math.random() > 0.99) {
				lightSphere.toggleLightOn();
			}
		});
	}, 20);
}

beginFlickerPattern();

/**
 * Animate
 */
let nextGridUpdate = 0;
const clock = new THREE.Clock();

const tick = () => {
	const { gridUpdateIntervalInSecs } = debugValues;

	const elapsedTime = clock.getElapsedTime();

	// random
	lightSpheres.forEach((lightSphere) => {
		lightSphere.update();
	});

	// Update material
	// material.uniforms.uTime.value = elapsedTime
	if (elapsedTime > nextGridUpdate) {
		// lightSphereGrid.update();

		nextGridUpdate = elapsedTime + gridUpdateIntervalInSecs;
	}

	// Update controls
	controls.update();

	// Render
	renderer.render(scene, camera);

	// Call tick again on the next frame
	window.requestAnimationFrame(tick);
};

tick();
