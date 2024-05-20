const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const width = document.getElementById("canvas").width;
const height = document.getElementById("canvas").height;
const counter = document.getElementById("counter");
let mode = document.querySelector("#mode");

const centerX = width / 2;
const centerY = height / 2;
const radius = width / 2;

let zonkCounter = 0;
let priceCounter = 0;

let items = document.getElementsByTagName("textarea")[0].value.split("\n");

const easterEgg = [
  "https://www.youtube.com/watch?v=tZveh3ZLkoI&ab_channel=InstitutTeknologiKalimantan",
  "https://youtu.be/PHgc8Q6qTjc",
  "https://youtu.be/u1f0MWuX55g",
  "https://www.youtube.com/@ChandraEdogawa",
  "https://www.youtube.com/watch?v=UkcJhNwg5lw",
  "https://www.dicoding.com/",
  "https://www.youtube.com/shorts/Qwu5eUWmtKo?feature=share",
  "https://youtu.be/SAzofLc3DMk",
];

let updatedItems = [];
for (let i = 0; i < items.length; i++) {
  updatedItems.push("zonk");
  updatedItems.push(items[i]);
}
items = updatedItems;

let currentDeg = 0;
let step = 360 / items.length;
let colors = [];
let itemDegs = {};

for (let i = 0; i < items.length + 1; i++) {
  colors.push(randomColor());
}

function createWheel() {
  items = document.getElementsByTagName("textarea")[0].value.split("\n");

  updatedItems = [];
  for (let i = 0; i < items.length; i++) {
    updatedItems.push("zonk");
    updatedItems.push(items[i]);
  }
  items = updatedItems;

  console.log(items);

  step = 360 / items.length;
  colors = [];
  for (let i = 0; i < items.length + 1; i++) {
    colors.push(randomColor());
  }
  draw();
}
draw();

function draw() {
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, toRad(0), toRad(360));
  ctx.fillStyle = `rgb(${33},${33},${33})`;
  ctx.lineTo(centerX, centerY);
  ctx.fill();

  let startDeg = currentDeg;
  itemDegs = {};
  for (let i = 0; i < items.length; i++, startDeg += step) {
    let endDeg = startDeg + step;

    color = colors[i];
    let colorStyle = `rgb(${color.r},${color.g},${color.b})`;

    ctx.beginPath();
    rad = toRad(360 / step);
    ctx.arc(centerX, centerY, radius - 2, toRad(startDeg), toRad(endDeg));
    let colorStyle2 = `rgb(${color.r - 30},${color.g - 30},${color.b - 30})`;
    ctx.fillStyle = colorStyle2;
    ctx.lineTo(centerX, centerY);
    ctx.fill();

    ctx.beginPath();
    rad = toRad(360 / step);
    ctx.arc(centerX, centerY, radius - 30, toRad(startDeg), toRad(endDeg));
    ctx.fillStyle = colorStyle;
    ctx.lineTo(centerX, centerY);
    ctx.fill();

    // draw text
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(toRad((startDeg + endDeg) / 2));
    ctx.textAlign = "center";
    if (color.r > 150 || color.g > 150 || color.b > 150) {
      ctx.fillStyle = "#000";
    } else {
      ctx.fillStyle = "#fff";
    }
    ctx.font = "bold 24px serif";
    ctx.fillText(items[i], 130, 10);
    ctx.restore();

    itemDegs[items[i]] = {
      startDeg: startDeg,
      endDeg: endDeg,
    };

    // check winner
    if (
      startDeg % 360 < 360 &&
      startDeg % 360 > 270 &&
      endDeg % 360 > 0 &&
      endDeg % 360 < 90
    ) {
      document.getElementById("winner").innerHTML = items[i];
    }
  }
}

let speed = 0;
let maxRotation = randomRange(360 * 3, 360 * 6);
let pause = false;
function animate() {
  if (pause) {
    const winner = document.getElementById("winner").innerHTML;
    if (winner === "zonk") {
      zonkCounter++;
      counter.innerHTML = zonkCounter;
      Swal.fire({
        title: "🥲🥲🥲🥲",
        text: `Kamu dapat Zonk !`,
        icon: "error",
        confirmButtonText: "Try Again",
      });

      // Easter Egg Konten buat beberapa kondisi
      if (zonkCounter % 5 === 0) {
        // window.open("https://www.youtube.com/watch?v=UkcJhNwg5lw", "_blank");
        window.open(
          "https://www.youtube.com/watch?v=ywthKNqI7uI&ab_channel=MemeBen",
          "_blank"
        );
      }
      // } else if (winner === "Nilai E") {
      //   // window.open("https://www.youtube.com/@ChandraEdogawa", "_blank");
      //   window.open("https://youtu.be/u1f0MWuX55g");
      // } else if (winner === "Gitar") {
      //   window.open(
      //     "https://www.youtube.com/watch?v=tZveh3ZLkoI&ab_channel=InstitutTeknologiKalimantan",
      //     "_blank"
      //   );
      // } else if (winner === "Nilai A") {
      //   window.open("https://youtu.be/PHgc8Q6qTjc");
    } else {
      priceCounter++;
      if (priceCounter % 3 === 0) {
        window.open(
          easterEgg[Math.floor(Math.random() * (easterEgg.length - 1))]
        );
      } else {
        Swal.fire({
          title: "🎉🎉🎉🎉🎉",
          text: `Kamu dapat ${winner} !`,
          icon: "success",
          confirmButtonText: "Claim & Try Again",
        });
      }
    }
    return;
  }
  speed = easeOutSine(getPercent(currentDeg, maxRotation, 0)) * 20;
  if (speed < 0.01) {
    speed = 0;
    pause = true;
  }
  currentDeg += speed;
  draw();
  window.requestAnimationFrame(animate);
}

function spin() {
  if (speed != 0) {
    return;
  }

  let selectedMode = mode.value;

  maxRotation = 0;
  currentDeg = 0;
  createWheel();
  draw();

  let firstItem = items[0];
  let firstItemDegs = itemDegs[firstItem];

  if (selectedMode === "random") {
    //   maxRotation = 360 * 6 - itemDegs["cat"].endDeg + 10;
    if (firstItemDegs) {
      maxRotation =
        Math.floor(Math.random() * 360) * 6 - firstItemDegs.endDeg + 10;
    } else {
      // Fallback in case the first item degrees are not found
      maxRotation = Math.floor(Math.random() * 360) * 6;
    }
    itemDegs = {};
    console.log("max", maxRotation);
    console.log(itemDegs);
    pause = false;
    window.requestAnimationFrame(animate);
  } else if (selectedMode === "zonk") {
    if (firstItemDegs) {
      maxRotation = 360 * 6 - firstItemDegs.endDeg + 10;
    } else {
      // Fallback in case the first item degrees are not found
      maxRotation = 360 * 6;
    }
    itemDegs = {};
    console.log("max", maxRotation);
    console.log(itemDegs);
    pause = false;
    window.requestAnimationFrame(animate);
  }
}
