// Deform from rest coordinates on every frame: no cumulative drift.
export function createFlowerMotion(mesh){
 const positions=mesh.geometry.attributes.position;
 const rest=Float32Array.from(positions.array),polar=[];
 for(let i=0;i<positions.count;i++){
  const x=rest[i*3],z=rest[i*3+2],r=Math.hypot(x,z);
  polar.push({r,a:Math.atan2(z,x),weight:Math.min(1,r/1.8)**1.5});
 }
 // The animated edges remain inside this conservative culling bound.
 mesh.geometry.computeBoundingSphere();mesh.geometry.boundingSphere.radius+=.8;
 let previousTime,previousOpening;
 return function update(time,opening=1){
  if(time===previousTime&&opening===previousOpening)return;
  previousTime=time;previousOpening=opening;
  const unfold=1-Math.pow(1-Math.max(0,Math.min(1,opening)),3);
  for(let i=0;i<positions.count;i++){
   const {r,a,weight}=polar[i],phase=a*5.0-r*1.2;
   const breath=Math.sin(time*.85+phase)*.052+Math.sin(time*1.37-a*3)*.022;
   const spread=1+weight*(breath-.18*(1-unfold));
   const twist=weight*.035*Math.sin(time*.7+r*1.4);
   const angle=a+twist;
   const lift=weight*(.18*Math.sin(time*.85+phase)+.07*Math.sin(time*1.37-a*3)+.55*(1-unfold));
   positions.setXYZ(i,Math.cos(angle)*r*spread,rest[i*3+1]+lift,Math.sin(angle)*r*spread);
  }
  positions.needsUpdate=true;
  mesh.rotation.x=Math.sin(time*.48)*.045;
  mesh.rotation.z=Math.sin(time*.37+.7)*.035;
  mesh.position.y=.08+Math.sin(time*.65)*.045;
 };
}
