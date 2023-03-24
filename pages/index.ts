import "./index.css";
import { initSettings } from "../src"
import { name } from "../package.json"

let settings = initSettings(name, 'Test Settings', 'Description of test settings');
(async () => {
    let TestBoolSetting = settings.addState('TestBool', false, true)
    let valueBool = document.createElement('input');
    valueBool.type = 'checkbox';
    document.body.appendChild(valueBool);
    valueBool.checked = await TestBoolSetting;
    valueBool.addEventListener('change', (e) => {
        TestBoolSetting.write(valueBool.checked);
    });

    let TestNumberSetting = settings.addState('TestNumber', 99, true)
    let valueNumber = document.createElement('input');
    valueNumber.type = 'number';
    document.body.appendChild(valueNumber);
    valueNumber.value = String(await TestNumberSetting);
    valueNumber.addEventListener('change', async (e) => {
        TestNumberSetting.write(Number(valueNumber.value));
        valueNumber.value = String(await TestNumberSetting);
    });

    let TestStringSetting = settings.addState('TestString', new Promise<string>((a) => {
        setTimeout(() => {
            a('yo');
        }, 5000)
    }), true)
    let valueString = document.createElement('input');
    document.body.appendChild(valueString);
    valueString.value = await TestStringSetting;
    valueString.addEventListener('change', async (e) => {
        TestStringSetting.write(valueString.value);
        valueString.value = await TestStringSetting;
    });
})()