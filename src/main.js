const mapSize = 10;
const bombCount = 10;

function createTile(status) {
  const tileElement = document.createElement("div");
  tileElement.classList.add("tile");
  tileElement.dataset.status = "hidden";
  tileElement.addEventListener("click", () => {
    tileElement.dataset.status = status;
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

function createMap() {
  document.getElementById("map").style.setProperty("--size", mapSize);
  let map = [];
  let bombLocations = generateBombLocations();
  // TODO: Generate location of bombs and adjacent bomb counts
  for (let x = 0; x < mapSize; x++) {
    // let row = [];
    for (let y = 0; y < mapSize; y++) {
      createTile("empty");
      // row.push(tileMeta);
    }
    // map.push(row);
  }
  // return map;
}

let data = createMap();
