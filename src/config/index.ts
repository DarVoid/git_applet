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
