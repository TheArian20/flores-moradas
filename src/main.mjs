import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {UnrealBloomPass} from 'three/addons/postprocessing/UnrealBloomPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';

import assets from './reference-assets.mjs';
import {createReferenceScene} from './reference-scene.mjs';
import {createFlowerMotion} from './flower-motion.mjs';
import fontData from './font-asset.mjs';
async function initialize(){
const handwriting=new FontFace('Galaxy Handwriting', 'url('+fontData+')');await handwriting.load();document.fonts.add(handwriting);
const canvas=document.getElementById('galaxy'),button=document.getElementById('enter'),message=document.getElementById('message'),status=document.getElementById('status');
let rng=314159;const random=()=>((rng=(Math.imul(rng,1664525)+1013904223)>>>0)/4294967296);
let renderer;
try{renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'});}catch(error){status.textContent='No se pudo iniciar WebGL. Activa la aceleración gráfica o prueba otro navegador.';throw error;}
renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.95;
const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(43,innerWidth/innerHeight,.1,160);
const bg=document.createElement('canvas');bg.width=512;bg.height=1024;
const bgc=bg.getContext('2d'),bgGrad=bgc.createRadialGradient(256,510,0,256,510,570);bgGrad.addColorStop(0,'#241039');bgGrad.addColorStop(.48,'#13091f');bgGrad.addColorStop(1,'#090511');bgc.fillStyle=bgGrad;bgc.fillRect(0,0,512,1024);scene.background=new THREE.CanvasTexture(bg);scene.background.colorSpace=THREE.SRGBColorSpace;
const controls=new OrbitControls(camera,canvas);controls.enableDamping=true;controls.dampingFactor=.065;controls.enablePan=false;controls.minDistance=5;controls.maxDistance=42;controls.minPolarAngle=.06;controls.maxPolarAngle=Math.PI-.06;controls.zoomSpeed=.65;controls.enabled=false;controls.target.set(0,0,0);
const homeDistance=()=>Math.max(12,10.5/camera.aspect);
function reset(){const d=homeDistance();camera.position.set(0,d*.94,d*.342);controls.target.set(0,0,0);controls.update();}reset();
function glowTexture(){const c=document.createElement('canvas');c.width=c.height=64;const ctx=c.getContext('2d'),g=ctx.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'#fffaff');g.addColorStop(.12,'#f8d5ff');g.addColorStop(.32,'#c262e777');g.addColorStop(1,'#8500bf00');ctx.fillStyle=g;ctx.fillRect(0,0,64,64);return new THREE.CanvasTexture(c);}
const glow=glowTexture(),textCache=new Map();
function makeText(text,single){const key=(single?'char:':'line:')+text;if(textCache.has(key))return textCache.get(key);const c=document.createElement('canvas');c.width=1024;c.height=128;const ctx=c.getContext('2d');ctx.font=single?'56px Georgia':'54px "Galaxy Handwriting"';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#f2dbff';ctx.fillText(text,c.width/2,c.height/2,c.width-6);const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;textCache.set(key,tex);return tex;}
const loader=new THREE.TextureLoader(),textures={};
await Promise.all(Object.entries(assets).map(async([key,url])=>{const texture=await loader.loadAsync(url);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=renderer.capabilities.getMaxAnisotropy();textures[key]=texture;}));
const {world,rose,dust,sparkles,intro,updateIntro,billboards,updateGalaxy}=createReferenceScene(textures,glow,makeText,random);scene.add(world,intro);world.visible=false;

const animateFlower=createFlowerMotion(rose);
function fitIntro(){const visibleHeight=2*homeDistance()*Math.tan(THREE.MathUtils.degToRad(43/2)),diameter=Math.min(camera.aspect*.76,.4)*visibleHeight;intro.scale.setScalar(diameter/3.4);intro.position.z=-visibleHeight*.055;}fitIntro();
const starPositions=[];for(let i=0;i<1800;i++)starPositions.push((random()-.5)*65,(random()-.5)*45,(random()-.5)*65);
const stars=new THREE.Points(new THREE.BufferGeometry().setAttribute('position',new THREE.Float32BufferAttribute(starPositions,3)),new THREE.PointsMaterial({map:glow,color:0xc696ee,size:.035,transparent:true,opacity:.42,depthWrite:false}));scene.add(stars);
const composer=new EffectComposer(renderer);composer.addPass(new RenderPass(scene,camera));const bloom=new UnrealBloomPass(new THREE.Vector2(innerWidth,innerHeight),.42,.55,.82);composer.addPass(bloom);composer.addPass(new OutputPass());
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
let opened=false,transition=0,time=0,last=0,disposed=false,paused=reducedMotion;
function resize(){camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight,false);composer.setSize(innerWidth,innerHeight);if(!opened){reset();fitIntro();}}addEventListener('resize',resize);resize();
button.disabled=false;document.body.classList.add('ready');
button.addEventListener('click',()=>{opened=true;world.visible=true;button.disabled=true;document.body.classList.add('opening');canvas.focus();});
document.getElementById('letter').onclick=()=>message.showModal();document.getElementById('close').onclick=()=>message.close();message.addEventListener('click',event=>{if(event.target===message){const r=message.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)message.close();}});
canvas.addEventListener('dblclick',reset);canvas.addEventListener('keydown',e=>{if([' ','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','+','-','='].includes(e.key))e.preventDefault();if(e.key===' ')paused=!paused;if(e.key.toLowerCase()==='r')reset();const offset=camera.position.clone().sub(controls.target),sphere=new THREE.Spherical().setFromVector3(offset);if(e.key==='ArrowLeft')sphere.theta-=.12;if(e.key==='ArrowRight')sphere.theta+=.12;if(e.key==='ArrowUp')sphere.phi-=.1;if(e.key==='ArrowDown')sphere.phi+=.1;if(e.key==='+'||e.key==='=')sphere.radius*=.9;if(e.key==='-')sphere.radius/= .9;sphere.radius=THREE.MathUtils.clamp(sphere.radius,controls.minDistance,controls.maxDistance);sphere.phi=THREE.MathUtils.clamp(sphere.phi,controls.minPolarAngle,controls.maxPolarAngle);camera.position.copy(controls.target).add(new THREE.Vector3().setFromSpherical(sphere));controls.update();});
canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();status.textContent='Se interrumpió la aceleración gráfica. Recarga para continuar.';renderer.setAnimationLoop(null);});

