import { useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

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
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);

        this.scene.add(ambientLight, directionalLight);
      },
      createObjects () {
        // 创建立方体的几何体
        const geometry = new THREE.BoxGeometry(1, 1, 1);

        // 创建立方体的材质
        const material = new THREE.MeshLambertMaterial({
          color: 0x1890ff,
          // wireframe: true,
        });
        // 创建3D物体对象
        const mesh = new THREE.Mesh(geometry, material);

        this.scene.add(mesh);
        this.mesh = mesh;
      },
      createCamera () {
        // 创建相机对象
        const size = 4;
        const orthoCamera = new THREE.OrthographicCamera(-size, size, size / 2, -size / 2, 0.1, 3);

        // 设置相机位置
        orthoCamera.position.set(2, 2, 3); // x:2 y:2 z:3
        // 设置相机朝向
        orthoCamera.lookAt(this.scene.position);
        // 将相机添加到场景中
        this.scene.add(orthoCamera);
        this.orthoCamera = orthoCamera;
        console.log(this.orthoCamera);
        // this.camera = orthoCamera;

        // 创建第二个相机
        const watcherCamera = new THREE.PerspectiveCamera(75, this.width / this.height);

        watcherCamera.position.set(2, 2, 6);
        watcherCamera.lookAt(this.scene.position);
        this.scene.add(watcherCamera);
        this.camera = watcherCamera;
      },
      helpers () {
        // 创建辅助坐标系
        const axesHelper = new THREE.AxesHelper();
        const cameraHelper = new THREE.CameraHelper(this.orthoCamera);

        this.scene.add(axesHelper, cameraHelper);
        this.cameraHelper = cameraHelper;
      },
      render () {
        // 创建渲染器
        const renderer = new THREE.WebGLRenderer({
          canvas: this.canvas,
          antialias: true,
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
        this.mesh.rotation.y += 0.01;

        // update objects
        this.orbitControls.update();
        this.cameraHelper.update();

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
        this.createObjects();
        this.createCamera();
        this.helpers();
        this.render();
        this.controls();
        this.tick();
        this.fitView();
      },
    };

    $.init();

  }, []);

  return <canvas id="c"></canvas>;
};

export default Page;
