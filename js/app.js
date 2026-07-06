const grid=document.getElementById('worksGrid');
const empty=document.getElementById('emptyState');
// 다음 단계에서 Cloudflare Worker API에서 작품 목록을 불러옵니다.
const artworks=[];
if(artworks.length===0){empty.style.display='flex';}else{empty.style.display='none';}
