import { useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { DragControls } from 'three/examples/jsm/controls/DragControls';
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
        const pCamera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 1000);

        pCamera.position.set(0, 1, 2);
        pCamera.lookAt(this.scene.position);
        this.scene.add(pCamera);
        this.pCamera = pCamera;
        this.camera = pCamera;
      },
      datGui () {
        const _this = this;
        const gui = new dat.GUI();

        gui.add(_this.orbitControls, 'enabled');
        gui.add(_this.orbitControls, 'dampingFactor', 0.01, 0.2, 0.01); // 阻尼系数
        gui.add(_this.orbitControls, 'enablePan'); // 启用/禁用相机平移
        gui.add(_this.orbitControls, 'panSpeed', 1, 10, 1); // 相机平移的速度
        gui.add(_this.orbitControls, 'autoRotate');
        gui.add(_this.orbitControls, 'autoRotateSpeed', 1, 10, 1); // 自动旋转速度
        gui.add(_this.orbitControls, 'enableZoom');
        gui.add(_this.orbitControls, 'zoomSpeed', 1, 10, 1);
      },
      helpers () {
        // 创建辅助坐标系
        const axesHelper = new THREE.AxesHelper();

        this.scene.add(axesHelper);
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
        console.log(orbitControls);

        const dragControls = new DragControls([this.mesh], this.camera, this.canvas);

        dragControls.addEventListener('dragstart', () => {
          // 拖拽开始事件
          orbitControls.enabled = false;
        });
        dragControls.addEventListener('dragend', () => {
          // 拖拽结束事件
          orbitControls.enabled = true;
        });
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
