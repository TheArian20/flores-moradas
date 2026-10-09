import * as THREE from 'three';

export const phrases=['Eres increíble','Eres mi universo','Te quiero mucho','Siempre contigo','Eres especial','Mi persona favorita','Gracias por existir','Eres magia','Contigo todo es mejor','Te mereces lo bonito','Mi lugar favorito','Eres mi alegría','Admiración','Gratitud','Cariño','Eres única','Qué suerte tenerte','Eres irremplazable','Me haces sonreír','Contigo la vida es más bonita','Siempre estaré para ti'];
export function createReferenceScene(textures,glow,makeText,random){
 const world=new THREE.Group(),billboards=[];
 const materialFor=map=>new THREE.MeshBasicMaterial({map,transparent:true,alphaTest:.025,side:THREE.DoubleSide,depthWrite:false,toneMapped:false});
 const geometry=new THREE.PlaneGeometry(4.7,4.7,48,48),p=geometry.attributes.position;
 for(let i=0;i<p.count;i++){const x=p.getX(i),z=-p.getY(i),r=Math.hypot(x,z);p.setXYZ(i,x,.64*Math.exp(-r*r*.64)+.07*Math.sin(x*3)*Math.sin(z*2),z);}
 geometry.computeVertexNormals();
 const rose=new THREE.Mesh(geometry,materialFor(textures.hero));rose.position.y=.08;rose.renderOrder=2;world.add(rose);
 const unit=new THREE.PlaneGeometry(1,1);
 const materials=['rose','daisy','violet'].map(k=>materialFor(textures[k]));
 for(let i=0;i<155;i++){
  const a=i*2.399963,r=2.15+Math.pow(random(),.72)*5.15;
  const mesh=new THREE.Mesh(unit,materials[i%3]);
  mesh.position.set(Math.cos(a)*r,(random()-.5)*.85,Math.sin(a)*r);
  const size=.22+Math.pow(random(),1.6)*.67;mesh.scale.setScalar(size);
  mesh.userData.spin=(random()-.5)*1.2;billboards.push(mesh);world.add(mesh);
 }
 // Thick, broken spiral arms, with a sparse cloud above and below the disc.
 const positions=[],colors=[],color=new THREE.Color();
 for(let i=0;i<18000;i++){
  const r=i<6000?1.8+random()*1.7:.65+Math.pow(random(),.72)*6.4,a=Math.floor(random()*5)*Math.PI*.4+r*.88+(random()-.5)*.88;
  positions.push(Math.cos(a)*r,(random()-.5)*(.18+r*.045),Math.sin(a)*r);
  color.setHSL(.74+random()*.12,.62,.4+random()*.42);colors.push(color.r,color.g,color.b);
 }
 const dust=new THREE.Points(new THREE.BufferGeometry().setAttribute('position',new THREE.Float32BufferAttribute(positions,3)).setAttribute('color',new THREE.Float32BufferAttribute(colors,3)),new THREE.PointsMaterial({map:glow,size:.105,transparent:true,opacity:.8,vertexColors:true,depthWrite:false,blending:THREE.AdditiveBlending}));world.add(dust);
 const sparklePositions=[];
 for(let i=0;i<140;i++){const a=random()*Math.PI*2,r=1+random()*7;sparklePositions.push(Math.cos(a)*r,(random()-.5)*1.5,Math.sin(a)*r);}
 const sparkles=new THREE.Points(new THREE.BufferGeometry().setAttribute('position',new THREE.Float32BufferAttribute(sparklePositions,3)),new THREE.PointsMaterial({map:glow,color:0xfbdcff,size:.15,transparent:true,opacity:.9,depthWrite:false,blending:THREE.AdditiveBlending}));world.add(sparkles);
 const labels=[];
 for(let i=0;i<48;i++){
  const tex=makeText(phrases[i%phrases.length],false),mesh=new THREE.Mesh(new THREE.PlaneGeometry(2.7,.38),materialFor(tex));
  const a=i*2.399963+.3,r=2.7+random()*5;
  mesh.position.set(Math.cos(a)*r,(random()-.5)*1.2,Math.sin(a)*r);mesh.material.opacity=.85;
  mesh.scale.setScalar(.8+random()*.4);mesh.userData.spin=(random()-.5)*.2;billboards.push(mesh);labels.push(mesh);world.add(mesh);
 }
 // Curved lettering follows inclined orbits, rather than floating in one flat layer.
 for(let j=0;j<3;j++){
  const orbit=new THREE.Group();orbit.rotation.set(.18+j*.25,0,j*.3);world.add(orbit);
  const str=['GRACIAS POR EXISTIR  ·  ','ERES ESPECIAL  ·  ','MI PERSONA FAVORITA  ·  '][j].repeat(2),radius=2.7+j*.8;
  for(let k=0;k<str.length;k++){
   if(str[k]===' ')continue;
   const a=k/str.length*Math.PI*2,letter=new THREE.Mesh(new THREE.PlaneGeometry(.37,.42),materialFor(makeText(str[k],true)));
   letter.position.set(Math.sin(a)*radius,.04,Math.cos(a)*radius);letter.rotation.set(-Math.PI/2,0,-a);letter.material.opacity=.8;orbit.add(letter);
  }
  const ring=[];for(let k=0;k<180;k++){const a=k/180*Math.PI*2;ring.push(Math.sin(a)*radius,0,Math.cos(a)*radius);}
  orbit.add(new THREE.LineLoop(new THREE.BufferGeometry().setAttribute('position',new THREE.Float32BufferAttribute(ring,3)),new THREE.LineBasicMaterial({color:0xc16dff,transparent:true,opacity:.15,depthWrite:false})));
 }
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
 return {world,rose,dust,sparkles,intro,billboards,labels};
}
