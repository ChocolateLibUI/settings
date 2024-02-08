import { Ok, Option } from "@chocolatelib/result";
import {
  State,
  StateAsync,
  StateHelper,
  StateRelated,
  StateResult,
  StateWrite,
} from "@chocolatelib/state";

let nameTransformer: ((name: string) => string) | undefined;
export let settingsSetNameTransform = (transform: (name: string) => string) => {
  nameTransformer = transform;
};

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
export let settingsInit = (
  packageName: string,
  packageVersion: string,
  name: string,
  description: string
) => {
  if (nameTransformer) {
    packageName = nameTransformer(packageName);
  }
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

class SettingsState<R, W = R, L extends StateRelated = {}, A = W> extends State<
  R,
  W,
  L,
  A
> {
  readonly name: string;
  readonly description: string;
  constructor(
    init:
      | StateResult<Exclude<R, Function>>
      | (() => StateResult<Exclude<R, Function>>),
    name: string,
    description: string,
    setter?: ((value: W) => Option<StateResult<R>>) | true,
    helper?: StateHelper<A, L>
  ) {
    super(init, setter, helper);
    this.name = name;
    this.description = description;
  }
}
class SettingsStateAsync<
  R,
  W = R,
  L extends StateRelated = {},
  A = W
> extends StateAsync<R, W, L, A> {
  readonly name: string;
  readonly description: string;
  constructor(
    init:
      | StateResult<Exclude<R, Function>>
      | Promise<StateResult<Exclude<R, Function>>>
      | (() => Promise<StateResult<Exclude<R, Function>>>),
    name: string,
    description: string,
    setter?: ((value: W) => Option<StateResult<R>>) | true,
    helper?: StateHelper<A, L>
  ) {
    super(init, setter, helper);
    this.name = name;
    this.description = description;
  }
}

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
   * @param name name of setting formatted for user reading
   * @param description a description of what the setting is about formatted for user reading
   * @param init initial value for the setting, use a promise for an eager async value, use a function returning a promise for a lazy async value
   * @param setter a function that will be called when the setting is written to, if true written value will be directly saved
   * @param helper helper struct for setting, for limiting, checking and getting related values
   * @param versionChanged function to call when the version of the setting changed, existing value is passed as argument, return modified value
   */
  addSetting<R, W = R, L extends {} = {}, A = W>(
    id: string,
    name: string,
    description: string,
    init: R | (() => R),
    setter?: ((value: W) => Option<StateResult<R>>) | true,
    helper?: StateHelper<A, L>,
    versionChanged?: (existing: R, oldVersion: string) => R
  ): State<R, W, L> {
    if (id in this.settings)
      throw new Error("Settings already registered " + id);
    let saved = localStorage[this.pathID + "/" + id];
    let state = (this.settings[id] = new SettingsState<R, W, L, A>(
      () => {
        if (saved) {
          try {
            if (this.versionChanged && versionChanged) {
              let changedValue = versionChanged(
                JSON.parse(saved),
                this.versionChanged
              );
              localStorage[this.pathID + "/" + id] =
                JSON.stringify(changedValue);
              return Ok<R>(changedValue) as any;
            }
            return Ok<R>(JSON.parse(saved));
          } catch (e) {}
        }
        let initValue: R;
        if (typeof init === "function") {
          // @ts-expect-error
          initValue = init();
        } else {
          initValue = init;
        }
        localStorage[this.pathID + "/" + id] = JSON.stringify(initValue);
        return Ok(initValue);
      },
      name,
      description,
      setter,
      helper
    ));
    state.subscribe((value) => {
      localStorage[this.pathID + "/" + id] = JSON.stringify(value.unwrap);
    });
    return state as State<R, W, L, A>;
  }

  /**Adds a state to the settings
   * @param id unique identifier for this setting in the parent group
   * @param name name of setting formatted for user reading
   * @param description a description of what the setting is about formatted for user reading
   * @param init initial value for the setting, use a promise for an eager async value, use a function returning a promise for a lazy async value
   * @param setter a function that will be called when the setting is written to, if true written value will be directly saved
   * @param helper helper struct for setting, for limiting, checking and getting related values
   * @param versionChanged function to call when the version of the setting changed, existing value is passed as argument, return modified value
   */
  addSettingAsync<R, W = R, L extends {} = {}, A = W>(
    id: string,
    name: string,
    description: string,
    init: R | Promise<R> | (() => Promise<R>),
    setter?: ((value: W) => Option<StateResult<R>>) | true,
    helper?: StateHelper<A, L>,
    versionChanged?: (existing: R, oldVersion: string) => R
  ): StateAsync<R, W, L> {
    if (id in this.settings)
      throw new Error("Settings already registered " + id);
    let saved = localStorage[this.pathID + "/" + id];
    let state = (this.settings[id] = new SettingsStateAsync<R, W, L, A>(
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
              return Ok<R>(changedValue) as any;
            }
            return Ok<R>(JSON.parse(saved));
          } catch (e) {}
        }
        let initValue: R;
        if (init instanceof Promise) {
          initValue = await init;
        } else if (typeof init === "function") {
          // @ts-expect-error
          initValue = await init();
        } else {
          initValue = init;
        }
        localStorage[this.pathID + "/" + id] = JSON.stringify(initValue);
        return Ok(initValue);
      },
      name,
      description,
      setter,
      helper
    ));
    state.subscribe((value) => {
      localStorage[this.pathID + "/" + id] = JSON.stringify(value.unwrap);
    });
    return state as StateAsync<R, W, L, A>;
  }
}
