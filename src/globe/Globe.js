import TileMesh from './tile/TileMesh';

class Globe extends THREE.Object3D {
    constructor() {
        super();
        for (var i = 0; i < 2; i++) {
            for (var j = 0; j < 2; j++) {
                this.add(new TileMesh(j, i, 1));
            }
        }
    }
}

export default Globe;