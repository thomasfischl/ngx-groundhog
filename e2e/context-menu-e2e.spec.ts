import {browser, by, element, ExpectedConditions, Key } from 'protractor';

describe('context-menu', () => {
  beforeEach(() => browser.get('/context-menu'));

  describe('disabling behavior', () => {

    it('should open the context menu when not disabled', async () => {
      element(by.id('context-menu')).click();
      expect(await browser.isElementPresent(by.css('.gh-context-menu-panel'))).toBeTruthy();
    });

    it('should not execute click handlers when disabled', async () => {
      element(by.id('disable-toggle')).click();
      await element(by.id('context-menu')).click();
      expect(await browser.isElementPresent(by.css('.gh-context-menu-panel'))).toBeFalsy();
    });
  });

  describe('focus behaviour', () => {
    it('should trap the focus inside the overlay', async () => {
      element(by.id('context-menu')).click();
      await browser.isElementPresent(by.css('.gh-context-menu-panel'));
      expect(await browser.driver.switchTo().activeElement().getText()).toEqual('Edit');
      await browser.actions().sendKeys(Key.TAB).perform();
      expect(await browser.driver.switchTo().activeElement().getText()).toEqual('Approve');
      await browser.actions().sendKeys(Key.TAB).perform();
      expect(await browser.driver.switchTo().activeElement().getAttribute('aria-label'))
        .toEqual('close');
      await browser.actions().sendKeys(Key.TAB).perform();
      expect(await browser.driver.switchTo().activeElement().getText()).toEqual('Edit');
    });
  });

  describe('close behaviour', () => {
    it('should open and close the context menu', async () => {
      await element(by.id('context-menu')).click();
      await browser.isElementPresent(by.css('.gh-context-menu-panel'));
      await element(by.css('.gh-context-menu-close-trigger')).click();
      expect(await browser.isElementPresent(by.css('.gh-context-menu-panel'))).toBeFalsy();
    });
  });
});
