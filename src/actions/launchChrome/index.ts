import { platform } from 'os';
import { exec } from 'child_process';
import { findFirst } from "utils/filesystem";

function launchChrome(url: string, profile: string) {
    let binary: string | null;
    switch(platform()) {
        case 'win32':
            binary = findFirst([
                '%ProgramFiles%\\Google\\Chrome\\Application\\chrome.exe',
                '%ProgramFiles(x86)%\\Google\\Chrome\\Application\\chrome.exe',
                '%LocalAppData%\\Google\\Chrome\\Application\\chrome.exe',
                'C:\\Program Files (x86)\\Google\\Application\\chrome.exe',
            ]);
            break;
        case 'linux':
            binary = 'chrome';
            break;
        default:
            console.error('Unsupported platform: ' + platform());
            return;
    }
    if(binary === null) {
        console.error('Chrome binary not found');
        return;
    }
    let command = `"${binary}" --profile-directory="${profile}"  --no-sandbox "${url}"`;
    exec(command);
}

export default launchChrome;
