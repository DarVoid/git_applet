import fs from 'fs';

function toAbsolutePath(path: string): string {
    // Substitute %VAR% with its value from ENV
    // (used for path resolution in Windows: %AppData% => C:/Users/User/AppData/, etc.)
    return path.replace(/%([^%]+)%/g, (_, key) => process.env[key.toUpperCase()] ?? `%${key}%`);
}

// Return the first path of an array that actually exists in the filesystem
function findFirst(paths: string[]): string | null {
    let path = paths.find(path => fs.existsSync(toAbsolutePath(path)));
    if(path === null) {
        return null;
    }
    return toAbsolutePath(path ?? '');
}

function readConfig(path: string): any {
    return JSON.parse(fs.readFileSync(path).toString());
}

export {
    toAbsolutePath,
    findFirst,
    readConfig,
};
