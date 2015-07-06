"use strict";
describe("Tutorial", function() {
    it("should be created with name and capacity", function() {
        // spyOn(Tutorials, "insert");
        spyOn(Tutorials, "insert").and.callFake(function(doc, callback) {
            // simulate async return of id = "1";
            callback(null, "1");
        });

        var tutorial = new Tutorial(null, "Tutorial 1", 20);

        expect(tutorial.name).toBe("Tutorial 1");
        expect(tutorial.capacity).toBe(20);

        tutorial.save();

        // id should be defined
        expect(tutorial.id).toEqual("1");
        expect(Tutorials.insert).toHaveBeenCalledWith({
            name: "Tutorial 1",
            capacity: 20,
            owner: null
        }, jasmine.any(Function));
    });
    it("should not be possible to delete tutorial with active registrations", function() {
        spyOn(Roles, "userIsInRole").and.returnValue(true);
        spyOn(Tutorials, "remove");
        spyOn(TutorialRegistrations, "find").and.returnValue({
            count: function() {
                return 2
            }
        });
        try {
            Meteor.methodMap.removeTutorial("1");
        } catch (ex) {
            expect(ex).toBeDefined();
        }

        expect(Meteor.methodMap.removeTutorial).toThrow();
        expect(TutorialRegistrations.find).toHaveBeenCalledWith({
            tutorialId: "1"
        });
        expect(Tutorials.remove).not.toHaveBeenCalled();
    });
    it("Should not save when name is not defined", function() {
        var model = new Tutorial(null, "", 10);
        expect(function() {
            model.save();
        }).toThrow();
    });

    it("Should not save when capacity is not defined", function() {
        var model = new Tutorial(null, "Name", 0);
        expect(function() {
            model.save();
        }).toThrow();
    });
    it("should allow students to register for the tutorial", function() {
        var model = new Tutorial("1", "Name", 10, 5, "12344");
        var studentId = "2";
        spyOn(TutorialRegistrations, "find").and.returnValue({count:function(){
            return 0;
          }
          });
        spyOn(TutorialRegistrations, "insert").and.callFake(function(doc, callback) {
            // simulate async return of id = "1";
            callback(null, "1");
        });
        expect(model.currentCapacity).toBe(5);
        // console.log(model);
        model.registerStudent(studentId);
        expect(TutorialRegistrations.insert).toHaveBeenCalled();
        expect(TutorialRegistrations.insert.calls.mostRecent().args[0]).toEqual({
            tutorialId: '1',
            studentId: '2'
        });
        // console.log(model.currentCapacity);
        expect(model.currentCapacity).toBe(6);
    });
    it("should not be possible to register while at maximum capacity", function() {
        var tutorial = new Tutorial(1, "Name", 5, 5);

        expect(function() {
            tutorial.registerStudent(1);
        }).toThrow("Capacity of the tutorial has been reached!");
    });

    it("should not be possible to register if registration is present", function() {
        spyOn(TutorialRegistrations, "find").and.returnValue({count:function(){
            return 1;
          }
          });

        var tutorial = new Tutorial(1, "Name", 5, 4);
        expect(function() {
            tutorial.registerStudent(1);
        }).toThrow("Student already registered!");
    });


    it("should not be possible to de-register if registration not present", function() {
        spyOn(TutorialRegistrations, "findOne").and.returnValue(null);
        var tutorial = new Tutorial(1, "Name", 5, 4);
        expect(function() {
            tutorial.removeRegistration(1);
        }).toThrow("Student not registered!");
    });

    it("should be possible to de-register if registration exists", function() {
        spyOn(TutorialRegistrations, "findOne").and.returnValue({});
        var tutorial = new Tutorial("1", "Name", 5, 4);

        spyOn(TutorialRegistrations, "remove");
        spyOn(Tutorials, "update");

        tutorial.removeRegistration("2");

        expect(TutorialRegistrations.remove).toHaveBeenCalledWith({
            tutorialId: "1",
            userId: "2"
        });
        expect(Tutorials.update).toHaveBeenCalledWith({
            _id: "1"
        }, {
            $inc: {
                currentCapacity: -1
            }
        });
    });
});
