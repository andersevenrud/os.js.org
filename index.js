const _fs = require('node-fs-extra');
const _path = require('path');

const Metalsmith = require('metalsmith');
const layouts = require('metalsmith-layouts');
const markdown = require('metalsmith-markdown');
const permalinks = require('metalsmith-permalinks');
const less = require('metalsmith-less')
const ignore = require('metalsmith-ignore');
const watch = require('metalsmith-watch');
const metalsmithPrism = require('metalsmith-prism');
const sitemap = require('metalsmith-sitemap');

const handlebars = require('handlebars');
handlebars.registerHelper('startsWith', function(prefix, str, options) {
  if ( str.substr(0, prefix.length) === prefix ) {
    return options.fn(this);
  }
  return options.inverse(this);
});
handlebars.registerHelper('pathClass', function(str) {
  return str.replace(/[^A-z0-9]/g, '_');
});

var i = Metalsmith(__dirname)
  .metadata({
    sitename: "OS.js",
    siteurl: "https://os.js.org/",
    description: "OS.js"
  })
  .source('./src')
  .destination('./build')
  .clean(true)
  .use(less())
  .use(markdown({langPrefix: 'language-'}))
  .use(metalsmithPrism())
  .use(permalinks({
    relative: false
  }))
  .use(ignore([
    'less/**',
    'less/.*'
  ]))
  .use(layouts({
    engine: 'handlebars'
  }))
  .use(sitemap({
    hostname: "https://www.os-js.org",
    omitIndex: true
  }));

if ( process.argv[2] === '--watch' ) {
  i.use(watch({
    paths: {
      "${source}/**/*": true,
      "layouts/**/*": "**/*"
    },
    livereload: true,
  }));
}

i.build(function(err) {
  if (err) throw err;
});

