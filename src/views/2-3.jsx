import { useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';

const Page = () => {
  useEffect(() => {
    const $ = {
      cameraIndex: 0,
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
        const pCamera = new THREE.PerspectiveCamera(75, this.width / this.height, 1, 10);

        pCamera.position.set(0, 0, 3);
        pCamera.lookAt(this.scene.position);
        this.scene.add(pCamera);
        this.pCamera = pCamera;
        this.camera = pCamera;

        const watcherCamera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 100);

        watcherCamera.position.set(2, 2, 6);
        watcherCamera.lookAt(this.scene.position);
        this.watcherCamera = watcherCamera;
        this.scene.add(watcherCamera);
        // this.camera = watcherCamera;
      },
      datGui () {
        const _this = this;
        const gui = new dat.GUI();
        const params = {
          color: 0x1890ff,
          wireframe: false,
          switchCamera () {
            if (_this.cameraIndex === 0) {
              _this.camera = _this.watcherCamera;
              _this.cameraIndex = 1;
            } else {
              _this.camera = _this.pCamera;
              _this.cameraIndex = 0;
            }
          },
        };

        gui.add(this.camera.position, 'x').min(-10).max(10).step(0.1).name('positionX');
        gui.add(this.pCamera, 'near', 0.01, 10, 0.01).onChange((val) => {
          this.camera.near = val;
          this.camera.updateProjectionMatrix();
        });
        gui.add(this.camera, 'far', 1, 100, 1).onChange(val => {
          this.camera.far = val;
          this.camera.updateProjectionMatrix();
        });
        gui.add(this.camera, 'zoom', 0.1, 10, 0.1).onChange(val => {
          this.camera.zoom = val;
          this.camera.updateProjectionMatrix();
        });
        gui.add(params, 'wireframe').onChange(val => {
          this.mesh.material.wireframe = val;
        });
        gui.add(this.camera, 'fov', 40, 150, 1).onChange(val => {
          this.camera.fov = val;
          this.camera.updateProjectionMatrix();
        });
        gui.add(params, 'switchCamera');
        gui.addColor(params, 'color').onChange(val => {
          console.log(val, _this.mesh);
          _this.mesh.material.color.set(val);
        });
      },
      helpers () {
        // 创建辅助坐标系
        const axesHelper = new THREE.AxesHelper();
        const cameraHelper = new THREE.CameraHelper(this.pCamera);

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
        // this.mesh.rotation.y += 0.01;

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
        this.datGui();
      },
    };

    $.init();

  }, []);

  return <canvas id="c"></canvas>;
};

export default Page;