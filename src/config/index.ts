import process from 'node:process';

const s_to_ms = (seconds: number)=> {
    let _to_ms = 1000;
    return seconds * _to_ms
}

class Context {

    title: string = '';

    chromeProfile: string = '';

    githubHost: string = '';
    githubUsername: string = '';
    githubToken: string = '';

    gitUserName: string = '';
    gitUserEmail: string = '';

    pollEnabled: boolean = false;
    pollFrequency: number = 1000;

    static fromConfigObject(contextConfig: any): Context {
        const context = new Context();
        context.title = contextConfig.title ?? 'Untitled Context';
        context.pollEnabled = contextConfig.poll.enabled;
        context.pollFrequency = s_to_ms(contextConfig.poll.frequency_s);
        context.chromeProfile = contextConfig.chrome_profile ?? '';
        context.githubHost = contextConfig?.github?.host ?? 'https://github.com/';
        context.githubUsername = contextConfig?.github?.username ?? '';
        context.githubToken = contextConfig?.github?.token ?? '';
        context.gitUserName = contextConfig?.git?.user?.name ?? 'User';
        context.gitUserEmail = contextConfig?.git?.user?.email ?? 'user@example.com';
        return context;
    }

}

type ContextList = {[key: string]: Context};

function loadContexts(config: any): ContextList {
    console.log('Loading contexts');
    const contextConfig = config.contexts ?? {};
    let contexts: ContextList = {};
    Object.keys(contextConfig).forEach(key => {
        contexts[key] = Context.fromConfigObject(contextConfig[key]);
    })
    return contexts;
}

const CONFIG_FILE: string = process.argv[2] ?? 'config.json';

export {
    Context,
    ContextList,
    loadContexts,
    CONFIG_FILE,
};
