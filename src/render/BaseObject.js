/**
 * 基本绘制对象
 */
class BaseObject extends THREE.Object3D {

    /**
     * 用于初始化基本绘制对象
     * 在将绘制对象添加到图层时，add函数会自动将app赋值给该对象，用于初始化。
     */
    init() {

    }

}

export default BaseObject;