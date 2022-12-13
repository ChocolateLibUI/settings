import { ValueLimited, Limiter } from "@chocolatelib/value";

let bottomGroups: { [key: string]: SettingsGroup } = {};

/**Initialises the settings for the package
 * @param packageName use (await import("../package.json")).name */
export let initSettings = (packageName: string) => {
    bottomGroups[packageName] = new SettingsGroup(packageName);;
    return bottomGroups[packageName];
}

/**Group of settings*/
export class SettingsGroup {
    private path: string;
    private settings: { [key: string]: ValueLimited<boolean | number | string> } = {};
    private subGroups: { [key: string]: SettingsGroup } = {};

    constructor(path: string) {
        this.path = path;
    }

    makeSubGroup(name: string) {
        if (name in this.subGroups) {
            console.warn('Sub group already registered ' + name);
            return undefined
        } else {

            return this.subGroups[name] = new SettingsGroup(this.path + '/' + name);
        }
    }

    makeSetting<T extends boolean | number | string>(name: string, defaultValue: T, limiter: Limiter<T> = (val) => val) {
        if (name in this.settings) {
            console.warn('Settings already registered ' + name);
            return undefined;
        } else {
            let saved = localStorage[this.path + '/' + name];
            let setting = new ValueLimited<T>((saved ? JSON.parse(saved) : defaultValue), limiter);
            setting.addListener((val) => {
                localStorage[this.path + '/' + name] = JSON.stringify(val);
            }, !saved)
            //@ts-ignore
            return setting;
        }
    }
}