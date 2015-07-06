describe("Tutorials template", function() {
    it("should show a list of tutorials when there are some available", function () {
        var div = document.createElement("DIV");
        var data = {tutorials: [{}, {}]};
        data.tutorials.count = function() { return 2; }

        var comp = Blaze.renderWithData(Template.tutorials, data, div);

        // Blaze.insert(comp, div);

        expect($(div).find(".tutorialLine").length).toEqual(2);
    });
    it("should show a warning when no tutorials are available", function () {
        var div = document.createElement("DIV");
        var comp = Blaze.renderWithData(Template.tutorials, {tutorials: {count: function() { return 0; }}} , div);
        expect($(div).find("#noTutorialsWarning")[0]).toBeDefined();
    });
    it ("should sort tutorials by name", function() {
        // var route = _.findWhere(Router.routes, {name: "tutorials"});
        var route  = Router.routes.tutorials;
        spyOn(Tutorials, "find").and.returnValue({});

        // call the function "data()"
        var data = route.options.data();

        expect(Tutorials.find).toHaveBeenCalled();
        expect(Tutorials.find.calls.mostRecent().args[0]).toEqual({});
        expect(Tutorials.find.calls.mostRecent().args[1].sort.name).toEqual(1);
        expect(data).toEqual({tutorials: {}});
    });
});
