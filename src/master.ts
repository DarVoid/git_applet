import SysTray from 'systray3';
import { pedido } from './graphql-handler';
import launchChrome from 'actions/launchChrome';
import { readConfig } from 'utils/filesystem';

class Context {

    title: string = '';

    chromeProfile: string = '';

    githubHost: string = '';
    githubToken: string = '';

    static fromConfigObject(contextConfig: any): Context {
        const context = new Context();
        context.title = contextConfig.title ?? 'Untitled Context';
        context.chromeProfile = contextConfig.chrome_profile ?? '';
        context.githubHost = contextConfig?.github?.host ?? 'https://github.com/';
        context.githubToken = contextConfig?.github?.token ?? '';
        return context;
    }

}

type ContextList = {[key: string]: Context};

function openGit(context: Context) {
    launchChrome(context.githubHost, context.chromeProfile);
}

function loadContexts(config: any): ContextList {
    console.log('Loading contexts');
    const contextConfig = config.contexts ?? {};
    let contexts: ContextList = {};
    Object.keys(contextConfig).forEach(key => {
        contexts[key] = Context.fromConfigObject(contextConfig[key]);
    })
    return contexts;
}

let items: any;

function updateContextSelected(key: string, state: boolean) {
    const idx = items.menu.items[2].items.findIndex((item: any) => item.tooltip == key);
    items.menu.items[2].items[idx].checked = state;
    systray.sendAction({
        type: 'update-item',
        item: items.menu.items[2].items[idx],
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

function generateTray(contexts: ContextList): SysTray {
    items = {
        menu: {
            // you should using .png icon in macOS/Linux, but .ico format in windows
            icon: "./assets/tray.png", // TODO: Load .ico on windows ; Load dark-mode variant according to OS theme (or maybe just a config file?)
            tooltip: "GitHub Applet",
            items: [
                {
                    title: "Github",
                    tooltip: "Github",
                    items: [
                        {
                            title: "Open in Chrome",
                            tooltip: "Open in Chrome",
                            checked: false,
                            enabled: true,
                            callback: {
                                click: () => openGit(contexts[currentContextKey]),
                            },
                            items: [
                                //
                            ]
                        }
                    ]
                },
                SysTray.separator,
                {
                    title: "Change Context",
                    tooltip: "Change Context",
                    items: Object.keys(contexts).map(key => ({
                        title: contexts[key].title,
                        tooltip: key,
                        checked: false,
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

let PR_abertos_proprio = `
query MyQuery {
  viewer {
    pullRequests(orderBy: {field: CREATED_AT, direction: ASC}, first: 100
        states: OPEN) {
        edges {
            node {
                number
                permalink
                reviewRequests {
                    totalCount
                }
            reviews {
                totalCount
            }
            reviewDecision
            }
        }
  }
  }
}`

let url = 'https://graphql.github.com/graphql/proxy'

function makeGraphQLCall() {
    try {
        let a = pedido(url, PR_abertos_proprio).then((res:any)=>{
                console.log(res);
        })
    } catch (error) {
        console.error("Erro: ",error);
    }

}

// Boot

const config = readConfig('personal.json');
const contexts = loadContexts(config);
let systray: SysTray = generateTray(contexts);
systray.ready().then(() => {
    applyContext(config['default_context'], contexts);
    console.log('Running');
});
