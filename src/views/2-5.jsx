import { useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { HeartCurve } from 'three/examples/jsm/curves/CurveExtras';
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

        mesh.geometry.computeBoundingBox();
        console.log(mesh);
        this.scene.add(mesh);
        this.mesh = mesh;
      },
      createCamera () {
        // 创建相机对象
        const pCamera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 1000);

        pCamera.position.set(0, 0, 20);
        pCamera.lookAt(this.scene.position);
        this.scene.add(pCamera);
        this.pCamera = pCamera;
        this.camera = pCamera;

        const watcherCamera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 1000);

        watcherCamera.position.set(0, 0, 20);
        watcherCamera.lookAt(this.scene.position);
        this.watcherCamera = watcherCamera;
        this.scene.add(watcherCamera);
        // this.camera = watcherCamera;
      },
      curveGenerator () {
        const curve = new HeartCurve(1);
        const tubeGeometry = new THREE.TubeGeometry(curve, 200, 0.01, 8, true);
        const material = new THREE.MeshBasicMaterial({
          color: 0x00ff00,
        });
        const tubeMesh = new THREE.Mesh(tubeGeometry, material);

        // 把曲线分割成1000段
        this.points = curve.getPoints(3000);

        tubeMesh.rotation.x = -Math.PI / 2; // 绕x轴旋转90度
        this.scene.add(tubeMesh);
        this.curve = curve;

        const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 64);
        const sphereMaterial = new THREE.MeshBasicMaterial({
          color: 0xffff00,
        });
        const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);

        sphereMesh.position.copy(this.pCamera.position);
        this.sphereMesh = sphereMesh;
        this.scene.add(sphereMesh);
      },
      datGui () {
        const _this = this;
        const gui = new dat.GUI();
        const params = {
          color: 0x1890ff,
          wireframe: false,
          switchCamera () {
            _this.orbitControls.dispose(); // 销毁旧的控制器
            if (_this.cameraIndex === 0) {
              _this.camera = _this.watcherCamera;
              _this.cameraIndex = 1;
            } else {
              _this.camera = _this.pCamera;
              _this.cameraIndex = 0;
            }
            _this.orbitControls = new OrbitControls(_this.camera, _this.canvas);
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
      count: 0, // 当前点的索引
      moveCamera () {
        const index = this.count % this.points.length;
        const point = this.points[index];
        const nextPoint = this.points[index + 1 >= this.points.length ? 0 : index + 1];

        this.pCamera.position.set(point.x, 0, -point.y);
        this.pCamera.lookAt(nextPoint.x, 0, -nextPoint.y); // 让人眼视角沿着路径观察
        this.sphereMesh.position.set(point.x, 0, -point.y);
        this.count++;
      },
      tick () {
        // update objects
        this.orbitControls.update();
        this.moveCamera();

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
        this.curveGenerator();
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
