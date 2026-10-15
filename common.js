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
// Hikâye (1080x1920) hatıra görseli: kırmızı-mavi tema, sadece kullanıcının sırası ve puanı
function story(name,rk,sc,total){
 const c=document.createElement('canvas');c.width=1080;c.height=1920;const x=c.getContext('2d');
 const rr=(a,b,w,h,r)=>{x.beginPath();x.roundRect?x.roundRect(a,b,w,h,r):x.rect(a,b,w,h)};
 const g=x.createLinearGradient(0,0,0,1920);g.addColorStop(0,'#071a52');g.addColorStop(1,'#1d4fd0');
 x.fillStyle=g;x.fillRect(0,0,1080,1920);
 x.fillStyle='#e02e3d';x.beginPath();x.moveTo(1080,0);x.lineTo(1080,210);x.lineTo(0,0);x.fill();
 x.beginPath();x.moveTo(0,1920);x.lineTo(0,1730);x.lineTo(1080,1920);x.fill();
 const cl=['#e02e3d','#ff6b78','#6ea0ff','#fff','#0f3aa8'];
 for(let i=0;i<170;i++){const px=Math.random()*1080,py=Math.random()*1920,edge=py<250||py>1750||px<80||px>1000;x.fillStyle=cl[i%5];x.globalAlpha=edge?.9:.22;x.save();x.translate(px,py);x.rotate(Math.random()*6);x.fillRect(0,0,10+Math.random()*16,22);x.restore()}
 const gl=x.createRadialGradient(540,540,10,540,540,430);gl.addColorStop(0,'rgba(255,255,255,.35)');gl.addColorStop(1,'rgba(255,255,255,0)');x.globalAlpha=1;x.fillStyle=gl;x.fillRect(0,100,1080,840);
 x.textAlign='center';
 x.fillStyle='#fff';x.font='800 84px sans-serif';x.fillText('Bağımlı Değil',540,290);
 x.fillStyle='#ff5c6a';x.font='800 108px sans-serif';x.fillText('Başarılıyım',540,400);
 x.save();x.shadowColor='rgba(255,255,255,.7)';x.shadowBlur=30;x.fillStyle='#fff';x.beginPath();
 for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,r=i%2?42:100;x[i?'lineTo':'moveTo'](540+r*Math.cos(a),565+r*Math.sin(a))}
 x.closePath();x.fill();x.restore();
 x.fillStyle='#fff';x.font='800 80px sans-serif';x.fillText(name.slice(0,22),540,725);
 [['SIRALAMA',rk+'.',total+' yarışmacı içinde',90],['PUAN',String(sc),'toplam puan',550]].forEach(([l,v,s,px])=>{
  x.fillStyle='rgba(255,255,255,.15)';rr(px,790,440,350,40);x.fill();
  x.fillStyle='#ff6b78';x.font='700 44px sans-serif';x.fillText(l,px+220,858);
  x.fillStyle='#fff';let fs=190;do{x.font='800 '+fs+'px sans-serif';fs-=6}while(x.measureText(v).width>390);x.fillText(v,px+220,1025);
  x.font='500 38px sans-serif';x.fillText(s,px+220,1095)});
 x.fillStyle='#fff';x.font='700 48px sans-serif';x.fillText('Sen de katıl, zirveye oyna!',540,1235);
 x.fillStyle='#fff';rr(90,1300,900,290,40);x.fill();
 LG.forEach((im,k)=>{if(!im.naturalWidth)return;const bw=380,bh=210,s=Math.min(bw/im.naturalWidth,bh/im.naturalHeight),w=im.naturalWidth*s,h=im.naturalHeight*s,cx=k?770:310;
  x.drawImage(im,cx-w/2,1445-h/2,w,h)});
 x.fillStyle='#ddd';x.fillRect(538,1335,4,220);
 x.fillStyle='#e02e3d';rr(330,1630,420,100,50);x.fill();
 x.fillStyle='#fff';x.font='800 66px sans-serif';x.fillText('#t3adana',540,1702);
 return c}
const isIOS=/iP(hone|ad|od)/.test(navigator.userAgent)||(navigator.platform=='MacIntel'&&navigator.maxTouchPoints>1);
// Görseli kaydet: iOS'ta dosya indirme çalışmadığı için görsel tam ekran açılır (basılı tut → Fotoğraflara Ekle)
function saveImg(c){
 const u=c.toDataURL('image/png');
 if(isIOS){const o=document.createElement('div');
  o.style.cssText='position:fixed;inset:0;background:rgba(5,15,50,.97);z-index:99;overflow:auto;text-align:center;padding:16px;color:#fff;font-family:system-ui,sans-serif';
  o.innerHTML='<p style="font-weight:700;line-height:1.5">Görsele parmağını basılı tut,<br>"Fotoğraflara Ekle" veya "Görüntüyü Kaydet"i seç</p><img src="'+u+'" style="width:100%;max-width:340px;border-radius:12px;-webkit-touch-callout:default"><br><button style="padding:14px 32px;border:0;border-radius:12px;background:#e02e3d;color:#fff;font-weight:700;font-size:1rem;margin:16px 0">Kapat</button>';
  o.querySelector('button').onclick=()=>o.remove();document.body.appendChild(o);return}
 const a=document.createElement('a');a.href=u;a.download='t3-adana-siralama.png';document.body.appendChild(a);a.click();a.remove()}
async function shareImg(c){
 const b=await new Promise(r=>c.toBlob(r,'image/png')),f=new File([b],'t3-adana-siralama.png',{type:'image/png'});
 if(navigator.canShare&&navigator.canShare({files:[f]})){try{await navigator.share({files:[f],title:"T3'Adana Yarışma Dünyası"});return}catch(e){if(e.name=='AbortError')return}}
 saveImg(c)}
