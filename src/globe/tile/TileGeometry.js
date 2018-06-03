import GeoUtils from '../../utils/GeoUtils';

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

        this.rowSegments = 16;
        this.colSegments = 16;

        var vertices = [];
        var indexes = [];
        var uvs = [];

        for (var i = 0; i <= this.rowSegments; i++) {
            for (var j = 0; j <= this.colSegments; j++) {
                var lon = this.aabb.minLon + (this.aabb.maxLon - this.aabb.minLon) / this.colSegments * j;
                var lat = this.aabb.minLat + (this.aabb.maxLat - this.aabb.minLat) / this.rowSegments * i;
                var lonlat = GeoUtils._mercatorInvert(lon, lat);
                var xyz = GeoUtils._getXYZ(lon, lat, 0);

                // 顶点
                vertices.push(
                    xyz.x,
                    xyz.y,
                    xyz.z
                );

                // 索引
                if (i > 0 && j > 0) {
                    indexes.push((this.rowSegments + 1) * i + j);
                    indexes.push((this.rowSegments + 1) * i + j - 1);
                    indexes.push((this.rowSegments + 1) * (i - 1) + j - 1);
                    indexes.push((this.rowSegments + 1) * i + j);
                    indexes.push((this.rowSegments + 1) * (i - 1) + j - 1);
                    indexes.push((this.rowSegments + 1) * (i - 1) + j);
                }

                // uv坐标
                uvs.push(
                    j / this.colSegments,
                    (lonlat.lat - this.aabb.minLat) / (this.aabb.maxLat - this.aabb.minLat)
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