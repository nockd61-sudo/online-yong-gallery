const shareBtn = document.getElementById('shareBtn');

shareBtn.addEventListener('click', async () => {
  const shareData = {
    title: 'SEWOONG Online Sculpture Gallery',
    text: '세웅 작가의 온라인 조각 전시장입니다.',
    url: window.location.href
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert('전시 링크가 복사되었습니다. SNS에 붙여넣기 하세요.');
    }
  } catch (error) {
    console.log('공유가 취소되었습니다.', error);
  }
});
