import { useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { DragControls } from 'three/examples/jsm/controls/DragControls';
import * as dat from 'dat.gui';
import gsap from 'gsap';

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
        const sphereGeometry = new THREE.SphereGeometry(1, 16, 16);
        // 创建材质
        const material = new THREE.MeshLambertMaterial({
          color: 0x1890ff,
        });
        // 创建3D物体对象
        const mesh = new THREE.Mesh(sphereGeometry, material);

        this.scene.add(mesh);
        this.mesh = mesh;
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
        const params = {
          x: 0,
          widthSegments: _this.mesh.geometry.parameters.widthSegments,
          heightSegments: _this.mesh.geometry.parameters.heightSegments,
          generateGeometry () {
            _this.mesh.geometry.dispose();

            const geometry = new THREE.SphereGeometry(1, params.widthSegments, params.heightSegments);

            _this.mesh.geometry = geometry;
          },
          rotation () {
            // 绕y轴旋转半周
            gsap.to(_this.mesh.rotation, {
              duration: 1,
              delay: 0,
              y: _this.mesh.rotation.y + Math.PI,
            });
          }
        }

        gui.add(_this.orbitControls, 'enabled');
        gui.add(_this.mesh, 'visible');
        gui.add(_this.mesh.material, 'wireframe');
        gui.add(params, 'widthSegments', 3, 100, 1,).onChange(val => {
          params.widthSegments = val;
          params.generateGeometry();
        });
        gui.add(params, 'heightSegments', 3, 100, 1,).onChange(val => {
          params.heightSegments = val;
          params.generateGeometry();
        });
        gui.add(params, 'rotation');
        gui.add(_this.mesh.position, 'x', -3, 3, 0.1);
        gui.add(params, 'x', -3, 3, 0.1).name('tranlateX').onChange(val => {
          params.x = val;
          _this.mesh.geometry.translate(params.x, 0, 0);
          console.log(_this.mesh.position);
          console.log(_this.mesh.geometry);
        });
        gui.add(_this.mesh.scale, 'x', 0, 3, 0.1).name('scaleX');
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
        // const dragControls = new DragControls([this.mesh], this.camera, this.canvas);

        // orbitControls.enabled = false;
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
