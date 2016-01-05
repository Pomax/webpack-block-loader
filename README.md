# block-loader

A webpack loader for doing generic block-processing. You provide the delimiters and processor, block-loader will find your data and pass it through your processor.

## Install
```
npm install block-loader
```

## Write your own block loader
```
var blockLoader = require('block-loader');
var options = {
  start: '...',
  end: '...',
  preprocessors: [
    function(content) { ...; return content; },
    ...
  ],
  process: function(content) {
   ...
    return content;
  }
};
module.exports = blockLoader(options);
```

`start` and `end` are delimiter strings for you data block, `preprocessors` is optional and takes an array of `function(content)`.

## Example: write real code in "pre" elements

Say you need to write real programming code in `<pre>` elements, and you want to just write code, not hand-craft every html entity for less than or ampersand symbols just so your Webpack/React build won't bread on them.

Let's just write a quick and easy loader that'll fix those things for us:

```
var blockLoader = require("./block-loader");
var options = {
  start: "<pre>",
  end: "</pre>",
  process: function fixPreBlocks(pre) {
    var replaced = pre

    .replace(options.start,'')   // first, remove the start/end delimiters, then:
    .replace(options.end,'')     //
    .replace(/&/g,'&amp;')       // 1. use html entity equivalent,
    .replace(/</g,'&lt;')        // 2. use html entity equivalent,
    .replace(/>/g,'&gt;')        // 3. use html entity equivalent,
    .replace(/([{}])/g,"{'$1'}") // 4. JSX-safify curly braces,
    .replace(/\n/g,"{'\\n'}");   // 5. and preserve line endings, thanks.

    // done! return with the delimiters put back in place
    return options.start + replaced + options.end
  }
};
module.exports = blockLoader(options);
```

And done. Save this as something like `./lib/pre-loader.js` and then we can use this with webpack by adding it to `webpack.config.js`:
```
module.exports = {
  entry:  ...,
  output: ...,
  module: {
    loaders: [
      {
        test: /.jsx?$/,
        loaders: [
          'babel-loader',
          __dirname + '/lib/pre-loader'
        ]
      }
    ]
  },
};

```
Remember that webpack loaders run LIFO, so the ones that need to kick in first need to be declared last in the array of loaders.
