export function getJsonPath(str, path) {
    const decoded = JSON.parse(str);
    let jsonPath = path.split('.');
    let result = decoded;

    while (jsonPath.length > 0) {
        result = result?.[jsonPath.shift()];
    }

    return result;
}
