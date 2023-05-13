import SysTray from 'systray3';

// Personal > dynamic items1
        //  > dynamic items2
// Work     > dynamic item3
//          > dynamic item3


const systray = new SysTray({
    menu: {
        // you should using .png icon in macOS/Linux, but .ico format in windows
        icon: "./assets/tray.png",
        title: '',
        tooltip: "GitHub Applet",
        items: [
            {
                title: "Github",
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
                        items: [
                            //
                        ],
                        callback: {
                            click: () => console.log('GitHub > Personal clicked'),
                        },
                    },{
                        title: "Work",
                        tooltip: "Work",
                        checked: false,
                        enabled: true,
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
            },
        ],
    },
    debug: false,
    copyDir: true, // copy go tray binary to outside directory, useful for packing tool like pkg.
})

systray.onClick(action => {

    console.log(Object.keys(systray["_conf"]["menu"]["items"].flat()))

    console.log(action.seq_id)
    // console.log(systray)
    if (action.seq_id === 0) {
        systray.sendAction({
            type: 'update-item',
            item: {
            ...action.item,
            checked: !action.item.checked,
            },
            seq_id: action.seq_id,
        })
        return
    } else if (action.seq_id === 1) {
        // open the url
        console.log('open the url', action)
    } else if (action.seq_id === 2) {
        // systray.kill()
    }

    }
)
