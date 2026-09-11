let imageObjects = [];
let sampleImageUrls = [
  "Project (20260610094150).jpg",
  "Project (20260610102635).jpg",
  "Project (20260610102644).jpg",
  "Project (20260610102732).jpg",
  "Project (20260610102746).jpg",
  "Project (20260610102838).jpg",
  "Project (20260610103239).jpg",
  "Project (20260619121811).jpg",
];

// let input;
// let sampleTexts = [
//   "Exploring seasonal rhythms through visual patterns and natural cycles creates intuitive interfaces.",
//   "Asymmetric layouts emerge organically when elements follow their natural proportions.",
//   "Interactive canvases blend digital art with biological timekeeping systems.",
//   "Random positioning reveals hidden harmonies in visual composition.",
//   "Each image carries its own temporal signature through color and form.",
//   "Mixed media collages bridge technology and organic storytelling.",
//   "Procedural generation finds beauty in controlled chaos.",
//   "Canvas becomes a living archive of visual memories and patterns.",
// ];

// let bg;

function rectOverlapArea(a, b) {
  let dx = min(a.x + a.displayW, b.x + b.displayW) - max(a.x, b.x);
  let dy = min(a.y + a.displayH, b.y + b.displayH) - max(a.y, b.y);
  return dx > 0 && dy > 0 ? dx * dy : 0;
}

function overlapsTooMuch(a, b) {
  let overlap = rectOverlapArea(a, b);
  if (overlap === 0) return false;
  let areaA = a.displayW * a.displayH;
  let areaB = b.displayW * b.displayH;
  let minArea = min(areaA, areaB);
  //overlap number here example 0.5
  return overlap / minArea > 0;
}

function findValidPosition(displayW, displayH) {
  let maxTries = 100;
  for (let attempt = 0; attempt < maxTries; attempt++) {
    let x = random(-displayW * 0.2, width - displayW * 0.3);
    let y = random(-displayH * 0.2, height - displayH * 0.3);

    let pos = { x: x, y: y, displayW: displayW, displayH: displayH };
    let valid = true;

    for (let existing of imageObjects) {
      if (overlapsTooMuch(pos, existing)) {
        valid = false;
        break;
      }
    }

    if (valid) {
      return { x: x, y: y };
    }
  }
  return {
    x: random(-displayW * 0.2, width - displayW * 0.3),
    y: random(-displayH * 0.2, height - displayH * 0.3),
  };
}

let currentIndex = 0;
let targetNumItems = 0;

function setup() {
  var canvasDiv = document.getElementById("sketch-holder");
  var width = canvasDiv.offsetWidth;
  var height = canvasDiv.offsetHeight;
  let canvas = createCanvas(width, height);
  canvas.parent("sketch-holder");

  // input = createInput("9");
  // input.position(10, 10);
  // input.size(60);

  let button = document.getElementById("planButton");
  // button.position(80, 10);
  // button.mousePressed(generateLayout);
    button.addEventListener("click", generateLayout);;


  // let clearBtn = createButton("Clear");
  // clearBtn.position(200, 10);
  // clearBtn.mousePressed(() => background(240));

  // textSize(14);
  // text("Enter number (1-12):", 10, 35);

  // bg = loadImage("Vector 48.png");
}

function draw() {
  background(255); // Fade trails
  push();
  blendMode(MULTIPLY);

  // Draw the image and scale it to fit within the canvas.
  // image(
  //   bg,
  //   0,
  //   windowHeight / 2,
  //   windowWidth,
  //   windowHeight,
  //   0,
  //   0,
  //   bg.width,
  //   bg.height,
  //   CONTAIN,
  // );

  for (let obj of imageObjects) {
    if (obj.img && obj.img.width > 0 && obj.loaded) {
      image(obj.img, obj.x, obj.y, obj.displayW, obj.displayH);
    }
  }
  pop();
}

function generateLayout() {
  // let numItems = constrain(int(input.value()), 1, 12);
  background(240);
  imageObjects = [];
  currentIndex = 0;
  targetNumItems = 9; // Set the target number of items to 9
  loadNextImage();
}

function loadNextImage() {
  if (currentIndex >= targetNumItems) return;

  let i = currentIndex;
  let imgUrl = sampleImageUrls[i % sampleImageUrls.length];
  // let textContent = sampleTexts[i % sampleTexts.length];

  loadImage(imgUrl, (img) => {
    let maxScale = random(0.7, 0.7);
    let naturalRatio = img.width / img.height;
    let displayW = min(width * maxScale, height * maxScale * naturalRatio);
    let displayH = displayW / naturalRatio;

    let pos = findValidPosition(displayW, displayH);

    // let textSize = map(displayW, 80, 300, 12, 20);
    // let textW = random(displayW * 0.8, displayW * 1.8);
    // let textH = textSize * 4;

    // let textX = random(
    //   max(20, pos.x - displayW * 0.5),
    //   min(width - textW - 20, pos.x + displayW * 1.5),
    // );
    // let textY = random(
    //   max(20, pos.y - displayH * 0.3),
    //   min(height - textH - 20, pos.y + displayH * 1.3),
    // );

    imageObjects.push({
      img: img,
      x: pos.x,
      y: pos.y,
      displayW: displayW,
      displayH: displayH,
      // text: textContent,
      // textX: textX,
      // textY: textY,
      // textW: textW,
      // textH: textH,
      // textSize: textSize,
      loaded: true,
    });

    currentIndex++;
    loadNextImage();
  });
}
