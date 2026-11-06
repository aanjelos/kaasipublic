const md=require('markdown-it')({html:true});
module.exports=content=>md.render(/^\s*<(?:p|div|section|article)\b/i.test(content)?content.replace(/^ {4,}/gm,''):content);
