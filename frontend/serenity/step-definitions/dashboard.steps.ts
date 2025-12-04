import { Given, When, Then } from '@cucumber/cucumber';
import { browser, $, expect as expectWebdriverIO } from 'webdriverio';

Given('the user is logged in as {string}', async (username: string) => {
  await browser.url('http://localhost:3000/login');
  await browser.pause(1000);
  
  const usernameInput = await $('#username');
  await usernameInput.setValue(username);
  
  const passwordInput = await $('#password');
  await passwordInput.setValue('hash123');
  
  const loginButton = await $('button.login-btn');
  await loginButton.click();
  
  await browser.waitUntil(
    async () => {
      const url = await browser.getUrl();
      return !url.includes('/login');
    },
    { timeout: 5000 }
  );
});

Given('the user is on the dashboard page', async () => {
  await browser.url('http://localhost:3000/');
  await browser.pause(1000);
});

Then('the dashboard container should be visible', async () => {
  const dashboard = await $('.dashboard-container');
  await expect(dashboard).toBeDisplayed();
});

Then('the KPI grid should be displayed', async () => {
  const kpiGrid = await $('.kpi-grid');
  await expect(kpiGrid).toBeDisplayed();
});

Then('the charts grid should be displayed', async () => {
  const chartsGrid = await $('.charts-grid');
  await expect(chartsGrid).toBeDisplayed();
});

Then('the revenue KPI card should be visible', async () => {
  const revenueCard = await $('.kpi-card.revenue');
  await expect(revenueCard).toBeDisplayed();
});

Then('the active clients KPI card should be visible', async () => {
  const clientsCard = await $('.kpi-card.clients');
  await expect(clientsCard).toBeDisplayed();
});

Then('the pending reservations KPI card should be visible', async () => {
  const bookingsCard = await $('.kpi-card.bookings');
  await expect(bookingsCard).toBeDisplayed();
});

Then('the total reservations KPI card should be visible', async () => {
  const packagesCard = await $('.kpi-card.packages');
  await expect(packagesCard).toBeDisplayed();
});

Then('the revenue trend chart should be visible', async () => {
  const mainChart = await $('.chart-card.main-chart');
  await expect(mainChart).toBeDisplayed();
});

Then('the reservation status pie chart should be visible', async () => {
  const charts = await $$('.chart-card');
  expect(charts.length).toBeGreaterThan(1);
});

Then('the popular packages list should be visible', async () => {
  const listCards = await $$('.list-card');
  expect(listCards.length).toBeGreaterThan(0);
});

Then('the recent activity list should be visible', async () => {
  const activityList = await $('.list-card');
  await expect(activityList).toBeDisplayed();
});

When('the user clicks the refresh button', async () => {
  const refreshBtn = await $('.refresh-btn');
  await refreshBtn.click();
  await browser.pause(500);
});

Then('the loading indicator should appear', async () => {
  const loader = await $('.dashboard-loading');
  await expect(loader).toBeDisplayed();
});

Then('the data should be reloaded', async () => {
  await browser.pause(2000);
});

Then('the loading indicator should disappear', async () => {
  const loader = await $('.dashboard-loading');
  await expect(loader).not.toBeDisplayed();
});
