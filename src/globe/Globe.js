import TileMesh from './tile/TileMesh';

/**
 * 地球
 */
class Globe extends THREE.Object3D {
    constructor() {
        super();
        for (var i = 0; i < 2; i++) {
            for (var j = 0; j < 2; j++) {
                this.add(new TileMesh(j, i, 1));
            }
        }
    }

    /**
     * 碰撞检测
     */
    raycast(raycaster, intersects) {
        this.children.forEach((n) => {
            n.raycast(raycaster, intersects);
        });
    }
}

export default Globe;