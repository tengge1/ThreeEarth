import TileMesh from './tile/TileMesh';

class Globe extends THREE.Object3D {
    constructor() {
        super();
        var sphere = new THREE.SphereBufferGeometry(1, 32, 32);
        var material = new THREE.MeshBasicMaterial({
            color: new THREE.Color(0x244ba3),
            transparent: true,
            opacity: 0.5
        });
        this.add(new THREE.Mesh(sphere, material));

        for (var i = 0; i < 2; i++) {
            for (var j = 0; j < 2; j++) {
                this.add(new TileMesh(j, i, 1));
            }
        }
    }
}

export default Globe;