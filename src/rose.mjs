import * as THREE from 'three';

// Each ring contains overlapping cupped petals. Outer petals open outward;
// inner petals wrap upward around a spiral bud. All normals are smooth.
export function roseGeometry(detail = 20) {
  const positions=[], colors=[], indices=[];
  const rings=[
    {n:9,r:1.85,h:.65,base:-.22,open:1.1},
    {n:8,r:1.52,h:.95,base:-.12,open:.95},
    {n:7,r:1.17,h:1.18,base:0,open:.85},
    {n:6,r:.83,h:1.32,base:.04,open:.76},
    {n:5,r:.51,h:1.35,base:.08,open:.8},
    {n:4,r:.26,h:1.35,base:.1,open:.92}
  ];
  for(let layer=0;layer<rings.length;layer++){
    const spec=rings[layer];
    for(let petal=0;petal<spec.n;petal++){
      const start=positions.length/3;
      for(let row=0;row<=detail;row++)for(let col=0;col<=detail;col++){
        const v=row/detail,u=col/detail*2-1;
        const theta=petal/spec.n*Math.PI*2+layer*.53+u*spec.open*.62*(.12+.88*Math.sin(v*Math.PI*.62))+.27*v;
        const radius=spec.r*(.16+.84*Math.pow(v,1.25))*(1-.13*u*u);
        const scallop=.08*Math.cos(u*Math.PI*2+petal*.9)*Math.pow(v,5);
        const height=spec.base+spec.h*Math.sin(v*Math.PI*.64)-(.28+layer*.013)*Math.pow(v,5)-.22*u*u*v+scallop;
        positions.push(Math.cos(theta)*radius,height,Math.sin(theta)*radius);
        const edge=Math.pow(v,12)*.62+Math.pow(Math.abs(u),10)*.15;
        const color=new THREE.Color().setHSL(.775+layer*.004,.69-edge*.24,.31+v*.16+edge*.25);
        colors.push(color.r,color.g,color.b);
      }
      for(let row=0;row<detail;row++)for(let col=0;col<detail;col++){
        const a=start+row*(detail+1)+col,b=a+1,c=a+detail+1,d=c+1;
        indices.push(a,c,b,b,c,d);
      }
    }
  }
  const geo=new THREE.BufferGeometry();
  geo.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));
  geo.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));
  geo.setIndex(indices);geo.computeVertexNormals();geo.computeBoundingSphere();
  return geo;
}

export function roseParticles(geometry,count,random){
  const index=geometry.index.array,p=geometry.attributes.position.array;
  const cumulative=[],triangles=index.length/3;let total=0;
  const a=new THREE.Vector3(),b=new THREE.Vector3(),c=new THREE.Vector3();
  for(let i=0;i<triangles;i++){a.fromArray(p,index[i*3]*3);b.fromArray(p,index[i*3+1]*3);c.fromArray(p,index[i*3+2]*3);total+=b.sub(a).cross(c.sub(a)).length()*.5;cumulative.push(total);}
  const out=new Float32Array(count*3);
  for(let i=0;i<count;i++){
    const target=random()*total;let low=0,high=triangles-1;
    while(low<high){const mid=(low+high)>>1;if(cumulative[mid]<target)low=mid+1;else high=mid;}
    const r=Math.sqrt(random()),s=random(),weights=[1-r,r*(1-s),r*s];
    for(let axis=0;axis<3;axis++)out[i*3+axis]=weights.reduce((v,w,j)=>v+w*p[index[low*3+j]*3+axis],0);
  }
  return new THREE.BufferGeometry().setAttribute('position',new THREE.BufferAttribute(out,3));
}

export function daisyGeometry(){
 const positions=[],colors=[],indices=[];
 function addSphere(x,y,z,sx,sy,sz,angle,color){
  const geometry=new THREE.SphereGeometry(1,10,7);geometry.scale(sx,sy,sz);geometry.rotateY(angle);geometry.translate(x,y,z);
  const offset=positions.length/3;positions.push(...geometry.attributes.position.array);for(let i=0;i<geometry.attributes.position.count;i++)colors.push(color.r,color.g,color.b);for(const index of geometry.index.array)indices.push(offset+index);geometry.dispose();
 }
 for(let i=0;i<16;i++){const a=i/16*Math.PI*2;addSphere(Math.cos(a)*.62,.02,Math.sin(a)*.62,.54,.075,.14,-a,new THREE.Color(i%2?0xe6ccff:0xb577f1));}
 addSphere(0,.13,0,.29,.15,.29,0,new THREE.Color(0xf4bd30));
 const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geometry.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));geometry.setIndex(indices);geometry.computeVertexNormals();return geometry;
}
