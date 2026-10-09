import * as THREE from 'three';

export function galaxyParticles(random){
 const group=new THREE.Group(),materials=[];
 function layer(count,kind){
  const p=[],colors=[],sizes=[],seeds=[];
  for(let i=0;i<count;i++){
   let r,a,y;
   if(kind===2){r=2+random()*15;a=random()*Math.PI*2;y=1.4-Math.pow(random(),.65)*8;}
   else{r=kind===3?1.6+random()*1.8:kind===1?1.3+random()*7.3:.8+Math.pow(random(),.65)*6.2;a=Math.floor(random()*4)*Math.PI*.5+r*.92+(random()-.5)*(kind===1||kind===3?1.8:.65);y=(random()-.5)*(kind===1?2.4:kind===3?.8:.3+r*.05);}
   p.push(Math.cos(a)*r,y,Math.sin(a)*r);
   const bright=random(),c=new THREE.Color();
   c.setHSL(.73+random()*.13,kind===0||kind===3?.35:.65,kind===0||kind===3?.55+bright*.35:.24+bright*.3);colors.push(c.r,c.g,c.b);
   sizes.push(kind===2?5+random()*32:kind===1?2+Math.pow(random(),3)*9:kind===3?1.1+Math.pow(random(),2)*3.4:.8+Math.pow(random(),3)*3.4);seeds.push(random()*6.283);
  }
  const geometry=new THREE.BufferGeometry().setAttribute('position',new THREE.Float32BufferAttribute(p,3)).setAttribute('color',new THREE.Float32BufferAttribute(colors,3)).setAttribute('aSize',new THREE.Float32BufferAttribute(sizes,1)).setAttribute('aSeed',new THREE.Float32BufferAttribute(seeds,1));
  const material=new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,uniforms:{uTime:{value:0},uRatio:{value:1},uOpacity:{value:kind===2?.42:kind===1?.7:.9},uKind:{value:kind===3?0:kind}},vertexShader:`
   attribute vec3 color;attribute float aSize;attribute float aSeed;uniform float uTime;uniform float uRatio;varying vec3 vColor;varying float vSeed;
   void main(){vec4 mv=modelViewMatrix*vec4(position,1.);gl_Position=projectionMatrix*mv;gl_PointSize=clamp(aSize*uRatio*22./max(4.,-mv.z),.8,64.);vColor=color;vSeed=aSeed;}
  `,fragmentShader:`
   uniform float uTime;uniform float uOpacity;uniform float uKind;varying vec3 vColor;varying float vSeed;
   void main(){vec2 uv=gl_PointCoord-.5;float d=length(uv)*2.;if(d>1.)discard;
    float core=exp(-d*d*19.);float halo=exp(-d*d*5.)*.2;
    float twinkle=.72+.28*sin(uTime*.8+vSeed);
    if(uKind>1.5){core=exp(-d*d*4.)*.35;halo=0.;}
    float cross=0.;if(uKind>.5&&uKind<1.5){cross=(pow(max(0.,1.-abs(uv.x)*35.),3.)+pow(max(0.,1.-abs(uv.y)*35.),3.))*pow(1.-d,2.)*.45;}
    float alpha=(core+halo+cross)*uOpacity*twinkle*(1.-smoothstep(.75,1.,d));gl_FragColor=vec4(vColor*(1.+core*.5),alpha);
   }
  `});materials.push(material);const points=new THREE.Points(geometry,material);group.add(points);return points;
 }
 const dust=layer(10000,0),sparks=layer(420,1);layer(1800,2);layer(4200,3);
 return {group,dust,sparks,update(time,ratio){for(const m of materials){m.uniforms.uTime.value=time;m.uniforms.uRatio.value=ratio;}}};
}
