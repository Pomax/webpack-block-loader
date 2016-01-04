# webpack-block-loader

A webpack loader for doing generic block-processing.

You provide the delimiters and processor, block-loader will find your data and pass it through your processor.

## Install
```
npm install block-loader
```

## Write your own block loader
```
var blockLoader = require('block-loader');
var options = {
  op: "<pre>",
  ed: "</pre>",
  preprocessors: []
  process: function(content) {
    return content;
  }
};
module.exports = blockLoader(options);
```

`op` and `ed` are delimiter strings for you data block, `preprocessors` is optional and takes an array of `function(content)`.
