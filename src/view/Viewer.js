/**
 * 查看器
 */
var ID = -1;

class Viewer {

    constructor(app) {
        this.app = app;
        this.id = `Viewer${ID--}`;
    }

    /**
     * 启动查看
     */
    start() {

    }

    /**
     * 停止查看
     */
    stop() {

    }
}

export default Viewer;