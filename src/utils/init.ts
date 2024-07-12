import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default class threeScene {
    
    _renderer: THREE.WebGLRenderer;
    _camera: THREE.PerspectiveCamera;
    _scene: THREE.Scene;
    _controls: OrbitControls
    _canvas: HTMLElement;

    _aspect: number;

    //Scene elements
    _geometry: THREE.BufferGeometry;
    _material: THREE.Material;
    _mesh: THREE.Mesh;
    _model: THREE.BufferGeometry;
    _pointLight: THREE.light;
    _pointLight2: THREE.light;

    //Loaders
    _loader: THREE.GLTFLoader;

    constructor(canvas: HTMLElement){
        this._canvas = canvas;
        this._aspect = canvas.clientWidth / canvas.clientHeight;
        this._scene = new THREE.Scene();
        this._scene.add(new THREE.AmbientLight(0x111122));


        this._camera = new THREE.PerspectiveCamera(
            65,
            this._aspect,
            0.1,
            1000
        );
        this._camera.position.set(0, -40000, 40);

        this._pointLight = this.createLight(0x0088ff);
        this._scene.add(this._pointLight);

        this._pointLight2 = this.createLight(0xff8888);
        this._scene.add(this._pointLight2);

        this._material = new THREE.MeshPhongMaterial({
            color: 0xa0adaf,
            shininess: 10,
            specular: 0x111111,
            side: THREE.BackSide,
        });

        this._geometry = new THREE.BoxGeometry(30, 30, 30);
        

        this._mesh = new THREE.Mesh(this._geometry,this._material);
        this._scene.add(this._camera);
        this._mesh.position.y = 10;
        this._mesh.receiveShadow = true;
        this._scene.add(this._mesh);
        this._scene.add(this._camera);

        this._renderer = new THREE.WebGLRenderer(
            {
                alpha: true,
                antialias: true
            }
        );
        this._renderer.setSize(this._canvas.clientWidth, this._canvas.clientHeight);
        this._renderer.shadowMap.enabled = true;
        this._renderer.shadowMap.type = THREE.BasicShadowMap;

        this._canvas.appendChild(this._renderer.domElement);

        this._controls = new OrbitControls(this._camera, this._renderer.domElement);
        this._controls.enableDamping = true;
        this._controls.dampingFactor = 0.05;
        this._controls.screenSpacePanning = false;
        this._controls.minDistance = 1;
        this._controls.maxDistance = 5;
        this._controls.enablePan = false;
        this._controls.maxPolarAngle = Math.PI;

        window.addEventListener("resize", this.onWindowResize.bind(this));
    }

    onWindowResize(): void {
        this._camera.aspect = this._aspect;
        this._camera.updateProjectionMatrix();
        this._renderer.setSize(this._canvas.clientWidth, this._canvas.clientHeight);
    }

    animate(): void {
        // NOTE: Update uniform data on each render.
        this._renderer.render(this._scene, this._camera);

        let time = performance.now() * 0.001;

        this._pointLight.position.x = Math.sin(time * 0.6) * 9;
        this._pointLight.position.y = Math.sin(time * 0.7) * 9 + 6;
        this._pointLight.position.z = Math.sin(time * 0.8) * 9;

        this._pointLight.rotation.x = time;
        this._pointLight.rotation.z = time;

        time += 10000;

        this._pointLight2.position.x = Math.sin(time * 0.6) * 9;
        this._pointLight2.position.y = Math.sin(time * 0.7) * 9 + 6;
        this._pointLight2.position.z = Math.sin(time * 0.8) * 9;

        this._pointLight2.rotation.x = time;
        this._pointLight2.rotation.z = time;
        this._controls.update();
        requestAnimationFrame(this.animate.bind(this));
    }

    createLight(color): THREE.light {
        const intensity = 20;
    
        const light = new THREE.PointLight(color, intensity, 20);
        light.castShadow = true;
        light.shadow.bias = -0.005; // reduces self-shadowing on double-sided objects
    
        let geometry = new THREE.SphereGeometry(0.5, 12, 6);
        let material = new THREE.MeshBasicMaterial({ color: color });
        material.color.multiplyScalar(intensity);
        let sphere = new THREE.Mesh(geometry, material);
        light.add(sphere);
    
        const texture = new THREE.CanvasTexture(this.generateTexture());
        texture.magFilter = THREE.NearestFilter;
        texture.wrapT = THREE.RepeatWrapping;
        texture.wrapS = THREE.RepeatWrapping;
        texture.repeat.set(0, 8);
    
        geometry = new THREE.SphereGeometry(5, 32, 8);
        material = new THREE.MeshPhongMaterial({
          side: THREE.DoubleSide,
          alphaMap: texture,
          alphaTest: 0.5,
        });
    
        sphere = new THREE.Mesh(geometry, material);
        sphere.castShadow = true;
        sphere.receiveShadow = true;
        light.add(sphere);
    
        // custom distance material
        const distanceMaterial = new THREE.MeshDistanceMaterial({
          alphaMap: material.alphaMap,
          alphaTest: material.alphaTest,
        });
        sphere.customDistanceMaterial = distanceMaterial;
    
        return light;
    }

    generateTexture(): HTMLCanvasElement {
        const canvas = document.createElement("canvas");
        canvas.width = 4;
        canvas.height = 4;
      
        const context = canvas.getContext("2d");
        context.fillStyle = "white";
        context.fillRect(0, 2, 4, 1);
      
        return canvas;
    }
    
}