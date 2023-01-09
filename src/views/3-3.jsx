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
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);

        this.scene.add(ambientLight, directionalLight);
      },
      createObjects () {
        // 创建几何体
        const carGeometry = new THREE.BoxGeometry(2, 0.2, 1);
        // 创建材质
        const material = new THREE.MeshLambertMaterial({
          color: 0x1890ff,
        });
        // 创建3D物体对象
        const car = new THREE.Mesh(carGeometry, material);

        // 车轮
        const wheelGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.3, 10);
        const wheelMaterial = new THREE.MeshBasicMaterial({
          color: 0xff00ff,
        });
        const wheel1 = new THREE.Mesh(wheelGeometry, wheelMaterial);
        const wheel2 = new THREE.Mesh(wheelGeometry, wheelMaterial);
        const wheel3 = new THREE.Mesh(wheelGeometry, wheelMaterial);
        const wheel4 = new THREE.Mesh(wheelGeometry, wheelMaterial);

        wheel1.name = 'wheel';
        wheel2.name = 'wheel';
        wheel3.name = 'wheel';
        wheel4.name = 'wheel';
        wheel1.rotation.x = -Math.PI / 2;
        wheel1.position.set(-0.5, 0, 0.4);
        wheel2.rotation.x = -Math.PI / 2;
        wheel2.position.set(-0.5, 0, -0.4);
        wheel3.rotation.x = -Math.PI / 2;
        wheel3.position.set(0.5, 0, -0.4);
        wheel4.rotation.x = -Math.PI / 2;
        wheel4.position.set(0.5, 0, 0.4);

        const lightGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
        const lightMaterial = new THREE.MeshBasicMaterial({
          color: 0xffff00,
        });
        const light1 = new THREE.Mesh(lightGeometry, lightMaterial);
        const light2 = new THREE.Mesh(lightGeometry, lightMaterial);

        light1.position.set(-1.05, 0, 0.2);
        light2.position.set(-1.05, 0, -0.2);

        const group = new THREE.Group();

        group.add(car, wheel1, wheel2, wheel3, wheel4, light1, light2);
        group.position.y = 0.2;
        this.group = group;
        console.log(group);

        // mergeBufferGeometries 合并几何体
        const geometry = mergeBufferGeometries([
          carGeometry,
          wheelGeometry,
        ]);
        const mesh = new THREE.Mesh(geometry, material);

        mesh.position.y = -1;

        this.scene.add(group, mesh);
      },
      createCamera () {
        // 创建相机对象
        const pCamera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 1000);

        pCamera.position.set(1, 1, 3);
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
      // 让小车动起来
      runCar () {
        const { children } = this.group;
        const delta = 4; // 每1帧车轮旋转4度
        const speed = (2 * Math.PI * 0.2) / 360 * delta; // 车轮转速

        for (const i in children) {
          const mesh = children[i];

          if (mesh.name === 'wheel') {
            mesh.rotation.y += THREE.MathUtils.radToDeg(delta);
          }
        }
        this.group.position.x -= speed;

        if (this.group.position.x < -10) {
          this.group.position.x = 10;
        }
      },
      tick () {
        // update objects
        this.orbitControls.update();
        this.runCar();

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
