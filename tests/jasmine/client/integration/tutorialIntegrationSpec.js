"use strict";
describe("Tutorial", function () {
    it("should be created by admins", function (done) {
        // login to system and wait for callback
        Meteor.loginWithPassword("admin@tutorials.com", "admin3210", function(err) {
            // check if we have correctly logged in the system
            expect(err).toBeUndefined();
 
            // create a new tutorial
            var tut = new Tutorial(null,"sample",10);
 
            // save the tutorial and use callback function to check for existence
            var id = tut.save(function(error, result) {
                expect(error).toBeUndefined();
 
                // delete created tutorial
                Tutorials.remove(id);
 
                Meteor.logout(function() {
                    done();
                })
            });
        });
    });
    it("should not be created by non admins", function (done) {
        // login to system and wait for callback
        Meteor.loginWithPassword("normal@tutorials.com", "normal3210", function(err) {
            // check if we have correctly logged in the system
            expect(err).toBeUndefined();
 
            // create a new tutorial
            var tut = new Tutorial(null,"sample",10);
 
            // save the tutorial and use callback function to check for existence
            var id = tut.save(function(error, result) {
                expect(error.error).toBe(403);
 
                Meteor.logout(function() {
                    done();
                })
            });
        });
    });
});