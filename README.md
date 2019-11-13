#### Copy Google Docs paragraph style to another paragraph

##### Experimentations

This scope of this project is to explore the limits and the boundaries of by GSuite and Google Apps Script (GAS).

Everything started from the need to copy a paragraph style (line height, indentation, rulers, before and after paragraph spacing) to another paragraph.

It turns out that it is not so easy because GSuite do not expose any event handling facility. Just menus and dialog boxes or sidebar. There is no way to respond to a selection event even if in this case I tried a hack just to learn a bit more about security and CORS and see how Browsers behave.

#### Install and usage

To install this setup (that is good also for other GAS projects) you just have to clone this repository on your computer. Something like:

```bash
git clone https://github.com/endersaka/gas-copy-gdocs-paragraph-style.git name_of_the_new_destination_directory`
```

or

```bash
git clone git@github.com:endersaka/gas-copy-gdocs-paragraph-style.git name_of_the_new_destination_directory
```

Then you just need to install the Node.js modules.

```bash
npm install
```

Finally to build run:

```bash
npm run build
```

There are other three NPM scripts configured in `package.json`.

* `upload` - to upload the `dist` directory content to your GAS project on the server.

* `deploy` - to build and upload in a single step.

* `deploy:prod` - same as `deploy` but with Webpack `mode` property set to `'production'`.

#### Troubleshoting

If you get an error like the one described in this issue https://github.com/webpack-contrib/eslint-loader/issues/306 you can find a temporary solution at the end of the issue report.

The first line of the error looks like:

```bash
ERROR in ./src/index.js
Module build failed (from ./node_modules/eslint-loader/dist/cjs.js):
TypeError: Cannot read property '0' of undefined
```


