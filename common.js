firebase.initializeApp(FIREBASE_CONFIG);
const db=firebase.database();let off=0;
db.ref('.info/serverTimeOffset').on('value',s=>off=s.val()||0);
const now=()=>Date.now()+off,$=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const rank=p=>Object.entries(p||{}).map(([id,v])=>({id,...v})).sort((a,b)=>(b.s||0)-(a.s||0));
const board=(rk,me,max=10)=>'<div class=c>'+rk.slice(0,max).map((x,i)=>`<div class="r ${x.id==me?'me':''}"><span>${i+1}. ${esc(x.n)}</span><b>${x.s||0}</b></div>`).join('')+'</div>';
// Logolar (hikâye görseli için)
const LG=['logo-ttt.png','logo-festival.png'].map(s=>{const i=new Image();i.src=s;return i});
const logosReady=()=>Promise.all(LG.map(i=>i.decode().catch(()=>0)));
// Hikâye (1080x1920) hatıra görseli: sadece kullanıcının sırası ve puanı
function story(name,rk,sc,total){
 const c=document.createElement('canvas');c.width=1080;c.height=1920;const x=c.getContext('2d');
 const rr=(a,b,w,h,r)=>{x.beginPath();x.roundRect?x.roundRect(a,b,w,h,r):x.rect(a,b,w,h)};
 const g=x.createLinearGradient(0,0,1080,1920);g.addColorStop(0,'#1b0f4d');g.addColorStop(.55,'#6a1b9a');g.addColorStop(1,'#e91e63');
 x.fillStyle=g;x.fillRect(0,0,1080,1920);
 const cl=['#ffc400','#e21b3c','#1368ce','#26890c','#fff'];
 for(let i=0;i<170;i++){const px=Math.random()*1080,py=Math.random()*1920,edge=py<250||py>1750||px<80||px>1000;x.fillStyle=cl[i%5];x.globalAlpha=edge?.9:.22;x.save();x.translate(px,py);x.rotate(Math.random()*6);x.fillRect(0,0,10+Math.random()*16,22);x.restore()}
 const gl=x.createRadialGradient(540,520,10,540,520,420);gl.addColorStop(0,'rgba(255,196,0,.45)');gl.addColorStop(1,'rgba(255,196,0,0)');x.globalAlpha=1;x.fillStyle=gl;x.fillRect(0,100,1080,840);
 x.globalAlpha=1;x.textAlign='center';
 x.fillStyle='#fff';x.font='800 84px sans-serif';x.fillText('Bağımlı Değil',540,290);
 x.fillStyle='#ffc400';x.font='800 108px sans-serif';x.fillText('Başarılıyım',540,400);
 x.font='170px serif';x.fillText(rk==1?'🏆':rk==2?'🥈':rk==3?'🥉':'🎉',540,610);
 x.fillStyle='#fff';x.font='800 80px sans-serif';x.fillText(name.slice(0,22),540,725);
 [['SIRALAMA',rk+'.',total+' yarışmacı içinde',90],['PUAN',String(sc),'toplam puan',550]].forEach(([l,v,s,px])=>{
  x.fillStyle='rgba(255,255,255,.17)';rr(px,790,440,350,40);x.fill();
  x.fillStyle='#ffc400';x.font='700 44px sans-serif';x.fillText(l,px+220,858);
  x.fillStyle='#fff';let fs=190;do{x.font='800 '+fs+'px sans-serif';fs-=6}while(x.measureText(v).width>390);x.fillText(v,px+220,1025);
  x.font='500 38px sans-serif';x.fillText(s,px+220,1095)});
 x.fillStyle='#ffc400';x.font='700 48px sans-serif';x.fillText('Sen de katıl, zirveye oyna! 🚀',540,1235);
 x.fillStyle='#fff';rr(90,1300,900,290,40);x.fill();
 LG.forEach((im,k)=>{if(!im.naturalWidth)return;const bw=380,bh=210,s=Math.min(bw/im.naturalWidth,bh/im.naturalHeight),w=im.naturalWidth*s,h=im.naturalHeight*s,cx=k?770:310;
  x.drawImage(im,cx-w/2,1445-h/2,w,h)});
 x.fillStyle='#ddd';x.fillRect(538,1335,4,220);
 x.save();x.shadowColor='rgba(0,0,0,.4)';x.shadowBlur=12;x.fillStyle='#fff';x.font='800 80px sans-serif';x.fillText('#t3adana',540,1710);x.restore();
 return c}
async function shareImg(c){
 const b=await new Promise(r=>c.toBlob(r,'image/png')),f=new File([b],'t3-adana-siralama.png',{type:'image/png'});
 if(navigator.canShare&&navigator.canShare({files:[f]})){try{await navigator.share({files:[f],title:"T3'Adana Yarışma Dünyası"});return}catch(e){if(e.name=='AbortError')return}}
 const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=f.name;a.click()}
