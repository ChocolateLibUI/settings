import "./index.css";
import { initSettings } from "../src"
import { name } from "../package.json"

let settings = initSettings(name, 'Test Settings', 'Description of test settings');
(async () => {
    let TestBoolSetting = settings.makeBooleanSetting('TestBool', '', '', false)
    let valueBool = document.createElement('input');
    valueBool.type = 'checkbox';
    document.body.appendChild(valueBool);
    valueBool.checked = await TestBoolSetting.get;
    valueBool.addEventListener('change', (e) => {
        TestBoolSetting.set = valueBool.checked;
    });

    let TestNumberSetting = settings.makeNumberSetting('TestNumber', '', '', 10, 2, 99)
    let valueNumber = document.createElement('input');
    valueNumber.type = 'number';
    valueNumber.min = String(TestNumberSetting.min);
    valueNumber.max = String(TestNumberSetting.max);
    document.body.appendChild(valueNumber);
    valueNumber.value = String(await TestNumberSetting.get);
    valueNumber.addEventListener('change', async (e) => {
        TestNumberSetting.set = Number(valueNumber.value);
        valueNumber.value = String(await TestNumberSetting.get);
    });

    let TestStringSetting = settings.makeStringSetting('TestString', '', '', 'asdf', undefined, 10)
    let valueString = document.createElement('input');
    document.body.appendChild(valueString);
    valueString.value = await TestStringSetting.get;
    valueString.addEventListener('change', async (e) => {
        TestStringSetting.set = valueString.value;
        valueString.value = await TestStringSetting.get;
    });
})()