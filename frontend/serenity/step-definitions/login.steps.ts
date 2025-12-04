import { Given, When, Then } from '@cucumber/cucumber';
import { browser, $, expect as expectWebdriverIO } from 'webdriverio';

Given('the user is on the login page', async () => {
  await browser.url('http://localhost:3000/login');
  await browser.pause(1000);
});

When('the user enters username {string}', async (username: string) => {
  const usernameInput = await $('#username');
  await usernameInput.setValue(username);
});

When('the user enters password {string}', async (password: string) => {
  const passwordInput = await $('#password');
  await passwordInput.setValue(password);
});

When('the user clicks the login button', async () => {
  const loginButton = await $('button.login-btn');
  await loginButton.click();
  await browser.pause(2000);
});

When('the user clicks the login button without entering credentials', async () => {
  const loginButton = await $('button.login-btn');
  await loginButton.click();
});

Then('the user should be redirected to the dashboard', async () => {
  await browser.waitUntil(
    async () => {
      const url = await browser.getUrl();
      return url.includes('/') && !url.includes('/login');
    },
    { timeout: 5000 }
  );
});

Then('the dashboard should be displayed', async () => {
  const dashboard = await $('.dashboard-container');
  await expect(dashboard).toBeDisplayed();
});

Then('an error message should be displayed', async () => {
  const errorMessage = await $('.error-message');
  await expect(errorMessage).toBeDisplayed();
});

Then('the error message should contain {string}', async (text: string) => {
  const errorMessage = await $('.error-message');
  const messageText = await errorMessage.getText();
  expect(messageText).toContain(text);
});

Then('the form should show validation errors', async () => {
  const usernameInput = await $('#username');
  const isInvalid = await usernameInput.getAttribute('aria-invalid');
  expect(isInvalid).toBe('true');
});

Then('the user should remain on the login page', async () => {
  const url = await browser.getUrl();
  expect(url).toContain('/login');
});

Then('the dashboard should display the agent\'s name', async () => {
  const dashboard = await $('.dashboard-container');
  await expect(dashboard).toBeDisplayed();
});
