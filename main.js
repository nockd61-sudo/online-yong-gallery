const shareBtn = document.getElementById('shareBtn');
if (shareBtn) {
  shareBtn.addEventListener('click', async () => {
    const shareData = {
      title: 'SEWOONG Online Sculpture Gallery',
      text: '세웅 온라인 조각 전시장 오늘의 작품을 감상해 보세요.',
      url: window.location.href
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('주소가 복사되었습니다. SNS에 붙여넣어 공유하세요.');
      }
    } catch (e) {
      console.log('공유 취소 또는 오류', e);
    }
  });
}
