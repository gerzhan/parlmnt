define([
  'sandbox',

  'widgets/navbar/main',
  'widgets/sidebar/main',
  'widgets/bill/main',
  'widgets/summary/main',
  'widgets/session/main',
  'widgets/votable/main',
  'widgets/commentable/main'


], function (sandbox, navbarWidget, sidebarWidget, billWidget, summaryWidget, sessionWidget, votableWidget, commentableWidget)  {


  return function() {
    var bills, sidebar, summary, session;

    //session manager
    sandbox.session = sessionWidget();

    //start app widgets
    navbarWidget({
      el: '#navbar',
      sessionEl: '#session'
    });

    //filter side bar
    sidebar = sidebarWidget({
      "el": '#sidebar',
      "channel": 'billFilterBar',
      "choices": {
        "Year": {
          "type":  'pick',
          "section":  'year',
          "default": '2013',
          "items": {
            "2013": {
              "tip": 'Acts in 2013'
            },
            "2012": {
              "tip": 'Acts in 2012'
            },
            "2011": {
              "tip": 'Acts in 2011'
            },
            "2010": {
              "tip": 'Acts in 2010'
            }
          }
        },

        "Sort by": {
          "type": 'pick',
          "section": 'sort',
          "default": 'name',
          "items": {
            "name": {
              "icon": '/images/name.png',
              "tip": 'Sort by Name'
            },
            "last_updated": {
              "icon": '/images/recent.png',
              "tip": 'Sort by Recent Activity'
            },
            "popular": {
              "icon": '/images/popular.png',
              "tip": 'Sort by Popularity'
            },
            "liked": {
              "icon": '/images/liked.png',
              "tip": 'Sort by Likes'
            },
            "disliked": {
              "icon": '/images/disliked.png',
              "tip": 'Sort by Dislikes'
            }
          }
        },

        "Act Type": {
          "type": 'toggle',
          "section": 'type',
          "items": {
            "Pub": {
              "code": 'pu',
              "tip": 'Public'
            },
            "Pr": {
              "code": 'pr',
              "tip": 'Private'
            },
            "PM": {
              "code": 'prm',
              "tip": 'Private Members'
            },
            "H": {
              "code": 'hy',
              "tip": 'Hybrid'
            }
          }
        },

        "Act Origin": {
          "type": 'toggle',
          "section": 'origin',
          "items": {
            "Commons": {
              "code": 'commons',
              "tip": 'House of Commons'
            },
            "Lords": {
              "code": 'lords',
              "tip": "House of Lords"
            }
          }
        },

        "Major Political Parties": {
          "type": 'toggle',
          "section": 'party',
          "items": {
            "Con": {
              "code": 'party-conservative',
              "tip": 'Conservatives',
              "cssClass": 'conservative'
            },
            "Lab": {
              "code": 'party-labour',
              "tip": 'Labour',
              "cssClass": 'labour'
            },
            "Ldm": {
              "code": 'party-liberal-democrat',
              "tip": 'Liberal Democrats',
              "cssClass": 'ldm'
            }
          }

        },

        "Filter Act Titles": {
          "type": 'search',
          "section": 'nameFilter',
          "items": {
            "name": {
              "cssClass": 'input-medium',
              "placeholder": 'Search Bill by Title',
              "events": {
                "keyup": function(e) {
                  var $this = $(e.target),
                    term = $this.val().toLowerCase(),
                    ignore = [37, 39];

                  if (ignore.none(e.which) ) {
                    sandbox.publish('BillSearchName', term);
                  }
                }
              }
            }
          }
        }
      }
    });

    summary = summaryWidget({el: '#bills-summary'});

    bills = billWidget({
      el: '#bills',
      channel: 'billsDetail',
      votableBuilder: votableWidget,
      commentableBuilder: commentableWidget,
      collectionRootPath: sandbox.routes.acts_path,
      commentsPath: sandbox.routes.comments_bill_path
    });

    summary.render().startLoader();

    sandbox.analytics.init();
    sandbox.analytics.identify();
    sandbox.analytics.track('Viewing Acts');


    //hook up all widgets view pub/sub

    sandbox.subscribe('aboutToReload', function () {
      summary.startLoader();
    });

    sandbox.subscribe('billsLoaded', function () {
      summary.stopLoader();
    });

    sandbox.subscribe('summaryChanged', function (summaryObject) {
      summary.setTitledSummary(summaryObject);
    });

    sandbox.subscribe('FilterChanged', function (selections) {
      bills.filteringAndSorting(selections);
    });

    sandbox.subscribe('BillSearchName', function (term) {
      bills.showMatchedBills(term);
    });

    sandbox.subscribe('relayout', function () {
      bills.relayout();
    });

    sandbox.subscribe('sessionReload', function() {
      sandbox.session.reload();
    });

    sidebar.initDefaults();
  }




});