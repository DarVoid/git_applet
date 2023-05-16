import SysTray from 'systray3';
import { pedido } from './graphql-handler';
import launchChrome from 'actions/launchChrome';
import { readConfig } from 'utils/filesystem';

function openGitPersonal(){
    launchChrome('https://www.github.com', 'Profile1');
}

function openGitWork(){
    launchChrome('https://google.com', 'Profile2');
}

class Context {

    title: string;

    constructor(title: string) {
        this.title = title;
    }

}

type ContextList = {[key: string]: Context};

function loadContexts(config: any): ContextList {
    console.log('Loading contexts');
    const contextConfig = config.contexts ?? {};
    let contexts: ContextList = {};
    Object.keys(contextConfig).forEach(key => {
        const context = contextConfig[key];
        contexts[key] = new Context(context.title);
    })
    return contexts;
}

function applyContext(key: string, contexts: ContextList): void {
    console.log(`Applying context "${contexts[key].title}"`);
}

function generateTray(contexts: ContextList): SysTray {
    return new SysTray({
        menu: {
            // you should using .png icon in macOS/Linux, but .ico format in windows
            icon: "./assets/tray.png", // TODO: Load .ico on windows ; Load dark-mode variant according to OS theme (or maybe just a config file?)
            title: '',
            tooltip: "GitHub Applet",
            items: [
                {
                    title: "Github ",
                    tooltip: "Github",
                    // checked is implement by plain text in linux
                    checked: false,
                    enabled: true,
                    items: [
                        {
                            title: "Personal",
                            tooltip: "Personal",
                            checked: false,
                            enabled: true,
                            callback: {
                                click: openGitPersonal,
                            },
                            items: [
                                //
                            ]
                        },{
                            title: "Work",
                            tooltip: "Work",
                            checked: false,
                            enabled: true,
                            callback: {
                                click: openGitWork,
                            },
                            items: [
                                //
                            ]
                        },
                    ]
                },
                SysTray.separator,
                {
                    title: "Exit",
                    tooltip: "Exit",
                    checked: false,
                    enabled: true,
                    callback: {
                        click: () => systray.kill(),
                    },
                },
            ],
        },
        debug: false,
        copyDir: true, // copy go tray binary to outside directory, useful for packing tool like pkg.
    });
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

function makeGraphQLCall(){
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
const systray: SysTray = generateTray(contexts);
applyContext(config['default_context'], contexts);

console.log('Running');
