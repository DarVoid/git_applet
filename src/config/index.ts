class Context {

    title: string = '';

    chromeProfile: string = '';

    githubHost: string = '';
    githubUsername: string = '';
    githubToken: string = '';

    gitUserName: string = '';
    gitUserEmail: string = '';

    static fromConfigObject(contextConfig: any): Context {
        const context = new Context();
        context.title = contextConfig.title ?? 'Untitled Context';
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

const CONFIG_FILE: string = 'config.json';

export {
    Context,
    ContextList,
    loadContexts,
    CONFIG_FILE,
};
