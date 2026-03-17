document.addEventListener("DOMContentLoaded", () => {
  const video = document.getElementById("video");
  const timeEl = document.getElementById("time");
  const frameEl = document.getElementById("frame");
  const prevBtn = document.getElementById("prev_frame");
  const nextBtn = document.getElementById("next_frame");
  const playBtn = document.getElementById("play_pause");
  const log = document.getElementById("log");
  const viewBtn = document.getElementById("view_events");
  const mergeBtn = document.getElementById("merge_btn");
  const fps = typeof FPS !== "undefined" ? parseFloat(FPS) : 25.0;
  const step = 1.0 / fps;

  function updateInfo() {
    const t = video.currentTime || 0;
    if (timeEl) timeEl.textContent = t.toFixed(2);
    if (frameEl) frameEl.textContent = Math.round(t * fps);
  }
  video.addEventListener("timeupdate", updateInfo);
  video.addEventListener("loadedmetadata", updateInfo);

  prevBtn?.addEventListener("click", () => {
    video.pause();
    video.currentTime = Math.max(0, video.currentTime - step);
  });
  nextBtn?.addEventListener("click", () => {
    video.pause();
    video.currentTime = Math.min(video.duration || 0, video.currentTime + step);
  });
  playBtn?.addEventListener("click", () => {
    if (video.paused) video.play(); else video.pause();
  });

  // save event
  async function saveEvent(category, label, value) {
    const t = video.currentTime || 0;
    const frame = Math.round(t * fps);
    const payload = {
      video_id: VIDEO_ID,
      timestamp: t,
      frame: frame,
      category: category,
      label: label,
      value: value,
      extra: {}
    };
    try {
      const res = await fetch("/save_event", {
        method: "POST", headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload)
      });
      const j = await res.json();
      if (j.ok) logMessage(`Saved: ${category}/${label}=${value} @ ${t.toFixed(2)}s`);
      else logMessage("Error saving");
    } catch (e) {
      logMessage("Network error");
    }
  }
  document.querySelectorAll(".annot-btn").forEach(b => {
    b.addEventListener("click", () => {
      saveEvent(b.dataset.cat, b.dataset.label, b.dataset.value);
    });
  });

  // hotkeys: Space = play/pause ; ArrowLeft/Right step; 1..5 emotion
  document.addEventListener("keydown", (e) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
    if (e.code === "Space") { e.preventDefault(); if (video.paused) video.play(); else video.pause(); }
    if (e.code === "ArrowLeft") { video.pause(); video.currentTime = Math.max(0, video.currentTime - step); }
    if (e.code === "ArrowRight") { video.pause(); video.currentTime = Math.min(video.duration || 0, video.currentTime + step); }
    if (e.key >= '1' && e.key <= '5') {
      const mapping = {'1':'happy','2':'sad','3':'neutral','4':'laugh','5':'cry'};
      saveEvent('emotion','emotion',mapping[e.key]);
    }
  });

  function logMessage(txt) {
    if (!log) return;
    const now = new Date().toLocaleTimeString();
    log.textContent = `[${now}] ${txt}\n` + log.textContent;
  }

  viewBtn?.addEventListener("click", async () => {
    try {
      const r = await fetch(`/get_events/${VIDEO_ID}`);
      const j = await r.json();
      log.textContent = JSON.stringify(j, null, 2);
    } catch (e) {
      logMessage("Error fetching events");
    }
  });

  mergeBtn?.addEventListener("click", async () => {
    if (!confirm("Merge annotations (consensus)?")) return;
    try {
      const r = await fetch(`/merge_annotations/${VIDEO_ID}`, {
        method: "POST", headers: {'Content-Type':'application/json'}, body: JSON.stringify({window:1.0})
      });
      if (r.ok) {
        const blob = await r.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${VIDEO_ID}_merged.json`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        logMessage("Merge failed");
      }
    } catch (e) {
      logMessage("Merge network error");
    }
  });

});
