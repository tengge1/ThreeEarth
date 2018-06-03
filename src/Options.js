/**
 * 系统配置
 */
class Options {

    constructor(options) {
        options = options || {};
        this.assetsPath = options.assetsPath || 'assets';
    }

}

export default Options;