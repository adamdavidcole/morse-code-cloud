import * as THREE from "three";
import LightSphere from "./light-sphere";
import { map } from "./utilities/math";

const SPHERE_ROW_COUNT = 10;
const SPHERE_COLUMN_COUNT = 10;

const GRID_WIDTH = 100;
const GRID_HEIGHT = 100;

export default class LightSphereGrid {
	constructor() {
		this.lightSphereGrid = [];

		for (let i = 0; i < SPHERE_ROW_COUNT; i++) {
			this.lightSphereGrid.push([]);
			for (let j = 0; j < SPHERE_COLUMN_COUNT; j++) {
				const x =
					SPHERE_ROW_COUNT === 1
						? 0
						: map(
								i,
								0,
								SPHERE_ROW_COUNT - 1,
								-GRID_WIDTH / 2,
								GRID_WIDTH / 2
						  );
				const y =
					SPHERE_COLUMN_COUNT === 1
						? 0
						: map(
								j,
								0,
								SPHERE_COLUMN_COUNT - 1,
								-GRID_HEIGHT / 2,
								GRID_HEIGHT / 2
						  );

				const position = new THREE.Vector3(x, y, 0);

				this.lightSphereGrid[i].push(new LightSphere({ position }));
			}
		}

		console.log("this.lightSphereGrid", this.lightSphereGrid);
	}

	addGridToScene(scene) {
		for (let i = 0; i < SPHERE_ROW_COUNT; i++) {
			for (let j = 0; j < SPHERE_COLUMN_COUNT; j++) {
				const lightSphere = this.lightSphereGrid[i][j];
				scene.add(lightSphere.getMesh());
			}
		}
	}
}
