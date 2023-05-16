import SysTray from 'systray3';
import { pedido } from './graphql-handler';
// const { platform } = require('os');
const { exec } = require('child_process');


// const osPlatform = platform(); 
// Personal > dynamic items1
//  > dynamic items2
// Work     > dynamic item3
//          > dynamic item3
function openGitPersonal(){
    let url= 'https://www.github.com';
    let command = `google-chrome --profile-directory=Profile1  --no-sandbox ${url}`;
    exec(command);
}
function openGitWork(){
    let url= 'https://google.com';
    let command = `google-chrome --profile-directory=Profile2  --no-sandbox ${url}`;
    exec(command);
}

let query1 = `query MyQuery {
    user(login: "darvoid") {
      avatarUrl
    }
  }`

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


let noAction= ()=>{}

const systray:SysTray = new SysTray({
    menu: {
        // you should using .png icon in macOS/Linux, but .ico format in windows
        icon: "./assets/tray.png",
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
                        callback:{click: openGitPersonal} ,
                        items: [
                            //
                        ]
                    },{
                        title: "Work",
                        tooltip: "Work",
                        checked: false,
                        enabled: true,
                        callback:{click: openGitWork},
                        items: [
                            //
                        ]
                    },{
                        title: "graphQL",
                        tooltip: "Work",
                        checked: false,
                        enabled: true,
                        callback: {click:makeGraphQLCall},
                        items: [
                            //
                        ]
                    },
                ]
            },
            {
                title: "<SEPARATOR>",
                tooltip: "",
                enabled: true
            },
            {
                title: "Exit",
                tooltip: "Exit",
                checked: false,
                enabled: true,
                callback: {click: ()=> systray.kill()},
            },
        ],
    },
    debug: false,
    copyDir: true, // copy go tray binary to outside directory, useful for packing tool like pkg.
})