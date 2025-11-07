const mapSize = 10;
const bombCount = 10;

function createTile(status, bombCount) {
  const tileElement = document.createElement("div");
  tileElement.classList.add("tile");
  tileElement.dataset.status = "hidden";
  // bombCount hereeeee
  tileElement.addEventListener("click", () => {
    if (tileElement.dataset.status !== "hidden") return;
    tileElement.dataset.status = status;
    if (status === "empty" && bombCount > 0) {
      tileElement.textContent = bombCount;
    } else {
      tileElement.textContent = "";
    }
  });
  tileElement.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    flagTile(tileElement);
  });
  document.getElementById("map").appendChild(tileElement);
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
  if (element.dataset.status === "hidden") {
    element.dataset.status = "flagged";
  } else if (element.dataset.status === "flagged") {
    element.dataset.status = "hidden";
  }
}

function createMap() {
  document.getElementById("map").style.setProperty("--size", mapSize);
  let map = [];
  let bombLocations = generateBombLocations();
  console.log(bombLocations);
  // Generate bomb counter map
  let bombCounterMap = generateBombCounterMap(bombLocations);
  for (let x = 0; x < mapSize; x++) {
    for (let y = 0; y < mapSize; y++) {
      const isBomb = bombLocations.some((b) => b.x === x && b.y === y);
      createTile(isBomb ? "bomb" : "empty", bombCounterMap[x][y]);
    }
  }
  // return map;
}

let data = createMap();
