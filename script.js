const TASKS = [
  "Apply for this",
  "Meet this person",
  "Clean up",
  "Do chores",
  "Reply to emails",
  "Buy groceries",
  "Book the appointment",
  "Water the plants",
  "Send that message",
  "Take a proper break",

  "find things I'm passionate about",
  "escape 9-5",
  "be realistic",
  "hope",
  "write more",
  "freelancing dream",
  "meet new people",
  "play more",
  "do your artistic projects",
  "Take a proper break",
];

const THOUGHTS = [
  "I try to optimize it as possible.",
  "I try to optimize it as possible.",

  "I suffer from productivity stress after work hours.",
  "I am trying to control my energy",
  "where I spend it, how I proceed forward",
  "towards the vague direction of living a more creative life.",
];

const INTERACTIONS_TO_CLEAN = 3;
const FIRST_CLICK_THOUGHT_INDEX = 1;
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
);
const noteLayer = document.querySelector("#notes");
const doneLayer = document.querySelector("#done-notes");
const progressText = document.querySelector("#progress-text");
const progressBar = document.querySelector("#progress-bar");
const doneCount = document.querySelector("#done-count");
const liveRegion = document.querySelector("#live-region");
const completion = document.querySelector("#completion");
const resetButton = document.querySelector("#reset-tasks");
const hiddenBoardMessage = document.querySelector(".hidden-board-msg");

const COLORS = ["yellow", "blue", "mint", "pink"];
const POSITIONS = [
  [6, 9],
  [28, 2],
  [52, 12],
  [77, 4],
  [16, 38],
  [42, 31],
  [68, 37],
  [77, 48],
  [5, 67],
  [31, 64],

  [26, 87],
  [58, 35],
  [75, 12],
  [77, 4],
  [16, 98],
  [67, 31],
  [52, 71],
  [54, 97],
  [82, 57],
  [76, 43],
];
let clearedCount = 0;
let notes = [];

function updateThought() {
  if (!hiddenBoardMessage || THOUGHTS.length === 0) return;
  const thoughtIndex = Math.min(
    FIRST_CLICK_THOUGHT_INDEX + clearedCount - 1,
    THOUGHTS.length - 1,
  );
  hiddenBoardMessage.textContent = THOUGHTS[thoughtIndex];
}

function announce(message) {
  liveRegion.textContent = "";
  window.setTimeout(() => {
    liveRegion.textContent = message;
  }, 20);
}

function updateProgress() {
  const total = TASKS.length;
  progressText.textContent = `${clearedCount} of ${total}`;
  doneCount.textContent = clearedCount;
  progressBar.style.transform = `scaleX(${clearedCount / total})`;
  announce(`${clearedCount} of ${total} tasks cleared.`);
  if (clearedCount === total) {
    completion.hidden = false;
    resetButton.focus({ preventScroll: true });
  }
}

function keepInsideBoard(note, x, y) {
  const bounds = noteLayer.getBoundingClientRect();
  const noteWidth = note.offsetWidth;
  const noteHeight = note.offsetHeight;
  const padding = 8;
  return {
    x: Math.max(padding, Math.min(x, bounds.width - noteWidth - padding)),
    y: Math.max(padding, Math.min(y, bounds.height - noteHeight - padding)),
  };
}

function moveAway(note, pointerX, pointerY) {
  if (prefersReducedMotion.matches || note.classList.contains("is-clearing"))
    return;
  const noteRect = note.getBoundingClientRect();
  const centerX = noteRect.left + noteRect.width / 2;
  const centerY = noteRect.top + noteRect.height / 2;
  let directionX = centerX - pointerX;
  let directionY = centerY - pointerY;
  const distance = Math.hypot(directionX, directionY) || 1;
  const amount = Math.min(38, Math.max(16, 210 / distance));
  const currentX = Number(note.dataset.moveX || 0);
  const currentY = Number(note.dataset.moveY || 0);
  const movement = keepInsideBoard(
    note,
    note.offsetLeft + currentX + (directionX / distance) * amount,
    note.offsetTop + currentY + (directionY / distance) * amount,
  );
  const nextX = movement.x - note.offsetLeft;
  const nextY = movement.y - note.offsetTop;
  note.dataset.moveX = nextX.toFixed(1);
  note.dataset.moveY = nextY.toFixed(1);
  note.style.setProperty("--move-x", `${nextX}px`);
  note.style.setProperty("--move-y", `${nextY}px`);
  note.dataset.interactions = Number(note.dataset.interactions || 0) + 1;
  if (Number(note.dataset.interactions) >= INTERACTIONS_TO_CLEAN)
    note.classList.add("is-ready");
}

function clearNote(note) {
  if (note.classList.contains("is-clearing")) return;
  note.classList.add("is-clearing");
  note.setAttribute("aria-disabled", "true");
  window.setTimeout(
    () => {
      const doneNote = document.createElement("span");
      doneNote.className = "done-note";
      doneNote.textContent = note.textContent;
      doneNote.title = note.textContent;
      doneLayer.append(doneNote);
      note.remove();
    },
    prefersReducedMotion.matches ? 0 : 300,
  );
  clearedCount += 1;
  updateThought();
  updateProgress();
}

function makeNote(task, index) {
  const note = document.createElement("button");
  note.className = "note";
  note.type = "button";
  note.textContent = task;
  note.dataset.color = COLORS[index % COLORS.length];
  note.style.left = `${POSITIONS[index][0]}%`;
  note.style.top = `${POSITIONS[index][1]}%`;
  note.setAttribute("aria-label", `${task}. Activate to mark complete.`);
  note.addEventListener(
    "pointermove",
    (event) => moveAway(note, event.clientX, event.clientY),
    { passive: true },
  );
  note.addEventListener("click", () => clearNote(note));
  return note;
}

function render() {
  noteLayer.replaceChildren();
  doneLayer.replaceChildren();
  clearedCount = 0;
  notes = TASKS.map(makeNote);
  noteLayer.append(...notes);
  completion.hidden = true;
  updateProgress();
}

resetButton.addEventListener("click", render);
window.addEventListener("resize", () =>
  notes.forEach((note) => {
    if (note.isConnected) {
      const current = keepInsideBoard(
        note,
        note.offsetLeft + Number(note.dataset.moveX || 0),
        note.offsetTop + Number(note.dataset.moveY || 0),
      );
      note.style.setProperty("--move-x", `${current.x - note.offsetLeft}px`);
      note.style.setProperty("--move-y", `${current.y - note.offsetTop}px`);
    }
  }),
);

render();
