import { useEffect } from 'react';
import * as THREE from 'three';

const Page = () => {
  useEffect(() => {
    console.log(THREE);
    const canvas = document.getElementById('c');
    
  }, []);

  return <canvas id="c"></canvas>;
};

export default Page;
