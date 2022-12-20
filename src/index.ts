import { Limiter, Value, ValueLimitedNumber, ValueLimitedString, EnumList } from "@chocolatelib/value";

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
    private settings: { [key: string]: Value<boolean> | ValueLimitedNumber | ValueLimitedString } = {};
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
        } else {
            return this.subGroups[id] = new SettingsGroup(this.pathID + '/' + id, name, description);
        }
    }

    /**Makes a boolean setting
     * @param id unique identifier for this setting in the group
     * @param name name of setting formatted for user reading
     * @param description a description of what the setting group is about formatted for user reading*/
    makeBooleanSetting(id: string, name: string, description: string, defaultValue: boolean | Promise<boolean>) {
        if (id in this.settings) {
            throw new Error('Settings already registered ' + id);
        }
        let saved = localStorage[this.pathID + '/' + id];
        if (saved) {
            var setting = new Value<boolean>(JSON.parse(saved));
        } else {
            if (typeof defaultValue === 'boolean') {
                var setting = new Value<boolean>(defaultValue);
            } else {
                var setting = new Value<boolean>(false);
                defaultValue.then((val) => { setting.set = val });
            }
        }
        setting.info = { name, description };
        setting.addListener((val) => { localStorage[this.pathID + '/' + id] = JSON.stringify(val); }, !saved)
        return this.settings[id] = setting;
    }

    /**Makes a number setting
     * @param id unique identifier for this setting in the group
     * @param name name of setting formatted for user reading
     * @param description a description of what the setting group is about formatted for user reading*/
    makeNumberSetting(id: string, name: string, description: string, defaultValue: number | Promise<number>, min?: number, max?: number, step?: number, limiters?: Limiter<number>[]) {
        if (id in this.settings) {
            throw new Error('Settings already registered ' + id);
        }
        let saved = localStorage[this.pathID + '/' + id];
        if (saved) {
            var setting = new ValueLimitedNumber(JSON.parse(saved), min, max, step, limiters);
        } else {
            if (typeof defaultValue === 'number') {
                var setting = new ValueLimitedNumber(defaultValue, min, max, step, limiters);
            } else {
                var setting = new ValueLimitedNumber(NaN, min, max, step, limiters);
                defaultValue.then((val) => { setting.set = val });
            }
        }
        setting.info = { name, description };
        setting.addListener((val) => { localStorage[this.pathID + '/' + id] = JSON.stringify(val); }, !saved)
        return this.settings[id] = setting;
    }

    /**Makes a string setting
     * @param id unique identifier for this setting in the group
     * @param name name of setting formatted for user reading
     * @param description a description of what the setting group is about formatted for user reading*/
    makeStringSetting(id: string, name: string, description: string, defaultValue: string | Promise<string>, enums?: EnumList, maxLength?: number, maxByteLength?: number, limiters?: Limiter<string>[]) {
        if (id in this.settings) {
            throw new Error('Settings already registered ' + id);
        }
        let saved = localStorage[this.pathID + '/' + id];
        if (saved) {
            var setting = new ValueLimitedString(JSON.parse(saved), enums, maxLength, maxByteLength, limiters);
        } else {
            if (typeof defaultValue === 'string') {
                var setting = new ValueLimitedString(defaultValue, enums, maxLength, maxByteLength, limiters);
            } else {
                var setting = new ValueLimitedString('', enums, maxLength, maxByteLength, limiters);
                defaultValue.then((val) => { setting.set = val });
            }
        }
        setting.info = { name, description };
        setting.addListener((val) => { localStorage[this.pathID + '/' + id] = JSON.stringify(val); }, !saved)
        return this.settings[id] = setting;
    }
}