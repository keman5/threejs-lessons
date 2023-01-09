import { useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const Page = () => {
  useEffect(() => {
    const canvas = document.getElementById('c');

    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    // threejs codes
    /**
     * 1, 有锯齿
     * 2, 没有3D立体效果
     * 3, 6个面能不能有不同的颜色
     */
    // 创建3D场景对象
    const scene = new THREE.Scene();
    // 创建辅助坐标系
    const axesHelper = new THREE.AxesHelper();

    scene.add(axesHelper);

    // 添加全局光照
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);

    scene.add(ambientLight, directionalLight);

    // 创建立方体的几何体
    const geometry = new THREE.BoxGeometry(1, 1, 1);

    const faces = [];

    for (let i = 0; i < geometry.groups.length; i++) {
      const material = new THREE.MeshBasicMaterial({
        color: 0xffffff * Math.random(),
      });

      faces.push(material);
    }

    /* // 创建立方体的材质
    const material = new THREE.MeshLambertMaterial({
      color: 0x1890ff,
      // wireframe: true,
    }); */
    // 创建3D物体对象
    const mesh = new THREE.Mesh(geometry, faces);

    scene.add(mesh);

    // 创建相机对象
    const camera = new THREE.PerspectiveCamera(75, width / height);

    // 设置相机位置
    camera.position.set(2, 2, 3); // x:2 y:2 z:3
    // 设置相机朝向
    camera.lookAt(scene.position);
    // 将相机添加到场景中
    scene.add(camera);

    // 创建渲染器
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
    });

    // 设置渲染器屏幕像素比
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    // 设置渲染器大小
    renderer.setSize(width, height);
    // 执行渲染
    renderer.render(scene, camera);

    // 创建轨道控制器
    const orbitControls = new OrbitControls(camera, canvas);

    orbitControls.enableDamping = true;

    const clock = new THREE.Clock();
    const tick = () => {
      const elapsedTime = clock.getElapsedTime();

      mesh.rotation.y += elapsedTime / 1000;

      // update objects
      orbitControls.update();

      renderer.render(scene, camera);
      window.requestAnimationFrame(tick);
    }

    tick();
  }, []);

  return <canvas id="c"></canvas>;
};

export default Page;
