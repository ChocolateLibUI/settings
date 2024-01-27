# Settings System

Manager for settings/configs
Settings for a package is initialized like so

```typescript
import { name } from "../package.json";
let settings = initSettings(
  name,
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

```typescript
let setting = settings.addSetting("settingID", "initial value");
```

# Changelog

- ## 0.1.8
  Added more documentation
- ## 0.1.7
  Changed to new state system
- ## 0.0.8
  Updated version requirements for dependency
