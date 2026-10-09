import * as THREE from 'three';
import {galaxyParticles} from './galaxy-particles.mjs';
import {createIntroFlower} from './intro-flower.mjs';
export const phrases=['Eres increíble','Eres mi universo','Te quiero mucho','Siempre contigo','Eres especial','Mi persona favorita','Gracias por existir','Eres magia','Contigo todo es mejor','Te mereces lo bonito','Mi lugar favorito','Eres mi alegría','Admiración','Gratitud','Cariño','Eres única','Qué suerte tenerte','Eres irremplazable','Me haces sonreír','Contigo la vida es más bonita','Siempre estaré para ti'];

export function createReferenceScene(textures,glow,makeText,random){
 const world=new THREE.Group(),billboards=[],labels=[],color=new THREE.Color();
 const materialFor=map=>new THREE.MeshBasicMaterial({map,transparent:true,alphaTest:.02,side:THREE.DoubleSide,depthWrite:false,toneMapped:false});
 const geometry=new THREE.PlaneGeometry(3.65,3.65,64,64),p=geometry.attributes.position;
 for(let i=0;i<p.count;i++){const x=p.getX(i),z=-p.getY(i),r=Math.hypot(x,z);p.setXYZ(i,x,.48*Math.exp(-r*r*.78)+.035*Math.sin(x*3)*Math.sin(z*2),z);}geometry.computeVertexNormals();
 const rose=new THREE.Mesh(geometry,materialFor(textures.hero));rose.material.depthWrite=true;rose.position.y=.12;world.add(rose);
 const unit=new THREE.PlaneGeometry(1,1),materials=['rose','daisy','violet','hero'].map(k=>materialFor(textures[k]));materials[1].color.set(0xc69cff);
 for(let i=0;i<180;i++){
  const inner=i<82,near=i>163,a=i*2.399963+(random()-.5)*.4;
  const r=inner?1.6+random()*2.3:near?6+random()*5:3.7+random()*6.4;
  const mesh=new THREE.Mesh(unit,materials[i%4]);mesh.position.set(Math.cos(a)*r,(random()-.5)*(inner?.85:near?5:2.8),Math.sin(a)*r);
  mesh.scale.setScalar(inner?.24+random()*.5:near?.65+random()*.75:.2+random()*.5);mesh.userData.spin=random()*Math.PI*2;billboards.push(mesh);world.add(mesh);
 }
 const particles=galaxyParticles(random);world.add(particles.group);const dust=particles.dust,sparkles=particles.sparks;
 // A soft luminous core connects the flowers to the dust, without flattening the dark background.
 const halo=new THREE.Mesh(new THREE.PlaneGeometry(8,8),new THREE.MeshBasicMaterial({map:glow,color:0xad35ff,transparent:true,opacity:.25,blending:THREE.AdditiveBlending,depthWrite:false}));halo.rotation.x=-Math.PI/2;halo.position.y=-.12;world.add(halo);
 for(let i=0;i<46;i++){
  const mesh=new THREE.Mesh(new THREE.PlaneGeometry(2.75,.38),materialFor(makeText(phrases[i%phrases.length],false)));
  const a=i*2.399963+.3,r=i<24?2.3+random()*3.2:5.5+random()*5;
  mesh.position.set(Math.cos(a)*r,(random()-.5)*(i<24?1.4:4.2),Math.sin(a)*r);mesh.material.opacity=i<24?.83:.55;
  mesh.scale.setScalar(i<24?.8+random()*.28:.6+random()*.65);mesh.userData.spin=(random()-.5)*.23;billboards.push(mesh);labels.push(mesh);world.add(mesh);
 }
 // Phrases follow the orbit while facing the viewer: no mirrored ribbon backs.
 const orbitPhrases=[];
 for(let i=0;i<3;i++){
  const text=['Gracias por existir','Eres especial','Mi persona favorita'][i];
  const mesh=new THREE.Mesh(new THREE.PlaneGeometry(3.25,.41),materialFor(makeText(text,false)));
  mesh.material.opacity=.82;mesh.userData.spin=0;
  billboards.push(mesh);world.add(mesh);orbitPhrases.push(mesh);
 }
 const gems=[];for(let i=0;i<18;i++){const geo=new THREE.OctahedronGeometry(.055+random()*.065,0).toNonIndexed(),c=[];for(let v=0;v<geo.attributes.position.count;v+=3){const b=.4+random()*.6;for(let k=0;k<3;k++)c.push(b*.9,b*.83,b);}geo.setAttribute('color',new THREE.Float32BufferAttribute(c,3));const gem=new THREE.Mesh(geo,new THREE.MeshBasicMaterial({vertexColors:true,transparent:true,opacity:.85}));const a=random()*6.283,r=2.1+random()*5;gem.position.set(Math.cos(a)*r,(random()-.5)*2.5,Math.sin(a)*r);world.add(gem);gems.push(gem);}
 const {intro,updateIntro}=createIntroFlower(textures.hero,glow,random);
 return {world,rose,dust,sparkles,intro,updateIntro,billboards,labels,updateGalaxy(time,ratio){particles.update(time,ratio);for(let i=0;i<orbitPhrases.length;i++){const a=time*.045+i*Math.PI*2/3+.25,r=2.4+i*.18;orbitPhrases[i].position.set(Math.cos(a)*r,.42+Math.sin(a)*.22,Math.sin(a)*r);}for(let i=0;i<gems.length;i++)gems[i].rotation.set(time*.23+i,time*.17,0);}};
}
