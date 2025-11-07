const mapSize = 10;
const bombCount = 10;

// timer variables
let timerInterval = 999;
let timerId = null;
let timerStarted = false;

// flag variables
let flagCount = bombCount;

const config = {
  INITIAL_BOMB_COUNT: "initial-bomb-count",
  TIMER: "timer",
};

function createTile() {
  const tileElement = document.createElement("div");
  tileElement.classList.add("tile");
  tileElement.dataset.status = "hidden";

  tileElement.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    flagTile(tileElement);
  });

  document.getElementById("map").appendChild(tileElement);
  return tileElement;
}

function generateBombLocations() {
  const bombLocation = [];
  while (bombLocation.length < bombCount) {
    const locationX = Math.floor(Math.random() * mapSize);
    const locationY = Math.floor(Math.random() * mapSize);
    const location = {
      x: locationX,
      y: locationY,
    };
    if (bombLocation.some((b) => b.x === locationX && b.y === locationY)) {
      continue;
    }
    bombLocation.push(location);
  }
  return bombLocation;
}

function generateBombCounterMap(bombLocations) {
  //create a 2D array for bomb counters
  const bombCounterMap = Array.from({ length: mapSize }, () =>
    Array(mapSize).fill(0)
  );
  for (let x = 0; x < mapSize; x++) {
    for (let y = 0; y < mapSize; y++) {
      let count = 0;
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          if (dx === 0 && dy === 0) continue;
          const nx = x + dx;
          const ny = y + dy;
          if (
            nx >= 0 &&
            nx < mapSize &&
            ny >= 0 &&
            ny < mapSize &&
            bombLocations.some((b) => b.x === nx && b.y === ny)
          ) {
            count++;
          }
        }
      }
      bombCounterMap[x][y] = count;
    }
  }
  return bombCounterMap;
}

function flagTile(element) {
  timerStart();
  if (element.dataset.status === "hidden") {
    element.dataset.status = "flagged";
    if (element.dataset.isBomb === "true") {
      flagCount--;
    }
  } else if (element.dataset.status === "flagged") {
    element.dataset.status = "hidden";
    if (element.dataset.isBomb === "true") {
      flagCount++;
    }
  }
  // setInitialValues(config.INITIAL_BOMB_COUNT, Math.max(0, flagCount));
  checkWinCondition();
}

function createMap() {
  document.getElementById("map").style.setProperty("--size", mapSize);
  let map = [];
  let bombLocations = generateBombLocations();
  // Generate bomb counter map
  let bombCounterMap = generateBombCounterMap(bombLocations);
  for (let x = 0; x < mapSize; x++) {
    let row = [];
    for (let y = 0; y < mapSize; y++) {
      const isBomb = bombLocations.some((b) => b.x === x && b.y === y);
      const element = createTile();
      const tile = {
        element,
        x,
        y,
        bombCount: bombCounterMap[x][y],
        isBomb,
        get status() {
          return this.element.dataset.status;
        },
        set status(value) {
          this.element.dataset.status = value;
        },
      };
      row.push(tile);
    }
    map.push(row);
  }
  return map;
}

function timeDecrement() {
  timerInterval--;
  document.getElementById("timer").innerText = timerInterval;

  if (timerInterval <= 0) {
    clearInterval(timerId);
    alert("Time's up! Game Over.");
  }
}

function timerReset() {
  clearInterval(timerId);
  timerInterval = 999;
  timerStarted = false;
  document.getElementById("timer").innerText = timerInterval;
}

function timerStart() {
  if (!timerStarted) {
    timerStarted = true;
    timerId = setInterval(timeDecrement, 1000);
  }
}

function timerPause() {
  clearInterval(timerId);
  if (arguments[0] === "win") {
    // do nothing, win alert will be shown by win logic
    return;
  }
  setTimeout(() => {
    alert("[GAME OVER] You ate a bomb than a cookie! [GAME OVER]");
  }, 100);
}

function resetGame() {
  // clear map tiles
  const mapDiv = document.getElementById("map");
  while (mapDiv.firstChild) {
    mapDiv.removeChild(mapDiv.firstChild);
  }
  // reset timer
  if (typeof timerReset === "function") {
    timerReset();
    setInitialValues(config.INITIAL_BOMB_COUNT, bombCount);
  }
  // recreate map
  map = createMap();
  addClickEvent(map);
}

function setInitialValues(id, value) {
  document.getElementById(id).textContent = value;
}

setInitialValues(config.INITIAL_BOMB_COUNT, bombCount);
setInitialValues(config.TIMER, timerInterval);

let map = createMap();
addClickEvent(map);

function getNearbyTiles(map, x, y) {
  const nearbyTiles = [];
  for (xOffset = -1; xOffset <= 1; xOffset++) {
    for (yOffset = -1; yOffset <= 1; yOffset++) {
      let tile = map[x + xOffset]?.[y + yOffset];
      tile && nearbyTiles.push(tile);
    }
  }
  return nearbyTiles;
}

function revealTile(tile, map) {
  const { isBomb, bombCount: tileBombCount, element: tileElement } = tile;
  if (
    tileElement.dataset.status !== "hidden" ||
    tileElement.dataset.status === "empty"
  )
    return;
  if (isBomb) {
    tileElement.dataset.status = "bomb";
    setTimeout(() => {
      alert("[GAME OVER] You ate a bomb than a cookie! [GAME OVER]");
      resetGame();
    }, 1000);
    return;
  }

  const nearbyTiles = getNearbyTiles(map, tile.x, tile.y).filter(
    (tile) => !tile.isBomb
  );
  if (tileBombCount > 0) {
    tileElement.dataset.status = "empty";
    tileElement.textContent = tileBombCount;
  } else {
    if (tileBombCount === 0) {
      tileElement.dataset.status = "empty";
    }
    nearbyTiles.forEach((tile) => {
      revealTile(tile, map);
    });
  }
}

function addClickEvent(map) {
  map.forEach((row) => {
    row.forEach((tile) => {
      const tileElement = tile.element;
      // console.log(t);
      tileElement.addEventListener("click", () => {
        revealTile(tile, map);
        checkWinCondition();
      });
    });
  });
}

document.getElementById("resetBtn").addEventListener("click", resetGame);

document.getElementById("startBtn").addEventListener("click", startGame);

function checkWinCondition() {
  let bombsRemaining = bombCount;
  map.forEach((row) => {
    row.forEach((tile) => {
      tile.element.dataset.status === "flagged" &&
        tile.isBomb &&
        bombsRemaining--;
    });
  });
  console.log("Bombs remaining (unflagged):", bombsRemaining);
  if (bombsRemaining === 0) {
    timerPause("win");
    setTimeout(() => {
      alert("You win!");
    }, 100);
  }
}
