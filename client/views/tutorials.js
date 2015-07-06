Template.tutorials.helpers({
  tutorials:function(){
      return Tutorials.find({}, {sort: {name: 1}});
  }
});
