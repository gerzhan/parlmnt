define([
  'sandbox'
],

  function (sandbox) {

    var SummaryView = sandbox.mvc.View({

      initialize: function () {
        this._title = '';
        this._summary = '';
      },

      render: function () {
        var that = this,
          params;

        params = {title: this._title, summary: this._summary};

        sandbox.template.render('summary/templates/summary', params, function (o) {
          that.$el.html(o);
          that._trimSummaryIfBlank();
          //that.startLoader();
        });


        return this;
      },

      setTitleFromSummary: function(summaryObject, objectName) {
        var visible = summaryObject.total - summaryObject.hidden,
          desc = visible > 0 ? objectName.pluralize() : objectName,
          result = {};

        result.title = 'Showing {n} {desc}'.assign({n: visible, desc: desc});
        result.summary = summaryObject.hidden > 0 ? '{h} hidden.'.assign({h: summaryObject.hidden}) : '';

        this.setTitledSummary(result);
      },

      setTitledSummary: function (summaryObject) {
        this.setTitle(summaryObject.title);
        this.setSummary(summaryObject.summary);

        return this.render();
      },

      setTitle: function(title) {
        this._title = title;
      },

      setSummary: function(summary) {
        this._summary = summary;
      },

      startLoader: function() {
        this._getLoader().fadeIn();
      },

      stopLoader: function() {
        this._getLoader().fadeOut();
      },

      //// PRIVATE ////

      _trimSummaryIfBlank: function() {
        if (this._summary) {
          this.$el.find('small').show();
        } else {
          this.$el.find('small').hide();
        }
      },

      _getLoader: function() {
        return this.$el.find('div.loader');
      }



    });


    return SummaryView;

  });