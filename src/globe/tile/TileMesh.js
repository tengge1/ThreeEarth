import TileGeometry from './TileGeometry';
import TileMaterial from './TileMaterial';

/**
 * 三维瓦片网格
 */
class TileMesh extends THREE.Mesh {
    constructor(x, y, z) {
        var geometry = new TileGeometry(x, y, z);
        var material = new TileMaterial(x, y, z);
        super(geometry, material);

        this.frustumCulled = false;

        // 每个tile度数 * 第x个tile + 半个tile度数
        const posX = -Math.cos(2 * Math.PI / Math.pow(2, z) * (x + 0.5));
        const posY = Math.sign(x - Math.pow(2, z) / 2 + 0.5) * Math.sin(Math.PI / Math.pow(2, z) * (y + 0.5));
        const posZ = Math.cos(Math.PI / Math.pow(2, z) * (y + 0.5));
        // this.position.set(posX, posY, posZ);
        // this.lookAt(this.position.clone().multiplyScalar(2));
    }
}

export default TileMesh;