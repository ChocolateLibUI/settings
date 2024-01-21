/// <reference types="cypress" />
import { initSettings } from "../../src";
import { name } from "../../package.json";

describe("empty spec", () => {
  it("Initialise settings", () => {
    expect(localStorage[name + "/test1"]).to.equal(undefined);
    let sets = initSettings(name, "Test Settings", "Settings for testing");
    let test1 = sets.addSetting("test1", "value", true);
    test1.then((a) => {});
    expect(JSON.parse(localStorage[name + "/test1"])).to.equal("value");
    test1.write("value2");
    expect(JSON.parse(localStorage[name + "/test1"])).to.equal("value2");
    localStorage[name + "/test1"] = JSON.stringify("value3");
    cy.reload().then(() => {
      expect(JSON.parse(localStorage[name + "/test1"])).to.equal("value3");
    });
  });
  it("Initialise settings with async value", async () => {
    expect(localStorage[name + "/test1"]).to.equal(undefined);
    let sets = initSettings(name, "Test Settings", "Settings for testing");
    let test1 = sets.addSetting(
      "test1",
      new Promise((a) => {
        setTimeout(a, 400, "value");
      }),
      true
    );
    await new Promise((a) => {
      setTimeout(a, 600);
    });
    expect(JSON.parse(localStorage[name + "/test1"])).to.equal("value");
    test1.write("value2");
    expect(JSON.parse(localStorage[name + "/test1"])).to.equal("value2");
    localStorage[name + "/test1"] = JSON.stringify("value3");
    cy.reload().then(() => {
      expect(JSON.parse(localStorage[name + "/test1"])).to.equal("value3");
    });
  });
});
