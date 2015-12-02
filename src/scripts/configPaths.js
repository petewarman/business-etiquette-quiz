// Library paths
// If you want to use a new library, add it here.
require.config({
  paths: {
    'main': 'main',
    'app': 'app',
    'eventBus': 'eventBus',
    'baseModel': 'baseModel',
    'baseView': './views/baseView',
    'appView': './views/appView',
    'questionsCollection': 'questionsCollection',
    'questionModel': 'questionModel',
    'resultsCollection': 'resultsCollection',
    'resultModel': 'resultModel',
    'thumbView': './views/thumbView',
    'detailView': './views/detailView',
    'resultsView': './views/resultsView',
    'introView': './views/introView',
    'hbs': '../vendor/require-handlebars-plugin/hbs',
    'handlebars': "../vendor/require-handlebars-plugin/hbs/handlebars.runtime",
    'utils': 'utils'
  },
  hbs: { // optional
      'helpers': true,            // default: true
      'templateExtension': 'hbs', // default: 'hbs'
      'partialsUrl': '',           // default: ''
      'handlebarsPath': 'handlebars'
  },
  stubModules: ['hbs', 'hbs/underscore', 'hbs/json2', 'hbs/handlebars'],
});

