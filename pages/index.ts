import "./index.css";
import { settingsInit, settingsSetNameTransform } from "../src";
import { name, version } from "../package.json";
import { State, StateAsync } from "@chocolatelib/state";
import { Ok } from "@chocolatelib/result";

settingsSetNameTransform((name) => {
  return name + "2";
});

let settings = settingsInit(
  name,
  version,
  "Test Settings",
  "Description of test settings"
);

(async () => {
  let state = new StateAsync<number>(new Promise((a) => setTimeout(a, 500, 1)));
  state.write(2);
  console.log(await state);

  let TestBoolSetting = settings.addSetting(
    "TestBool",
    "Test Bool",
    "Bool Test",
    false,
    true
  );
  let valueBool = document.createElement("input");
  valueBool.type = "checkbox";
  document.body.appendChild(valueBool);
  valueBool.checked = (await TestBoolSetting).unwrap;
  valueBool.addEventListener("change", (e) => {
    TestBoolSetting.write(valueBool.checked);
  });

  let TestNumberSetting = settings.addSetting(
    "TestNumber",
    " Test Number",
    "Number Test",
    () => {
      return 99;
    },
    true,
    undefined,
    (oldValue, oldVersion) => {
      switch (oldVersion) {
        case "0.1.1":
          return 100;
        case "0.1.5":
          return 50;
        default:
          return 10;
      }
    }
  );
  let valueNumber = document.createElement("input");
  valueNumber.type = "number";
  document.body.appendChild(valueNumber);
  valueNumber.value = String((await TestNumberSetting).unwrap);
  valueNumber.addEventListener("change", async (e) => {
    TestNumberSetting.write(Number(valueNumber.value));
    valueNumber.value = String((await TestNumberSetting).unwrap);
  });

  let TestStringSetting = settings.addSettingAsync(
    "TestString",
    "",
    "",
    new Promise<string>((a) => {
      setTimeout(() => {
        a("yo");
      }, 5000);
    }),
    true
  );
  let valueString = document.createElement("input");
  document.body.appendChild(valueString);
  valueString.value = (await TestStringSetting).unwrap;
  valueString.addEventListener("change", async (e) => {
    TestStringSetting.write(valueString.value);
    valueString.value = (await TestStringSetting).unwrap;
  });
})();
