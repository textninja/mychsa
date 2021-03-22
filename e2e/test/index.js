/*
 *  Copyright 2021 Joe Taylor <joe@textninja.net>
 * 
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 * 
 *      http://www.apache.org/licenses/LICENSE-2.0
 * 
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

const puppeteer = require('puppeteer');
const targetUrl = process.env.MYCHSA_E2E_TARGET;
const { expect } = require('chai');

describe('frontend', async () => {

  let browser;
  let page;

  before(async () => {

    browser = await puppeteer.launch({
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox'
      ]
    });

    page = await browser.newPage();

    await page.goto(targetUrl, { "waitUntil": "networkidle2" });

  });

  it('should have content', async () => {
    let content = await page.content();
    expect(content).to.exist;
  });

  it('should have the correct title', async () => {
    let title = await page.title();
    expect(title).to.equal("mychsa - Find your Community Health Service Area (CHSA)");
  });

  it('should not have the wrong title', async () => {
    let title = await page.title();
    expect(title).to.not.equal("something else");
  });

  after(async () => await browser.close());

});