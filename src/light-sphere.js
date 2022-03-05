import * as THREE from "three";

const SPHERE_COLOR = 0xf700c1;

export default class LightSphere {
	constructor({ position }) {
		const geometry = new THREE.SphereGeometry(1, 32, 32);
		const material = new THREE.MeshBasicMaterial({ color: SPHERE_COLOR });
		const sphere = new THREE.Mesh(geometry, material);
		sphere.position.copy(position);

		this.sphere = sphere;

		const intervalDeley = 500 + 500 * Math.random();
		console.log(intervalDeley);

		setInterval(() => {
			const currVisibility = !!this.sphere.visible;
			this.toggleVisibility(!currVisibility);
		}, intervalDeley);
	}

	getMesh() {
		return this.sphere;
	}

	toggleVisibility(isVisible) {
		// console.log("toggleVisibility: isVisible", isVisible);
		this.sphere.visible = isVisible;
	}

	update() {}
}
