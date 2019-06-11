const { Builder, By, Key, until } = require('selenium-webdriver');
require('selenium-webdriver/chrome');
require('selenium-webdriver/firefox');
//require('chromedriver')
require('geckodriver');
const { querySelector } = require('./helpers');

let driver;

describe('routing tests', () => {
    beforeAll(async () => {
        driver = await new Builder().forBrowser('firefox').build();
    });

    afterAll(async () => driver.close());

    it('goes to login page', async () => {
        await driver.get('http://localhost:3000');
        const title = await driver.getTitle();
        expect(title).toEqual('Login');
    });

    it('should login as admin', async () => {
        const login = await driver.findElement({ name: 'uName' });
        login.sendKeys('Admin');
        const pword = await driver.findElement({ name: 'pword' });
        pword.sendKeys('qwerty');
        const btn = await driver.findElement({ id: 'btn' });
        btn.click();
        await driver.sleep(200);
        const title = await driver.getTitle();
        expect(title).toEqual('Todo for Admin');
    });

    it('goes to admin panel', async () => {
        const anchor = await querySelector('[href="http://localhost:3000/admin"]', driver);
        anchor.click();
        await driver.sleep(200);
        const h1 = await querySelector('h1.header', driver);
        const h1Text = await h1.getText();
        expect(h1Text).toEqual('Admin panel');
    });

    it('goes to another user\'s page', async () => {
        const anchor = await querySelector('[href="http://localhost:3000/user/3295767"]', driver);
        anchor.click();
        await driver.sleep(200);
        const title = await driver.getTitle();
        expect(title).toEqual('Todo for Петя');
    });

    it('should add a task for user', async () => {
        const login = await driver.findElement({ name: 'content' });
        login.sendKeys('works');
        const btn = await driver.findElement({ name: 'submit' });
        btn.click();
        await driver.sleep(200);
        const li = await querySelector('ol', driver);
        const liText = await li.getText();
        expect(liText).toMatch(/works/);
    });
});

describe('registration and authorization tests', () => {
    beforeAll(async () => {
        driver = await new Builder().forBrowser('firefox').build();
    });

    afterAll(async () => driver.quit());

    it('goes to login page', async () => {
        await driver.get('http://localhost:3000');
        const title = await driver.getTitle();
        expect(title).toEqual('Login');
    });

    it('should fail logging in', async () => {
        const login = await driver.findElement({ name: 'uName' });
        login.sendKeys('Lox');
        const pword = await driver.findElement({ name: 'pword' });
        pword.sendKeys('q12345');
        const btn = await driver.findElement({ id: 'btn' });
        btn.click();
        await driver.sleep(200);
        const body = await querySelector('body', driver);
        const bodyText = await body.getText();
        expect(bodyText).toEqual('user not found');
    });

    it('fails to register', async () => {
        await driver.get('http://localhost:3000');
        const login = await driver.findElement({ id: 'rlogin' });
        login.sendKeys('Lox');
        const pword = await driver.findElement({ id: 'rpword' });
        pword.sendKeys('q12345');
        const pwordC = await driver.findElement({ id: 'rpwordC' });
        pword.sendKeys('q54321');
        const btn = await driver.findElement({ id: 'rbtn' });
        btn.click();
        await driver.sleep(200);
        const body = await querySelector('body', driver);
        const bodyText = await body.getText();
        expect(bodyText).toEqual('wrong registration data');
    });
});
