import { Action, ActionArgs } from "contracts/Action";
import { Context } from "config";
import openUrl from "actions/openUrl";

const openGitHub: Action = function(context: Context, args: ActionArgs) {
    openUrl(context, { url: context.githubHost });
}

export default openGitHub;
