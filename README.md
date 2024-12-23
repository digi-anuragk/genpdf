# genpdf

Command to run

```bash
node .\cli.js docs-to-pdf --initialDocURLs="https://docs.digital.ai/app-management/docs/category/welcome" --contentSelector="article" --paginationSelector="a.pagination-nav__link.pagination-nav__link--next" --excludeSelectors=".margin-vert--xl a,[class^='tocCollapsible'],.breadcrumbs,.theme-edit-this-page,.table-of-contents,.menu,.footer" --coverImage="https://docusaurus.io/img/docusaurus.png" --coverTitle="Docs App Management"
```


## 🍗 CLI Global Options

| Option                 | Required | Description                                                                                                                                                                        |
| ---------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--initialDocURLs`     | Yes      | set URL to start generating PDF from.                                                                                                                                              |
| `--contentSelector`    | No       | used to find the part of main content                                                                                                                                              |
| `--paginationSelector` | No       | CSS Selector used to find next page to be printed for looping.                                                                                                                     |
| `--excludeURLs`        | No       | URLs to be excluded in PDF                                                                                                                                                         |
| `--excludeSelectors`   | No       | exclude selectors from PDF. Separate each selector **with comma and no space**. But you can use space in each selector. ex: `--excludeSelectors=".nav,.next > a"`                  |
| `--cssStyle`           | No       | CSS style to adjust PDF output ex: `--cssStyle="body{padding-top: 0;}"` \*If you're project owner you can use `@media print { }` to edit CSS for PDF.                              |
| `--outputPDFFilename`  | No       | name of the output PDF file. Default is `docs-to-pdf.pdf`                                                                                                                          |
| `--pdfMargin`          | No       | set margin around PDF file. Separate each margin **with comma and no space**. ex: `--pdfMargin="10,20,30,40"`. This sets margin `top: 10px, right: 20px, bottom: 30px, left: 40px` |
| `--paperFormat`        | No       | pdf format ex: `--paperFormat="A3"`. Please check this link for available formats [Puppeteer document](https://pptr.dev/#?product=Puppeteer&version=v5.2.1&show=api-pagepdfoptions)|
| `--disableTOC`         | No       | Optional toggle to show the table of contents or not                                                                                                                               |
| `--coverTitle`         | No       | Title for the PDF cover.                                                                                                                                                           |
| `--coverImage`         | No       | `<src>` Image for PDF cover (does not support SVG)                                                                                                                                 |
| `--coverSub`           | No       | Subtitle the for PDF cover. Add `<br/>` tags for multiple lines.                                                                                                                   |
| `--headerTemplate`     | No       | HTML template for the print header. Please check this link for details of injecting values [Puppeteer document](https://pptr.dev/#?product=Puppeteer&show=api-pagepdfoptions)      |
| `--footerTemplate`     | No       | HTML template for the print footer. Please check this link for details of injecting values [Puppeteer document](https://pptr.dev/#?product=Puppeteer&show=api-pagepdfoptions)      |
| `--puppeteerArgs`      | No       | Add puppeteer BrowserLaunchArgumentOptions arguments ex: --sandbox [Puppeteer document](https://pptr.dev/api/puppeteer.browserlaunchargumentoptions)                               |
| `--protocolTimeout`    | No       | Timeout setting for individual protocol calls in milliseconds. If omitted, the default value of 180000 ms (3 min) is used                                                          |
| `--filterKeyword`      | No       | Only adds pages to the PDF containing a given meta keywords. Makes it possible to generate PDFs of selected pages                                                                  |
| `--baseUrl`            | No       | Base URL for all relative URLs. Allows to render the pdf on localhost (ci/Github Actions) while referencing the deployed page.                                                     |
| `--excludePaths`       | No       | URL Paths to be excluded                                                                                                                                                           |
| `--restrictPaths`      | No       | Keep Only URL Path with the same rootPath as  `--initialDocURLs`                                                                                                                   |
|                        |          |                                                                                                                                                                                    |
