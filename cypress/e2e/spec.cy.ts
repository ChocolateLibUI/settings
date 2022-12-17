/// <reference types="cypress" />
import { initSettings } from "../../src"
import { name } from "../../package.json"

describe('empty spec', () => {
  it('Initialise settings', () => {
    let sets = initSettings(name, 'Test Settings', 'Settings for testing');
    let test1 = sets.makeStringSetting('test1', 'test', 'test', 'value')
    expect(JSON.parse(localStorage[name + '/test1'])).to.equal('value');
    test1.set = 'value2';
    expect(JSON.parse(localStorage[name + '/test1'])).to.equal('value2');
    localStorage[name + '/test1'] = JSON.stringify('value3')
    cy.reload().then(() => {
      expect(JSON.parse(localStorage[name + '/test1'])).to.equal('value3');
    })
  })
})