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
        const frustumSize = 2; // 设置显示相机前方高为4的内容
        const aspect = this.width / this.height;
        const pCamera = new THREE.OrthographicCamera(-aspect * frustumSize, aspect * frustumSize, frustumSize, -frustumSize, 0.1, 1000);

        pCamera.position.set(1, 1, 2);
        pCamera.lookAt(this.scene.position);
        this.scene.add(pCamera);
        this.pCamera = pCamera;
        this.camera = pCamera;

        // 创建缩略图相机
        const thumbnailCamera = new THREE.OrthographicCamera(-150 / 200 * frustumSize, 150 / 200 * frustumSize, frustumSize, -frustumSize, 0.1, 1000);

        thumbnailCamera.position.set(1, 1, 2);
        thumbnailCamera.lookAt(this.scene.position);
        this.thumbnailCamera = thumbnailCamera;
        this.scene.add(thumbnailCamera);
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
      clipScene (renderer) {
        const dpr = window.devicePixelRatio || 1;

        // 裁剪
        renderer.setScissor(0, 0, this.width, this.height);
        renderer.setClearColor(0x999999, 0.5);
        // renderer.setViewport(0, 0, this.width, this.height);
        // 设置渲染器屏幕像素比
        renderer.setPixelRatio(dpr);
        // 设置渲染器大小
        renderer.setSize(this.width, this.height);
        // 执行渲染
        renderer.render(this.scene, this.camera);
      },
      clipThumbnail (renderer) {
        // w: 150 h: 200 margin: 10
        const w = this.width - 150 - 10;

        // 更新位置
        this.thumbnailCamera.position.copy(this.camera.position);
        // 更新旋转
        // this.thumbnailCamera.rotation.copy(this.camera.rotation);
        // 更新四元数(更新旋转)
        this.thumbnailCamera.quaternion.copy(this.camera.quaternion);
        // 更新缩放
        this.thumbnailCamera.zoom = this.camera.zoom;
        // 更新相机矩阵
        this.thumbnailCamera.updateProjectionMatrix();

        renderer.setScissor(w, 10, 150, 200);
        renderer.setViewport(w, 10, 150, 200);
        renderer.setClearColor(0x000000);
        // 执行渲染
        renderer.render(this.scene, this.thumbnailCamera);
      },
      render () {
        // 创建渲染器
        if (!this.renderer) {
          this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
          });
        }

        this.renderer.setScissorTest(true);

        // 全局裁剪
        this.clipScene(this.renderer);
        // 缩略图
        this.clipThumbnail(this.renderer);
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

        this.render();
        // this.renderer.render(this.scene, this.camera);
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
        // this.datGui();
      },
    };

    $.init();

  }, []);

  return <canvas id="c"></canvas>;
};

export default Page;
