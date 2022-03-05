import * as THREE from "three";
import LightSphere from "./light-sphere";
import { map } from "./utilities/math";
import { getRandomMessages } from "./utilities/random-messages";
import {
	convertStringToMorseFlickerPattern,
	getFlickerPatternDistance,
} from "./utilities/morse-code";

const SPHERE_COLUMN_COUNT = 20;
const SPHERE_ROW_COUNT = 1;

const SPHERE_SIZE = 2;

const GRID_WIDTH = 150;
const GRID_HEIGHT = 100;

export default class LightSphereGrid {
	constructor() {
		this.lightSphereGrid = [];

		const randomMessages = getRandomMessages();
		const lightFlickerPatterns = randomMessages.map((randomMessage) =>
			convertStringToMorseFlickerPattern(randomMessage)
		);
		const firstFlickerPattern = lightFlickerPatterns[0];
		lightFlickerPatterns.sort((firstEl, secondEl) => {
			const distanceA = getFlickerPatternDistance(
				firstFlickerPattern,
				firstEl
			);
			const distanceB = getFlickerPatternDistance(
				firstFlickerPattern,
				secondEl
			);

			if (distanceA < distanceB) return -1;
			if (distanceA == distanceB) return 0;
			return 1;
		});
		for (let i = 0; i < lightFlickerPatterns.length; i++) {
			const distance = getFlickerPatternDistance(
				firstFlickerPattern,
				lightFlickerPatterns[i]
			);
			console.log("distance", distance);
		}

		for (let i = 0; i < SPHERE_COLUMN_COUNT; i++) {
			this.lightSphereGrid.push([]);
			for (let j = 0; j < SPHERE_ROW_COUNT; j++) {
				const x =
					SPHERE_COLUMN_COUNT === 1
						? 0
						: map(
								i,
								0,
								SPHERE_COLUMN_COUNT - 1,
								-GRID_WIDTH / 2,
								GRID_WIDTH / 2
						  );
				const y =
					SPHERE_ROW_COUNT === 1
						? 0
						: map(
								j,
								0,
								SPHERE_ROW_COUNT - 1,
								-GRID_HEIGHT / 2,
								GRID_HEIGHT / 2
						  );

				const position = new THREE.Vector3(x, y, 0);
				// const intervalDeley = 500 + i * j * 25;

				const randomMessage = randomMessages.pop();
				const flickerPattern = lightFlickerPatterns[i];
				this.lightSphereGrid[i].push(
					new LightSphere({
						position,
						size: SPHERE_SIZE,
						flickerPattern,
					})
				);
			}
		}

		console.log("this.lightSphereGrid", this.lightSphereGrid);
	}

	addGridToScene(scene) {
		for (let i = 0; i < SPHERE_COLUMN_COUNT; i++) {
			for (let j = 0; j < SPHERE_ROW_COUNT; j++) {
				const lightSphere = this.lightSphereGrid[i][j];
				scene.add(lightSphere.getMesh());
			}
		}
	}

	update() {
		for (let i = 0; i < SPHERE_COLUMN_COUNT; i++) {
			for (let j = 0; j < SPHERE_ROW_COUNT; j++) {
				const lightSphere = this.lightSphereGrid[i][j];
				lightSphere.update();
			}
		}
		console.log("update grid");
	}
}
