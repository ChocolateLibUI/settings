import { Limiter, Value, ValueLimitedNumber, ValueLimitedString, EnumList } from "@chocolatelib/value";

let bottomGroups: { [key: string]: SettingsGroup } = {};

/**Initialises the settings for the package
 * @param packageName use (await import("../package.json")).name */
export let initSettings = (packageName: string) => {
    bottomGroups[packageName] = new SettingsGroup(packageName);;
    return bottomGroups[packageName];
}

/**Group of settings should never be instantiated manually use initSettings*/
export class SettingsGroup {
    private path: string;
    private settings: { [key: string]: Value<boolean> | ValueLimitedNumber | ValueLimitedString } = {};
    private subGroups: { [key: string]: SettingsGroup } = {};
    constructor(path: string) {
        this.path = path;
    }

    /**Makes a settings subgroup for this group */
    makeSubGroup(name: string) {
        if (name in this.subGroups) {
            console.warn('Sub group already registered ' + name);
            return undefined
        } else {
            return this.subGroups[name] = new SettingsGroup(this.path + '/' + name);
        }
    }

    /**Makes a boolean setting */
    makeBooleanSetting(name: string, defaultValue: boolean) {
        if (name in this.settings) {
            throw new Error('Settings already registered ' + name);
        }
        let saved = localStorage[this.path + '/' + name];
        let setting = new Value<boolean>(saved ? JSON.parse(saved) : defaultValue);
        setting.addListener((val) => { localStorage[this.path + '/' + name] = JSON.stringify(val); }, !saved)
        return this.settings[name] = setting;
    }

    /**Makes a number setting */
    makeNumberSetting(name: string, defaultValue: number, min?: number, max?: number, step?: number, limiters?: Limiter<number>[]) {
        if (name in this.settings) {
            throw new Error('Settings already registered ' + name);
        }
        let saved = localStorage[this.path + '/' + name];
        let setting = new ValueLimitedNumber(saved ? JSON.parse(saved) : defaultValue, min, max, step, limiters);
        setting.addListener((val) => { localStorage[this.path + '/' + name] = JSON.stringify(val); }, !saved)
        return this.settings[name] = setting;
    }

    /**Makes a string setting */
    makeStringSetting(name: string, defaultValue: string, enums?: EnumList, maxLength?: number, maxByteLength?: number, limiters?: Limiter<string>[]) {
        if (name in this.settings) {
            throw new Error('Settings already registered ' + name);
        }
        let saved = localStorage[this.path + '/' + name];
        let setting = new ValueLimitedString(saved ? JSON.parse(saved) : defaultValue, enums, maxLength, maxByteLength, limiters);
        setting.addListener((val) => { localStorage[this.path + '/' + name] = JSON.stringify(val); }, !saved)
        return this.settings[name] = setting;
    }
}