import { Ok } from "@chocolatelib/result";
import {
  State,
  StateLimiter,
  StateRelater,
  StateSetter,
  StateWrite,
} from "@chocolatelib/state";

let packages = localStorage["settings/packageVersions"] as string | undefined;
let packageVersions: { [key: string]: string } = {};
try {
  packageVersions = packages
    ? (JSON.parse(packages) as { [key: string]: string })
    : {};
} catch (e) {}
let storePackageVersionsTimeout: number | undefined;
let bottomGroups: { [key: string]: SettingsGroup } = {};

/**Initialises the settings for the package
 * @param packageName use import {name} from ("../package.json")
 * @param packageVersion use import {version} from ("../package.json")
 * @param versionChanged function to call when the version of the package changed
 * @param name name of group formatted for user reading
 * @param description a description of what the setting group is about*/
export let initSettings = (
  packageName: string,
  packageVersion: string,
  name: string,
  description: string
) => {
  let changed: string | undefined;
  if (packageVersions[packageName] !== packageVersion) {
    changed = packageVersions[packageName];
    packageVersions[packageName] = packageVersion;
    if (storePackageVersionsTimeout) clearTimeout(storePackageVersionsTimeout);
    storePackageVersionsTimeout = setTimeout(() => {
      localStorage["settings/packageVersions"] =
        JSON.stringify(packageVersions);
    }, 1000);
  }
  return (bottomGroups[packageName] = new SettingsGroup(
    packageName,
    name,
    description,
    changed ? changed : undefined
  ));
};

/**Group of settings should never be instantiated manually use initSettings*/
export class SettingsGroup {
  private pathID: string;
  private settings: { [key: string]: StateWrite<any> } = {};
  private subGroups: { [key: string]: SettingsGroup } = {};
  readonly versionChanged: string | undefined;
  readonly name: string;
  readonly description: string;

  constructor(
    path: string,
    name: string,
    description: string,
    versionChanged?: string
  ) {
    this.versionChanged = versionChanged;
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
      description,
      this.versionChanged
    ));
  }

  /**Adds a state to the settings
   * @param id unique identifier for this setting in the parent group
   * @param init initial value for the setting, use a promise for an eager async value, use a function returning a promise for a lazy async value
   * @param setter a function that will be called when the setting is written to, if true written value will be directly saved
   * @param limiter limiter struct for value
   * @param related returns related struct for the setting
   * @param versionChanged function to call when the version of the setting changed, existing value is passed as argument, return modified value
   */
  addSetting<R, W = R, L extends {} = any>(
    id: string,
    init: R | Promise<R> | (() => Promise<R>),
    setter?: StateSetter<R, W> | true,
    limiter?: StateLimiter<W>,
    related?: StateRelater<L>,
    versionChanged?: (existing: R, oldVersion: string) => R
  ) {
    if (id in this.settings)
      throw new Error("Settings already registered " + id);
    let saved = localStorage[this.pathID + "/" + id];
    let state = (this.settings[id] = new State<R, W, L>(
      async () => {
        if (saved) {
          try {
            if (this.versionChanged && versionChanged) {
              let changedValue = versionChanged(
                JSON.parse(saved),
                this.versionChanged
              );
              localStorage[this.pathID + "/" + id] =
                JSON.stringify(changedValue);
              return Ok<R>(changedValue);
            }
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
