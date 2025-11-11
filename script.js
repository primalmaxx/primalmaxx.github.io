const trailers = [
  {
    url: "https://www.youtube.com/watch?v=2igK9E2vA5E",
    label: "Teaser 1"
  },
  {
    url: "https://www.youtube.com/watch?v=YFmBGY__qN0",
    label: "Teaser 2"
  },
  {
    url: "https://www.youtube.com/watch?v=EIOb5NI74fo",
    label: "Teaser 3"
  },
  {
    url: "https://www.youtube.com/watch?v=NQGbiXYMN5g",
    label: "Official Trailer 1"
  }
];

let currentTrailerIndex = 0;
const placeholder = document.getElementById("trailerPlaceholder");
const prevBtn = document.getElementById("prevTrailer");
const nextBtn = document.getElementById("nextTrailer");

// Extract a video ID from any common YouTube URL format
function getYouTubeId(input) {
  if (!input) return null;

  // If they accidentally just put the raw ID, accept it
  if (/^[a-zA-Z0-9_-]{8,20}$/.test(input)) {
    return input;
  }

  try {
    const url = new URL(input);

    // Standard watch URL: https://www.youtube.com/watch?v=VIDEO_ID
    if (url.hostname.includes("youtube.com")) {
      if (url.searchParams.get("v")) {
        return url.searchParams.get("v");
      }

      // Shorts: https://www.youtube.com/shorts/VIDEO_ID
      const shortsMatch = url.pathname.match(/\/shorts\/([a-zA-Z0-9_-]{8,20})/);
      if (shortsMatch) return shortsMatch[1];

      // Embed URLs: https://www.youtube.com/embed/VIDEO_ID
      const embedMatch = url.pathname.match(/\/embed\/([a-zA-Z0-9_-]{8,20})/);
      if (embedMatch) return embedMatch[1];
    }

    // youtu.be short links: https://youtu.be/VIDEO_ID
    if (url.hostname === "youtu.be") {
      const pathMatch = url.pathname.match(/\/([a-zA-Z0-9_-]{8,20})/);
      if (pathMatch) return pathMatch[1];
    }
  } catch (e) {
    // If it's not a valid URL, fall through
  }

  return null;
}

function renderTrailer(index) {
  const trailer = trailers[index];
  const videoId = getYouTubeId(trailer.url);

  if (!videoId) {
    placeholder.innerHTML = `
      <p class="trailer-loading">
        Could not load video.<br />
        Check the URL for “${trailer.label}”.
      </p>
    `;
    return;
  }

  const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&controls=1`;

  placeholder.innerHTML = `
    <iframe
      src="${embedUrl}"
      title="${trailer.label}"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    ></iframe>
  `;
}

function showNext() {
  currentTrailerIndex = (currentTrailerIndex + 1) % trailers.length;
  renderTrailer(currentTrailerIndex);
}

function showPrev() {
  currentTrailerIndex =
    (currentTrailerIndex - 1 + trailers.length) % trailers.length;
  renderTrailer(currentTrailerIndex);
}

prevBtn.addEventListener("click", showPrev);
nextBtn.addEventListener("click", showNext);

// Initial render
renderTrailer(currentTrailerIndex);
