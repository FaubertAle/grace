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

    //Loaders
    _loader: THREE.GLTFLoader;

    constructor(canvas: HTMLElement){
        this._canvas = canvas;
        this._aspect = canvas.clientWidth / canvas.clientHeight;
        this._scene = new THREE.Scene();

        this._scene.background = new THREE.CubeTextureLoader()
        .setPath("/assets/textures/cubeMaps/")
        .load([
            "posx.jpg",
            "negx.jpg",
            "posy.jpg",
            "negy.jpg",
            "posz.jpg",
            "negz.jpg",
        ]);

        this._camera = new THREE.PerspectiveCamera(
            45,
            this._aspect,
            0.1,
            5
        );
        this._camera.position.z = 3.5;
        this._material = new THREE.MeshBasicMaterial(
            {color: 0x1242f2}
        );

        this._loader = new GLTFLoader();
        this._loader.load(
            "/assets/models/planoInclinado.glb",
            (gltf) => {
            //   gltf.scene.scale.set(.1, .1, .1);

              this._model = gltf.scene.children[0].geometry;
              this._mesh = new THREE.Mesh(this._model,this._material);
              this._scene.add(this._mesh);
            },
            undefined,
            function (error) {
              console.error(error);
            }
        );

        // this._geometry = new THREE.BoxGeometry(1, 1, 1);
        // this._geometry = this._model;

        // this._mesh = new THREE.Mesh(this._geometry,this._material);
        this._scene.add(this._camera);
        // this._scene.add(this._mesh);
        this._scene.add(this._camera);

        this._renderer = new THREE.WebGLRenderer(
            {
                alpha: true,
                antialias: true
            }
        );
        this._renderer.setSize(this._canvas.clientWidth, this._canvas.clientHeight);
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
        this._controls.update();
        requestAnimationFrame(this.animate.bind(this));
    }
    
}