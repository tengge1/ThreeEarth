/**
 * 地图图层
 */
var ID = -1;

class Layer {

    constructor(app) {
        this.app = app;
        this.id = `Layer${ID--}`;
        this.name = '';
    }

    add(obj) {

    }

    remove(obj) {

    }

    find(x, y, z) {

    }

}

export default Layer;