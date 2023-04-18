import { getQuantityOfTileSymmetry } from "./validation";

export function getAssetUrl(tilemapPath, assetName) {
    return process.env.VUE_APP_SERVER_URL + "/" + tilemapPath + assetName + ".png";
}

export function getBlobFromURL(url, fileName) {
    return fetch(url).then(async response => {
        const contentType = response.headers.get('content-type')
        const blob = await response.blob()
        const file = new File([blob], fileName, { contentType })
        return file
    });
}

export async function loadAssets(path, tile, unique) {
    let assets = [];
    if (unique) {
        const quantity = getQuantityOfTileSymmetry(tile.symmetry, unique);
        for (let i = 0; i < quantity; i++) {
            let file = await getBlobFromURL(getAssetUrl(path, tile.name + " " + i), tile.name + " " + i + ".png");
            assets.push([file]);
        }
    } else {
        let file = await getBlobFromURL(getAssetUrl(path, tile.name), tile.name + ".png");
        assets.push([file]);
    }
    return assets;
}