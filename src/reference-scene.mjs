import * as THREE from 'three';
import {galaxyParticles} from './galaxy-particles.mjs';
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
 const ribbons=[];
 for(let j=0;j<3;j++){
  const orbit=new THREE.Group();orbit.rotation.set(.26+j*.27,j*.65,j*.18);world.add(orbit);ribbons.push(orbit);
  const str=['GRACIAS POR EXISTIR','ERES ESPECIAL','MI PERSONA FAVORITA'][j],radius=2.4+j*.42,span=2.2;
  const pos=[],uv=[],index=[];for(let k=0;k<=96;k++){const a=k/96*span+j*2.1-.9;for(let side=0;side<2;side++){const r=radius+(side-.5)*.58;pos.push(Math.sin(a)*r,0,Math.cos(a)*r);uv.push(k/96,side);}if(k<96){const n=k*2;index.push(n,n+1,n+2,n+1,n+3,n+2);}}
  const ribbon=new THREE.Mesh(new THREE.BufferGeometry().setAttribute('position',new THREE.Float32BufferAttribute(pos,3)).setAttribute('uv',new THREE.Float32BufferAttribute(uv,2)).setIndex(index),materialFor(makeText(str,true)));ribbon.material.opacity=.68;orbit.add(ribbon);
  const ring=[];for(let k=0;k<180;k++){const a=k/180*Math.PI*2;ring.push(Math.sin(a)*radius,0,Math.cos(a)*radius);}orbit.add(new THREE.LineLoop(new THREE.BufferGeometry().setAttribute('position',new THREE.Float32BufferAttribute(ring,3)),new THREE.LineBasicMaterial({color:0xc998ff,transparent:true,opacity:.12,depthWrite:false})));
 }
 const gems=[];for(let i=0;i<18;i++){const geo=new THREE.OctahedronGeometry(.055+random()*.065,0).toNonIndexed(),c=[];for(let v=0;v<geo.attributes.position.count;v+=3){const b=.4+random()*.6;for(let k=0;k<3;k++)c.push(b*.9,b*.83,b);}geo.setAttribute('color',new THREE.Float32BufferAttribute(c,3));const gem=new THREE.Mesh(geo,new THREE.MeshBasicMaterial({vertexColors:true,transparent:true,opacity:.85}));const a=random()*6.283,r=2.1+random()*5;gem.position.set(Math.cos(a)*r,(random()-.5)*2.5,Math.sin(a)*r);world.add(gem);gems.push(gem);}
 const introPositions=[],introColors=[];
 // Broad rounded petals in two overlapping whorls, traced by particles.
 for(let layer=0;layer<2;layer++)for(let petal=0;petal<5;petal++)for(let i=0;i<1050;i++){
  const t=random()*Math.PI*2,rad=i%3===0?1:Math.sqrt(random()),angle=petal*Math.PI*.4+layer*.55;
  const reach=layer?1.04:1.62,lx=.69*rad*Math.sin(t)*(layer?.67:1),ly=reach*.48+reach*.58*rad*Math.cos(t);
  const x=lx*Math.cos(angle)+ly*Math.sin(angle),z=ly*Math.cos(angle)-lx*Math.sin(angle);
  introPositions.push(x,.18*Math.sin(t)*rad+.16*layer+.12*Math.cos(t*2),z);
  color.setHSL(.76+random()*.06,.3,.62+random()*.32);introColors.push(color.r,color.g,color.b);
 }
 for(let i=0;i<2200;i++){
  const a=random()*Math.PI*2,r=.31*Math.sqrt(random());introPositions.push(Math.cos(a)*r,.24+random()*.22,Math.sin(a)*r);introColors.push(1,.82,.98);
 }
 const intro=new THREE.Points(new THREE.BufferGeometry().setAttribute('position',new THREE.Float32BufferAttribute(introPositions,3)).setAttribute('color',new THREE.Float32BufferAttribute(introColors,3)),new THREE.PointsMaterial({size:.026,opacity:.78,vertexColors:true,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}));

 return {world,rose,dust,sparkles,intro,billboards,labels,updateGalaxy(time,ratio){particles.update(time,ratio);for(let i=0;i<ribbons.length;i++)ribbons[i].rotation.y=time*(.055+i*.025)+i*.65;for(let i=0;i<gems.length;i++)gems[i].rotation.set(time*.23+i,time*.17,0);}};
}
