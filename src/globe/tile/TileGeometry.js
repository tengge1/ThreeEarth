import GeoUtils from '../../utils/GeoUtils';

/**
 * 瓦片几何体
 */
class TileGeometry extends THREE.BufferGeometry {
    constructor(x, y, z) {
        super();

        var options = options || {};
        this.width = 2 * Math.PI * 1 / Math.pow(2, z);
        this.height = 2 * Math.PI * 1 / Math.pow(2, z);
        this.widthSegments = 16;
        this.heightSegments = 16;

        var vertices = [];
        var indexes = [];
        var uvs = [];

        var lonPerTile = 2 * Math.PI / Math.pow(2, z);
        var latPerTile = Math.PI / Math.pow(2, z);

        for (var i = 0; i <= this.widthSegments; i++) {
            for (var j = 0; j <= this.heightSegments; j++) {
                var lon = lonPerTile * x + lonPerTile / this.widthSegments * i - Math.PI;
                var lat = Math.PI / 2 - (latPerTile * y + latPerTile / this.heightSegments * j);
                var xyz = GeoUtils.getXYZ(lon, lat, 0);

                // 顶点
                vertices.push(
                    xyz.x,
                    xyz.y,
                    xyz.z
                );

                // uv坐标
                uvs.push(
                    i / this.widthSegments,
                    j / this.heightSegments
                );

                // 索引
                if (i > 0 && j > 0) {
                    indexes.push((this.widthSegments + 1) * j + i);
                    indexes.push((this.widthSegments + 1) * j + i - 1);
                    indexes.push((this.widthSegments + 1) * (j - 1) + i - 1);
                    indexes.push((this.widthSegments + 1) * j + i);
                    indexes.push((this.widthSegments + 1) * (j - 1) + i - 1);
                    indexes.push((this.widthSegments + 1) * (j - 1) + i);
                }
            }
        }

        this.addAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        this.addAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
        this.setIndex(indexes);
        this.computeVertexNormals();
    }
}

export default TileGeometry;