import { tileSystem } from '../../third_party';

class TileMaterial extends THREE.MeshBasicMaterial {
    constructor(x, y, z) {
        const key = tileSystem.tileXYToQuadKey(x, y, z);
        const url = `https://ecn.t0.tiles.virtualearth.net/tiles/a${key}.jpeg?g=6467`;
        const texture = new THREE.TextureLoader().load(url);

        super({
            map: texture,
            polygonOffset: true,
            polygonOffsetFactor: -100
        });
    }
}

export default TileMaterial;