// ===========================
// Custom Win95 Cursor
// ===========================

const cursor = document.getElementById("win95-cursor");

document.addEventListener("mousemove", (e) => {
  cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
});

document.addEventListener("mousedown", () => cursor.classList.add("clicking"));
document.addEventListener("mouseup",   () => cursor.classList.remove("clicking"));

// Hide cursor when it leaves the window
document.addEventListener("mouseleave", () => cursor.style.opacity = "0");
document.addEventListener("mouseenter", () => cursor.style.opacity = "1");

// ===========================
// Clock
// ===========================

function updateClock() {
  const now = new Date();
  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  document.getElementById("clock").textContent = `${hours}:${minutes} ${ampm}`;
}

updateClock();
setInterval(updateClock, 1000);

// ===========================
// Start Menu
// ===========================

function toggleStartMenu() {
  const menu = document.getElementById("startMenu");
  menu.classList.toggle("open");
  event.stopPropagation();
}

function closeStartMenu() {
  document.getElementById("startMenu").classList.remove("open");
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeStartMenu();
});

// ===========================
// Window Management
// ===========================

let highestZ = 100;

function openWindow(id) {
  closeStartMenu();
  const win = document.getElementById(id);
  win.style.display = "block";
  bringToFront(win);
}

function closeWindow(id) {
  document.getElementById(id).style.display = "none";
}

function minimizeWindow(id) {
  document.getElementById(id).style.display = "none";
}

function maximizeWindow(id) {
  const win = document.getElementById(id);
  if (win.dataset.maximized === "true") {
    win.style.top = win.dataset.prevTop;
    win.style.left = win.dataset.prevLeft;
    win.style.width = win.dataset.prevWidth || "";
    win.style.height = win.dataset.prevHeight || "";
    win.dataset.maximized = "false";
  } else {
    win.dataset.prevTop = win.style.top;
    win.dataset.prevLeft = win.style.left;
    win.dataset.prevWidth = win.style.width;
    win.dataset.prevHeight = win.style.height;
    win.style.top = "0";
    win.style.left = "0";
    win.style.width = "100%";
    win.style.height = "calc(100vh - 40px)";
    win.dataset.maximized = "true";
  }
}

function bringToFront(win) {
  highestZ++;
  win.style.zIndex = highestZ;
}

// Bring window to front on click
document.querySelectorAll(".window").forEach((win) => {
  win.addEventListener("mousedown", () => bringToFront(win));
});

// ===========================
// Window Dragging
// ===========================

let dragging = null;
let dragOffsetX = 0;
let dragOffsetY = 0;

function startDrag(e, id) {
  const win = document.getElementById(id);
  if (win.dataset.maximized === "true") return;
  bringToFront(win);
  dragging = win;
  const rect = win.getBoundingClientRect();
  dragOffsetX = e.clientX - rect.left;
  dragOffsetY = e.clientY - rect.top;
  e.preventDefault();
}

document.addEventListener("mousemove", (e) => {
  if (!dragging) return;
  const desktop = document.getElementById("desktop");
  const bounds = desktop.getBoundingClientRect();
  let x = e.clientX - dragOffsetX - bounds.left;
  let y = e.clientY - dragOffsetY - bounds.top;
  x = Math.max(0, Math.min(x, bounds.width - dragging.offsetWidth));
  y = Math.max(0, Math.min(y, bounds.height - dragging.offsetHeight));
  dragging.style.left = x + "px";
  dragging.style.top = y + "px";
});

document.addEventListener("mouseup", () => {
  dragging = null;
});

// ===========================
// External Links
// ===========================

function openLink(url) {
  closeStartMenu();
  window.open(url, "_blank");
}

// ===========================
// Shutdown Dialog
// ===========================

function showShutdown() {
  closeStartMenu();
  document.getElementById("shutdownOverlay").style.display = "flex";
}

function hideShutdown() {
  document.getElementById("shutdownOverlay").style.display = "none";
}
