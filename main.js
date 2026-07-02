const images = [
  {
    src: "images/energy-apple-front.jpg",
    alt: "Energy Apple 정면"
  },
  {
    src: "images/energy-apple-left.jpg",
    alt: "Energy Apple 좌측면"
  },
  {
    src: "images/energy-apple-right.jpg",
    alt: "Energy Apple 우측면"
  },
  {
    src: "images/energy-apple-back.jpg",
    alt: "Energy Apple 후면"
  },
  {
    src: "images/energy-apple-detail.jpg",
    alt: "Energy Apple 상세"
  }
];

let current = 0;
let autoTimer = null;

const artImage = document.getElementById("artImage");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const autoBtn = document.getElementById("autoBtn");
const thumbs = Array.from(document.querySelectorAll(".thumb"));

function showImage(index) {
  current = (index + images.length) % images.length;

  artImage.classList.add("fade");

  setTimeout(() => {
    artImage.src = images[current].src;
    artImage.alt = images[current].alt;
    thumbs.forEach((btn, i) => btn.classList.toggle("active", i === current));
    artImage.classList.remove("fade");
  }, 120);
}

prevBtn.addEventListener("click", () => showImage(current - 1));
nextBtn.addEventListener("click", () => showImage(current + 1));

thumbs.forEach((btn) => {
  btn.addEventListener("click", () => {
    stopAuto();
    showImage(Number(btn.dataset.index));
  });
});

function startAuto() {
  autoBtn.textContent = "회전 멈추기";
  autoTimer = setInterval(() => {
    showImage(current + 1);
  }, 1400);
}

function stopAuto() {
  autoBtn.textContent = "천천히 회전 보기";
  clearInterval(autoTimer);
  autoTimer = null;
}

autoBtn.addEventListener("click", () => {
  if (autoTimer) {
    stopAuto();
  } else {
    startAuto();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") showImage(current - 1);
  if (event.key === "ArrowRight") showImage(current + 1);
});

// 모바일 손가락 좌우 넘김
let touchStartX = 0;

artImage.addEventListener("touchstart", (event) => {
  touchStartX = event.changedTouches[0].screenX;
});

artImage.addEventListener("touchend", (event) => {
  const diff = event.changedTouches[0].screenX - touchStartX;
  if (Math.abs(diff) > 45) {
    stopAuto();
    showImage(diff > 0 ? current - 1 : current + 1);
  }
});
