/**
 * Created by robinengbersen on 19.04.15.
 */

// Declare app level module which depends on views, and components
var app = angular.module('myApp', ['ui.router', 'ui.bootstrap', 'pascalprecht.translate']);

app.config(['$stateProvider', '$urlRouterProvider', '$translateProvider', function($stateProvider, $urlRouterProvider, $translateProvider) {
    $translateProvider.useStaticFilesLoader({
        prefix: '/build/',
        suffix: '.json'
    });
    $translateProvider.preferredLanguage('de');

    $stateProvider
        .state('login', {
          url: "/login",
          templateUrl: "login.html",
          controller: "LoginCtrl"
        })
        .state('sign', {
            url: "/sign",
            templateUrl: "sign.html",
            controller: "SignCtrl"
        });

    $urlRouterProvider.otherwise('/login');
}]);

app.controller('LoginCtrl',function($scope, $state) {

    $scope.submit = function() {
        $state.go('sign');
    };
});

app.controller('SignCtrl',function($scope) {

    $scope.tabs = [
        { title:'Dynamic Title 1', content:'Dynamic content 1' },
        { title:'Dynamic Title 2', content:'Dynamic content 2', disabled: true }
    ];

});
