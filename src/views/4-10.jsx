import { useEffect } from 'react';
import * as THREE from 'three';
import { mergeBufferGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';

const Page = () => {
  useEffect(() => {
    const $ = {
      createScene () {
        const canvas = document.getElementById('c');

        const width = window.innerWidth;
        const height = window.innerHeight;

        canvas.width = width;
        canvas.height = height;
        this.canvas = canvas;
        this.width = width;
        this.height = height;

        // threejs codes
        /**
         * 1, 有锯齿
         * 2, 没有3D立体效果
         * 3, 6个面能不能有不同的颜色
         */
        // 创建3D场景对象
        const scene = new THREE.Scene();

        this.scene = scene;
      },
      createLights () {
        // 添加全局光照
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);

        directionalLight.position.set(1, 2, 4);

        this.scene.add(ambientLight, directionalLight);
      },
      loadTextures () {
        const manager = new THREE.LoadingManager();

        manager.onStart = function ( url, itemsLoaded, itemsTotal ) {
          // console.log( 'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
        };

        manager.onLoad = function ( ) {
          // console.log( 'Loading complete!');
        };


        manager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
          // console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
        };

        manager.onError = function ( url ) {
          // console.log( 'There was an error loading ' + url );
        };

        const textureLoader = new THREE.TextureLoader(manager);

        const texture = textureLoader.load('/src/assets/textures/Warning_Sign_HighVoltage_001/Warning_Sign_HighVoltage_001_basecolor.jpg');
        const aoTexture = textureLoader.load('/src/assets/textures/Wood_Ceiling_Coffers_003/Wood_Ceiling_Coffers_003_ambientOcclusion.jpg');
        const bumpTexture = textureLoader.load('/src/assets/textures/Warning_Sign_HighVoltage_001/Warning_Sign_HighVoltage_001_height.png');
        const normalTexture = textureLoader.load('/src/assets/textures/Warning_Sign_HighVoltage_001/Warning_Sign_HighVoltage_001_normal.jpg');
        const roughnessTexture = textureLoader.load('/src/assets/textures/Warning_Sign_HighVoltage_001/Warning_Sign_HighVoltage_001_roughness.jpg');
        const metalTexture = textureLoader.load('/src/assets/textures/Warning_Sign_HighVoltage_001/Warning_Sign_HighVoltage_001_metallic.jpg');

        this.texture = texture;
        this.aoTexture = aoTexture;
        this.bumpTexture = bumpTexture;
        this.normalTexture = normalTexture;
        this.roughnessTexture = roughnessTexture;
        this.metalTexture = metalTexture;
      },
      createObjects () {
        // 创建几何体
        const geometry = new THREE.BoxGeometry(2, 2, 2);
        // 创建材质
        const material = new THREE.MeshStandardMaterial({
          // color: 0x1890ff,
          map: this.texture,
        });
        // 创建3D物体对象
        const mesh = new THREE.Mesh(geometry, material);

        mesh.position.x = -2.5;

        const boxGeometry = new THREE.BoxGeometry(2, 2, 2, 64, 64, 64);
        const boxMaterial = new THREE.MeshStandardMaterial({
          map: this.texture,
          /* aoMap: this.aoTexture,
          aoMapIntensity: 0.8, */
          // normalMap: this.normalTexture,
          /* bumpMap: this.bumpTexture,
          bumpScale: 10, */
          displacementMap: this.bumpTexture,
          /* displacementBias: 0, // 位移贴图在网格顶点上的偏移量
          displacementScale: 0, // 位移贴图对网格的影响程度(黑色无位移, 白色是最大位移) */
          roughnessMap: this.roughnessTexture,
          metalnessMap: this.metalTexture,
        });
        const box = new THREE.Mesh(boxGeometry, boxMaterial);

        // boxGeometry.setAttribute('uv2', new THREE.BufferAttribute(geometry.attributes.uv.array, 2));
        console.log(boxGeometry);
        box.position.x = 0.5;

        this.box = box;
        this.scene.add(mesh, box);
      },
      createCamera () {
        // 创建相机对象
        const pCamera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 1000);

        pCamera.position.set(0, 1, 6);
        pCamera.lookAt(this.scene.position);
        this.scene.add(pCamera);
        this.pCamera = pCamera;
        this.camera = pCamera;
      },
      datGui () {
        const _this = this;
        const gui = new dat.GUI();

        gui.add(_this.box.material, 'aoMapIntensity', 0, 1, 0.1);
        gui.add(_this.box.material, 'displacementBias', 0, 1, 0.1);
        gui.add(_this.box.material, 'displacementScale', 0, 1, 0.1);
        gui.add(_this.box.material.normalScale, 'x', 0, 1, 0.1).onChange(val => {
          _this.box.material.normalScale = new THREE.Vector2(val, _this.box.material.normalScale.y);
        });
        gui.add(_this.box.material.normalScale, 'y', 0, 1, 0.1).onChange(val => {
          _this.box.material.normalScale = new THREE.Vector2(_this.box.material.normalScale.x, val);
        });
        gui.add(_this.box.material, 'roughness', 0, 1, 0.1);
        gui.add(_this.box.material, 'metalness', 0, 1, 0.1);
      },
      helpers () {
        // 创建辅助坐标系
        const axesHelper = new THREE.AxesHelper();
        const gridHelper = new THREE.GridHelper(100, 10, 0xcd37aa, 0x4a4a4a);

        this.scene.add(axesHelper, gridHelper);
      },
      render () {
        // 创建渲染器
        const renderer = new THREE.WebGLRenderer({
          canvas: this.canvas,
          antialias: true,
          // logarithmicDepthBuffer: true,
        });

        // 设置渲染器屏幕像素比
        renderer.setPixelRatio(window.devicePixelRatio || 1);
        // 设置渲染器大小
        renderer.setSize(this.width, this.height);
        // 执行渲染
        renderer.render(this.scene, this.camera);
        this.renderer = renderer;
      },
      controls () {
        // 创建轨道控制器
        const orbitControls = new OrbitControls(this.camera, this.canvas);

        orbitControls.enableDamping = true;
        this.orbitControls = orbitControls;
      },
      tick () {
        // update objects
        this.orbitControls.update();

        this.renderer.render(this.scene, this.camera);
        window.requestAnimationFrame(() => this.tick());
      },
      fitView () {
        // 监听窗口大小变化
        window.addEventListener('resize', () => {
          this.camera.aspect = window.innerWidth / window.innerHeight;
          this.camera.updateProjectionMatrix();

          this.renderer.setSize(window.innerWidth, window.innerHeight);
        }, false);
      },
      init () {
        this.createScene();
        this.createLights();
        this.loadTextures();
        this.createObjects();
        this.createCamera();
        this.helpers();
        this.render();
        this.controls();
        this.tick();
        this.fitView();
        this.datGui();
      },
    };

    $.init();
  }, []);

  return <canvas id="c"></canvas>;
};

export default Page;
