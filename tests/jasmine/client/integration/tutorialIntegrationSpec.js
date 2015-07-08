"use strict";
describe("Tutorial", function() {
  it("should be created by admins", function(done) {
    // login to system and wait for callback
    Meteor.loginWithPassword("admin@tutorials.com", "admin3210", function(err) {
      // check if we have correctly logged in the system
      expect(err).toBeUndefined();

      // create a new tutorial
      var tut = new Tutorial(null, "sample", 10);

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
  it("should not be created by non admins", function(done) {
    // login to system and wait for callback
    Meteor.loginWithPassword("normal@tutorials.com", "normal3210", function(err) {
      // check if we have correctly logged in the system
      expect(err).toBeUndefined();

      // create a new tutorial
      var tut = new Tutorial(null, "sample", 10);

      // save the tutorial and use callback function to check for existence
      var id = tut.save(function(error, result) {
        expect(error.error).toBe(403);

        Meteor.logout(function() {
          done();
        })
      });
    });
  });
  it("function canDelete should return true only when tutorial has no registrations", function() {
    expect(Template.tutorials.__helpers[" " + "canDelete"].call({
      currentCapacity: 0
    })).toBe(true);
  });

  it("function canDelete should return false when there are registrations", function() {
    expect(Template.tutorials.__helpers[" " + "canDelete"].call({
      currentCapacity: 1
    })).toBeFalsy();
  });
  it("function canRegister should return true when capacity is available and student is not yet registered", function() {
    // stub values called with accessor "this.currentCapacity"
    spyOn(TutorialRegistrations, "find").and.returnValue({
      count: function() {
        return 0;
      }
    });
    expect(Template.tutorials.__helpers[" " + "canRegister"].call({
      currentCapacity: 1,
      capacity: 2
    })).toBeTruthy();
  });

  it("function canRegister should return false when reached capacity is available and student is not yet registered", function() {
    expect(Template.tutorials.__helpers[" " + "canRegister"].call({
      currentCapacity: 2,
      capacity: 2
    })).toBeFalsy();

    spyOn(TutorialRegistrations, "find").and.returnValue({
      count: function() {
        return 1;
      }
    });
    expect(Template.tutorials.__helpers[" " + "canRegister"].call({
      currentCapacity: 1,
      capacity: 2
    })).toBeFalsy();
  });
});
