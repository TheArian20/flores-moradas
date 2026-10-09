import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {UnrealBloomPass} from 'three/addons/postprocessing/UnrealBloomPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';
import {roseGeometry,roseParticles,daisyGeometry} from './rose.mjs';

const canvas=document.getElementById('galaxy'),button=document.getElementById('enter'),message=document.getElementById('message');
const status=document.getElementById('status');
let rng=314159;const random=()=>((rng=(Math.imul(rng,1664525)+1013904223)>>>0)/4294967296);
let renderer;
try{renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'high-performance'});}catch(error){status.textContent='No se pudo iniciar WebGL. Activa la aceleración gráfica o prueba otro navegador.';throw error;}
renderer.setClearColor(0x090411);renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));
renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;
const scene=new THREE.Scene();scene.fog=new THREE.FogExp2(0x090411,.017);
const camera=new THREE.PerspectiveCamera(43,innerWidth/innerHeight,.1,120);
const controls=new OrbitControls(camera,canvas);controls.enableDamping=true;controls.dampingFactor=.065;controls.enablePan=false;controls.minDistance=4.8;controls.maxDistance=28;controls.maxPolarAngle=Math.PI-.08;controls.minPolarAngle=.08;controls.zoomSpeed=.6;controls.enabled=false;controls.target.set(0,.25,0);
function reset(){const distance=innerWidth<600?14:11;camera.position.set(0,distance*.75,distance*.78);controls.target.set(0,.25,0);controls.update();}reset();
scene.add(new THREE.HemisphereLight(0xe8d4ff,0x290938,2.1));
for(const [color,intensity,x,y,z] of [[0xffe9ff,4,-4,8,5],[0x9b55ff,5,5,3,-4],[0xf8abff,2,-5,1,-3]]){const light=new THREE.DirectionalLight(color,intensity);light.position.set(x,y,z);scene.add(light);}
const world=new THREE.Group();scene.add(world);world.visible=false;
const flowerGroup=new THREE.Group();world.add(flowerGroup);
const high=roseGeometry(24),low=roseGeometry(9);
const material=new THREE.MeshPhysicalMaterial({vertexColors:true,side:THREE.DoubleSide,roughness:.38,metalness:.06,clearcoat:.35,clearcoatRoughness:.3,emissive:0x3d0755,emissiveIntensity:.22});
const rose=new THREE.Mesh(high,material);rose.scale.setScalar(1.25);rose.position.y=-.2;flowerGroup.add(rose);
const satellites=new THREE.InstancedMesh(low,material,85),dummy=new THREE.Object3D();
for(let i=0;i<85;i++){const a=i*2.399963,r=2.65+Math.pow(random(),.75)*4.7;dummy.position.set(Math.cos(a)*r,(random()-.5)*.7,Math.sin(a)*r);dummy.rotation.set((random()-.5)*.5,random()*6.28,(random()-.5)*.5);dummy.scale.setScalar(.085+random()*.15);dummy.updateMatrix();satellites.setMatrixAt(i,dummy.matrix);}world.add(satellites);
const daisies=new THREE.InstancedMesh(daisyGeometry(),material,40);
for(let i=0;i<40;i++){const a=i*2.399+1,r=2.9+random()*4.3;dummy.position.set(Math.cos(a)*r,(random()-.5)*.4,Math.sin(a)*r);dummy.rotation.set((random()-.5)*.4,random()*6.28,(random()-.5)*.4);dummy.scale.setScalar(.14+random()*.2);dummy.updateMatrix();daisies.setMatrixAt(i,dummy.matrix);}world.add(daisies);
function glowTexture(){const c=document.createElement('canvas');c.width=c.height=64;const ctx=c.getContext('2d'),g=ctx.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'white');g.addColorStop(.13,'#f4c8ff');g.addColorStop(.35,'#a939df66');g.addColorStop(1,'#7000bb00');ctx.fillStyle=g;ctx.fillRect(0,0,64,64);return new THREE.CanvasTexture(c);}
const glow=glowTexture();
const introMaterial=new THREE.PointsMaterial({color:0xe9beff,size:.022,map:glow,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending});
const intro=new THREE.Points(roseParticles(high,24000,random),introMaterial);intro.scale.setScalar(1.25);scene.add(intro);
const positions=new Float32Array(14000*3),colors=new Float32Array(14000*3),color=new THREE.Color();
for(let i=0;i<14000;i++){const r=.7+Math.pow(random(),.7)*7,a=Math.floor(random()*5)*Math.PI*.4+r*.8+(random()-.5)*.9;positions.set([Math.cos(a)*r,(random()-.5)*(.15+r*.04),Math.sin(a)*r],i*3);color.setHSL(.74+random()*.08,.7,.5+random()*.3);colors.set([color.r,color.g,color.b],i*3);}
const dustGeo=new THREE.BufferGeometry();dustGeo.setAttribute('position',new THREE.BufferAttribute(positions,3));dustGeo.setAttribute('color',new THREE.BufferAttribute(colors,3));
const dust=new THREE.Points(dustGeo,new THREE.PointsMaterial({size:.045,map:glow,transparent:true,opacity:.85,vertexColors:true,depthWrite:false,blending:THREE.AdditiveBlending}));world.add(dust);
const starPositions=new Float32Array(1700*3);for(let i=0;i<starPositions.length;i++)starPositions[i]=(random()-.5)*90;
scene.add(new THREE.Points(new THREE.BufferGeometry().setAttribute('position',new THREE.BufferAttribute(starPositions,3)),new THREE.PointsMaterial({color:0xbe9ade,size:.035,map:glow,transparent:true,opacity:.6,depthWrite:false})));
const words=['Eres increíble','Te quiero mucho','Siempre contigo','Eres mi universo','Mi persona favorita','Gracias por existir','Eres especial','Contigo todo es mejor'];
for(let i=0;i<24;i++){const c=document.createElement('canvas');c.width=768;c.height=96;const ctx=c.getContext('2d');ctx.font='italic 42px Georgia';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#eddbff';ctx.fillText(words[i%words.length],384,48);const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;const mesh=new THREE.Mesh(new THREE.PlaneGeometry(2.7,.3375),new THREE.MeshBasicMaterial({map:tex,transparent:true,opacity:.72,side:THREE.DoubleSide,depthWrite:false}));const a=i*2.399,r=3.3+random()*3.8;mesh.position.set(Math.cos(a)*r,.1+random()*.25,Math.sin(a)*r);mesh.rotation.set(-Math.PI/2,0,-a+.5);world.add(mesh);}
const composer=new EffectComposer(renderer);composer.addPass(new RenderPass(scene,camera));const bloom=new UnrealBloomPass(new THREE.Vector2(innerWidth,innerHeight),.55,.55,.78);composer.addPass(bloom);composer.addPass(new OutputPass());
function resize(){camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight,false);composer.setSize(innerWidth,innerHeight);}addEventListener('resize',resize);resize();
let opened=false,transition=0,time=0,last=0,disposed=false,paused=matchMedia('(prefers-reduced-motion: reduce)').matches;
button.disabled=false;
button.addEventListener('click',()=>{opened=true;world.visible=true;controls.enabled=true;button.disabled=true;document.body.classList.add('open');canvas.focus();});
document.getElementById('letter').onclick=()=>message.showModal();document.getElementById('close').onclick=()=>message.close();message.addEventListener('click',event=>{if(event.target===message){const r=message.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)message.close();}});
canvas.addEventListener('dblclick',reset);canvas.addEventListener('keydown',e=>{if([' ','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','+','-','='].includes(e.key))e.preventDefault();if(e.key===' ')paused=!paused;if(e.key.toLowerCase()==='r')reset();const offset=camera.position.clone().sub(controls.target),sphere=new THREE.Spherical().setFromVector3(offset);if(e.key==='ArrowLeft')sphere.theta-=.12;if(e.key==='ArrowRight')sphere.theta+=.12;if(e.key==='ArrowUp')sphere.phi-=.1;if(e.key==='ArrowDown')sphere.phi+=.1;if(e.key==='+'||e.key==='=')sphere.radius*=.9;if(e.key==='-')sphere.radius/= .9;sphere.radius=THREE.MathUtils.clamp(sphere.radius,controls.minDistance,controls.maxDistance);sphere.phi=THREE.MathUtils.clamp(sphere.phi,.08,Math.PI-.08);camera.position.copy(controls.target).add(new THREE.Vector3().setFromSpherical(sphere));controls.update();});
canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();status.textContent='Se interrumpió la aceleración gráfica. Recarga para continuar.';renderer.setAnimationLoop(null);});
renderer.setAnimationLoop(now=>{if(disposed)return;const dt=last?Math.min((now-last)/1000,.05):0;last=now;if(document.hidden)return;if(!paused&&!message.open)time+=dt;controls.enabled=opened&&!message.open;controls.update();intro.rotation.y=time*.16;if(opened){transition=Math.min(1,transition+(paused?1:dt*.65));const eased=1-Math.pow(1-transition,3);introMaterial.opacity=1-transition;intro.visible=transition<1;world.scale.setScalar(.15+.85*eased);world.rotation.y=time*.035;dust.rotation.y=time*.016;rose.rotation.y=time*.04;}composer.render();});
addEventListener('pagehide',()=>{disposed=true;renderer.setAnimationLoop(null);controls.dispose();const geometries=new Set(),materials=new Set(),textures=new Set();scene.traverse(o=>{if(o.geometry)geometries.add(o.geometry);if(o.material)materials.add(o.material);});for(const m of materials){for(const v of Object.values(m))if(v?.isTexture)textures.add(v);m.dispose();}for(const g of geometries)g.dispose();for(const t of textures)t.dispose();composer.dispose();renderer.dispose();},{once:true});
