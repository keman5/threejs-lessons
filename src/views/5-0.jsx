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

        // directionalLight.position.set(1, 2, 4);

        this.directionalLight = directionalLight;
        this.scene.add(ambientLight, directionalLight);
      },
      loadTextures () {
        const textureLoader = new THREE.TextureLoader();

        const texture = textureLoader.load('/src/assets/textures/Wood_Ceiling_Coffers_003/Wood_Ceiling_Coffers_003_basecolor.jpg');
        const aoTexture = textureLoader.load('/src/assets/textures/Wood_Ceiling_Coffers_003/Wood_Ceiling_Coffers_003_ambientOcclusion.jpg');
        const bumpTexture = textureLoader.load('/src/assets/textures/Wood_Ceiling_Coffers_003/Wood_Ceiling_Coffers_003_height.png');
        const normalTexture = textureLoader.load('/src/assets/textures/Glass_Vintage_001/Glass_Vintage_001_normal.jpg');
        const roughnessTexture = textureLoader.load('/src/assets/textures/Wood_Ceiling_Coffers_003/Wood_Ceiling_Coffers_003_roughness.jpg');

        this.texture = texture;
        this.aoTexture = aoTexture;
        this.bumpTexture = bumpTexture;
        this.normalTexture = normalTexture;
        this.roughnessTexture = roughnessTexture;
      },
      createObjects () {
        const material = new THREE.MeshPhongMaterial({
          // color: 0x1890ff,
          transparent: true,
          side: THREE.DoubleSide,
          map: this.texture,
        });
        const box = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 64), material); // 立方体
        const meshMaterial = new THREE.MeshPhongMaterial({
          // color: 0x1890ff,
          map: this.texture,
          specular: 0x00ffff,
        });
        const mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 64), meshMaterial); // 立方体

        box.position.x = -1.2;
        mesh.position.x = 1.2;

        this.meshMaterial = meshMaterial;
        this.material = material;
        this.scene.add(box, mesh);
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

        gui.add(_this.directionalLight.position, 'x', -10, 10, 0.1);
        gui.add(_this.directionalLight.position, 'y', -10, 10, 0.1);
        gui.add(_this.directionalLight.position, 'z', -10, 10, 0.1);
        gui.add(_this.meshMaterial, 'shininess', 0, 100, 0.1);
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
