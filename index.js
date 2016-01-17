/**
 * A generic block-processing webpack loader, for finding data blocks delimited by
 * any user-specified opening and closing string.
 */
module.exports = function(options) {
  var start = options.start;
  var end = options.end;
  var process = options.process || function(){};

  /**
   * Is there going to be anything to convert here?
   */
  function hasBlocks(input) {
    return input.indexOf(start) !== -1 && input.indexOf(end) !== -1;
  }

  /**
   * Pull out blocks and hand them over to the options-specified processor
   */
  function processData(source) {
    // we can't do this with regexp, unfortunately.
    var from = 0, curr, term;
    var newsource = "", blockContent;
    for(curr = source.indexOf(start, from); curr !== -1; from = term + end.length, curr = source.indexOf(start, from)) {
      newsource += source.substring(from, curr);
      term = source.indexOf(end, from);
      if(term === -1) {
        // that's a problem...
        throw new Error("Block opened by "+start+" found without matching ending "+end);
      }
      newsource += process(source.substring(curr, term + end.length));
    }
    return newsource + source.substring(from);
  };

  /**
   *
   **/
  return function(source) {
    if (options.cacheable !== false) {
      if (this.cacheable) {
        this.cacheable();
      }
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
