export function getObjValues(obj) {
    return Object.keys(obj).map(function(key) {
        return obj[key];
    });
}


export function objIsEmpty(obj) {
    return Object.getOwnPropertyNames(obj).length === 0;
}


export async function readFileAsDataURL(files) {
    if (files && files.length > 0) {
        let result_base64 = await new Promise((resolve) => {
            let fileReader = new FileReader();
            fileReader.onload = (e) => resolve(fileReader.result);
            fileReader.readAsDataURL(files[0]);
        });
        return result_base64;
    }
    return null;
}

export function handleHTTPRequestResposte(response) {
    if (!response) throw "Error no servidor";
    if (response.status === 200) {
        return response.data;
    }
    throw response.data;
}