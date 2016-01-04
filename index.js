/**
 * A generic block-processing webpack loader, for finding data blocks delimited by
 * any user-specified opening and closing string.
 */
module.exports = function(options) {
  var op = options.op;
  var ed = options.ed;
  var process = options.process || function(){};

  /**
   * Is there going to be anything to convert here?
   */
  function hasBlocks(input) {
    return input.indexOf(op) !== -1 && input.indexOf(ed) !== -1;
  }

  /**
   * Pull out blocks and hand them over to the options-specified processor
   */
  function processData(source) {
    // we can't do this with regexp, unfortunately.
    var from = 0, curr, term;
    var newsource = "", blockContent;
    for(curr = source.indexOf(op, from); curr !== -1; from = term + ed.length, curr = source.indexOf(op, from)) {
      newsource += source.substring(from, curr);
      term = source.indexOf(ed, from);
      if(term === -1) {
        // that's a problem...
        throw new Error("Block opened by "+op+" found without matching ending "+ed);
      }
      newsource += process(source.substring(curr, term + ed.length));
    }
    return newsource + source.substring(from);
  };

  /**
   *
   **/
  return function(source) {
    if (options.cacheable !== false) {
      this.cacheable();
    }
    if (!hasBlocks(source)) return source;
    if (options.preprocessors) {
      options.preprocessors.forEach(function(process) {
        source = process(source);
      });
    }
    return processData(source);
  };
};
