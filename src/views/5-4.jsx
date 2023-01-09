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

        scene.background = new THREE.Color(0xffffff);
        this.scene = scene;
      },
      createLights () {
        // 添加全局光照
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);

        directionalLight.position.set(2, 2, 0);

        this.directionalLight = directionalLight;
        this.scene.add(ambientLight, directionalLight);
      },
      loadTextures () {
        const textureLoader = new THREE.TextureLoader();

        const texture = textureLoader.load('/src/assets/textures/Warning_Sign_HighVoltage_001/Warning_Sign_HighVoltage_001_basecolor.jpg');
        const aoTexture = textureLoader.load('/src/assets/textures/Warning_Sign_HighVoltage_001/Warning_Sign_HighVoltage_001_ambientOcclusion.jpg');
        const bumpTexture = textureLoader.load('/src/assets/textures/Warning_Sign_HighVoltage_001/Warning_Sign_HighVoltage_001_height.png');
        const normalTexture = textureLoader.load('/src/assets/textures/Warning_Sign_HighVoltage_001/Warning_Sign_HighVoltage_001_normal.jpg');
        const roughnessTexture = textureLoader.load('/src/assets/textures/Warning_Sign_HighVoltage_001/Warning_Sign_HighVoltage_001_roughness.jpg');
        const metalTexture = textureLoader.load('/src/assets/textures/Warning_Sign_HighVoltage_001/Warning_Sign_HighVoltage_001_metallic.jpg');

        this.textureLoader = textureLoader;
        this.texture = texture;
        this.aoTexture = aoTexture;
        this.bumpTexture = bumpTexture;
        this.normalTexture = normalTexture;
        this.roughnessTexture = roughnessTexture;
        this.metalTexture = metalTexture;

        const cuteTextureLoader = new THREE.CubeTextureLoader();

        const envTexture = cuteTextureLoader.load([
          '/src/assets/textures/fullscreen/1.left.jpg',
          '/src/assets/textures/fullscreen/1.right.jpg',
          '/src/assets/textures/fullscreen/1.top.jpg',
          '/src/assets/textures/fullscreen/1.bottom.jpg',
          '/src/assets/textures/fullscreen/1.front.jpg',
          '/src/assets/textures/fullscreen/1.back.jpg',
        ]);

        this.envTexture = envTexture;
      },
      createObjects () {

        const material = new THREE.MeshStandardMaterial({
          map: this.texture,
        });
        const sphere = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 16), material); // 球体
        const mesh = new THREE.Mesh(
          new THREE.SphereGeometry(1, 64, 16),
          new THREE.MeshPhysicalMaterial({
            // map: this.texture,
            envMap: this.envTexture,
            envMapIntensity: 1,
            // metalnessMap: this.metalTexture,
            // metalness: 0.5,
            roughnessMap: this.roughnessTexture,
            roughness: 0.1,
            clearcoat: true, // 具有反光特性
            transmission: 0.8, // 厚薄程度
            ior: 1.0, // 非金属材质的反射率
            thickness: 1.0, // 曲面下体积的厚度
          })
        ); // 球体

        sphere.position.x = -1.2;
        mesh.position.x = 1.2;

        this.material = material;
        this.mesh = mesh;
        this.scene.add(sphere, mesh);
      },
      createCamera () {
        // 创建相机对象
        const pCamera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 1000);

        pCamera.position.set(0, 1, 2.5);
        pCamera.lookAt(this.scene.position);
        this.scene.add(pCamera);
        this.pCamera = pCamera;
        this.camera = pCamera;
      },
      datGui () {
        const _this = this;
        const gui = new dat.GUI();

        gui.add(_this.mesh.material, 'envMapIntensity', 0, 1, 0.1);
        gui.add(_this.mesh.material, 'metalness', 0, 1, 0.1);
        gui.add(_this.mesh.material, 'roughness', 0, 1, 0.1);
        gui.add(_this.mesh.material, 'clearcoat');
        gui.add(_this.mesh.material, 'transmission', 0, 1, 0.1);
        gui.add(_this.mesh.material, 'ior', 1.0, 2.333, 0.01);
        gui.add(_this.mesh.material, 'thickness', 0, 1, 0.01);
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
