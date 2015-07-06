// Tutorials = new Meteor.Collection("tutorials");
Tutorials = new Mongo.Collection("tutorials", {
  transform: function(doc) {
    return new Tutorial(doc._id, doc.name, doc.capacity, doc.currentCapacity, doc.owner);
  }
});

Tutorials.allow({
  insert: function(userId, doc) {
    // the user must be logged in, and the document must be owned by the user
    return (userId && doc.owner === Meteor.userId() && Roles.userIsInRole(userId, "admin"));
  },
  remove: function(userId, doc) {
    // the user must be logged in, and the document must be owned by the user
    return (userId && doc.owner === Meteor.userId() && Roles.userIsInRole(userId, "admin"));
  }
});

Tutorial = function(id, name, capacity, currentCapacity, owner) {
  this._id = id;
  this._name = name;
  this._capacity = capacity;
  this._owner = owner;
  this._currentCapacity = currentCapacity;
};
if (Meteor.isServer) {
  Meteor.methods({
    removeTutorial: function(id) {
      if (!Meteor.user() || !Roles.userIsInRole(Meteor.user(), "admin")) {
        throw new Meteor.Error(403, "Access Denied");
      }
      if (TutorialRegistrations.find({
          tutorialId: id
        }).count() > 0) {
        throw new Meteor.Error(406, "Tutorial has registrations");
      }
      Tutorials.remove(id);
    }
  });
}
Tutorial.prototype = {
  constructor: Tutorial,
  get id() {
    // readonly
    return this._id;
  },
  get owner() {
    // readonly
    return this._owner;
  },
  get name() {
    return this._name;
  },
  set name(value) {
    this._name = value;
  },
  get capacity() {
    return this._capacity;
  },
  set capacity(value) {
    this._capacity = value;
  },
  get currentCapacity() {
    return this._currentCapacity;
  },
  set currentCapacity(value) {
    this._currentCapacity = value;
  },
  save: function(callback) {
    var that = this;
    var doc = {
      name: this.name,
      capacity: this.capacity,
      owner: Meteor.userId()
    };
    if (!this.name) {
      throw new Meteor.Error("Name is not defined!")
    }

    if (!this.capacity) {
      throw new Meteor.Error("Capacity has to be defined or bigger than zero!")
    }
    Tutorials.insert(doc, function(error, result) {
      that._id = result;
      if (typeof callback === "function")
        callback(error, result);
    });
  },
  registerStudent: function(studentId) {
    if (this.currentCapacity >= this.capacity) {
      throw "Capacity of the tutorial has been reached!";
    }
    var that = this;
    // console.log("count",TutorialRegistrations);
    if (TutorialRegistrations.find({
        studentId: studentId
      }).count() !== 0) {
      throw "Student already registered!";
    }
    TutorialRegistrations.insert({
      tutorialId: that._id,
      studentId: studentId
    }, function(err, id) {
      // console.log("that1");
      if (!err) {
        that._currentCapacity += 1;
        // console.log("that2",that);
      } else {
        // console.log("that3",that);
        console.log(err);
      }
    });
    // console.log("count1",TutorialRegistrations.find().count());
    // console.log("that4",that);
  },
  removeRegistration: function(studentId) {
    var tutorialRegistration = TutorialRegistrations.findOne({
      tutorialId: this.id,
      userId: studentId
    });

    if (tutorialRegistration == null) {
      throw "Student not registered!";
    }

    TutorialRegistrations.remove({
      tutorialId: this.id,
      userId: studentId
    });
    Tutorials.update({
      _id: this.id
    }, {
      $inc: {
        currentCapacity: -1
      }
    });
  }
};
