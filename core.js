import chalk from 'chalk';
import puppeteer from 'puppeteer-core';
const { scrollPageToBottom } = await import('puppeteer-autoscroll-down');
import fs from 'fs-extra';
import { chromeExecPath } from './browser.js';
import * as utils from './utils.js';


let contentHTML = '';

/* c8 ignore start */
export async function generatePDF({
  maxHeadingLevel,
  initialDocURLs,
  excludeURLs,
  outputPDFFilename = 'docs-to-pdf.pdf',
  pdfMargin = { top: 32, right: 32, bottom: 32, left: 32 },
  contentSelector,
  paginationSelector,
  paperFormat,
  excludeSelectors,
  cssStyle,
  puppeteerArgs,
  coverTitle,
  coverImage,
  disableTOC,
  coverSub,
  waitForRender,
  headerTemplate,
  footerTemplate,
  protocolTimeout,
  filterKeyword,
  baseUrl,
  excludePaths,
  restrictPaths,
  openDetail = true,
}) {
  const execPath = process.env.PUPPETEER_EXECUTABLE_PATH ?? chromeExecPath();
  console.debug(chalk.cyan(`Using Chromium from ${execPath}`));
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: execPath,
    args: puppeteerArgs,
    protocolTimeout: protocolTimeout,
  });

  const chromeTmpDataDir = browser
    .process()
    ?.spawnargs.find((arg) => arg.startsWith('--user-data-dir'))
    ?.split('=')[1]
  console.debug(chalk.cyan(`Chrome user data dir: ${chromeTmpDataDir}`));

  const page = await browser.newPage();

  // Block PDFs as puppeteer can not access them
  await page.setRequestInterception(true);
  page.on('request', (request) => {
    if (request.url().endsWith('.pdf')) {
      console.log(chalk.yellowBright(`ignore pdf: ${request.url()}`));
      request.abort();
    } else request.continue();
  });

  console.debug(`InitialDocURLs: ${initialDocURLs}`);
  const set = new Set()
  for (const url of initialDocURLs) {
    let nextPageURL = url;
    const urlPath = new URL(url).pathname;

    // Create a list of HTML for the content section of all pages by looping
    while (nextPageURL) {
      console.log(chalk.cyan(`Retrieving html from ${nextPageURL}`));

      if (set.has(nextPageURL)) {
        nextPageURL = await utils.findNextUrl(page, paginationSelector);
        console.log(chalk.yellowBright("cyclic doc detected !!"))
        break;
      }

      set.add(nextPageURL)
      // Go to the page specified by nextPageURL
      await page.goto(`${nextPageURL}`, {
        waitUntil: 'networkidle0',
        timeout: 0,
      });

      if (waitForRender) {
        console.log(chalk.green('Waiting for render...'));
        await new Promise((r) => setTimeout(r, waitForRender));
      }

      if (
        await utils.isPageKept(
          page,
          nextPageURL,
          urlPath,
          excludeURLs,
          filterKeyword,
          excludePaths,
          restrictPaths,
        )
      ) {
        // Open all <details> elements on the page
        if (openDetail) {
          await utils.openDetails(page);
        }
        // Get the HTML string of the content section.

        // console.log(chalk.red())
        contentHTML += await utils.getHtmlContent(page, contentSelector);
        console.log(chalk.green('Success\n'));
      }

      // Find next page url before DOM operations
      nextPageURL = await utils.findNextUrl(page, paginationSelector);
    }
  }

  console.log(chalk.cyan('Start generating PDF...'));

  // Generate cover Image if declared
  let coverImageHtml = '';
  if (coverImage) {
    console.log(chalk.cyan('Get coverImage...'));
    const image = await utils.getCoverImage(page, coverImage);
    coverImageHtml = utils.generateImageHtml(image.base64, image.type);
  }

  // Generate Cover
  console.log(chalk.cyan('Generate cover...'));
  const coverHTML = utils.generateCoverHtml(
    coverTitle,
    coverImageHtml,
    coverSub,
  );


  // console.log(chalk.green(contentHTML))
  // Generate Toc
  const { modifiedContentHTML, tocHTML } = utils.generateToc(contentHTML, +maxHeadingLevel);

  // console.log(chalk.yellow(modifiedContentHTML))
  // Restructuring the HTML of a document
  console.log(chalk.cyan('Restructuring the html of a document...'));


  // console.log(chalk.green(tocHTML))
  // Go to initial page
  await page.goto(`${initialDocURLs[0]}`, { waitUntil: 'networkidle0' });

  await page.evaluate(
    utils.concatHtml,
    coverHTML,
    tocHTML,
    modifiedContentHTML,
    disableTOC,
    baseUrl,
  );

  // Remove unnecessary HTML by using excludeSelectors
  if (excludeSelectors) {
    console.log(chalk.cyan('Remove unnecessary HTML...'));
    await utils.removeExcludeSelector(page, excludeSelectors);
  }

  // Add CSS to HTML
  if (cssStyle) {
    console.log(chalk.cyan('Add CSS to HTML...'));
    await page.addStyleTag({ content: cssStyle });
  }

  // Scroll to the bottom of the page with puppeteer-autoscroll-down
  // This forces lazy-loading images to load
  console.log(chalk.cyan('Scroll to the bottom of the page...'));
  await scrollPageToBottom(page, {
    size: 100,
    delay: 150
  }); //cast to puppeteer-core type

  // Generate PDF
  console.log(chalk.cyan('Generate PDF...'));
  // await page.emulateMediaType("print")
  await page.pdf({
    path: outputPDFFilename,
    format: paperFormat,
    printBackground: true,
    margin: pdfMargin,
    displayHeaderFooter: !!(headerTemplate || footerTemplate),
    headerTemplate,
    footerTemplate,
    timeout: 2147483647,
  });

  console.log(chalk.green(`PDF generated at ${outputPDFFilename}`));
  await browser.close();
  console.log(chalk.green('Browser closed'));

  if (chromeTmpDataDir !== null) {
    fs.removeSync(chromeTmpDataDir);
  }
  console.debug(chalk.cyan('Chrome user data dir removed'));
}
/* c8 ignore stop */