const inverseWorld=new THREE.Quaternion(),spin=new THREE.Quaternion(),zAxis=new THREE.Vector3(0,0,1);
renderer.setAnimationLoop(now=>{
 if(disposed)return;const dt=last?Math.min((now-last)/1000,.05):0;last=now;if(document.hidden)return;
 if(!paused&&!message.open)time+=dt;
 controls.enabled=opened&&transition>=1&&!message.open;controls.update();
 updateIntro(time,transition,renderer.getPixelRatio(),reducedMotion);
 if(opened){
  if(!message.open)transition=Math.min(1,transition+(paused?1:dt/2.4));
  const reveal=THREE.MathUtils.smoothstep(transition,.34,1);
  world.scale.setScalar(.08+.92*reveal);world.visible=reveal>.01;
  if(transition>.42)document.body.classList.add('open');
  world.rotation.y=time*.035;dust.rotation.y=time*.009;rose.rotation.y=time*.045;
  animateFlower(time,reveal);
  updateGalaxy(time,renderer.getPixelRatio());
 }
 world.updateMatrixWorld(true);world.getWorldQuaternion(inverseWorld).invert();
 for(const mesh of billboards){spin.setFromAxisAngle(zAxis,mesh.userData.spin);mesh.quaternion.copy(inverseWorld).multiply(camera.quaternion).multiply(spin);}
 composer.render();
});
addEventListener('pagehide',event=>{if(event.persisted)return;disposed=true;renderer.setAnimationLoop(null);controls.dispose();const geometries=new Set(),materials=new Set(),textureSet=new Set([scene.background]);scene.traverse(o=>{if(o.geometry)geometries.add(o.geometry);if(o.material)materials.add(o.material);});for(const m of materials){for(const v of Object.values(m))if(v?.isTexture)textureSet.add(v);m.dispose();}for(const g of geometries)g.dispose();for(const t of textureSet)t.dispose();composer.dispose();renderer.dispose();},{once:true});

}
initialize().catch(error=>{console.error(error);document.getElementById('status').textContent='No se pudo cargar la galaxia. Recarga la página.';});
