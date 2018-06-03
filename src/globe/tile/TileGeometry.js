import GeoUtils from '../../utils/GeoUtils';
import Wgs84 from '../ellipsoid/Wgs84';

/**
 * 瓦片几何体
 */
class TileGeometry extends THREE.BufferGeometry {
    constructor(x, y, z) {
        super();

        this.x = x;
        this.y = y;
        this.z = z;

        this.aabb = GeoUtils._getAabbByGrid(x, y, z);

        var min = GeoUtils._mercator(this.aabb.minLon, this.aabb.minLat);
        var max = GeoUtils._mercator(this.aabb.maxLon, this.aabb.maxLat);

        var segments = 32;

        var vertices = [];
        var indexes = [];
        var uvs = [];

        for (var i = 0; i <= segments; i++) {
            for (var j = 0; j <= segments; j++) {
                var x = min.lon + (max.lon - min.lon) / segments * j;
                var y = min.lat + (max.lat - min.lat) / segments * i;

                var lonlat = GeoUtils._mercatorInvert(x, y);
                var xyz = GeoUtils._getXYZ(lonlat.lon, lonlat.lat, 0);

                // 顶点
                vertices.push(
                    xyz.x,
                    xyz.y,
                    xyz.z
                );

                // 索引
                if (i > 0 && j > 0) {
                    indexes.push((segments + 1) * i + j);
                    indexes.push((segments + 1) * i + j - 1);
                    indexes.push((segments + 1) * (i - 1) + j - 1);
                    indexes.push((segments + 1) * i + j);
                    indexes.push((segments + 1) * (i - 1) + j - 1);
                    indexes.push((segments + 1) * (i - 1) + j);
                }

                // uv坐标
                uvs.push(
                    j / segments,
                    i / segments
                );
            }
        }

        this.addAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        this.setIndex(indexes);
        this.addAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
        this.computeVertexNormals();
    }
}

export default TileGeometry;