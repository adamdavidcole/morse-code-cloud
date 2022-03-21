import * as THREE from "three";
import { FLICKER_PATTERN_SIZE } from "./utilities/constants";

const SPHERE_COLOR = 0x3c2537;
const EMISSIVE_COOR = 0xf700c1;

function defaultInitialDelay() {
	return 500 + 500 * Math.random();
}

const lightOffIntensity = 0.3;

// const lightOffMaterial = new THREE.MeshPhysicalMaterial({
// 	color: new THREE.Color(SPHERE_COLOR),
// 	emissive: new THREE.Color(EMISSIVE_COOR),
// 	emissiveIntensity: 0.3,
// 	reflectivity: 0.75,
// 	transparent: true,
// 	opacity: 0.3,
// 	depthTest: true,
// 	depthWrite: true,
// 	visible: true,
// 	side: THREE.DoubleSide,
// });
// const lightOnMaterial = new THREE.MeshPhysicalMaterial({
// 	color: new THREE.Color(SPHERE_COLOR),
// 	emissive: new THREE.Color(EMISSIVE_COOR),
// 	emissiveIntensity: 0.3,
// 	reflectivity: 0.75,
// 	transparent: true,
// 	opacity: 0.3,
// 	depthTest: true,
// 	depthWrite: true,
// 	visible: true,
// 	side: THREE.DoubleSide,
// });

export default class LightSphere {
	constructor({
		position = new THREE.Vector3(0, 0, 0),
		size = 1,
		intervalDeley = defaultInitialDelay(),
		flickerPattern,
		gridPosition,
	}) {
		const geometry = new THREE.SphereGeometry(size, 32, 32);
		const material = new THREE.MeshPhysicalMaterial({
			color: new THREE.Color(SPHERE_COLOR),
			emissive: new THREE.Color(EMISSIVE_COOR),
			emissiveIntensity: 0.3,
			reflectivity: 0.75,
			transparent: true,
			opacity: 0.75,
			depthTest: true,
			depthWrite: true,
			visible: true,
			side: THREE.DoubleSide,
		});
		// const material = new THREE.MeshBasicMaterial({ color: SPHERE_COLOR });
		const sphere = new THREE.Mesh(geometry, material);
		sphere.position.copy(position);

		this.sphere = sphere;
		this.lightOn = false;
		this.isTurningLightOn = false;
		this.lightOnTime = 0;
		this.gridPosition = gridPosition;

		// this.lightFlickerPattern = flickerPattern;
		// if (!this.lightFlickerPattern) {
		// 	this.lightFlickerPattern = [];
		// 	for (let i = 0; i < FLICKER_PATTERN_SIZE; i++) {
		// 		const lightFlickerPatternValue = Math.random() > 0.5;
		// 		this.lightFlickerPattern.push(lightFlickerPatternValue);
		// 	}
		// }
		// this.lightFlickerPatternReadPosition = 0;

		// this.intervalDeley = intervalDeley;

		// setInterval(() => {
		// 	const currVisibility = !!this.sphere.visible;
		// 	this.toggleVisibility(!currVisibility);
		// }, intervalDeley);
	}

	getMesh() {
		return this.sphere;
	}

	toggleVisibility(isVisible) {
		// console.log("toggleVisibility: isVisible", isVisible);
		this.sphere.visible = isVisible;
	}

	toggleVisibility(isVisible) {
		// console.log("toggleVisibility: isVisible", isVisible);
		this.sphere.visible = isVisible;
	}

	toggleLightOn() {
		this.lightOn = true;
		this.isTurningLightOn = true;
		this.lightOnTime = Date.now();
	}

	update() {
		if (this.isTurningLightOn) {
			this.sphere.material.emissiveIntensity =
				this.sphere.material.emissiveIntensity * 1.05;

			if (this.sphere.material.emissiveIntensity >= 0.99) {
				this.sphere.material.emissiveIntensity = 1.0;
				this.isTurningLightOn = false;
			}
		}

		if (this.lightOn) {
			if (Date.now() - this.lightOnTime > 750) {
				this.sphere.material.emissiveIntensity =
					this.sphere.material.emissiveIntensity * 0.99;
			}
		}

		if (this.sphere.material.emissiveIntensity <= lightOffIntensity) {
			this.sphere.material.emissiveIntensity = lightOffIntensity;
			this.lightOn = false;
		}
		// const nextIsVisible =
		// 	this.lightFlickerPattern[this.lightFlickerPatternReadPosition];
		// this.toggleVisibility(nextIsVisible);
		// this.lightFlickerPatternReadPosition =
		// 	(this.lightFlickerPatternReadPosition + 1) % FLICKER_PATTERN_SIZE;
	}
}
