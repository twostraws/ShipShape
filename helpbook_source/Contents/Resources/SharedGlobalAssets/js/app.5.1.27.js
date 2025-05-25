/* Modified by Jim Derry on 2018-May-03.
 * Support non-flat file structure and srcset by modifying the regexes in
 * _htmlLoadSuccess.
 */
var APP_VERSION = "5.1.27";
/*! built 2018-03-08 */
define("shared/mixin/toc-item", [], function() {
    return Em.Mixin.create({
        id: null,
        name: null,
        icon: null,
        parent: null,
        book: null,
        path: function() {
            for (var a = [], b = this.get("parent"); b; )
                a.push(b),
                b = b.get("parent");
            return a.reverse()
        }
        .property("parent"),
        breadcrumb: function() {
            return this.get("path").map(function(a) {
                return a.name
            }).join(" > ")
        }
        .property("path")
    })
}),
define("shared/browser", [], function() {
    var a = "unknown"
      , b = "ActiveXObject"in window && !window.ActiveXObject
      , c = Em.Object.extend({
        isInHelpViewer: "HelpViewer"in window,
        isInModernHelpViewer: "HelpViewer"in window && "showTOCButton"in window.HelpViewer,
        isInOldHelpViewer: "HelpViewer"in window && !("showTOCButton"in window.HelpViewer),
        all: function() {
            var a = this.get("name") + " " + this.get("version") + ", OS " + this.get("os");
            return a
        }
        .property(),
        name: function() {
            var c = Em.get(window, "iTunes.platform");
            return c ? "itunes-%@".fmt(c.toLowerCase()) : b ? "msie" : (c = a,
            $.each([/edge/i, /chrome/i, /safari/i, /opera/i, /webkit/i, /firefox/i, /msie/i], function() {
                var a = navigator.userAgent.match(this);
                return a ? (c = a[0].toLowerCase(),
                !1) : void 0
            }),
            c)
        }
        .property(),
        version: function() {
            var c = Em.get(window, "iTunes.version");
            return c ? c : b ? "11" : (c = a,
            $.each([/Version\/([_\.\d]+)/, /Edge\/([_\.\d]+)/, /Chrome\/([_\.\d]+)/, /WebKit\/([_\.\d]+)/, /MSIE ([_\.\d]+)/, /Firefox\/([_\.\d]+)/], function() {
                var a = navigator.userAgent.match(this);
                return a ? (c = a[0].replace(this, "$1").replace(/_/g, "."),
                !1) : void 0
            }),
            c)
        }
        .property(),
        os: function() {
            var b = a;
            return $.each([/Mac OS X ([_\.\d]+)/, /iPhone OS ([_\.\d]+)/, /CPU OS ([_\.\d]+)/, /Windows NT ([_\.\d]+)/], function() {
                var a = navigator.userAgent.match(this);
                return a ? (b = a[0].replace(this, "$1").replace(/_/g, "."),
                !1) : void 0
            }),
            b
        }
        .property(),
        isMac: function() {
            return /mac/i.test(navigator.appVersion) && !/mobile/i.test(navigator.appVersion)
        }
        .property(),
        isMobile: function() {
            return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
        }
        .property(),
        canHandleHelpOpenBookLinks: function() {
            var a = !!this.get("name").match(/safari/i)
              , b = !!this.get("name").match(/webkit/i)
              , c = !!this.get("name").match(/chrome/i)
              , d = this.get("isMac");
            return this.get("isInHelpViewer") || d && (a || c || b)
        }
        .property(),
        canHandleHelpAnchorLinks: function() {
            var a = !!this.get("name").match(/safari/i)
              , b = !!this.get("name").match(/webkit/i)
              , c = this.get("isMac");
            return this.get("isInHelpViewer") || c && (a || b)
        }
        .property(),
        isTablet: function() {
            return /iPad/i.test(navigator.userAgent)
        }
        .property(),
        params: function() {
            var a = {};
            return location.search && $.each(location.search.substring(1).split("&"), function() {
                var b = this.split("=");
                a[decodeURIComponent(b[0])] = decodeURIComponent(b[1])
            }),
            a
        }
        .property(),
        classNames: function() {
            var b = []
              , c = "is-" + this.get("name").replace("firefox", "ff").replace("msie", "ie").replace("edge", "ie")
              , d = this.get("version");
            if (b.push(c),
            c.match(/itunes/) && b.push("is-webkit"),
            navigator.userAgent.match(/AppleWebKit\/(534|536)/) && b.push("is-safari6", "is-applewebkit-534"),
            d !== a) {
                var e = c + this.get("version").split(".")[0];
                b.push(e)
            }
            return this.get("isInHelpViewer") ? (b.push("is-hv"),
            b.push(this.isInModernHelpViewer ? "is-modern-hv" : "is-older-hv")) : b.push("is-not-hv"),
            b.push(this.get("isMac") ? "is-mac-os" : "is-not-mac-os"),
            b.push(this.get("isMobile") ? "is-mobile" : "is-not-mobile"),
            b.push("ontouchstart"in document.documentElement ? "is-touch" : "is-not-touch"),
            b.join(" ")
        }
        .property(),
        queryLocale: function() {
            return this.get("params.lang")
        }
        .property(),
        currentLocale: function() {
            return navigator.browserLanguage || navigator.systemLanguage || navigator.userLanguage || navigator.language
        }
        .property(),
        locales: function() {
            var a = [];
            if ("HelpViewer"in window && "preferredLanguages"in HelpViewer)
                try {
                    var b = Array.prototype.concat.apply([], HelpViewer.preferredLanguages());
                    a = b.concat(a)
                } catch (c) {}
            if ("iTunes"in window)
                try {
                    a = $.map(iTunes.acceptedLanguages.split(","), function(a) {
                        return a.replace(/\+?([^;]+);.*/, "$1")
                    }).concat(a)
                } catch (c) {}
            var d = [this.get("queryLocale"), this.get("currentLocale")].concat(a);
            return $.map(d, function(a) {
                if (!a)
                    return null;
                a = a.toLowerCase().replace(/_/g, "-");
                var b = [];
                if (a.length > 2) {
                    var c = "";
                    a.split("-").map(function(d, e) {
                        e > 0 && (c += "-"),
                        c += d,
                        c !== a && b.unshift(c)
                    })
                }
                return [a].concat(b)
            })
        }
        .property(),
        has3dTransformSupport: null,
        _has3dTransform: function() {
            var a, b = document.createElement("p"), c = {
                webkitTransform: "-webkit-transform",
                OTransform: "-o-transform",
                msTransform: "-ms-transform",
                MozTransform: "-moz-transform",
                transform: "transform"
            };
            document.body.insertBefore(b, null);
            for (var d in c)
                void 0 !== b.style[d] && (b.style[d] = "translate3d(1px,1px,1px)",
                a = window.getComputedStyle(b).getPropertyValue(c[d]));
            return document.body.removeChild(b),
            void 0 !== a && a.length > 0 && "none" !== a
        },
        has3dTransform: function() {
            return null === this.has3dTransformSupport && (this.has3dTransformSupport = this._has3dTransform()),
            this.has3dTransformSupport
        },
        scrollTo: function(a, b, c) {
            if (this.get("isMobile")) {
                var d = function(b, c) {
                    var d = a.scrollTop()
                      , e = b - d
                      , f = 0
                      , g = 20
                      , h = function() {
                        f += g;
                        var a = Math.easeInOutQuad(f, d, e, c);
                        window.scrollTo(0, a),
                        c > f && setTimeout(h, g)
                    };
                    h()
                };
                Math.easeInOutQuad = function(a, b, c, d) {
                    return a /= d / 2,
                    1 > a ? c / 2 * a * a + b : (a--,
                    -c / 2 * (a * (a - 2) - 1) + b)
                }
                ,
                d(b, c)
            } else
                a.animate({
                    scrollTop: b
                }, c)
        }
    });
    return c.create()
}),
define("shared/topic/model", ["shared/mixin/toc-item", "shared/browser"], function(a, b) {
    var c = "HTML_LOADED"
      , d = "HTML_FAILED";
    return Em.Object.extend(a, Ember.Evented, {
        href: null,
        prev: null,
        next: null,
        subtopic: 0,
        template: null,
        templatePromise: null,
        isLoaded: !1,
        isAsync: !1,
        isError: !1,
        init: function() {
            var a = Em.RSVP.defer();
            this.set("templatePromise", a.promise),
            this.on("HTML_LOADED", this, a.resolve),
            this.on("HTML_FAILED", this, a.reject)
        },
        routeSlug: function() {
            return this.get("id")
        }
        .property("id", "name"),
        iconHref: function() {
            if (!(b.isInHelpViewer || this.get("parent") && !this.get("parent.allChildrenHaveIcons"))) {
                var a = this.get("icon")
                  , c = this.get("app.bundle.path");
                return a ? c + a : void 0
            }
        }
        .property("icon", "app.bundle.path"),
        categories: [],
        chapterName: function() {
            return this.get("parent.name") || this.get("parent.parent.name") || null
        }
        .property("parent"),
        isLanding: function() {
            return this.get("categories").contains("landing")
        }
        .property("categories"),
        isPassionPoints: function() {
            return this.get("categories").contains("passionpoints")
        }
        .property("categories"),
        isAside: function() {
            return this.get("categories").contains("aside")
        }
        .property("categories"),
        isCopyright: function() {
            return this.get("categories").contains("copyright")
        }
        .property("categories"),
        isCurrentTopic: function() {
            return this.get("app.currentTopic.id") === this.get("id")
        }
        .property("app.currentTopic", "id"),
        crossReferences: Em.Object.create({}),
        fetchTopicHTML: function() {
            var a = this.get("templatePromise")
              , b = this.get("href");
            return this.get("isLoaded") ? a : b ? ($.ajax({
                context: this,
                async: this.get("isAsync"),
                url: this.get("app.bundle.path") + b,
                success: this._htmlLoadSuccess,
                error: this._htmlLoadFailure
            }),
            a) : this._htmlLoadFailure()
        },
        _htmlLoadSuccess: function(a) {
            if (!a)
                return this._htmlLoadFailure();
            var b = this.get("app.bundle.path");
            return a = a.replace(/[\W\w]*<body/, "<div")
            .replace(/\/body>[\W\w]*/, "/div>")
            .replace(/\u2028/g, "").replace(/\u2029/g, "")
            .replace(/((?:src|poster|xlink:href)=["'](?!data:|https?:))(?:\/Resources\/)+/g, "$1")
            .replace(/(?:\/Resources\/)(.+?\s[0-9]x)/g, "$1"),
            a = this.preProcessAsDOM($(a)).prop("outerHTML"),
            a = a.replace(/<\/track>/g, ""),
            this.set("isError", !1),
            this.set("template", a),
            this.set("isLoaded", !0),
            this.trigger(c),
            this.get("templatePromise")
        },
        _htmlLoadFailureMessage: function() {
            return '<div class="apd-topic loading-error"><h1>%@</h1>%@</div>'.fmt("$TOPIC_LOAD_ERROR$".loc(), "$CONNECT_TO_INTERNET$".loc())
        }
        .property(),
        _htmlLoadFailure: function(a, b, c) {
            (a || c) && Em.Logger.warn(c.message || "%@ %@".fmt(a.statusText, a.status));
            var e = this.get("_htmlLoadFailureMessage");
            return this.set("isError", !0),
            this.set("template", e),
            this.set("isLoaded", !0),
            this.trigger(d),
            "HelpViewer"in window && "mtStatisticsIncrement"in window.HelpViewer && HelpViewer.mtStatisticsIncrement(1, 0, 0, 0),
            this.get("templatePromise")
        },
        preProcessAsDOM: function(a) {
            var c = this;
            a.addClass("apd-topic").removeAttr("id"),
            a.find("h1").attr({
                id: this.get("id"),
                tabindex: "-1"
            });
            var d = a.find(".Task > .Name")
              , e = d.parent(".Task")
              , f = e.length;
            d.attr("tabindex", "1"),
            1 === f && e.addClass("SoloTask");
            var g = this.get("crossReferences");
            if (a.find(".xRef").replaceWith(function(a, b) {
                if (!$(this).attr("href"))
                    return void console.warn('Found a link without an href attribute: "%@"'.fmt(b));
                var d = $(this).attr("href").split(".")[0]
                  , e = $(this).attr("href").split("#")[1]
                  , f = d ? f = c.get("app.book").modelForID(d) : null
                  , h = $(this).attr("class");
                return f ? f instanceof c.constructor ? $(this).hasClass("Section") ? b : (g.set(d, f),
                $(this).hasClass("Aside") && f.get("isAside") ? $(this).attr("aside", d).attr("href", "#/" + d) : d !== e ? '{{#link-to "topic" "%@" (query-params sub="%@") class="%@ subTopicLink"}}%@{{/link-to}}'.fmt(d, e, h, b) : '{{#link-to "topic" model.crossReferences.%@.routeSlug class="%@"}}%@{{/link-to}}'.fmt(d, h, b)) : (console.warn('Found cross-reference to non-Topic item "%@" (%@)'.fmt(f.name, d)),
                b) : void console.warn("Found cross-reference to missing model %@".fmt(d))
            }),
            a.find("a[href]").each(function() {
                var a = $(this).attr("href");
                a.match(/^(http|help)/) && ($(this).attr("target", "_blank"),
                a.match(/\.mov(\?|")/) && $(this).addClass("video"))
            }),
            "apd-schema" === this.get("app.book.source_schema")) {
                var h = 1 === f;
                e.each(function() {
                    var a = $(this);
                    $name = a.find("> .Name"),
                    $name.html('<span class="task-arrow"></span>' + $name.text()),
                    $name.attr("aria-expanded", h),
                    a.find(".TaskBody").attr("aria-hidden", !h)
                }),
                b.isInModernHelpViewer && this.get("isLanding") && !this.get("app.book.isSingleTopicBook") && a.find("ul").append('<li><div class="toc-toggle"><a href="#">{{#if app.isTOCVisible}}{{loc "$LANDING_HIDE_TOC$"}}{{else}}{{loc "$LANDING_SHOW_TOC$"}}{{/if}}</a></div></li>')
            }
            return a
        }
    })
}),
define("shared/section", ["shared/mixin/toc-item", "shared/browser"], function(a, b) {
    return Em.Object.extend(a, {
        children: [],
        isExpanded: !1,
        hasCurrentTopic: function() {
            return this.get("children").filter(function(a) {
                return a.get("isCurrentTopic") || a.get("hasCurrentTopic")
            }).length > 0
        }
        .property("app.currentTopic"),
        totalDescendants: function() {
            var a = this.get("children")
              , b = a.length;
            return a.forEach(function(a) {
                b += a.children ? a.get("totalDescendants") : 0
            }),
            b
        }
        .property("children"),
        iconHref: function() {
            if (!b.isInHelpViewer) {
                var a = this.get("icon")
                  , c = this.get("app.bundle.path");
                return a ? c + a : void 0
            }
        }
        .property("icon", "app.bundle.path"),
        allChildrenHaveIcons: function() {
            return this.get("children").reduce(function(a, b) {
                return a && (a = null !== b.get("icon")),
                a
            }, !0)
        }
        .property()
    })
}),
define("shared/url", ["shared/mixin/toc-item"], function(a) {
    return Em.Object.extend(a, {
        href: null,
        isUrl: !0,
        url: function() {
            return encodeURI(this.get("href"))
        }
        .property("href")
    })
}),
define("shared/book", ["shared/topic/model", "shared/section", "shared/url"], function(a, b, c) {
    return Em.Object.extend({
        id: null,
        framework: null,
        source_schema: null,
        birdseed_version: null,
        locale: null,
        collect_feedback: !1,
        enable_tracking: !1,
        product: null,
        platform: null,
        version: null,
        title: null,
        icon: null,
        landing: null,
        firstTopic: null,
        lastTopic: null,
        toc: [],
        quick_links: [],
        sections: {},
        topics: {},
        copyright: null,
        copyright_text: null,
        isSingleTopicBook: !1,
        Topic: a,
        init: function() {
            this.rewriteObjectAsModels("topics", this.get("Topic")),
            this.rewriteObjectAsModels("urls", c),
            this.rewriteObjectAsModels("sections", b),
            this.get("sections").forEach(function(a, b) {
                a.children && a.set("children", a.get("children").map(function(b) {
                    var c = this.modelForID(b);
                    return c && c.set("parent", a),
                    c
                }, this).filter(function(a) {
                    return !!a
                }))
            }, this),
            this.set("toc", this.get("toc").map(this.modelForID, this).filter(this.filterTopics)),
            this.set("quick_links", this.get("quick_links").filter(function(a) {
                if (!a.href)
                    return !1;
                var b = a.href.split(".html")[0]
                  , c = this.topics.get(b);
                return c && (a.href = "#/" + b,
                a.title = a.title || c.get("name")),
                c
            }, this));
            var a = this.get("landing");
            this.set("landing", null !== a ? this.modelForID(a) : null),
            this.set("copyright", this.modelForID(this.get("copyright")));
            var d = 0;
            this.topics.forEach(function(a, b) {
                a.get("isAside") || d++
            }),
            this.set("isSingleTopicBook", 1 === d),
            this.createLinkedTopicList()
        },
        rewriteObjectAsModels: function(a, b) {
            var c, d, e = this.get(a), f = Em.Map.create({}), g = this.get("app");
            for (c in e)
                d = b.create($.extend({
                    app: g
                }, e[c])),
                d.setProperties({
                    id: d.get("isUrl") ? d.get("url") : c,
                    book: this
                }),
                f.set(c, d);
            this.set(a, f)
        },
        modelForID: function(a) {
            var b = this.topics.get(a) || this.sections.get(a) || this.urls.get(a);
            return b || console.warn("Could not find topic id: %@ in topics, sections or urls.".fmt(a)),
            b
        },
        filterTopics: function(a) {
            return a
        },
        createLinkedTopicList: function() {
            var a = this.topicsInList(this.get("toc"));
            return a = a.filter(function(a) {
                return !a.isUrl
            }),
            this.set("firstTopic", a[0]),
            this.set("lastTopic", a[a.length - 1]),
            a.forEach(function(b, c) {
                c > 0 && b.set("prev", a[c - 1]),
                c + 1 < a.length && b.set("next", a[c + 1])
            }),
            a
        },
        topicsInList: function(a) {
            var b = this;
            return $.map(a, function(a) {
                if (!a) {
                    var c = "Error building TOC. navigation.json file has an id in the toc list that is not found in the topics list.";
                    return Em.isEmpty(b.get("app.ENVIRONMENT")) ? Em.Logger.error(c) : $("body").append('<div class="loading loading-error"><h1>Hmmm.</h1><p>' + c + "</p></div>"),
                    !1
                }
                return "string" == typeof a && (a = b.modelForID(a)),
                a.children ? b.topicsInList(a.children) : a
            })
        }
    })
}),
define("shared/tracking/event", ["shared/browser"], function(a) {
    return Em.Object.extend({
        init: function() {
            this._super();
            var b, c, d, e = "appleproductdocumentation", f = "metrics.apple.com", g = "securemetrics.apple.com", h = Em.computed.oneWay, i = this.getProperties(Ember.keys(this)), j = this.get("app");
            d = {
                events: "",
                eVar1: null,
                prop1: h("eVar1"),
                eVar2: navigator.userAgent,
                prop2: h("eVar2"),
                eVar3: "%@:%@".fmt(a.get("name"), a.get("version")),
                prop3: h("eVar3"),
                eVar4: a.get("os"),
                prop4: h("eVar4"),
                eVar5: "%@:%@".fmt(a.get("name"), a.get("os")),
                prop5: h("eVar5"),
                eVar6: function() {
                    return "%@:%@".fmt(j.get("NAME"), j.get("VERSION"))
                }
                .property(),
                prop6: h("eVar6"),
                eVar7: function() {
                    return "help:%@".fmt(this.get("eVar10"))
                }
                .property("eVar10"),
                prop7: h("eVar7"),
                eVar8: function() {
                    return "%@:%@".fmt(this.get("eVar7"), this.get("eVar11"))
                }
                .property("eVar7", "eVar11"),
                prop8: h("eVar8"),
                eVar9: function() {
                    return "%@:%@".fmt(this.get("eVar8"), this.get("eVar12"))
                }
                .property("eVar8", "eVar12"),
                prop9: h("eVar9"),
                eVar10: function() {
                    return j.get("book.product")
                }
                .property(),
                prop10: h("eVar10"),
                eVar11: function() {
                    return j.get("book.platform")
                }
                .property(),
                prop11: h("eVar11"),
                eVar12: function() {
                    return j.get("book.version")
                }
                .property(),
                prop12: h("eVar12"),
                eVar13: a.get("currentLocale"),
                prop13: h("eVar13"),
                eVar14: function() {
                    return j.get("bundle.currentLocale.isoCode")
                }
                .property(),
                prop14: h("eVar14"),
                eVar15: navigator.language,
                prop15: h("eVar15"),
                eVar16: null,
                prop16: h("eVar16"),
                eVar17: null,
                prop17: h("eVar17"),
                eVar18: null,
                prop18: h("eVar18"),
                eVar20: null,
                prop20: h("eVar20"),
                eVar21: null,
                prop21: h("eVar21"),
                eVar22: null,
                prop22: h("eVar22"),
                eVar23: null,
                prop23: h("eVar23"),
                eVar24: null,
                prop24: h("eVar24"),
                eVar28: null,
                prop28: h("eVar28"),
                eVar29: null,
                prop29: h("eVar29"),
                eVar30: null,
                prop30: h("eVar30"),
                eVar31: null,
                prop31: h("eVar31"),
                eVar32: null,
                prop32: h("eVar32"),
                eVar33: null,
                prop33: h("eVar33")
            },
            c = {
                event1: "view",
                event2: "searchWithResults",
                event3: "searchNoResults",
                event4: "searchClickthrough",
                event5: "submitFeedback",
                event7: "playMedia",
                event16: "passionPoint",
                event17: "task-learnmore",
                event18: "pp-clickthrough",
                event14: "exit",
                event15: "stopAutoAdvance",
                event20: "task1",
                event21: "task2",
                event22: "task3",
                event23: "task4",
                event24: "task5",
                event25: "task6",
                event26: "task7",
                event27: "task8",
                event28: "task9",
                event29: "task10"
            },
            b = {
                visitorNamespace: e,
                useLocalhostForTrackingServer: function() {
                    return !Em.isEmpty(j.get("ENVIRONMENT")) && !j.get("USE_OMNITURE_TEST_SERVER")
                },
                trackingServer: function() {
                    return this.useLocalhostForTrackingServer() ? "localhost" : f
                }
                .property(),
                trackingServerSecure: function() {
                    return this.useLocalhostForTrackingServer() ? "localhost" : g
                }
                .property(),
                server: function() {
                    return j.get("book.title").toLowerCase()
                }
                .property(),
                pageName: function() {
                    return "%@:%@".fmt(this.get("server"), this.get("name")).toLowerCase()
                }
                .property(),
                channel: h("pageName"),
                trackDownloadLinks: !1,
                trackExternalLinks: !1,
                trackInlineStats: !1,
                useForcedLinkTracking: !1,
                linkDownloadFileTypes: "exe,zip,wav,mp3,mov,mpg,avi,wmv,pdf,doc,docx,xls,xlsx,ppt,pptx",
                linkInternalFilters: "help.apple.com",
                linkLeaveQueryString: !1,
                linkTrackVars: Em.keys(d),
                linkTrackEvents: Em.keys(c),
                usePlugins: !1,
                doPlugins: $.noop,
                campaign: a.get("params.o") || null
            },
            this.set("TRACKING_VARS", d),
            this.set("EVENTS", c),
            this.set("CONFIG", b),
            this.setProperties(b),
            this.setProperties(d),
            this.setProperties(i)
        },
        name: "",
        eventName: function() {
            return this.get("EVENTS")[this.get("events")]
        }
        .property("events"),
        resolvedProperties: function() {
            var a = Em.keys(this.get("CONFIG")).concat(Em.keys(this.get("TRACKING_VARS")));
            return this.getProperties(a)
        }
        .property()
    })
}),
define("shared/tracking/controller", ["shared/tracking/event"], function(a) {
    return Ember.Controller.extend({
        isProduction: !1,
        isEnabled: !1,
        originId: null,
        topicEventName: function(a) {
            var b = "%@:%@".fmt(a.name, a.id);
            return a.get("isAside") && (b = "aside:" + b),
            b
        },
        account: function() {
            return this.get("isProduction") ? "aaplpdglobal" : "aaplpdglobaldev"
        }
        .property("isProduction"),
        siteCatalyst: function() {
            return s_gi ? s_gi(this.get("account")) : void 0
        }
        .property("account"),
        track: function(a, b) {
            if (this.isEnabled && "s_gi"in window) {
                var c = this.get("siteCatalyst");
                $.extend(c, this.get("model.resolvedProperties")),
                c.t(!0, "o", this.get("model.eventName"))
            }
        }
        .observes("model"),
        topicLoaded: function(b) {
            var c = b.id;
            b.get("subtopics") && (c += ":" + (b.subtopic + 1)),
            this.set("model", a.create({
                events: "event1",
                name: b.name,
                eVar1: this.topicEventName(b),
                eVar28: c,
                eVar29: window.location.href,
                eVar30: b.get("chapterName"),
                app: this.get("app")
            }))
        },
        quickTourExit: function(b, c) {
            this.set("model", a.create({
                events: "event14",
                name: "quick-tour-session-path",
                eVar28: c,
                eVar29: window.location.href,
                eVar31: b,
                app: this.get("app")
            }))
        },
        quickTourStopAutoAdvance: function(b, c) {
            if (b && b.get && ("dot" === c || "paddle" === c || "keyboard" === c || "click" === c)) {
                var d = b.get("id");
                b.get("subtopics") && (d += ":" + (b.get("subtopic") + 1)),
                this.set("model", a.create({
                    events: "event15",
                    name: "quick-tour-stop-auto-advance",
                    eVar28: d,
                    eVar29: window.location.href,
                    eVar32: c,
                    app: this.get("app")
                }))
            }
        },
        quickTourLearnMore: function(b, c) {
            if (b && b.get) {
                var d = b.get("id");
                b.get("subtopics") && (d += ":" + (b.get("subtopic") + 1)),
                this.set("model", a.create({
                    events: "event17",
                    name: "quick-tour-learn-more-opened",
                    eVar22: c,
                    eVar28: d,
                    eVar29: window.location.href,
                    app: this.get("app")
                }))
            }
        },
        toggleTOC: function(b) {
            this.set("model", a.create({
                events: b,
                app: this.get("app")
            }))
        },
        tocSelect: function(b) {
            this.set("model", a.create({
                events: "event33",
                eVar28: b,
                app: this.get("app")
            }))
        },
        nextPrev: function(b) {
            this.set("model", a.create({
                events: "event34",
                eVar33: b,
                app: this.get("app")
            }))
        },
        expansion: function(b, c, d, e, f) {
            this.set("model", a.create({
                events: f,
                name: c.name,
                eVar1: this.topicEventName(c),
                eVar22: d,
                eVar23: e + 1,
                eVar24: b + ":" + (e + 1),
                eVar28: c.id,
                app: this.get("app")
            }))
        },
        performSearch: function(b) {
            var c = b.matches.length ? "search" : "search: no results";
            this.set("model", a.create({
                events: b.matches.length ? "event2" : "event3",
                name: c,
                eVar16: b.query,
                app: this.get("app")
            }))
        },
        searchResultSelect: function(b, c) {
            var d = b.get("sortedTopics");
            if (d && d[c]) {
                var e = d[c];
                this.set("model", a.create({
                    events: "event4",
                    eVar1: "search: result click-through",
                    eVar16: b.query,
                    eVar17: e.name,
                    eVar18: e.id,
                    app: this.get("app")
                }))
            }
        },
        searchQuickLinkSelect: function(b, c) {
            this.set("model", a.create({
                events: "event19",
                eVar1: "search: quicklink click-through",
                eVar17: b,
                eVar18: c,
                app: this.get("app")
            }))
        },
        feedbackSubmit: function(b) {
            var c = this.get("app.currentTopic");
            this.set("model", a.create({
                events: "event5",
                name: "feedback",
                eVar1: this.topicEventName(c),
                eVar21: b,
                eVar28: c.id,
                app: this.get("app")
            }))
        },
        setDefaultBrowser: function(a, b) {
            this.trackClick(a.name, "event6")
        },
        mediaStart: function(b) {
            var c = b.tagName.toLowerCase()
              , d = $("source", b).attr("src");
            this.set("model", a.create({
                events: "event7",
                eVar18: d,
                eVar20: c,
                app: this.get("app")
            }))
        },
        media25: function(b) {
            var c = b.tagName.toLowerCase()
              , d = $("source", b).attr("src");
            this.set("model", a.create({
                events: "event8",
                eVar18: d,
                eVar20: c,
                app: this.get("app")
            }))
        },
        media50: function(b) {
            var c = b.tagName.toLowerCase()
              , d = $("source", b).attr("src");
            this.set("model", a.create({
                events: "event9",
                eVar18: d,
                eVar20: c,
                app: this.get("app")
            }))
        },
        media75: function(b) {
            var c = b.tagName.toLowerCase()
              , d = $("source", b).attr("src");
            this.set("model", a.create({
                events: "event10",
                eVar18: d,
                eVar20: c,
                app: this.get("app")
            }))
        },
        mediaEnd: function(b) {
            var c = b.tagName.toLowerCase()
              , d = $("source", b).attr("src");
            this.set("model", a.create({
                events: "event11",
                eVar18: d,
                eVar20: c,
                app: this.get("app")
            }))
        },
        mediaError: function(b) {
            var c = b.tagName.toLowerCase()
              , d = $("source", b).attr("src");
            this.set("model", a.create({
                events: "event12",
                eVar18: d,
                eVar20: c,
                app: this.get("app")
            }))
        },
        trackClick: function(b, c) {
            var d = {
                events: "event13",
                pageName: b,
                eVar1: b,
                app: this.get("app")
            };
            c && (d.eVar29 = c),
            this.set("model", a.create(d))
        },
        trackPassionPointClick: function(b, c, d) {
            if (null !== b && null !== d) {
                var e = {
                    events: "event18",
                    pageName: "pp-link-clicked:" + c,
                    eVar1: this.topicEventName(b),
                    eVar28: d,
                    app: this.get("app")
                };
                this.set("model", a.create(e))
            }
        }
    })
}),
define("shared/app/controller", ["shared/book", "shared/tracking/controller", "shared/browser"], function(a, b, c) {
    return Ember.Controller.extend({
        NAVIGATION_FILE: "navigation.json",
        SEARCH_FILE: "searchTree.json",
        VERSION: APP_VERSION,
        NAME: "base",
        ENVIRONMENT: null,
        USE_OMNITURE_TEST_SERVER: !1,
        book: null,
        Book: a,
        currentTopic: null,
        addLanguageAndDirection: function() {
            var a = this.get("bundle.currentLocale");
            this.get("$html").attr("lang", a.get("isoCode")),
            this.get("$body").attr("dir", a.get("text-direction"))
        }
        .observes("bundle.currentLocale").on("init"),
        loadBook: function() {
            var a = this
              , b = Ember.RSVP.defer();
            $.ajax({
                url: this.get("bundle.path") + this.get("NAVIGATION_FILE"),
                dataType: "json"
            }).done(function(c, d, e) {
                var f = arguments;
                (a.bookDidLoad.apply(a, f) || Ember.RSVP.resolve())["finally"](function() {
                    b.resolve.apply(b, f)
                })
            }).fail(function(c, d, e) {
                var f = "development" === a.get("VERSION") ? a.get("VERSION") : e.getResponseHeader("x-server-type");
                Em.isEmpty(f) || $(".loading").addClass("loading-error").html("<h1>Hmmm.</h1><p>This book exists...but I couldn’t find any .lproj folders.</p><p>Please contact your build engineer for assistance.</p>"),
                b.reject.apply(b, arguments)
            }),
            this.set("bookPromise", b.promise)
        }
        .observes("bundle.currentLocale").on("init"),
        removeInitialLoading: function() {
            $(".loading").remove()
        },
        bookDidLoad: function(a, b, c) {
            var d = "development" === this.get("VERSION") ? this.get("VERSION") : c.getResponseHeader("x-server-type");
            this.set("ENVIRONMENT", d),
            $("html").addClass(d);
            var e = a;
            e.app = this,
            this.set("book", this.get("Book").create(e)),
            document.title = this.get("book.title"),
            this.get("USE_OMNITURE_TEST_SERVER") === !1 && !Em.isEmpty(d) && this.get("trackingController.isEnabled") && (Em.Logger.warn("Omniture data collection turned OFF for non-production environments."),
            Em.Logger.warn('Use "TOGGLE_OMNITURE_TEST_SERVER()" to enable data collection to the test server'))
        },
        isOnLandingPage: function() {
            return this.get("currentTopic.id") === this.get("book.landing.id") && !this.get("book.isSingleTopicBook")
        }
        .property("currentTopic", "book"),
        updateLandingPageClassNameOnBody: function() {
            $("body").toggleClass("landing-page", this.get("isOnLandingPage"))
        }
        .observes("isOnLandingPage"),
        trackingController: function() {
            return b.create({
                isProduction: "development" !== this.get("VERSION") && Em.isEmpty(this.get("ENVIRONMENT")),
                isEnabled: this.book.enable_tracking && !c.isInHelpViewer,
                app: this
            })
        }
        .property("ENVIRONMENT", "book"),
        trackingControllerUpdatedLog: function() {
            Em.Logger.log("Omniture data collection is " + (this.get("USE_OMNITURE_TEST_SERVER") ? "ON" : "OFF"))
        }
        .observes("USE_OMNITURE_TEST_SERVER"),
        hidePanels: $.noop,
        isTOCAlwaysExpanded: !1,
        changeLanguage: function(a) {
            location.search = "lang=%@".fmt(this.get("value"))
        },
        debugInfo: function() {
            Em.Logger.log("app_version: %@".fmt(APP_VERSION)),
            Em.Logger.log("framework: %@".fmt(this.get("framework"))),
            Em.Logger.log("schema: %@".fmt(this.get("book.source_schema"))),
            Em.Logger.log("build: %@".fmt(this.get("book.build_id"))),
            Em.Logger.log("locale: %@".fmt(this.get("bundle.currentLocale.isoCode"))),
            Em.Logger.log("title: %@".fmt(this.get("book.title"))),
            this.get("book.enable_tracking") ? Em.Logger.log('tracking product: "%@", platform: "%@", version: "%@"'.fmt(this.get("book.product"), this.get("book.platform"), this.get("book.version"))) : Em.Logger.log("tracking: disabled"),
            Em.Logger.log("feedback: %@".fmt(this.get("book.collect_feedback") ? "collect" : "do not collect"))
        },
        init: function() {
            this.set("$html", $("html")),
            this.set("$body", $("body")),
            this.get("$html").addClass(c.get("classNames"));
            var a = "1" === c.get("params.omniture");
            return a && this.set("USE_OMNITURE_TEST_SERVER", !0),
            this.updateLandingPageClassNameOnBody(),
            this._super()
        }
    })
}),
define("shared/app/view", [], function() {
    return Ember.View.extend({
        ariaRole: "application",
        template: Ember.HTMLBars.compile("{{outlet}}"),
        willInsertElement: function() {
            this.get("controller").removeInitialLoading()
        }
    })
}),
define("shared/topic/view", ["shared/browser"], function(a) {
    return Em.View.extend({
        tagName: "article",
        classNames: ["instapaper_ignore"],
        template: Em.HTMLBars.compile('<div class="topic-container topic-loading"><div class="spinner"></div></div>'),
        contentBinding: "controller.model",
        waitForTemplateLoad: function() {
            this.get("content") && this.get("content.templatePromise")["finally"](Em.run.bind(this, this.setTemplateFromModel))
        }
        .observes("content.templatePromise").on("init"),
        setTemplateFromModel: function() {
            if (!this.get("isDestroying")) {
                var a = this.get("content.template");
                this.set("template", Em.HTMLBars.compile(a)),
                this.rerender()
            }
        },
        click: function(a) {
            function b(b) {
                b || (c = window.open(b, "helpexternal"),
                c && a.preventDefault())
            }
            var c, d, e = $(a.target), f = this.get("controller.app") || this.get("app");
            if (e.is("a[aside]")) {
                var g = this.get("content");
                d = g.crossReferences[e.attr("aside")],
                this.showAside(d),
                a.preventDefault()
            } else
                e.is(".LinkAppleWebMovie") ? b(e.find("a[href]").attr("href")) : e.is("a[href]") && "_blank" === e.attr("target") ? b(e.attr("href")) : e.is(".cur-lang") ? this.showLocalePicker() : e.hasClass("subTopicLink") && f.scrollToSubtopic();
            f.hidePanels()
        },
        updateDocumentTitle: function() {
            var a, b, c, d, e = this.get("controller.app.currentTopic");
            d = this.$ ? this.$().find("h1").text() : null,
            a = d || e.get("name"),
            b = this.get("controller.app.book.title"),
            c = e === this.get("controller.app.book.landing") ? b : a === b ? b : "%@ - %@".fmt(a, b),
            document.title = c
        },
        showAside: function(a) {
            this.get("controller.target").transitionTo("topic", a)
        },
        showLocalePicker: function() {
            return !1
        },
        didInsertElement: function() {
            this._super(),
            "HelpViewer"in window && "mtContentAccessed"in HelpViewer && ("mtContentAccessedJSON"in HelpViewer ? HelpViewer.mtContentAccessedJSON({
                mtAccessContent: {
                    topicID: this.get("content.id"),
                    topicTitle: this.get("content.name"),
                    bookName: this.get("controller.app.book.title"),
                    bookVersion: this.get("controller.app.book.version"),
                    bookBuild: this.get("controller.app.book.build_id"),
                    bookLocale: this.get("controller.app.book.locale")
                }
            }) : HelpViewer.mtContentAccessed(this.get("content.id") + " " + this.get("content.name"), this.get("controller.app.book.title"))),
            a.get("isMobile") && this.$().on("click", $.noop);
            var b = this.get("controller.app") || this.get("app")
              , c = b.get("trackingController");
            this.$("video, audio").on("timeupdate", function(a) {
                var b = a.target.currentTime / a.target.duration;
                b > .75 ? $(this).trigger("passed75") : b > .5 ? $(this).trigger("passed50") : b > .25 && $(this).trigger("passed25")
            }).one("play", function(a) {
                c.mediaStart(a.target)
            }).one("passed25", function(a) {
                c.media25(a.target)
            }).one("passed50", function(a) {
                c.media50(a.target)
            }).one("passed75", function(a) {
                c.media75(a.target)
            }).one("ended", function(a) {
                c.mediaEnd(a.target)
            }).one("error", function(a) {
                c.mediaError(a.target)
            })
        },
        willDestroyElement: function() {
            this.$().off("click")
        }
    })
}),
define("shared/topic/route", [], function() {
    return Em.Route.extend({
        model: function(a) {
            var b = a.topic_id ? a.topic_id.split(":")[0] : ""
              , c = this.controllerFor("application");
            return c.get("book").modelForID(b) || c.get("book.landing")
        },
        setupController: function(a, b) {
            var c = this.controllerFor("application");
            c.set("currentTopic", b),
            b.fetchTopicHTML()["finally"](function() {
                a.set("model", b),
                c.get("trackingController").topicLoaded(b)
            })
        }
    })
}),
define("shared/base/controller", [], function() {
    return Ember.Controller.extend({
        needs: ["application"],
        app: Ember.computed.alias("controllers.application")
    })
}),
define("shared/locale/model", [], function() {
    return Em.Object.extend({
        isoCodes: [],
        isoName: "",
        name: "",
        folder: "",
        isoCode: function() {
            return this.get("isoCodes")[0]
        }
        .property("isoCodes"),
        strings: function() {
            var a = this.get("isoCode")
              , b = App.TRANSLATIONS || {}
              , c = b[a];
            return c || (c = b[a.substr(0, 2)]),
            c || (console.warn("Could not find translations for %@ - %@".fmt(this.get("isoCode"), this.get("name"))),
            c = b.en),
            c
        }
        .property("isoCodes"),
        noWordBoundaries: function() {
            return !!this.get("strings").$NO_WORD_BREAKS$
        }
        .property("strings"),
        searchDepthLimit: function() {
            return this.get("strings").$SEARCH_DEPTH_LIMIT$
        }
        .property("strings"),
        fields: function() {
            var a = this.get("isoCodes");
            return a.push(this.get("isoName")),
            a.push(this.get("name")),
            a.push(this.get("folder")),
            a
        }
        .property(),
        matches: function(a) {
            return -1 !== this.get("fields").indexOf(a)
        }
    })
}),
define("shared/config", {
    baseUrl: ""
}),
define("shared/bundle", ["shared/locale/model", "shared/browser", "shared/config"], function(a, b, c) {
    function d(a) {
        var b = /[a-z]{2}(_[a-z0-9]*)?(_[a-z0-9]{2})?\.lproj/gi.exec(a) || [];
        return b[0]
    }
    var e = Em.RSVP.Promise
      , f = c.baseUrl + "locale-list.json"
      , g = "locale-info.json";
    return Em.Object.extend({
        locales: null,
        currentLocale: null,
        init: function() {
            var a = e.cast($.getJSON(f)).then(null, function() {
                var a = Em.get("window.HelpViewer.localeList");
                return a ? e.resolve(JSON.parse(a())) : e.reject()
            }).then(null, function() {
                var a = d(b.get("params.localePath"));
                if (!a)
                    return e.reject();
                var f = c.baseUrl ? c.baseUrl + "/" : "";
                return e.cast($.getJSON("%@%@/%@".fmt(f, a, g))).then(function(b) {
                    var c = Em.merge(b.meta || b, {
                        folder: a
                    });
                    return e.resolve([c])
                }, e.reject)
            }).then(null, function() {
                return e.resolve([{
                    name: "English",
                    isoName: "English",
                    isoCodes: ["en"],
                    folder: "en.lproj",
                    "text-direction": "ltr"
                }])
            }).then($.proxy(this.setLocales, this));
            this.set("localePromise", a)
        },
        setLocales: function(b) {
            this.set("locales", b.map(function(b) {
                return a.create(b)
            }))
        },
        localeForKey: function(a) {
            var b = a.toLowerCase().replace("_", "-");
            return this.locales.find(function(a) {
                return a.matches(b)
            })
        },
        hasMultipleLocales: function() {
            return this.locales.length > 1
        }
        .property("locales"),
        setCurrentLocale: function() {
            this.set("currentLocale", b.get("locales").map(this.localeForKey, this).compact().get(0) || this.get("locales.0"))
        }
        .observes("locales"),
        path: function() {
            return c.baseUrl + this.get("currentLocale").folder + "/"
        }
        .property("currentLocale"),
        setStrings: function() {
            Em.STRINGS = this.get("currentLocale.strings")
        }
        .observes("currentLocale")
    })
}),
define("shared/slash-optional-location", [], function() {
    var a = function(a) {
        if ("string" != typeof a)
            throw new Error("route is not a string");
        return a.replace(/^[#\/]{1,2}/, "")
    };
    return Em.HashLocation.extend({
        getURL: function() {
            return a(this.get("location.hash"))
        },
        setURL: function(b) {
            b = "/" + a(b),
            this.set("location.hash", b),
            this.set("lastSetURL", b)
        }
    })
}),
define("shared/app", ["shared/app/controller", "shared/app/view", "shared/topic/view", "shared/topic/route", "shared/base/controller", "shared/bundle", "shared/slash-optional-location"], function(a, b, c, d, e, f, g) {
    return navigator.userAgent.indexOf("WebKit") >= 0 && navigator.userAgent.indexOf("Mobile") >= 0 && $("body").addClass("no-hover"),
    Ember.Application.initializer({
        name: "bundleBookLoader",
        initialize: function(a, b) {
            b.deferReadiness();
            var c = f.create()
              , d = c.get("localePromise");
            d["finally"](function() {
                b.register("bundle:main", c, {
                    instantiate: !1
                }),
                b.inject("controller:application", "bundle", "bundle:main");
                var d = a.lookup("controller:application");
                d.get("bookPromise")["finally"](function() {
                    b.advanceReadiness()
                }),
                window.TOGGLE_OMNITURE_TEST_SERVER = function() {
                    var b = a.lookup("controller:application");
                    b.set("USE_OMNITURE_TEST_SERVER", !b.get("USE_OMNITURE_TEST_SERVER"));
                    var c = b.get("USE_OMNITURE_TEST_SERVER");
                    return c
                }
            })
        }
    }),
    Em.Application.extend({
        init: function() {
            this._super(),
            this.register("location:slash-optional", g),
            this.Router.reopen({
                location: "slash-optional"
            }),
            this.Router.map(function() {
                this.resource("index", {
                    path: "/"
                }),
                this.resource("topic", {
                    path: "/*topic_id"
                })
            })
        },
        ApplicationController: a,
        ApplicationView: b,
        IndexView: c,
        IndexRoute: d,
        TopicView: c,
        TopicRoute: d,
        TopicController: e,
        IndexController: e
    })
}),
define("shared/computed", [], function() {
    function a(a, b, c) {
        return Em.computed(a, function() {
            return Em.get(this, a) ? b : c
        })
    }
    return {
        loc: function() {
            var a = Array.prototype.shift.apply(arguments)
              , b = arguments;
            return Em.computed("Em.STRINGS", function() {
                return String.prototype.loc.apply(a, b)
            })
        },
        ternaryValue: a,
        truthString: function(b) {
            return a(b, "true", "false")
        },
        invertedTruthString: function(b) {
            return a(b, "false", "true")
        }
    }
}),
define("topic/model", ["shared/browser", "shared/topic/model", "shared/computed"], function(a, b, c) {
    return b.extend({
        preProcessAsDOM: function(b) {
            b.find("a[href]").each(function() {
                var b = $(this).attr("href");
                if (!a.get("canHandleHelpAnchorLinks") && b.match(/^help:anchor/i) && $(this).replaceWith(function(a, b) {
                    return b
                }),
                !a.get("canHandleHelpOpenBookLinks") && b.match(/^help:openbook/i)) {
                    var c = $(this).parent().get(0);
                    "p" === c.tagName.toLowerCase() && c.children && 1 === c.children.length && $(this).parent().remove()
                }
            });
            var c = b.find("div.Feature");
            return 1 === c.length ? c.addClass("FeatureSingle") : c.length > 1 && c.each(function() {
                var a = $(this).find(".FeatureBody");
                $(this).attr("aria-expanded", "false"),
                a.attr("aria-hidden", !0),
                $(this).append('<button class="toggle-feature-btn"></button>')
            }),
            b.find(".itunes-link").each(function() {
                var a = $(this).find("em").text()
                  , b = $(this).find("a").text();
                a && b && ($(this).find("em").remove(),
                $(this).find("a")[0].innerHTML = "<em>" + a + "</em> " + b + '<span class="link-external"></span></a>')
            }),
            b.find("video").wrap('<div class="video-container"></div>'),
            b.find(".video-container").append('<button class="thumbnail"><span class="thumbnail-button">{{loc "$VIDEO_PLAY$"}}</span></button>'),
            this._super(b)
        }
    })
}),
define("book", ["shared/book", "topic/model"], function(a, b) {
    var c = 5;
    return a.extend({
        Topic: b,
        init: function() {
            var b = {
                4: "e3"
            };
            if (this.birdseed_version < c) {
                var d = b[this.birdseed_version];
                if (d)
                    return void window.location.replace(d + location.search + location.hash);
                var e = "The book you are trying to open uses too old of a birdseed revision. Expected %@, got %@".fmt(c, this.birdseed_version);
                throw $("body").css({
                    background: "#fdd",
                    "text-align": "center"
                }).text(e),
                new Error(e)
            }
            return a.prototype.init.apply(this, arguments)
        },
        createLinkedTopicList: function() {
            var a = this.topicsInList(this.get("toc"));
            return a[0] !== this.get("landing") && a.splice(0, 0, this.get("landing")),
            a = a.filter(function(a) {
                return !a.isUrl
            }),
            this.set("firstTopic", a[0]),
            this.set("lastTopic", a[a.length - 1]),
            a.forEach(function(b, c) {
                c > 0 && b.set("prev", a[c - 1]),
                c + 1 < a.length && b.set("next", a[c + 1])
            }),
            a
        }
    })
}),
define("precompiled/topic/layout", [], function() {
    return Ember.HTMLBars.template(function() {
        var a = function() {
            return {
                isHTMLBars: !0,
                revision: "Ember@1.11.3",
                blockParams: 0,
                cachedFragment: null,
                hasRendered: !1,
                build: function(a) {
                    var b = a.createDocumentFragment()
                      , c = a.createTextNode("        ");
                    a.appendChild(b, c);
                    var c = a.createElement("span");
                    a.setAttribute(c, "class", "chapter-name");
                    var d = a.createComment("");
                    a.appendChild(c, d),
                    a.appendChild(b, c);
                    var c = a.createTextNode("\n");
                    return a.appendChild(b, c),
                    b
                },
                render: function(a, b, c) {
                    var d = b.dom
                      , e = b.hooks
                      , f = e.content;
                    d.detectNamespace(c);
                    var g;
                    b.useFragmentCache && d.canClone ? (null === this.cachedFragment && (g = this.build(d),
                    this.hasRendered ? this.cachedFragment = g : this.hasRendered = !0),
                    this.cachedFragment && (g = d.cloneNode(this.cachedFragment, !0))) : g = this.build(d);
                    var h = d.createMorphAt(d.childAt(g, [1]), 0, 0);
                    return f(b, h, a, "content.chapterName"),
                    g
                }
            }
        }()
          , b = function() {
            return {
                isHTMLBars: !0,
                revision: "Ember@1.11.3",
                blockParams: 0,
                cachedFragment: null,
                hasRendered: !1,
                build: function(a) {
                    var b = a.createDocumentFragment()
                      , c = a.createTextNode("        ");
                    a.appendChild(b, c);
                    var c = a.createElement("div");
                    a.setAttribute(c, "class", "landing-toc-btn");
                    var d = a.createTextNode("\n          ");
                    a.appendChild(c, d);
                    var d = a.createElement("button");
                    a.setAttribute(d, "class", "toggle-toc-btn"),
                    a.appendChild(c, d);
                    var d = a.createElement("span");
                    a.setAttribute(d, "class", "toggle-toc-btn-label");
                    var e = a.createComment("");
                    a.appendChild(d, e),
                    a.appendChild(c, d),
                    a.appendChild(b, c);
                    var c = a.createTextNode("\n");
                    return a.appendChild(b, c),
                    b
                },
                render: function(a, b, c) {
                    var d = b.dom
                      , e = b.hooks
                      , f = e.subexpr
                      , g = e.concat
                      , h = e.attribute
                      , i = e.inline;
                    d.detectNamespace(c);
                    var j;
                    b.useFragmentCache && d.canClone ? (null === this.cachedFragment && (j = this.build(d),
                    this.hasRendered ? this.cachedFragment = j : this.hasRendered = !0),
                    this.cachedFragment && (j = d.cloneNode(this.cachedFragment, !0))) : j = this.build(d);
                    var k = d.childAt(j, [1])
                      , l = d.childAt(k, [1])
                      , m = d.createAttrMorph(l, "aria-label")
                      , n = d.createMorphAt(d.childAt(k, [2]), 0, 0);
                    return h(b, m, l, "aria-label", g(b, [f(b, a, "loc", ["$TOC_LABEL$"], {})])),
                    i(b, n, a, "loc", ["$TOC_LABEL$"], {}),
                    j
                }
            }
        }()
          , c = function() {
            var a = function() {
                var a = function() {
                    var a = function() {
                        return {
                            isHTMLBars: !0,
                            revision: "Ember@1.11.3",
                            blockParams: 0,
                            cachedFragment: null,
                            hasRendered: !1,
                            build: function(a) {
                                var b = a.createDocumentFragment()
                                  , c = a.createComment("");
                                return a.appendChild(b, c),
                                b
                            },
                            render: function(a, b, c) {
                                var d = b.dom
                                  , e = b.hooks
                                  , f = e.inline;
                                d.detectNamespace(c);
                                var g;
                                b.useFragmentCache && d.canClone ? (null === this.cachedFragment && (g = this.build(d),
                                this.hasRendered ? this.cachedFragment = g : this.hasRendered = !0),
                                this.cachedFragment && (g = d.cloneNode(this.cachedFragment, !0))) : g = this.build(d);
                                var h = d.createMorphAt(g, 0, 0, c);
                                return d.insertBoundary(g, null),
                                d.insertBoundary(g, 0),
                                f(b, h, a, "loc", ["$PREV_TOPIC_BUTTON_LABEL_SHORT$"], {}),
                                g
                            }
                        }
                    }();
                    return {
                        isHTMLBars: !0,
                        revision: "Ember@1.11.3",
                        blockParams: 0,
                        cachedFragment: null,
                        hasRendered: !1,
                        build: function(a) {
                            var b = a.createDocumentFragment()
                              , c = a.createComment("");
                            return a.appendChild(b, c),
                            b
                        },
                        render: function(b, c, d) {
                            var e = c.dom
                              , f = c.hooks
                              , g = f.get
                              , h = f.block;
                            e.detectNamespace(d);
                            var i;
                            c.useFragmentCache && e.canClone ? (null === this.cachedFragment && (i = this.build(e),
                            this.hasRendered ? this.cachedFragment = i : this.hasRendered = !0),
                            this.cachedFragment && (i = e.cloneNode(this.cachedFragment, !0))) : i = this.build(e);
                            var j = e.createMorphAt(i, 0, 0, d);
                            return e.insertBoundary(i, null),
                            e.insertBoundary(i, 0),
                            h(c, j, b, "link-to", ["topic", g(c, b, "content.prev")], {
                                classNames: "prev"
                            }, a, null),
                            i
                        }
                    }
                }()
                  , b = function() {
                    var a = function() {
                        return {
                            isHTMLBars: !0,
                            revision: "Ember@1.11.3",
                            blockParams: 0,
                            cachedFragment: null,
                            hasRendered: !1,
                            build: function(a) {
                                var b = a.createDocumentFragment()
                                  , c = a.createComment("");
                                return a.appendChild(b, c),
                                b
                            },
                            render: function(a, b, c) {
                                var d = b.dom
                                  , e = b.hooks
                                  , f = e.inline;
                                d.detectNamespace(c);
                                var g;
                                b.useFragmentCache && d.canClone ? (null === this.cachedFragment && (g = this.build(d),
                                this.hasRendered ? this.cachedFragment = g : this.hasRendered = !0),
                                this.cachedFragment && (g = d.cloneNode(this.cachedFragment, !0))) : g = this.build(d);
                                var h = d.createMorphAt(g, 0, 0, c);
                                return d.insertBoundary(g, null),
                                d.insertBoundary(g, 0),
                                f(b, h, a, "loc", ["$NEXT_TOPIC_BUTTON_LABEL_SHORT$"], {}),
                                g
                            }
                        }
                    }();
                    return {
                        isHTMLBars: !0,
                        revision: "Ember@1.11.3",
                        blockParams: 0,
                        cachedFragment: null,
                        hasRendered: !1,
                        build: function(a) {
                            var b = a.createDocumentFragment()
                              , c = a.createComment("");
                            return a.appendChild(b, c),
                            b
                        },
                        render: function(b, c, d) {
                            var e = c.dom
                              , f = c.hooks
                              , g = f.get
                              , h = f.block;
                            e.detectNamespace(d);
                            var i;
                            c.useFragmentCache && e.canClone ? (null === this.cachedFragment && (i = this.build(e),
                            this.hasRendered ? this.cachedFragment = i : this.hasRendered = !0),
                            this.cachedFragment && (i = e.cloneNode(this.cachedFragment, !0))) : i = this.build(e);
                            var j = e.createMorphAt(i, 0, 0, d);
                            return e.insertBoundary(i, null),
                            e.insertBoundary(i, 0),
                            h(c, j, b, "link-to", ["topic", g(c, b, "content.next")], {
                                classNames: "next"
                            }, a, null),
                            i
                        }
                    }
                }();
                return {
                    isHTMLBars: !0,
                    revision: "Ember@1.11.3",
                    blockParams: 0,
                    cachedFragment: null,
                    hasRendered: !1,
                    build: function(a) {
                        var b = a.createDocumentFragment()
                          , c = a.createTextNode("          ");
                        a.appendChild(b, c);
                        var c = a.createComment("");
                        a.appendChild(b, c);
                        var c = a.createTextNode("\n          ");
                        a.appendChild(b, c);
                        var c = a.createComment("");
                        a.appendChild(b, c);
                        var c = a.createTextNode("\n");
                        return a.appendChild(b, c),
                        b
                    },
                    render: function(c, d, e) {
                        var f = d.dom
                          , g = d.hooks
                          , h = g.get
                          , i = g.block;
                        f.detectNamespace(e);
                        var j;
                        d.useFragmentCache && f.canClone ? (null === this.cachedFragment && (j = this.build(f),
                        this.hasRendered ? this.cachedFragment = j : this.hasRendered = !0),
                        this.cachedFragment && (j = f.cloneNode(this.cachedFragment, !0))) : j = this.build(f);
                        var k = f.createMorphAt(j, 1, 1, e)
                          , l = f.createMorphAt(j, 3, 3, e);
                        return i(d, k, c, "if", [h(d, c, "content.prev")], {}, a, null),
                        i(d, l, c, "if", [h(d, c, "content.next")], {}, b, null),
                        j
                    }
                }
            }();
            return {
                isHTMLBars: !0,
                revision: "Ember@1.11.3",
                blockParams: 0,
                cachedFragment: null,
                hasRendered: !1,
                build: function(a) {
                    var b = a.createDocumentFragment()
                      , c = a.createComment("");
                    return a.appendChild(b, c),
                    b
                },
                render: function(b, c, d) {
                    var e = c.dom
                      , f = c.hooks
                      , g = f.get
                      , h = f.block;
                    e.detectNamespace(d);
                    var i;
                    c.useFragmentCache && e.canClone ? (null === this.cachedFragment && (i = this.build(e),
                    this.hasRendered ? this.cachedFragment = i : this.hasRendered = !0),
                    this.cachedFragment && (i = e.cloneNode(this.cachedFragment, !0))) : i = this.build(e);
                    var j = e.createMorphAt(i, 0, 0, d);
                    return e.insertBoundary(i, null),
                    e.insertBoundary(i, 0),
                    h(c, j, b, "if", [g(c, b, "app.book.show_previous_next")], {}, a, null),
                    i
                }
            }
        }()
          , d = function() {
            var a = function() {
                var a = function() {
                    return {
                        isHTMLBars: !0,
                        revision: "Ember@1.11.3",
                        blockParams: 0,
                        cachedFragment: null,
                        hasRendered: !1,
                        build: function(a) {
                            var b = a.createDocumentFragment()
                              , c = a.createTextNode("            ");
                            a.appendChild(b, c);
                            var c = a.createComment("");
                            a.appendChild(b, c);
                            var c = a.createTextNode("\n");
                            return a.appendChild(b, c),
                            b
                        },
                        render: function(a, b, c) {
                            var d = b.dom
                              , e = b.hooks
                              , f = e.inline;
                            d.detectNamespace(c);
                            var g;
                            b.useFragmentCache && d.canClone ? (null === this.cachedFragment && (g = this.build(d),
                            this.hasRendered ? this.cachedFragment = g : this.hasRendered = !0),
                            this.cachedFragment && (g = d.cloneNode(this.cachedFragment, !0))) : g = this.build(d);
                            var h = d.createMorphAt(g, 1, 1, c);
                            return f(b, h, a, "view", ["feedback"], {}),
                            g
                        }
                    }
                }();
                return {
                    isHTMLBars: !0,
                    revision: "Ember@1.11.3",
                    blockParams: 0,
                    cachedFragment: null,
                    hasRendered: !1,
                    build: function(a) {
                        var b = a.createDocumentFragment()
                          , c = a.createComment("");
                        return a.appendChild(b, c),
                        b
                    },
                    render: function(b, c, d) {
                        var e = c.dom
                          , f = c.hooks
                          , g = f.get
                          , h = f.block;
                        e.detectNamespace(d);
                        var i;
                        c.useFragmentCache && e.canClone ? (null === this.cachedFragment && (i = this.build(e),
                        this.hasRendered ? this.cachedFragment = i : this.hasRendered = !0),
                        this.cachedFragment && (i = e.cloneNode(this.cachedFragment, !0))) : i = this.build(e);
                        var j = e.createMorphAt(i, 0, 0, d);
                        return e.insertBoundary(i, null),
                        e.insertBoundary(i, 0),
                        h(c, j, b, "if", [g(c, b, "app.doShowFeedbackForm")], {}, a, null),
                        i
                    }
                }
            }();
            return {
                isHTMLBars: !0,
                revision: "Ember@1.11.3",
                blockParams: 0,
                cachedFragment: null,
                hasRendered: !1,
                build: function(a) {
                    var b = a.createDocumentFragment()
                      , c = a.createComment("");
                    return a.appendChild(b, c),
                    b
                },
                render: function(b, c, d) {
                    var e = c.dom
                      , f = c.hooks
                      , g = f.get
                      , h = f.block;
                    e.detectNamespace(d);
                    var i;
                    c.useFragmentCache && e.canClone ? (null === this.cachedFragment && (i = this.build(e),
                    this.hasRendered ? this.cachedFragment = i : this.hasRendered = !0),
                    this.cachedFragment && (i = e.cloneNode(this.cachedFragment, !0))) : i = this.build(e);
                    var j = e.createMorphAt(i, 0, 0, d);
                    return e.insertBoundary(i, null),
                    e.insertBoundary(i, 0),
                    h(c, j, b, "unless", [g(c, b, "content.isCopyright")], {}, a, null),
                    i
                }
            }
        }()
          , e = function() {
            var a = function() {
                var a = function() {
                    var a = function() {
                        return {
                            isHTMLBars: !0,
                            revision: "Ember@1.11.3",
                            blockParams: 0,
                            cachedFragment: null,
                            hasRendered: !1,
                            build: function(a) {
                                var b = a.createDocumentFragment()
                                  , c = a.createComment("");
                                return a.appendChild(b, c),
                                b
                            },
                            render: function(a, b, c) {
                                var d = b.dom
                                  , e = b.hooks
                                  , f = e.content;
                                d.detectNamespace(c);
                                var g;
                                b.useFragmentCache && d.canClone ? (null === this.cachedFragment && (g = this.build(d),
                                this.hasRendered ? this.cachedFragment = g : this.hasRendered = !0),
                                this.cachedFragment && (g = d.cloneNode(this.cachedFragment, !0))) : g = this.build(d);
                                var h = d.createMorphAt(g, 0, 0, c);
                                return d.insertBoundary(g, null),
                                d.insertBoundary(g, 0),
                                f(b, h, a, "app.book.copyright_text"),
                                g
                            }
                        }
                    }();
                    return {
                        isHTMLBars: !0,
                        revision: "Ember@1.11.3",
                        blockParams: 0,
                        cachedFragment: null,
                        hasRendered: !1,
                        build: function(a) {
                            var b = a.createDocumentFragment()
                              , c = a.createComment("");
                            return a.appendChild(b, c),
                            b
                        },
                        render: function(b, c, d) {
                            var e = c.dom
                              , f = c.hooks
                              , g = f.get
                              , h = f.block;
                            e.detectNamespace(d);
                            var i;
                            c.useFragmentCache && e.canClone ? (null === this.cachedFragment && (i = this.build(e),
                            this.hasRendered ? this.cachedFragment = i : this.hasRendered = !0),
                            this.cachedFragment && (i = e.cloneNode(this.cachedFragment, !0))) : i = this.build(e);
                            var j = e.createMorphAt(i, 0, 0, d);
                            return e.insertBoundary(i, null),
                            e.insertBoundary(i, 0),
                            h(c, j, b, "link-to", ["topic", g(c, b, "app.book.copyright")], {}, a, null),
                            i
                        }
                    }
                }()
                  , b = function() {
                    return {
                        isHTMLBars: !0,
                        revision: "Ember@1.11.3",
                        blockParams: 0,
                        cachedFragment: null,
                        hasRendered: !1,
                        build: function(a) {
                            var b = a.createDocumentFragment()
                              , c = a.createComment("");
                            return a.appendChild(b, c),
                            b
                        },
                        render: function(a, b, c) {
                            var d = b.dom
                              , e = b.hooks
                              , f = e.content;
                            d.detectNamespace(c);
                            var g;
                            b.useFragmentCache && d.canClone ? (null === this.cachedFragment && (g = this.build(d),
                            this.hasRendered ? this.cachedFragment = g : this.hasRendered = !0),
                            this.cachedFragment && (g = d.cloneNode(this.cachedFragment, !0))) : g = this.build(d);
                            var h = d.createMorphAt(g, 0, 0, c);
                            return d.insertBoundary(g, null),
                            d.insertBoundary(g, 0),
                            f(b, h, a, "app.book.copyright_text"),
                            g
                        }
                    }
                }();
                return {
                    isHTMLBars: !0,
                    revision: "Ember@1.11.3",
                    blockParams: 0,
                    cachedFragment: null,
                    hasRendered: !1,
                    build: function(a) {
                        var b = a.createDocumentFragment()
                          , c = a.createComment("");
                        return a.appendChild(b, c),
                        b
                    },
                    render: function(c, d, e) {
                        var f = d.dom
                          , g = d.hooks
                          , h = g.get
                          , i = g.block;
                        f.detectNamespace(e);
                        var j;
                        d.useFragmentCache && f.canClone ? (null === this.cachedFragment && (j = this.build(f),
                        this.hasRendered ? this.cachedFragment = j : this.hasRendered = !0),
                        this.cachedFragment && (j = f.cloneNode(this.cachedFragment, !0))) : j = this.build(f);
                        var k = f.createMorphAt(j, 0, 0, e);
                        return f.insertBoundary(j, null),
                        f.insertBoundary(j, 0),
                        i(d, k, c, "if", [h(d, c, "app.book.copyright")], {}, a, b),
                        j
                    }
                }
            }()
              , b = function() {
                return {
                    isHTMLBars: !0,
                    revision: "Ember@1.11.3",
                    blockParams: 0,
                    cachedFragment: null,
                    hasRendered: !1,
                    build: function(a) {
                        var b = a.createDocumentFragment()
                          , c = a.createComment("");
                        return a.appendChild(b, c),
                        b
                    },
                    render: function(a, b, c) {
                        var d = b.dom
                          , e = b.hooks
                          , f = e.content;
                        d.detectNamespace(c);
                        var g;
                        b.useFragmentCache && d.canClone ? (null === this.cachedFragment && (g = this.build(d),
                        this.hasRendered ? this.cachedFragment = g : this.hasRendered = !0),
                        this.cachedFragment && (g = d.cloneNode(this.cachedFragment, !0))) : g = this.build(d);
                        var h = d.createMorphAt(g, 0, 0, c);
                        return d.insertBoundary(g, null),
                        d.insertBoundary(g, 0),
                        f(b, h, a, "app.book.copyright_text"),
                        g
                    }
                }
            }();
            return {
                isHTMLBars: !0,
                revision: "Ember@1.11.3",
                blockParams: 0,
                cachedFragment: null,
                hasRendered: !1,
                build: function(a) {
                    var b = a.createDocumentFragment()
                      , c = a.createTextNode("        ");
                    a.appendChild(b, c);
                    var c = a.createElement("div");
                    a.setAttribute(c, "class", "copyright-text");
                    var d = a.createComment("");
                    a.appendChild(c, d),
                    a.appendChild(b, c);
                    var c = a.createTextNode("\n");
                    return a.appendChild(b, c),
                    b
                },
                render: function(c, d, e) {
                    var f = d.dom
                      , g = d.hooks
                      , h = g.get
                      , i = g.block;
                    f.detectNamespace(e);
                    var j;
                    d.useFragmentCache && f.canClone ? (null === this.cachedFragment && (j = this.build(f),
                    this.hasRendered ? this.cachedFragment = j : this.hasRendered = !0),
                    this.cachedFragment && (j = f.cloneNode(this.cachedFragment, !0))) : j = this.build(f);
                    var k = f.createMorphAt(f.childAt(j, [1]), 0, 0);
                    return i(d, k, c, "if", [h(d, c, "content.isLanding")], {}, a, b),
                    j
                }
            }
        }()
          , f = function() {
            var a = function() {
                return {
                    isHTMLBars: !0,
                    revision: "Ember@1.11.3",
                    blockParams: 0,
                    cachedFragment: null,
                    hasRendered: !1,
                    build: function(a) {
                        var b = a.createDocumentFragment()
                          , c = a.createTextNode("          ");
                        a.appendChild(b, c);
                        var c = a.createElement("div");
                        a.setAttribute(c, "class", "language");
                        var d = a.createTextNode("\n            ");
                        a.appendChild(c, d);
                        var d = a.createElement("div");
                        a.setAttribute(d, "class", "cur-lang");
                        var e = a.createElement("span");
                        a.setAttribute(e, "class", "lang-icon"),
                        a.appendChild(d, e);
                        var e = a.createTextNode(" ");
                        a.appendChild(d, e);
                        var e = a.createComment("");
                        a.appendChild(d, e),
                        a.appendChild(c, d);
                        var d = a.createTextNode("\n          ");
                        a.appendChild(c, d),
                        a.appendChild(b, c);
                        var c = a.createTextNode("\n");
                        return a.appendChild(b, c),
                        b
                    },
                    render: function(a, b, c) {
                        var d = b.dom
                          , e = b.hooks
                          , f = e.content;
                        d.detectNamespace(c);
                        var g;
                        b.useFragmentCache && d.canClone ? (null === this.cachedFragment && (g = this.build(d),
                        this.hasRendered ? this.cachedFragment = g : this.hasRendered = !0),
                        this.cachedFragment && (g = d.cloneNode(this.cachedFragment, !0))) : g = this.build(d);
                        var h = d.createMorphAt(d.childAt(g, [1, 1]), 2, 2);
                        return f(b, h, a, "app.bundle.currentLocale.name"),
                        g
                    }
                }
            }();
            return {
                isHTMLBars: !0,
                revision: "Ember@1.11.3",
                blockParams: 0,
                cachedFragment: null,
                hasRendered: !1,
                build: function(a) {
                    var b = a.createDocumentFragment()
                      , c = a.createComment("");
                    return a.appendChild(b, c),
                    b
                },
                render: function(b, c, d) {
                    var e = c.dom
                      , f = c.hooks
                      , g = f.get
                      , h = f.block;
                    e.detectNamespace(d);
                    var i;
                    c.useFragmentCache && e.canClone ? (null === this.cachedFragment && (i = this.build(e),
                    this.hasRendered ? this.cachedFragment = i : this.hasRendered = !0),
                    this.cachedFragment && (i = e.cloneNode(this.cachedFragment, !0))) : i = this.build(e);
                    var j = e.createMorphAt(i, 0, 0, d);
                    return e.insertBoundary(i, null),
                    e.insertBoundary(i, 0),
                    h(c, j, b, "if", [g(c, b, "app.bundle.hasMultipleLocales")], {}, a, null),
                    i
                }
            }
        }();
        return {
            isHTMLBars: !0,
            revision: "Ember@1.11.3",
            blockParams: 0,
            cachedFragment: null,
            hasRendered: !1,
            build: function(a) {
                var b = a.createDocumentFragment()
                  , c = a.createElement("article");
                a.setAttribute(c, "class", "instapaper_ignore");
                var d = a.createTextNode("\n  ");
                a.appendChild(c, d);
                var d = a.createElement("div");
                a.setAttribute(d, "class", "topic-container");
                var e = a.createTextNode("\n    ");
                a.appendChild(d, e);
                var e = a.createElement("div")
                  , f = a.createTextNode("\n");
                a.appendChild(e, f);
                var f = a.createComment("");
                a.appendChild(e, f);
                var f = a.createTextNode("\n      ");
                a.appendChild(e, f);
                var f = a.createComment("");
                a.appendChild(e, f);
                var f = a.createTextNode("\n\n");
                a.appendChild(e, f);
                var f = a.createComment("");
                a.appendChild(e, f);
                var f = a.createTextNode("\n");
                a.appendChild(e, f);
                var f = a.createComment("");
                a.appendChild(e, f);
                var f = a.createTextNode("\n");
                a.appendChild(e, f);
                var f = a.createComment("");
                a.appendChild(e, f);
                var f = a.createTextNode("\n");
                a.appendChild(e, f);
                var f = a.createComment("");
                a.appendChild(e, f);
                var f = a.createTextNode("\n");
                a.appendChild(e, f);
                var f = a.createComment("");
                a.appendChild(e, f);
                var f = a.createTextNode("    ");
                a.appendChild(e, f),
                a.appendChild(d, e);
                var e = a.createTextNode("\n  ");
                a.appendChild(d, e),
                a.appendChild(c, d);
                var d = a.createTextNode("\n");
                a.appendChild(c, d),
                a.appendChild(b, c);
                var c = a.createTextNode("\n");
                return a.appendChild(b, c),
                b
            },
            render: function(g, h, i) {
                var j = h.dom
                  , k = h.hooks
                  , l = k.get
                  , m = k.concat
                  , n = k.attribute
                  , o = k.block
                  , p = k.content;
                j.detectNamespace(i);
                var q;
                h.useFragmentCache && j.canClone ? (null === this.cachedFragment && (q = this.build(j),
                this.hasRendered ? this.cachedFragment = q : this.hasRendered = !0),
                this.cachedFragment && (q = j.cloneNode(this.cachedFragment, !0))) : q = this.build(j);
                var r = j.childAt(q, [0, 1, 1])
                  , s = j.createMorphAt(r, 1, 1)
                  , t = j.createMorphAt(r, 3, 3)
                  , u = j.createMorphAt(r, 5, 5)
                  , v = j.createMorphAt(r, 7, 7)
                  , w = j.createMorphAt(r, 9, 9)
                  , x = j.createMorphAt(r, 11, 11)
                  , y = j.createMorphAt(r, 13, 13)
                  , z = j.createAttrMorph(r, "class");
                return n(h, z, r, "class", m(h, ["topic-page ", l(h, g, "view.categories")])),
                o(h, s, g, "unless", [l(h, g, "content.isLanding")], {}, a, null),
                p(h, t, g, "yield"),
                o(h, u, g, "if", [l(h, g, "content.isLanding")], {}, b, null),
                o(h, v, g, "unless", [l(h, g, "content.isLanding")], {}, c, null),
                o(h, w, g, "unless", [l(h, g, "content.isError")], {}, d, null),
                o(h, x, g, "unless", [l(h, g, "content.isCopyright")], {}, e, null),
                o(h, y, g, "unless", [l(h, g, "app.isInHelpViewer")], {}, f, null),
                q
            }
        }
    }())
}),
define("shared/mixin/space-click", [], function() {
    return Em.Mixin.create({
        keyDown: function(a) {
            32 === a.keyCode && $(a.target).click(),
            this._super(a)
        }
    })
}),
define("topic/view", ["shared/topic/view", "precompiled/topic/layout", "shared/browser", "shared/computed", "shared/mixin/space-click"], function(a, b, c, d, e) {
    return a.extend(e, {
        layout: b,
        tagName: "section",
        ariaRole: "main",
        classNameBindings: ["controller.app.isTOCVisible:toc-visible"],
        attributeBindings: ["ariaHidden:aria-hidden"],
        ariaHidden: d.truthString("controller.app.isTopicConcealed"),
        TYPE_TASK: "task",
        TYPE_PP: "pp",
        STRING_PAUSE: "Pause video",
        STRING_PLAY: "Play video",
        STRING_REPLAY: "Replay video",
        categories: function() {
            return this.get("content.categories").join(" ")
        }
        .property("content"),
        click: function(a) {
            var b = $(a.target)
              , c = this.get("controller.app")
              , d = !1;
            (b.is(".toc-toggle a") || b.is(".landing-toc-btn")) && (c.manuallyToggleTOC(),
            c.get("trackingController").toggleTOC("event31"),
            d = !0);
            var e;
            if (b.is(".task-arrow, .Task > .Name") && (e = b.parents(".Task")),
            e && !e.hasClass("SoloTask")) {
                var f;
                a.altKey && (f = "false" === e.find(".Name").attr("aria-expanded"),
                e = $(".AppleTopic div.Task"));
                var g = this;
                e.each(function() {
                    g.toggleDisclosableElement(g.TYPE_TASK, $(this), !0, f)
                })
            }
            var h;
            b.is(".toggle-feature-btn") ? h = b.parents(".Feature") : b.parent().is(".Feature[aria-expanded=false]") ? h = b.parent() : b.is(".Feature[aria-expanded=false]") && (h = b),
            h && this.toggleDisclosableElement(this.TYPE_PP, h, !0),
            b.is(".next, .prev") && c.get("trackingController").nextPrev("ui"),
            b.is(".video-container .thumbnail") && (this.handleVideoPlayerEvents(b.parent().find("video")[0]),
            d = !0),
            d || this._super(a)
        },
        touchMove: function() {
            var a = this.get("controller.app");
            a.get("isTOCVisible") && a.hidePanels()
        },
        aside: function() {
            return this.get("controller.app.aside")
        }
        .property(),
        localePicker: function() {
            return this.get("controller.app.localePicker")
        }
        .property(),
        showAside: function(a) {
            this.get("controller.app.aside").showTopic(a)
        },
        hideAside: function() {
            this.get("controller.app.aside").dismiss()
        }
        .observes("content"),
        showLocalePicker: function() {
            this.get("controller.app.localePicker").show()
        },
        toggleDisclosableElement: function(a, b, c, d) {
            var e = a === this.TYPE_TASK ? this.$().find(".Task > .Name") : this.$().find(".Feature > .Name")
              , f = b.find(".Name")
              , g = a === this.TYPE_TASK ? b.find(".TaskBody") : b.find(".FeatureBody")
              , h = void 0 !== d ? !d : "true" === f.attr("aria-expanded");
            h || g.css("display", "block");
            var i = g[0].scrollHeight
              , j = i * (a === this.TYPE_TASK ? .75 : .375);
            g.css("max-height", i);
            var k = function() {
                c && (g.css("transition", "max-height " + j + "ms ease-in-out, opacity 200ms " + j / 2 + "ms ease-in-out"),
                g.addClass("animating")),
                g.attr("aria-hidden", h),
                f.attr("aria-expanded", !h),
                a === this.TYPE_PP && b.attr("aria-expanded", !h)
            }
            .bind(this);
            c ? requestAnimationFrame(k) : k(),
            setTimeout(function() {
                g.removeClass("animating"),
                g.css("max-height", "unset"),
                h && g.css("display", "none")
            }, j);
            var l = b.attr("id") + "-is-expanded";
            if (h)
                try {
                    window.sessionStorage.removeItem(l)
                } catch (m) {}
            else {
                window.sessionStorage.setItem(l, "true");
                var n = this.get("controller.app");
                n.get("trackingController").expansion(b.attr("id"), n.get("currentTopic"), f.text(), e.index(f), a === this.TYPE_TASK ? "event17" : "event16")
            }
        },
        restoreTaskState: function() {
            var a = this.$().find(".Task > .Name").parent(".Task")
              , b = this;
            a.length > 1 && a.each(function() {
                var a = $(this)
                  , c = !1;
                try {
                    c = "true" === window.sessionStorage.getItem(a.attr("id") + "-is-expanded")
                } catch (d) {}
                b.toggleDisclosableElement(b.TYPE_TASK, a, !1, c)
            })
        },
        restoreFeatureState: function() {
            var a = this.$(".Feature")
              , b = this;
            a.length > 1 && a.each(function() {
                var a = $(this)
                  , c = !1;
                try {
                    c = "true" === window.sessionStorage.getItem(a.attr("id") + "-is-expanded")
                } catch (d) {}
                b.toggleDisclosableElement(b.TYPE_PP, a, !1, c)
            })
        },
        handleVideoPlayerEvents: function(a, b) {
            var c = $(a).parent()
              , d = c.find("button .thumbnail-button");
            a && (b ? (d.text(this.STRING_REPLAY),
            c.attr("data-state", "ended")) : a.paused ? (a.play(),
            d.text(this.STRING_PAUSE),
            c.attr("data-state", "playing")) : (a.pause(),
            d.text(this.STRING_PLAY),
            c.attr("data-state", "paused")))
        },
        didInsertElement: function() {
            this._super();
            var a = this.get("controller.app");
            a.get("book.isSingleTopicBook") && this.$(".landing").removeClass("landing");
            var b = Math.floor(569 * .8)
              , d = parseInt(this.$(".landing img").width(), 10);
            this.$(".AppleTopic.landing figure").css("min-width", "%@px".fmt(Math.min(b, d))),
            this.updateDocumentTitle(),
            this.restoreTaskState(),
            this.restoreFeatureState(),
            this.$() && this.$().find("h1").focus(),
            c.isTablet && this.set("scrollFix", new ScrollFix(this.get("element"))),
            this.$(".PassionPoints .Feature a[href].xRef").one("click", function(b) {
                var c = $(b.target);
                a.get("trackingController").trackPassionPointClick(a.get("currentTopic"), c.text(), c.attr("href").split("#/")[1])
            }),
            this.$(".landing-toc-btn").detach().insertAfter(".PassionPoints .Hero"),
            this.$("video").attr("controls", !1);
            var e = this;
            this.$("video").bind("ended", function(a) {
                e.handleVideoPlayerEvents(a.target, !0)
            })
        },
        willDestroyElement: function() {
            this._super();
            var a = this.get("scrollFix");
            a && a.destroy(),
            this.$(".PassionPoints .Feature a[href].xRef").off()
        }
    })
}),
define("precompiled/component/modal", [], function() {
    return Ember.HTMLBars.template(function() {
        return {
            isHTMLBars: !0,
            revision: "Ember@1.11.3",
            blockParams: 0,
            cachedFragment: null,
            hasRendered: !1,
            build: function(a) {
                var b = a.createDocumentFragment()
                  , c = a.createElement("div");
                a.setAttribute(c, "class", "modal-header");
                var d = a.createElement("h2")
                  , e = a.createComment("");
                a.appendChild(d, e),
                a.appendChild(c, d),
                a.appendChild(b, c);
                var c = a.createTextNode("\n");
                a.appendChild(b, c);
                var c = a.createElement("div");
                a.setAttribute(c, "class", "modal-content scroll");
                var d = a.createTextNode("\n	");
                a.appendChild(c, d);
                var d = a.createElement("button");
                a.setAttribute(d, "name", "close");
                var e = a.createComment("");
                a.appendChild(d, e),
                a.appendChild(c, d);
                var d = a.createTextNode("\n	");
                a.appendChild(c, d);
                var d = a.createComment("");
                a.appendChild(c, d);
                var d = a.createTextNode("\n");
                a.appendChild(c, d),
                a.appendChild(b, c);
                var c = a.createTextNode("\n");
                a.appendChild(b, c);
                var c = a.createElement("div");
                a.setAttribute(c, "class", "modal-footer");
                var d = a.createTextNode("\n	");
                a.appendChild(c, d);
                var d = a.createElement("button");
                a.setAttribute(d, "name", "close");
                var e = a.createComment("");
                a.appendChild(d, e),
                a.appendChild(c, d);
                var d = a.createTextNode("\n");
                a.appendChild(c, d),
                a.appendChild(b, c);
                var c = a.createTextNode("\n");
                return a.appendChild(b, c),
                b
            },
            render: function(a, b, c) {
                var d = b.dom
                  , e = b.hooks
                  , f = e.content
                  , g = e.inline;
                d.detectNamespace(c);
                var h;
                b.useFragmentCache && d.canClone ? (null === this.cachedFragment && (h = this.build(d),
                this.hasRendered ? this.cachedFragment = h : this.hasRendered = !0),
                this.cachedFragment && (h = d.cloneNode(this.cachedFragment, !0))) : h = this.build(d);
                var i = d.childAt(h, [2])
                  , j = d.createMorphAt(d.childAt(h, [0, 0]), 0, 0)
                  , k = d.createMorphAt(d.childAt(i, [1]), 0, 0)
                  , l = d.createMorphAt(i, 3, 3)
                  , m = d.createMorphAt(d.childAt(h, [4, 1]), 0, 0);
                return f(b, j, a, "view.headerLabel"),
                g(b, k, a, "loc", ["$MODAL_CLOSE_BUTTON$"], {}),
                f(b, l, a, "yield"),
                g(b, m, a, "loc", ["$MODAL_CLOSE_BUTTON$"], {}),
                h
            }
        }
    }())
}),
define("component/modal", ["precompiled/component/modal", "shared/computed"], function(a, b) {
    return Em.Mixin.create({
        layout: a,
        tagName: "div",
        classNames: ["modal"],
        ariaRole: "dialog",
        isVisible: !1,
        ariaHidden: b.invertedTruthString("isVisible"),
        attributeBindings: ["ariaHidden:aria-hidden"],
        headerLabel: null,
        $previousFocus: null,
        click: function(a) {
            var b = $(a.target);
            (this.$().is(a.target) || b.is("[name=close]")) && this.dismiss(),
            this._super(a)
        },
        show: function() {
            this.$().toggleClass("has-modal-header", !Em.isEmpty(this.get("headerLabel"))),
            this.set("$previousFocus", $(":focus")),
            this.set("isVisible", !0),
            $("html").addClass("modal-view")
        },
        dismiss: function() {
            var a = this.$();
            a && this.get("isVisible") && (a.addClass("dismiss"),
            Em.run.later(this, function() {
                this.set("isVisible", !1),
                this.get("$previousFocus") && this.get("$previousFocus").focus(),
                this.set("$previousFocus", null),
                a.removeClass("dismiss"),
                $("html").removeClass("modal-view")
            }, 250))
        },
        touchEnabled: function() {
            return !!("ontouchstart"in window)
        }
        .property()
    })
}),
define("precompiled/aside/layout", [], function() {
    return Ember.HTMLBars.template(function() {
        return {
            isHTMLBars: !0,
            revision: "Ember@1.11.3",
            blockParams: 0,
            cachedFragment: null,
            hasRendered: !1,
            build: function(a) {
                var b = a.createDocumentFragment()
                  , c = a.createElement("div");
                a.setAttribute(c, "class", "hv-close-btn");
                var d = a.createTextNode("\n	");
                a.appendChild(c, d);
                var d = a.createElement("button");
                a.setAttribute(d, "name", "close");
                var e = a.createComment("");
                a.appendChild(d, e),
                a.appendChild(c, d);
                var d = a.createTextNode("\n");
                a.appendChild(c, d),
                a.appendChild(b, c);
                var c = a.createTextNode("\n");
                a.appendChild(b, c);
                var c = a.createElement("div");
                a.setAttribute(c, "class", "modal-content scroll");
                var d = a.createTextNode("\n	");
                a.appendChild(c, d);
                var d = a.createComment("");
                a.appendChild(c, d);
                var d = a.createTextNode("\n");
                a.appendChild(c, d),
                a.appendChild(b, c);
                var c = a.createTextNode("\n");
                a.appendChild(b, c);
                var c = a.createElement("div");
                a.setAttribute(c, "class", "modal-footer");
                var d = a.createTextNode("\n	");
                a.appendChild(c, d);
                var d = a.createElement("button");
                a.setAttribute(d, "name", "close");
                var e = a.createComment("");
                a.appendChild(d, e),
                a.appendChild(c, d);
                var d = a.createTextNode("\n");
                a.appendChild(c, d),
                a.appendChild(b, c);
                var c = a.createTextNode("\n");
                return a.appendChild(b, c),
                b
            },
            render: function(a, b, c) {
                var d = b.dom
                  , e = b.hooks
                  , f = e.inline
                  , g = e.content;
                d.detectNamespace(c);
                var h;
                b.useFragmentCache && d.canClone ? (null === this.cachedFragment && (h = this.build(d),
                this.hasRendered ? this.cachedFragment = h : this.hasRendered = !0),
                this.cachedFragment && (h = d.cloneNode(this.cachedFragment, !0))) : h = this.build(d);
                var i = d.createMorphAt(d.childAt(h, [0, 1]), 0, 0)
                  , j = d.createMorphAt(d.childAt(h, [2]), 1, 1)
                  , k = d.createMorphAt(d.childAt(h, [4, 1]), 0, 0);
                return f(b, i, a, "loc", ["$MODAL_CLOSE_BUTTON$"], {}),
                g(b, j, a, "yield"),
                f(b, k, a, "loc", ["$MODAL_CLOSE_BUTTON$"], {}),
                h
            }
        }
    }())
}),
define("aside/view", ["topic/view", "component/modal", "precompiled/aside/layout", "shared/base/controller", "shared/browser"], function(a, b, c, d, e) {
    return a.extend(b, {
        tagName: "aside",
        classNameBindings: ["controller.app.isTOCVisible:toc-visible"],
        attributeBindings: ["controller.model.id:aria-labelledby"],
        layout: c,
        didInsertElement: function() {
            this._super(),
            e.get("isMobile") && this.set("scrollFix", new ScrollFix(this.$(".modal-content")[0]))
        },
        willDestroyElement: function() {
            e.get("isMobile") && this.get("scrollFix").destroy()
        },
        dismiss: function() {
            this.set("controller.content", null),
            this._super()
        },
        showTopic: function(a) {
            var b = this;
            a.fetchTopicHTML()["finally"](function() {
                b.set("template", Em.Handlebars.compile(a.template)),
                b.set("content", a),
                b.rerender(),
                b.show(),
                b.get("controller.app.trackingController").topicLoaded(a)
            })
        },
        updateDocumentTitle: function() {
            return !1
        }
    })
}),
define("precompiled/locale/select-view", [], function() {
    return Ember.HTMLBars.template(function() {
        var a = function() {
            return {
                isHTMLBars: !0,
                revision: "Ember@1.11.3",
                blockParams: 0,
                cachedFragment: null,
                hasRendered: !1,
                build: function(a) {
                    var b = a.createDocumentFragment()
                      , c = a.createTextNode("	");
                    a.appendChild(b, c);
                    var c = a.createElement("li");
                    a.setAttribute(c, "role", "link");
                    var d = a.createComment("");
                    a.appendChild(c, d),
                    a.appendChild(b, c);
                    var c = a.createTextNode("\n");
                    return a.appendChild(b, c),
                    b
                },
                render: function(a, b, c) {
                    var d = b.dom
                      , e = b.hooks
                      , f = e.get
                      , g = e.concat
                      , h = e.attribute
                      , i = e.content;
                    d.detectNamespace(c);
                    var j;
                    b.useFragmentCache && d.canClone ? (null === this.cachedFragment && (j = this.build(d),
                    this.hasRendered ? this.cachedFragment = j : this.hasRendered = !0),
                    this.cachedFragment && (j = d.cloneNode(this.cachedFragment, !0))) : j = this.build(d);
                    var k = d.childAt(j, [1])
                      , l = d.createMorphAt(k, 0, 0)
                      , m = d.createAttrMorph(k, "data-value");
                    return h(b, m, k, "data-value", g(b, [f(b, a, "locale.isoCode")])),
                    i(b, l, a, "locale.name"),
                    j
                }
            }
        }();
        return {
            isHTMLBars: !0,
            revision: "Ember@1.11.3",
            blockParams: 0,
            cachedFragment: null,
            hasRendered: !1,
            build: function(a) {
                var b = a.createDocumentFragment()
                  , c = a.createElement("ul");
                a.setAttribute(c, "role", "group");
                var d = a.createTextNode("\n");
                a.appendChild(c, d);
                var d = a.createComment("");
                a.appendChild(c, d),
                a.appendChild(b, c);
                var c = a.createTextNode("\n");
                return a.appendChild(b, c),
                b
            },
            render: function(b, c, d) {
                var e = c.dom
                  , f = c.hooks
                  , g = f.get
                  , h = f.block;
                e.detectNamespace(d);
                var i;
                c.useFragmentCache && e.canClone ? (null === this.cachedFragment && (i = this.build(e),
                this.hasRendered ? this.cachedFragment = i : this.hasRendered = !0),
                this.cachedFragment && (i = e.cloneNode(this.cachedFragment, !0))) : i = this.build(e);
                var j = e.createMorphAt(e.childAt(i, [0]), 1, 1);
                return h(c, j, b, "each", [g(c, b, "view.locales")], {
                    keyword: "locale"
                }, a, null),
                i
            }
        }
    }())
}),
define("locale/select-view", ["component/modal", "precompiled/locale/select-view", "shared/computed"], function(a, b, c) {
    return Em.View.extend(a, {
        template: b,
        classNames: ["language-picker"],
        headerLabel: c.loc("$LANGUAGE_MENU_LABEL$"),
        locales: function() {
            return this.get("app.bundle.locales")
        }
        .property("app.bundle"),
        click: function(a) {
            this._super(a);
            var b = $(a.target)
              , c = b.attr("data-value");
            c && (location.search = "lang=%@".fmt(c),
            this.dismiss())
        }
    })
}),
define("search/term-match-model", [], function() {
    return Em.Object.extend({
        topic: null,
        weight: null
    })
}),
define("search/weighted-topic-model", ["require", "exports", "module"], function(a, b) {
    return Em.Object.extend({
        topic: null,
        weight: null,
        addMatch: function(a) {
            this.weight += a.weight
        }
    })
}),
define("search/result-model", ["search/weighted-topic-model"], function(a) {
    return Em.Object.extend({
        query: "",
        matches: [],
        sortedTopics: function() {
            var b, c, d = {};
            return this.get("matches").forEach(function(b) {
                var c = b.topic.get("id")
                  , e = d[c];
                e ? e.addMatch(b) : d[c] = a.create({
                    topic: b.topic,
                    weight: b.weight
                })
            }, this),
            b = $.map(d, function(a, b) {
                return a
            }),
            c = b.sort(function(a, b) {
                return b.weight - a.weight
            }),
            $.map(c, function(a) {
                return a.topic
            })
        }
        .property("matches")
    })
});
var idKey = "$"
  , childrenKey = "_";
define("search/index-model", ["search/term-match-model", "search/result-model"], function(a, b) {
    function c(a) {
        return a && a.length > 0
    }
    var d = function(b) {
        if (!b.matches || b.matches.length < 1) {
            b.matches = [];
            var c = b[idKey];
            for (var d in c)
                b.matches.push(a.create({
                    topic: this.get("app.book").modelForID(d),
                    weight: c[d]
                }));
            delete b[idKey]
        }
        return b.matches
    }
      , e = function(a, b) {
        return (b || []).concat(d.call(this, a))
    }
      , f = function(a, b, c) {
        if (c && !(0 >= a)) {
            var d = f.bind(this, a - 1, b)
              , e = c[childrenKey] || [];
            return b.call(this, c, $.map(e, d))
        }
    }
      , g = {}
      , h = /[\u0901-\u0903\u093c\u093e-\u0949\u094a-\u094d\u0951-\u0954\u0962\u0963]+/
      , i = Em.Object.extend({
        searchTree: {},
        minimumTermLength: 3,
        searchDepthLimit: 8,
        noWordBoundaries: !1,
        shouldIgnoreString: function(a) {
            return a && !!a.match(h)
        },
        nodesForQuery: function(a) {
            function b() {
                var a = f.get("searchTree." + childrenKey);
                return a ? a[e] : void 0
            }
            var c = a.length - 1
              , d = a.substring(0, c)
              , e = a.substring(c)
              , f = this;
            if (0 >= c)
                return [b()];
            var h = [].concat(f.nodesForQuery(d))
              , i = h[h.length - 1];
            return i && i[childrenKey] && i[childrenKey][e] ? h[h.length - 1] = i[childrenKey][e] : f.noWordBoundaries ? h.push(b()) : "." === e ? h.push(f.get("searchTree")) : f.shouldIgnoreString(e) || (h[h.length - 1] = g),
            h
        },
        resultForQuery: function(a) {
            var d = a.toLocaleLowerCase().split(/\s+/).filter(c)
              , g = $.map(d, this.nodesForQuery.bind(this))
              , h = f.bind(this, this.searchDepthLimit, e)
              , i = $.map(g, h);
            return b.create({
                query: a,
                matches: i
            })
        }
    });
    return i
}),
define("app/controller", ["shared/app/controller", "book", "aside/view", "locale/select-view", "search/index-model", "shared/browser", "shared/base/controller"], function(a, b, c, d, e, f, g) {
    return a.extend({
        NAME: "eagle",
        Book: b,
        isTOCVisible: !1,
        disablePersistentTOC: !1,
        isSearchVisible: !1,
        queryParams: ["sub"],
        sub: null,
        windowSize: Em.Object.create({
            height: $(window).height(),
            width: $(window).width()
        }),
        updateWindowSize: function() {
            this.set("windowSize", Em.Object.create({
                height: $(window).height(),
                width: $(window).width()
            }))
        },
        isFullWidthPanels: function() {
            return !f.isInModernHelpViewer && this.get("windowSize.width") < 568
        }
        .property("windowSize"),
        isPersistentTOC: function() {
            return !f.isInModernHelpViewer && this.get("windowSize.width") >= 875 && !this.get("disablePersistentTOC")
        }
        .property("windowSize"),
        updateTOCVisibility: function() {
            this.set("isTOCVisible", this.get("isPersistentTOC"))
        }
        .observes("isPersistentTOC"),
        isTopicConcealed: function() {
            var a = this.get("isFullWidthPanels") && this.get("isTOCVisible")
              , b = this.get("isFullWidthPanels") && this.get("isSearchVisible");
            return a || b || this.get("aside.isVisible") || this.get("localePicker.isVisible")
        }
        .property("isFullWidthPanels", "isTOCVisible", "isSearchVisible", "aside.isVisible", "localePicker.isVisible"),
        isInHelpViewer: f.isInHelpViewer,
        isInOlderHelpViewer: f.isInOldHelpViewer,
        isInModernHelpViewer: f.isInModernHelpViewer,
        doShowMoreHelpLink: function() {
            var a = f.isInModernHelpViewer && "machelp" !== this.get("book.product");
            return $("body").toggleClass("show-more-help-link", a),
            a
        }
        .property("book.product"),
        doShowAlternateTOCButton: function() {
            return this.get("isInOlderHelpViewer") && !this.get("isTOCDisabled")
        }
        .property("isTOCDisabled"),
        isOnLine: navigator.onLine,
        doShowFeedbackForm: function() {
            return this.get("book.collect_feedback") && this.get("isOnLine")
        }
        .property("book.collect_feedback", "isOnLine"),
        isHeaderDisabled: f.isInHelpViewer,
        isTOCDisabled: function() {
            return this.get("book.isSingleTopicBook")
        }
        .property("book.isSingleTopicBook"),
        isSearchDisabled: function() {
            return f.isInHelpViewer || this.get("book.isSingleTopicBook") || !this.get("searchIndex")
        }
        .property("book.isSingleTopicBook", "searchIndex"),
        isOnPassionPointsPage: function() {
            return this.get("currentTopic.isPassionPoints")
        }
        .property("currentTopic", "book"),
        updateSingleTopicBookClassNameOnBody: function() {
            this.get("book.isSingleTopicBook") && $("body").addClass("single-page-book")
        }
        .observes("book").on("init"),
        updateHelpViewerTOCButton: function() {
            if (f.isInModernHelpViewer)
                if (this.get("book.isSingleTopicBook"))
                    HelpViewer.showTOCButton(!1),
                    this.set("isTOCVisible", !1);
                else {
                    HelpViewer.showTOCButton(!0, function() {
                        this.helpViewerTOCButtonCallback()
                    }
                    .bind(this), function() {
                        this.helpViewerTOCButtonCallback()
                    }
                    .bind(this));
                    try {
                        var a = window.sessionStorage.getItem("toc");
                        "true" === a && this.set("isTOCVisible", !0)
                    } catch (b) {}
                }
        }
        .observes("book").on("init"),
        showTOCOnLandingPage: function() {
            !this.get("isOnLandingPage") || this.get("isOnPassionPointsPage") || this.get("isTOCVisible") || this.get("isTOCDisabled") || f.get("isMobile") || f.isInModernHelpViewer || Em.run.later(this, function() {
                this.get("isTOCVisible") || this.get("isSearchVisible") || this.toggleTOC()
            }, 1250)
        }
        .observes("isOnLandingPage"),
        aside: function() {
            return c.create({
                controller: g.create({
                    container: App.__container__
                })
            })
        }
        .property(),
        localePicker: function() {
            return d.create({
                app: this
            })
        }
        .property(),
        hidePanels: function() {
            this._super(),
            f.isInModernHelpViewer || (!this.get("isPersistentTOC") && this.get("isTOCVisible") && this.toggleTOC(),
            this.set("isSearchVisible", !1))
        },
        manuallyToggleTOC: function() {
            this.toggleTOC(),
            this.set("disablePersistentTOC", !this.get("isTOCVisible"))
        },
        toggleTOC: function() {
            if (!this.get("book.isSingleTopicBook")) {
                $("html").addClass("toc-animating");
                var a = this.toggleProperty("isTOCVisible");
                if (Em.run.later(function() {
                    $("html").removeClass("toc-animating")
                }, 300),
                f.isInModernHelpViewer) {
                    try {
                        window.sessionStorage.setItem("toc", a)
                    } catch (b) {}
                    var c = 390
                      , d = c + 190;
                    document.width <= d && ("resizeTo"in HelpViewer ? HelpViewer.resizeTo(a ? d : c, 0, .3, "easeInEaseOut") : window.resizeTo(a ? d : c))
                }
            }
        },
        helpViewerTOCButtonCallback: function() {
            this.toggleTOC(),
            this.get("aside").dismiss()
        },
        toggleSearch: function() {
            this.toggleProperty("isSearchVisible")
        },
        searchVisibleChanged: function() {
            this.get("isSearchVisible") ? (this.get("isPersistentTOC") || this.set("isTOCVisible", !1),
            this.focusSearch(),
            this.animateTransitionClass("#header-content", "searchshow")) : (this.blurSearch(),
            this.animateTransitionClass("#header-content", "searchhide"),
            this.clearSearch())
        }
        .observes("isSearchVisible"),
        animateTransitionClass: function(a, b, c) {
            c = c || 1e3,
            Ember.run.later(this, function() {
                $(a).addClass(b)
            }, 0),
            Ember.run.later(this, function() {
                $(a + "." + b).removeClass(b)
            }, c)
        },
        panelObserver: function() {
            this.get("$html").toggleClass("panel-visible", this.get("isTOCVisible") && !this.get("isPersistentTOC") || this.get("isSearchVisible"))
        }
        .observes("isTOCVisible", "isSearchVisible", "isPersistentTOC"),
        scrollToSubtopic: function() {
            var a = "?sub=";
            if (window.location.hash.indexOf(a) >= 0) {
                var b = window.location.hash.split(a)[1];
                b && this.scrollToEl(b)
            }
        },
        scrollToEl: function(a) {
            var b = $("#" + a);
            if (b && b.get(0) && ("msie" === f.get("name") ? b.scrollintoview() : b.get(0).scrollIntoView(),
            b.hasClass("Task"))) {
                var c = b.children().first();
                c && "false" === c.attr("aria-expanded") && Em.run.next(function() {
                    b.children().first().trigger("click")
                })
            }
        },
        searchIndex: null,
        searchString: "",
        searchResult: null,
        loadSearchIndex: function() {
            if (!this.get("isInHelpViewer")) {
                var a = this;
                $.ajax({
                    url: a.get("bundle.path") + a.get("SEARCH_FILE"),
                    dataType: "json",
                    success: function(b) {
                        Em.run.later(function() {
                            a.set("searchIndex", e.create({
                                noWordBoundaries: a.get("bundle.currentLocale.noWordBoundaries"),
                                searchTree: b,
                                app: a,
                                searchDepthLimit: a.get("bundle.currentLocale.searchDepthLimit") || 5
                            }))
                        }, 100)
                    }
                })
            }
        }
        .observes("book"),
        performSearch: function() {
            if (this.get("searchIndex")) {
                var a, b;
                a = this.get("searchString"),
                prevSearch = this.get("searchResult.query"),
                a !== prevSearch && (a && a.length > 1 && (b = this.get("searchIndex").resultForQuery(a),
                this.get("trackingController").performSearch(b)),
                this.set("searchResult", b))
            }
        },
        debounceSearch: function() {
            Em.run.debounce(this, "performSearch", 500)
        }
        .observes("searchString"),
        commitSearch: function() {
            var a = this.get("app") || this;
            a.debounceSearch(),
            a.blurSearch()
        },
        clearSearch: function() {
            this.set("searchResult", null),
            this.set("searchString", "")
        },
        resetSearch: function() {
            this.clearSearch(),
            this.focusSearch()
        },
        focusSearch: function() {
            Ember.run.later(this, function() {
                $(".searchform input").focus()
            }, 0)
        },
        blurSearch: function() {
            $(".searchform input").blur()
        },
        moreHelpLabel: function() {
            return "$TOC_MORE_HELP$".loc('<span class="toc-more-help-icon"></span>')
        }
        .property(),
        useFKAStyles: !1,
        updateFKAClassname: function() {
            $("html").toggleClass("fka-styles", this.get("useFKAStyles"))
        }
        .observes("useFKAStyles"),
        init: function() {
            this._super();
            var a = this;
            $(window).on("orientationchange", function() {
                a.blurSearch(),
                a.hidePanels(),
                a.get("aside").dismiss()
            }),
            f.isInHelpViewer || f.get("isMobile") || $(window).on("resize", function() {
                a.updateWindowSize()
            }),
            $(window).on("online", function() {
                a.set("isOnLine", !0)
            }),
            $(window).on("offline", function() {
                a.set("isOnLine", !1)
            }),
            $(document).keydown(function(b) {
                if (!$(b.target).is("input, textarea")) {
                    var c = "rtl" === a.get("bundle.currentLocale.text-direction")
                      , d = a.get("currentTopic.prev")
                      , e = a.get("currentTopic.next")
                      , f = 27
                      , g = 36
                      , h = 9
                      , i = c ? 39 : 37
                      , j = c ? 37 : 39
                      , k = a.get("aside")
                      , l = a.get("localePicker")
                      , m = k.get(".isVisible") || l.get("isVisible");
                    switch ((b.metaKey || b.ctrlKey) && (m = !0),
                    b.keyCode || b.which) {
                    case f:
                        a.hidePanels(),
                        k.dismiss(),
                        l.dismiss();
                        break;
                    case g:
                        break;
                    case i:
                        d && !m && (a.transitionToRoute("topic", d.get("routeSlug")),
                        a.get("trackingController").nextPrev("key"));
                        break;
                    case j:
                        e && !m && (a.transitionToRoute("topic", e.get("routeSlug")),
                        a.get("trackingController").nextPrev("key"));
                        break;
                    case h:
                        a.set("useFKAStyles", !0)
                    }
                }
            }),
            f.isInModernHelpViewer || this.updateTOCVisibility();
            var b = this.get("$body");
            b.addClass("loaded-timer"),
            Em.run.later(this, function() {
                b.removeClass("loaded-timer")
            }, 500)
        },
        doShowDebugPane: function() {
            var a = this.get("ENVIRONMENT");
            return "development" === a || "review" === a
        }
        .property(),
        currentUrl: function() {
            return escape(window.location.href)
        }
        .property("currentTopic"),
        currentBrowser: function() {
            return f.get("all")
        }
        .property(),
        actions: {
            toggleTOC: function() {
                this.toggleTOC()
            },
            hideClientEnv: function() {
                this.get("$body").find(".client-env").hide()
            }
        }
    })
}),
define("precompiled/app/template", [], function() {
    return Ember.HTMLBars.template(function() {
        var a = function() {
            return {
                isHTMLBars: !0,
                revision: "Ember@1.11.3",
                blockParams: 0,
                cachedFragment: null,
                hasRendered: !1,
                build: function(a) {
                    var b = a.createDocumentFragment()
                      , c = a.createTextNode(" ");
                    a.appendChild(b, c);
                    var c = a.createElement("ul");
                    a.setAttribute(c, "class", "client-env");
                    var d = a.createTextNode("\n 	");
                    a.appendChild(c, d);
                    var d = a.createElement("li")
                      , e = a.createElement("b")
                      , f = a.createTextNode("Client:");
                    a.appendChild(e, f),
                    a.appendChild(d, e);
                    var e = a.createTextNode(" ");
                    a.appendChild(d, e);
                    var e = a.createElement("a")
                      , f = a.createTextNode("eagle ");
                    a.appendChild(e, f);
                    var f = a.createComment("");
                    a.appendChild(e, f),
                    a.appendChild(d, e);
                    var e = a.createTextNode(" (");
                    a.appendChild(d, e);
                    var e = a.createComment("");
                    a.appendChild(d, e);
                    var e = a.createTextNode(")");
                    a.appendChild(d, e),
                    a.appendChild(c, d);
                    var d = a.createTextNode("\n 	");
                    a.appendChild(c, d);
                    var d = a.createElement("li")
                      , e = a.createElement("b")
                      , f = a.createTextNode("Build:");
                    a.appendChild(e, f),
                    a.appendChild(d, e);
                    var e = a.createTextNode(" ");
                    a.appendChild(d, e);
                    var e = a.createElement("a")
                      , f = a.createComment("");
                    a.appendChild(e, f),
                    a.appendChild(d, e);
                    var e = a.createTextNode(" (");
                    a.appendChild(d, e);
                    var e = a.createComment("");
                    a.appendChild(d, e);
                    var e = a.createTextNode(")");
                    a.appendChild(d, e),
                    a.appendChild(c, d);
                    var d = a.createTextNode("\n 	");
                    a.appendChild(c, d);
                    var d = a.createElement("li")
                      , e = a.createElement("b")
                      , f = a.createTextNode("Build code:");
                    a.appendChild(e, f),
                    a.appendChild(d, e);
                    var e = a.createTextNode(" ");
                    a.appendChild(d, e);
                    var e = a.createElement("a")
                      , f = a.createComment("");
                    a.appendChild(e, f),
                    a.appendChild(d, e),
                    a.appendChild(c, d);
                    var d = a.createTextNode("\n 	");
                    a.appendChild(c, d);
                    var d = a.createElement("li")
                      , e = a.createElement("button");
                    a.setAttribute(e, "title", "Hide ");
                    var f = a.createTextNode("x");
                    a.appendChild(e, f),
                    a.appendChild(d, e),
                    a.appendChild(c, d);
                    var d = a.createTextNode("\n ");
                    a.appendChild(c, d),
                    a.appendChild(b, c);
                    var c = a.createTextNode("\n");
                    return a.appendChild(b, c),
                    b
                },
                render: function(a, b, c) {
                    var d = b.dom
                      , e = b.hooks
                      , f = e.get
                      , g = e.concat
                      , h = e.attribute
                      , i = e.content
                      , j = e.element;
                    d.detectNamespace(c);
                    var k;
                    b.useFragmentCache && d.canClone ? (null === this.cachedFragment && (k = this.build(d),
                    this.hasRendered ? this.cachedFragment = k : this.hasRendered = !0),
                    this.cachedFragment && (k = d.cloneNode(this.cachedFragment, !0))) : k = this.build(d);
                    var l = d.childAt(k, [1])
                      , m = d.childAt(l, [1])
                      , n = d.childAt(m, [2])
                      , o = d.childAt(l, [3])
                      , p = d.childAt(o, [2])
                      , q = d.childAt(l, [5, 2])
                      , r = d.childAt(l, [7, 0])
                      , s = d.createMorphAt(n, 1, 1)
                      , t = d.createAttrMorph(n, "href")
                      , u = d.createMorphAt(m, 4, 4)
                      , v = d.createMorphAt(p, 0, 0)
                      , w = d.createAttrMorph(p, "href")
                      , x = d.createMorphAt(o, 4, 4)
                      , y = d.createMorphAt(q, 0, 0)
                      , z = d.createAttrMorph(q, "href");
                    return h(b, t, n, "href", g(b, ["rdar://new/problem/component=APD:Eng:Eagle&version=All&description=URL:%20", f(b, a, "currentUrl"), "%0ALocale:%20", f(b, a, "book.locale"), "%0AEagle version:%20", f(b, a, "APP_VERSION"), "%0ABuild%20code:%20", f(b, a, "book.framework"), "%0ABuild%20id:%20", f(b, a, "book.build_id"), "%0ABrowser:%20", f(b, a, "currentBrowser")])),
                    i(b, s, a, "APP_VERSION"),
                    i(b, u, a, "ENVIRONMENT"),
                    h(b, w, p, "href", g(b, ["apdbuild://sba_build/search/", f(b, a, "book.build_id")])),
                    i(b, v, a, "book.build_id"),
                    i(b, x, a, "book.build_date"),
                    h(b, z, q, "href", g(b, ["rdar://new/problem/component=APD:Eng:Duck&version=All&description=URL:%20", f(b, a, "currentUrl"), "%0ALocale:%20", f(b, a, "book.locale"), "%0AEagle version:%20", f(b, a, "APP_VERSION"), "%0ABuild%20code:%20", f(b, a, "book.framework"), "%0ABuild%20id:%20", f(b, a, "book.build_id")])),
                    i(b, y, a, "book.framework"),
                    j(b, r, a, "action", ["hideClientEnv"], {}),
                    k
                }
            }
        }()
          , b = function() {
            return {
                isHTMLBars: !0,
                revision: "Ember@1.11.3",
                blockParams: 0,
                cachedFragment: null,
                hasRendered: !1,
                build: function(a) {
                    var b = a.createDocumentFragment()
                      , c = a.createTextNode("	");
                    a.appendChild(b, c);
                    var c = a.createComment("");
                    a.appendChild(b, c);
                    var c = a.createTextNode("\n");
                    return a.appendChild(b, c),
                    b
                },
                render: function(a, b, c) {
                    var d = b.dom
                      , e = b.hooks
                      , f = e.inline;
                    d.detectNamespace(c);
                    var g;
                    b.useFragmentCache && d.canClone ? (null === this.cachedFragment && (g = this.build(d),
                    this.hasRendered ? this.cachedFragment = g : this.hasRendered = !0),
                    this.cachedFragment && (g = d.cloneNode(this.cachedFragment, !0))) : g = this.build(d);
                    var h = d.createMorphAt(g, 1, 1, c);
                    return f(b, h, a, "view", ["header"], {}),
                    g
                }
            }
        }()
          , c = function() {
            return {
                isHTMLBars: !0,
                revision: "Ember@1.11.3",
                blockParams: 0,
                cachedFragment: null,
                hasRendered: !1,
                build: function(a) {
                    var b = a.createDocumentFragment()
                      , c = a.createTextNode("  ");
                    a.appendChild(b, c);
                    var c = a.createComment("");
                    a.appendChild(b, c);
                    var c = a.createTextNode("\n");
                    return a.appendChild(b, c),
                    b
                },
                render: function(a, b, c) {
                    var d = b.dom
                      , e = b.hooks
                      , f = e.inline;
                    d.detectNamespace(c);
                    var g;
                    b.useFragmentCache && d.canClone ? (null === this.cachedFragment && (g = this.build(d),
                    this.hasRendered ? this.cachedFragment = g : this.hasRendered = !0),
                    this.cachedFragment && (g = d.cloneNode(this.cachedFragment, !0))) : g = this.build(d);
                    var h = d.createMorphAt(g, 1, 1, c);
                    return f(b, h, a, "view", ["toc-nav"], {}),
                    g
                }
            }
        }()
          , d = function() {
            return {
                isHTMLBars: !0,
                revision: "Ember@1.11.3",
                blockParams: 0,
                cachedFragment: null,
                hasRendered: !1,
                build: function(a) {
                    var b = a.createDocumentFragment()
                      , c = a.createTextNode("  ");
                    a.appendChild(b, c);
                    var c = a.createElement("button")
                      , d = a.createTextNode("\n    ");
                    a.appendChild(c, d);
                    var d = a.createComment("");
                    a.appendChild(c, d);
                    var d = a.createTextNode("\n  ");
                    a.appendChild(c, d),
                    a.appendChild(b, c);
                    var c = a.createTextNode("\n");
                    return a.appendChild(b, c),
                    b
                },
                render: function(a, b, c) {
                    var d = b.dom
                      , e = b.hooks
                      , f = e.get
                      , g = e.subexpr
                      , h = e.concat
                      , i = e.attribute
                      , j = e.element
                      , k = e.inline;
                    d.detectNamespace(c);
                    var l;
                    b.useFragmentCache && d.canClone ? (null === this.cachedFragment && (l = this.build(d),
                    this.hasRendered ? this.cachedFragment = l : this.hasRendered = !0),
                    this.cachedFragment && (l = d.cloneNode(this.cachedFragment, !0))) : l = this.build(d);
                    var m = d.childAt(l, [1])
                      , n = d.createMorphAt(m, 1, 1)
                      , o = d.createAttrMorph(m, "class");
                    return i(b, o, m, "class", h(b, ["toc-button ", g(b, a, "if", [f(b, a, "isTOCVisible"), "", "toc-button-pin"], {})])),
                    j(b, m, a, "action", ["toggleTOC"], {}),
                    k(b, n, a, "loc", ["$TOC_BUTTON_LABEL_SHOW$"], {}),
                    l
                }
            }
        }()
          , e = function() {
            return {
                isHTMLBars: !0,
                revision: "Ember@1.11.3",
                blockParams: 0,
                cachedFragment: null,
                hasRendered: !1,
                build: function(a) {
                    var b = a.createDocumentFragment()
                      , c = a.createTextNode("  ");
                    a.appendChild(b, c);
                    var c = a.createComment("");
                    a.appendChild(b, c);
                    var c = a.createTextNode("\n");
                    return a.appendChild(b, c),
                    b
                },
                render: function(a, b, c) {
                    var d = b.dom
                      , e = b.hooks
                      , f = e.get
                      , g = e.inline;
                    d.detectNamespace(c);
                    var h;
                    b.useFragmentCache && d.canClone ? (null === this.cachedFragment && (h = this.build(d),
                    this.hasRendered ? this.cachedFragment = h : this.hasRendered = !0),
                    this.cachedFragment && (h = d.cloneNode(this.cachedFragment, !0))) : h = this.build(d);
                    var i = d.createMorphAt(h, 1, 1, c);
                    return g(b, i, a, "view", [f(b, a, "localePicker")], {}),
                    h
                }
            }
        }();
        return {
            isHTMLBars: !0,
            revision: "Ember@1.11.3",
            blockParams: 0,
            cachedFragment: null,
            hasRendered: !1,
            build: function(a) {
                var b = a.createDocumentFragment()
                  , c = a.createComment("");
                a.appendChild(b, c);
                var c = a.createTextNode("\n");
                a.appendChild(b, c);
                var c = a.createComment("");
                a.appendChild(b, c);
                var c = a.createTextNode("\n");
                a.appendChild(b, c);
                var c = a.createElement("div");
                a.setAttribute(c, "class", "content centered");
                var d = a.createTextNode("\n");
                a.appendChild(c, d);
                var d = a.createComment("");
                a.appendChild(c, d);
                var d = a.createTextNode("\n");
                a.appendChild(c, d);
                var d = a.createComment("");
                a.appendChild(c, d);
                var d = a.createTextNode("\n\n");
                a.appendChild(c, d);
                var d = a.createComment("");
                a.appendChild(c, d),
                a.appendChild(b, c);
                var c = a.createTextNode("\n\n");
                a.appendChild(b, c);
                var c = a.createComment("");
                a.appendChild(b, c);
                var c = a.createTextNode("\n\n");
                a.appendChild(b, c);
                var c = a.createComment("");
                return a.appendChild(b, c),
                b
            },
            render: function(f, g, h) {
                var i = g.dom
                  , j = g.hooks
                  , k = j.get
                  , l = j.block
                  , m = j.content
                  , n = j.inline;
                i.detectNamespace(h);
                var o;
                g.useFragmentCache && i.canClone ? (null === this.cachedFragment && (o = this.build(i),
                this.hasRendered ? this.cachedFragment = o : this.hasRendered = !0),
                this.cachedFragment && (o = i.cloneNode(this.cachedFragment, !0))) : o = this.build(i);
                var p = i.childAt(o, [4])
                  , q = i.createMorphAt(o, 0, 0, h)
                  , r = i.createMorphAt(o, 2, 2, h)
                  , s = i.createMorphAt(p, 1, 1)
                  , t = i.createMorphAt(p, 3, 3)
                  , u = i.createMorphAt(p, 5, 5)
                  , v = i.createMorphAt(o, 6, 6, h)
                  , w = i.createMorphAt(o, 8, 8, h);
                return i.insertBoundary(o, null),
                i.insertBoundary(o, 0),
                l(g, q, f, "if", [k(g, f, "doShowDebugPane")], {}, a, null),
                l(g, r, f, "unless", [k(g, f, "isHeaderDisabled")], {}, b, null),
                l(g, s, f, "unless", [k(g, f, "isTOCDisabled")], {}, c, null),
                m(g, t, f, "outlet"),
                l(g, u, f, "if", [k(g, f, "doShowAlternateTOCButton")], {}, d, null),
                n(g, v, f, "view", [k(g, f, "aside")], {}),
                l(g, w, f, "unless", [k(g, f, "isInHelpViewer")], {}, e, null),
                o
            }
        }
    }())
}),
define("app/view", ["shared/app/view", "precompiled/app/template"], function(a, b) {
    return a.extend({
        template: b
    })
}),
define("precompiled/header/template", [], function() {
    return Ember.HTMLBars.template(function() {
        var a = function() {
            return {
                isHTMLBars: !0,
                revision: "Ember@1.11.3",
                blockParams: 0,
                cachedFragment: null,
                hasRendered: !1,
                build: function(a) {
                    var b = a.createDocumentFragment()
                      , c = a.createTextNode("			");
                    a.appendChild(b, c);
                    var c = a.createComment("");
                    a.appendChild(b, c);
                    var c = a.createTextNode("\n");
                    return a.appendChild(b, c),
                    b
                },
                render: function(a, b, c) {
                    var d = b.dom
                      , e = b.hooks
                      , f = e.inline;
                    d.detectNamespace(c);
                    var g;
                    b.useFragmentCache && d.canClone ? (null === this.cachedFragment && (g = this.build(d),
                    this.hasRendered ? this.cachedFragment = g : this.hasRendered = !0),
                    this.cachedFragment && (g = d.cloneNode(this.cachedFragment, !0))) : g = this.build(d);
                    var h = d.createMorphAt(g, 1, 1, c);
                    return f(b, h, a, "loc", ["$TOC_BUTTON_LABEL_HIDE$"], {}),
                    g
                }
            }
        }()
          , b = function() {
            return {
                isHTMLBars: !0,
                revision: "Ember@1.11.3",
                blockParams: 0,
                cachedFragment: null,
                hasRendered: !1,
                build: function(a) {
                    var b = a.createDocumentFragment()
                      , c = a.createTextNode("			");
                    a.appendChild(b, c);
                    var c = a.createComment("");
                    a.appendChild(b, c);
                    var c = a.createTextNode("\n");
                    return a.appendChild(b, c),
                    b
                },
                render: function(a, b, c) {
                    var d = b.dom
                      , e = b.hooks
                      , f = e.inline;
                    d.detectNamespace(c);
                    var g;
                    b.useFragmentCache && d.canClone ? (null === this.cachedFragment && (g = this.build(d),
                    this.hasRendered ? this.cachedFragment = g : this.hasRendered = !0),
                    this.cachedFragment && (g = d.cloneNode(this.cachedFragment, !0))) : g = this.build(d);
                    var h = d.createMorphAt(g, 1, 1, c);
                    return f(b, h, a, "loc", ["$TOC_BUTTON_LABEL_SHOW$"], {}),
                    g
                }
            }
        }()
          , c = function() {
            return {
                isHTMLBars: !0,
                revision: "Ember@1.11.3",
                blockParams: 0,
                cachedFragment: null,
                hasRendered: !1,
                build: function(a) {
                    var b = a.createDocumentFragment()
                      , c = a.createTextNode("      ");
                    a.appendChild(b, c);
                    var c = a.createComment("");
                    a.appendChild(b, c);
                    var c = a.createTextNode("\n");
                    return a.appendChild(b, c),
                    b
                },
                render: function(a, b, c) {
                    var d = b.dom
                      , e = b.hooks
                      , f = e.content;
                    d.detectNamespace(c);
                    var g;
                    b.useFragmentCache && d.canClone ? (null === this.cachedFragment && (g = this.build(d),
                    this.hasRendered ? this.cachedFragment = g : this.hasRendered = !0),
                    this.cachedFragment && (g = d.cloneNode(this.cachedFragment, !0))) : g = this.build(d);
                    var h = d.createMorphAt(g, 1, 1, c);
                    return f(b, h, a, "book.title"),
                    g
                }
            }
        }()
          , d = function() {
            return {
                isHTMLBars: !0,
                revision: "Ember@1.11.3",
                blockParams: 0,
                cachedFragment: null,
                hasRendered: !1,
                build: function(a) {
                    var b = a.createDocumentFragment()
                      , c = a.createTextNode("		");
                    a.appendChild(b, c);
                    var c = a.createComment("");
                    a.appendChild(b, c);
                    var c = a.createTextNode("\n		");
                    a.appendChild(b, c);
                    var c = a.createElement("button");
                    a.setAttribute(c, "class", "searchview-close"),
                    a.setAttribute(c, "name", "find"),
                    a.setAttribute(c, "type", "button"),
                    a.setAttribute(c, "role", "checkbox");
                    var d = a.createTextNode("\n		  ");
                    a.appendChild(c, d);
                    var d = a.createElement("span");
                    a.setAttribute(d, "class", "searchview-close-wrapper");
                    var e = a.createTextNode("\n		    ");
                    a.appendChild(d, e);
                    var e = a.createElement("span");
                    a.setAttribute(e, "class", "searchview-close-left"),
                    a.appendChild(d, e);
                    var e = a.createTextNode("\n		    ");
                    a.appendChild(d, e);
                    var e = a.createElement("span");
                    a.setAttribute(e, "class", "searchview-close-right"),
                    a.appendChild(d, e);
                    var e = a.createTextNode("\n		  ");
                    a.appendChild(d, e),
                    a.appendChild(c, d);
                    var d = a.createTextNode("\n		");
                    a.appendChild(c, d),
                    a.appendChild(b, c);
                    var c = a.createTextNode("\n");
                    return a.appendChild(b, c),
                    b
                },
                render: function(a, b, c) {
                    var d = b.dom
                      , e = b.hooks
                      , f = e.get
                      , g = e.inline
                      , h = e.subexpr
                      , i = e.concat
                      , j = e.attribute;
                    d.detectNamespace(c);
                    var k;
                    b.useFragmentCache && d.canClone ? (null === this.cachedFragment && (k = this.build(d),
                    this.hasRendered ? this.cachedFragment = k : this.hasRendered = !0),
                    this.cachedFragment && (k = d.cloneNode(this.cachedFragment, !0))) : k = this.build(d);
                    var l = d.childAt(k, [3])
                      , m = d.createMorphAt(k, 1, 1, c)
                      , n = d.createAttrMorph(l, "aria-checked")
                      , o = d.createAttrMorph(l, "aria-label");
                    return g(b, m, a, "view", ["search"], {
                        app: f(b, a, "controller")
                    }),
                    j(b, n, l, "aria-checked", i(b, [h(b, a, "if", [f(b, a, "isSearchVisible"), "true", "false"], {})])),
                    j(b, o, l, "aria-label", i(b, [h(b, a, "loc", ["$SEARCH_BUTTON_LABEL$"], {})])),
                    k
                }
            }
        }();
        return {
            isHTMLBars: !0,
            revision: "Ember@1.11.3",
            blockParams: 0,
            cachedFragment: null,
            hasRendered: !1,
            build: function(a) {
                var b = a.createDocumentFragment()
                  , c = a.createElement("div");
                a.setAttribute(c, "id", "header-content");
                var d = a.createTextNode("\n	");
                a.appendChild(c, d);
                var d = a.createElement("button");
                a.setAttribute(d, "name", "toc"),
                a.setAttribute(d, "type", "button"),
                a.setAttribute(d, "role", "checkbox");
                var e = a.createTextNode("\n");
                a.appendChild(d, e);
                var e = a.createComment("");
                a.appendChild(d, e);
                var e = a.createTextNode("	");
                a.appendChild(d, e),
                a.appendChild(c, d);
                var d = a.createTextNode("\n	");
                a.appendChild(c, d);
                var d = a.createElement("h1")
                  , e = a.createTextNode("\n");
                a.appendChild(d, e);
                var e = a.createComment("");
                a.appendChild(d, e);
                var e = a.createTextNode("	");
                a.appendChild(d, e),
                a.appendChild(c, d);
                var d = a.createTextNode("\n");
                a.appendChild(c, d);
                var d = a.createComment("");
                a.appendChild(c, d),
                a.appendChild(b, c);
                var c = a.createTextNode("\n");
                return a.appendChild(b, c),
                b
            },
            render: function(e, f, g) {
                var h = f.dom
                  , i = f.hooks
                  , j = i.get
                  , k = i.subexpr
                  , l = i.concat
                  , m = i.attribute
                  , n = i.block;
                h.detectNamespace(g);
                var o;
                f.useFragmentCache && h.canClone ? (null === this.cachedFragment && (o = this.build(h),
                this.hasRendered ? this.cachedFragment = o : this.hasRendered = !0),
                this.cachedFragment && (o = h.cloneNode(this.cachedFragment, !0))) : o = this.build(h);
                var p = h.childAt(o, [0])
                  , q = h.childAt(p, [1])
                  , r = h.childAt(p, [3])
                  , s = h.createAttrMorph(p, "class")
                  , t = h.createMorphAt(q, 1, 1)
                  , u = h.createAttrMorph(q, "disabled")
                  , v = h.createAttrMorph(q, "aria-checked")
                  , w = h.createMorphAt(r, 1, 1)
                  , x = h.createAttrMorph(r, "class")
                  , y = h.createMorphAt(p, 5, 5);
                return m(f, s, p, "class", l(f, ["centered ", k(f, e, "if", [j(f, e, "isSearchVisible"), "searchopen", ""], {})])),
                m(f, u, q, "disabled", l(f, [k(f, e, "if", [j(f, e, "isSearchVisible"), "disabled", ""], {})])),
                m(f, v, q, "aria-checked", l(f, [k(f, e, "if", [j(f, e, "isTOCVisible"), "true", "false"], {})])),
                n(f, t, e, "if", [j(f, e, "isTOCVisible")], {}, a, b),
                m(f, x, r, "class", l(f, [k(f, e, "if", [j(f, e, "isSearchVisible"), "searchopen", ""], {})])),
                n(f, w, e, "link-to", ["index"], {}, c, null),
                n(f, y, e, "unless", [j(f, e, "isSearchDisabled")], {}, d, null),
                o
            }
        }
    }())
}),
define("header/view", ["precompiled/header/template", "shared/computed"], function(a, b) {
    return Em.View.extend({
        tagName: "header",
        template: a,
        attributeBindings: ["ariaHidden:aria-hidden"],
        ariaHidden: b.truthString("controller.aside.isVisible"),
        classNames: ["app"],
        click: function(a) {
            var b = $(a.target);
            b.is("[name=toc]") ? (this.get("controller").manuallyToggleTOC(),
            this.get("controller.trackingController").toggleTOC("event32")) : b.is("[name=find]") || b.is('[class^="searchview-close"]') ? this.get("controller").toggleSearch() : b.is("a[href]") && (location.href = b.attr("href"),
            a.preventDefault()),
            this._super(a)
        },
        touchMove: function(a) {
            $.contains(this.$(".searchresults")[0], a.target) || a.preventDefault()
        }
    })
}),
define("topic/route", ["shared/topic/route"], function(a) {
    return a.extend({
        actions: {
            willTransition: function() {
                var a = this.controllerFor("application")
                  , b = a.get("aside");
                b && b.dismiss()
            },
            didTransition: function() {
                Ember.run.schedule("afterRender", this, function() {
                    this.controllerFor("application").scrollToSubtopic()
                })
            }
        }
    })
}),
define("precompiled/search/template", [], function() {
    return Ember.HTMLBars.template(function() {
        var a = function() {
            var a = function() {
                var a = function() {
                    var a = function() {
                        var a = function() {
                            var a = function() {
                                return {
                                    isHTMLBars: !0,
                                    revision: "Ember@1.11.3",
                                    blockParams: 0,
                                    cachedFragment: null,
                                    hasRendered: !1,
                                    build: function(a) {
                                        var b = a.createDocumentFragment()
                                          , c = a.createTextNode("                          ");
                                        a.appendChild(b, c);
                                        var c = a.createComment("");
                                        a.appendChild(b, c);
                                        var c = a.createTextNode("\n");
                                        return a.appendChild(b, c),
                                        b
                                    },
                                    render: function(a, b, c) {
                                        var d = b.dom
                                          , e = b.hooks
                                          , f = e.content;
                                        d.detectNamespace(c);
                                        var g;
                                        b.useFragmentCache && d.canClone ? (null === this.cachedFragment && (g = this.build(d),
                                        this.hasRendered ? this.cachedFragment = g : this.hasRendered = !0),
                                        this.cachedFragment && (g = d.cloneNode(this.cachedFragment, !0))) : g = this.build(d);
                                        var h = d.createMorphAt(g, 1, 1, c);
                                        return f(b, h, a, "topic.searchName"),
                                        g
                                    }
                                }
                            }()
                              , b = function() {
                                return {
                                    isHTMLBars: !0,
                                    revision: "Ember@1.11.3",
                                    blockParams: 0,
                                    cachedFragment: null,
                                    hasRendered: !1,
                                    build: function(a) {
                                        var b = a.createDocumentFragment()
                                          , c = a.createTextNode("                          ");
                                        a.appendChild(b, c);
                                        var c = a.createComment("");
                                        a.appendChild(b, c);
                                        var c = a.createTextNode("\n");
                                        return a.appendChild(b, c),
                                        b
                                    },
                                    render: function(a, b, c) {
                                        var d = b.dom
                                          , e = b.hooks
                                          , f = e.content;
                                        d.detectNamespace(c);
                                        var g;
                                        b.useFragmentCache && d.canClone ? (null === this.cachedFragment && (g = this.build(d),
                                        this.hasRendered ? this.cachedFragment = g : this.hasRendered = !0),
                                        this.cachedFragment && (g = d.cloneNode(this.cachedFragment, !0))) : g = this.build(d);
                                        var h = d.createMorphAt(g, 1, 1, c);
                                        return f(b, h, a, "topic.name"),
                                        g
                                    }
                                }
                            }()
                              , c = function() {
                                return {
                                    isHTMLBars: !0,
                                    revision: "Ember@1.11.3",
                                    blockParams: 0,
                                    cachedFragment: null,
                                    hasRendered: !1,
                                    build: function(a) {
                                        var b = a.createDocumentFragment()
                                          , c = a.createTextNode("                          ");
                                        a.appendChild(b, c);
                                        var c = a.createElement("b")
                                          , d = a.createComment("");
                                        a.appendChild(c, d),
                                        a.appendChild(b, c);
                                        var c = a.createTextNode("\n");
                                        return a.appendChild(b, c),
                                        b
                                    },
                                    render: function(a, b, c) {
                                        var d = b.dom
                                          , e = b.hooks
                                          , f = e.content;
                                        d.detectNamespace(c);
                                        var g;
                                        b.useFragmentCache && d.canClone ? (null === this.cachedFragment && (g = this.build(d),
                                        this.hasRendered ? this.cachedFragment = g : this.hasRendered = !0),
                                        this.cachedFragment && (g = d.cloneNode(this.cachedFragment, !0))) : g = this.build(d);
                                        var h = d.createMorphAt(d.childAt(g, [1]), 0, 0);
                                        return f(b, h, a, "topic.breadcrumb"),
                                        g
                                    }
                                }
                            }();
                            return {
                                isHTMLBars: !0,
                                revision: "Ember@1.11.3",
                                blockParams: 0,
                                cachedFragment: null,
                                hasRendered: !1,
                                build: function(a) {
                                    var b = a.createDocumentFragment()
                                      , c = a.createComment("");
                                    a.appendChild(b, c);
                                    var c = a.createComment("");
                                    return a.appendChild(b, c),
                                    b
                                },
                                render: function(d, e, f) {
                                    var g = e.dom
                                      , h = e.hooks
                                      , i = h.get
                                      , j = h.block;
                                    g.detectNamespace(f);
                                    var k;
                                    e.useFragmentCache && g.canClone ? (null === this.cachedFragment && (k = this.build(g),
                                    this.hasRendered ? this.cachedFragment = k : this.hasRendered = !0),
                                    this.cachedFragment && (k = g.cloneNode(this.cachedFragment, !0))) : k = this.build(g);
                                    var l = g.createMorphAt(k, 0, 0, f)
                                      , m = g.createMorphAt(k, 1, 1, f);
                                    return g.insertBoundary(k, null),
                                    g.insertBoundary(k, 0),
                                    j(e, l, d, "if", [i(e, d, "topic.searchName")], {}, a, b),
                                    j(e, m, d, "if", [i(e, d, "topic.breadcrumb")], {}, c, null),
                                    k
                                }
                            }
                        }();
                        return {
                            isHTMLBars: !0,
                            revision: "Ember@1.11.3",
                            blockParams: 0,
                            cachedFragment: null,
                            hasRendered: !1,
                            build: function(a) {
                                var b = a.createDocumentFragment()
                                  , c = a.createTextNode("                      ");
                                a.appendChild(b, c);
                                var c = a.createElement("li");
                                a.setAttribute(c, "role", "option"),
                                a.setAttribute(c, "class", "searchresults-item searchresults-animated");
                                var d = a.createTextNode("\n");
                                a.appendChild(c, d);
                                var d = a.createComment("");
                                a.appendChild(c, d);
                                var d = a.createTextNode("                      ");
                                a.appendChild(c, d),
                                a.appendChild(b, c);
                                var c = a.createTextNode("\n");
                                return a.appendChild(b, c),
                                b
                            },
                            render: function(b, c, d) {
                                var e = c.dom
                                  , f = c.hooks
                                  , g = f.get
                                  , h = f.block;
                                e.detectNamespace(d);
                                var i;
                                c.useFragmentCache && e.canClone ? (null === this.cachedFragment && (i = this.build(e),
                                this.hasRendered ? this.cachedFragment = i : this.hasRendered = !0),
                                this.cachedFragment && (i = e.cloneNode(this.cachedFragment, !0))) : i = this.build(e);
                                var j = e.createMorphAt(e.childAt(i, [1]), 1, 1);
                                return h(c, j, b, "link-to", ["topic", g(c, b, "topic.routeSlug")], {
                                    "class": "searchresults-link"
                                }, a, null),
                                i
                            }
                        }
                    }();
                    return {
                        isHTMLBars: !0,
                        revision: "Ember@1.11.3",
                        blockParams: 0,
                        cachedFragment: null,
                        hasRendered: !1,
                        build: function(a) {
                            var b = a.createDocumentFragment()
                              , c = a.createComment("");
                            return a.appendChild(b, c),
                            b
                        },
                        render: function(b, c, d) {
                            var e = c.dom
                              , f = c.hooks
                              , g = f.get
                              , h = f.block;
                            e.detectNamespace(d);
                            var i;
                            c.useFragmentCache && e.canClone ? (null === this.cachedFragment && (i = this.build(e),
                            this.hasRendered ? this.cachedFragment = i : this.hasRendered = !0),
                            this.cachedFragment && (i = e.cloneNode(this.cachedFragment, !0))) : i = this.build(e);
                            var j = e.createMorphAt(i, 0, 0, d);
                            return e.insertBoundary(i, null),
                            e.insertBoundary(i, 0),
                            h(c, j, b, "if", [g(c, b, "topic.name")], {}, a, null),
                            i
                        }
                    }
                }();
                return {
                    isHTMLBars: !0,
                    revision: "Ember@1.11.3",
                    blockParams: 0,
                    cachedFragment: null,
                    hasRendered: !1,
                    build: function(a) {
                        var b = a.createDocumentFragment()
                          , c = a.createComment("");
                        return a.appendChild(b, c),
                        b
                    },
                    render: function(b, c, d) {
                        var e = c.dom
                          , f = c.hooks
                          , g = f.get
                          , h = f.block;
                        e.detectNamespace(d);
                        var i;
                        c.useFragmentCache && e.canClone ? (null === this.cachedFragment && (i = this.build(e),
                        this.hasRendered ? this.cachedFragment = i : this.hasRendered = !0),
                        this.cachedFragment && (i = e.cloneNode(this.cachedFragment, !0))) : i = this.build(e);
                        var j = e.createMorphAt(i, 0, 0, d);
                        return e.insertBoundary(i, null),
                        e.insertBoundary(i, 0),
                        h(c, j, b, "each", [g(c, b, "view.app.searchResult.sortedTopics")], {
                            keyword: "topic"
                        }, a, null),
                        i
                    }
                }
            }();
            return {
                isHTMLBars: !0,
                revision: "Ember@1.11.3",
                blockParams: 0,
                cachedFragment: null,
                hasRendered: !1,
                build: function(a) {
                    var b = a.createDocumentFragment()
                      , c = a.createTextNode("	          ");
                    a.appendChild(b, c);
                    var c = a.createElement("section");
                    a.setAttribute(c, "class", "searchresults-section");
                    var d = a.createTextNode("\n	            ");
                    a.appendChild(c, d);
                    var d = a.createElement("h3");
                    a.setAttribute(d, "class", "searchresults-header searchresults-animated"),
                    a.setAttribute(d, "role", "status");
                    var e = a.createComment("");
                    a.appendChild(d, e),
                    a.appendChild(c, d);
                    var d = a.createTextNode("\n	            ");
                    a.appendChild(c, d);
                    var d = a.createElement("ul");
                    a.setAttribute(d, "class", "searchresults-list"),
                    a.setAttribute(d, "role", "listbox");
                    var e = a.createTextNode("\n");
                    a.appendChild(d, e);
                    var e = a.createComment("");
                    a.appendChild(d, e);
                    var e = a.createTextNode("	            ");
                    a.appendChild(d, e),
                    a.appendChild(c, d);
                    var d = a.createTextNode("\n	          ");
                    a.appendChild(c, d),
                    a.appendChild(b, c);
                    var c = a.createTextNode("\n");
                    return a.appendChild(b, c),
                    b
                },
                render: function(b, c, d) {
                    var e = c.dom
                      , f = c.hooks
                      , g = f.content
                      , h = f.get
                      , i = f.block;
                    e.detectNamespace(d);
                    var j;
                    c.useFragmentCache && e.canClone ? (null === this.cachedFragment && (j = this.build(e),
                    this.hasRendered ? this.cachedFragment = j : this.hasRendered = !0),
                    this.cachedFragment && (j = e.cloneNode(this.cachedFragment, !0))) : j = this.build(e);
                    var k = e.childAt(j, [1])
                      , l = e.createMorphAt(e.childAt(k, [1]), 0, 0)
                      , m = e.createMorphAt(e.childAt(k, [3]), 1, 1);
                    return g(c, l, b, "view.searchCountSummary"),
                    i(c, m, b, "if", [h(c, b, "view.app.searchResult.sortedTopics")], {}, a, null),
                    j
                }
            }
        }()
          , b = function() {
            var a = function() {
                var a = function() {
                    return {
                        isHTMLBars: !0,
                        revision: "Ember@1.11.3",
                        blockParams: 0,
                        cachedFragment: null,
                        hasRendered: !1,
                        build: function(a) {
                            var b = a.createDocumentFragment()
                              , c = a.createTextNode("                  ");
                            a.appendChild(b, c);
                            var c = a.createElement("li");
                            a.setAttribute(c, "role", "option"),
                            a.setAttribute(c, "class", "searchresults-item searchresults-animated searchresults-quicklink");
                            var d = a.createTextNode("\n                    ");
                            a.appendChild(c, d);
                            var d = a.createElement("a")
                              , e = a.createComment("");
                            a.appendChild(d, e),
                            a.appendChild(c, d);
                            var d = a.createTextNode("\n                  ");
                            a.appendChild(c, d),
                            a.appendChild(b, c);
                            var c = a.createTextNode("\n");
                            return a.appendChild(b, c),
                            b
                        },
                        render: function(a, b, c) {
                            var d = b.dom
                              , e = b.hooks
                              , f = e.get
                              , g = e.concat
                              , h = e.attribute
                              , i = e.content;
                            d.detectNamespace(c);
                            var j;
                            b.useFragmentCache && d.canClone ? (null === this.cachedFragment && (j = this.build(d),
                            this.hasRendered ? this.cachedFragment = j : this.hasRendered = !0),
                            this.cachedFragment && (j = d.cloneNode(this.cachedFragment, !0))) : j = this.build(d);
                            var k = d.childAt(j, [1, 1])
                              , l = d.createMorphAt(k, 0, 0)
                              , m = d.createAttrMorph(k, "href");
                            return h(b, m, k, "href", g(b, [f(b, a, "quickLink.href")])),
                            i(b, l, a, "quickLink.title"),
                            j
                        }
                    }
                }();
                return {
                    isHTMLBars: !0,
                    revision: "Ember@1.11.3",
                    blockParams: 0,
                    cachedFragment: null,
                    hasRendered: !1,
                    build: function(a) {
                        var b = a.createDocumentFragment()
                          , c = a.createTextNode("            ");
                        a.appendChild(b, c);
                        var c = a.createElement("section");
                        a.setAttribute(c, "class", "searchresults-section");
                        var d = a.createTextNode("\n              ");
                        a.appendChild(c, d);
                        var d = a.createElement("h3");
                        a.setAttribute(d, "class", "searchresults-header searchresults-animated");
                        var e = a.createComment("");
                        a.appendChild(d, e),
                        a.appendChild(c, d);
                        var d = a.createTextNode("\n              ");
                        a.appendChild(c, d);
                        var d = a.createElement("ul");
                        a.setAttribute(d, "class", "searchresults-list");
                        var e = a.createTextNode("\n");
                        a.appendChild(d, e);
                        var e = a.createComment("");
                        a.appendChild(d, e);
                        var e = a.createTextNode("              ");
                        a.appendChild(d, e),
                        a.appendChild(c, d);
                        var d = a.createTextNode("\n            ");
                        a.appendChild(c, d),
                        a.appendChild(b, c);
                        var c = a.createTextNode("\n          ");
                        return a.appendChild(b, c),
                        b
                    },
                    render: function(b, c, d) {
                        var e = c.dom
                          , f = c.hooks
                          , g = f.inline
                          , h = f.get
                          , i = f.block;
                        e.detectNamespace(d);
                        var j;
                        c.useFragmentCache && e.canClone ? (null === this.cachedFragment && (j = this.build(e),
                        this.hasRendered ? this.cachedFragment = j : this.hasRendered = !0),
                        this.cachedFragment && (j = e.cloneNode(this.cachedFragment, !0))) : j = this.build(e);
                        var k = e.childAt(j, [1])
                          , l = e.createMorphAt(e.childAt(k, [1]), 0, 0)
                          , m = e.createMorphAt(e.childAt(k, [3]), 1, 1);
                        return g(c, l, b, "loc", ["$QUICK_LINKS_LABEL$"], {}),
                        i(c, m, b, "each", [h(c, b, "view.app.book.quick_links")], {
                            keyword: "quickLink"
                        }, a, null),
                        j
                    }
                }
            }();
            return {
                isHTMLBars: !0,
                revision: "Ember@1.11.3",
                blockParams: 0,
                cachedFragment: null,
                hasRendered: !1,
                build: function(a) {
                    var b = a.createDocumentFragment()
                      , c = a.createComment("");
                    return a.appendChild(b, c),
                    b
                },
                render: function(b, c, d) {
                    var e = c.dom
                      , f = c.hooks
                      , g = f.get
                      , h = f.block;
                    e.detectNamespace(d);
                    var i;
                    c.useFragmentCache && e.canClone ? (null === this.cachedFragment && (i = this.build(e),
                    this.hasRendered ? this.cachedFragment = i : this.hasRendered = !0),
                    this.cachedFragment && (i = e.cloneNode(this.cachedFragment, !0))) : i = this.build(e);
                    var j = e.createMorphAt(i, 0, 0, d);
                    return e.insertBoundary(i, null),
                    e.insertBoundary(i, 0),
                    h(c, j, b, "if", [g(c, b, "view.app.book.quick_links")], {}, a, null),
                    i
                }
            }
        }();
        return {
            isHTMLBars: !0,
            revision: "Ember@1.11.3",
            blockParams: 0,
            cachedFragment: null,
            hasRendered: !1,
            build: function(a) {
                var b = a.createDocumentFragment()
                  , c = a.createElement("div");
                a.setAttribute(c, "id", "search");
                var d = a.createTextNode("\n  ");
                a.appendChild(c, d);
                var d = a.createElement("div");
                a.setAttribute(d, "class", "search-content");
                var e = a.createTextNode("\n    ");
                a.appendChild(d, e);
                var e = a.createElement("aside");
                a.setAttribute(e, "class", "searchview"),
                a.setAttribute(e, "role", "search");
                var f = a.createTextNode("\n      ");
                a.appendChild(e, f);
                var f = a.createElement("div");
                a.setAttribute(f, "class", "searchview-content");
                var g = a.createTextNode("\n        ");
                a.appendChild(f, g);
                var g = a.createElement("form");
                a.setAttribute(g, "class", "searchform");
                var h = a.createTextNode("\n          ");
                a.appendChild(g, h);
                var h = a.createElement("div");
                a.setAttribute(h, "class", "searchform-wrapper");
                var i = a.createTextNode("\n						");
                a.appendChild(h, i);
                var i = a.createComment("");
                a.appendChild(h, i);
                var i = a.createTextNode("\n						");
                a.appendChild(h, i);
                var i = a.createElement("span");
                a.setAttribute(i, "class", "searchform-icon"),
                a.appendChild(h, i);
                var i = a.createTextNode("\n          ");
                a.appendChild(h, i),
                a.appendChild(g, h);
                var h = a.createTextNode("\n        ");
                a.appendChild(g, h),
                a.appendChild(f, g);
                var g = a.createTextNode("\n        ");
                a.appendChild(f, g);
                var g = a.createElement("aside")
                  , h = a.createTextNode("\n");
                a.appendChild(g, h);
                var h = a.createComment("");
                a.appendChild(g, h);
                var h = a.createTextNode("        ");
                a.appendChild(g, h),
                a.appendChild(f, g);
                var g = a.createTextNode("\n      ");
                a.appendChild(f, g),
                a.appendChild(e, f);
                var f = a.createTextNode("\n    ");
                a.appendChild(e, f),
                a.appendChild(d, e);
                var e = a.createTextNode("\n  ");
                a.appendChild(d, e),
                a.appendChild(c, d);
                var d = a.createTextNode("\n");
                a.appendChild(c, d),
                a.appendChild(b, c);
                var c = a.createTextNode("\n");
                a.appendChild(b, c);
                var c = a.createElement("div");
                a.setAttribute(c, "id", "search-curtain"),
                a.setAttribute(c, "class", "search-curtain"),
                a.appendChild(b, c);
                var c = a.createTextNode("\n");
                return a.appendChild(b, c),
                b
            },
            render: function(c, d, e) {
                var f = d.dom
                  , g = d.hooks
                  , h = g.get
                  , i = g.inline
                  , j = g.subexpr
                  , k = g.concat
                  , l = g.attribute
                  , m = g.block;
                f.detectNamespace(e);
                var n;
                d.useFragmentCache && f.canClone ? (null === this.cachedFragment && (n = this.build(f),
                this.hasRendered ? this.cachedFragment = n : this.hasRendered = !0),
                this.cachedFragment && (n = f.cloneNode(this.cachedFragment, !0))) : n = this.build(f);
                var o = f.childAt(n, [0, 1, 1, 1])
                  , p = f.childAt(o, [3])
                  , q = f.createMorphAt(f.childAt(o, [1, 1]), 1, 1)
                  , r = f.createMorphAt(p, 1, 1)
                  , s = f.createAttrMorph(p, "class");
                return i(d, q, c, "view", [h(d, c, "view.searchField")], {
                    ariaOwns: "searchList",
                    app: h(d, c, "view.app")
                }),
                l(d, s, p, "class", k(d, ["searchresults ", j(d, c, "if", [h(d, c, "isSearchVisible"), "with-content with-content-initial", ""], {})])),
                m(d, r, c, "if", [h(d, c, "view.app.searchResult")], {}, a, b),
                n
            }
        }
    }())
}),
define("shared/ax/tabindex-manager", [], function() {
    return Em.Object.extend({
        axFocus: void 0,
        rootNode: void 0,
        domReady: function() {
            var a = this.get("rootNode");
            a && a.find("a").attr("tabindex", "-1")
        },
        updateCurrentFocus: function() {
            var a = this.get("axFocus");
            if (a && a.setAttribute) {
                a.setAttribute("tabIndex", 0),
                a.setAttribute("aria-selected", "true"),
                a.focus();
                var b = a.getAttribute("id")
                  , c = this.get("rootNode");
                c && c.setAttribute && c.setAttribute("aria-activedescendant", b)
            } else
                Em.Logger.warn("couldn't set the tabindex prop of axFocus ", a)
        }
        .observes("axFocus"),
        clearPreviousFocus: function() {
            var a = this.get("axFocus");
            a && a.setAttribute && (a.setAttribute("tabIndex", -1),
            a.setAttribute("aria-selected", "false"),
            a.blur())
        }
        .observesBefore("axFocus")
    })
}),
define("search/view", ["precompiled/search/template", "shared/ax/tabindex-manager", "shared/computed", "shared/browser"], function(a, b, c, d) {
    var e = Em.TextField.extend({
        classNames: ["searchform-input"],
        type: "msie" === d.get("name") && "9.0" === d.get("version") ? "text" : "search",
        ariaRole: "combobox",
        attributeBindings: ["ariaOwns:aria-owns"],
        valueBinding: "app.searchString",
        changeBinding: "app.commitSearch",
        init: function() {
            this._super(),
            this.set("placeholder", c.loc("$SEARCH_BOOK_LABEL$", this.get("app.book.title")))
        }
    });
    return Em.View.extend({
        template: a,
        ariaRole: "search",
        classNameBindings: [":search-results", ":scroll", "app.searchResult::no-result"],
        attributeBindings: ["ariaHidden:aria-hidden"],
        ariaHidden: c.invertedTruthString("app.isSearchVisible"),
        searchField: e,
        init: function() {
            this._super(),
            this.set("tabIndexManager", b.create()),
            this.set("tabIndexManager.rootNode", this.$())
        },
        searchCountSummary: function() {
            var a = this.get("app.searchResult")
              , b = a ? a.get("sortedTopics").length : 0
              , c = a ? a.get("query") : ""
              , d = 1 === b ? "$SEARCH_RESULT_COUNT_SINGLE$" : "$SEARCH_RESULTS_COUNT_MULTIPLE$"
              , e = d.loc(b, c);
            if ("Arabic" === this.get("app.bundle.currentLocale.isoName")) {
                var f = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
                e = e.replace(/[0-9]/g, function(a) {
                    return f[+a]
                })
            }
            return e
        }
        .property("Em.STRINGS", "app.searchResult"),
        didInsertElement: function() {
            if (this._super(),
            d.get("isMobile")) {
                this.set("scrollFix", new ScrollFix(this.get("element")));
                var a = this;
                $(window).on("orientationchange", function() {
                    a.get("ariaHidden") === !1 && a.rerender()
                })
            }
        },
        willDestroyElement: function() {
            d.get("isMobile") && this.get("scrollFix").destroy()
        },
        keyPress: function(a) {
            13 === a.charCode && (this.get("app").commitSearch(),
            a.preventDefault())
        },
        touchMove: function(a) {
            var b = $(a.target);
            b.is("input") || Em.run.debounce(this, function() {
                this.get("app").blurSearch()
            }, 500, !0)
        },
        keyDown: function(a) {
            var b = (this.get("tabIndexManager.axFocus"),
            "rtl" === this.get("controller.bundle.currentLocale.text-direction"))
              , c = 38
              , d = 40
              , e = b ? 39 : 37
              , f = b ? 37 : 39
              , g = a.keyCode || a.which;
            if (!$(a.target).is("input") || g !== e && g !== f) {
                switch (g) {
                case e:
                case c:
                    this.tabFocusToPrevious(),
                    a.preventDefault();
                    break;
                case f:
                case d:
                    this.tabFocusToNext(),
                    a.preventDefault();
                    break;
                default:
                    this._super(a)
                }
                a.stopPropagation()
            }
        },
        tabFocusedResultIndex: -1,
        tabFocusToNext: function() {
            var a = this.get("tabFocusedResultIndex") + 1
              , b = this.$("a[href]").get(a);
            b && (this.set("tabFocusedResultIndex", a),
            this.set("tabIndexManager.axFocus", b))
        },
        tabFocusToPrevious: function() {
            var a = this.get("tabFocusedResultIndex") - 1
              , b = this.$("a[href]").get(a);
            b && (this.set("tabFocusedResultIndex", a),
            this.set("tabIndexManager.axFocus", b))
        },
        clearFocusedResultIndex: function() {
            this.get("tabIndexManager").domReady();
            var a = this.$("a[href].active")
              , b = this.$("a[href]").index(a);
            this.set("tabFocusedResultIndex", b || -1),
            this.set("tabIndexManager.axFocus", a || void 0)
        }
        .property("app.searchResult"),
        click: function(a) {
            var b, c, d = $(a.target);
            if (d.is("a[href]")) {
                if (this.$(".search-results .list a").removeClass("active"),
                d.addClass("active"),
                d.parent().is(".searchresults-item")) {
                    var e = this.get("app.trackingController")
                      , f = d.parent().is(".searchresults-quicklink");
                    f ? e.searchQuickLinkSelect(d.text(), d.attr("href").split("#/")[1]) : (b = this.get("app.searchResult"),
                    c = this.$("a[href]").index(d),
                    e.searchResultSelect(b, c))
                }
                Em.run.later(this, function() {
                    location.href = d.attr("href"),
                    this.get("app").hidePanels()
                }, 50),
                a.preventDefault()
            } else
                d.is("#search-curtain") && this.get("app").toggleSearch();
            this._super(a)
        }
    })
}),
define("precompiled/toc/template", [], function() {
    return Ember.HTMLBars.template(function() {
        var a = function() {
            return {
                isHTMLBars: !0,
                revision: "Ember@1.11.3",
                blockParams: 0,
                cachedFragment: null,
                hasRendered: !1,
                build: function(a) {
                    var b = a.createDocumentFragment()
                      , c = a.createTextNode("	");
                    a.appendChild(b, c);
                    var c = a.createElement("div");
                    a.setAttribute(c, "class", "toc-more-help");
                    var d = a.createElement("a");
                    a.setAttribute(d, "href", "help:openbook=com.apple.machelp");
                    var e = a.createComment("");
                    a.appendChild(d, e),
                    a.appendChild(c, d),
                    a.appendChild(b, c);
                    var c = a.createTextNode("\n");
                    return a.appendChild(b, c),
                    b
                },
                render: function(a, b, c) {
                    var d = b.dom
                      , e = b.hooks
                      , f = e.content;
                    d.detectNamespace(c);
                    var g;
                    b.useFragmentCache && d.canClone ? (null === this.cachedFragment && (g = this.build(d),
                    this.hasRendered ? this.cachedFragment = g : this.hasRendered = !0),
                    this.cachedFragment && (g = d.cloneNode(this.cachedFragment, !0))) : g = this.build(d);
                    var h = d.createUnsafeMorphAt(d.childAt(g, [1, 0]), 0, 0);
                    return f(b, h, a, "moreHelpLabel"),
                    g
                }
            }
        }();
        return {
            isHTMLBars: !0,
            revision: "Ember@1.11.3",
            blockParams: 0,
            cachedFragment: null,
            hasRendered: !1,
            build: function(a) {
                var b = a.createDocumentFragment()
                  , c = a.createComment("");
                return a.appendChild(b, c),
                b
            },
            render: function(b, c, d) {
                var e = c.dom
                  , f = c.hooks
                  , g = f.get
                  , h = f.block;
                e.detectNamespace(d);
                var i;
                c.useFragmentCache && e.canClone ? (null === this.cachedFragment && (i = this.build(e),
                this.hasRendered ? this.cachedFragment = i : this.hasRendered = !0),
                this.cachedFragment && (i = e.cloneNode(this.cachedFragment, !0))) : i = this.build(e);
                var j = e.createMorphAt(i, 0, 0, d);
                return e.insertBoundary(i, null),
                e.insertBoundary(i, 0),
                h(c, j, b, "if", [g(c, b, "doShowMoreHelpLink")], {}, a, null),
                i
            }
        }
    }())
}),
define("toc/helpers/elementClass", [], function() {
    return {
        add: function(a, b) {
            a.classList ? a.classList.add.apply(a.classList, b.split(" ")) : a.className += " " + b
        },
        remove: function(a, b) {
            a.classList ? a.classList.remove.apply(a.classList, b.split(" ")) : a.className = a.className.replace(new RegExp("(^|\\b)" + b.split(" ").join("|") + "(\\b|$)","gi"), " ")
        },
        contains: function(a, b) {
            return a.classList ? a.classList.contains(b) : new RegExp("(^| )" + b + "( |$)","gi").test(a.className)
        }
    }
}),
define("toc/helpers/createSection", ["toc/helpers/elementClass"], function(a) {
    var b = document.createElement.bind(document);
    return function(c, d) {
        var e = b("li")
          , f = b("a")
          , g = b("span")
          , h = b("div")
          , i = d(c.get("children"))
          , j = c.get("iconHref");
        if (j) {
            var k = b("img");
            k.setAttribute("src", j),
            k.setAttribute("alt", ""),
            a.add(k, "icon"),
            h.appendChild(k),
            a.add(e, "hasIcon")
        }
        return e.setAttribute("aria-expanded", "false"),
        e.setAttribute("role", "treeitem"),
        a.add(f, "section"),
        a.add(g, "disclosure-icon"),
        a.add(h, "name"),
        i.setAttribute("aria-hidden", "true"),
        i.setAttribute("role", "group"),
        i.setAttribute("role", "group"),
        i.style.maxHeight = "0",
        c.get("allChildrenHaveIcons") && a.add(i, "hasIcons"),
        h.appendChild(document.createTextNode(c.get("name"))),
        [g, h].forEach(f.appendChild.bind(f)),
        [f, i].forEach(e.appendChild.bind(e)),
        e
    }
}),
define("toc/helpers/createItem", ["toc/helpers/elementClass"], function(a) {
    function b() {
        return "HelpViewer"in window && "mtStatisticsIncrement"in HelpViewer && HelpViewer.mtStatisticsIncrement(0, 0, 1, 0),
        !0
    }
    var c = document.createElement.bind(document)
      , d = /^(http|help)/;
    return function(e) {
        var f = c("li")
          , g = c("a")
          , h = c("div")
          , i = e.get("iconHref");
        if (i) {
            var j = c("img");
            j.setAttribute("src", i),
            j.setAttribute("alt", ""),
            a.add(j, "icon"),
            h.appendChild(j),
            a.add(f, "hasIcon")
        }
        f.setAttribute("aria-selected", "false"),
        f.setAttribute("role", "treeitem");
        var k = e.get("id")
          , l = e.get("href");
        return g.setAttribute("href", d.test(l) ? l : "#/" + k),
        g.id = "toc-item-" + k,
        a.add(h, "name"),
        g.onClick = b,
        h.appendChild(document.createTextNode(e.get("name"))),
        g.appendChild(h),
        f.appendChild(g),
        f
    }
}),
define("toc/helpers/createList", ["toc/helpers/createSection", "toc/helpers/createItem", "shared/browser"], function(a, b, c) {
    var d = document.createElement.bind(document)
      , e = function(f) {
        var g = d("ul");
        return f.forEach(function(d) {
            var f, h = d.get("children");
            if (h)
                f = a(d, e);
            else {
                if (!c.get("canHandleHelpAnchorLinks") && d.href && d.href.match(/^help:anchor/i))
                    return;
                if (!c.get("canHandleHelpOpenBookLinks") && d.href && d.href.match(/^help:openbook/i))
                    return;
                f = b(d)
            }
            g.appendChild(f)
        }),
        g
    };
    return e
}),
define("toc/helpers/navigation", ["toc/helpers/elementClass"], function(a) {
    function b(b, c) {
        for (var d = []; !(c && b === c.parentElement || "UL" === b.tagName && a.contains(b, "toc")); )
            d.push(b),
            b = b.parentElement;
        return d
    }
    function c(a, c) {
        var d = c ? "false" : "true"
          , e = c ? "true" : "false"
          , f = b(a, c ? null : a.parentElement)
          , g = 0;
        f.forEach(function(b) {
            var f = "LI" === b.tagName
              , h = "UL" === b.tagName;
            if (f)
                b.setAttribute("aria-expanded", e);
            else if (h) {
                var i = !1;
                c && a !== b && "false" === b.getAttribute("aria-hidden") && (i = !0),
                i || (b.setAttribute("aria-hidden", d),
                g += b.scrollHeight,
                $(b).css("max-height", c ? "0px" : g),
                setTimeout(function() {
                    $(b).addClass("animating"),
                    $(b).css("max-height", c ? g : "0px")
                }, 0),
                setTimeout(function() {
                    $(b).removeClass("animating"),
                    $(b).css("max-height", c ? "" : "0px")
                }, 300))
            }
        })
    }
    function d(a) {
        var c = b(a);
        return c.reduce(function(a, b) {
            return a ? a = "UL" === b.tagName && "false" === b.getAttribute("aria-hidden") || "LI" === b.tagName && "true" === b.getAttribute("aria-expanded") : a
        }, !0)
    }
    var e = function(a) {
        var b = "UL" === a.tagName ? a : a.parentElement.querySelector("ul")
          , d = "false" === b.getAttribute("aria-hidden");
        c(b, !d)
    }
      , f = function(b) {
        if (b && !a.contains(b, "active")) {
            var c = b.parentElement.parentElement;
            d(c) || e(c),
            c.firstChild === b.parentElement && a.add(c.parentElement, "first-toc-item-active"),
            a.add(b, "active")
        }
    }
      , g = function(b) {
        if (b && a.contains(b, "active")) {
            var c = b.parentElement.parentElement;
            c.firstChild === b.parentElement && a.remove(c.parentElement, "first-toc-item-active"),
            a.remove(b, "active")
        }
    };
    return {
        toggleSection: e,
        selectItem: f,
        deselectItem: g
    }
}),
define("toc/view", ["precompiled/toc/template", "shared/ax/tabindex-manager", "shared/computed", "toc/helpers/createList", "toc/helpers/navigation", "toc/helpers/elementClass", "shared/browser"], function(a, b, c, d, e, f, g) {
    function h(a) {
        return $(a).siblings("ul").children("li").children("a")
    }
    function i(a) {
        return $(a).hasClass("section")
    }
    function j(a) {
        return $(a).closest("ul").siblings("a.section").get(0)
    }
    function k(a) {
        if (a) {
            var b = a.getElementsByTagName("a");
            return b.length > -1 ? b[0] : void 0
        }
    }
    function l(a) {
        var b = Em.get(a, "parentElement.previousElementSibling");
        return k(b)
    }
    function m(a) {
        var b = Em.get(a, "parentElement.nextElementSibling");
        return k(b)
    }
    function n(a) {
        var b = $(a);
        return b.hasClass("section") && b.siblings("ul").hasClass("expanded")
    }
    function o(a, b) {
        for (var c = a; n(c) && h(c); )
            c = b(c);
        return c
    }
    function p(a) {
        return a[a.length - 1]
    }
    function q(a) {
        return a[0]
    }
    function r(a) {
        return document.getElementById("toc-item-" + a)
    }
    return Em.View.extend({
        tabIndexManager: void 0,
        tagName: "nav",
        attributeBindings: ["ariaHidden:aria-hidden", "ariaLabel:aria-label"],
        ariaHidden: c.invertedTruthString("controller.isTOCVisible"),
        ariaLabel: c.loc("$TOC_LABEL$"),
        ariaRole: "navigation",
        template: a,
        init: function() {
            this._super(),
            this.set("tabIndexManager", b.create()),
            this.set("tabIndexManager.rootNode", this.$())
        },
        willInsertElement: function() {
            var a = this
              , b = a.get("controller.book.toc")
              , c = d(b);
            f.add(c, "toc scroll hasIcons"),
            c.setAttribute("aria-hidden", "false"),
            c.setAttribute("role", "tree");
            var e = this.get("element");
            e.insertBefore(c, e.firstChild),
            this.set("tocEl", c)
        },
        didInsertElement: function() {
            var a = g.get("isMobile")
              , b = this.$()
              , c = b[0].querySelector("ul.toc")
              , d = 20
              , h = 0
              , i = 0
              , j = this;
            this.set("isMobile", a),
            this.set("scrollDuration", a ? 400 : 200),
            this.set("scrollTimeout", 400 + this.get("scrollDuration")),
            this.currentTopicObserver(),
            a && (this.set("scrollFix", new ScrollFix(this.get("tocEl"))),
            b.on("touchstart", function(a) {
                h = a.originalEvent.changedTouches[0].pageX,
                i = a.originalEvent.changedTouches[0].pageY
            }),
            b.on("touchmove", function(a) {
                c.scrollHeight <= c.offsetHeight && a.preventDefault()
            }));
            var k = function(b) {
                if (a) {
                    var c = Math.abs(b.originalEvent.changedTouches[0].pageX - h) < d && Math.abs(b.originalEvent.changedTouches[0].pageY - i) < d;
                    if (!c)
                        return
                }
                var g = b.target
                  , k = f.contains(g, "disclosure-icon") && "SPAN" === g.tagName
                  , l = f.contains(g, "name") && "DIV" === g.tagName
                  , m = f.contains(g, "icon") && "IMG" === g.tagName;
                g = k || l || m ? g.parentElement : g,
                g = m ? g.parentElement : g;
                var n = f.contains(g, "section") && "A" === g.tagName
                  , o = !n && "A" === g.tagName;
                if (n)
                    e.toggleSection(g);
                else if (o && g.getAttribute("href")) {
                    j.get("controller").hidePanels();
                    var p = g.getAttribute("href");
                    p.match(/^help:/) ? window.location = p : (e.selectItem(g),
                    window.location.hash = p),
                    p && -1 !== p.indexOf("#/") && (p = p.split("#/")[1]),
                    j.get("controller.trackingController").tocSelect(p)
                }
                return !1
            };
            b.on("touchend", k),
            b.on("click", k),
            this.get("tabIndexManager").domReady()
        },
        willDestroyElement: function() {
            var a = this.$();
            g.get("isMobile") && (this.get("scrollFix").destroy(),
            a.off("touchstart"),
            a.off("click")),
            a.off("touchend"),
            a.off("click")
        },
        scrollActiveItemIntoView: function() {
            var a = this.get("activeItem").offsetTop
              , b = this.get("activeItem").offsetHeight
              , c = this.get("tocEl")
              , d = c.offsetHeight
              , e = c.scrollTop
              , f = a - e
              , g = d >= f + b && f > 0;
            g || $(c).animate({
                scrollTop: a
            }, this.get("scrollDuration"), "linear")
        },
        currentTopicObserver: function() {
            var a = this.get("controller.currentTopic")
              , b = r(a.get("id"))
              , c = this.get("activeItem");
            c && e.deselectItem(c),
            b && (e.selectItem(b),
            this.set("activeItem", b),
            this.set("tabIndexManager.axFocus", b),
            b.blur(),
            Ember.run.debounce(this, this.scrollActiveItemIntoView, this.get("scrollTimeout")))
        }
        .observes("controller.currentTopic"),
        keyDown: function(a) {
            var b = this.get("tabIndexManager.axFocus")
              , c = "rtl" === this.get("controller.bundle.currentLocale.text-direction")
              , d = 38
              , e = 40
              , f = c ? 39 : 37
              , g = c ? 37 : 39;
            switch (a.keyCode) {
            case d:
                this.tabIndexToPrevious(),
                a.preventDefault();
                break;
            case e:
                this.tabIndexToNext(),
                a.preventDefault();
                break;
            case f:
                i(b) ? b.click(a) : this.tabIndexToSection(),
                a.preventDefault();
                break;
            case g:
                b && b.click(a),
                a.preventDefault();
                break;
            default:
                this._super(a)
            }
            a.stopPropagation()
        },
        tabIndexToSection: function() {
            var a = this.get("tabIndexManager")
              , b = a.get("axFocus");
            b && a.set("axFocus", j(b) || b)
        },
        tabIndexToPrevious: function() {
            var a = this.get("tabIndexManager")
              , b = a.get("axFocus")
              , c = l(b);
            if (!c)
                return void this.tabIndexToSection();
            var d = o(c, function(a) {
                return p(h(a))
            });
            a.set("axFocus", d)
        },
        tabIndexToNext: function() {
            var a = this.get("tabIndexManager")
              , b = a.get("axFocus");
            if (n(b)) {
                var c = q(h(b));
                return void a.set("axFocus", c)
            }
            var d = m(b);
            for (candidate = j(b); !d && candidate; )
                d = m(candidate),
                candidate = j(candidate);
            d && a.set("axFocus", d)
        }
    })
}),
define("precompiled/feedback/template", [], function() {
    return Ember.HTMLBars.template(function() {
        return {
            isHTMLBars: !0,
            revision: "Ember@1.11.3",
            blockParams: 0,
            cachedFragment: null,
            hasRendered: !1,
            build: function(a) {
                var b = a.createDocumentFragment()
                  , c = a.createElement("p");
                a.setAttribute(c, "class", "solicit");
                var d = a.createTextNode("\n  ");
                a.appendChild(c, d);
                var d = a.createComment("");
                a.appendChild(c, d);
                var d = a.createTextNode("\n  ");
                a.appendChild(c, d);
                var d = a.createElement("a");
                a.setAttribute(d, "role", "button");
                var e = a.createComment("");
                a.appendChild(d, e),
                a.appendChild(c, d);
                var d = a.createTextNode("\n");
                a.appendChild(c, d),
                a.appendChild(b, c);
                var c = a.createTextNode("\n");
                a.appendChild(b, c);
                var c = a.createElement("p");
                a.setAttribute(c, "class", "choices-label");
                var d = a.createTextNode("\n  ");
                a.appendChild(c, d);
                var d = a.createComment("");
                a.appendChild(c, d);
                var d = a.createTextNode("\n");
                a.appendChild(c, d),
                a.appendChild(b, c);
                var c = a.createTextNode("\n");
                a.appendChild(b, c);
                var c = a.createElement("form");
                a.setAttribute(c, "action", "//wsidecar.apple.com/cgi-bin/fb_hlp/nph-sub/"),
                a.setAttribute(c, "method", "post"),
                a.setAttribute(c, "name", "feedback");
                var d = a.createTextNode("\n  ");
                a.appendChild(c, d);
                var d = a.createElement("input");
                a.setAttribute(d, "type", "hidden"),
                a.setAttribute(d, "name", "topicID"),
                a.appendChild(c, d);
                var d = a.createTextNode("\n  ");
                a.appendChild(c, d);
                var d = a.createElement("input");
                a.setAttribute(d, "type", "hidden"),
                a.setAttribute(d, "name", "topicName"),
                a.appendChild(c, d);
                var d = a.createTextNode("\n  ");
                a.appendChild(c, d);
                var d = a.createElement("div");
                a.setAttribute(d, "class", "choices");
                var e = a.createTextNode("\n  ");
                a.appendChild(d, e);
                var e = a.createElement("label")
                  , f = a.createElement("input");
                a.setAttribute(f, "type", "radio"),
                a.setAttribute(f, "name", "choice"),
                a.setAttribute(f, "value", "yes"),
                a.appendChild(e, f);
                var f = a.createTextNode(" ");
                a.appendChild(e, f);
                var f = a.createComment("");
                a.appendChild(e, f),
                a.appendChild(d, e);
                var e = a.createTextNode("\n  ");
                a.appendChild(d, e);
                var e = a.createElement("label")
                  , f = a.createElement("input");
                a.setAttribute(f, "type", "radio"),
                a.setAttribute(f, "name", "choice"),
                a.setAttribute(f, "value", "somewhat"),
                a.appendChild(e, f);
                var f = a.createTextNode(" ");
                a.appendChild(e, f);
                var f = a.createComment("");
                a.appendChild(e, f),
                a.appendChild(d, e);
                var e = a.createTextNode("\n  ");
                a.appendChild(d, e);
                var e = a.createElement("label")
                  , f = a.createElement("input");
                a.setAttribute(f, "type", "radio"),
                a.setAttribute(f, "name", "choice"),
                a.setAttribute(f, "value", "no"),
                a.appendChild(e, f);
                var f = a.createTextNode(" ");
                a.appendChild(e, f);
                var f = a.createComment("");
                a.appendChild(e, f),
                a.appendChild(d, e);
                var e = a.createTextNode("\n  ");
                a.appendChild(d, e),
                a.appendChild(c, d);
                var d = a.createTextNode("\n  ");
                a.appendChild(c, d);
                var d = a.createElement("label")
                  , e = a.createElement("strong")
                  , f = a.createComment("");
                a.appendChild(e, f),
                a.appendChild(d, e);
                var e = a.createElement("br");
                a.appendChild(d, e);
                var e = a.createElement("textarea");
                a.setAttribute(e, "name", "comments"),
                a.appendChild(d, e),
                a.appendChild(c, d);
                var d = a.createTextNode("\n  ");
                a.appendChild(c, d);
                var d = a.createElement("p")
                  , e = a.createElement("em")
                  , f = a.createComment("");
                a.appendChild(e, f),
                a.appendChild(d, e),
                a.appendChild(c, d);
                var d = a.createTextNode("\n  ");
                a.appendChild(c, d);
                var d = a.createElement("button");
                a.setAttribute(d, "name", "cancel");
                var e = a.createComment("");
                a.appendChild(d, e),
                a.appendChild(c, d);
                var d = a.createTextNode("\n  ");
                a.appendChild(c, d);
                var d = a.createElement("button");
                a.setAttribute(d, "name", "submit");
                var e = a.createComment("");
                a.appendChild(d, e),
                a.appendChild(c, d);
                var d = a.createTextNode("\n");
                a.appendChild(c, d),
                a.appendChild(b, c);
                var c = a.createTextNode("\n");
                a.appendChild(b, c);
                var c = a.createElement("p");
                a.setAttribute(c, "class", "confirm");
                var d = a.createTextNode("\n  ");
                a.appendChild(c, d);
                var d = a.createComment("");
                a.appendChild(c, d);
                var d = a.createTextNode("\n");
                a.appendChild(c, d),
                a.appendChild(b, c);
                var c = a.createTextNode("\n");
                return a.appendChild(b, c),
                b
            },
            render: function(a, b, c) {
                var d = b.dom
                  , e = b.hooks
                  , f = e.get
                  , g = e.subexpr
                  , h = e.concat
                  , i = e.attribute
                  , j = e.inline
                  , k = e.element
                  , l = e.content;
                d.detectNamespace(c);
                var m;
                b.useFragmentCache && d.canClone ? (null === this.cachedFragment && (m = this.build(d),
                this.hasRendered ? this.cachedFragment = m : this.hasRendered = !0),
                this.cachedFragment && (m = d.cloneNode(this.cachedFragment, !0))) : m = this.build(d);
                var n = d.childAt(m, [0])
                  , o = d.childAt(n, [3])
                  , p = d.childAt(m, [2])
                  , q = d.childAt(m, [4])
                  , r = d.childAt(q, [1])
                  , s = d.childAt(q, [3])
                  , t = d.childAt(q, [5])
                  , u = d.childAt(q, [7])
                  , v = d.childAt(u, [2])
                  , w = d.childAt(q, [11])
                  , x = d.childAt(q, [13])
                  , y = d.childAt(m, [6])
                  , z = d.createMorphAt(n, 1, 1)
                  , A = d.createAttrMorph(n, "aria-hidden")
                  , B = d.createMorphAt(o, 0, 0)
                  , C = d.createMorphAt(p, 1, 1)
                  , D = d.createAttrMorph(p, "aria-hidden")
                  , E = d.createAttrMorph(q, "aria-hidden")
                  , F = d.createAttrMorph(r, "value")
                  , G = d.createAttrMorph(s, "value")
                  , H = d.createMorphAt(d.childAt(t, [1]), 2, 2)
                  , I = d.createMorphAt(d.childAt(t, [3]), 2, 2)
                  , J = d.createMorphAt(d.childAt(t, [5]), 2, 2)
                  , K = d.createMorphAt(d.childAt(u, [0]), 0, 0)
                  , L = d.createAttrMorph(v, "disabled")
                  , M = d.createUnsafeMorphAt(d.childAt(q, [9, 0]), 0, 0)
                  , N = d.createMorphAt(w, 0, 0)
                  , O = d.createMorphAt(x, 0, 0)
                  , P = d.createAttrMorph(x, "disabled")
                  , Q = d.createMorphAt(y, 1, 1)
                  , R = d.createAttrMorph(y, "aria-hidden");
                return i(b, A, n, "aria-hidden", h(b, [g(b, a, "if", [f(b, a, "view.isSolicitHidden"), "true", "false"], {})])),
                j(b, z, a, "loc", ["$FEEDBACK_CHOICES_LABEL$"], {}),
                k(b, o, a, "action", ["showForm"], {
                    target: f(b, a, "view")
                }),
                j(b, B, a, "loc", ["$FEEDBACK_LINK$"], {}),
                i(b, D, p, "aria-hidden", h(b, [g(b, a, "if", [f(b, a, "view.isExpanded"), "false", "true"], {})])),
                j(b, C, a, "loc", ["$FEEDBACK_CHOICES_LABEL$"], {}),
                i(b, E, q, "aria-hidden", h(b, [g(b, a, "if", [f(b, a, "view.isExpanded"), "false", "true"], {})])),
                i(b, F, r, "value", h(b, [f(b, a, "view.topicID")])),
                i(b, G, s, "value", h(b, [f(b, a, "view.topicName")])),
                l(b, H, a, "view.choiceAffirmativeText"),
                l(b, I, a, "view.choiceTentativeText"),
                l(b, J, a, "view.choiceNegativeText"),
                j(b, K, a, "loc", ["$FEEDBACK_COMMENT_LABEL$"], {}),
                i(b, L, v, "disabled", h(b, [g(b, a, "if", [f(b, a, "view.isExpanded"), "", "disabled"], {})])),
                j(b, M, a, "loc", ["$FEEDBACK_POLICY_NOTICE$"], {}),
                k(b, w, a, "action", ["hideForm"], {
                    target: f(b, a, "view")
                }),
                j(b, N, a, "loc", ["$FEEDBACK_CANCEL_BUTTON_LABEL$"], {}),
                i(b, P, x, "disabled", h(b, [g(b, a, "if", [f(b, a, "view.canSubmit"), "", "disabled"], {})])),
                k(b, x, a, "action", ["submitForm"], {
                    target: f(b, a, "view")
                }),
                j(b, O, a, "loc", ["$FEEDBACK_SEND_BUTTON_LABEL$"], {}),
                i(b, R, y, "aria-hidden", h(b, [g(b, a, "if", [f(b, a, "view.isSubmitted"), "false", "true"], {})])),
                j(b, Q, a, "loc", ["$FEEDBACK_CONFIRMATION$"], {}),
                m
            }
        }
    }())
}),
define("feedback/view", ["precompiled/feedback/template", "shared/browser", "shared/computed"], function(a, b, c) {
    return Em.View.extend({
        classNames: ["instapaper_ignore"],
        classNameBindings: [":feedback"],
        template: a,
        app: Ember.computed.alias("controller.app"),
        isExpanded: !1,
        isSubmitted: !1,
        isSolicitHidden: Em.computed.or("isExpanded", "isSubmitted"),
        isSolicitHiddenString: c.truthString("isSolicitHidden"),
        isFormHiddenString: c.invertedTruthString("isExpanded"),
        isConfirmHiddenString: c.invertedTruthString("isSubmitted"),
        cancelButtonLabel: c.loc("$FEEDBACK_CANCEL_BUTTON_LABEL$"),
        choicesLabel: c.loc("$FEEDBACK_CHOICES_LABEL$"),
        choiceAffirmativeText: c.loc("$FEEDBACK_CHOICE_AFFIRMATIVE$"),
        choiceTentativeText: c.loc("$FEEDBACK_CHOICE_TENTATIVE$"),
        choiceNegativeText: c.loc("$FEEDBACK_CHOICE_NEGATIVE$"),
        commentLabel: c.loc("$FEEDBACK_COMMENT_LABEL$"),
        confirmationLabel: c.loc("$FEEDBACK_CONFIRMATION$"),
        linkText: c.loc("$FEEDBACK_LINK$"),
        policyNoticeText: c.loc("$FEEDBACK_POLICY_NOTICE$"),
        promptText: c.loc("$FEEDBACK_PROMPT$"),
        sendButtonLabel: c.loc("$FEEDBACK_SEND_BUTTON_LABEL$"),
        selectedChoice: void 0,
        canSubmit: function() {
            return Boolean(Em.get(this, "selectedChoice"))
        }
        .property("selectedChoice"),
        topicID: Em.computed.alias("parentView.content.id"),
        topicName: function() {
            return $("h1", this.get("parentView.content.template")).text()
        }
        .property("parentView.content.template"),
        click: function(a) {
            a.stopPropagation(),
            this.set("selectedChoice", this.$("input[name=choice]:checked").val())
        },
        actions: {
            showForm: function() {
                this.set("isExpanded", !0),
                this.$("button[name=submit]").focus()
            },
            hideForm: function() {
                this.set("isExpanded", !1),
                this.$(".solicit a").focus()
            },
            submitForm: function() {
                var a, c, d = this.get("selectedChoice");
                a = null === this.get("app.ENVIRONMENT") ? this.$("form").attr("action") : "localhost",
                c = {
                    helpValue: d,
                    comments: this.$("textarea").val().replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;"),
                    topicDate: (new Date).toISOString(),
                    topicID: this.get("parentView.content.id"),
                    topicTitle: this.get("topicName") || this.get("parentView.content.name"),
                    bookID: this.get("app.book.title"),
                    appVersion: this.get("app.book.version"),
                    buildVersion: this.get("app.book.build_id"),
                    locale: this.get("app.bundle.currentLocale.isoCode"),
                    source: this.get("app.isInHelpViewer") ? "help viewer" : "web",
                    browser: b.get("name"),
                    browserVersion: b.get("version"),
                    os: b.get("os")
                },
                $.ajax(a, {
                    data: c,
                    dataType: "jsonp",
                    jsonp: !1
                }),
                this.set("isSubmitted", !0),
                this.get("app.trackingController").feedbackSubmit(d),
                this.send("hideForm")
            }
        }
    })
}),
define("translations", [], function() {
    var a = {
        ar: {
            $NEXT_TOPIC_BUTTON_LABEL_SHORT$: "التالي",
            $PREV_TOPIC_BUTTON_LABEL_SHORT$: "السابق",
            $MODAL_CLOSE_BUTTON$: "إغلاق",
            $LANGUAGE_MENU_LABEL$: "تغيير اللغة",
            $SEARCH_BUTTON_LABEL$: "بحث",
            $SEARCH_BOOK_LABEL$: "بحث في %@",
            $SEARCH_FIELD_PLACEHOLDER$: "بحث في المساعدة",
            $SEARCH_RESULTS_COUNT_MULTIPLE$: "%@ من النتائج لـ “%@”",
            $SEARCH_RESULT_COUNT_SINGLE$: "%@ من النتائج لـ “%@”",
            $SEARCH_STRING_RESET_BUTTON_LABEL$: "إعادة تعيين",
            $TOC_BUTTON_LABEL_HIDE$: "إخفاء جدول المحتويات",
            $TOC_BUTTON_LABEL_SHOW$: "إظهار جدول المحتويات",
            $TOC_LABEL$: "جدول المحتويات",
            $TOPIC_LOAD_ERROR$: "الموضوع المحدد غير متوفر حاليًا.",
            $TOC_MORE_HELP$: "المزيد من المساعدة لجهاز Mac <span class='nb'>الخاص بك%@</span>",
            $LANDING_HIDE_TOC$: "إخفاء الموضوعات",
            $LANDING_SHOW_TOC$: "إظهار الموضوعات",
            $QUICK_LINKS_LABEL$: "روابط سريعة",
            $CONNECT_TO_INTERNET$: "<p>لعرض المساعدة، يجب أن تكون متصلاً بالإنترنت.</p>",
            $VIDEO_PLAY$: "تشغيل الفيديو",
            $VIDEO_PAUSE$: "إيقاف الفيديو مؤقتًا",
            $VIDEO_REPLAY: "إعادة تشغيل الفيديو"
        },
        bg: {
            $NEXT_TOPIC_BUTTON_LABEL_SHORT$: "Следващ",
            $PREV_TOPIC_BUTTON_LABEL_SHORT$: "Предишен",
            $MODAL_CLOSE_BUTTON$: "Затвори",
            $LANGUAGE_MENU_LABEL$: "Промени езика",
            $SEARCH_BUTTON_LABEL$: "Търси",
            $SEARCH_BOOK_LABEL$: "Търси %@",
            $SEARCH_FIELD_PLACEHOLDER$: "Търси в Помощ",
            $SEARCH_RESULTS_COUNT_MULTIPLE$: "%@ резултата за “%@”",
            $SEARCH_RESULT_COUNT_SINGLE$: "%@ резултат за „%@“",
            $SEARCH_STRING_RESET_BUTTON_LABEL$: "Изчисти",
            $TOC_BUTTON_LABEL_HIDE$: "Скрий съдържание",
            $TOC_BUTTON_LABEL_SHOW$: "Покажи съдържание",
            $TOC_LABEL$: "Съдържание",
            $TOPIC_LOAD_ERROR$: "Избраната тема не е достъпна в момента",
            $TOC_MORE_HELP$: "Още помощ за Вашия <span class='nb'>Mac%@</span>",
            $LANDING_HIDE_TOC$: "Скриване на теми",
            $LANDING_SHOW_TOC$: "Показване на теми",
            $QUICK_LINKS_LABEL$: "Бързи връзки",
            $CONNECT_TO_INTERNET$: "<p>За да преглеждате помощта, трябва да сте свързани в Интернет.</p>",
            $VIDEO_PLAY$: "Възпроизвеждане на видео",
            $VIDEO_PAUSE$: "Спиране на видео",
            $VIDEO_REPLAY: "Повторно възпроизвеждане на видео"
        },
        ca: {
            $NEXT_TOPIC_BUTTON_LABEL_SHORT$: "Següent",
            $PREV_TOPIC_BUTTON_LABEL_SHORT$: "Anterior",
            $MODAL_CLOSE_BUTTON$: "Tancar",
            $LANGUAGE_MENU_LABEL$: "Canviar idioma",
            $SEARCH_BUTTON_LABEL$: "Buscar",
            $SEARCH_BOOK_LABEL$: "Buscar a %@",
            $SEARCH_FIELD_PLACEHOLDER$: "Buscar a l’ajuda",
            $SEARCH_RESULTS_COUNT_MULTIPLE$: "%@ resultats per a “%@”",
            $SEARCH_RESULT_COUNT_SINGLE$: "%@ resultat per a “%@”",
            $SEARCH_STRING_RESET_BUTTON_LABEL$: "Restablir",
            $TOC_BUTTON_LABEL_HIDE$: "Ocultar la taula de contingut",
            $TOC_BUTTON_LABEL_SHOW$: "Mostrar la taula de contingut",
            $TOC_LABEL$: "Taula de contingut",
            $TOPIC_LOAD_ERROR$: "El tema seleccionat no està disponible en aquest moment",
            $TOC_MORE_HELP$: "Ajuda addicional per al teu <span class='nb'>Mac%@</span>",
            $LANDING_HIDE_TOC$: "Ocultar els temes",
            $LANDING_SHOW_TOC$: "Mostrar els temes",
            $QUICK_LINKS_LABEL$: "Enllaços ràpids",
            $CONNECT_TO_INTERNET$: "<p>Per veure l’ajuda, t’has de connectar a Internet.</p>",
            $VIDEO_PLAY$: "Reproduir vídeo",
            $VIDEO_PAUSE$: "Aturar vídeo",
            $VIDEO_REPLAY: "Tornar a reproduir vídeo"
        },
        cs: {
            $NEXT_TOPIC_BUTTON_LABEL_SHORT$: "Další",
            $PREV_TOPIC_BUTTON_LABEL_SHORT$: "Předchozí",
            $MODAL_CLOSE_BUTTON$: "Zavřít",
            $LANGUAGE_MENU_LABEL$: "Změnit jazyk",
            $SEARCH_BUTTON_LABEL$: "Hledat",
            $SEARCH_BOOK_LABEL$: "Prohledat: %@",
            $SEARCH_FIELD_PLACEHOLDER$: "Hledat v nápovědě",
            $SEARCH_RESULTS_COUNT_MULTIPLE$: "Výsledky (%@) pro dotaz „%@“",
            $SEARCH_RESULT_COUNT_SINGLE$: "Výsledky (%@) pro dotaz „%@“",
            $SEARCH_STRING_RESET_BUTTON_LABEL$: "Vynulovat",
            $TOC_BUTTON_LABEL_HIDE$: "Skrýt obsah",
            $TOC_BUTTON_LABEL_SHOW$: "Zobrazit obsah",
            $TOC_LABEL$: "Obsah",
            $TOPIC_LOAD_ERROR$: "Vybrané téma není k dispozici",
            $TOC_MORE_HELP$: "Další nápověda pro váš <span class='nb'>Mac%@</span>",
            $LANDING_HIDE_TOC$: "Skrýt témata",
            $LANDING_SHOW_TOC$: "Zobrazit témata",
            $QUICK_LINKS_LABEL$: "Rychlé odkazy",
            $CONNECT_TO_INTERNET$: "<p>Chcete-li zobrazit nápovědu, musíte být připojeni k internetu.</p>",
            $VIDEO_PLAY$: "Přehrát video",
            $VIDEO_PAUSE$: "Pozastavit video",
            $VIDEO_REPLAY: "Přehrát video znovu"
        },
        da: {
            $NEXT_TOPIC_BUTTON_LABEL_SHORT$: "Næste",
            $PREV_TOPIC_BUTTON_LABEL_SHORT$: "Forrige",
            $MODAL_CLOSE_BUTTON$: "Luk",
            $LANGUAGE_MENU_LABEL$: "Skift sprog",
            $SEARCH_BUTTON_LABEL$: "Søg",
            $SEARCH_BOOK_LABEL$: "Søg i %@",
            $SEARCH_FIELD_PLACEHOLDER$: "Søg",
            $SEARCH_RESULTS_COUNT_MULTIPLE$: "%@ resultater for “%@”",
            $SEARCH_RESULT_COUNT_SINGLE$: "%@ resultat for “%@”",
            $SEARCH_STRING_RESET_BUTTON_LABEL$: "Nulstil",
            $TOC_BUTTON_LABEL_HIDE$: "Skjul indholdsfortegnelse",
            $TOC_BUTTON_LABEL_SHOW$: "Vis indholdsfortegnelse",
            $TOC_LABEL$: "Indholdsfortegnelse",
            $TOPIC_LOAD_ERROR$: "Det valgte emne er ikke tilgængeligt",
            $TOC_MORE_HELP$: "Mere hjælp til din <span class='nb'>Mac%@</span>",
            $LANDING_HIDE_TOC$: "Skjul emner",
            $LANDING_SHOW_TOC$: "Vis emner",
            $QUICK_LINKS_LABEL$: "Links",
            $CONNECT_TO_INTERNET$: "<p>Der skal være en aktiv internetforbindelse, før du kan se hjælp.</p>",
            $VIDEO_PLAY$: "Afspil video",
            $VIDEO_PAUSE$: "Sæt video på pause",
            $VIDEO_REPLAY: "Afspil video igen"
        },
        de: {
            $SEARCH_DEPTH_LIMIT$: 10,
            $NEXT_TOPIC_BUTTON_LABEL_SHORT$: "Weiter",
            $PREV_TOPIC_BUTTON_LABEL_SHORT$: "Zurück",
            $MODAL_CLOSE_BUTTON$: "Schließen",
            $LANGUAGE_MENU_LABEL$: "Sprache wechseln",
            $SEARCH_BUTTON_LABEL$: "Suchen",
            $SEARCH_BOOK_LABEL$: "%@ suchen",
            $SEARCH_FIELD_PLACEHOLDER$: "Suchen",
            $SEARCH_RESULTS_COUNT_MULTIPLE$: "%@ Ergebnisse für „%@“",
            $SEARCH_RESULT_COUNT_SINGLE$: "%@ Ergebnis für „%@“",
            $SEARCH_STRING_RESET_BUTTON_LABEL$: "Zurücksetzen",
            $TOC_BUTTON_LABEL_HIDE$: "Inhaltsverzeichnis ausblenden",
            $TOC_BUTTON_LABEL_SHOW$: "Inhaltsverzeichnis einblenden",
            $TOC_LABEL$: "Inhaltsverzeichnis",
            $TOPIC_LOAD_ERROR$: "Das gewählte Thema ist derzeit nicht verfügbar",
            $TOC_MORE_HELP$: "Mehr Hilfe für den <span class='nb'>Mac%@</span>",
            $LANDING_HIDE_TOC$: "Themen ausblenden",
            $LANDING_SHOW_TOC$: "Themen anzeigen",
            $QUICK_LINKS_LABEL$: "Alles auf einen Klick",
            $CONNECT_TO_INTERNET$: "<p>Zum Anzeigen der Hilfe musst du mit dem Internet verbunden sein.</p>",
            $VIDEO_PLAY$: "Video wiedergeben",
            $VIDEO_PAUSE$: "Video anhalten",
            $VIDEO_REPLAY: "Video erneut wiedergeben"
        },
        el: {
            $NEXT_TOPIC_BUTTON_LABEL_SHORT$: "Επόμενο",
            $PREV_TOPIC_BUTTON_LABEL_SHORT$: "Προηγούμενο",
            $MODAL_CLOSE_BUTTON$: "Κλείσιμο",
            $LANGUAGE_MENU_LABEL$: "Αλλαγή γλώσσας",
            $SEARCH_BUTTON_LABEL$: "Αναζήτηση",
            $SEARCH_BOOK_LABEL$: "Αναζήτηση σε: %@",
            $SEARCH_FIELD_PLACEHOLDER$: "Αναζήτηση",
            $SEARCH_RESULTS_COUNT_MULTIPLE$: "%@ αποτελέσματα για «%@»",
            $SEARCH_RESULT_COUNT_SINGLE$: "%@ αποτέλεσμα για «%@»",
            $SEARCH_STRING_RESET_BUTTON_LABEL$: "Επαναφορά",
            $TOC_BUTTON_LABEL_HIDE$: "Απόκρυψη πίνακα περιεχομένων",
            $TOC_BUTTON_LABEL_SHOW$: "Εμφάνιση πίνακα περιεχομένων",
            $TOC_LABEL$: "Πίνακας περιεχομένων",
            $TOPIC_LOAD_ERROR$: "Tο επιλεγμένο θέμα δεν είναι διαθέσιμο τώρα",
            $TOC_MORE_HELP$: "Περισσότερη βοήθεια για το <span class='nb'>Mac %@</span>",
            $LANDING_HIDE_TOC$: "Απόκρυψη θεμάτων",
            $LANDING_SHOW_TOC$: "Εμφάνιση θεμάτων",
            $QUICK_LINKS_LABEL$: "Γρήγοροι σύνδεσμοι",
            $CONNECT_TO_INTERNET$: "<p>Για προβολή βοήθειας, πρέπει να είστε συνδεδεμένοι στο Διαδίκτυο.</p>",
            $VIDEO_PLAY$: "Αναπαραγωγή βίντεο",
            $VIDEO_PAUSE$: "Παύση βίντεο",
            $VIDEO_REPLAY: "Επανάληψη βίντεο"
        },
        en: {
            $FEEDBACK_CANCEL_BUTTON_LABEL$: "Cancel",
            $FEEDBACK_CHOICES_LABEL$: "Was this help page useful?",
            $FEEDBACK_CHOICE_AFFIRMATIVE$: "Yes. I found the information I was looking for.",
            $FEEDBACK_CHOICE_TENTATIVE$: "Somewhat. I found some of the information I was looking for.",
            $FEEDBACK_CHOICE_NEGATIVE$: "No. I did not find the information I was looking for.",
            $FEEDBACK_COMMENT_LABEL$: "Comments:",
            $FEEDBACK_CONFIRMATION$: "Thanks, your feedback has been sent.",
            $FEEDBACK_LINK$: "Send feedback.",
            $FEEDBACK_POLICY_NOTICE$: "Thank you for your comments; we regret that we can’t respond directly to you. Please read <a target='_blank' href='http://www.apple.com/legal/policies/ideas.html'>Apple's Unsolicited Idea Submission Policy</a>.",
            $FEEDBACK_PROMPT$: "Was this page helpful?",
            $FEEDBACK_SEND_BUTTON_LABEL$: "Send feedback",
            $NEXT_TOPIC_BUTTON_LABEL_SHORT$: "Next",
            $PREV_TOPIC_BUTTON_LABEL_SHORT$: "Previous",
            $MODAL_CLOSE_BUTTON$: "Close",
            $LANGUAGE_MENU_LABEL$: "Change Language",
            $SEARCH_BUTTON_LABEL$: "Search",
            $SEARCH_BOOK_LABEL$: "Search %@",
            $SEARCH_FIELD_PLACEHOLDER$: "Search Help",
            $SEARCH_RESULTS_COUNT_MULTIPLE$: "%@ results for “%@”",
            $SEARCH_RESULT_COUNT_SINGLE$: "%@ result for “%@”",
            $SEARCH_STRING_RESET_BUTTON_LABEL$: "Reset",
            $TOC_BUTTON_LABEL_HIDE$: "Hide table of contents",
            $TOC_BUTTON_LABEL_SHOW$: "Show table of contents",
            $TOC_LABEL$: "Table of contents",
            $TOPIC_LOAD_ERROR$: "The selected topic is currently unavailable",
            $CONNECT_TO_INTERNET$: "<p>To view help, you must be connected to the Internet.</p>",
            $TOC_MORE_HELP$: "More help for your <span class='nb'>Mac%@</span>",
            $LANDING_HIDE_TOC$: "Hide topics",
            $LANDING_SHOW_TOC$: "Show topics",
            $QUICK_LINKS_LABEL$: "Quick Links",
            $VIDEO_PLAY$: "Play video",
            $VIDEO_PAUSE$: "Pause video",
            $VIDEO_REPLAY$: "Replay video"
        },
        es: {
            $NEXT_TOPIC_BUTTON_LABEL_SHORT$: "Siguiente",
            $PREV_TOPIC_BUTTON_LABEL_SHORT$: "Anterior",
            $MODAL_CLOSE_BUTTON$: "Cerrar",
            $LANGUAGE_MENU_LABEL$: "Cambiar de idioma",
            $SEARCH_BUTTON_LABEL$: "Buscar",
            $SEARCH_BOOK_LABEL$: "Buscar en %@",
            $SEARCH_FIELD_PLACEHOLDER$: "Buscar en la ayuda",
            $SEARCH_RESULTS_COUNT_MULTIPLE$: "%@ resultados para “%@”",
            $SEARCH_RESULT_COUNT_SINGLE$: "%@ resultado para “%@”",
            $SEARCH_STRING_RESET_BUTTON_LABEL$: "Restablecer",
            $TOC_BUTTON_LABEL_HIDE$: "Ocultar tabla de contenido",
            $TOC_BUTTON_LABEL_SHOW$: "Mostrar tabla de contenido",
            $TOC_LABEL$: "Tabla de contenido",
            $TOPIC_LOAD_ERROR$: "El tema seleccionado no está disponible en estos momentos",
            $TOC_MORE_HELP$: "Más ayuda para tu <span class='nb'>Mac%@</span>",
            $LANDING_HIDE_TOC$: "Ocultar temas",
            $LANDING_SHOW_TOC$: "Mostrar temas",
            $QUICK_LINKS_LABEL$: "Enlaces rápidos",
            $CONNECT_TO_INTERNET$: "<p>Para ver la ayuda, debes estar conectado a Internet.</p>",
            $VIDEO_PLAY$: "Reproducir vídeo",
            $VIDEO_PAUSE$: "Poner vídeo en pausa",
            $VIDEO_REPLAY: "Volver a reproducir vídeo"
        },
        "es-mx": {
            $NEXT_TOPIC_BUTTON_LABEL_SHORT$: "Siguiente",
            $PREV_TOPIC_BUTTON_LABEL_SHORT$: "Anterior",
            $MODAL_CLOSE_BUTTON$: "Cerrar",
            $LANGUAGE_MENU_LABEL$: "Cambiar idioma",
            $SEARCH_BUTTON_LABEL$: "Buscar",
            $SEARCH_BOOK_LABEL$: "Buscar en %@",
            $SEARCH_FIELD_PLACEHOLDER$: "Buscar en Ayuda",
            $SEARCH_RESULTS_COUNT_MULTIPLE$: "%@ resultados de “%@”",
            $SEARCH_RESULT_COUNT_SINGLE$: "%@ resultado de “%@”",
            $SEARCH_STRING_RESET_BUTTON_LABEL$: "Restablecer",
            $TOC_BUTTON_LABEL_HIDE$: "Ocultar tabla de contenido",
            $TOC_BUTTON_LABEL_SHOW$: "Mostrar tabla de contenido",
            $TOC_LABEL$: "Tabla de contenido",
            $TOPIC_LOAD_ERROR$: "El tema seleccionado no está disponible por ahora",
            $TOC_MORE_HELP$: "Obtén más ayuda para tu <span class='nb'>Mac%@</span>",
            $LANDING_HIDE_TOC$: "Ocultar temas",
            $LANDING_SHOW_TOC$: "Mostrar temas",
            $QUICK_LINKS_LABEL$: "Enlaces rápidos",
            $CONNECT_TO_INTERNET$: "<p>Debes estar conectado a Internet para ver la ayuda.</p>",
            $VIDEO_PLAY$: "Reproducir video",
            $VIDEO_PAUSE$: "Pausar video",
            $VIDEO_REPLAY: "Repetir video"
        },
        et: {
            $NEXT_TOPIC_BUTTON_LABEL_SHORT$: "Järgmine",
            $PREV_TOPIC_BUTTON_LABEL_SHORT$: "Eelmine",
            $MODAL_CLOSE_BUTTON$: "Sule",
            $LANGUAGE_MENU_LABEL$: "Muuda keelt",
            $SEARCH_BUTTON_LABEL$: "Otsi",
            $SEARCH_BOOK_LABEL$: "Otsi: %@",
            $SEARCH_FIELD_PLACEHOLDER$: "Abi otsing",
            $SEARCH_RESULTS_COUNT_MULTIPLE$: "%@ tulemust päringule “%@”",
            $SEARCH_RESULT_COUNT_SINGLE$: "%@ tulemus päringule “%@”",
            $SEARCH_STRING_RESET_BUTTON_LABEL$: "Lähtesta",
            $TOC_BUTTON_LABEL_HIDE$: "Peida sisukord",
            $TOC_BUTTON_LABEL_SHOW$: "Kuva sisukord",
            $TOC_LABEL$: "Sisukord",
            $TOPIC_LOAD_ERROR$: "Valitud teema pole hetkel saadaval",
            $TOC_MORE_HELP$: "Rohkem abi teie <span class='nb'>Mac%@</span>-seadme jaoks",
            $LANDING_HIDE_TOC$: "Peida teemad",
            $LANDING_SHOW_TOC$: "Kuva teemad",
            $QUICK_LINKS_LABEL$: "Kiirlingid",
            $CONNECT_TO_INTERNET$: "<p>Abi vaatamiseks peab teil olema Interneti-ühendus.</p>",
            $VIDEO_PLAY$: "Esita video",
            $VIDEO_PAUSE$: "Peata video",
            $VIDEO_REPLAY: "Esita video uuesti"
        },
        fi: {
            $NEXT_TOPIC_BUTTON_LABEL_SHORT$: "Seuraava",
            $PREV_TOPIC_BUTTON_LABEL_SHORT$: "Edellinen",
            $MODAL_CLOSE_BUTTON$: "Sulje",
            $LANGUAGE_MENU_LABEL$: "Vaihda kieltä",
            $SEARCH_BUTTON_LABEL$: "Etsi",
            $SEARCH_BOOK_LABEL$: "Etsi sisällöstä %@",
            $SEARCH_FIELD_PLACEHOLDER$: "Etsi",
            $SEARCH_RESULTS_COUNT_MULTIPLE$: "%@ tulosta haulla ”%@”",
            $SEARCH_RESULT_COUNT_SINGLE$: "%@ tulos haulla ”%@”",
            $SEARCH_STRING_RESET_BUTTON_LABEL$: "Nollaa",
            $TOC_BUTTON_LABEL_HIDE$: "Kätke sisällysluettelo",
            $TOC_BUTTON_LABEL_SHOW$: "Näytä sisällysluettelo",
            $TOC_LABEL$: "Sisällysluettelo",
            $TOPIC_LOAD_ERROR$: "Valittu aihe ei ole tällä hetkellä käytettävissä",
            $TOC_MORE_HELP$: "Lisää ohjeita tuotteelle <span class='nb'>Mac%@</span>",
            $LANDING_HIDE_TOC$: "Kätke aiheet",
            $LANDING_SHOW_TOC$: "Näytä aiheet",
            $QUICK_LINKS_LABEL$: "Pikalinkit",
            $CONNECT_TO_INTERNET$: "<p>Sinun on oltava yhteydessä internetiin, jotta voit käyttää ohjetta.</p>",
            $VIDEO_PLAY$: "Toista video",
            $VIDEO_PAUSE$: "Keskeytä video",
            $VIDEO_REPLAY: "Toista video uudelleen"
        },
        fr: {
            $NEXT_TOPIC_BUTTON_LABEL_SHORT$: "Suivant",
            $PREV_TOPIC_BUTTON_LABEL_SHORT$: "Précédent",
            $MODAL_CLOSE_BUTTON$: "Fermer",
            $LANGUAGE_MENU_LABEL$: "Changer de langue",
            $SEARCH_BUTTON_LABEL$: "Rechercher",
            $SEARCH_BOOK_LABEL$: "Rechercher dans %@",
            $SEARCH_FIELD_PLACEHOLDER$: "Rechercher dans l’aide",
            $SEARCH_RESULTS_COUNT_MULTIPLE$: "%@ résultats pour « %@ »",
            $SEARCH_RESULT_COUNT_SINGLE$: "%@ résultat pour « %@ »",
            $SEARCH_STRING_RESET_BUTTON_LABEL$: "Réinitialiser",
            $TOC_BUTTON_LABEL_HIDE$: "Masquer la table des matières",
            $TOC_BUTTON_LABEL_SHOW$: "Afficher la table des matières",
            $TOC_LABEL$: "Table des matières",
            $TOPIC_LOAD_ERROR$: "La rubrique sélectionnée est actuellement indisponible.",
            $TOC_MORE_HELP$: "Plus d’aide pour votre <span class='nb'>Mac%@</span>",
            $LANDING_HIDE_TOC$: "Masquer les rubriques",
            $LANDING_SHOW_TOC$: "Afficher les rubriques",
            $QUICK_LINKS_LABEL$: "Raccourcis",
            $CONNECT_TO_INTERNET$: "<p>Pour consulter l’aide, vous devez être connecté à Internet.</p>",
            $VIDEO_PLAY$: "Lire la vidéo",
            $VIDEO_PAUSE$: "Suspendre la vidéo",
            $VIDEO_REPLAY: "Relire la vidéo"
        },
        "fr-ca": {
            $NEXT_TOPIC_BUTTON_LABEL_SHORT$: "Suivant",
            $PREV_TOPIC_BUTTON_LABEL_SHORT$: "Retour",
            $MODAL_CLOSE_BUTTON$: "Fermer",
            $LANGUAGE_MENU_LABEL$: "Changer de langue",
            $SEARCH_BUTTON_LABEL$: "Rechercher",
            $SEARCH_BOOK_LABEL$: "Recherche %@",
            $SEARCH_FIELD_PLACEHOLDER$: "Rechercher dans l’aide",
            $SEARCH_RESULTS_COUNT_MULTIPLE$: "%@ résultats pour « %@ »",
            $SEARCH_RESULT_COUNT_SINGLE$: "%@ résultat pour « %@ »",
            $SEARCH_STRING_RESET_BUTTON_LABEL$: "Réinitialiser",
            $TOC_BUTTON_LABEL_HIDE$: "Masquer la table des matières",
            $TOC_BUTTON_LABEL_SHOW$: "Afficher la table des matières",
            $TOC_LABEL$: "Table des matières",
            $TOPIC_LOAD_ERROR$: "Le sujet sélectionné est actuellement indisponible.",
            $TOC_MORE_HELP$: "Plus d’aide pour votre <span class='nb'>Mac%@</span>",
            $LANDING_HIDE_TOC$: "Masquer les sujets",
            $LANDING_SHOW_TOC$: "Afficher les sujets",
            $QUICK_LINKS_LABEL$: "Liens rapides",
            $CONNECT_TO_INTERNET$: "<p>Vous devez être connecté à Internet pour consulter l’aide.</p>",
            $VIDEO_PLAY$: "Lire la vidéo",
            $VIDEO_PAUSE$: "Suspendre la vidéo",
            $VIDEO_REPLAY: "Relire la vidéo"
        },
        he: {
            $NEXT_TOPIC_BUTTON_LABEL_SHORT$: "הבא",
            $PREV_TOPIC_BUTTON_LABEL_SHORT$: "הקודם",
            $MODAL_CLOSE_BUTTON$: "סגור",
            $LANGUAGE_MENU_LABEL$: "החלף שפה",
            $SEARCH_BUTTON_LABEL$: "חיפוש",
            $SEARCH_BOOK_LABEL$: "חפש ב-%@",
            $SEARCH_FIELD_PLACEHOLDER$: "חיפוש",
            $SEARCH_RESULTS_COUNT_MULTIPLE$: "%@ תוצאות עבור ״%@״",
            $SEARCH_RESULT_COUNT_SINGLE$: "%@ תוצאות עבור ״%@״",
            $SEARCH_STRING_RESET_BUTTON_LABEL$: "אפס",
            $TOC_BUTTON_LABEL_HIDE$: "הסתר את תוכן העניינים",
            $TOC_BUTTON_LABEL_SHOW$: "הצג את תוכן העניינים",
            $TOC_LABEL$: "תוכן העניינים",
            $TOPIC_LOAD_ERROR$: "הנושא שנבחר אינו זמין כעת.",
            $TOC_MORE_HELP$: "עזרה נוספת עבור ה-Mac <span class='nb'>שלך%@</span>",
            $LANDING_HIDE_TOC$: "הסתר נושאים",
            $LANDING_SHOW_TOC$: "הצג נושאים",
            $QUICK_LINKS_LABEL$: "קישורים מהירים",
            $CONNECT_TO_INTERNET$: "<p>להצגת עזרה, עליך להיות מחובר/ת לאינטרנט.</p>",
            $VIDEO_PLAY$: "נגן וידאו",
            $VIDEO_PAUSE$: "השהה וידאו",
            $VIDEO_REPLAY: "נגן שוב וידאו"
        },
        hi: {
            $NEXT_TOPIC_BUTTON_LABEL_SHORT$: "अगला",
            $PREV_TOPIC_BUTTON_LABEL_SHORT$: "पिछला",
            $MODAL_CLOSE_BUTTON$: "बंद करें",
            $LANGUAGE_MENU_LABEL$: "भाषा बदलें",
            $SEARCH_BUTTON_LABEL$: "खोजें",
            $SEARCH_BOOK_LABEL$: "%@ खोजें",
            $SEARCH_FIELD_PLACEHOLDER$: "सहायता खोजें",
            $SEARCH_RESULTS_COUNT_MULTIPLE$: "“%@2” के लिए %@1 परिणाम",
            $SEARCH_RESULT_COUNT_SINGLE$: "“%@2” के लिए %@1 परिणाम",
            $SEARCH_STRING_RESET_BUTTON_LABEL$: "रीसेट करें",
            $TOC_BUTTON_LABEL_HIDE$: "कॉन्टेंट तालिका छिपाएँ",
            $TOC_BUTTON_LABEL_SHOW$: "कॉन्टेंट तालिका दिखाएँ",
            $TOC_LABEL$: "कॉन्टेंट तालिका",
            $TOPIC_LOAD_ERROR$: "चयनित विषय वर्तमान में अनुपलब्ध है",
            $TOC_MORE_HELP$: "आपके <span class='nb'>Mac%@</span> के लिए अधिक सहायता",
            $LANDING_HIDE_TOC$: "विषय छिपाएँ",
            $LANDING_SHOW_TOC$: "विषय दिखाएँ",
            $QUICK_LINKS_LABEL$: "त्वरित लिंक",
            $CONNECT_TO_INTERNET$: "<p>सहायता देखने के लिए आपका इंटरनेट से कनेक्टेड होना आवश्यक है।</p>",
            $VIDEO_PLAY$: "वीडियो चलाएँ",
            $VIDEO_PAUSE$: "वीडियो को विराम दें",
            $VIDEO_REPLAY: "वीडियो पुनः चलाएँ"
        },
        hr: {
            $NEXT_TOPIC_BUTTON_LABEL_SHORT$: "Sljedeće",
            $PREV_TOPIC_BUTTON_LABEL_SHORT$: "Prethodno",
            $MODAL_CLOSE_BUTTON$: "Zatvori",
            $LANGUAGE_MENU_LABEL$: "Promijeni jezik",
            $SEARCH_BUTTON_LABEL$: "Pretraži",
            $SEARCH_BOOK_LABEL$: "Pretraži %@",
            $SEARCH_FIELD_PLACEHOLDER$: "Pretraži Pomoć",
            $SEARCH_RESULTS_COUNT_MULTIPLE$: "%@ rezultata za “%@”",
            $SEARCH_RESULT_COUNT_SINGLE$: "%@ rezultat za “%@”",
            $SEARCH_STRING_RESET_BUTTON_LABEL$: "Resetiraj",
            $TOC_BUTTON_LABEL_HIDE$: "Sakrij kazalo sadržaja",
            $TOC_BUTTON_LABEL_SHOW$: "Prikaži kazalo sadržaja",
            $TOC_LABEL$: "Kazalo sadržaja",
            $TOPIC_LOAD_ERROR$: "Odabrana tema trenutačno nije dostupna",
            $TOC_MORE_HELP$: "Dodatna pomoć za vaš <span class='nb'>Mac%@</span>",
            $LANDING_HIDE_TOC$: "Sakrij teme",
            $LANDING_SHOW_TOC$: "Prikaži teme",
            $QUICK_LINKS_LABEL$: "Brzi linkovi",
            $CONNECT_TO_INTERNET$: "<p>Za prikaz pomoći morate biti spojeni na Internet.</p>",
            $VIDEO_PLAY$: "Reprodukcija videozapisa",
            $VIDEO_PAUSE$: "Pauziranje videozapisa",
            $VIDEO_REPLAY: "Ponovna reprodukcija videozapisa"
        },
        hu: {
            $NEXT_TOPIC_BUTTON_LABEL_SHORT$: "Következő",
            $PREV_TOPIC_BUTTON_LABEL_SHORT$: "Előző",
            $MODAL_CLOSE_BUTTON$: "Bezárás",
            $LANGUAGE_MENU_LABEL$: "Nyelv módosítása",
            $SEARCH_BUTTON_LABEL$: "Keresés",
            $SEARCH_BOOK_LABEL$: "A(z) %@ keresése",
            $SEARCH_FIELD_PLACEHOLDER$: "Keresés a súgóban",
            $SEARCH_RESULTS_COUNT_MULTIPLE$: "%@ eredmény a következőre: „%@”",
            $SEARCH_RESULT_COUNT_SINGLE$: "%@ találat a következőre: „ %@ ”",
            $SEARCH_STRING_RESET_BUTTON_LABEL$: "Alaphelyzetbe állítás",
            $TOC_BUTTON_LABEL_HIDE$: "Tartalomjegyzék elrejtése",
            $TOC_BUTTON_LABEL_SHOW$: "Tartalomjegyzék megjelenítése",
            $TOC_LABEL$: "Tartalomjegyzék",
            $TOPIC_LOAD_ERROR$: "A kijelölt témakör jelenleg nem érhető el.",
            $TOC_MORE_HELP$: "További segítség <span class='nb'>Mac gépéhez%@</span>",
            $LANDING_HIDE_TOC$: "Témakörök elrejtése",
            $LANDING_SHOW_TOC$: "Témakörök megjelenítése",
            $QUICK_LINKS_LABEL$: "Gyorshivatkozások",
            $CONNECT_TO_INTERNET$: "<p>A súgó megtekintéséhez csatlakoznia kell az internethez.</p>",
            $VIDEO_PLAY$: "Videó lejátszása",
            $VIDEO_PAUSE$: "Videó szüneteltetése",
            $VIDEO_REPLAY: "Videó ismételt lejátszása"
        },
        id: {
            $NEXT_TOPIC_BUTTON_LABEL_SHORT$: "Berikutnya",
            $PREV_TOPIC_BUTTON_LABEL_SHORT$: "Sebelumnya",
            $MODAL_CLOSE_BUTTON$: "Tutup",
            $LANGUAGE_MENU_LABEL$: "Ubah Bahasa",
            $SEARCH_BUTTON_LABEL$: "Cari",
            $SEARCH_BOOK_LABEL$: "Cari di %@",
            $SEARCH_FIELD_PLACEHOLDER$: "Cari di Bantuan",
            $SEARCH_RESULTS_COUNT_MULTIPLE$: "%@ hasil untuk “%@”",
            $SEARCH_RESULT_COUNT_SINGLE$: "%@ hasil untuk “%@”",
            $SEARCH_STRING_RESET_BUTTON_LABEL$: "Atur Ulang",
            $TOC_BUTTON_LABEL_HIDE$: "Sembunyikan daftar isi",
            $TOC_BUTTON_LABEL_SHOW$: "Tampilkan daftar isi",
            $TOC_LABEL$: "Daftar isi",
            $TOPIC_LOAD_ERROR$: "Topik yang dipilih saat ini tidak tersedia",
            $TOC_MORE_HELP$: "Bantuan lainnya untuk <span class='nb'>Mac%@</span> Anda",
            $LANDING_HIDE_TOC$: "Sembunyikan topik",
            $LANDING_SHOW_TOC$: "Tampilkan topik",
            $QUICK_LINKS_LABEL$: "Tautan Cepat",
            $CONNECT_TO_INTERNET$: "<p>Untuk melihat bantuan, Anda harus terhubung ke Internet.</p>",
            $VIDEO_PLAY$: "Putar video",
            $VIDEO_PAUSE$: "Jeda video",
            $VIDEO_REPLAY: "Putar ulang video"
        },
        it: {
            $NEXT_TOPIC_BUTTON_LABEL_SHORT$: "Avanti",
            $PREV_TOPIC_BUTTON_LABEL_SHORT$: "Indietro",
            $MODAL_CLOSE_BUTTON$: "Chiudi",
            $LANGUAGE_MENU_LABEL$: "Cambia lingua",
            $SEARCH_BUTTON_LABEL$: "Cerca",
            $SEARCH_BOOK_LABEL$: "Cerca in %@",
            $SEARCH_FIELD_PLACEHOLDER$: "Cerca",
            $SEARCH_RESULTS_COUNT_MULTIPLE$: "%@ risultati per “%@”",
            $SEARCH_RESULT_COUNT_SINGLE$: "%@ risultato per “%@”",
            $SEARCH_STRING_RESET_BUTTON_LABEL$: "Inizializza",
            $TOC_BUTTON_LABEL_HIDE$: "Nascondi indice",
            $TOC_BUTTON_LABEL_SHOW$: "Mostra indice",
            $TOC_LABEL$: "Indice",
            $TOPIC_LOAD_ERROR$: "L'argomento selezionato non è al momento disponibile.",
            $TOC_MORE_HELP$: "Altro aiuto per il tuo <span class='nb'>Mac%@</span>",
            $LANDING_HIDE_TOC$: "Nascondi argomenti",
            $LANDING_SHOW_TOC$: "Mostra argomenti",
            $QUICK_LINKS_LABEL$: "Link veloci",
            $CONNECT_TO_INTERNET$: "<p>Per visualizzare l'aiuto, devi essere connesso a Internet.</p>",
            $VIDEO_PLAY$: "Riproduzione del video",
            $VIDEO_PAUSE$: "Pausa del video",
            $VIDEO_REPLAY: "Nuova riproduzione del video"
        },
        ja: {
            $NO_WORD_BREAKS$: !0,
            $NEXT_TOPIC_BUTTON_LABEL_SHORT$: "次へ",
            $PREV_TOPIC_BUTTON_LABEL_SHORT$: "前へ",
            $MODAL_CLOSE_BUTTON$: "閉じる",
            $LANGUAGE_MENU_LABEL$: "言語を変更",
            $SEARCH_BUTTON_LABEL$: "検索",
            $SEARCH_BOOK_LABEL$: "%@を検索",
            $SEARCH_FIELD_PLACEHOLDER$: "ヘルプを検索",
            $SEARCH_RESULTS_COUNT_MULTIPLE$: "“%@2”の結果 %@1 件",
            $SEARCH_RESULT_COUNT_SINGLE$: "“%@2”の結果 %@1 件",
            $SEARCH_STRING_RESET_BUTTON_LABEL$: "リセット",
            $TOC_BUTTON_LABEL_HIDE$: "目次を隠す",
            $TOC_BUTTON_LABEL_SHOW$: "目次を表示",
            $TOC_LABEL$: "目次",
            $TOPIC_LOAD_ERROR$: "選択したトピックは現在利用できません",
            $TOC_MORE_HELP$: "<span class='nb'>Mac%@</span>のその他のヘルプ",
            $LANDING_HIDE_TOC$: "トピックを隠す",
            $LANDING_SHOW_TOC$: "トピックを表示",
            $QUICK_LINKS_LABEL$: "クイックリンク",
            $CONNECT_TO_INTERNET$: "<p>ヘルプを見るには、インターネットに接続する必要があります。</p>",
            $VIDEO_PLAY$: "ビデオを再生",
            $VIDEO_PAUSE$: "ビデオを一時停止",
            $VIDEO_REPLAY: "ビデオをもう一度再生"
        },
        kk: {
            $NEXT_TOPIC_BUTTON_LABEL_SHORT$: "Келесі",
            $PREV_TOPIC_BUTTON_LABEL_SHORT$: "Алдыңғы",
            $MODAL_CLOSE_BUTTON$: "Жабу",
            $LANGUAGE_MENU_LABEL$: "Тілді өзгерту",
            $SEARCH_BUTTON_LABEL$: "Іздеу",
            $SEARCH_BOOK_LABEL$: "%@ ішінен іздеу",
            $SEARCH_FIELD_PLACEHOLDER$: "Анықтама іздеу",
            $SEARCH_RESULTS_COUNT_MULTIPLE$: "“%@” үшін %@ нәтиже",
            $SEARCH_RESULT_COUNT_SINGLE$: "“%@” үшін %@ нәтиже",
            $SEARCH_STRING_RESET_BUTTON_LABEL$: "Қайта орнату",
            $TOC_BUTTON_LABEL_HIDE$: "Мазмұнды жасыру",
            $TOC_BUTTON_LABEL_SHOW$: "Мазмұнды көрсету",
            $TOC_LABEL$: "Мазмұны",
            $TOPIC_LOAD_ERROR$: "Таңдалған тақырып қазір қолжетімді емес",
            $TOC_MORE_HELP$: "Mac компьютеріңіз үшін қосымша <span class='nb'>анықтама%@</span>",
            $LANDING_HIDE_TOC$: "Тақырыптарды жасыру",
            $LANDING_SHOW_TOC$: "Тақырыптарды көрсету",
            $QUICK_LINKS_LABEL$: "Жылдам сілтемелер",
            $CONNECT_TO_INTERNET$: "<p>Анықтаманы қарау үшін Интернетке қосылуыңыз керек.</p>",
            $VIDEO_PLAY$: "Бейнені ойнату",
            $VIDEO_PAUSE$: "Бейнені уақытша тоқтату",
            $VIDEO_REPLAY: "Бейнені қайта ойнату"
        },
        ko: {
            $NEXT_TOPIC_BUTTON_LABEL_SHORT$: "다음",
            $PREV_TOPIC_BUTTON_LABEL_SHORT$: "이전",
            $MODAL_CLOSE_BUTTON$: "닫기",
            $LANGUAGE_MENU_LABEL$: "언어 변경",
            $SEARCH_BUTTON_LABEL$: "검색",
            $SEARCH_BOOK_LABEL$: "%@ 검색",
            $SEARCH_FIELD_PLACEHOLDER$: "도움말 검색",
            $SEARCH_RESULTS_COUNT_MULTIPLE$: "%@개의 ‘%@’에 대한 결과",
            $SEARCH_RESULT_COUNT_SINGLE$: "%@개의 ‘%@’에 대한 결과",
            $SEARCH_STRING_RESET_BUTTON_LABEL$: "재설정",
            $TOC_BUTTON_LABEL_HIDE$: "목차 가리기",
            $TOC_BUTTON_LABEL_SHOW$: "목차 보기",
            $TOC_LABEL$: "목차",
            $TOPIC_LOAD_ERROR$: "선택한 주제를 지금 사용할 수 없습니다.",
            $TOC_MORE_HELP$: "추가 Mac <span class='nb'>도움말%@</span>",
            $LANDING_HIDE_TOC$: "주제 가리기",
            $LANDING_SHOW_TOC$: "주제 보기",
            $QUICK_LINKS_LABEL$: "빠른 링크",
            $CONNECT_TO_INTERNET$: "<p>도움말을 보려면 인터넷에 연결되어 있어야 합니다.</p>",
            $VIDEO_PLAY$: "비디오 재생",
            $VIDEO_PAUSE$: "비디오 일시 정지",
            $VIDEO_REPLAY: "비디오 다시 재생"
        },
        lt: {
            $NEXT_TOPIC_BUTTON_LABEL_SHORT$: "Kitas",
            $PREV_TOPIC_BUTTON_LABEL_SHORT$: "Ankstesnis",
            $MODAL_CLOSE_BUTTON$: "Uždaryti",
            $LANGUAGE_MENU_LABEL$: "Keisti kalbą",
            $SEARCH_BUTTON_LABEL$: "Ieškoti",
            $SEARCH_BOOK_LABEL$: "Paieska %@",
            $SEARCH_FIELD_PLACEHOLDER$: "Ieškoti žinyne",
            $SEARCH_RESULTS_COUNT_MULTIPLE$: "Rezultatų pagal „%@“: %@",
            $SEARCH_RESULT_COUNT_SINGLE$: "%@ rezultatas pagal „%@“",
            $SEARCH_STRING_RESET_BUTTON_LABEL$: "Nustatyti iš naujo",
            $TOC_BUTTON_LABEL_HIDE$: "Slėpti turinį",
            $TOC_BUTTON_LABEL_SHOW$: "Rodyti turinį",
            $TOC_LABEL$: "Turinys",
            $TOPIC_LOAD_ERROR$: "Pasirinkta tema šiuo metu negalima",
            $TOC_MORE_HELP$: "Pagalba jūsų <span class='nb'>„Mac“%@</span>",
            $LANDING_HIDE_TOC$: "Slėpti temas",
            $LANDING_SHOW_TOC$: "Rodyti temas",
            $QUICK_LINKS_LABEL$: "Sparčiosios nuorodos",
            $CONNECT_TO_INTERNET$: "<p>Norėdami peržiūrėti pagalbos puslapį, turite prisijungti prie interneto.</p>",
            $VIDEO_PLAY$: "Paleisti vaizdo įrašą",
            $VIDEO_PAUSE$: "Pristabdyti vaizdo įrašą",
            $VIDEO_REPLAY: "Vėl paleisti vaizdo įrašą"
        },
        lv: {
            $NEXT_TOPIC_BUTTON_LABEL_SHORT$: "Nākamā",
            $PREV_TOPIC_BUTTON_LABEL_SHORT$: "Iepriekšējā",
            $MODAL_CLOSE_BUTTON$: "Aizvērt",
            $LANGUAGE_MENU_LABEL$: "Mainīt valodu",
            $SEARCH_BUTTON_LABEL$: "Meklēt",
            $SEARCH_BOOK_LABEL$: "Meklēt: %@",
            $SEARCH_FIELD_PLACEHOLDER$: "Meklēt palīdzībā",
            $SEARCH_RESULTS_COUNT_MULTIPLE$: "%@ rezultāti, meklējot “%@”",
            $SEARCH_RESULT_COUNT_SINGLE$: "%@ rezultāts, meklējot “%@”",
            $SEARCH_STRING_RESET_BUTTON_LABEL$: "Atiestatīt",
            $TOC_BUTTON_LABEL_HIDE$: "Paslēpt satura rādītāju",
            $TOC_BUTTON_LABEL_SHOW$: "Parādīt satura rādītāju",
            $TOC_LABEL$: "Satura rādītājs",
            $TOPIC_LOAD_ERROR$: "Atlasītā tēma patlaban nav pieejama",
            $TOC_MORE_HELP$: "Papildu palīdzība jūsu <span class='nb'>Mac%@</span> datoram",
            $LANDING_HIDE_TOC$: "Slēpt tēmas",
            $LANDING_SHOW_TOC$: "Rādīt tēmas",
            $QUICK_LINKS_LABEL$: "Ātrās saites",
            $CONNECT_TO_INTERNET$: "<p>Lai skatītu palīdzību, nepieciešams interneta savienojums.</p>",
            $VIDEO_PLAY$: "Atskaņot video",
            $VIDEO_PAUSE$: "Pauzēt video",
            $VIDEO_REPLAY: "Atkārtot video"
        },
        ms: {
            $NEXT_TOPIC_BUTTON_LABEL_SHORT$: "Seterusnya",
            $PREV_TOPIC_BUTTON_LABEL_SHORT$: "Sebelumnya",
            $MODAL_CLOSE_BUTTON$: "Tutup",
            $LANGUAGE_MENU_LABEL$: "Tukar Bahasa",
            $SEARCH_BUTTON_LABEL$: "Cari",
            $SEARCH_BOOK_LABEL$: "Cari %@",
            $SEARCH_FIELD_PLACEHOLDER$: "Cari Bantuan",
            $SEARCH_RESULTS_COUNT_MULTIPLE$: "%@ hasil untuk “%@”",
            $SEARCH_RESULT_COUNT_SINGLE$: "%@ hasil untuk “%@”",
            $SEARCH_STRING_RESET_BUTTON_LABEL$: "Reset",
            $TOC_BUTTON_LABEL_HIDE$: "Sembunyikan senarai kandungan",
            $TOC_BUTTON_LABEL_SHOW$: "Tunjukkan senarai kandungan",
            $TOC_LABEL$: "Senarai kandungan",
            $TOPIC_LOAD_ERROR$: "Topik yang dipilih tidak tersedia sekarang",
            $TOC_MORE_HELP$: "Bantuan lanjut untuk <span class='nb'>Mac%@</span> anda",
            $LANDING_HIDE_TOC$: "Sembunyikan topik",
            $LANDING_SHOW_TOC$: "Tunjukkan topik",
            $QUICK_LINKS_LABEL$: "Pautan Cepat",
            $CONNECT_TO_INTERNET$: "<p>Untuk melihat bantuan, anda mesti bersambung ke Internet.</p>",
            $VIDEO_PLAY$: "Main video",
            $VIDEO_PAUSE$: "Jeda video",
            $VIDEO_REPLAY: "Main semula video"
        },
        nb: {
            $NEXT_TOPIC_BUTTON_LABEL_SHORT$: "Neste",
            $PREV_TOPIC_BUTTON_LABEL_SHORT$: "Forrige",
            $MODAL_CLOSE_BUTTON$: "Lukk",
            $LANGUAGE_MENU_LABEL$: "Bytt språk",
            $SEARCH_BUTTON_LABEL$: "Søk",
            $SEARCH_BOOK_LABEL$: "Søk i %@",
            $SEARCH_FIELD_PLACEHOLDER$: "Søk i hjelp",
            $SEARCH_RESULTS_COUNT_MULTIPLE$: "%@ treff for “%@”",
            $SEARCH_RESULT_COUNT_SINGLE$: "%@ treff for «%@»",
            $SEARCH_STRING_RESET_BUTTON_LABEL$: "Nullstill",
            $TOC_BUTTON_LABEL_HIDE$: "Skjul innholdsfortegnelse",
            $TOC_BUTTON_LABEL_SHOW$: "Vis innholdsfortegnelse",
            $TOC_LABEL$: "Innholdsfortegnelse",
            $TOPIC_LOAD_ERROR$: "Det valgte emnet er ikke tilgjengelig for øyeblikket",
            $TOC_MORE_HELP$: "Mer hjelp for <span class='nb'>Mac%@</span>",
            $LANDING_HIDE_TOC$: "Skjul emner",
            $LANDING_SHOW_TOC$: "Vis emner",
            $QUICK_LINKS_LABEL$: "Hurtigkoblinger",
            $CONNECT_TO_INTERNET$: "<p>Du må være koblet til Internett for å vise hjelp.</p>",
            $VIDEO_PLAY$: "Spill av video",
            $VIDEO_PAUSE$: "Sett video på pause",
            $VIDEO_REPLAY: "Spill av video på nytt"
        },
        nl: {
            $NEXT_TOPIC_BUTTON_LABEL_SHORT$: "Volgende",
            $PREV_TOPIC_BUTTON_LABEL_SHORT$: "Vorige",
            $MODAL_CLOSE_BUTTON$: "Sluit",
            $LANGUAGE_MENU_LABEL$: "Wijzig taal",
            $SEARCH_BUTTON_LABEL$: "Zoek",
            $SEARCH_BOOK_LABEL$: "Zoek in %@",
            $SEARCH_FIELD_PLACEHOLDER$: "Zoek in Help",
            $SEARCH_RESULTS_COUNT_MULTIPLE$: "%@ resultaten voor “%@”",
            $SEARCH_RESULT_COUNT_SINGLE$: "%@ resultaat voor '%@'",
            $SEARCH_STRING_RESET_BUTTON_LABEL$: "Herstel",
            $TOC_BUTTON_LABEL_HIDE$: "Verberg inhoudsopgave",
            $TOC_BUTTON_LABEL_SHOW$: "Toon inhoudsopgave",
            $TOC_LABEL$: "Inhoudsopgave",
            $TOPIC_LOAD_ERROR$: "Het geselecteerde onderwerp is momenteel niet beschikbaar",
            $TOC_MORE_HELP$: "Meer Help voor de <span class='nb'>Mac%@</span>",
            $LANDING_HIDE_TOC$: "Verberg onderwerpen",
            $LANDING_SHOW_TOC$: "Toon onderwerpen",
            $QUICK_LINKS_LABEL$: "Snelkoppelingen",
            $CONNECT_TO_INTERNET$: "<p>Om helpinformatie weer te geven, heb je verbinding met het internet nodig.</p>",
            $VIDEO_PLAY$: "Speel video af",
            $VIDEO_PAUSE$: "Pauzeer video",
            $VIDEO_REPLAY: "Speel video opnieuw af"
        },
        pl: {
            $NEXT_TOPIC_BUTTON_LABEL_SHORT$: "Dalej",
            $PREV_TOPIC_BUTTON_LABEL_SHORT$: "Wstecz",
            $MODAL_CLOSE_BUTTON$: "Zamknij",
            $LANGUAGE_MENU_LABEL$: "Zmień język",
            $SEARCH_BUTTON_LABEL$: "Szukaj",
            $SEARCH_BOOK_LABEL$: "Szukaj %@",
            $SEARCH_FIELD_PLACEHOLDER$: "Szukaj w Pomocy",
            $SEARCH_RESULTS_COUNT_MULTIPLE$: "Wyniki (%@) z „%@”",
            $SEARCH_RESULT_COUNT_SINGLE$: "%@ wynik z „%@”",
            $SEARCH_STRING_RESET_BUTTON_LABEL$: "Wyzeruj",
            $TOC_BUTTON_LABEL_HIDE$: "Ukryj spis treści",
            $TOC_BUTTON_LABEL_SHOW$: "Pokaż spis treści",
            $TOC_LABEL$: "Spis treści",
            $TOPIC_LOAD_ERROR$: "Wybrany temat jest aktualnie niedostępny",
            $TOC_MORE_HELP$: "Więcej tematów pomocy <span class='nb'>Maca%@</span>",
            $LANDING_HIDE_TOC$: "Ukryj tematy",
            $LANDING_SHOW_TOC$: "Pokaż tematy",
            $QUICK_LINKS_LABEL$: "Użyteczne łącza",
            $CONNECT_TO_INTERNET$: "<p>Aby wyświetlić Pomoc, komputer musi być połączony z Internetem.</p>",
            $VIDEO_PLAY$: "Odtwórz wideo",
            $VIDEO_PAUSE$: "Wstrzymaj wideo",
            $VIDEO_REPLAY: "Odtwórz ponownie wideo"
        },
        pt: {
            $NEXT_TOPIC_BUTTON_LABEL_SHORT$: "Seguinte",
            $PREV_TOPIC_BUTTON_LABEL_SHORT$: "Anterior",
            $MODAL_CLOSE_BUTTON$: "Fechar",
            $LANGUAGE_MENU_LABEL$: "Alterar Idioma",
            $SEARCH_BUTTON_LABEL$: "Buscar",
            $SEARCH_BOOK_LABEL$: "Buscar em %@",
            $SEARCH_FIELD_PLACEHOLDER$: "Buscar na Ajuda",
            $SEARCH_RESULTS_COUNT_MULTIPLE$: "%@ resultados para “%@”",
            $SEARCH_RESULT_COUNT_SINGLE$: "%@ resultado para “%@”",
            $SEARCH_STRING_RESET_BUTTON_LABEL$: "Redefinir",
            $TOC_BUTTON_LABEL_HIDE$: "Ocultar índice",
            $TOC_BUTTON_LABEL_SHOW$: "Mostrar índice",
            $TOC_LABEL$: "Índice",
            $TOPIC_LOAD_ERROR$: "O tema selecionado está indisponível no momento",
            $TOC_MORE_HELP$: "Mais ajuda sobre o <span class='nb'>Mac%@</span>",
            $LANDING_HIDE_TOC$: "Ocultar temas",
            $LANDING_SHOW_TOC$: "Mostrar temas",
            $QUICK_LINKS_LABEL$: "Links Rápidos",
            $CONNECT_TO_INTERNET$: "<p>Para visualizar a ajuda, é preciso ter uma conexão à Internet.</p>",
            $VIDEO_PLAY$: "Reproduzir vídeo",
            $VIDEO_PAUSE$: "Pausar vídeo",
            $VIDEO_REPLAY: "Reproduzir vídeo"
        },
        "pt-pt": {
            $NEXT_TOPIC_BUTTON_LABEL_SHORT$: "Seguinte",
            $PREV_TOPIC_BUTTON_LABEL_SHORT$: "Anterior",
            $MODAL_CLOSE_BUTTON$: "Fechar",
            $LANGUAGE_MENU_LABEL$: "Alterar idioma",
            $RESET_SEARCH_BUTTON_LABEL$: "Repor",
            $SEARCH_RESULTS_COUNT_MULTIPLE$: "%@ resultados para “%@”",
            $SEARCH_RESULT_COUNT_SINGLE$: "%@ resultado para “%@”",
            $SEARCH_BUTTON_LABEL$: "Pesquisar",
            $SEARCH_BOOK_LABEL$: "Pesquisar %@",
            $SEARCH_FIELD_PLACEHOLDER$: "Pesquisar",
            $TOC_BUTTON_LABEL_HIDE$: "Ocultar índice",
            $TOC_BUTTON_LABEL_SHOW$: "Mostrar índice",
            $TOC_LABEL$: "Índice",
            $TOPIC_LOAD_ERROR$: "O tópico selecionado não está disponível atualmente",
            $TOC_MORE_HELP$: "Mais ajuda para o seu <span class='nb'>Mac%@</span>",
            $LANDING_HIDE_TOC$: "Ocultar tópicos",
            $LANDING_SHOW_TOC$: "Mostrar tópicos",
            $QUICK_LINKS_LABEL$: "Ligações rápidas",
            $CONNECT_TO_INTERNET$: "<p>Necessita de uma ligação ativa à Internet para visualizar a ajuda.</p>",
            $VIDEO_PLAY$: "Reproduzir vídeo",
            $VIDEO_PAUSE$: "Pausar vídeo",
            $VIDEO_REPLAY: "Repetir vídeo"
        },
        ro: {
            $NEXT_TOPIC_BUTTON_LABEL_SHORT$: "Înainte",
            $PREV_TOPIC_BUTTON_LABEL_SHORT$: "Înapoi",
            $MODAL_CLOSE_BUTTON$: "Închideți",
            $LANGUAGE_MENU_LABEL$: "Schimbați limba",
            $SEARCH_BUTTON_LABEL$: "Căutați",
            $SEARCH_BOOK_LABEL$: "Căutați în %@",
            $SEARCH_FIELD_PLACEHOLDER$: "Căutare",
            $SEARCH_RESULTS_COUNT_MULTIPLE$: "%@ rezultate pentru “%@”",
            $SEARCH_RESULT_COUNT_SINGLE$: "%@ rezultat pentru “%@”",
            $SEARCH_STRING_RESET_BUTTON_LABEL$: "Resetați",
            $TOC_BUTTON_LABEL_HIDE$: "Ascundeți tabla de materii",
            $TOC_BUTTON_LABEL_SHOW$: "Afișați tabla de materii",
            $TOC_LABEL$: "Tablă de materii",
            $TOPIC_LOAD_ERROR$: "Subiectul selectat este momentan indisponibil",
            $TOC_MORE_HELP$: "Ajutor suplimentar pentru Mac-ul <span class='nb'>dvs%@</span>",
            $LANDING_HIDE_TOC$: "Ascundeți subiectele",
            $LANDING_SHOW_TOC$: "Afișați subiectele",
            $QUICK_LINKS_LABEL$: "Linkuri rapide",
            $CONNECT_TO_INTERNET$: "<p>Pentru a vizualiza ajutorul, trebuie să vă conectați la Internet.</p>",
            $VIDEO_PLAY$: "Redare video",
            $VIDEO_PAUSE$: "Suspendare video",
            $VIDEO_REPLAY: "Reluare video"
        },
        ru: {
            $NEXT_TOPIC_BUTTON_LABEL_SHORT$: "Вперед",
            $PREV_TOPIC_BUTTON_LABEL_SHORT$: "Назад",
            $MODAL_CLOSE_BUTTON$: "Закрыть",
            $LANGUAGE_MENU_LABEL$: "Сменить язык",
            $SEARCH_BUTTON_LABEL$: "Искать",
            $SEARCH_BOOK_LABEL$: "Искать %@",
            $SEARCH_FIELD_PLACEHOLDER$: "Искать в Справке",
            $SEARCH_RESULTS_COUNT_MULTIPLE$: "Результатов поиска «%@2»: %@1",
            $SEARCH_RESULT_COUNT_SINGLE$: "Результатов поиска «%@2»: %@1",
            $SEARCH_STRING_RESET_BUTTON_LABEL$: "Сбросить",
            $TOC_BUTTON_LABEL_HIDE$: "Скрыть оглавление",
            $TOC_BUTTON_LABEL_SHOW$: "Показать оглавление",
            $TOC_LABEL$: "Оглавление",
            $TOPIC_LOAD_ERROR$: "Выбранная тема сейчас недоступна",
            $TOC_MORE_HELP$: "Другие темы Справки для <span class='nb'>Mac%@</span>",
            $LANDING_HIDE_TOC$: "Скрыть темы",
            $LANDING_SHOW_TOC$: "Показать темы",
            $QUICK_LINKS_LABEL$: "Быстрые ссылки",
            $CONNECT_TO_INTERNET$: "<p>Чтобы посмотреть Справку, требуется подключение к сети Интернет.</p>",
            $VIDEO_PLAY$: "Воспроизвести видео",
            $VIDEO_PAUSE$: "Остановить видео",
            $VIDEO_REPLAY: "Снова воспроизвести видео"
        },
        sk: {
            $NEXT_TOPIC_BUTTON_LABEL_SHORT$: "Ďalšie",
            $PREV_TOPIC_BUTTON_LABEL_SHORT$: "Predošlé",
            $MODAL_CLOSE_BUTTON$: "Zatvoriť",
            $LANGUAGE_MENU_LABEL$: "Zmeniť jazyk",
            $SEARCH_BUTTON_LABEL$: "Vyhľadať",
            $SEARCH_BOOK_LABEL$: "Prehľadať: %@",
            $SEARCH_FIELD_PLACEHOLDER$: "Prehľadať pomocníka",
            $SEARCH_RESULTS_COUNT_MULTIPLE$: "Výsledky pre „%@2“: %@1",
            $SEARCH_RESULT_COUNT_SINGLE$: "Výsledky pre „%@2“: %@1",
            $SEARCH_STRING_RESET_BUTTON_LABEL$: "Resetovať",
            $TOC_BUTTON_LABEL_HIDE$: "Skryť obsah",
            $TOC_BUTTON_LABEL_SHOW$: "Zobraziť obsah",
            $TOC_LABEL$: "Obsah",
            $TOPIC_LOAD_ERROR$: "Vybraná téma je momentálne nedostupná",
            $TOC_MORE_HELP$: "Ďalšia pomoc pre váš <span class='nb'>Mac%@</span>",
            $LANDING_HIDE_TOC$: "Skryť témy",
            $LANDING_SHOW_TOC$: "Zobraziť témy",
            $QUICK_LINKS_LABEL$: "Rýchle odkazy",
            $CONNECT_TO_INTERNET$: "<p>Ak chcete zobraziť pomocníka, musíte mať pripojenie na internet.</p>",
            $VIDEO_PLAY$: "Prehrať video",
            $VIDEO_PAUSE$: "Pozastaviť video",
            $VIDEO_REPLAY: "Znovu prehrať video"
        },
        sl: {
            $NEXT_TOPIC_BUTTON_LABEL_SHORT$: "Naprej",
            $PREV_TOPIC_BUTTON_LABEL_SHORT$: "Nazaj",
            $MODAL_CLOSE_BUTTON$: "Zapri",
            $LANGUAGE_MENU_LABEL$: "Spremeni jezik",
            $SEARCH_BUTTON_LABEL$: "Išči",
            $SEARCH_BOOK_LABEL$: "Išči v %@",
            $SEARCH_FIELD_PLACEHOLDER$: "Išči po pomoči",
            $SEARCH_RESULTS_COUNT_MULTIPLE$: "%@ rezultatov za “%@”",
            $SEARCH_RESULT_COUNT_SINGLE$: "%@ rezultat za “%@”",
            $SEARCH_STRING_RESET_BUTTON_LABEL$: "Ponastavi",
            $TOC_BUTTON_LABEL_HIDE$: "Skrij kazalo vsebine ",
            $TOC_BUTTON_LABEL_SHOW$: "Prikaži kazalo vsebine",
            $TOC_LABEL$: "Kazalo vsebine",
            $TOPIC_LOAD_ERROR$: "Izbrana tema trenutno ni na voljo",
            $TOC_MORE_HELP$: "Več pomoči za vaš <span class='nb'>Mac%@</span>",
            $LANDING_HIDE_TOC$: "Skrij teme",
            $LANDING_SHOW_TOC$: "Prikaži teme",
            $QUICK_LINKS_LABEL$: "Hitre povezave",
            $CONNECT_TO_INTERNET$: "<p>Za ogled pomoči morate biti povezani z internetom.</p>",
            $VIDEO_PLAY$: "Predvajaj video",
            $VIDEO_PAUSE$: "Začasno ustavi video",
            $VIDEO_REPLAY: "Znova predvajaj video"
        },
        sq: {
            $NEXT_TOPIC_BUTTON_LABEL_SHORT$: "Përpara",
            $PREV_TOPIC_BUTTON_LABEL_SHORT$: "Prapa",
            $MODAL_CLOSE_BUTTON$: "Mbylle",
            $LANGUAGE_MENU_LABEL$: "Ndrysho gjuhën",
            $SEARCH_BUTTON_LABEL$: "Kërko",
            $SEARCH_BOOK_LABEL$: "Kerko te %@",
            $SEARCH_FIELD_PLACEHOLDER$: "Kërko",
            $SEARCH_RESULTS_COUNT_MULTIPLE$: "%@ rezultate për “%@”",
            $SEARCH_RESULT_COUNT_SINGLE$: "%@ rezultat për “%@”",
            $SEARCH_STRING_RESET_BUTTON_LABEL$: "Rivendos",
            $TOC_BUTTON_LABEL_HIDE$: "Fshih tabelën e përmbajtjes",
            $TOC_BUTTON_LABEL_SHOW$: "Shfaq tabelën e përmbajtjes",
            $TOC_LABEL$: "Përmbajtja",
            $TOPIC_LOAD_ERROR$: "Tema e zgjedhur është aktualisht e padisponueshme",
            $TOC_MORE_HELP$: "Më shumë ndihmë për kompjuterin tënd <span class='nb'>Mac%@</span>",
            $LANDING_HIDE_TOC$: "Fshih temat",
            $LANDING_SHOW_TOC$: "Shfaq temat",
            $QUICK_LINKS_LABEL$: "Lidhjet e shpejta",
            $CONNECT_TO_INTERNET$: "<p>Për të parë ndihmën, duhet të jesh i lidhur me internetin.</p>",
            $VIDEO_PLAY$: "Luaj videon",
            $VIDEO_PAUSE$: "Vendos videon në pauzë",
            $VIDEO_REPLAY: "Luaje videon sërish"
        },
        sr: {
            $NEXT_TOPIC_BUTTON_LABEL_SHORT$: "Следеће",
            $PREV_TOPIC_BUTTON_LABEL_SHORT$: "Претходно",
            $MODAL_CLOSE_BUTTON$: "Затвори",
            $LANGUAGE_MENU_LABEL$: "Промени језик",
            $SEARCH_BUTTON_LABEL$: "Претрага",
            $SEARCH_BOOK_LABEL$: "Тражи %@",
            $SEARCH_FIELD_PLACEHOLDER$: "Претрага помоћи",
            $SEARCH_RESULTS_COUNT_MULTIPLE$: "%@ резултата за “%@”",
            $SEARCH_RESULT_COUNT_SINGLE$: "%@ резултат за „%@”",
            $SEARCH_STRING_RESET_BUTTON_LABEL$: "Ресетуј",
            $TOC_BUTTON_LABEL_HIDE$: "Сакриј садржај",
            $TOC_BUTTON_LABEL_SHOW$: "Прикажи садржај",
            $TOC_LABEL$: "Садржај",
            $TOPIC_LOAD_ERROR$: "Одабрана тема тренутно није доступна",
            $TOC_MORE_HELP$: "Више помоћи за ваш <span class='nb'>Mac%@</span>",
            $LANDING_HIDE_TOC$: "Сакриј теме",
            $LANDING_SHOW_TOC$: "Прикажи теме",
            $QUICK_LINKS_LABEL$: "Брзе везе",
            $CONNECT_TO_INTERNET$: "<p>Да бисте приказали помоћ, морате бити повезани на интернет.</p>",
            $VIDEO_PLAY$: "Репродукуј видео-запис",
            $VIDEO_PAUSE$: "Паузирај видео-запис",
            $VIDEO_REPLAY: "Поново репродукуј видео-запис"
        },
        sv: {
            $NEXT_TOPIC_BUTTON_LABEL_SHORT$: "Nästa",
            $PREV_TOPIC_BUTTON_LABEL_SHORT$: "Föregående",
            $MODAL_CLOSE_BUTTON$: "Stäng",
            $LANGUAGE_MENU_LABEL$: "Byt språk",
            $SEARCH_BUTTON_LABEL$: "Sök",
            $SEARCH_BOOK_LABEL$: "Sök i %@",
            $SEARCH_FIELD_PLACEHOLDER$: "Sök",
            $SEARCH_RESULTS_COUNT_MULTIPLE$: "%@ träffar för ”%@”",
            $SEARCH_RESULT_COUNT_SINGLE$: "%@ träff för ”%@”",
            $SEARCH_STRING_RESET_BUTTON_LABEL$: "Nollställ",
            $TOC_BUTTON_LABEL_HIDE$: "Göm innehållsförteckning",
            $TOC_BUTTON_LABEL_SHOW$: "Visa innehållsförteckning",
            $TOC_LABEL$: "Innehållsförteckning",
            $TOPIC_LOAD_ERROR$: "Det valda ämnet är inte tillgängligt just nu",
            $TOC_MORE_HELP$: "Mer hjälp för <span class='nb'>Mac%@</span>",
            $LANDING_HIDE_TOC$: "Göm ämnen",
            $LANDING_SHOW_TOC$: "Visa ämnen",
            $QUICK_LINKS_LABEL$: "Snabblänkar",
            $CONNECT_TO_INTERNET$: "<p>Du måste vara ansluten till internet för att använda hjälpen.</p>",
            $VIDEO_PLAY$: "Spela video",
            $VIDEO_PAUSE$: "Pausa video",
            $VIDEO_REPLAY: "Spela video igen"
        },
        th: {
            $NO_WORD_BREAKS$: !0,
            $NEXT_TOPIC_BUTTON_LABEL_SHORT$: "ถัดไป",
            $PREV_TOPIC_BUTTON_LABEL_SHORT$: "ก่อนหน้า",
            $MODAL_CLOSE_BUTTON$: "ปิด",
            $LANGUAGE_MENU_LABEL$: "เปลี่ยนภาษา",
            $SEARCH_BUTTON_LABEL$: "ค้นหา",
            $SEARCH_BOOK_LABEL$: "ค้นหา %@",
            $SEARCH_FIELD_PLACEHOLDER$: "ค้นหาวิธีใช้",
            $SEARCH_RESULTS_COUNT_MULTIPLE$: "%@ ผลลัพธ์สำหรับ “%@”",
            $SEARCH_RESULT_COUNT_SINGLE$: "%@ ผลลัพธ์สำหรับ “%@”",
            $SEARCH_STRING_RESET_BUTTON_LABEL$: "รีเซ็ต",
            $TOC_BUTTON_LABEL_HIDE$: "ซ่อนสารบัญ",
            $TOC_BUTTON_LABEL_SHOW$: "แสดงสารบัญ",
            $TOC_LABEL$: "สารบัญ",
            $TOPIC_LOAD_ERROR$: "หัวข้อที่เลือกไม่สามารถใช้งานได้ในขณะนี้",
            $TOC_MORE_HELP$: "ความช่วยเหลือเพิ่มเติมสำหรับ Mac <span class='nb'>ของคุณ%@</span>",
            $LANDING_HIDE_TOC$: "ซ่อนหัวข้อ",
            $LANDING_SHOW_TOC$: "แสดงหัวข้อ",
            $QUICK_LINKS_LABEL$: "ลิงก์ด่วน",
            $CONNECT_TO_INTERNET$: "<p>คุณต้องเชื่อมต่ออินเทอร์เน็ตเพื่อดูวิธีใช้</p>",
            $VIDEO_PLAY$: "เล่นวิดีโอ",
            $VIDEO_PAUSE$: "หยุดพักวิดีโอ",
            $VIDEO_REPLAY: "เล่นวิดีโอซ้ำ"
        },
        tr: {
            $NEXT_TOPIC_BUTTON_LABEL_SHORT$: "Sonraki",
            $PREV_TOPIC_BUTTON_LABEL_SHORT$: "Önceki",
            $MODAL_CLOSE_BUTTON$: "Kapat",
            $LANGUAGE_MENU_LABEL$: "Dili Değiştir",
            $SEARCH_BUTTON_LABEL$: "Ara",
            $SEARCH_BOOK_LABEL$: "Şurada Ara: %@",
            $SEARCH_FIELD_PLACEHOLDER$: "Yardım’da Ara",
            $SEARCH_RESULTS_COUNT_MULTIPLE$: "“%@2” için %@1 sonuç",
            $SEARCH_RESULT_COUNT_SINGLE$: "“%@2” için %@1 sonuç",
            $SEARCH_STRING_RESET_BUTTON_LABEL$: "Sıfırla",
            $TOC_BUTTON_LABEL_HIDE$: "İçindekiler’i gizle",
            $TOC_BUTTON_LABEL_SHOW$: "İçindekiler’i göster",
            $TOC_LABEL$: "İçindekiler",
            $TOPIC_LOAD_ERROR$: "Seçilen konu şu anda yok",
            $TOC_MORE_HELP$: "Mac’iniz için daha fazla <span class='nb'>yardım%@</span>",
            $LANDING_HIDE_TOC$: "Konuları gizle",
            $LANDING_SHOW_TOC$: "Konuları göster",
            $QUICK_LINKS_LABEL$: "Hızlı Bağlantılar",
            $CONNECT_TO_INTERNET$: "<p>Yardımı görüntülemek için İnternet'e bağlı olmanız gerekir.</p>",
            $VIDEO_PLAY$: "Videoyu oynat",
            $VIDEO_PAUSE$: "Videoyu duraklat",
            $VIDEO_REPLAY: "Videoyu yeniden oynat"
        },
        uk: {
            $NEXT_TOPIC_BUTTON_LABEL_SHORT$: "Вперед",
            $PREV_TOPIC_BUTTON_LABEL_SHORT$: "Назад",
            $MODAL_CLOSE_BUTTON$: "Закрити",
            $LANGUAGE_MENU_LABEL$: "Змінити мову",
            $SEARCH_BUTTON_LABEL$: "Шукати",
            $SEARCH_BOOK_LABEL$: "Шукати %@",
            $SEARCH_FIELD_PLACEHOLDER$: "Шукати",
            $SEARCH_RESULTS_COUNT_MULTIPLE$: "Збігів: %@ для запиту «%@»",
            $SEARCH_RESULT_COUNT_SINGLE$: "%@ результат для запиту «%@»",
            $SEARCH_STRING_RESET_BUTTON_LABEL$: "Скинути",
            $TOC_BUTTON_LABEL_HIDE$: "Згорнути зміст",
            $TOC_BUTTON_LABEL_SHOW$: "Показати зміст",
            $TOC_LABEL$: "Зміст",
            $TOPIC_LOAD_ERROR$: "Вибрана тема зараз недоступна.",
            $TOC_MORE_HELP$: "Інші розділи довідки для <span class='nb'>Mac%@</span>",
            $LANDING_HIDE_TOC$: "Приховати теми",
            $LANDING_SHOW_TOC$: "Показати теми",
            $QUICK_LINKS_LABEL$: "Швидкі посилання",
            $CONNECT_TO_INTERNET$: "<p>Для перегляду довідки потрібне підключення до Інтернету.</p>",
            $VIDEO_PLAY$: "Відтворити відео",
            $VIDEO_PAUSE$: "Призупинити відео",
            $VIDEO_REPLAY: "Ще раз відтворити відео"
        },
        vi: {
            $NEXT_TOPIC_BUTTON_LABEL_SHORT$: "Tiếp",
            $PREV_TOPIC_BUTTON_LABEL_SHORT$: "Trước",
            $MODAL_CLOSE_BUTTON$: "Đóng",
            $LANGUAGE_MENU_LABEL$: "Thay đổi ngôn ngữ",
            $SEARCH_BUTTON_LABEL$: "Tìm kiếm",
            $SEARCH_BOOK_LABEL$: "Tìm kiếm %@",
            $SEARCH_FIELD_PLACEHOLDER$: "Tìm kiếm trợ giúp",
            $SEARCH_RESULTS_COUNT_MULTIPLE$: "%@ kết quả cho “%@”",
            $SEARCH_RESULT_COUNT_SINGLE$: "%@ kết quả cho “%@”",
            $SEARCH_STRING_RESET_BUTTON_LABEL$: "Đặt lại",
            $TOC_BUTTON_LABEL_HIDE$: "Ẩn bảng mục lục",
            $TOC_BUTTON_LABEL_SHOW$: "Hiển thị bảng mục lục",
            $TOC_LABEL$: "Bảng mục lục",
            $TOPIC_LOAD_ERROR$: "Chủ đề đã chọn hiện không có sẵn",
            $TOC_MORE_HELP$: "Trợ giúp khác cho máy <span class='nb'>Mac%@</span> của bạn",
            $LANDING_HIDE_TOC$: "Ẩn chủ đề",
            $LANDING_SHOW_TOC$: "Hiển thị chủ đề",
            $QUICK_LINKS_LABEL$: "Liên kết nhanh",
            $CONNECT_TO_INTERNET$: "<p>Để xem trợ giúp, thiết bị của bạn phải được kết nối vào Internet.</p>",
            $VIDEO_PLAY$: "Phát video",
            $VIDEO_PAUSE$: "Tạm dừng video",
            $VIDEO_REPLAY: "Phát lại video"
        },
        zh: {
            $NO_WORD_BREAKS$: !0,
            $NEXT_TOPIC_BUTTON_LABEL_SHORT$: "下一页",
            $PREV_TOPIC_BUTTON_LABEL_SHORT$: "上一页",
            $MODAL_CLOSE_BUTTON$: "关闭",
            $LANGUAGE_MENU_LABEL$: "更改语言",
            $SEARCH_BUTTON_LABEL$: "搜索",
            $SEARCH_BOOK_LABEL$: "搜索 %@",
            $SEARCH_FIELD_PLACEHOLDER$: "搜索帮助",
            $SEARCH_RESULTS_COUNT_MULTIPLE$: "%@ 个关于“%@”的结果",
            $SEARCH_RESULT_COUNT_SINGLE$: "%@ 个关于“%@”的结果",
            $SEARCH_STRING_RESET_BUTTON_LABEL$: "还原",
            $TOC_BUTTON_LABEL_HIDE$: "隐藏目录",
            $TOC_BUTTON_LABEL_SHOW$: "显示目录",
            $TOC_LABEL$: "目录",
            $TOPIC_LOAD_ERROR$: "所选主题当前不可用",
            $TOC_MORE_HELP$: "有关 <span class='nb'>Mac%@</span> 的更多帮助",
            $LANDING_HIDE_TOC$: "隐藏主题",
            $LANDING_SHOW_TOC$: "显示主题",
            $QUICK_LINKS_LABEL$: "快速链接",
            $CONNECT_TO_INTERNET$: "<p>必须接入互联网才能查看帮助。</p>",
            $VIDEO_PLAY$: "播放视频",
            $VIDEO_PAUSE$: "暂停播放视频",
            $VIDEO_REPLAY: "重新播放视频"
        },
        "zh-hk": {
            $NO_WORD_BREAKS$: !0,
            $NEXT_TOPIC_BUTTON_LABEL_SHORT$: "下一頁",
            $PREV_TOPIC_BUTTON_LABEL_SHORT$: "上一頁",
            $MODAL_CLOSE_BUTTON$: "關閉",
            $LANGUAGE_MENU_LABEL$: "更改語言",
            $SEARCH_BUTTON_LABEL$: "搜尋",
            $SEARCH_BOOK_LABEL$: "搜尋 %@",
            $SEARCH_FIELD_PLACEHOLDER$: "搜尋輔助說明",
            $SEARCH_RESULTS_COUNT_MULTIPLE$: "找到 %@ 項「%@」的結果",
            $SEARCH_RESULT_COUNT_SINGLE$: "%@ 項「%@」的搜尋結果",
            $SEARCH_STRING_RESET_BUTTON_LABEL$: "重置",
            $TOC_BUTTON_LABEL_HIDE$: "隱藏目錄",
            $TOC_BUTTON_LABEL_SHOW$: "顯示目錄",
            $TOC_LABEL$: "目錄",
            $TOPIC_LOAD_ERROR$: "目前無法顯示所選的主題",
            $TOC_MORE_HELP$: "更多 <span class='nb'>Mac%@</span> 的輔助說明",
            $LANDING_HIDE_TOC$: "隱藏主題",
            $LANDING_SHOW_TOC$: "顯示主題",
            $QUICK_LINKS_LABEL$: "快速連結",
            $CONNECT_TO_INTERNET$: "<p>如要查看輔助說明，你必須已連接互聯網。</p>",
            $VIDEO_PLAY$: "播放影片",
            $VIDEO_PAUSE$: "暫停影片",
            $VIDEO_REPLAY: "重新播放影片"
        },
        "zh-tw": {
            $NO_WORD_BREAKS$: !0,
            $NEXT_TOPIC_BUTTON_LABEL_SHORT$: "下一頁",
            $PREV_TOPIC_BUTTON_LABEL_SHORT$: "上一頁",
            $MODAL_CLOSE_BUTTON$: "關閉",
            $LANGUAGE_MENU_LABEL$: "更改語言",
            $SEARCH_BUTTON_LABEL$: "搜尋",
            $SEARCH_BOOK_LABEL$: "搜尋「%@」",
            $SEARCH_FIELD_PLACEHOLDER$: "搜尋輔助說明",
            $SEARCH_RESULTS_COUNT_MULTIPLE$: "找到 %@ 項「%@」的搜尋結果",
            $SEARCH_RESULT_COUNT_SINGLE$: "找到 %@ 項「%@」的搜尋結果",
            $SEARCH_STRING_RESET_BUTTON_LABEL$: "重置",
            $TOC_BUTTON_LABEL_HIDE$: "隱藏目錄",
            $TOC_BUTTON_LABEL_SHOW$: "顯示目錄",
            $TOC_LABEL$: "目錄",
            $TOPIC_LOAD_ERROR$: "目前無法取得所選的主題",
            $TOC_MORE_HELP$: "更多 <span class='nb'>Mac%@</span> 的輔助說明",
            $LANDING_HIDE_TOC$: "隱藏主題",
            $LANDING_SHOW_TOC$: "顯示主題",
            $QUICK_LINKS_LABEL$: "快速連結",
            $CONNECT_TO_INTERNET$: "<p>若要檢視輔助說明，您必須連接 Internet。</p>",
            $VIDEO_PLAY$: "播放影片",
            $VIDEO_PAUSE$: "暫停影片",
            $VIDEO_REPLAY: "重新播放影片"
        }
    };
    return a["en-au"] = a.en,
    a["es-us"] = a["es-mx"],
    a
}),
define("app", ["shared/app", "app/controller", "app/view", "header/view", "topic/view", "topic/route", "search/view", "toc/view", "shared/computed", "locale/select-view", "feedback/view", "shared/browser", "translations", "shared/base/controller"], function(a, b, c, d, e, f, g, h, i, j, k, l, m, n) {
    var o = a.extend({
        TRANSLATIONS: m,
        IndexView: e,
        TopicView: e,
        FeedbackView: k,
        FeedbackController: n,
        HeaderView: d,
        HeaderController: n,
        SearchView: g,
        LocaleSelectView: j,
        LocaleSelectController: n,
        TocNavController: n,
        TocNavView: h,
        ApplicationController: b,
        ApplicationView: c,
        IndexRoute: f,
        TopicRoute: f
    });
    return window.App = o.create(),
    window.App
}),
require(["app"]);
