import { useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GUI } from 'dat.gui';

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

        scene.background = new THREE.Color(0xf0f0f0);
        this.scene = scene;
      },
      createLights () {
        // 添加全局光照
        const ambientLight = new THREE.AmbientLight(0xffffff);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);

        directionalLight.position.set(1, 2, 2);
        directionalLight.castShadow = true;
        directionalLight.shadow.camera.near = 0.1;
        directionalLight.shadow.camera.far = 40;
        directionalLight.shadow.radius = 1.5;
        directionalLight.shadow.mapSize.x = 1024;
        directionalLight.shadow.mapSize.y = 1024;

        console.log(directionalLight);
        this.directionalLight = directionalLight;
        this.scene.add(ambientLight, directionalLight);
      },
      loadTextures () {
        const textureLoader = new THREE.TextureLoader();
        const floorTexture = textureLoader.load('/src/assets/textures/floor_tiles_06/floor_tiles_06_diff_2k.jpg');
        const wallTexture = textureLoader.load('/src/assets/textures/large_sandstone_blocks/large_sandstone_blocks_diff_2k.jpg');

        this.floorTexture = floorTexture;
        this.wallTexture = wallTexture;
      },
      createObjects () {
        const material = new THREE.ShadowMaterial({
          opacity: 1,
          polygonOffset: true,
          polygonOffsetFactor: -1,
        });
        const box = new THREE.Mesh(
          new THREE.BoxGeometry(1, 1, 1),
          new THREE.MeshBasicMaterial({
            color: 0x1890ff,
          }),
        );
        const geometry = new THREE.PlaneGeometry(10, 10);
        const planeShadow = new THREE.Mesh(
          geometry,
          material,
        );
        const wallShadow = new THREE.Mesh(
          geometry,
          material,
        );
        const floor = new THREE.Mesh(
          new THREE.PlaneGeometry(10, 10),
          new THREE.MeshBasicMaterial({
            map: this.floorTexture,
          })
        );
        const wall = new THREE.Mesh(
          new THREE.PlaneGeometry(10, 10),
          new THREE.MeshBasicMaterial({
            map: this.wallTexture,
          }),
        );

        box.castShadow = true; // 产生阴影
        planeShadow.rotation.x = -Math.PI / 2;
        planeShadow.position.y = -0.8;
        planeShadow.receiveShadow = true; // 接收阴影
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = -0.8;
        floor.position.z = -2;
        wallShadow.position.y = 0.8;
        wallShadow.position.z = -2;
        wallShadow.receiveShadow = true;
        wall.position.y = 0.8;
        wall.position.z = -2;

        this.scene.add(box, planeShadow, floor, wallShadow, wall);
      },
      createCamera () {
        // 创建相机对象
        const pCamera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 1000);

        pCamera.position.set(0.1, 1, 3);
        pCamera.lookAt(this.scene.position);
        this.scene.add(pCamera);
        this.pCamera = pCamera;
        this.camera = pCamera;
      },
      datGui () {
        const _this = this;
        const gui = new GUI();

        gui.add(_this.directionalLight.position, 'x', -10, 10, 0.1);
        gui.add(_this.directionalLight.position, 'y', -10, 10, 0.1);
        gui.add(_this.directionalLight.position, 'z', -10, 10, 0.1);
      },
      helpers () {
        // 创建辅助坐标系
        const axesHelper = new THREE.AxesHelper();
        const gridHelper = new THREE.GridHelper(100, 10, 0xcd37aa, 0x4a4a4a);

        gridHelper.position.y = -1;
        this.scene.add(axesHelper, gridHelper);
      },
      render () {
        // 创建渲染器
        const renderer = new THREE.WebGLRenderer({
          canvas: this.canvas,
          antialias: true,
          // logarithmicDepthBuffer: true,
        });

        // 开启阴影渲染
        renderer.shadowMap.enabled = true;
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
