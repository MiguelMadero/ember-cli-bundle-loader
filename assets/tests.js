define('dummy/tests/acceptance/a-resolver-test', ['exports', 'dummy/tests/helpers/skip-if-phantom', 'dummy/tests/helpers/module-for-acceptance'], function (exports, _dummyTestsHelpersSkipIfPhantom, _dummyTestsHelpersModuleForAcceptance) {

  (0, _dummyTestsHelpersModuleForAcceptance['default'])('Acceptance | resolver');

  (0, _dummyTestsHelpersSkipIfPhantom['default'])('Can resolve routes from the boot app and packages', function (assert) {
    var _this = this;

    assert.ok(this.application.__container__.lookup('route:application') instanceof require('dummy/routes/application')['default'], 'assert.ok(this.application.__container__.lookup(\'route:application\') instanceof\n  require(\'dummy/routes/application\').default)');

    assert.notOk(this.application.__container__.lookup('route:package1'), 'assert.notOk(\n  this.application.__container__.lookup(\'route:package1\'))');
    visit('package1');
    andThen(function () {
      var package1 = _this.application.__container__.lookup('route:package1');
      var requiredPackage1 = require('package1/routes/package1')['default'];
      assert.ok(package1 instanceof requiredPackage1, 'assert.ok(package1 instanceof requiredPackage1)');
    });
    return visit('/'); // reset this so refreshing the browser starts at the root
  });
});
// NOTE: this file was renamed to a-resolver-test to make sure it’s loaded before other acceptance test.
// This is unfortunate an unnecessary likely it’s the symptom of a larger issue

