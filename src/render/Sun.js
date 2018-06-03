import BaseObject from './BaseObject';
import { Lensflare } from '../third_party';

class Sun extends BaseObject {

    init() {
        this.light = new THREE.DirectionalLight(0xffffff, 0.5);
        this.add(this.light);

        var loader = new THREE.TextureLoader();
        var textureFlare0 = loader.load(`${this.app.options.assetsPath}/texture/lensflare/lensflare0.png`);
        var textureFlare3 = loader.load(`${this.app.options.assetsPath}/texture/lensflare/lensflare3.png`);

        this.lensflare = new THREE.Lensflare();
        this.lensflare.addElement(new THREE.LensflareElement(textureFlare0, 700, 0, this.light.color));
        this.lensflare.addElement(new THREE.LensflareElement(textureFlare3, 60, 0.6));
        this.lensflare.addElement(new THREE.LensflareElement(textureFlare3, 70, 0.7));
        this.lensflare.addElement(new THREE.LensflareElement(textureFlare3, 120, 0.9));
        this.lensflare.addElement(new THREE.LensflareElement(textureFlare3, 70, 1));
        this.light.add(this.lensflare);
    }

}

export default Sun;