/// <reference types="cypress" />
import { initSettings } from "../../src"
import { name } from "../../package.json"

describe('empty spec', () => {
  it('Initialise settings', () => {
    let sets = initSettings(name);
    let test1 = sets.makeSetting('test1', 'value')
    expect(JSON.parse(localStorage[name + '/test1'])).to.equal('value');
    test1.set = 'value2';
    expect(JSON.parse(localStorage[name + '/test1'])).to.equal('value2');
    localStorage[name + '/test1'] = JSON.stringify('value3')
    cy.reload().then(() => {
      expect(JSON.parse(localStorage[name + '/test1'])).to.equal('value3');
    })
  })
})