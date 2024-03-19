function redirectToPage() {
  window.location.href = `/html/edit-video.html`;
}
function redirectToHome() {
  window.location.href = `/index.html`;
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
  videoInput.click(); // Trigger file input click event
});

videoInput.addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (file) {
    const objectURL = URL.createObjectURL(file);
    videoSource.src = objectURL;
    video.load();
    videoContainer.style.display = "block"; // Show the video container
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

// Extract frames from the video and add them to the frames container
video.onloadedmetadata = function () {
  const duration = video.duration;
  const interval = duration / 100; // Divide the video into 100 intervals

  // Ensure video is ready
  video.addEventListener("loadeddata", function () {
    for (let i = 0; i < 100; i++) {
      const time = interval * i;
      video.currentTime = time;
      video.addEventListener("seeked", function () {
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
        }" width="100">`;
        frame.addEventListener("click", function () {
          showPreview(dataUrl);
        });
        framesContainer.appendChild(frame);
      });
    }
  });
};

function showPreview(imageUrl) {
  previewContainer.innerHTML = `<img src="${imageUrl}" alt="Preview Image">`;
  previewContainer.style.display = "block";
}