/* global require */
define('dummy/tests/acceptance/loading-substate-test', ['exports', 'ember-qunit', 'dummy/tests/helpers/module-for-acceptance', 'dummy/components/loading-for-test'], function (exports, _emberQunit, _dummyTestsHelpersModuleForAcceptance, _dummyComponentsLoadingForTest) {

  (0, _dummyTestsHelpersModuleForAcceptance['default'])('Acceptance | loading-substate');

  (0, _emberQunit.test)('loading-substate renders while beforeModel promise resolves', function (assert) {
    visit('/');
    visit('slow');
    andThen(function () {
      assert.ok(_dummyComponentsLoadingForTest.StateForTest.hasRendered, 'assert.ok(StateForTest.hasRendered)');
      assert.equal(1, find('.slow').length, 'assert.equal(1, find(\'.slow\').length)');
    });
    return visit('/'); // reset this so refreshing the browser starts at the root
  });
});
define('dummy/tests/acceptance/query-params-test', ['exports', 'dummy/tests/helpers/skip-if-phantom', 'dummy/tests/helpers/module-for-acceptance'], function (exports, _dummyTestsHelpersSkipIfPhantom, _dummyTestsHelpersModuleForAcceptance) {

  (0, _dummyTestsHelpersModuleForAcceptance['default'])('Acceptance | query-params');

  (0, _dummyTestsHelpersSkipIfPhantom['default'])('Query params are not stored in cache for bundles that are not yet loaded', function (assert) {
    visit('/');
    visit('link-target');
    visit('link-target');
    visit('link-source');
    visit('link-target');
    visit('link-source');
    andThen(function () {
      return assert.equal(find('.link-source a').attr('href'), '/link-target?page=2&sort=DESC', 'assert.equal(find(\'.link-source a\').attr(\'href\'), \'/link-target?page=2&sort=DESC\')');
    });
    return visit('/'); // reset this so refreshing the browser starts at the root
  });
});
define('dummy/tests/ember-sinon-qunit/test', ['exports', 'ember', 'sinon', 'qunit', 'ember-qunit'], function (exports, _ember, _sinon, _qunit, _emberQunit) {
  exports['default'] = test;

  _sinon['default'].expectation.fail = _sinon['default'].assert.fail = function (msg) {
    _qunit['default'].ok(false, msg);
  };

  _sinon['default'].assert.pass = function (assertion) {
    _qunit['default'].ok(true, assertion);
  };

  _sinon['default'].config = {
    injectIntoThis: false,
    injectInto: null,
    properties: ['spy', 'stub', 'mock', 'sandbox'],
    useFakeTimers: false,
    useFakeServer: false
  };

  function test(testName, callback) {
    function sinonWrapper() {
      var context = this;
      if (_ember['default'].isBlank(context)) {
        context = {};
      }
      _sinon['default'].config.injectInto = context;

      return _sinon['default'].test(callback).apply(context, arguments);
    }

    return (0, _emberQunit.test)(testName, sinonWrapper);
  }
});
define('dummy/tests/helpers/destroy-app', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = destroyApp;

  function destroyApp(application) {
    _ember['default'].run(application, 'destroy');
  }
});
define('dummy/tests/helpers/module-for-acceptance', ['exports', 'qunit', 'dummy/tests/helpers/start-app', 'dummy/tests/helpers/destroy-app'], function (exports, _qunit, _dummyTestsHelpersStartApp, _dummyTestsHelpersDestroyApp) {
  exports['default'] = function (name) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    (0, _qunit.module)(name, {
      beforeEach: function beforeEach() {
        this.application = (0, _dummyTestsHelpersStartApp['default'])();

        if (options.beforeEach) {
          options.beforeEach.apply(this, arguments);
        }
      },

      afterEach: function afterEach() {
        if (options.afterEach) {
          options.afterEach.apply(this, arguments);
        }

        (0, _dummyTestsHelpersDestroyApp['default'])(this.application);
      }
    });
  };
});
define('dummy/tests/helpers/resolver', ['exports', 'dummy/resolver', 'dummy/config/environment'], function (exports, _dummyResolver, _dummyConfigEnvironment) {

  var resolver = _dummyResolver['default'].create();

  resolver.namespace = {
    modulePrefix: _dummyConfigEnvironment['default'].modulePrefix,
    podModulePrefix: _dummyConfigEnvironment['default'].podModulePrefix
  };

  exports['default'] = resolver;
});
define('dummy/tests/helpers/skip-if-phantom', ['exports', 'qunit'], function (exports, _qunit) {

  var isPhantom = !!window._phantom;
  exports['default'] = isPhantom ? _qunit.skip : _qunit.test;
});
define('dummy/tests/helpers/start-app', ['exports', 'ember', 'dummy/app', 'dummy/config/environment'], function (exports, _ember, _dummyApp, _dummyConfigEnvironment) {
  exports['default'] = startApp;

  function startApp(attrs) {
    var application = undefined;

    var attributes = _ember['default'].merge({}, _dummyConfigEnvironment['default'].APP);
    attributes = _ember['default'].merge(attributes, attrs); // use defaults, but you can override;

    _ember['default'].run(function () {
      application = _dummyApp['default'].create(attributes);
      application.setupForTesting();
      application.injectTestHelpers();
    });

    return application;
  }
});
define('dummy/tests/integration/components/my-component-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('my-component', 'Integration | Component | my component', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template((function () {
      return {
        meta: {
          'revision': 'Ember@1.13.13',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 1,
              'column': 16
            }
          }
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['content', 'my-component', ['loc', [null, [1, 0], [1, 16]]]]],
        locals: [],
        templates: []
      };
    })()));

    assert.equal(this.$().text().trim(), '', 'assert.equal(this.$().text().trim(), \'\')');

    // Template block usage:
    this.render(Ember.HTMLBars.template((function () {
      var child0 = (function () {
        return {
          meta: {
            'revision': 'Ember@1.13.13',
            'loc': {
              'source': null,
              'start': {
                'line': 2,
                'column': 4
              },
              'end': {
                'line': 4,
                'column': 4
              }
            }
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode('      template block text\n');
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() {
            return [];
          },
          statements: [],
          locals: [],
          templates: []
        };
      })();

      return {
        meta: {
          'revision': 'Ember@1.13.13',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 5,
              'column': 2
            }
          }
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode('\n');
          dom.appendChild(el0, el1);
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode('  ');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          return morphs;
        },
        statements: [['block', 'my-component', [], [], 0, null, ['loc', [null, [2, 4], [4, 21]]]]],
        locals: [],
        templates: [child0]
      };
    })()));

    assert.equal(this.$().text().trim(), 'template block text', 'assert.equal(this.$().text().trim(), \'template block text\')');
  });
});
define('dummy/tests/test-helper', ['exports', 'dummy/tests/helpers/resolver', 'ember-qunit'], function (exports, _dummyTestsHelpersResolver, _emberQunit) {

  (0, _emberQunit.setResolver)(_dummyTestsHelpersResolver['default']);
});
define('dummy/tests/unit/services/lazy-loader-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('service:lazy-loader', 'Unit | Service | lazy loader');

  (0, _emberQunit.test)('gets the bundle for a particular URL basedon the configuration', function (assert) {
    var service = this.subject();
    var actualBundle = service.getBundleForUrl('/package2');

    assert.ok(actualBundle, 'assert.ok(actualBundle)');
    assert.equal(actualBundle.name, 'package2', 'assert.equal(actualBundle.name, \'package2\')');
    assert.deepEqual(actualBundle.packages, ['package2'], 'assert.deepEqual(actualBundle.packages, [\'package2\'])');
  });

  (0, _emberQunit.test)('loadBundleForUrl evaluates the loaded code for external packages', function (assert) {
    var service = this.subject();
    assert.notOk(service.isBundleLoaded('package2'), 'assert.notOk(service.isBundleLoaded(\'package2\'))');
    // Normally this would be a separate test, but we don't have an easy way to "unload" code in the browser
    assert.notOk(require._eak_seen['package2/routes/package2'], 'assert.notOk(\n  require._eak_seen[\'package2/routes/package2\'])');

    return service.loadBundleForUrl('/package2').then(function () {
      assert.ok(service.isBundleLoaded('package2'), 'assert.ok(service.isBundleLoaded(\'package2\'))');
      assert.ok(require._eak_seen['package2/routes/package2'], 'assert.ok(require._eak_seen[\'package2/routes/package2\'])');

      // normally this would be a separate test, but we can't onload JS
      // loadBundleForUrl doesn't do a second request.
      return service.loadBundleForUrl('/package2').then(function () {
        // TODO: assert there was a single request
      });
    });
  });

  (0, _emberQunit.test)('_loadAssets throws if the bundle.urls dont have any of the valid extensions', function (assert) {
    return this.subject()._loadAssets({ name: 'my-bundle', urls: ['invalidextensions.exe'] }).then(function () {
      assert.ok(false, 'promise should not be fulfilled');
    })['catch'](function (error) {
      assert.ok(error.match(/for bundle my-bundle/), 'assert.ok(error.match(/for bundle my-bundle/))');
    });
  });
});
/* global require */
/* jshint ignore:start */

require('dummy/tests/test-helper');
EmberENV.TESTS_FILE_LOADED = true;

/* jshint ignore:end */
//# sourceMappingURL=tests.map