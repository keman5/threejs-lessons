import { useEffect } from 'react';
import * as THREE from 'three';
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
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);

        this.scene.add(ambientLight, directionalLight);
      },
      createObjects () {
        const plane = new THREE.PlaneGeometry(1, 1, 1);
        const material = new THREE.PointsMaterial({
          color: 0x1890ff,
          // wireframe: true,
          side: THREE.DoubleSide,
        });
        const mesh = new THREE.Mesh(plane, material);

        mesh.rotation.x = -Math.PI / 2;
        mesh.position.y = -0.5;
        mesh.scale.x = 2;

        const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
        const box = new THREE.Mesh(boxGeometry, material);

        box.position.x = -2;

        const coneGeometry = new THREE.ConeGeometry(1, 2, 32);
        const cone = new THREE.Mesh(coneGeometry, material);

        cone.position.x = 2;

        const cylinderGeometry = new THREE.CylinderGeometry(1, 1, 2, 32, 32);
        const cylinder = new THREE.Mesh(cylinderGeometry, material);

        cylinder.position.x = 4;

        this.scene.add(mesh, box, cone, cylinder);
      },
      createCamera () {
        // 创建相机对象
        const pCamera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 1000);

        pCamera.position.set(0, 1, 5);
        pCamera.lookAt(this.scene.position);
        this.scene.add(pCamera);
        this.pCamera = pCamera;
        this.camera = pCamera;
      },
      datGui () {
        const _this = this;
        const gui = new dat.GUI();

        gui.add(_this.orbitControls, 'enabled');
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
