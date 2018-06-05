import Wgs84 from '../globe/ellipsoid/Wgs84';

/**
 * 地理计算工具类
 */
class GeoUtilsCls {

    constructor() {
        this.MAX_PROJECTED_COORD = 20037508.3427892; // 墨卡托最大投影坐标（地球周长一半）
    }

    /**
     * 角度转弧度
     * @param {*} deg 角度
     * @returns 弧度
     */
    radian(deg) {
        return deg * Math.PI / 180;
    }

    /**
     * 弧度转角度
     * @param {*} rad 弧度
     * @returns 角度
     */
    degree(rad) {
        return rad * 180 / Math.PI;
    }

    /**
     * 经纬度海拔转直角坐标系
     * @param {*} lon 经度（弧度）
     * @param {*} lat 维度（弧度）
     * @param {*} alt 海拔（米） / 地球半径
     * @returns 三维直角坐标系坐标
     */
    _getXYZ(lon, lat, alt = 0) {
        return {
            x: (1 + alt) * Math.cos(lat) * Math.cos(lon),
            y: (1 + alt) * Math.cos(lat) * Math.sin(lon),
            z: (1 + alt) * Math.sin(lat)
        };
    }

    /**
     * 经纬度转直角坐标系
     * @param {*} lon 经度
     * @param {*} lat 维度
     * @param {*} alt 海拔（米）
     * @returns 三维直角坐标系坐标
     */
    getXYZ(lon, lat, alt = 0) {
        return this._getXYZ(this.radian(lon), this.radian(lat), alt / Wgs84.a);
    }

