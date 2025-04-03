import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import * as BufferGeometryUtils from "https://cdn.skypack.dev/three@0.136.0/examples/jsm/utils/BufferGeometryUtils.js";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import grassTextureImg from "../public/grass1.webp";
const DancingGrass = () => {
  const canvasRef = useRef(null);
const [adttar, setadttar] = useState([])
let aarr=useRef()
  useEffect(() => {
    // Scene Setup
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0); // A plane facing the camera at z = 0
    const intersectionPoint = new THREE.Vector3();
    const grassTexture = new THREE.TextureLoader().load(grassTextureImg);
    const cloudTexture = new THREE.TextureLoader().load("../public/adhil.jpeg");
    cloudTexture.wrapS = cloudTexture.wrapT = THREE.RepeatWrapping;
  let raycaster = new THREE.Raycaster();
  window.addEventListener("mousemove",onMouseMove)

  let  mouse=new THREE.Vector3()
  

let adtt=[]
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const geom = new THREE.BufferGeometry();
   
    // Parameters
    const PLANE_SIZE = 20;

    console.log(   (Math.round(Math.PI * PLANE_SIZE) * Math.PI) / 2.5 ,"pllll")
    let pano = new THREE.PlaneGeometry(
      PLANE_SIZE,
      PLANE_SIZE,
      (Math.round(Math.PI * PLANE_SIZE) * Math.PI) ,
      (Math.round(Math.PI * PLANE_SIZE) * Math.PI) 
 
    );

  //   function addInteractiveGeometry(scene,uniforms) {
  //     let g = new THREE.IcosahedronGeometry(4, 20);
  //     g = BufferGeometryUtils.mergeVertices(g);
      
 
      
  //     let material = new THREE.ShaderMaterial({
  //         uniforms: {
  //             mousePosition: { value: uniforms.mousePos }
  //         },
  //         vertexShader: `
  //         void main() {
  //             float lerp(float a, float b, float amount) {
  //                 return a + (b - a) * amount;
  //             }
  
  //             vec3 p = position;
  //             float dist = min(distance(p, mousePosition), 1.);
  //             float lerpFactor = .2;
  //             p.x = lerp(p.x, position.x * dist, lerpFactor);
  //             p.y = lerp(p.y, position.y * dist, lerpFactor);
  //             p.z = lerp(p.z, position.z * dist, lerpFactor);
              
  //             vec4 mvPosition = modelViewMatrix * vec4(p, 1.);
  //             gl_Position = projectionMatrix * mvPosition;
  //         }
  //         `,
  //         fragmentShader: `
  //         void main() {
  //             gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
  //         }
  //         `
  //     });
      
  //     let points = new THREE.Mesh(g, material);
  //     scene.add(points);
      
  //     return { points, uniforms };
  // }
  

    let particleMaterial = new THREE.ShaderMaterial({
      vertexShader: `
          varying vec2 vUv;
          varying float vDist;
           uniform vec3 uMousePosition;
          void main() {

           vec3 seg = position - uMousePosition;
    float dist = length(seg);
    float force = clamp(1.0 / (dist * dist), 0.0, 1.0);
    vec3 newPosition = position + normalize(seg) * force;
vDist=dist;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
              vUv = uv;
              // gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
      `,
      fragmentShader: `
         varying float vDist;

  void main() {
    vec3 color;
    float alpha;
    
    if (vDist < 2.0) {
      color = vec3(1.0, 0.0, 1.0); // Magenta color for particles influenced by the marker
      alpha = 1.0;
    } else {
      color = vec3(0.0, 1.0, 1.0); // Cyan color for particles not influenced by the marker
      alpha = 1.0;
    }
    
    gl_FragColor = vec4(color, alpha);
  }      `,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      uniforms: {
          uTime: { value: 0 },
          uMousePosition: { value: new THREE.Vector3() },
          textures: { value: [grassTexture, cloudTexture] },
      },
  });

let unifopm={
  mousePos:particleMaterial.uniforms.uMousePosition
}
  // addInteractiveGeometry(scene,unifopm)

    const BLADE_COUNT = pano.attributes.position.count * 3;
    const BLADE_WIDTH = 0.1;
    const BLADE_HEIGHT = 0.8;
    const BLADE_HEIGHT_VARIATION = 0.6;
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true
    });

    renderer.setSize(window.innerWidth, window.innerHeight);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.enableZoom = true;
    controls.minPolarAngle = 1.1;
    // controls.maxPolarAngle = 1.45;
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controls.target.set(0, 0, 0);

    // Camera
    camera.position.set(-7, 3, 7);
    camera.lookAt(controls.target);
    // camera.setFocalLength(15);

    // Grass Texture
  

    // Time Uniform
    const startTime = Date.now();
    const timeUniform = { type: "f", value: 0.0 };

    // Grass Shader
    const grassUniforms = {
      textures: { value: [grassTexture, cloudTexture] },
      iTime: timeUniform
    };

    const grassMaterial = new THREE.ShaderMaterial({
      uniforms: grassUniforms,
      vertexShader:` varying vec2 vUv;
    varying vec2 cloudUV;
    
    varying vec3 vColor;
    uniform float iTime;
    
    void main() {
      vUv = uv;
      cloudUV = uv;
      vColor = color;
      vec3 cpos = position;
    
      float waveSize = 10.0f;
      float tipDistance = 0.3f;
      float centerDistance = 0.1f;
    
      if (color.x >0.6f) {
        cpos.x += sin((iTime / 500.) + (uv.x * waveSize)) * tipDistance;
      }else if (color.x > 0.0f) {
        cpos.x += sin((iTime / 500.) + (uv.x * waveSize)) * centerDistance;
      }
    
      // float diff = position.x - cpos.x;
      // cloudUV.x += iTime / 20000.;
      // // cloudUV.y += iTime / 10000.;
    
      vec4 worldPosition = vec4(cpos, 1.);
      vec4 mvPosition = projectionMatrix * modelViewMatrix * vec4(cpos, 1.0);
      gl_Position = mvPosition;
    }`,
      fragmentShader:
      
     ` uniform sampler2D texture1;
    uniform sampler2D textures[4];
    
    varying vec2 vUv;
    varying vec2 cloudUV;
    varying vec3 vColor;
    
    void main() {
      float contrast = 1.5;
      float brightness = 0.1;
      vec3 color = texture2D(textures[0], vUv).rgb * contrast;
      // color = color + vec3(brightness, brightness, brightness);
      color = mix(color, texture2D(textures[1], vUv).rgb, 0.5);
      gl_FragColor.rgb = color;
      gl_FragColor.a = 1.;
    }`,




      vertexColors: true,
      side: THREE.DoubleSide
    });
    let marker = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 8), new THREE.MeshBasicMaterial({color: "red", wireframe: true}));
    scene.add(marker);
    generateField();
    let clock = new THREE.Clock();
    const animate = function () {
      const elapsedTime = Date.now() - startTime;
      controls.update();

      let t = clock.getElapsedTime();
      marker.position.x = Math.sin(t * 0.5) * 5;
      marker.position.y = Math.cos(t * 0.3) * 5;
      marker.position.z = Math.cos(t * 0.3) * 5;
      raycaster.ray.intersectPlane(plane, intersectionPoint);

      // Move marker to the intersection point
      marker.position.copy(intersectionPoint);
      raycaster.setFromCamera(mouse, camera);

      grassUniforms.iTime.value = elapsedTime;
      particleMaterial.uniforms.uTime.value=elapsedTime
      particleMaterial.uniforms.uMousePosition.value=marker.position
      // raycaster.set(marker.position, new THREE.Vector3(0, -1, 0)); // Casting downward


     
      window.requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    animate();

    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    function convertRange(val, oldMin, oldMax, newMin, newMax) {
      return ((val - oldMin) * (newMax - newMin)) / (oldMax - oldMin) + newMin;
    }

    function generateField() {
      const positions = [];
      const uvs = [];
      const indices = [];
      const colors = [];
      const positionAttribute = pano.getAttribute("position");

    
      const uvAttribute = pano.getAttribute("uv");
      let vertices = pano.attributes.position;
      for (let i = 0; i < BLADE_COUNT; i++) {
        const xpl = vertices.getX(i);

        const ypl = vertices.getY(i);
        const zpl = vertices.getZ(i);
        const randomX = xpl + (Math.random() - 0.5) * 0.1;
        const randomY = ypl + (Math.random() - 0.5) * 0.1;
        const randomZ = zpl + (Math.random() - 0.5) * 0.1;

        // const particle = new THREE.Points(new THREE.SphereGeometry(0.06), new THREE.PointsMaterial());

        //             particle.position.set(randomX, randomY, randomZ);

        const VERTEX_COUNT = 5;
        const surfaceMin = PLANE_SIZE / 2;
        const surfaceMax = (PLANE_SIZE / 2) * -1;
        const radius = pano.attributes.position.count;
        const r = radius * Math.sqrt(Math.random());
        const theta = Math.random() * 2 * Math.PI;
        const x = r * Math.cos(theta);
        const y = r * Math.sin(theta);

        const pos = new THREE.Vector3(randomX, 0, randomY);

        const uv = [
          convertRange(pos.x, surfaceMin, surfaceMax, 0, 1),
          convertRange(pos.z, surfaceMin, surfaceMax, 0, 1)
        ];

        const blade = generateBlade(pos, i * VERTEX_COUNT, uv);
        blade.verts.forEach((vert) => {
          positions.push(...vert.pos);
          uvs.push(...vert.uv);
          colors.push(...vert.color);
        });
        blade.indices.forEach((indice) => indices.push(indice));
      }

      geom.setAttribute(
        "position",
        new THREE.BufferAttribute(new Float32Array(positions), 3)
      );
      geom.setAttribute(
        "uv",
        new THREE.BufferAttribute(new Float32Array(uvs), 2)
      );
      geom.setAttribute(
        "color",
        new THREE.BufferAttribute(new Float32Array(colors), 3)
      );
      geom.setIndex(indices);
      let plka = new THREE.PlaneGeometry(2, 2);
      // geom.computeVertexNormals();
      // geom.computeFaceNormals();

      const mesh = new THREE.Mesh(geom, grassMaterial);




      scene.add(mesh);

      // glassgrid(positions,uvs,colors)
    
    }

function glassgrid(positions,uvs,colors) {
  
let add=[]


  const positionAttribute = pano.getAttribute("position");

    
  const uvAttribute = pano.getAttribute("uv");
  const smallPlaneSize = 0.09; // Size of each small plane

let coil=geom.getAttribute("color").array


  for (let i = 0; i < positionAttribute.count; i++) {
// console.log(coil,"fgf")
    const smallGeometry = new THREE.PlaneGeometry(smallPlaneSize, smallPlaneSize);


  
    const pos = new THREE.Vector3().fromBufferAttribute(positionAttribute, i);
    const uv = new THREE.Vector2().fromBufferAttribute(uvAttribute, i);

    smallGeometry.setAttribute(
      "color",
      new THREE.Float32BufferAttribute([
        uv.x, uv.y, 
        uv.x , uv.y, 
        uv.x, uv.y , 
        uv.x , uv.y 
      ], 2)
    );
  
    // // Apply correct UV mapping
    smallGeometry.setAttribute(
      "uv",
      new THREE.Float32BufferAttribute([
        uv.x, uv.y, 
        uv.x , uv.y, 
        uv.x, uv.y , 
        uv.x , uv.y 
      ], 2)
    );


 
  
    const smallMaterial = new THREE.MeshBasicMaterial({ map: grassTexture, side: THREE.DoubleSide});



    // console.log(pos)
    // Create and position small plane
    const smallPlane = new THREE.Mesh(smallGeometry, smallMaterial);
    smallPlane.position.copy(new THREE.Vector3(pos.x,pos.y,pos.z));

adtt.push(smallPlane)
    



    
   }
}


if (adtt.length>=pano.attributes.position.count-3) {


let grp=new THREE.Group()
aarr.current=adtt

adtt.forEach(e=>{
  
grp.add(e)


  }
)

scene.add(grp)
}


    function generateBlade(center, vArrOffset, uv) {
      const MID_WIDTH = BLADE_WIDTH * 0.5;
      const TIP_OFFSET = 0.1;
      const height = BLADE_HEIGHT;

      const yaw = Math.random() * Math.PI * 2;
      const yawUnitVec = new THREE.Vector3(Math.sin(yaw), 0, -Math.cos(yaw));
      const tipBend = Math.random() * Math.PI * 2;
      const tipBendUnitVec = new THREE.Vector3(
        Math.sin(tipBend),
        0,
        -Math.cos(tipBend)
      );

      // Find the Bottom Left, Bottom Right, Top Left, Top right, Top Center vertex positions
      const bl = new THREE.Vector3().addVectors(
        center,
        new THREE.Vector3()
          .copy(yawUnitVec)
          .multiplyScalar((BLADE_WIDTH / 2) * 1)
      );
      const br = new THREE.Vector3().addVectors(
        center,
        new THREE.Vector3()
          .copy(yawUnitVec)
          .multiplyScalar((BLADE_WIDTH / 2) * -1)
      );
      const tl = new THREE.Vector3().addVectors(
        center,
        new THREE.Vector3().copy(yawUnitVec).multiplyScalar((MID_WIDTH / 2) * 1)
      );
      const tr = new THREE.Vector3().addVectors(
        center,
        new THREE.Vector3()
          .copy(yawUnitVec)
          .multiplyScalar((MID_WIDTH / 2) * -1)
      );
      const tc = new THREE.Vector3().addVectors(
        center,
        new THREE.Vector3().copy(tipBendUnitVec).multiplyScalar(TIP_OFFSET)
      );

      tl.y += height / 2;
      tr.y += height / 2;
      tc.y += height;

      // Vertex Colors
      const black = [0.0, 0.0, 0.0];
      const gray = [0.5, 0.0, 0.0];
      const white = [1.0, 1.0, 1.0];

      const verts = [
        { pos: bl, uv: uv, color: black },
        { pos: br, uv: uv, color: black },
        { pos: tr, uv: uv, color: gray },
        { pos: tl, uv: uv, color: gray },
        { pos: tc, uv: uv, color: white }
      ];

      const indices = [
        vArrOffset,
        vArrOffset + 1,
        vArrOffset + 2,
        vArrOffset + 2,
        vArrOffset + 4,
        vArrOffset + 3,
        vArrOffset + 3,
        vArrOffset,
        vArrOffset + 2
      ];

      return { verts, indices };
    }


function onMouseMove(event) {


  if ( adtt.length>=pano.attributes.position.count-3) {


 let    intersects = raycaster.intersectObjects(adtt);
   
    for (let index = 0; index < intersects.length; index++) {

console.log(intersects[index],"ius the mesh",intersects)
let point=intersects[index]
  // point.object.position.x += (Math.random() - 0.5) * 1;

  point.object.material=particleMaterial


  point.object.updateMatrixWorld(); // Ensure the matrix world is up-to-date
  
  // Create a new matrix and copy the world matrix of the geometry
  let inverseMatrix = new THREE.Matrix4().copy(  point.object.matrixWorld).invert();

  let markerLocalPosition = marker.position.clone().applyMatrix4(inverseMatrix);

  particleMaterial.uniforms.uMousePosition.value=markerLocalPosition
    }



  }

  if (event) {
    mouse.x = (event.clientX / window.innerWidth) * 2-1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    mouse.z=0
  }
  
}
    // Cleanup
    return () => {
      window.removeEventListener("mousemove",onMouseMove)


      renderer.dispose();
scene.clear();

    };
  }, []);



  useEffect(() => {
  console.log(aarr,"arrer")
  }, )
  


  return <canvas ref={canvasRef} />;
};

export default DancingGrass; 