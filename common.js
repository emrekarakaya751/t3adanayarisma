firebase.initializeApp(FIREBASE_CONFIG);
const db=firebase.database();let off=0;
db.ref('.info/serverTimeOffset').on('value',s=>off=s.val()||0);
const now=()=>Date.now()+off,$=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const rank=p=>Object.entries(p||{}).map(([id,v])=>({id,...v})).sort((a,b)=>(b.s||0)-(a.s||0));
const board=(rk,me,max=10)=>'<div class=c>'+rk.slice(0,max).map((x,i)=>`<div class="r ${x.id==me?'me':''}"><span>${i+1}. ${esc(x.n)}</span><b>${x.s||0}</b></div>`).join('')+'</div>';
// Hikâye (1080x1920) hatıra görseli
function story(name,rk,sc,top,total,me){
 const c=document.createElement('canvas');c.width=1080;c.height=1920;const x=c.getContext('2d');
 const g=x.createLinearGradient(0,0,1080,1920);g.addColorStop(0,'#1b0f4d');g.addColorStop(.55,'#6a1b9a');g.addColorStop(1,'#e91e63');
 x.fillStyle=g;x.fillRect(0,0,1080,1920);
 const cl=['#ffc400','#e21b3c','#1368ce','#26890c','#fff'];
 for(let i=0;i<160;i++){x.fillStyle=cl[i%5];x.globalAlpha=.75;x.save();x.translate(Math.random()*1080,Math.random()*1920);x.rotate(Math.random()*6);x.fillRect(0,0,10+Math.random()*16,22);x.restore()}
 x.globalAlpha=1;x.textAlign='center';
 x.fillStyle='#fff';x.font='800 70px sans-serif';x.fillText("T3'Adana",540,300);
 x.fillStyle='#ffc400';x.font='800 88px sans-serif';x.fillText('Yarışma Dünyası',540,395);
 x.font='190px serif';x.fillText(rk==1?'🏆':rk==2?'🥈':rk==3?'🥉':'🎉',540,640);
 x.fillStyle='#fff';x.font='800 280px sans-serif';x.fillText(rk+'.',540,900);
 x.font='800 76px sans-serif';x.fillText(name.slice(0,22),540,1010);
 x.font='600 52px sans-serif';x.fillText(sc+' puan • '+total+' yarışmacı',540,1085);
 x.fillStyle='rgba(255,255,255,.16)';x.beginPath();x.roundRect?x.roundRect(90,1150,900,520,40):x.rect(90,1150,900,520);x.fill();
 top.slice(0,5).forEach((p,i)=>{const y=1235+i*92;if(p.id==me){x.fillStyle='rgba(255,196,0,.45)';x.fillRect(110,y-62,860,84)}
  x.fillStyle='#fff';x.font='700 50px sans-serif';x.textAlign='left';x.fillText((i+1)+'. '+p.n.slice(0,18),140,y);x.textAlign='right';x.fillText(p.s||0,940,y)});
 x.textAlign='center';x.fillStyle='#ffc400';x.font='700 46px sans-serif';x.fillText('Sen de katıl, zirveye oyna! 🚀',540,1770);
 return c}
async function shareImg(c){
 const b=await new Promise(r=>c.toBlob(r,'image/png')),f=new File([b],'t3-adana-siralama.png',{type:'image/png'});
 if(navigator.canShare&&navigator.canShare({files:[f]})){try{await navigator.share({files:[f],title:"T3'Adana Yarışma Dünyası"});return}catch(e){if(e.name=='AbortError')return}}
 const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=f.name;a.click()}