    /**
     * 直角坐标系转经纬度海拔（经纬度为弧度）
     * @param {*} x 直角坐标x
     * @param {*} y 直角坐标y
     * @param {*} z 直角坐标z
     * @returns lon: 经度（弧度）, lat: 纬度（弧度）, alt: 海拔（米）/ 地球半径
     */
    _getLonLat(x, y, z) {
        return {
            lon: Math.sign(y) * Math.acos(y / Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))), // -PI ~ PI
            lat: Math.atan(z / Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))), // -PI / 2 ~ PI / 2
            alt: Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2)) - 1
        };
    }

    /**
     * 直角坐标系转经纬度海拔
     * @param {*} x 直角坐标x
     * @param {*} y 直角坐标y
     * @param {*} z 直角坐标z
     * @returns lon: 经度, lat: 纬度, alt: 海拔（米）
     */
    getLonLat(x, y, z) {
        const result = this._getLonLat(x, y, z);
        return {
            lon: this.degree(result.lon),
            lat: this.degree(result.lat),
            alt: result.alt * Wgs84.a
        };
    }

    /**
     * 墨卡托投影
     * @param {*} lon 经度（弧度）
     * @param {*} lat 维度（弧度）
     * @returns lon: 墨卡托x, lat: 墨卡托y
     * @see https://github.com/d3/d3-geo/blob/master/src/projection/mercator.js
     */
    _mercator(lon, lat) {
        return {
            lon: lon,
            lat: Math.log(Math.tan((Math.PI / 2 + lat) / 2))
        };
    }

    /**
     * 墨卡托投影
     * @param {*} lon 经度
     * @param {*} lat 维度
     * @returns lon: 墨卡托坐标x, lat: 墨卡托坐标y
     */
    mercator(lon, lat) {
        return this._mercator(lon, this.radian(lat));
    }

    /**
     * 墨卡托投影反算
     * @param {*} x 墨卡托坐标x
     * @param {*} y 墨卡托坐标y
     * @returns lon: 经度（弧度）, lat: 纬度（弧度）
     * @see https://github.com/d3/d3-geo/blob/master/src/projection/mercator.js
     */
    _mercatorInvert = function (x, y) {
        return {
            lon: x,
            lat: 2 * Math.atan(Math.exp(y)) - Math.PI / 2
        };
    }

    /**
     * 墨卡托投影反算
     * @param {*} x 墨卡托坐标x
     * @param {*} y 墨卡托坐标y
     * @returns lon: 经度, lat: 纬度
     */
    mercatorInvert(x, y) {
        const result = this._mercatorInvert(x, y);
        return {
            lon: result.lon,
            lat: this.degree(result.lat)
        };
    }

    /**
     * 获取切片的墨卡托投影坐标范围
     * @param {*} x 切片坐标x
     * @param {*} y 切片坐标y
     * @param {*} z 层级level
     * @returns 切片的墨卡托投影坐标范围
     */
    getMercatorAabbByGrid(x, y, z) {
        const size = 2 * this.MAX_PROJECTED_COORD / Math.pow(2, z);
        const minX = -this.MAX_PROJECTED_COORD + x * size;
        const maxX = minX + size;
        const maxY = this.MAX_PROJECTED_COORD - y * size;
        const minY = maxY - size;
        return {
            minX: minX,
            minY: minY,
            maxX: maxX,
            maxY: maxY
        };
    };

    /**
     * 获取切片的经纬度坐标范围（弧度）
     * @param {*} x 切片坐标x
     * @param {*} y 切片坐标y
     * @param {*} z 层级level
     * @returns 经纬度坐标范围（弧度）
     */
    _getAabbByGrid(x, y, z) {
        const aabb = this.getMercatorAabbByGrid(x, y, z);
        const min = this._mercatorInvert(aabb.minX / Wgs84.a, aabb.minY / Wgs84.a);
        const max = this._mercatorInvert(aabb.maxX / Wgs84.a, aabb.maxY / Wgs84.a);
        return {
            minLon: min.lon,
            minLat: min.lat,
            maxLon: max.lon,
            maxLat: max.lat
        };
    };

    /**
     * 获取切片的经纬度坐标范围
     * @param {*} x 切片坐标x
     * @param {*} y 切片坐标y
     * @param {*} z 切片坐标z
     * @returns 经纬度坐标范围
     */
    getAabbByGrid(x, y, z) {
        const result = this._getAabbByGrid(x, y, z);
        return {
            minLon: this.degree(result.minLon),
            minLat: this.degree(result.minLat),
            maxLon: this.degree(result.maxLon),
            maxLat: this.degree(result.maxLat)
        };
    }

    /**
     * 计算两个点表示的直线与圆的交点
     * @param {*} x1 点一坐标x
     * @param {*} y1 点一坐标y
     * @param {*} z1 点一坐标z
     * @param {*} x2 点二坐标x
     * @param {*} y2 点二坐标y
     * @param {*} z2 点二坐标z
     * @returns 两个交点
     */
    lineIntersectGlobe(x1, y1, z1, x2, y2, z2) {
        var a = Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2) + Math.pow(z1 - z2, 2);
        var b = 2 * (Math.pow(x1, 2) - x1 * x2 + Math.pow(y1, 2) - y1 * y2 + Math.pow(z1, 2) - z1 * z2);
        var c = Math.pow(x1, 2) + Math.pow(y1, 2) + Math.pow(z1, 2) - 1;
        var delta = Math.pow(b, 2) - 4 * a * c;

        var k1, k2;
        if (delta > 0) { // 两个交点
            k1 = (-b + Math.sqrt(delta)) / (2 * a);
            k2 = (-b - Math.sqrt(delta)) / (2 * a);
        } else if (delta === 0) { // 相切
            k1 = k2 = -b / (2 * a);
        } else { // 不相交
            return null;
        }

        if (k1 === k2) { // 一个点
            return [{
                x: x1 + k1 * (x1 - x2),
                y: y1 + k1 * (y1 - y2),
                z: z1 + k1 * (z1 - z2)
            }]
        } else { // 两个点
            return [{
                x: x1 + k1 * (x1 - x2),
                y: y1 + k1 * (y1 - y2),
                z: z1 + k1 * (z1 - z2)
            }, {
                x: x1 + k2 * (x1 - x2),
                y: y1 + k2 * (y1 - y2),
                z: z1 + k2 * (z1 - z2)
            }]
        }
    }
}

const GeoUtils = new GeoUtilsCls()

export default GeoUtils;