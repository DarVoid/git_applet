export class Context {

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

export type ContextList = {[key: string]: Context};

export function loadContexts(config: any): ContextList {
    console.log('Loading contexts');
    const contextConfig = config.contexts ?? {};
    let contexts: ContextList = {};
    Object.keys(contextConfig).forEach(key => {
        contexts[key] = Context.fromConfigObject(contextConfig[key]);
    })
    return contexts;
}
