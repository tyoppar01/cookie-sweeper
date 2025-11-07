const mapSize = 10;

function createTile(status){
    const tileElement = document.createElement('div');
    tileElement.classList.add('tile');
    tileElement.dataset.status = 'hidden';
    tileElement.addEventListener('click', () => {
        tileElement.dataset.status = status;
    });
    document.getElementById('map').appendChild(tileElement);
}

function createMap() {
    document.getElementById('map').style.setProperty('--size', mapSize);
    let map = [];
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