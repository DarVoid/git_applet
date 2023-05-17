import SysTray from 'systray3';
import { pedido } from './graphql-handler';
import launchChrome from 'actions/launchChrome';
import { readConfig } from 'utils/filesystem';
import { Context,loadContexts, ContextList } from './config';

function openGit(context: Context) {
    launchChrome(context.githubHost, context.chromeProfile);
}



let items: any;

function updateContextSelected(key: string, state: boolean) {
    const idx = items.menu.items[4].items.findIndex((item: any) => item.tooltip == key);
    items.menu.items[4].items[idx].checked = state;
    systray.sendAction({
        type: 'update-item',
        item: items.menu.items[4].items[idx],
    });
}

let currentContextKey: string = '';

function applyContext(key: string, contexts: ContextList): void {
    console.log(`Applying context "${contexts[key].title}"`);
    if(currentContextKey !== '') {
        Object.keys(contexts).forEach(key => updateContextSelected(key, false));
    }
    updateContextSelected(key, true);
    currentContextKey = key;
}

const actions = [
    { title: 'Open GitHub', handler: openGit },
];

function generateTray(contexts: ContextList): SysTray {
    items = {
        menu: {
            // you should using .png icon in macOS/Linux, but .ico format in windows
            icon: "./assets/tray.png", // TODO: Load .ico on windows ; Load dark-mode variant according to OS theme (or maybe just a config file?)
            tooltip: "GitHub Applet",
            items: [
                {
                    title: "Context: Work",
                    tooltip: "Context: Work",
                    enabled: false,
                },
                SysTray.separator,
                ...actions.map(action => ({
                    title: action.title,
                    tooltip: action.title,
                    callback: {
                        click: () => action.handler(contexts[currentContextKey]),
                    },
                })),
                SysTray.separator,
                {
                    title: "Change Context",
                    tooltip: "Change Context",
                    items: Object.keys(contexts).map(key => ({
                        title: contexts[key].title,
                        tooltip: key,
                        checked: false,
                        enabled: true,
                        callback: { click: () => applyContext(key, contexts) },
                    })),
                },
                SysTray.separator,
                {
                    title: "Exit",
                    tooltip: "Exit",
                    callback: {
                        click: () => systray.kill(),
                    },
                },
            ],
        },
        debug: false,
        copyDir: true, // copy go tray binary to outside directory, useful for packing tool like pkg.
    };
    return new SysTray(items);
}


// Boot

const config = readConfig('personal.json');
const contexts = loadContexts(config);
let systray: SysTray = generateTray(contexts);
systray.ready().then(() => {
    applyContext(config['default_context'], contexts);
    console.log('Running');
});
