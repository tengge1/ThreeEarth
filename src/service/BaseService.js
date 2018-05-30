import NotImplementedException from '../exception/NotImplementedException';

/**
 * 服务基类
 */
class BaseService {

    constructor(app) {
        this.app = app;
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