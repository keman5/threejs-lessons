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

        directionalLight.position.set(2, 2, 0);

        this.directionalLight = directionalLight;
        this.scene.add(ambientLight, directionalLight);
      },
      loadTextures () {
        const textureLoader = new THREE.TextureLoader();

        const texture = textureLoader.load('/src/assets/textures/Glass_Vintage_001/Glass_Vintage_001_basecolor.jpg');
        const aoTexture = textureLoader.load('/src/assets/textures/Wood_Ceiling_Coffers_003/Wood_Ceiling_Coffers_003_ambientOcclusion.jpg');
        const bumpTexture = textureLoader.load('/src/assets/textures/Wood_Ceiling_Coffers_003/Wood_Ceiling_Coffers_003_height.png');
        const normalTexture = textureLoader.load('/src/assets/textures/Glass_Vintage_001/Glass_Vintage_001_normal.jpg');
        const roughnessTexture = textureLoader.load('/src/assets/textures/Wood_Ceiling_Coffers_003/Wood_Ceiling_Coffers_003_roughness.jpg');
        const threeToneTexture = textureLoader.load('/src/assets/textures/threeTone.jpg');
        const fiveToneTexture = textureLoader.load('/src/assets/textures/fiveTone.jpg');

        this.textureLoader = textureLoader;
        this.texture = texture;
        this.aoTexture = aoTexture;
        this.bumpTexture = bumpTexture;
        this.normalTexture = normalTexture;
        this.roughnessTexture = roughnessTexture;
        this.threeToneTexture = threeToneTexture;
        this.fiveToneTexture = fiveToneTexture;
      },
      createObjects () {

        const material = new THREE.MeshNormalMaterial();
        const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material); // 平面
        const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), material); // 球体
        const box = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material); // 立方体
        const torus = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.2, 16, 32), material); // 圆环

        console.log(material);
        plane.position.z = -1;
        box.position.z = 1;
        sphere.position.x = -1.5;
        torus.position.x = 1.5;

        this.material = material;
        this.sphere = sphere;
        this.scene.add(plane, sphere, box, torus);
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

        const meshFolder = gui.addFolder('物体');

        meshFolder.add(_this.material, 'wireframe');
        meshFolder.add(_this.material, 'flatShading').onChange(val => {
          _this.material.needsUpdate = true;
        });
        console.log(_this.sphere.geometry);
        meshFolder.add(_this.sphere.geometry.parameters, 'heightSegments', 16, 100, 1).onChange(val => {
          _this.sphere.geometry.dispose();

          const geometry = new THREE.SphereGeometry(0.5, 16, val);

          this.sphere.geometry = geometry;
        });
        meshFolder.open();
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
