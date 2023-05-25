import SysTray, { MenuItem } from 'systray3';
import { readConfig } from 'utils/filesystem';
import { Context, loadContexts, ContextList, CONFIG_FILE } from './config';
import openGitHub from 'actions/openGitHub';
import { Action, ActionArgs } from 'contracts/Action';
import { exec } from 'child_process';
import fetchPRs from 'actions/fetchPRs';
import {
    Subscription,
    interval
} from 'rxjs';
let items: any;

function updateContextSelected(key: string, state: boolean) {
    const idx = items.menu.items[3 + actions.length].items.findIndex((item: any) => item.tooltip == key);
    items.menu.items[3 + actions.length].items[idx].checked = state;
    systray.sendAction({
        type: 'update-item',
        item: items.menu.items[3 + actions.length].items[idx],
    });
}

function updateStatus(status: string) {
    items.menu.items[0].title = status;
    items.menu.items[0].tooltip = status;
    systray.sendAction({
        type: 'update-item',
        item: items.menu.items[0],
    });
}

let connected = true; // TODO: Detect if polling
let currentContextKey: string = '';


function teaseStatus() {
    updateStatus(` [${contexts[currentContextKey].title}] ${connected ? 'Connected 🌐' : 'Disconnected 🔌'} `);
}

function applyGitConfig(userName: string, userEmail: string, userUsername: string, gitHost: string) {
    exec(`git config --global user.name "${userName}"`);
    exec(`git config --global user.email "${userEmail}"`);
    exec(`git config --global credential.helper store`);
    exec(`git config --global credential.https://${gitHost}.username ${userUsername}`);
}

function applyContext(key: string, contexts: ContextList): void {
    const context: Context = contexts[key];
    console.log(`Applying context "${context.title}"`);
    if(currentContextKey !== '') {
        Object.keys(contexts).forEach(key => updateContextSelected(key, false));
    }
    currentContextKey = key;
    updateContextSelected(key, true);
    teaseStatus();
    applyGitConfig(context.gitUserName, context.gitUserEmail, context.githubUsername, context.githubHost);
}

const actions = [
    { title: 'Open GitHub', handler: openGitHub as Action, args: {} },
    // { title: 'Open YouTube', handler: openUrl as Action, args: { url: 'https://www.youtube.com' } },
    { title: 'Fetch PR', handler: fetchPRs as Action, args: {} },
];

function generateTray(contexts: ContextList): SysTray {
    items = {
        menu: {
            // you should using .png icon in macOS/Linux, but .ico format in windows
            icon: "./assets/tray.png", // TODO: Load .ico on windows ; Load dark-mode variant according to OS theme (or maybe just a config file?)
            tooltip: "GitHub Applet",
            items: [
                {
                    title: "🕒 Loading...",
                    tooltip: "🕒 Loading...",
                    enabled: false,
                },
                SysTray.separator,
                ...actions.map(action => ({
                    title: action.title,
                    tooltip: action.title,
                    callback: {
                        click: () => action.handler(contexts[currentContextKey], action.args ?? {}),
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
                    title: "Open PRs:",
                    tooltip: "AQUI",
                    checked: false,
                    enabled: true,
                    items:[
                        ...[...Array(config.item_count).keys()].map(()=>({
                            title:"---",
                            tooltip:"",
                            hidden:true
                        }))
                    ]
                    
                },
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

const subs:Subscription[]=[];
// Boot
const config = readConfig(CONFIG_FILE);
const contexts: ContextList = loadContexts(config);

let systray: SysTray = generateTray(contexts);


 

systray.ready().then(() => {

    applyContext(config['default_context'], contexts);
    console.log('Running');
    //TODO: meter aqui polling quando fetch prs nao for uma action (é por isto que acho que deviamos ter so funcoes normais e se quisessemos depois registavamo-las oh and I HATE PROMISES XD
    const idx = items.menu.items.findIndex((item: any) => item.tooltip == "AQUI");
    Object.keys(contexts).forEach((ctx)=>{     
        const context = contexts[ctx]
        console.log(idx)
        let func = ()=> fetchPRs(context,{ 
            callthis: 
            (menuNovo: MenuItem[])=>{
            console.log("chegou aqui")
            // items.menu.items[8].items = menuNovo
            
            let example = {... items.menu.items[idx].items[0] }
            console.log(example)
            
            console.log(menuNovo)
            menuNovo.forEach((cada:any, idd:number)=>{
                // items.menu.items[idx].push(cada)
                Object.keys(cada).forEach(
                    (key:string)=>{
                        items.menu.items[idx].items[idd][key] = cada[key]
        
                    }
        
                )
                systray.sendAction({
                    type: 'update-item',
                    item: items.menu.items[idx].items[idd],
                })
            })
            
        }
        }
        )
        if(context.pollEnabled){
            //first time 
            func()
            subs.push(interval(context.pollFrequency).subscribe(()=>{
                console.log(context.title)
                    //each poll
                    func()
                    
                    console.log(items.menu.items[idx] )
                    
                })); 
        }
        
    })
});
