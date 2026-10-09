import * as THREE from 'three';

// Sample the actual petal silhouette and folds, instead of overlapping circles.
export function createIntroFlower(texture,glow,random){
 const group=new THREE.Group();
 const sampling=document.createElement('canvas');sampling.width=sampling.height=320;
 const ctx=sampling.getContext('2d',{willReadFrequently:true});ctx.drawImage(texture.image,0,0,320,320);
 const rgba=ctx.getImageData(0,0,320,320).data;
 const positions=[],colors=[],seeds=[],sizes=[];
 const color=new THREE.Color();
 for(let tries=0;positions.length<6500*3&&tries<140000;tries++){
  const u=random(),v=random(),x=Math.floor(u*319),y=Math.floor(v*319),offset=(y*320+x)*4;
  if(rgba[offset+3]<100)continue;
  const luminance=(rgba[offset]+rgba[offset+1]*2+rgba[offset+2])/1020;
  const next=(y*320+Math.min(x+2,319))*4;
  const edge=Math.abs(rgba[offset+1]-rgba[next+1])/255;
  if(random()>.08+luminance*.18+edge*4)continue;
  const px=(u-.5)*3.4,pz=(v-.5)*3.4,r=Math.hypot(px,pz);
  positions.push(px,.27*Math.exp(-r*r*1.15)+luminance*.035,pz);
  color.setRGB(.57+luminance*.35,.32+luminance*.42,.85+luminance*.15);colors.push(color.r,color.g,color.b);
  seeds.push(random()*Math.PI*2);sizes.push(.65+random()*.75);
 }
 const geometry=new THREE.BufferGeometry().setAttribute('position',new THREE.Float32BufferAttribute(positions,3)).setAttribute('color',new THREE.Float32BufferAttribute(colors,3)).setAttribute('aSeed',new THREE.Float32BufferAttribute(seeds,1)).setAttribute('aSize',new THREE.Float32BufferAttribute(sizes,1));
 geometry.computeBoundingSphere();geometry.boundingSphere.radius+=5;
 const material=new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,uniforms:{uTime:{value:0},uDissolve:{value:0},uOpacity:{value:1},uRatio:{value:1}},vertexShader:`
  attribute vec3 color;attribute float aSeed;attribute float aSize;uniform float uTime;uniform float uDissolve;uniform float uRatio;varying vec3 vColor;varying float vSeed;
  void main(){vec3 p=position;p.y+=sin(uTime*.8+length(p.xz)*3.+aSeed*.15)*.018;
   vec3 direction=normalize(vec3(p.x+.1*sin(aSeed),.1*sin(aSeed*2.),p.z+.1*cos(aSeed)));p+=direction*uDissolve*(1.4+mod(aSeed,2.));
   vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;gl_PointSize=clamp(aSize*uRatio*20./max(4.,-mv.z),.8,3.5);vColor=color;vSeed=aSeed;}
 `,fragmentShader:`
  uniform float uTime;uniform float uOpacity;varying vec3 vColor;varying float vSeed;
  void main(){float d=length(gl_PointCoord-.5)*2.;if(d>1.)discard;float a=exp(-d*d*3.)*(.36+.14*sin(uTime*.6+vSeed))*uOpacity;gl_FragColor=vec4(vColor,a);}
 `});
 const particles=new THREE.Points(geometry,material);group.add(particles);
 const surfaceGeometry=new THREE.PlaneGeometry(3.4,3.4,40,40),p=surfaceGeometry.attributes.position;
 for(let i=0;i<p.count;i++){const x=p.getX(i),z=-p.getY(i);p.setXYZ(i,x,.27*Math.exp(-(x*x+z*z)*1.15)-.018,z);}
 const surface=new THREE.Mesh(surfaceGeometry,new THREE.MeshBasicMaterial({map:texture,transparent:true,opacity:.66,depthWrite:false,side:THREE.DoubleSide,toneMapped:false}));group.add(surface);
 const aura=new THREE.Mesh(new THREE.PlaneGeometry(5.4,5.4),new THREE.MeshBasicMaterial({map:glow,color:0x9c35ee,transparent:true,opacity:.23,depthWrite:false,blending:THREE.AdditiveBlending}));aura.rotation.x=-Math.PI/2;aura.position.y=-.04;group.add(aura);
 return {intro:group,updateIntro(time,progress,ratio){
  const fade=1-THREE.MathUtils.smoothstep(progress,.08,.62);
  material.uniforms.uTime.value=time;material.uniforms.uRatio.value=ratio;material.uniforms.uOpacity.value=fade;
  material.uniforms.uDissolve.value=THREE.MathUtils.smoothstep(progress,.08,.65);
  surface.material.opacity=.66*(1-THREE.MathUtils.smoothstep(progress,0,.38));aura.material.opacity=.23*fade;
  group.rotation.y=Math.sin(time*.18)*.055;group.rotation.z=Math.sin(time*.25)*.018;group.visible=progress<.65;
 }};
}
