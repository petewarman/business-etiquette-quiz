// Library paths
// If you want to use a new library, add it here.
require.config({
  shim: {
    underscore: {
      exports: '_'
    }
  },
  paths: {
    'jquery': '../vendor/jquery/dist/jquery',
    'underscore': '../vendor/underscore/underscore',
    'main': 'main',
    'app': 'app',
    'eventBus': 'eventBus',
    'appView': './views/appView',
    'questionsCollection': 'questionsCollection',
    'questionModel': 'questionModel',
    'thumbView': './views/thumbView',
    'detailView': './views/detailView',
    'hbs': '../vendor/require-handlebars-plugin/hbs',
    'utils': 'utils'
  },
  hbs: { // optional
      'helpers': true,            // default: true
      'templateExtension': 'hbs', // default: 'hbs'
      'partialsUrl': ''           // default: ''
  }
});

