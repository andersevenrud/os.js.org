const Metalsmith = require('metalsmith');
const layouts = require('metalsmith-layouts');
const markdown = require('metalsmith-markdown');
const permalinks = require('metalsmith-permalinks');
const less = require('metalsmith-less')
const ignore = require('metalsmith-ignore');
const watch = require('metalsmith-watch');
const metalsmithPrism = require('metalsmith-prism');

var i = Metalsmith(__dirname)
  .metadata({
    sitename: "OS.js",
    siteurl: "https://os.js.org/",
    description: "OS.js",
    generatorname: "Metalsmith",
    generatorurl: "http://metalsmith.io/"
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
