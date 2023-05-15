import SysTray from 'systray3';

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
    let url= 'https://code.connected.bmw';
    let command = `google-chrome --profile-directory=Profile2  --no-sandbox ${url}`;
    exec(command);
}

`query MyQuery {
    user(login: "darvoid") {
      avatarUrl
    }
  }`

let noAction= ()=>{}

const systray = new SysTray({
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
                callback: noAction,
                items: [
                    {
                        title: "Personal",
                        tooltip: "Personal",
                        checked: false,
                        enabled: true,
                        callback: openGitPersonal,
                        items: [
                            //
                        ]
                    },{
                        title: "Work",
                        tooltip: "Work",
                        checked: false,
                        enabled: true,
                        callback: openGitWork,
                        items: [
                            //
                        ]
                    },
                ]
            },
            {
                title: "<SEPARATOR>",
                tooltip: "",
                callback: noAction,
                enabled: true
            },
            {
                title: "Exit",
                tooltip: "Exit",
                checked: false,
                enabled: true,
                callback: noAction,
            },
        ],
    },
    debug: false,
    copyDir: true, // copy go tray binary to outside directory, useful for packing tool like pkg.
})

systray.onClick(action => {

    console.log(Object.keys(systray["_conf"]["menu"]["items"].flat()[0]))

    console.log(action.seq_id)
    // console.log(systray)
    if (action.seq_id === 2) {
        // systray.sendAction({
        //     type: 'update-item',
        //     item: {
        //     ...action.item,
        //     checked: !action.item.checked,
        //     },
        //     seq_id: action.seq_id,
        // })
        // return
    } 
    if (action.seq_id === 1) {
        // console.log(systray["_conf"]["menu"]["items"].flat()[action.seq_id].callback())
        console.log('open the url', action)
        openGitWork()
    } 
    if (action.seq_id === 4) {
        systray.kill()
    }
    else if (action.seq_id === 0) {
        openGitPersonal()
    }
        

    }
)
