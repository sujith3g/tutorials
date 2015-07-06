Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    notFoundTemplate: 'template404',
    waitOn: function() {
        //return Meteor.subscribe('practicals');
    }
});

Router.map(function() {
    this.route('introduction', {
        path: '/'
    });
});

Router.map(function() {
    this.route('tutorials', {
        path: '/tutorials',
        waitOn: function() {
            return [Meteor.subscribe('tutorials'), Meteor.subscribe('registrations')];
        },
        data:function(){
          return {tutorials: Tutorials.find({}, {sort: {name: 1}}) };
        }
    });
});

Router.map(function() {
    this.route('admin', {
        path: '/admin',
        waitOn: function() {
            return Meteor.subscribe('tutorials');
        }
    });
});

Router.onBeforeAction('loading');
var requireLogin = function() {
    if (!Meteor.userId()) {
        if (Meteor.loggingIn()) {
            this.render(this.loadingTemplate);
        }
        else {
            this.render('introduction');
        }
        //pause();

    }
    this.next();
}

var requireAdmin = function() {
    if (!Meteor.user() && Roles.userIsInRole(Meteor.userId(), ['admin'])) {
        if (Meteor.loggingIn()){
            this.render(this.loadingTemplate);
        }
        else {
            this.render('introduction');
        }
        //pause();

    }
    this.next();
}

// add hooks
if (Meteor.isClient) {
    Router.onBeforeAction(requireLogin, {only: ['tutorials']});
    // Router.onBeforeAction(Security.requireTutor, {only: 'tutorPracticals'});
    Router.onBeforeAction(requireAdmin, {only: ['createPractical']});
}
