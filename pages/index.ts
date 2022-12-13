import "./index.css";
import { initSettings } from "../src"

let settings = initSettings((await import("../package.json")).name);

let TestSetting = settings.makeSetting('Test', "aasdf")
if (TestSetting) {
    let value = document.createElement('input');
    document.body.appendChild(value);
    value.value = await TestSetting.get;
    value.addEventListener('change', (e) => {
        TestSetting.set = value.value;
    });
}
