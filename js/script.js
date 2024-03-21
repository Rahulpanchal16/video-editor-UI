function redirectToPage() {
  window.location.href = `/html/edit-video.html`;
}
function redirectToHome() {
  window.location.href = `/index.html`;
}

function goto() {
  window.location.href = `/html/edit-video.html`;
}

const uploadBtn = document.getElementById("upload-btn");
const videoInput = document.getElementById("video-input");
const videoContainer = document.getElementById("video-container");
const video = document.getElementById("video");
const slider = document.getElementById("slider");
const videoFrame = document.getElementById("video-frame");
const framesContainer = document.getElementById("frames-container");
const previewContainer = document.getElementById("preview-container");
const videoSource = document.getElementById("video-source");

uploadBtn.addEventListener("click", function () {
  videoInput.click();
});

videoInput.addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (file) {
    const objectURL = URL.createObjectURL(file);
    videoSource.src = objectURL;
    video.load();
    videoContainer.style.display = "block";
  }
});

slider.addEventListener("input", function () {
  const value = parseInt(this.value);
  const max = parseInt(this.max);
  const newTime = (value / max) * video.duration;
  video.currentTime = newTime;
});

video.addEventListener("timeupdate", function () {
  const value = (video.currentTime / video.duration) * 100;
  slider.value = value;
});

video.onloadedmetadata = function () {
  const duration = video.duration;
  const interval = duration / 100;
  let framesAppended = 0;

  const loadingOverlay = document.getElementById("loading-overlay");
  loadingOverlay.style.display = "block";

  const startTime = performance.now();

  video.onloadeddata = function () {
    for (let i = 0; i < 100; i++) {
      const time = interval * i;
      setTimeout(() => {
        video.currentTime = time;
      }, 100 * i);

      video.addEventListener("seeked", function handleSeeked() {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg");
        const frame = document.createElement("div");
        frame.classList.add("frame");
        frame.innerHTML = `<img src="${dataUrl}" alt="Frame ${
          i + 1
        }" width="120">`;

        framesContainer.appendChild(frame);

        framesAppended++;

        if (framesAppended === 100) {
          const endTime = performance.now();
          const totalTime = endTime - startTime;
          console.log(
            "Total time taken:",
            totalTime.toFixed(2),
            "milliseconds"
          );

          loadingOverlay.style.display = "none";
        }

        const placeholderImage = document.getElementById("placeholderImg");
        const imgPreview = document.getElementById("img-preview");
        const imgElement = frame.querySelector("img");
        const srcValue = imgElement.src;
        imgElement.addEventListener("click", function (event) {
          placeholderImage.src = srcValue;
        });

        let dragLine = document.querySelector(".drag-line");
        let redDot = document.querySelector(".red-dot");

        if (!dragLine) {
          dragLine = document.createElement("div");
          dragLine.classList.add("drag-line");
          framesContainer.appendChild(dragLine);
        }

        if (!redDot) {
          redDot = document.createElement("div");
          redDot.classList.add("red-dot");
          framesContainer.appendChild(redDot);
        }

        let isDragging = false;
        let startX = 0;
        let initialLeft = 0;

        dragLine.addEventListener("mousedown", function (event) {
          isDragging = true;
          startX = event.clientX;
          initialLeft = dragLine.getBoundingClientRect().left;
        });

        document.addEventListener("mousemove", function (event) {
          if (isDragging) {
            const offsetX = event.clientX - startX;
            const newLeft = initialLeft + offsetX;
            dragLine.style.left = `${Math.max(0, newLeft)}px`;
            redDot.style.left = `${Math.max(0, newLeft)}px`;
          }
        });

        document.addEventListener("mouseup", function () {
          isDragging = false;
        });

        framesContainer.appendChild(dragLine);
      });
    }
  };
};
