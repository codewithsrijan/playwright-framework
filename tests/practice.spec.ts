import {expect, test} from '@playwright/test'

test.use({ storageState: { cookies: [], origins: [] } })

test.describe("This is my first test", () => {

    test("First test", async ({browser}) => {

        const context = await browser.newContext();
        const page = await context.newPage();


        await page.goto("https://ucm-manual3-aws.front.develop.squads-dev.com");

        await expect(page).toHaveTitle("Percipio");


    })



});