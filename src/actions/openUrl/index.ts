import { Action, ActionArgs } from "contracts/Action";
import { Context } from "config";
import { launchChrome } from "utils/browser";

const openUrl: Action = function(context: Context, args: ActionArgs) {
    launchChrome(args.url ?? '', context.chromeProfile);
}

export default openUrl;
