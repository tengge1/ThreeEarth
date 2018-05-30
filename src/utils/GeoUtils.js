import Wgs84 from '../globe/ellipsoid/Wgs84';

/**
 * 地理计算工具类
 */
class GeoUtilsCls {
    /**
     * 角度转弧度
     * @param {*} deg 角度
     */
    radian(deg) {
        return deg * Math.PI / 180;
    }

    /**
     * 弧度转角度
     * @param {*} rad 弧度
     */
    degree(rad) {
        return rad * 180 / Math.PI;
    }

    /**
     * 经纬度海拔转直角坐标系
     * @param {*} lon 经度（弧度）
     * @param {*} lat 维度（弧度）
     * @param {*} alt 海拔（米）
     */
    getXYZ(lon, lat, alt = 0) {
        return {
            x: (1 + alt / Wgs84.a) * Math.cos(lat) * Math.cos(lon),
            y: (1 + alt / Wgs84.a) * Math.cos(lat) * Math.sin(lon),
            z: (1 + alt / Wgs84.a) * Math.sin(lat)
        };
    }

    /**
     * 直角坐标系转经纬度海拔（经纬度为弧度）
     * @param {*} x 
     * @param {*} y 
     * @param {*} z 
     */
    getLonLat(x, y, z) {
        return {
            lon: Math.acos(x / (1 + alt / Wgs84.a)),
            lat: Math.asin(y / (1 + alt / Wgs84.a)),
            alt: (Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2)) - 1) * Wgs84.a
        };
    }

}

const GeoUtils = new GeoUtilsCls()

export default GeoUtils;