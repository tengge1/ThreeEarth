import NotImplementedException from '../exception/NotImplementedException';

var ID = -1;

/**
 * 服务基类
 */
class BaseService {

    constructor(app) {
        this.app = app;
        this.id = 'Service' + ID--;
    }

    /**
     * 服务启动
     */
    start() {
        throw new NotImplementedException();
    }

    /**
     * 服务停止
     */
    stop() {
        throw new NotImplementedException();
    }

}

export default BaseService;