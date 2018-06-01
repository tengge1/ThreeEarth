import Wgs84 from '../globe/ellipsoid/Wgs84';

/**
 * 地理计算工具类
 */
class GeoUtilsCls {
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
     * @returns { lon: 经度（弧度）, lat: 纬度（弧度）, alt: 海拔（米）/ 地球半径 }
     */
    _getLonLat(x, y, z) {
        return {
            lon: Math.sign(y) * Math.acos(y / Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))), // -PI ~ PI
            lat: Math.atan(z / Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))), // -PI / 2 ~ PI / 2
            alt: 1 - Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2))
        };
    }

    /**
     * 直角坐标系转经纬度海拔
     * @param {*} x 直角坐标x
     * @param {*} y 直角坐标y
     * @param {*} z 直角坐标z
     * @returns { lon: 经度, lat: 纬度, alt: 海拔（米 }
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
     * @returns { lon: 墨卡托x, lat: 墨卡托y }
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
     * @returns { lon: 墨卡托坐标x, lat: 墨卡托坐标y }
     */
    mercator(lon, lat) {
        return this._mercator(lon, this.radian(lat));
    }

    /**
     * 墨卡托投影反算
     * @param {*} x 墨卡托坐标x
     * @param {*} y 墨卡托坐标y
     * @returns { lon: 经度（弧度）, lat: 纬度（弧度） }
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
     * @returns { lon: 经度, lat: 纬度 }
     */
    mercatorInvert(x, y) {
        const result = this._mercatorInvert(x, y);
        return {
            lon: result.lon,
            lat: this.degree(result.lat)
        };
    }
}

const GeoUtils = new GeoUtilsCls()

export default GeoUtils;