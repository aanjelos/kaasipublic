module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("img");
  eleventyConfig.addPassthroughCopy("blog/img");
  eleventyConfig.addPassthroughCopy("style.css");
  eleventyConfig.addPassthroughCopy("script.js");
  eleventyConfig.addPassthroughCopy("CNAME");
  
  eleventyConfig.addFilter("dateFilter", function(date) {
    if (!date) return "";
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  });

  return {
    dir: {
      input: ".",
      includes: "_includes",
      output: "_site"
    }
  };
};
