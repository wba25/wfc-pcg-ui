import { getQuantityOfTileSymmetry } from "./validation";

export function getAssetUrl(tile, index=0) {
    return tile.assets[index];
}

export function getBlobFromURL(url, fileName) {
    return fetch(url).then(async response => {
        const contentType = response.headers.get('content-type')
        const blob = await response.blob()
        const file = new File([blob], fileName, { contentType })
        return file
    });
}

export async function loadAssets(tile, unique) {
    let assets = [];
    if (unique) {
        const quantity = getQuantityOfTileSymmetry(tile.symmetry, unique);
        for (let i = 0; i < quantity; i++) {
            let file = await getBlobFromURL(getAssetUrl(tile, i), tile.name + " " + i + ".png");
            assets.push([file]);
        }
    } else {
        let file = await getBlobFromURL(getAssetUrl(tile), tile.name + ".png");
        assets.push([file]);
    }
    return assets;
}

export function neighborIsValid(neighbor, tiles) {    
    const parts = neighbor.split(" ");
    const [tileName, tileIndex] = [parts[0], parts.length > 1 ? parseInt(parts[1]) : 0];
    let tile = tiles.filter(t => t.name === tileName);
    if (tile.length === 0) return false;
    tile = tile[0];
    if ((tileIndex + 1) > getQuantityOfTileSymmetry(tile.symmetry, true)) return false;
    return true;
}

export function neighborPairIsValid(neighbor, tiles) {
    const leftNeighbor = neighbor["left"];
    const rightNeighbor = neighbor["right"];
    return neighborIsValid(leftNeighbor, tiles) && neighborIsValid(rightNeighbor, tiles);
}