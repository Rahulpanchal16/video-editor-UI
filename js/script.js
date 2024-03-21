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

  // Show loading overlay
  const loadingOverlay = document.getElementById("loading-overlay");
  loadingOverlay.style.display = "block";

  const startTime = performance.now(); // Record start time

  video.onloadeddata = function () {
    for (let i = 0; i < 100; i++) {
      const time = interval * i;
      setTimeout(() => {
        video.currentTime = time;
      }, 100 * i); // Adjust the delay as needed

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
        }" width="100">`;

        framesContainer.appendChild(frame);

        framesAppended++;

        // Check if all frames are appended
        if (framesAppended === 100) {
          const endTime = performance.now(); // Record end time
          const totalTime = endTime - startTime; // Calculate total time
          console.log(
            "Total time taken:",
            totalTime.toFixed(2),
            "milliseconds"
          );

          // Hide loading overlay
          loadingOverlay.style.display = "none";
        }

        const placeholderImage = document.getElementById("placeholderImg");
        const imgPreview = document.getElementById("img-preview");
        const imgElement = frame.querySelector("img");
        const srcValue = imgElement.src;
        imgElement.addEventListener("click", function (event) {
          placeholderImage.src = srcValue;
          // imgPreview.style.display = "block";
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

        // Variables to track mouse state
        let isDragging = false;
        let startX = 0;
        let initialLeft = 0;

        // Add mousedown event listener to start dragging
        dragLine.addEventListener("mousedown", function (event) {
          isDragging = true;
          startX = event.clientX;
          initialLeft = dragLine.getBoundingClientRect().left;
        });

        // Add mousemove event listener to drag the line
        document.addEventListener("mousemove", function (event) {
          if (isDragging) {
            const offsetX = event.clientX - startX;
            const newLeft = initialLeft + offsetX;
            dragLine.style.left = `${Math.max(0, newLeft)}px`; // Ensure line stays within the container
            redDot.style.left = `${Math.max(0, newLeft)}px`; // Move the dot along with the line
          }
        });

        // Add mouseup event listener to stop dragging
        document.addEventListener("mouseup", function () {
          isDragging = false;
        });

        // Append the drag line to the frames container
        framesContainer.appendChild(dragLine);
      });
    }
  };
};

/*
video.onloadedmetadata = function () {
  const duration = video.duration;
  const interval = duration / 100;

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
        }" width="100" height="">`;
        frame.addEventListener("click", function () {
          showPreview(dataUrl);
        });
        framesContainer.appendChild(frame);
      });
    }
  });
};
*/
