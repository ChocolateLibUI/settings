# Settings System

Manager for settings/configs
Settings for a package is initialized like so

```typescript
import { name, version } from "../package.json";
let settings = initSettings(
  name,
  version,
  "Test Settings",
  "Description of test settings"
);
```

This returns a setting group that you can either create settings with or add a subgroup to, the subgroup functions exactly like the group itself

**Add subgroup**

```typescript
let subSettings = settings.makeSubGroup(
  "subSettingsID",
  "Sub Settings",
  "Description of sub settings"
);
```

**Add setting**
Settings initial value is only used if no value is found in local storage, the rest of the parameters are passed directly to the returned state, so look at state for documentation.
Setting can also be given an optional function which is called when settings where saved with and older version of the package, to modify the setting if needed.

```typescript
let setting = settings.addSetting("settingID", "initial value","Name of setting","Description of setting",undefined,undefined,undefined,(oldValue,oldVersion)=>{
    switch (oldVersion) {
        "0.0.1-beta": return modifiedValue;
        default: return oldValue;
    }
});
```

# Changelog

- ## 0.1.11
  Updated state library, added way to transform names of settings
- ## 0.1.10
  Added name and description to setting
- ## 0.1.9
  Added feature to keep track of version change for modifing exisiting settings
- ## 0.1.8
  Added more documentation
- ## 0.1.7
  Changed to new state system
- ## 0.0.8
  Updated version requirements for dependency
