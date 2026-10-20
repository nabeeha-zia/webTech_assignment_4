var slides = [];
var current = 0;
var presenting = false;

var text = document.getElementById("text");
var firstText =
  "# Slide 1\n## Heading 2\n\nThis is my first slide\n\n---\n\n" +
  "# Slide 2\n## Heading 2\n\nThis is my second slide";

// ---------- slides ----------

// split the markdown into slides using ---
function makeSlides() {
  var parts = text.value.split(/\n---\s*\n|^---\s*\n/);
  slides = [];
  for (var i = 0; i < parts.length; i++) {
    if (parts[i].trim() != "") slides.push(parts[i]);
  }
  if (slides.length == 0) slides = [""];
  if (current >= slides.length) current = slides.length - 1;
}

// show the current slide, the count and the button states
function showSlide() {
  document.getElementById("slide").innerHTML = marked.parse(slides[current]);
  document.getElementById("count").innerText = (current + 1) + "/" + slides.length;
  document.getElementById("leftBtn").disabled = (current == 0);
  document.getElementById("rightBtn").disabled = (current == slides.length - 1);
}

function update() {
  makeSlides();
  showSlide();
}

function goLeft() {
  if (current > 0) {
    current = current - 1;
    showSlide();
  }
}

function goRight() {
  if (current < slides.length - 1) {
    current = current + 1;
    showSlide();
  }
}

// create a new slide
function newSlide() {
  text.value = text.value + "\n\n---\n\n# New Slide\n\nWrite here";
  makeSlides();
  current = slides.length - 1;
  showSlide();
}

// ---------- save and load ----------

function save() {
  localStorage.setItem("slides", text.value);
  document.getElementById("msg").innerText = "Saved!";
  setTimeout(function () {
    document.getElementById("msg").innerText = "";
  }, 1500);
}

function load() {
  var saved = localStorage.getItem("slides");
  if (saved != null) {
    text.value = saved;
  } else {
    text.value = firstText;
  }
}

// ---------- presentation (full screen) ----------

function fullScreen() {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    text.blur();
    document.getElementById("viewBox").requestFullscreen();
  }
}

// runs on button, F11 and also when the user presses Esc
document.addEventListener("fullscreenchange", function () {
  presenting = (document.fullscreenElement != null);
  if (presenting) {
    document.getElementById("fullBtn").innerText = "Exit Full Screen";
  } else {
    document.getElementById("fullBtn").innerText = "Full Screen";
  }
});

// ---------- keyboard ----------

document.addEventListener("keydown", function (e) {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() == "s") {
    e.preventDefault();
    save();
  } else if (e.key == "F11") {
    e.preventDefault();
    fullScreen();
  } else if (e.key == "ArrowRight" && (presenting || e.target != text)) {
    goRight();
  } else if (e.key == "ArrowLeft" && (presenting || e.target != text)) {
    goLeft();
  }
});

// ---------- start ----------

load();
update();