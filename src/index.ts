import { Ok } from "@chocolatelib/result";
import {
  State,
  StateLimiter,
  StateRelater,
  StateSetter,
  StateWrite,
} from "@chocolatelib/state";

let bottomGroups: { [key: string]: SettingsGroup } = {};

/**Initialises the settings for the package
 * @param packageName use import {name} from ("../package.json")
 * @param name name of group formatted for user reading
 * @param description a description of what the setting group is about*/
export let initSettings = (
  packageName: string,
  name: string,
  description: string
) => {
  return (bottomGroups[packageName] = new SettingsGroup(
    packageName,
    name,
    description
  ));
};

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
      console.warn("Sub group already registered " + id);
      return undefined;
    }
    return (this.subGroups[id] = new SettingsGroup(
      this.pathID + "/" + id,
      name,
      description
    ));
  }

  /**Adds a state to the settings
   * @param id unique identifier for this setting in the parent group
   * @param init initial value for the setting, use a promise for an eager async value, use a function returning a promise for a lazy async value
   * @param setter a function that will be called when the setting is written to, if true written value will be directly saved
   * @param limiter limiter struct for value
   * @param related returns related struct for the setting
   */
  addSetting<R, W = R, L extends {} = any>(
    id: string,
    init: R | Promise<R> | (() => Promise<R>),
    setter?: StateSetter<R, W> | true,
    limiter?: StateLimiter<W>,
    related?: StateRelater<L>
  ) {
    if (id in this.settings)
      throw new Error("Settings already registered " + id);
    let saved = localStorage[this.pathID + "/" + id];
    let state = (this.settings[id] = new State<R, W, L>(
      async () => {
        if (saved) {
          try {
            return Ok<R>(JSON.parse(saved));
          } catch (e) {}
        }
        let initValue: R;
        if (init instanceof Promise) {
          initValue = await init;
        } else if (typeof init === "function") {
          // @ts-ignore
          initValue = await init();
        } else {
          initValue = init;
        }
        localStorage[this.pathID + "/" + id] = JSON.stringify(initValue);
        return Ok(initValue);
      },
      setter,
      limiter,
      related
    ));
    state.subscribe((value) => {
      localStorage[this.pathID + "/" + id] = JSON.stringify(value.unwrap);
    });
    return state;
  }
}
