const mapSize = 10;

function generateMap() {
    const map = [];
    // TODO: Generate location of boms and adjacent bom counts
    document.getElementById('map').style.setProperty('--size', mapSize);
    for (let x = 0; x < mapSize; x++) {
        const row = [];
        for (let y = 0; y < mapSize; y++) {
            const tileElement = document.createElement('div');
            tileElement.classList.add('tile');
            tileElement.dataset.status = 'hidden';
            tileElement.addEventListener('click', () => {
                tileElement.dataset.status = 'empty'; // TODO: update based on actual position value (bomb or number of adjacent bombs)
            });
            document.getElementById('map').appendChild(tileElement);
        }
        map.push(row);
    }

    return map;
}

generateMap();