Template.tutorials.helpers({
  // tutorials:function(){
  //     return Tutorials.find({}, {sort: {name: 1}});
  // }
  canDelete: function() {
        return this.currentCapacity == 0;
    },
  canRegister:function(){
    return (this.currentCapacity < this.capacity && TutorialRegistrations.find({tutorialId: this._id}).count() == 0);
  }
});
