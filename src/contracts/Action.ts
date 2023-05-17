import { Context } from "config";

type ActionArgs = {[key: string]: any};

interface Action {
    (context: Context, args: ActionArgs): void;
};

export {
    Action,
    ActionArgs,
};
