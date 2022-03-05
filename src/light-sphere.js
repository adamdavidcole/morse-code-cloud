import * as THREE from "three";

const SPHERE_COLOR = 0xf700c1;
const LIGHT_FLICKER_PATTERN_SIZE = 10;

function defaultInitialDelay() {
	return 500 + 500 * Math.random();
}

export default class LightSphere {
	constructor({
		position = new THREE.Vector3(0, 0, 0),
		size = 1,
		intervalDeley = defaultInitialDelay(),
		flickerPattern,
	}) {
		const geometry = new THREE.SphereGeometry(size, 32, 32);
		const material = new THREE.MeshBasicMaterial({ color: SPHERE_COLOR });
		const sphere = new THREE.Mesh(geometry, material);
		sphere.position.copy(position);

		this.sphere = sphere;

		this.lightFlickerPattern = flickerPattern;
		if (!this.lightFlickerPattern) {
			for (let i = 0; i < LIGHT_FLICKER_PATTERN_SIZE; i++) {
				const lightFlickerPatternValue = Math.random() > 0.5;
				this.lightFlickerPattern.push(lightFlickerPatternValue);
			}
		}
		this.lightFlickerPatternReadPosition = 0;

		this.intervalDeley = intervalDeley;

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

	update() {
		const nextIsVisible =
			this.lightFlickerPattern[this.lightFlickerPatternReadPosition];
		this.toggleVisibility(nextIsVisible);

		this.lightFlickerPatternReadPosition =
			(this.lightFlickerPatternReadPosition + 1) %
			LIGHT_FLICKER_PATTERN_SIZE;
	}
}
