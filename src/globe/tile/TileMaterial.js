import { TileSystem } from '../../third_party';

class TileMaterial extends THREE.MeshBasicMaterial {
    constructor(x, y, z) {
        const key = TileSystem.tileXYToQuadKey(x, y, z);
        const url = `https://ecn.t0.tiles.virtualearth.net/tiles/a${key}.jpeg?g=6467`;
        const texture = new THREE.TextureLoader().load(url);

        super({
            map: texture
        });
    }
}

export default TileMaterial;