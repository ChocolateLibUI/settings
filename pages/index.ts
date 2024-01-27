import "./index.css";
import { initSettings } from "../src";
import { name, version } from "../package.json";
import { State } from "@chocolatelib/state";
import { Ok } from "@chocolatelib/result";

let settings = initSettings(
  name,
  version,
  "Test Settings",
  "Description of test settings"
);

(async () => {
  let state = new State<number>(new Promise((a) => setTimeout(a, 500, 1)));
  state.write(2);
  console.log(await state);

  let TestBoolSetting = settings.addSetting("TestBool", false, true);
  let valueBool = document.createElement("input");
  valueBool.type = "checkbox";
  document.body.appendChild(valueBool);
  valueBool.checked = (await TestBoolSetting).unwrap;
  valueBool.addEventListener("change", (e) => {
    TestBoolSetting.write(valueBool.checked);
  });

  let TestNumberSetting = settings.addSetting(
    "TestNumber",
    99,
    true,
    undefined,
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

  let TestStringSetting = settings.addSetting(
    "TestString",
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
