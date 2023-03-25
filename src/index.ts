import { State, StateChecker, StateLimiter, StateNumber, StateNumberLimits, StateSetter, StateString, StateStringLimits, StateWrite } from "@chocolatelib/state";

let bottomGroups: { [key: string]: SettingsGroup } = {};

/**Initialises the settings for the package
 * @param packageName use import {name} from ("../package.json")
 * @param name name of group formatted for user reading
 * @param description a description of what the setting group is about*/
export let initSettings = (packageName: string, name: string, description: string) => {
    bottomGroups[packageName] = new SettingsGroup(packageName, name, description);
    return bottomGroups[packageName];
}

/**Group of settings should never be instantiated manually use initSettings*/
export class SettingsGroup {
    private pathID: string;
    private settings: { [key: string]: StateWrite<any> } = {};
    private subGroups: { [key: string]: SettingsGroup } = {};
    readonly name: string;
    readonly description: string;

    constructor(path: string, name: string, description: string) {
        this.pathID = path;
        this.name = name;
        this.description = description;
    }

    /**Makes a settings subgroup for this group
     * @param id unique identifier for this subgroup in the parent group
     * @param name name of group formatted for user reading
     * @param description a description of what the setting group is about formatted for user reading*/
    makeSubGroup(id: string, name: string, description: string) {
        if (id in this.subGroups) {
            console.warn('Sub group already registered ' + id);
            return undefined
        }
        return this.subGroups[id] = new SettingsGroup(this.pathID + '/' + id, name, description);
    }

    /**Adds a state to the settings */
    addState<R, W extends R = R>(id: string, initial: R | PromiseLike<R> | undefined = undefined, setter: StateSetter<R, W> | boolean, checker?: StateChecker<W>, limiter?: StateLimiter<W>) {
        if (id in this.settings)
            throw new Error('Settings already registered ' + id);
        let saved = localStorage[this.pathID + '/' + id];
        let state = this.settings[id] = new State<R, W>(<any>undefined, setter, checker, limiter);
        if (saved) {
            state.write(<W>JSON.parse(saved));
        } else {
            if ((initial as PromiseLike<W>).then) {
                (initial as PromiseLike<W>).then(state.write.bind(state));
            } else {
                state.write(<W>initial)
            }
        }
        state.subscribe((value) => { localStorage[this.pathID + '/' + id] = JSON.stringify(value); }, !saved);
        return state;
    }

    /**Adds a number to the settings */
    addNumber(id: string, initial: number | PromiseLike<number> | undefined = undefined, limits: StateNumberLimits) {
        if (id in this.settings)
            throw new Error('Settings already registered ' + id);
        let saved = localStorage[this.pathID + '/' + id];
        let state = this.settings[id] = new StateNumber(<any>undefined, limits);
        if (saved) {
            state.write(JSON.parse(saved) as number);
        } else {
            if ((initial as PromiseLike<number>).then) {
                (initial as PromiseLike<number>).then(state.write.bind(state));
            } else {
                state.write(initial as number)
            }
        }
        state.subscribe((value) => { localStorage[this.pathID + '/' + id] = JSON.stringify(value); }, !saved);
        return state;
    }

    /**Adds a string to the settings */
    addString(id: string, initial: string | PromiseLike<string> | undefined = undefined, limits: StateStringLimits) {
        if (id in this.settings)
            throw new Error('Settings already registered ' + id);
        let saved = localStorage[this.pathID + '/' + id];
        let state = this.settings[id] = new StateString(<any>undefined, limits);
        if (saved) {
            state.write(JSON.parse(saved) as string);
        } else {
            if ((initial as PromiseLike<string>).then) {
                (initial as PromiseLike<string>).then(state.write.bind(state));
            } else {
                state.write(initial as string)
            }
        }
        state.subscribe((value) => { localStorage[this.pathID + '/' + id] = JSON.stringify(value); }, !saved);
        return state;
    }
}