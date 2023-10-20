/* PrismJS 1.29.0
https://prismjs.com/download.html#themes=prism-tomorrow&languages=markup+css+clike+javascript+aspnet+bash+c+csharp+cpp+clojure+crystal+csv+d+dart+elixir+elm+erlang+gdscript+go+haskell+java+json+latex+lisp+lua+markdown+matlab+metafont+nim+nix+python+jsx+tsx+ruby+rust+scss+scala+sql+toml+typescript+yaml+zig&plugins=line-numbers */
var _self =
    "undefined" != typeof window
      ? window
      : "undefined" != typeof WorkerGlobalScope &&
        self instanceof WorkerGlobalScope
      ? self
      : {},
  Prism = (function (e) {
    var n = /(?:^|\s)lang(?:uage)?-([\w-]+)(?=\s|$)/i,
      t = 0,
      r = {},
      a = {
        manual: e.Prism && e.Prism.manual,
        disableWorkerMessageHandler:
          e.Prism && e.Prism.disableWorkerMessageHandler,
        util: {
          encode: function e(n) {
            return n instanceof i
              ? new i(n.type, e(n.content), n.alias)
              : Array.isArray(n)
              ? n.map(e)
              : n
                  .replace(/&/g, "&amp;")
                  .replace(/</g, "&lt;")
                  .replace(/\u00a0/g, " ");
          },
          type: function (e) {
            return Object.prototype.toString.call(e).slice(8, -1);
          },
          objId: function (e) {
            return (
              e.__id || Object.defineProperty(e, "__id", { value: ++t }), e.__id
            );
          },
          clone: function e(n, t) {
            var r, i;
            switch (((t = t || {}), a.util.type(n))) {
              case "Object":
                if (((i = a.util.objId(n)), t[i])) return t[i];
                for (var l in ((r = {}), (t[i] = r), n))
                  n.hasOwnProperty(l) && (r[l] = e(n[l], t));
                return r;
              case "Array":
                return (
                  (i = a.util.objId(n)),
                  t[i]
                    ? t[i]
                    : ((r = []),
                      (t[i] = r),
                      n.forEach(function (n, a) {
                        r[a] = e(n, t);
                      }),
                      r)
                );
              default:
                return n;
            }
          },
          getLanguage: function (e) {
            for (; e; ) {
              var t = n.exec(e.className);
              if (t) return t[1].toLowerCase();
              e = e.parentElement;
            }
            return "none";
          },
          setLanguage: function (e, t) {
            (e.className = e.className.replace(RegExp(n, "gi"), "")),
              e.classList.add("language-" + t);
          },
          currentScript: function () {
            if ("undefined" == typeof document) return null;
            if ("currentScript" in document) return document.currentScript;
            try {
              throw new Error();
            } catch (r) {
              var e = (/at [^(\r\n]*\((.*):[^:]+:[^:]+\)$/i.exec(r.stack) ||
                [])[1];
              if (e) {
                var n = document.getElementsByTagName("script");
                for (var t in n) if (n[t].src == e) return n[t];
              }
              return null;
            }
          },
          isActive: function (e, n, t) {
            for (var r = "no-" + n; e; ) {
              var a = e.classList;
              if (a.contains(n)) return !0;
              if (a.contains(r)) return !1;
              e = e.parentElement;
            }
            return !!t;
          },
        },
        languages: {
          plain: r,
          plaintext: r,
          text: r,
          txt: r,
          extend: function (e, n) {
            var t = a.util.clone(a.languages[e]);
            for (var r in n) t[r] = n[r];
            return t;
          },
          insertBefore: function (e, n, t, r) {
            var i = (r = r || a.languages)[e],
              l = {};
            for (var o in i)
              if (i.hasOwnProperty(o)) {
                if (o == n)
                  for (var s in t) t.hasOwnProperty(s) && (l[s] = t[s]);
                t.hasOwnProperty(o) || (l[o] = i[o]);
              }
            var u = r[e];
            return (
              (r[e] = l),
              a.languages.DFS(a.languages, function (n, t) {
                t === u && n != e && (this[n] = l);
              }),
              l
            );
          },
          DFS: function e(n, t, r, i) {
            i = i || {};
            var l = a.util.objId;
            for (var o in n)
              if (n.hasOwnProperty(o)) {
                t.call(n, o, n[o], r || o);
                var s = n[o],
                  u = a.util.type(s);
                "Object" !== u || i[l(s)]
                  ? "Array" !== u || i[l(s)] || ((i[l(s)] = !0), e(s, t, o, i))
                  : ((i[l(s)] = !0), e(s, t, null, i));
              }
          },
        },
        plugins: {},
        highlightAll: function (e, n) {
          a.highlightAllUnder(document, e, n);
        },
        highlightAllUnder: function (e, n, t) {
          var r = {
            callback: t,
            container: e,
            selector:
              'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code',
          };
          a.hooks.run("before-highlightall", r),
            (r.elements = Array.prototype.slice.apply(
              r.container.querySelectorAll(r.selector),
            )),
            a.hooks.run("before-all-elements-highlight", r);
          for (var i, l = 0; (i = r.elements[l++]); )
            a.highlightElement(i, !0 === n, r.callback);
        },
        highlightElement: function (n, t, r) {
          var i = a.util.getLanguage(n),
            l = a.languages[i];
          a.util.setLanguage(n, i);
          var o = n.parentElement;
          o && "pre" === o.nodeName.toLowerCase() && a.util.setLanguage(o, i);
          var s = { element: n, language: i, grammar: l, code: n.textContent };
          function u(e) {
            (s.highlightedCode = e),
              a.hooks.run("before-insert", s),
              (s.element.innerHTML = s.highlightedCode),
              a.hooks.run("after-highlight", s),
              a.hooks.run("complete", s),
              r && r.call(s.element);
          }
          if (
            (a.hooks.run("before-sanity-check", s),
            (o = s.element.parentElement) &&
              "pre" === o.nodeName.toLowerCase() &&
              !o.hasAttribute("tabindex") &&
              o.setAttribute("tabindex", "0"),
            !s.code)
          )
            return a.hooks.run("complete", s), void (r && r.call(s.element));
          if ((a.hooks.run("before-highlight", s), s.grammar))
            if (t && e.Worker) {
              var c = new Worker(a.filename);
              (c.onmessage = function (e) {
                u(e.data);
              }),
                c.postMessage(
                  JSON.stringify({
                    language: s.language,
                    code: s.code,
                    immediateClose: !0,
                  }),
                );
            } else u(a.highlight(s.code, s.grammar, s.language));
          else u(a.util.encode(s.code));
        },
        highlight: function (e, n, t) {
          var r = { code: e, grammar: n, language: t };
          if ((a.hooks.run("before-tokenize", r), !r.grammar))
            throw new Error(
              'The language "' + r.language + '" has no grammar.',
            );
          return (
            (r.tokens = a.tokenize(r.code, r.grammar)),
            a.hooks.run("after-tokenize", r),
            i.stringify(a.util.encode(r.tokens), r.language)
          );
        },
        tokenize: function (e, n) {
          var t = n.rest;
          if (t) {
            for (var r in t) n[r] = t[r];
            delete n.rest;
          }
          var a = new s();
          return (
            u(a, a.head, e),
            o(e, a, n, a.head, 0),
            (function (e) {
              for (var n = [], t = e.head.next; t !== e.tail; )
                n.push(t.value), (t = t.next);
              return n;
            })(a)
          );
        },
        hooks: {
          all: {},
          add: function (e, n) {
            var t = a.hooks.all;
            (t[e] = t[e] || []), t[e].push(n);
          },
          run: function (e, n) {
            var t = a.hooks.all[e];
            if (t && t.length) for (var r, i = 0; (r = t[i++]); ) r(n);
          },
        },
        Token: i,
      };
    function i(e, n, t, r) {
      (this.type = e),
        (this.content = n),
        (this.alias = t),
        (this.length = 0 | (r || "").length);
    }
    function l(e, n, t, r) {
      e.lastIndex = n;
      var a = e.exec(t);
      if (a && r && a[1]) {
        var i = a[1].length;
        (a.index += i), (a[0] = a[0].slice(i));
      }
      return a;
    }
    function o(e, n, t, r, s, g) {
      for (var f in t)
        if (t.hasOwnProperty(f) && t[f]) {
          var h = t[f];
          h = Array.isArray(h) ? h : [h];
          for (var d = 0; d < h.length; ++d) {
            if (g && g.cause == f + "," + d) return;
            var v = h[d],
              p = v.inside,
              m = !!v.lookbehind,
              y = !!v.greedy,
              k = v.alias;
            if (y && !v.pattern.global) {
              var x = v.pattern.toString().match(/[imsuy]*$/)[0];
              v.pattern = RegExp(v.pattern.source, x + "g");
            }
            for (
              var b = v.pattern || v, w = r.next, A = s;
              w !== n.tail && !(g && A >= g.reach);
              A += w.value.length, w = w.next
            ) {
              var E = w.value;
              if (n.length > e.length) return;
              if (!(E instanceof i)) {
                var P,
                  L = 1;
                if (y) {
                  if (!(P = l(b, A, e, m)) || P.index >= e.length) break;
                  var S = P.index,
                    O = P.index + P[0].length,
                    j = A;
                  for (j += w.value.length; S >= j; )
                    j += (w = w.next).value.length;
                  if (((A = j -= w.value.length), w.value instanceof i))
                    continue;
                  for (
                    var C = w;
                    C !== n.tail && (j < O || "string" == typeof C.value);
                    C = C.next
                  )
                    L++, (j += C.value.length);
                  L--, (E = e.slice(A, j)), (P.index -= A);
                } else if (!(P = l(b, 0, E, m))) continue;
                S = P.index;
                var N = P[0],
                  _ = E.slice(0, S),
                  M = E.slice(S + N.length),
                  W = A + E.length;
                g && W > g.reach && (g.reach = W);
                var z = w.prev;
                if (
                  (_ && ((z = u(n, z, _)), (A += _.length)),
                  c(n, z, L),
                  (w = u(n, z, new i(f, p ? a.tokenize(N, p) : N, k, N))),
                  M && u(n, w, M),
                  L > 1)
                ) {
                  var I = { cause: f + "," + d, reach: W };
                  o(e, n, t, w.prev, A, I),
                    g && I.reach > g.reach && (g.reach = I.reach);
                }
              }
            }
          }
        }
    }
    function s() {
      var e = { value: null, prev: null, next: null },
        n = { value: null, prev: e, next: null };
      (e.next = n), (this.head = e), (this.tail = n), (this.length = 0);
    }
    function u(e, n, t) {
      var r = n.next,
        a = { value: t, prev: n, next: r };
      return (n.next = a), (r.prev = a), e.length++, a;
    }
    function c(e, n, t) {
      for (var r = n.next, a = 0; a < t && r !== e.tail; a++) r = r.next;
      (n.next = r), (r.prev = n), (e.length -= a);
    }
    if (
      ((e.Prism = a),
      (i.stringify = function e(n, t) {
        if ("string" == typeof n) return n;
        if (Array.isArray(n)) {
          var r = "";
          return (
            n.forEach(function (n) {
              r += e(n, t);
            }),
            r
          );
        }
        var i = {
            type: n.type,
            content: e(n.content, t),
            tag: "span",
            classes: ["token", n.type],
            attributes: {},
            language: t,
          },
          l = n.alias;
        l &&
          (Array.isArray(l)
            ? Array.prototype.push.apply(i.classes, l)
            : i.classes.push(l)),
          a.hooks.run("wrap", i);
        var o = "";
        for (var s in i.attributes)
          o +=
            " " +
            s +
            '="' +
            (i.attributes[s] || "").replace(/"/g, "&quot;") +
            '"';
        return (
          "<" +
          i.tag +
          ' class="' +
          i.classes.join(" ") +
          '"' +
          o +
          ">" +
          i.content +
          "</" +
          i.tag +
          ">"
        );
      }),
      !e.document)
    )
      return e.addEventListener
        ? (a.disableWorkerMessageHandler ||
            e.addEventListener(
              "message",
              function (n) {
                var t = JSON.parse(n.data),
                  r = t.language,
                  i = t.code,
                  l = t.immediateClose;
                e.postMessage(a.highlight(i, a.languages[r], r)),
                  l && e.close();
              },
              !1,
            ),
          a)
        : a;
    var g = a.util.currentScript();
    function f() {
      a.manual || a.highlightAll();
    }
    if (
      (g &&
        ((a.filename = g.src),
        g.hasAttribute("data-manual") && (a.manual = !0)),
      !a.manual)
    ) {
      var h = document.readyState;
      "loading" === h || ("interactive" === h && g && g.defer)
        ? document.addEventListener("DOMContentLoaded", f)
        : window.requestAnimationFrame
        ? window.requestAnimationFrame(f)
        : window.setTimeout(f, 16);
    }
    return a;
  })(_self);
"undefined" != typeof module && module.exports && (module.exports = Prism),
  "undefined" != typeof global && (global.Prism = Prism);
(Prism.languages.markup = {
  comment: { pattern: /<!--(?:(?!<!--)[\s\S])*?-->/, greedy: !0 },
  prolog: { pattern: /<\?[\s\S]+?\?>/, greedy: !0 },
  doctype: {
    pattern:
      /<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,
    greedy: !0,
    inside: {
      "internal-subset": {
        pattern: /(^[^\[]*\[)[\s\S]+(?=\]>$)/,
        lookbehind: !0,
        greedy: !0,
        inside: null,
      },
      string: { pattern: /"[^"]*"|'[^']*'/, greedy: !0 },
      punctuation: /^<!|>$|[[\]]/,
      "doctype-tag": /^DOCTYPE/i,
      name: /[^\s<>'"]+/,
    },
  },
  cdata: { pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i, greedy: !0 },
  tag: {
    pattern:
      /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,
    greedy: !0,
    inside: {
      tag: {
        pattern: /^<\/?[^\s>\/]+/,
        inside: { punctuation: /^<\/?/, namespace: /^[^\s>\/:]+:/ },
      },
      "special-attr": [],
      "attr-value": {
        pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,
        inside: {
          punctuation: [
            { pattern: /^=/, alias: "attr-equals" },
            { pattern: /^(\s*)["']|["']$/, lookbehind: !0 },
          ],
        },
      },
      punctuation: /\/?>/,
      "attr-name": {
        pattern: /[^\s>\/]+/,
        inside: { namespace: /^[^\s>\/:]+:/ },
      },
    },
  },
  entity: [
    { pattern: /&[\da-z]{1,8};/i, alias: "named-entity" },
    /&#x?[\da-f]{1,8};/i,
  ],
}),
  (Prism.languages.markup.tag.inside["attr-value"].inside.entity =
    Prism.languages.markup.entity),
  (Prism.languages.markup.doctype.inside["internal-subset"].inside =
    Prism.languages.markup),
  Prism.hooks.add("wrap", function (a) {
    "entity" === a.type &&
      (a.attributes.title = a.content.replace(/&amp;/, "&"));
  }),
  Object.defineProperty(Prism.languages.markup.tag, "addInlined", {
    value: function (a, e) {
      var s = {};
      (s["language-" + e] = {
        pattern: /(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,
        lookbehind: !0,
        inside: Prism.languages[e],
      }),
        (s.cdata = /^<!\[CDATA\[|\]\]>$/i);
      var t = {
        "included-cdata": { pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i, inside: s },
      };
      t["language-" + e] = { pattern: /[\s\S]+/, inside: Prism.languages[e] };
      var n = {};
      (n[a] = {
        pattern: RegExp(
          "(<__[^>]*>)(?:<!\\[CDATA\\[(?:[^\\]]|\\](?!\\]>))*\\]\\]>|(?!<!\\[CDATA\\[)[^])*?(?=</__>)".replace(
            /__/g,
            function () {
              return a;
            },
          ),
          "i",
        ),
        lookbehind: !0,
        greedy: !0,
        inside: t,
      }),
        Prism.languages.insertBefore("markup", "cdata", n);
    },
  }),
  Object.defineProperty(Prism.languages.markup.tag, "addAttribute", {
    value: function (a, e) {
      Prism.languages.markup.tag.inside["special-attr"].push({
        pattern: RegExp(
          "(^|[\"'\\s])(?:" +
            a +
            ")\\s*=\\s*(?:\"[^\"]*\"|'[^']*'|[^\\s'\">=]+(?=[\\s>]))",
          "i",
        ),
        lookbehind: !0,
        inside: {
          "attr-name": /^[^\s=]+/,
          "attr-value": {
            pattern: /=[\s\S]+/,
            inside: {
              value: {
                pattern: /(^=\s*(["']|(?!["'])))\S[\s\S]*(?=\2$)/,
                lookbehind: !0,
                alias: [e, "language-" + e],
                inside: Prism.languages[e],
              },
              punctuation: [{ pattern: /^=/, alias: "attr-equals" }, /"|'/],
            },
          },
        },
      });
    },
  }),
  (Prism.languages.html = Prism.languages.markup),
  (Prism.languages.mathml = Prism.languages.markup),
  (Prism.languages.svg = Prism.languages.markup),
  (Prism.languages.xml = Prism.languages.extend("markup", {})),
  (Prism.languages.ssml = Prism.languages.xml),
  (Prism.languages.atom = Prism.languages.xml),
  (Prism.languages.rss = Prism.languages.xml);
!(function (s) {
  var e =
    /(?:"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"|'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n])*')/;
  (s.languages.css = {
    comment: /\/\*[\s\S]*?\*\//,
    atrule: {
      pattern: RegExp(
        "@[\\w-](?:[^;{\\s\"']|\\s+(?!\\s)|" +
          e.source +
          ")*?(?:;|(?=\\s*\\{))",
      ),
      inside: {
        rule: /^@[\w-]+/,
        "selector-function-argument": {
          pattern:
            /(\bselector\s*\(\s*(?![\s)]))(?:[^()\s]|\s+(?![\s)])|\((?:[^()]|\([^()]*\))*\))+(?=\s*\))/,
          lookbehind: !0,
          alias: "selector",
        },
        keyword: {
          pattern: /(^|[^\w-])(?:and|not|only|or)(?![\w-])/,
          lookbehind: !0,
        },
      },
    },
    url: {
      pattern: RegExp(
        "\\burl\\((?:" + e.source + "|(?:[^\\\\\r\n()\"']|\\\\[^])*)\\)",
        "i",
      ),
      greedy: !0,
      inside: {
        function: /^url/i,
        punctuation: /^\(|\)$/,
        string: { pattern: RegExp("^" + e.source + "$"), alias: "url" },
      },
    },
    selector: {
      pattern: RegExp(
        "(^|[{}\\s])[^{}\\s](?:[^{};\"'\\s]|\\s+(?![\\s{])|" +
          e.source +
          ")*(?=\\s*\\{)",
      ),
      lookbehind: !0,
    },
    string: { pattern: e, greedy: !0 },
    property: {
      pattern:
        /(^|[^-\w\xA0-\uFFFF])(?!\s)[-_a-z\xA0-\uFFFF](?:(?!\s)[-\w\xA0-\uFFFF])*(?=\s*:)/i,
      lookbehind: !0,
    },
    important: /!important\b/i,
    function: { pattern: /(^|[^-a-z0-9])[-a-z0-9]+(?=\()/i, lookbehind: !0 },
    punctuation: /[(){};:,]/,
  }),
    (s.languages.css.atrule.inside.rest = s.languages.css);
  var t = s.languages.markup;
  t && (t.tag.addInlined("style", "css"), t.tag.addAttribute("style", "css"));
})(Prism);
Prism.languages.clike = {
  comment: [
    { pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/, lookbehind: !0, greedy: !0 },
    { pattern: /(^|[^\\:])\/\/.*/, lookbehind: !0, greedy: !0 },
  ],
  string: {
    pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
    greedy: !0,
  },
  "class-name": {
    pattern:
      /(\b(?:class|extends|implements|instanceof|interface|new|trait)\s+|\bcatch\s+\()[\w.\\]+/i,
    lookbehind: !0,
    inside: { punctuation: /[.\\]/ },
  },
  keyword:
    /\b(?:break|catch|continue|do|else|finally|for|function|if|in|instanceof|new|null|return|throw|try|while)\b/,
  boolean: /\b(?:false|true)\b/,
  function: /\b\w+(?=\()/,
  number: /\b0x[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i,
  operator: /[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,
  punctuation: /[{}[\];(),.:]/,
};
(Prism.languages.javascript = Prism.languages.extend("clike", {
  "class-name": [
    Prism.languages.clike["class-name"],
    {
      pattern:
        /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$A-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\.(?:constructor|prototype))/,
      lookbehind: !0,
    },
  ],
  keyword: [
    { pattern: /((?:^|\})\s*)catch\b/, lookbehind: !0 },
    {
      pattern:
        /(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,
      lookbehind: !0,
    },
  ],
  function:
    /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,
  number: {
    pattern: RegExp(
      "(^|[^\\w$])(?:NaN|Infinity|0[bB][01]+(?:_[01]+)*n?|0[oO][0-7]+(?:_[0-7]+)*n?|0[xX][\\dA-Fa-f]+(?:_[\\dA-Fa-f]+)*n?|\\d+(?:_\\d+)*n|(?:\\d+(?:_\\d+)*(?:\\.(?:\\d+(?:_\\d+)*)?)?|\\.\\d+(?:_\\d+)*)(?:[Ee][+-]?\\d+(?:_\\d+)*)?)(?![\\w$])",
    ),
    lookbehind: !0,
  },
  operator:
    /--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/,
})),
  (Prism.languages.javascript["class-name"][0].pattern =
    /(\b(?:class|extends|implements|instanceof|interface|new)\s+)[\w.\\]+/),
  Prism.languages.insertBefore("javascript", "keyword", {
    regex: {
      pattern: RegExp(
        "((?:^|[^$\\w\\xA0-\\uFFFF.\"'\\])\\s]|\\b(?:return|yield))\\s*)/(?:(?:\\[(?:[^\\]\\\\\r\n]|\\\\.)*\\]|\\\\.|[^/\\\\\\[\r\n])+/[dgimyus]{0,7}|(?:\\[(?:[^[\\]\\\\\r\n]|\\\\.|\\[(?:[^[\\]\\\\\r\n]|\\\\.|\\[(?:[^[\\]\\\\\r\n]|\\\\.)*\\])*\\])*\\]|\\\\.|[^/\\\\\\[\r\n])+/[dgimyus]{0,7}v[dgimyus]{0,7})(?=(?:\\s|/\\*(?:[^*]|\\*(?!/))*\\*/)*(?:$|[\r\n,.;:})\\]]|//))",
      ),
      lookbehind: !0,
      greedy: !0,
      inside: {
        "regex-source": {
          pattern: /^(\/)[\s\S]+(?=\/[a-z]*$)/,
          lookbehind: !0,
          alias: "language-regex",
          inside: Prism.languages.regex,
        },
        "regex-delimiter": /^\/|\/$/,
        "regex-flags": /^[a-z]+$/,
      },
    },
    "function-variable": {
      pattern:
        /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/,
      alias: "function",
    },
    parameter: [
      {
        pattern:
          /(function(?:\s+(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)?\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\))/,
        lookbehind: !0,
        inside: Prism.languages.javascript,
      },
      {
        pattern:
          /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=>)/i,
        lookbehind: !0,
        inside: Prism.languages.javascript,
      },
      {
        pattern:
          /(\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*=>)/,
        lookbehind: !0,
        inside: Prism.languages.javascript,
      },
      {
        pattern:
          /((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*\{)/,
        lookbehind: !0,
        inside: Prism.languages.javascript,
      },
    ],
    constant: /\b[A-Z](?:[A-Z_]|\dx?)*\b/,
  }),
  Prism.languages.insertBefore("javascript", "string", {
    hashbang: { pattern: /^#!.*/, greedy: !0, alias: "comment" },
    "template-string": {
      pattern:
        /`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}|(?!\$\{)[^\\`])*`/,
      greedy: !0,
      inside: {
        "template-punctuation": { pattern: /^`|`$/, alias: "string" },
        interpolation: {
          pattern:
            /((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/,
          lookbehind: !0,
          inside: {
            "interpolation-punctuation": {
              pattern: /^\$\{|\}$/,
              alias: "punctuation",
            },
            rest: Prism.languages.javascript,
          },
        },
        string: /[\s\S]+/,
      },
    },
    "string-property": {
      pattern:
        /((?:^|[,{])[ \t]*)(["'])(?:\\(?:\r\n|[\s\S])|(?!\2)[^\\\r\n])*\2(?=\s*:)/m,
      lookbehind: !0,
      greedy: !0,
      alias: "property",
    },
  }),
  Prism.languages.insertBefore("javascript", "operator", {
    "literal-property": {
      pattern:
        /((?:^|[,{])[ \t]*)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*:)/m,
      lookbehind: !0,
      alias: "property",
    },
  }),
  Prism.languages.markup &&
    (Prism.languages.markup.tag.addInlined("script", "javascript"),
    Prism.languages.markup.tag.addAttribute(
      "on(?:abort|blur|change|click|composition(?:end|start|update)|dblclick|error|focus(?:in|out)?|key(?:down|up)|load|mouse(?:down|enter|leave|move|out|over|up)|reset|resize|scroll|select|slotchange|submit|unload|wheel)",
      "javascript",
    )),
  (Prism.languages.js = Prism.languages.javascript);
!(function (e) {
  function n(e, n) {
    return e.replace(/<<(\d+)>>/g, function (e, s) {
      return "(?:" + n[+s] + ")";
    });
  }
  function s(e, s, a) {
    return RegExp(n(e, s), a || "");
  }
  function a(e, n) {
    for (var s = 0; s < n; s++)
      e = e.replace(/<<self>>/g, function () {
        return "(?:" + e + ")";
      });
    return e.replace(/<<self>>/g, "[^\\s\\S]");
  }
  var t =
      "bool byte char decimal double dynamic float int long object sbyte short string uint ulong ushort var void",
    r = "class enum interface record struct",
    i =
      "add alias and ascending async await by descending from(?=\\s*(?:\\w|$)) get global group into init(?=\\s*;) join let nameof not notnull on or orderby partial remove select set unmanaged value when where with(?=\\s*{)",
    o =
      "abstract as base break case catch checked const continue default delegate do else event explicit extern finally fixed for foreach goto if implicit in internal is lock namespace new null operator out override params private protected public readonly ref return sealed sizeof stackalloc static switch this throw try typeof unchecked unsafe using virtual volatile while yield";
  function l(e) {
    return "\\b(?:" + e.trim().replace(/ /g, "|") + ")\\b";
  }
  var d = l(r),
    p = RegExp(l(t + " " + r + " " + i + " " + o)),
    c = l(r + " " + i + " " + o),
    u = l(t + " " + r + " " + o),
    g = a("<(?:[^<>;=+\\-*/%&|^]|<<self>>)*>", 2),
    b = a("\\((?:[^()]|<<self>>)*\\)", 2),
    h = "@?\\b[A-Za-z_]\\w*\\b",
    f = n("<<0>>(?:\\s*<<1>>)?", [h, g]),
    m = n("(?!<<0>>)<<1>>(?:\\s*\\.\\s*<<1>>)*", [c, f]),
    k = "\\[\\s*(?:,\\s*)*\\]",
    y = n("<<0>>(?:\\s*(?:\\?\\s*)?<<1>>)*(?:\\s*\\?)?", [m, k]),
    w = n("[^,()<>[\\];=+\\-*/%&|^]|<<0>>|<<1>>|<<2>>", [g, b, k]),
    v = n("\\(<<0>>+(?:,<<0>>+)+\\)", [w]),
    x = n("(?:<<0>>|<<1>>)(?:\\s*(?:\\?\\s*)?<<2>>)*(?:\\s*\\?)?", [v, m, k]),
    $ = { keyword: p, punctuation: /[<>()?,.:[\]]/ },
    _ = "'(?:[^\r\n'\\\\]|\\\\.|\\\\[Uux][\\da-fA-F]{1,8})'",
    B = '"(?:\\\\.|[^\\\\"\r\n])*"';
  (e.languages.csharp = e.languages.extend("clike", {
    string: [
      {
        pattern: s("(^|[^$\\\\])<<0>>", ['@"(?:""|\\\\[^]|[^\\\\"])*"(?!")']),
        lookbehind: !0,
        greedy: !0,
      },
      { pattern: s("(^|[^@$\\\\])<<0>>", [B]), lookbehind: !0, greedy: !0 },
    ],
    "class-name": [
      {
        pattern: s("(\\busing\\s+static\\s+)<<0>>(?=\\s*;)", [m]),
        lookbehind: !0,
        inside: $,
      },
      {
        pattern: s("(\\busing\\s+<<0>>\\s*=\\s*)<<1>>(?=\\s*;)", [h, x]),
        lookbehind: !0,
        inside: $,
      },
      { pattern: s("(\\busing\\s+)<<0>>(?=\\s*=)", [h]), lookbehind: !0 },
      { pattern: s("(\\b<<0>>\\s+)<<1>>", [d, f]), lookbehind: !0, inside: $ },
      {
        pattern: s("(\\bcatch\\s*\\(\\s*)<<0>>", [m]),
        lookbehind: !0,
        inside: $,
      },
      { pattern: s("(\\bwhere\\s+)<<0>>", [h]), lookbehind: !0 },
      {
        pattern: s("(\\b(?:is(?:\\s+not)?|as)\\s+)<<0>>", [y]),
        lookbehind: !0,
        inside: $,
      },
      {
        pattern: s(
          "\\b<<0>>(?=\\s+(?!<<1>>|with\\s*\\{)<<2>>(?:\\s*[=,;:{)\\]]|\\s+(?:in|when)\\b))",
          [x, u, h],
        ),
        inside: $,
      },
    ],
    keyword: p,
    number:
      /(?:\b0(?:x[\da-f_]*[\da-f]|b[01_]*[01])|(?:\B\.\d+(?:_+\d+)*|\b\d+(?:_+\d+)*(?:\.\d+(?:_+\d+)*)?)(?:e[-+]?\d+(?:_+\d+)*)?)(?:[dflmu]|lu|ul)?\b/i,
    operator: />>=?|<<=?|[-=]>|([-+&|])\1|~|\?\?=?|[-+*/%&|^!=<>]=?/,
    punctuation: /\?\.?|::|[{}[\];(),.:]/,
  })),
    e.languages.insertBefore("csharp", "number", {
      range: { pattern: /\.\./, alias: "operator" },
    }),
    e.languages.insertBefore("csharp", "punctuation", {
      "named-parameter": {
        pattern: s("([(,]\\s*)<<0>>(?=\\s*:)", [h]),
        lookbehind: !0,
        alias: "punctuation",
      },
    }),
    e.languages.insertBefore("csharp", "class-name", {
      namespace: {
        pattern: s(
          "(\\b(?:namespace|using)\\s+)<<0>>(?:\\s*\\.\\s*<<0>>)*(?=\\s*[;{])",
          [h],
        ),
        lookbehind: !0,
        inside: { punctuation: /\./ },
      },
      "type-expression": {
        pattern: s(
          "(\\b(?:default|sizeof|typeof)\\s*\\(\\s*(?!\\s))(?:[^()\\s]|\\s(?!\\s)|<<0>>)*(?=\\s*\\))",
          [b],
        ),
        lookbehind: !0,
        alias: "class-name",
        inside: $,
      },
      "return-type": {
        pattern: s(
          "<<0>>(?=\\s+(?:<<1>>\\s*(?:=>|[({]|\\.\\s*this\\s*\\[)|this\\s*\\[))",
          [x, m],
        ),
        inside: $,
        alias: "class-name",
      },
      "constructor-invocation": {
        pattern: s("(\\bnew\\s+)<<0>>(?=\\s*[[({])", [x]),
        lookbehind: !0,
        inside: $,
        alias: "class-name",
      },
      "generic-method": {
        pattern: s("<<0>>\\s*<<1>>(?=\\s*\\()", [h, g]),
        inside: {
          function: s("^<<0>>", [h]),
          generic: { pattern: RegExp(g), alias: "class-name", inside: $ },
        },
      },
      "type-list": {
        pattern: s(
          "\\b((?:<<0>>\\s+<<1>>|record\\s+<<1>>\\s*<<5>>|where\\s+<<2>>)\\s*:\\s*)(?:<<3>>|<<4>>|<<1>>\\s*<<5>>|<<6>>)(?:\\s*,\\s*(?:<<3>>|<<4>>|<<6>>))*(?=\\s*(?:where|[{;]|=>|$))",
          [d, f, h, x, p.source, b, "\\bnew\\s*\\(\\s*\\)"],
        ),
        lookbehind: !0,
        inside: {
          "record-arguments": {
            pattern: s("(^(?!new\\s*\\()<<0>>\\s*)<<1>>", [f, b]),
            lookbehind: !0,
            greedy: !0,
            inside: e.languages.csharp,
          },
          keyword: p,
          "class-name": { pattern: RegExp(x), greedy: !0, inside: $ },
          punctuation: /[,()]/,
        },
      },
      preprocessor: {
        pattern: /(^[\t ]*)#.*/m,
        lookbehind: !0,
        alias: "property",
        inside: {
          directive: {
            pattern:
              /(#)\b(?:define|elif|else|endif|endregion|error|if|line|nullable|pragma|region|undef|warning)\b/,
            lookbehind: !0,
            alias: "keyword",
          },
        },
      },
    });
  var E = B + "|" + _,
    R = n("/(?![*/])|//[^\r\n]*[\r\n]|/\\*(?:[^*]|\\*(?!/))*\\*/|<<0>>", [E]),
    z = a(n("[^\"'/()]|<<0>>|\\(<<self>>*\\)", [R]), 2),
    S =
      "\\b(?:assembly|event|field|method|module|param|property|return|type)\\b",
    j = n("<<0>>(?:\\s*\\(<<1>>*\\))?", [m, z]);
  e.languages.insertBefore("csharp", "class-name", {
    attribute: {
      pattern: s(
        "((?:^|[^\\s\\w>)?])\\s*\\[\\s*)(?:<<0>>\\s*:\\s*)?<<1>>(?:\\s*,\\s*<<1>>)*(?=\\s*\\])",
        [S, j],
      ),
      lookbehind: !0,
      greedy: !0,
      inside: {
        target: { pattern: s("^<<0>>(?=\\s*:)", [S]), alias: "keyword" },
        "attribute-arguments": {
          pattern: s("\\(<<0>>*\\)", [z]),
          inside: e.languages.csharp,
        },
        "class-name": { pattern: RegExp(m), inside: { punctuation: /\./ } },
        punctuation: /[:,]/,
      },
    },
  });
  var A = ":[^}\r\n]+",
    F = a(n("[^\"'/()]|<<0>>|\\(<<self>>*\\)", [R]), 2),
    P = n("\\{(?!\\{)(?:(?![}:])<<0>>)*<<1>>?\\}", [F, A]),
    U = a(
      n("[^\"'/()]|/(?!\\*)|/\\*(?:[^*]|\\*(?!/))*\\*/|<<0>>|\\(<<self>>*\\)", [
        E,
      ]),
      2,
    ),
    Z = n("\\{(?!\\{)(?:(?![}:])<<0>>)*<<1>>?\\}", [U, A]);
  function q(n, a) {
    return {
      interpolation: {
        pattern: s("((?:^|[^{])(?:\\{\\{)*)<<0>>", [n]),
        lookbehind: !0,
        inside: {
          "format-string": {
            pattern: s("(^\\{(?:(?![}:])<<0>>)*)<<1>>(?=\\}$)", [a, A]),
            lookbehind: !0,
            inside: { punctuation: /^:/ },
          },
          punctuation: /^\{|\}$/,
          expression: {
            pattern: /[\s\S]+/,
            alias: "language-csharp",
            inside: e.languages.csharp,
          },
        },
      },
      string: /[\s\S]+/,
    };
  }
  e.languages.insertBefore("csharp", "string", {
    "interpolation-string": [
      {
        pattern: s(
          '(^|[^\\\\])(?:\\$@|@\\$)"(?:""|\\\\[^]|\\{\\{|<<0>>|[^\\\\{"])*"',
          [P],
        ),
        lookbehind: !0,
        greedy: !0,
        inside: q(P, F),
      },
      {
        pattern: s('(^|[^@\\\\])\\$"(?:\\\\.|\\{\\{|<<0>>|[^\\\\"{])*"', [Z]),
        lookbehind: !0,
        greedy: !0,
        inside: q(Z, U),
      },
    ],
    char: { pattern: RegExp(_), greedy: !0 },
  }),
    (e.languages.dotnet = e.languages.cs = e.languages.csharp);
})(Prism);
(Prism.languages.aspnet = Prism.languages.extend("markup", {
  "page-directive": {
    pattern: /<%\s*@.*%>/,
    alias: "tag",
    inside: {
      "page-directive": {
        pattern:
          /<%\s*@\s*(?:Assembly|Control|Implements|Import|Master(?:Type)?|OutputCache|Page|PreviousPageType|Reference|Register)?|%>/i,
        alias: "tag",
      },
      rest: Prism.languages.markup.tag.inside,
    },
  },
  directive: {
    pattern: /<%.*%>/,
    alias: "tag",
    inside: {
      directive: { pattern: /<%\s*?[$=%#:]{0,2}|%>/, alias: "tag" },
      rest: Prism.languages.csharp,
    },
  },
})),
  (Prism.languages.aspnet.tag.pattern =
    /<(?!%)\/?[^\s>\/]+(?:\s+[^\s>\/=]+(?:=(?:("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|[^\s'">=]+))?)*\s*\/?>/),
  Prism.languages.insertBefore(
    "inside",
    "punctuation",
    { directive: Prism.languages.aspnet.directive },
    Prism.languages.aspnet.tag.inside["attr-value"],
  ),
  Prism.languages.insertBefore("aspnet", "comment", {
    "asp-comment": { pattern: /<%--[\s\S]*?--%>/, alias: ["asp", "comment"] },
  }),
  Prism.languages.insertBefore(
    "aspnet",
    Prism.languages.javascript ? "script" : "tag",
    {
      "asp-script": {
        pattern:
          /(<script(?=.*runat=['"]?server\b)[^>]*>)[\s\S]*?(?=<\/script>)/i,
        lookbehind: !0,
        alias: ["asp", "script"],
        inside: Prism.languages.csharp || {},
      },
    },
  );
!(function (e) {
  var t =
      "\\b(?:BASH|BASHOPTS|BASH_ALIASES|BASH_ARGC|BASH_ARGV|BASH_CMDS|BASH_COMPLETION_COMPAT_DIR|BASH_LINENO|BASH_REMATCH|BASH_SOURCE|BASH_VERSINFO|BASH_VERSION|COLORTERM|COLUMNS|COMP_WORDBREAKS|DBUS_SESSION_BUS_ADDRESS|DEFAULTS_PATH|DESKTOP_SESSION|DIRSTACK|DISPLAY|EUID|GDMSESSION|GDM_LANG|GNOME_KEYRING_CONTROL|GNOME_KEYRING_PID|GPG_AGENT_INFO|GROUPS|HISTCONTROL|HISTFILE|HISTFILESIZE|HISTSIZE|HOME|HOSTNAME|HOSTTYPE|IFS|INSTANCE|JOB|LANG|LANGUAGE|LC_ADDRESS|LC_ALL|LC_IDENTIFICATION|LC_MEASUREMENT|LC_MONETARY|LC_NAME|LC_NUMERIC|LC_PAPER|LC_TELEPHONE|LC_TIME|LESSCLOSE|LESSOPEN|LINES|LOGNAME|LS_COLORS|MACHTYPE|MAILCHECK|MANDATORY_PATH|NO_AT_BRIDGE|OLDPWD|OPTERR|OPTIND|ORBIT_SOCKETDIR|OSTYPE|PAPERSIZE|PATH|PIPESTATUS|PPID|PS1|PS2|PS3|PS4|PWD|RANDOM|REPLY|SECONDS|SELINUX_INIT|SESSION|SESSIONTYPE|SESSION_MANAGER|SHELL|SHELLOPTS|SHLVL|SSH_AUTH_SOCK|TERM|UID|UPSTART_EVENTS|UPSTART_INSTANCE|UPSTART_JOB|UPSTART_SESSION|USER|WINDOWID|XAUTHORITY|XDG_CONFIG_DIRS|XDG_CURRENT_DESKTOP|XDG_DATA_DIRS|XDG_GREETER_DATA_DIR|XDG_MENU_PREFIX|XDG_RUNTIME_DIR|XDG_SEAT|XDG_SEAT_PATH|XDG_SESSION_DESKTOP|XDG_SESSION_ID|XDG_SESSION_PATH|XDG_SESSION_TYPE|XDG_VTNR|XMODIFIERS)\\b",
    a = {
      pattern: /(^(["']?)\w+\2)[ \t]+\S.*/,
      lookbehind: !0,
      alias: "punctuation",
      inside: null,
    },
    n = {
      bash: a,
      environment: { pattern: RegExp("\\$" + t), alias: "constant" },
      variable: [
        {
          pattern: /\$?\(\([\s\S]+?\)\)/,
          greedy: !0,
          inside: {
            variable: [
              { pattern: /(^\$\(\([\s\S]+)\)\)/, lookbehind: !0 },
              /^\$\(\(/,
            ],
            number:
              /\b0x[\dA-Fa-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:[Ee]-?\d+)?/,
            operator:
              /--|\+\+|\*\*=?|<<=?|>>=?|&&|\|\||[=!+\-*/%<>^&|]=?|[?~:]/,
            punctuation: /\(\(?|\)\)?|,|;/,
          },
        },
        {
          pattern: /\$\((?:\([^)]+\)|[^()])+\)|`[^`]+`/,
          greedy: !0,
          inside: { variable: /^\$\(|^`|\)$|`$/ },
        },
        {
          pattern: /\$\{[^}]+\}/,
          greedy: !0,
          inside: {
            operator: /:[-=?+]?|[!\/]|##?|%%?|\^\^?|,,?/,
            punctuation: /[\[\]]/,
            environment: {
              pattern: RegExp("(\\{)" + t),
              lookbehind: !0,
              alias: "constant",
            },
          },
        },
        /\$(?:\w+|[#?*!@$])/,
      ],
      entity:
        /\\(?:[abceEfnrtv\\"]|O?[0-7]{1,3}|U[0-9a-fA-F]{8}|u[0-9a-fA-F]{4}|x[0-9a-fA-F]{1,2})/,
    };
  (e.languages.bash = {
    shebang: { pattern: /^#!\s*\/.*/, alias: "important" },
    comment: { pattern: /(^|[^"{\\$])#.*/, lookbehind: !0 },
    "function-name": [
      {
        pattern: /(\bfunction\s+)[\w-]+(?=(?:\s*\(?:\s*\))?\s*\{)/,
        lookbehind: !0,
        alias: "function",
      },
      { pattern: /\b[\w-]+(?=\s*\(\s*\)\s*\{)/, alias: "function" },
    ],
    "for-or-select": {
      pattern: /(\b(?:for|select)\s+)\w+(?=\s+in\s)/,
      alias: "variable",
      lookbehind: !0,
    },
    "assign-left": {
      pattern: /(^|[\s;|&]|[<>]\()\w+(?:\.\w+)*(?=\+?=)/,
      inside: {
        environment: {
          pattern: RegExp("(^|[\\s;|&]|[<>]\\()" + t),
          lookbehind: !0,
          alias: "constant",
        },
      },
      alias: "variable",
      lookbehind: !0,
    },
    parameter: {
      pattern: /(^|\s)-{1,2}(?:\w+:[+-]?)?\w+(?:\.\w+)*(?=[=\s]|$)/,
      alias: "variable",
      lookbehind: !0,
    },
    string: [
      {
        pattern: /((?:^|[^<])<<-?\s*)(\w+)\s[\s\S]*?(?:\r?\n|\r)\2/,
        lookbehind: !0,
        greedy: !0,
        inside: n,
      },
      {
        pattern: /((?:^|[^<])<<-?\s*)(["'])(\w+)\2\s[\s\S]*?(?:\r?\n|\r)\3/,
        lookbehind: !0,
        greedy: !0,
        inside: { bash: a },
      },
      {
        pattern:
          /(^|[^\\](?:\\\\)*)"(?:\\[\s\S]|\$\([^)]+\)|\$(?!\()|`[^`]+`|[^"\\`$])*"/,
        lookbehind: !0,
        greedy: !0,
        inside: n,
      },
      { pattern: /(^|[^$\\])'[^']*'/, lookbehind: !0, greedy: !0 },
      {
        pattern: /\$'(?:[^'\\]|\\[\s\S])*'/,
        greedy: !0,
        inside: { entity: n.entity },
      },
    ],
    environment: { pattern: RegExp("\\$?" + t), alias: "constant" },
    variable: n.variable,
    function: {
      pattern:
        /(^|[\s;|&]|[<>]\()(?:add|apropos|apt|apt-cache|apt-get|aptitude|aspell|automysqlbackup|awk|basename|bash|bc|bconsole|bg|bzip2|cal|cargo|cat|cfdisk|chgrp|chkconfig|chmod|chown|chroot|cksum|clear|cmp|column|comm|composer|cp|cron|crontab|csplit|curl|cut|date|dc|dd|ddrescue|debootstrap|df|diff|diff3|dig|dir|dircolors|dirname|dirs|dmesg|docker|docker-compose|du|egrep|eject|env|ethtool|expand|expect|expr|fdformat|fdisk|fg|fgrep|file|find|fmt|fold|format|free|fsck|ftp|fuser|gawk|git|gparted|grep|groupadd|groupdel|groupmod|groups|grub-mkconfig|gzip|halt|head|hg|history|host|hostname|htop|iconv|id|ifconfig|ifdown|ifup|import|install|ip|java|jobs|join|kill|killall|less|link|ln|locate|logname|logrotate|look|lpc|lpr|lprint|lprintd|lprintq|lprm|ls|lsof|lynx|make|man|mc|mdadm|mkconfig|mkdir|mke2fs|mkfifo|mkfs|mkisofs|mknod|mkswap|mmv|more|most|mount|mtools|mtr|mutt|mv|nano|nc|netstat|nice|nl|node|nohup|notify-send|npm|nslookup|op|open|parted|passwd|paste|pathchk|ping|pkill|pnpm|podman|podman-compose|popd|pr|printcap|printenv|ps|pushd|pv|quota|quotacheck|quotactl|ram|rar|rcp|reboot|remsync|rename|renice|rev|rm|rmdir|rpm|rsync|scp|screen|sdiff|sed|sendmail|seq|service|sftp|sh|shellcheck|shuf|shutdown|sleep|slocate|sort|split|ssh|stat|strace|su|sudo|sum|suspend|swapon|sync|sysctl|tac|tail|tar|tee|time|timeout|top|touch|tr|traceroute|tsort|tty|umount|uname|unexpand|uniq|units|unrar|unshar|unzip|update-grub|uptime|useradd|userdel|usermod|users|uudecode|uuencode|v|vcpkg|vdir|vi|vim|virsh|vmstat|wait|watch|wc|wget|whereis|which|who|whoami|write|xargs|xdg-open|yarn|yes|zenity|zip|zsh|zypper)(?=$|[)\s;|&])/,
      lookbehind: !0,
    },
    keyword: {
      pattern:
        /(^|[\s;|&]|[<>]\()(?:case|do|done|elif|else|esac|fi|for|function|if|in|select|then|until|while)(?=$|[)\s;|&])/,
      lookbehind: !0,
    },
    builtin: {
      pattern:
        /(^|[\s;|&]|[<>]\()(?:\.|:|alias|bind|break|builtin|caller|cd|command|continue|declare|echo|enable|eval|exec|exit|export|getopts|hash|help|let|local|logout|mapfile|printf|pwd|read|readarray|readonly|return|set|shift|shopt|source|test|times|trap|type|typeset|ulimit|umask|unalias|unset)(?=$|[)\s;|&])/,
      lookbehind: !0,
      alias: "class-name",
    },
    boolean: {
      pattern: /(^|[\s;|&]|[<>]\()(?:false|true)(?=$|[)\s;|&])/,
      lookbehind: !0,
    },
    "file-descriptor": { pattern: /\B&\d\b/, alias: "important" },
    operator: {
      pattern:
        /\d?<>|>\||\+=|=[=~]?|!=?|<<[<-]?|[&\d]?>>|\d[<>]&?|[<>][&=]?|&[>&]?|\|[&|]?/,
      inside: { "file-descriptor": { pattern: /^\d/, alias: "important" } },
    },
    punctuation: /\$?\(\(?|\)\)?|\.\.|[{}[\];\\]/,
    number: { pattern: /(^|\s)(?:[1-9]\d*|0)(?:[.,]\d+)?\b/, lookbehind: !0 },
  }),
    (a.inside = e.languages.bash);
  for (
    var s = [
        "comment",
        "function-name",
        "for-or-select",
        "assign-left",
        "parameter",
        "string",
        "environment",
        "function",
        "keyword",
        "builtin",
        "boolean",
        "file-descriptor",
        "operator",
        "punctuation",
        "number",
      ],
      o = n.variable[1].inside,
      i = 0;
    i < s.length;
    i++
  )
    o[s[i]] = e.languages.bash[s[i]];
  (e.languages.sh = e.languages.bash), (e.languages.shell = e.languages.bash);
})(Prism);
(Prism.languages.c = Prism.languages.extend("clike", {
  comment: {
    pattern:
      /\/\/(?:[^\r\n\\]|\\(?:\r\n?|\n|(?![\r\n])))*|\/\*[\s\S]*?(?:\*\/|$)/,
    greedy: !0,
  },
  string: { pattern: /"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"/, greedy: !0 },
  "class-name": {
    pattern:
      /(\b(?:enum|struct)\s+(?:__attribute__\s*\(\([\s\S]*?\)\)\s*)?)\w+|\b[a-z]\w*_t\b/,
    lookbehind: !0,
  },
  keyword:
    /\b(?:_Alignas|_Alignof|_Atomic|_Bool|_Complex|_Generic|_Imaginary|_Noreturn|_Static_assert|_Thread_local|__attribute__|asm|auto|break|case|char|const|continue|default|do|double|else|enum|extern|float|for|goto|if|inline|int|long|register|return|short|signed|sizeof|static|struct|switch|typedef|typeof|union|unsigned|void|volatile|while)\b/,
  function: /\b[a-z_]\w*(?=\s*\()/i,
  number:
    /(?:\b0x(?:[\da-f]+(?:\.[\da-f]*)?|\.[\da-f]+)(?:p[+-]?\d+)?|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?)[ful]{0,4}/i,
  operator: />>=?|<<=?|->|([-+&|:])\1|[?:~]|[-+*/%&|^!=<>]=?/,
})),
  Prism.languages.insertBefore("c", "string", {
    char: { pattern: /'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n]){0,32}'/, greedy: !0 },
  }),
  Prism.languages.insertBefore("c", "string", {
    macro: {
      pattern:
        /(^[\t ]*)#\s*[a-z](?:[^\r\n\\/]|\/(?!\*)|\/\*(?:[^*]|\*(?!\/))*\*\/|\\(?:\r\n|[\s\S]))*/im,
      lookbehind: !0,
      greedy: !0,
      alias: "property",
      inside: {
        string: [
          { pattern: /^(#\s*include\s*)<[^>]+>/, lookbehind: !0 },
          Prism.languages.c.string,
        ],
        char: Prism.languages.c.char,
        comment: Prism.languages.c.comment,
        "macro-name": [
          { pattern: /(^#\s*define\s+)\w+\b(?!\()/i, lookbehind: !0 },
          {
            pattern: /(^#\s*define\s+)\w+\b(?=\()/i,
            lookbehind: !0,
            alias: "function",
          },
        ],
        directive: {
          pattern: /^(#\s*)[a-z]+/,
          lookbehind: !0,
          alias: "keyword",
        },
        "directive-hash": /^#/,
        punctuation: /##|\\(?=[\r\n])/,
        expression: { pattern: /\S[\s\S]*/, inside: Prism.languages.c },
      },
    },
  }),
  Prism.languages.insertBefore("c", "function", {
    constant:
      /\b(?:EOF|NULL|SEEK_CUR|SEEK_END|SEEK_SET|__DATE__|__FILE__|__LINE__|__TIMESTAMP__|__TIME__|__func__|stderr|stdin|stdout)\b/,
  }),
  delete Prism.languages.c.boolean;
!(function (e) {
  var t =
      /\b(?:alignas|alignof|asm|auto|bool|break|case|catch|char|char16_t|char32_t|char8_t|class|co_await|co_return|co_yield|compl|concept|const|const_cast|consteval|constexpr|constinit|continue|decltype|default|delete|do|double|dynamic_cast|else|enum|explicit|export|extern|final|float|for|friend|goto|if|import|inline|int|int16_t|int32_t|int64_t|int8_t|long|module|mutable|namespace|new|noexcept|nullptr|operator|override|private|protected|public|register|reinterpret_cast|requires|return|short|signed|sizeof|static|static_assert|static_cast|struct|switch|template|this|thread_local|throw|try|typedef|typeid|typename|uint16_t|uint32_t|uint64_t|uint8_t|union|unsigned|using|virtual|void|volatile|wchar_t|while)\b/,
    n = "\\b(?!<keyword>)\\w+(?:\\s*\\.\\s*\\w+)*\\b".replace(
      /<keyword>/g,
      function () {
        return t.source;
      },
    );
  (e.languages.cpp = e.languages.extend("c", {
    "class-name": [
      {
        pattern: RegExp(
          "(\\b(?:class|concept|enum|struct|typename)\\s+)(?!<keyword>)\\w+".replace(
            /<keyword>/g,
            function () {
              return t.source;
            },
          ),
        ),
        lookbehind: !0,
      },
      /\b[A-Z]\w*(?=\s*::\s*\w+\s*\()/,
      /\b[A-Z_]\w*(?=\s*::\s*~\w+\s*\()/i,
      /\b\w+(?=\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>\s*::\s*\w+\s*\()/,
    ],
    keyword: t,
    number: {
      pattern:
        /(?:\b0b[01']+|\b0x(?:[\da-f']+(?:\.[\da-f']*)?|\.[\da-f']+)(?:p[+-]?[\d']+)?|(?:\b[\d']+(?:\.[\d']*)?|\B\.[\d']+)(?:e[+-]?[\d']+)?)[ful]{0,4}/i,
      greedy: !0,
    },
    operator:
      />>=?|<<=?|->|--|\+\+|&&|\|\||[?:~]|<=>|[-+*/%&|^!=<>]=?|\b(?:and|and_eq|bitand|bitor|not|not_eq|or|or_eq|xor|xor_eq)\b/,
    boolean: /\b(?:false|true)\b/,
  })),
    e.languages.insertBefore("cpp", "string", {
      module: {
        pattern: RegExp(
          '(\\b(?:import|module)\\s+)(?:"(?:\\\\(?:\r\n|[^])|[^"\\\\\r\n])*"|<[^<>\r\n]*>|' +
            "<mod-name>(?:\\s*:\\s*<mod-name>)?|:\\s*<mod-name>".replace(
              /<mod-name>/g,
              function () {
                return n;
              },
            ) +
            ")",
        ),
        lookbehind: !0,
        greedy: !0,
        inside: { string: /^[<"][\s\S]+/, operator: /:/, punctuation: /\./ },
      },
      "raw-string": {
        pattern: /R"([^()\\ ]{0,16})\([\s\S]*?\)\1"/,
        alias: "string",
        greedy: !0,
      },
    }),
    e.languages.insertBefore("cpp", "keyword", {
      "generic-function": {
        pattern: /\b(?!operator\b)[a-z_]\w*\s*<(?:[^<>]|<[^<>]*>)*>(?=\s*\()/i,
        inside: {
          function: /^\w+/,
          generic: {
            pattern: /<[\s\S]+/,
            alias: "class-name",
            inside: e.languages.cpp,
          },
        },
      },
    }),
    e.languages.insertBefore("cpp", "operator", {
      "double-colon": { pattern: /::/, alias: "punctuation" },
    }),
    e.languages.insertBefore("cpp", "class-name", {
      "base-clause": {
        pattern:
          /(\b(?:class|struct)\s+\w+\s*:\s*)[^;{}"'\s]+(?:\s+[^;{}"'\s]+)*(?=\s*[;{])/,
        lookbehind: !0,
        greedy: !0,
        inside: e.languages.extend("cpp", {}),
      },
    }),
    e.languages.insertBefore(
      "inside",
      "double-colon",
      { "class-name": /\b[a-z_]\w*\b(?!\s*::)/i },
      e.languages.cpp["base-clause"],
    );
})(Prism);
Prism.languages.clojure = {
  comment: { pattern: /;.*/, greedy: !0 },
  string: { pattern: /"(?:[^"\\]|\\.)*"/, greedy: !0 },
  char: /\\\w+/,
  symbol: { pattern: /(^|[\s()\[\]{},])::?[\w*+!?'<>=/.-]+/, lookbehind: !0 },
  keyword: {
    pattern:
      /(\()(?:-|->|->>|\.|\.\.|\*|\/|\+|<|<=|=|==|>|>=|accessor|agent|agent-errors|aget|alength|all-ns|alter|and|append-child|apply|array-map|aset|aset-boolean|aset-byte|aset-char|aset-double|aset-float|aset-int|aset-long|aset-short|assert|assoc|await|await-for|bean|binding|bit-and|bit-not|bit-or|bit-shift-left|bit-shift-right|bit-xor|boolean|branch\?|butlast|byte|cast|char|children|class|clear-agent-errors|comment|commute|comp|comparator|complement|concat|cond|conj|cons|constantly|construct-proxy|contains\?|count|create-ns|create-struct|cycle|dec|declare|def|def-|definline|definterface|defmacro|defmethod|defmulti|defn|defn-|defonce|defproject|defprotocol|defrecord|defstruct|deftype|deref|difference|disj|dissoc|distinct|do|doall|doc|dorun|doseq|dosync|dotimes|doto|double|down|drop|drop-while|edit|end\?|ensure|eval|every\?|false\?|ffirst|file-seq|filter|find|find-doc|find-ns|find-var|first|float|flush|fn|fnseq|for|frest|gensym|get|get-proxy-class|hash-map|hash-set|identical\?|identity|if|if-let|if-not|import|in-ns|inc|index|insert-child|insert-left|insert-right|inspect-table|inspect-tree|instance\?|int|interleave|intersection|into|into-array|iterate|join|key|keys|keyword|keyword\?|last|lazy-cat|lazy-cons|left|lefts|let|line-seq|list|list\*|load|load-file|locking|long|loop|macroexpand|macroexpand-1|make-array|make-node|map|map-invert|map\?|mapcat|max|max-key|memfn|merge|merge-with|meta|min|min-key|monitor-enter|name|namespace|neg\?|new|newline|next|nil\?|node|not|not-any\?|not-every\?|not=|ns|ns-imports|ns-interns|ns-map|ns-name|ns-publics|ns-refers|ns-resolve|ns-unmap|nth|nthrest|or|parse|partial|path|peek|pop|pos\?|pr|pr-str|print|print-str|println|println-str|prn|prn-str|project|proxy|proxy-mappings|quot|quote|rand|rand-int|range|re-find|re-groups|re-matcher|re-matches|re-pattern|re-seq|read|read-line|recur|reduce|ref|ref-set|refer|rem|remove|remove-method|remove-ns|rename|rename-keys|repeat|replace|replicate|resolve|rest|resultset-seq|reverse|rfirst|right|rights|root|rrest|rseq|second|select|select-keys|send|send-off|seq|seq-zip|seq\?|set|set!|short|slurp|some|sort|sort-by|sorted-map|sorted-map-by|sorted-set|special-symbol\?|split-at|split-with|str|string\?|struct|struct-map|subs|subvec|symbol|symbol\?|sync|take|take-nth|take-while|test|throw|time|to-array|to-array-2d|tree-seq|true\?|try|union|up|update-proxy|val|vals|var|var-get|var-set|var\?|vector|vector-zip|vector\?|when|when-first|when-let|when-not|with-local-vars|with-meta|with-open|with-out-str|xml-seq|xml-zip|zero\?|zipmap|zipper)(?=[\s)]|$)/,
    lookbehind: !0,
  },
  boolean: /\b(?:false|nil|true)\b/,
  number: {
    pattern:
      /(^|[^\w$@])(?:\d+(?:[/.]\d+)?(?:e[+-]?\d+)?|0x[a-f0-9]+|[1-9]\d?r[a-z0-9]+)[lmn]?(?![\w$@])/i,
    lookbehind: !0,
  },
  function: {
    pattern: /((?:^|[^'])\()[\w*+!?'<>=/.-]+(?=[\s)]|$)/,
    lookbehind: !0,
  },
  operator: /[#@^`~]/,
  punctuation: /[{}\[\](),]/,
};
!(function (e) {
  (e.languages.ruby = e.languages.extend("clike", {
    comment: { pattern: /#.*|^=begin\s[\s\S]*?^=end/m, greedy: !0 },
    "class-name": {
      pattern:
        /(\b(?:class|module)\s+|\bcatch\s+\()[\w.\\]+|\b[A-Z_]\w*(?=\s*\.\s*new\b)/,
      lookbehind: !0,
      inside: { punctuation: /[.\\]/ },
    },
    keyword:
      /\b(?:BEGIN|END|alias|and|begin|break|case|class|def|define_method|defined|do|each|else|elsif|end|ensure|extend|for|if|in|include|module|new|next|nil|not|or|prepend|private|protected|public|raise|redo|require|rescue|retry|return|self|super|then|throw|undef|unless|until|when|while|yield)\b/,
    operator:
      /\.{2,3}|&\.|===|<?=>|[!=]?~|(?:&&|\|\||<<|>>|\*\*|[+\-*/%<>!^&|=])=?|[?:]/,
    punctuation: /[(){}[\].,;]/,
  })),
    e.languages.insertBefore("ruby", "operator", {
      "double-colon": { pattern: /::/, alias: "punctuation" },
    });
  var n = {
    pattern: /((?:^|[^\\])(?:\\{2})*)#\{(?:[^{}]|\{[^{}]*\})*\}/,
    lookbehind: !0,
    inside: {
      content: {
        pattern: /^(#\{)[\s\S]+(?=\}$)/,
        lookbehind: !0,
        inside: e.languages.ruby,
      },
      delimiter: { pattern: /^#\{|\}$/, alias: "punctuation" },
    },
  };
  delete e.languages.ruby.function;
  var t =
      "(?:" +
      [
        "([^a-zA-Z0-9\\s{(\\[<=])(?:(?!\\1)[^\\\\]|\\\\[^])*\\1",
        "\\((?:[^()\\\\]|\\\\[^]|\\((?:[^()\\\\]|\\\\[^])*\\))*\\)",
        "\\{(?:[^{}\\\\]|\\\\[^]|\\{(?:[^{}\\\\]|\\\\[^])*\\})*\\}",
        "\\[(?:[^\\[\\]\\\\]|\\\\[^]|\\[(?:[^\\[\\]\\\\]|\\\\[^])*\\])*\\]",
        "<(?:[^<>\\\\]|\\\\[^]|<(?:[^<>\\\\]|\\\\[^])*>)*>",
      ].join("|") +
      ")",
    i =
      '(?:"(?:\\\\.|[^"\\\\\r\n])*"|(?:\\b[a-zA-Z_]\\w*|[^\\s\0-\\x7F]+)[?!]?|\\$.)';
  e.languages.insertBefore("ruby", "keyword", {
    "regex-literal": [
      {
        pattern: RegExp("%r" + t + "[egimnosux]{0,6}"),
        greedy: !0,
        inside: { interpolation: n, regex: /[\s\S]+/ },
      },
      {
        pattern:
          /(^|[^/])\/(?!\/)(?:\[[^\r\n\]]+\]|\\.|[^[/\\\r\n])+\/[egimnosux]{0,6}(?=\s*(?:$|[\r\n,.;})#]))/,
        lookbehind: !0,
        greedy: !0,
        inside: { interpolation: n, regex: /[\s\S]+/ },
      },
    ],
    variable: /[@$]+[a-zA-Z_]\w*(?:[?!]|\b)/,
    symbol: [
      { pattern: RegExp("(^|[^:]):" + i), lookbehind: !0, greedy: !0 },
      {
        pattern: RegExp("([\r\n{(,][ \t]*)" + i + "(?=:(?!:))"),
        lookbehind: !0,
        greedy: !0,
      },
    ],
    "method-definition": {
      pattern: /(\bdef\s+)\w+(?:\s*\.\s*\w+)?/,
      lookbehind: !0,
      inside: {
        function: /\b\w+$/,
        keyword: /^self\b/,
        "class-name": /^\w+/,
        punctuation: /\./,
      },
    },
  }),
    e.languages.insertBefore("ruby", "string", {
      "string-literal": [
        {
          pattern: RegExp("%[qQiIwWs]?" + t),
          greedy: !0,
          inside: { interpolation: n, string: /[\s\S]+/ },
        },
        {
          pattern:
            /("|')(?:#\{[^}]+\}|#(?!\{)|\\(?:\r\n|[\s\S])|(?!\1)[^\\#\r\n])*\1/,
          greedy: !0,
          inside: { interpolation: n, string: /[\s\S]+/ },
        },
        {
          pattern: /<<[-~]?([a-z_]\w*)[\r\n](?:.*[\r\n])*?[\t ]*\1/i,
          alias: "heredoc-string",
          greedy: !0,
          inside: {
            delimiter: {
              pattern: /^<<[-~]?[a-z_]\w*|\b[a-z_]\w*$/i,
              inside: { symbol: /\b\w+/, punctuation: /^<<[-~]?/ },
            },
            interpolation: n,
            string: /[\s\S]+/,
          },
        },
        {
          pattern: /<<[-~]?'([a-z_]\w*)'[\r\n](?:.*[\r\n])*?[\t ]*\1/i,
          alias: "heredoc-string",
          greedy: !0,
          inside: {
            delimiter: {
              pattern: /^<<[-~]?'[a-z_]\w*'|\b[a-z_]\w*$/i,
              inside: { symbol: /\b\w+/, punctuation: /^<<[-~]?'|'$/ },
            },
            string: /[\s\S]+/,
          },
        },
      ],
      "command-literal": [
        {
          pattern: RegExp("%x" + t),
          greedy: !0,
          inside: {
            interpolation: n,
            command: { pattern: /[\s\S]+/, alias: "string" },
          },
        },
        {
          pattern: /`(?:#\{[^}]+\}|#(?!\{)|\\(?:\r\n|[\s\S])|[^\\`#\r\n])*`/,
          greedy: !0,
          inside: {
            interpolation: n,
            command: { pattern: /[\s\S]+/, alias: "string" },
          },
        },
      ],
    }),
    delete e.languages.ruby.string,
    e.languages.insertBefore("ruby", "number", {
      builtin:
        /\b(?:Array|Bignum|Binding|Class|Continuation|Dir|Exception|FalseClass|File|Fixnum|Float|Hash|IO|Integer|MatchData|Method|Module|NilClass|Numeric|Object|Proc|Range|Regexp|Stat|String|Struct|Symbol|TMS|Thread|ThreadGroup|Time|TrueClass)\b/,
      constant: /\b[A-Z][A-Z0-9_]*(?:[?!]|\b)/,
    }),
    (e.languages.rb = e.languages.ruby);
})(Prism);
!(function (e) {
  (e.languages.crystal = e.languages.extend("ruby", {
    keyword: [
      /\b(?:__DIR__|__END_LINE__|__FILE__|__LINE__|abstract|alias|annotation|as|asm|begin|break|case|class|def|do|else|elsif|end|ensure|enum|extend|for|fun|if|ifdef|include|instance_sizeof|lib|macro|module|next|of|out|pointerof|private|protected|ptr|require|rescue|return|select|self|sizeof|struct|super|then|type|typeof|undef|uninitialized|union|unless|until|when|while|with|yield)\b/,
      { pattern: /(\.\s*)(?:is_a|responds_to)\?/, lookbehind: !0 },
    ],
    number:
      /\b(?:0b[01_]*[01]|0o[0-7_]*[0-7]|0x[\da-fA-F_]*[\da-fA-F]|(?:\d(?:[\d_]*\d)?)(?:\.[\d_]*\d)?(?:[eE][+-]?[\d_]*\d)?)(?:_(?:[uif](?:8|16|32|64))?)?\b/,
    operator: [/->/, e.languages.ruby.operator],
    punctuation: /[(){}[\].,;\\]/,
  })),
    e.languages.insertBefore("crystal", "string-literal", {
      attribute: {
        pattern: /@\[.*?\]/,
        inside: {
          delimiter: { pattern: /^@\[|\]$/, alias: "punctuation" },
          attribute: {
            pattern: /^(\s*)\w+/,
            lookbehind: !0,
            alias: "class-name",
          },
          args: { pattern: /\S(?:[\s\S]*\S)?/, inside: e.languages.crystal },
        },
      },
      expansion: {
        pattern: /\{(?:\{.*?\}|%.*?%)\}/,
        inside: {
          content: {
            pattern: /^(\{.)[\s\S]+(?=.\}$)/,
            lookbehind: !0,
            inside: e.languages.crystal,
          },
          delimiter: { pattern: /^\{[\{%]|[\}%]\}$/, alias: "operator" },
        },
      },
      char: {
        pattern:
          /'(?:[^\\\r\n]{1,2}|\\(?:.|u(?:[A-Fa-f0-9]{1,4}|\{[A-Fa-f0-9]{1,6}\})))'/,
        greedy: !0,
      },
    });
})(Prism);
Prism.languages.csv = {
  value: /[^\r\n,"]+|"(?:[^"]|"")*"(?!")/,
  punctuation: /,/,
};
(Prism.languages.d = Prism.languages.extend("clike", {
  comment: [
    { pattern: /^\s*#!.+/, greedy: !0 },
    {
      pattern: RegExp(
        "(^|[^\\\\])(?:" +
          [
            "/\\+(?:/\\+(?:[^+]|\\+(?!/))*\\+/|(?!/\\+)[^])*?\\+/",
            "//.*",
            "/\\*[^]*?\\*/",
          ].join("|") +
          ")",
      ),
      lookbehind: !0,
      greedy: !0,
    },
  ],
  string: [
    {
      pattern: RegExp(
        [
          '\\b[rx]"(?:\\\\[^]|[^\\\\"])*"[cwd]?',
          '\\bq"(?:\\[[^]*?\\]|\\([^]*?\\)|<[^]*?>|\\{[^]*?\\})"',
          '\\bq"((?!\\d)\\w+)$[^]*?^\\1"',
          '\\bq"(.)[^]*?\\2"',
          '(["`])(?:\\\\[^]|(?!\\3)[^\\\\])*\\3[cwd]?',
        ].join("|"),
        "m",
      ),
      greedy: !0,
    },
    {
      pattern: /\bq\{(?:\{[^{}]*\}|[^{}])*\}/,
      greedy: !0,
      alias: "token-string",
    },
  ],
  keyword:
    /\$|\b(?:__(?:(?:DATE|EOF|FILE|FUNCTION|LINE|MODULE|PRETTY_FUNCTION|TIMESTAMP|TIME|VENDOR|VERSION)__|gshared|parameters|traits|vector)|abstract|alias|align|asm|assert|auto|body|bool|break|byte|case|cast|catch|cdouble|cent|cfloat|char|class|const|continue|creal|dchar|debug|default|delegate|delete|deprecated|do|double|dstring|else|enum|export|extern|false|final|finally|float|for|foreach|foreach_reverse|function|goto|idouble|if|ifloat|immutable|import|inout|int|interface|invariant|ireal|lazy|long|macro|mixin|module|new|nothrow|null|out|override|package|pragma|private|protected|ptrdiff_t|public|pure|real|ref|return|scope|shared|short|size_t|static|string|struct|super|switch|synchronized|template|this|throw|true|try|typedef|typeid|typeof|ubyte|ucent|uint|ulong|union|unittest|ushort|version|void|volatile|wchar|while|with|wstring)\b/,
  number: [
    /\b0x\.?[a-f\d_]+(?:(?!\.\.)\.[a-f\d_]*)?(?:p[+-]?[a-f\d_]+)?[ulfi]{0,4}/i,
    {
      pattern:
        /((?:\.\.)?)(?:\b0b\.?|\b|\.)\d[\d_]*(?:(?!\.\.)\.[\d_]*)?(?:e[+-]?\d[\d_]*)?[ulfi]{0,4}/i,
      lookbehind: !0,
    },
  ],
  operator:
    /\|[|=]?|&[&=]?|\+[+=]?|-[-=]?|\.?\.\.|=[>=]?|!(?:i[ns]\b|<>?=?|>=?|=)?|\bi[ns]\b|(?:<[<>]?|>>?>?|\^\^|[*\/%^~])=?/,
})),
  Prism.languages.insertBefore("d", "string", {
    char: /'(?:\\(?:\W|\w+)|[^\\])'/,
  }),
  Prism.languages.insertBefore("d", "keyword", { property: /\B@\w*/ }),
  Prism.languages.insertBefore("d", "function", {
    register: {
      pattern:
        /\b(?:[ABCD][LHX]|E?(?:BP|DI|SI|SP)|[BS]PL|[ECSDGF]S|CR[0234]|[DS]IL|DR[012367]|E[ABCD]X|X?MM[0-7]|R(?:1[0-5]|[89])[BWD]?|R[ABCD]X|R[BS]P|R[DS]I|TR[3-7]|XMM(?:1[0-5]|[89])|YMM(?:1[0-5]|\d))\b|\bST(?:\([0-7]\)|\b)/,
      alias: "variable",
    },
  });
!(function (e) {
  var a = [
      /\b(?:async|sync|yield)\*/,
      /\b(?:abstract|assert|async|await|break|case|catch|class|const|continue|covariant|default|deferred|do|dynamic|else|enum|export|extends|extension|external|factory|final|finally|for|get|hide|if|implements|import|in|interface|library|mixin|new|null|on|operator|part|rethrow|return|set|show|static|super|switch|sync|this|throw|try|typedef|var|void|while|with|yield)\b/,
    ],
    n = "(^|[^\\w.])(?:[a-z]\\w*\\s*\\.\\s*)*(?:[A-Z]\\w*\\s*\\.\\s*)*",
    s = {
      pattern: RegExp(n + "[A-Z](?:[\\d_A-Z]*[a-z]\\w*)?\\b"),
      lookbehind: !0,
      inside: {
        namespace: {
          pattern: /^[a-z]\w*(?:\s*\.\s*[a-z]\w*)*(?:\s*\.)?/,
          inside: { punctuation: /\./ },
        },
      },
    };
  (e.languages.dart = e.languages.extend("clike", {
    "class-name": [
      s,
      {
        pattern: RegExp(n + "[A-Z]\\w*(?=\\s+\\w+\\s*[;,=()])"),
        lookbehind: !0,
        inside: s.inside,
      },
    ],
    keyword: a,
    operator:
      /\bis!|\b(?:as|is)\b|\+\+|--|&&|\|\||<<=?|>>=?|~(?:\/=?)?|[+\-*\/%&^|=!<>]=?|\?/,
  })),
    e.languages.insertBefore("dart", "string", {
      "string-literal": {
        pattern:
          /r?(?:("""|''')[\s\S]*?\1|(["'])(?:\\.|(?!\2)[^\\\r\n])*\2(?!\2))/,
        greedy: !0,
        inside: {
          interpolation: {
            pattern:
              /((?:^|[^\\])(?:\\{2})*)\$(?:\w+|\{(?:[^{}]|\{[^{}]*\})*\})/,
            lookbehind: !0,
            inside: {
              punctuation: /^\$\{?|\}$/,
              expression: { pattern: /[\s\S]+/, inside: e.languages.dart },
            },
          },
          string: /[\s\S]+/,
        },
      },
      string: void 0,
    }),
    e.languages.insertBefore("dart", "class-name", {
      metadata: { pattern: /@\w+/, alias: "function" },
    }),
    e.languages.insertBefore("dart", "class-name", {
      generics: {
        pattern:
          /<(?:[\w\s,.&?]|<(?:[\w\s,.&?]|<(?:[\w\s,.&?]|<[\w\s,.&?]*>)*>)*>)*>/,
        inside: {
          "class-name": s,
          keyword: a,
          punctuation: /[<>(),.:]/,
          operator: /[?&|]/,
        },
      },
    });
})(Prism);
(Prism.languages.elixir = {
  doc: {
    pattern:
      /@(?:doc|moduledoc)\s+(?:("""|''')[\s\S]*?\1|("|')(?:\\(?:\r\n|[\s\S])|(?!\2)[^\\\r\n])*\2)/,
    inside: { attribute: /^@\w+/, string: /['"][\s\S]+/ },
  },
  comment: { pattern: /#.*/, greedy: !0 },
  regex: {
    pattern:
      /~[rR](?:("""|''')(?:\\[\s\S]|(?!\1)[^\\])+\1|([\/|"'])(?:\\.|(?!\2)[^\\\r\n])+\2|\((?:\\.|[^\\)\r\n])+\)|\[(?:\\.|[^\\\]\r\n])+\]|\{(?:\\.|[^\\}\r\n])+\}|<(?:\\.|[^\\>\r\n])+>)[uismxfr]*/,
    greedy: !0,
  },
  string: [
    {
      pattern:
        /~[cCsSwW](?:("""|''')(?:\\[\s\S]|(?!\1)[^\\])+\1|([\/|"'])(?:\\.|(?!\2)[^\\\r\n])+\2|\((?:\\.|[^\\)\r\n])+\)|\[(?:\\.|[^\\\]\r\n])+\]|\{(?:\\.|#\{[^}]+\}|#(?!\{)|[^#\\}\r\n])+\}|<(?:\\.|[^\\>\r\n])+>)[csa]?/,
      greedy: !0,
      inside: {},
    },
    { pattern: /("""|''')[\s\S]*?\1/, greedy: !0, inside: {} },
    {
      pattern: /("|')(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
      greedy: !0,
      inside: {},
    },
  ],
  atom: { pattern: /(^|[^:]):\w+/, lookbehind: !0, alias: "symbol" },
  module: { pattern: /\b[A-Z]\w*\b/, alias: "class-name" },
  "attr-name": /\b\w+\??:(?!:)/,
  argument: { pattern: /(^|[^&])&\d+/, lookbehind: !0, alias: "variable" },
  attribute: { pattern: /@\w+/, alias: "variable" },
  function: /\b[_a-zA-Z]\w*[?!]?(?:(?=\s*(?:\.\s*)?\()|(?=\/\d))/,
  number: /\b(?:0[box][a-f\d_]+|\d[\d_]*)(?:\.[\d_]+)?(?:e[+-]?[\d_]+)?\b/i,
  keyword:
    /\b(?:after|alias|and|case|catch|cond|def(?:callback|delegate|exception|impl|macro|module|n|np|p|protocol|struct)?|do|else|end|fn|for|if|import|not|or|quote|raise|require|rescue|try|unless|unquote|use|when)\b/,
  boolean: /\b(?:false|nil|true)\b/,
  operator: [
    /\bin\b|&&?|\|[|>]?|\\\\|::|\.\.\.?|\+\+?|-[->]?|<[-=>]|>=|!==?|\B!|=(?:==?|[>~])?|[*\/^]/,
    { pattern: /([^<])<(?!<)/, lookbehind: !0 },
    { pattern: /([^>])>(?!>)/, lookbehind: !0 },
  ],
  punctuation: /<<|>>|[.,%\[\]{}()]/,
}),
  Prism.languages.elixir.string.forEach(function (e) {
    e.inside = {
      interpolation: {
        pattern: /#\{[^}]+\}/,
        inside: {
          delimiter: { pattern: /^#\{|\}$/, alias: "punctuation" },
          rest: Prism.languages.elixir,
        },
      },
    };
  });
Prism.languages.elm = {
  comment: /--.*|\{-[\s\S]*?-\}/,
  char: {
    pattern:
      /'(?:[^\\'\r\n]|\\(?:[abfnrtv\\']|\d+|x[0-9a-fA-F]+|u\{[0-9a-fA-F]+\}))'/,
    greedy: !0,
  },
  string: [
    { pattern: /"""[\s\S]*?"""/, greedy: !0 },
    { pattern: /"(?:[^\\"\r\n]|\\.)*"/, greedy: !0 },
  ],
  "import-statement": {
    pattern:
      /(^[\t ]*)import\s+[A-Z]\w*(?:\.[A-Z]\w*)*(?:\s+as\s+(?:[A-Z]\w*)(?:\.[A-Z]\w*)*)?(?:\s+exposing\s+)?/m,
    lookbehind: !0,
    inside: { keyword: /\b(?:as|exposing|import)\b/ },
  },
  keyword:
    /\b(?:alias|as|case|else|exposing|if|in|infixl|infixr|let|module|of|then|type)\b/,
  builtin:
    /\b(?:abs|acos|always|asin|atan|atan2|ceiling|clamp|compare|cos|curry|degrees|e|flip|floor|fromPolar|identity|isInfinite|isNaN|logBase|max|min|negate|never|not|pi|radians|rem|round|sin|sqrt|tan|toFloat|toPolar|toString|truncate|turns|uncurry|xor)\b/,
  number: /\b(?:\d+(?:\.\d+)?(?:e[+-]?\d+)?|0x[0-9a-f]+)\b/i,
  operator: /\s\.\s|[+\-/*=.$<>:&|^?%#@~!]{2,}|[+\-/*=$<>:&|^?%#@~!]/,
  hvariable: /\b(?:[A-Z]\w*\.)*[a-z]\w*\b/,
  constant: /\b(?:[A-Z]\w*\.)*[A-Z]\w*\b/,
  punctuation: /[{}[\]|(),.:]/,
};
Prism.languages.erlang = {
  comment: /%.+/,
  string: { pattern: /"(?:\\.|[^\\"\r\n])*"/, greedy: !0 },
  "quoted-function": {
    pattern: /'(?:\\.|[^\\'\r\n])+'(?=\()/,
    alias: "function",
  },
  "quoted-atom": { pattern: /'(?:\\.|[^\\'\r\n])+'/, alias: "atom" },
  boolean: /\b(?:false|true)\b/,
  keyword: /\b(?:after|begin|case|catch|end|fun|if|of|receive|try|when)\b/,
  number: [
    /\$\\?./,
    /\b\d+#[a-z0-9]+/i,
    /(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i,
  ],
  function: /\b[a-z][\w@]*(?=\()/,
  variable: { pattern: /(^|[^@])(?:\b|\?)[A-Z_][\w@]*/, lookbehind: !0 },
  operator: [
    /[=\/<>:]=|=[:\/]=|\+\+?|--?|[=*\/!]|\b(?:and|andalso|band|bnot|bor|bsl|bsr|bxor|div|not|or|orelse|rem|xor)\b/,
    { pattern: /(^|[^<])<(?!<)/, lookbehind: !0 },
    { pattern: /(^|[^>])>(?!>)/, lookbehind: !0 },
  ],
  atom: /\b[a-z][\w@]*/,
  punctuation: /[()[\]{}:;,.#|]|<<|>>/,
};
Prism.languages.gdscript = {
  comment: /#.*/,
  string: {
    pattern:
      /@?(?:("|')(?:(?!\1)[^\n\\]|\\[\s\S])*\1(?!"|')|"""(?:[^\\]|\\[\s\S])*?""")/,
    greedy: !0,
  },
  "class-name": {
    pattern:
      /(^(?:class|class_name|extends)[ \t]+|^export\([ \t]*|\bas[ \t]+|(?:\b(?:const|var)[ \t]|[,(])[ \t]*\w+[ \t]*:[ \t]*|->[ \t]*)[a-zA-Z_]\w*/m,
    lookbehind: !0,
  },
  keyword:
    /\b(?:and|as|assert|break|breakpoint|class|class_name|const|continue|elif|else|enum|export|extends|for|func|if|in|is|master|mastersync|match|not|null|onready|or|pass|preload|puppet|puppetsync|remote|remotesync|return|self|setget|signal|static|tool|var|while|yield)\b/,
  function: /\b[a-z_]\w*(?=[ \t]*\()/i,
  variable: /\$\w+/,
  number: [
    /\b0b[01_]+\b|\b0x[\da-fA-F_]+\b|(?:\b\d[\d_]*(?:\.[\d_]*)?|\B\.[\d_]+)(?:e[+-]?[\d_]+)?\b/,
    /\b(?:INF|NAN|PI|TAU)\b/,
  ],
  constant: /\b[A-Z][A-Z_\d]*\b/,
  boolean: /\b(?:false|true)\b/,
  operator: /->|:=|&&|\|\||<<|>>|[-+*/%&|!<>=]=?|[~^]/,
  punctuation: /[.:,;()[\]{}]/,
};
(Prism.languages.go = Prism.languages.extend("clike", {
  string: {
    pattern: /(^|[^\\])"(?:\\.|[^"\\\r\n])*"|`[^`]*`/,
    lookbehind: !0,
    greedy: !0,
  },
  keyword:
    /\b(?:break|case|chan|const|continue|default|defer|else|fallthrough|for|func|go(?:to)?|if|import|interface|map|package|range|return|select|struct|switch|type|var)\b/,
  boolean: /\b(?:_|false|iota|nil|true)\b/,
  number: [
    /\b0(?:b[01_]+|o[0-7_]+)i?\b/i,
    /\b0x(?:[a-f\d_]+(?:\.[a-f\d_]*)?|\.[a-f\d_]+)(?:p[+-]?\d+(?:_\d+)*)?i?(?!\w)/i,
    /(?:\b\d[\d_]*(?:\.[\d_]*)?|\B\.\d[\d_]*)(?:e[+-]?[\d_]+)?i?(?!\w)/i,
  ],
  operator:
    /[*\/%^!=]=?|\+[=+]?|-[=-]?|\|[=|]?|&(?:=|&|\^=?)?|>(?:>=?|=)?|<(?:<=?|=|-)?|:=|\.\.\./,
  builtin:
    /\b(?:append|bool|byte|cap|close|complex|complex(?:64|128)|copy|delete|error|float(?:32|64)|u?int(?:8|16|32|64)?|imag|len|make|new|panic|print(?:ln)?|real|recover|rune|string|uintptr)\b/,
})),
  Prism.languages.insertBefore("go", "string", {
    char: { pattern: /'(?:\\.|[^'\\\r\n]){0,10}'/, greedy: !0 },
  }),
  delete Prism.languages.go["class-name"];
(Prism.languages.haskell = {
  comment: {
    pattern:
      /(^|[^-!#$%*+=?&@|~.:<>^\\\/])(?:--(?:(?=.)[^-!#$%*+=?&@|~.:<>^\\\/].*|$)|\{-[\s\S]*?-\})/m,
    lookbehind: !0,
  },
  char: {
    pattern:
      /'(?:[^\\']|\\(?:[abfnrtv\\"'&]|\^[A-Z@[\]^_]|ACK|BEL|BS|CAN|CR|DC1|DC2|DC3|DC4|DEL|DLE|EM|ENQ|EOT|ESC|ETB|ETX|FF|FS|GS|HT|LF|NAK|NUL|RS|SI|SO|SOH|SP|STX|SUB|SYN|US|VT|\d+|o[0-7]+|x[0-9a-fA-F]+))'/,
    alias: "string",
  },
  string: { pattern: /"(?:[^\\"]|\\(?:\S|\s+\\))*"/, greedy: !0 },
  keyword:
    /\b(?:case|class|data|deriving|do|else|if|in|infixl|infixr|instance|let|module|newtype|of|primitive|then|type|where)\b/,
  "import-statement": {
    pattern:
      /(^[\t ]*)import\s+(?:qualified\s+)?(?:[A-Z][\w']*)(?:\.[A-Z][\w']*)*(?:\s+as\s+(?:[A-Z][\w']*)(?:\.[A-Z][\w']*)*)?(?:\s+hiding\b)?/m,
    lookbehind: !0,
    inside: {
      keyword: /\b(?:as|hiding|import|qualified)\b/,
      punctuation: /\./,
    },
  },
  builtin:
    /\b(?:abs|acos|acosh|all|and|any|appendFile|approxRational|asTypeOf|asin|asinh|atan|atan2|atanh|basicIORun|break|catch|ceiling|chr|compare|concat|concatMap|const|cos|cosh|curry|cycle|decodeFloat|denominator|digitToInt|div|divMod|drop|dropWhile|either|elem|encodeFloat|enumFrom|enumFromThen|enumFromThenTo|enumFromTo|error|even|exp|exponent|fail|filter|flip|floatDigits|floatRadix|floatRange|floor|fmap|foldl|foldl1|foldr|foldr1|fromDouble|fromEnum|fromInt|fromInteger|fromIntegral|fromRational|fst|gcd|getChar|getContents|getLine|group|head|id|inRange|index|init|intToDigit|interact|ioError|isAlpha|isAlphaNum|isAscii|isControl|isDenormalized|isDigit|isHexDigit|isIEEE|isInfinite|isLower|isNaN|isNegativeZero|isOctDigit|isPrint|isSpace|isUpper|iterate|last|lcm|length|lex|lexDigits|lexLitChar|lines|log|logBase|lookup|map|mapM|mapM_|max|maxBound|maximum|maybe|min|minBound|minimum|mod|negate|not|notElem|null|numerator|odd|or|ord|otherwise|pack|pi|pred|primExitWith|print|product|properFraction|putChar|putStr|putStrLn|quot|quotRem|range|rangeSize|read|readDec|readFile|readFloat|readHex|readIO|readInt|readList|readLitChar|readLn|readOct|readParen|readSigned|reads|readsPrec|realToFrac|recip|rem|repeat|replicate|return|reverse|round|scaleFloat|scanl|scanl1|scanr|scanr1|seq|sequence|sequence_|show|showChar|showInt|showList|showLitChar|showParen|showSigned|showString|shows|showsPrec|significand|signum|sin|sinh|snd|sort|span|splitAt|sqrt|subtract|succ|sum|tail|take|takeWhile|tan|tanh|threadToIOResult|toEnum|toInt|toInteger|toLower|toRational|toUpper|truncate|uncurry|undefined|unlines|until|unwords|unzip|unzip3|userError|words|writeFile|zip|zip3|zipWith|zipWith3)\b/,
  number: /\b(?:\d+(?:\.\d+)?(?:e[+-]?\d+)?|0o[0-7]+|0x[0-9a-f]+)\b/i,
  operator: [
    { pattern: /`(?:[A-Z][\w']*\.)*[_a-z][\w']*`/, greedy: !0 },
    { pattern: /(\s)\.(?=\s)/, lookbehind: !0 },
    /[-!#$%*+=?&@|~:<>^\\\/][-!#$%*+=?&@|~.:<>^\\\/]*|\.[-!#$%*+=?&@|~.:<>^\\\/]+/,
  ],
  hvariable: {
    pattern: /\b(?:[A-Z][\w']*\.)*[_a-z][\w']*/,
    inside: { punctuation: /\./ },
  },
  constant: {
    pattern: /\b(?:[A-Z][\w']*\.)*[A-Z][\w']*/,
    inside: { punctuation: /\./ },
  },
  punctuation: /[{}[\];(),.:]/,
}),
  (Prism.languages.hs = Prism.languages.haskell);
!(function (e) {
  var n =
      /\b(?:abstract|assert|boolean|break|byte|case|catch|char|class|const|continue|default|do|double|else|enum|exports|extends|final|finally|float|for|goto|if|implements|import|instanceof|int|interface|long|module|native|new|non-sealed|null|open|opens|package|permits|private|protected|provides|public|record(?!\s*[(){}[\]<>=%~.:,;?+\-*/&|^])|requires|return|sealed|short|static|strictfp|super|switch|synchronized|this|throw|throws|to|transient|transitive|try|uses|var|void|volatile|while|with|yield)\b/,
    t = "(?:[a-z]\\w*\\s*\\.\\s*)*(?:[A-Z]\\w*\\s*\\.\\s*)*",
    s = {
      pattern: RegExp("(^|[^\\w.])" + t + "[A-Z](?:[\\d_A-Z]*[a-z]\\w*)?\\b"),
      lookbehind: !0,
      inside: {
        namespace: {
          pattern: /^[a-z]\w*(?:\s*\.\s*[a-z]\w*)*(?:\s*\.)?/,
          inside: { punctuation: /\./ },
        },
        punctuation: /\./,
      },
    };
  (e.languages.java = e.languages.extend("clike", {
    string: {
      pattern: /(^|[^\\])"(?:\\.|[^"\\\r\n])*"/,
      lookbehind: !0,
      greedy: !0,
    },
    "class-name": [
      s,
      {
        pattern: RegExp(
          "(^|[^\\w.])" +
            t +
            "[A-Z]\\w*(?=\\s+\\w+\\s*[;,=()]|\\s*(?:\\[[\\s,]*\\]\\s*)?::\\s*new\\b)",
        ),
        lookbehind: !0,
        inside: s.inside,
      },
      {
        pattern: RegExp(
          "(\\b(?:class|enum|extends|implements|instanceof|interface|new|record|throws)\\s+)" +
            t +
            "[A-Z]\\w*\\b",
        ),
        lookbehind: !0,
        inside: s.inside,
      },
    ],
    keyword: n,
    function: [
      e.languages.clike.function,
      { pattern: /(::\s*)[a-z_]\w*/, lookbehind: !0 },
    ],
    number:
      /\b0b[01][01_]*L?\b|\b0x(?:\.[\da-f_p+-]+|[\da-f_]+(?:\.[\da-f_p+-]+)?)\b|(?:\b\d[\d_]*(?:\.[\d_]*)?|\B\.\d[\d_]*)(?:e[+-]?\d[\d_]*)?[dfl]?/i,
    operator: {
      pattern:
        /(^|[^.])(?:<<=?|>>>?=?|->|--|\+\+|&&|\|\||::|[?:~]|[-+*/%&|^!=<>]=?)/m,
      lookbehind: !0,
    },
    constant: /\b[A-Z][A-Z_\d]+\b/,
  })),
    e.languages.insertBefore("java", "string", {
      "triple-quoted-string": {
        pattern: /"""[ \t]*[\r\n](?:(?:"|"")?(?:\\.|[^"\\]))*"""/,
        greedy: !0,
        alias: "string",
      },
      char: { pattern: /'(?:\\.|[^'\\\r\n]){1,6}'/, greedy: !0 },
    }),
    e.languages.insertBefore("java", "class-name", {
      annotation: {
        pattern: /(^|[^.])@\w+(?:\s*\.\s*\w+)*/,
        lookbehind: !0,
        alias: "punctuation",
      },
      generics: {
        pattern:
          /<(?:[\w\s,.?]|&(?!&)|<(?:[\w\s,.?]|&(?!&)|<(?:[\w\s,.?]|&(?!&)|<(?:[\w\s,.?]|&(?!&))*>)*>)*>)*>/,
        inside: {
          "class-name": s,
          keyword: n,
          punctuation: /[<>(),.:]/,
          operator: /[?&|]/,
        },
      },
      import: [
        {
          pattern: RegExp("(\\bimport\\s+)" + t + "(?:[A-Z]\\w*|\\*)(?=\\s*;)"),
          lookbehind: !0,
          inside: {
            namespace: s.inside.namespace,
            punctuation: /\./,
            operator: /\*/,
            "class-name": /\w+/,
          },
        },
        {
          pattern: RegExp(
            "(\\bimport\\s+static\\s+)" + t + "(?:\\w+|\\*)(?=\\s*;)",
          ),
          lookbehind: !0,
          alias: "static",
          inside: {
            namespace: s.inside.namespace,
            static: /\b\w+$/,
            punctuation: /\./,
            operator: /\*/,
            "class-name": /\w+/,
          },
        },
      ],
      namespace: {
        pattern: RegExp(
          "(\\b(?:exports|import(?:\\s+static)?|module|open|opens|package|provides|requires|to|transitive|uses|with)\\s+)(?!<keyword>)[a-z]\\w*(?:\\.[a-z]\\w*)*\\.?".replace(
            /<keyword>/g,
            function () {
              return n.source;
            },
          ),
        ),
        lookbehind: !0,
        inside: { punctuation: /\./ },
      },
    });
})(Prism);
(Prism.languages.json = {
  property: {
    pattern: /(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?=\s*:)/,
    lookbehind: !0,
    greedy: !0,
  },
  string: {
    pattern: /(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?!\s*:)/,
    lookbehind: !0,
    greedy: !0,
  },
  comment: { pattern: /\/\/.*|\/\*[\s\S]*?(?:\*\/|$)/, greedy: !0 },
  number: /-?\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b/i,
  punctuation: /[{}[\],]/,
  operator: /:/,
  boolean: /\b(?:false|true)\b/,
  null: { pattern: /\bnull\b/, alias: "keyword" },
}),
  (Prism.languages.webmanifest = Prism.languages.json);
!(function (a) {
  var e = /\\(?:[^a-z()[\]]|[a-z*]+)/i,
    n = { "equation-command": { pattern: e, alias: "regex" } };
  (a.languages.latex = {
    comment: /%.*/,
    cdata: {
      pattern:
        /(\\begin\{((?:lstlisting|verbatim)\*?)\})[\s\S]*?(?=\\end\{\2\})/,
      lookbehind: !0,
    },
    equation: [
      {
        pattern:
          /\$\$(?:\\[\s\S]|[^\\$])+\$\$|\$(?:\\[\s\S]|[^\\$])+\$|\\\([\s\S]*?\\\)|\\\[[\s\S]*?\\\]/,
        inside: n,
        alias: "string",
      },
      {
        pattern:
          /(\\begin\{((?:align|eqnarray|equation|gather|math|multline)\*?)\})[\s\S]*?(?=\\end\{\2\})/,
        lookbehind: !0,
        inside: n,
        alias: "string",
      },
    ],
    keyword: {
      pattern:
        /(\\(?:begin|cite|documentclass|end|label|ref|usepackage)(?:\[[^\]]+\])?\{)[^}]+(?=\})/,
      lookbehind: !0,
    },
    url: { pattern: /(\\url\{)[^}]+(?=\})/, lookbehind: !0 },
    headline: {
      pattern:
        /(\\(?:chapter|frametitle|paragraph|part|section|subparagraph|subsection|subsubparagraph|subsubsection|subsubsubparagraph)\*?(?:\[[^\]]+\])?\{)[^}]+(?=\})/,
      lookbehind: !0,
      alias: "class-name",
    },
    function: { pattern: e, alias: "selector" },
    punctuation: /[[\]{}&]/,
  }),
    (a.languages.tex = a.languages.latex),
    (a.languages.context = a.languages.latex);
})(Prism);
!(function (e) {
  function n(e) {
    return RegExp("(\\()(?:" + e + ")(?=[\\s\\)])");
  }
  function a(e) {
    return RegExp("([\\s([])(?:" + e + ")(?=[\\s)])");
  }
  var t = "(?!\\d)[-+*/~!@$%^=<>{}\\w]+",
    r = "(\\()",
    i =
      "(?:[^()]|\\((?:[^()]|\\((?:[^()]|\\((?:[^()]|\\((?:[^()]|\\([^()]*\\))*\\))*\\))*\\))*\\))*",
    s = {
      heading: { pattern: /;;;.*/, alias: ["comment", "title"] },
      comment: /;.*/,
      string: {
        pattern: /"(?:[^"\\]|\\.)*"/,
        greedy: !0,
        inside: {
          argument: /[-A-Z]+(?=[.,\s])/,
          symbol: RegExp("`" + t + "'"),
        },
      },
      "quoted-symbol": {
        pattern: RegExp("#?'" + t),
        alias: ["variable", "symbol"],
      },
      "lisp-property": { pattern: RegExp(":" + t), alias: "property" },
      splice: { pattern: RegExp(",@?" + t), alias: ["symbol", "variable"] },
      keyword: [
        {
          pattern: RegExp(
            "(\\()(?:and|(?:cl-)?letf|cl-loop|cond|cons|error|if|(?:lexical-)?let\\*?|message|not|null|or|provide|require|setq|unless|use-package|when|while)(?=\\s)",
          ),
          lookbehind: !0,
        },
        {
          pattern: RegExp(
            "(\\()(?:append|by|collect|concat|do|finally|for|in|return)(?=\\s)",
          ),
          lookbehind: !0,
        },
      ],
      declare: { pattern: n("declare"), lookbehind: !0, alias: "keyword" },
      interactive: {
        pattern: n("interactive"),
        lookbehind: !0,
        alias: "keyword",
      },
      boolean: { pattern: a("nil|t"), lookbehind: !0 },
      number: { pattern: a("[-+]?\\d+(?:\\.\\d*)?"), lookbehind: !0 },
      defvar: {
        pattern: RegExp("(\\()def(?:const|custom|group|var)\\s+" + t),
        lookbehind: !0,
        inside: { keyword: /^def[a-z]+/, variable: RegExp(t) },
      },
      defun: {
        pattern: RegExp(
          "(\\()(?:cl-)?(?:defmacro|defun\\*?)\\s+" + t + "\\s+\\(" + i + "\\)",
        ),
        lookbehind: !0,
        greedy: !0,
        inside: {
          keyword: /^(?:cl-)?def\S+/,
          arguments: null,
          function: { pattern: RegExp("(^\\s)" + t), lookbehind: !0 },
          punctuation: /[()]/,
        },
      },
      lambda: {
        pattern: RegExp(
          "(\\()lambda\\s+\\(\\s*(?:&?" + t + "(?:\\s+&?" + t + ")*\\s*)?\\)",
        ),
        lookbehind: !0,
        greedy: !0,
        inside: { keyword: /^lambda/, arguments: null, punctuation: /[()]/ },
      },
      car: { pattern: RegExp(r + t), lookbehind: !0 },
      punctuation: [
        /(?:['`,]?\(|[)\[\]])/,
        { pattern: /(\s)\.(?=\s)/, lookbehind: !0 },
      ],
    },
    l = {
      "lisp-marker": RegExp("&(?!\\d)[-+*/~!@$%^=<>{}\\w]+"),
      varform: {
        pattern: RegExp("\\(" + t + "\\s+(?=\\S)" + i + "\\)"),
        inside: s,
      },
      argument: {
        pattern: RegExp("(^|[\\s(])" + t),
        lookbehind: !0,
        alias: "variable",
      },
      rest: s,
    },
    o = "\\S+(?:\\s+\\S+)*",
    p = {
      pattern: RegExp(r + i + "(?=\\))"),
      lookbehind: !0,
      inside: {
        "rest-vars": { pattern: RegExp("&(?:body|rest)\\s+" + o), inside: l },
        "other-marker-vars": {
          pattern: RegExp("&(?:aux|optional)\\s+" + o),
          inside: l,
        },
        keys: {
          pattern: RegExp("&key\\s+" + o + "(?:\\s+&allow-other-keys)?"),
          inside: l,
        },
        argument: { pattern: RegExp(t), alias: "variable" },
        punctuation: /[()]/,
      },
    };
  (s.lambda.inside.arguments = p),
    (s.defun.inside.arguments = e.util.clone(p)),
    (s.defun.inside.arguments.inside.sublist = p),
    (e.languages.lisp = s),
    (e.languages.elisp = s),
    (e.languages.emacs = s),
    (e.languages["emacs-lisp"] = s);
})(Prism);
Prism.languages.lua = {
  comment: /^#!.+|--(?:\[(=*)\[[\s\S]*?\]\1\]|.*)/m,
  string: {
    pattern:
      /(["'])(?:(?!\1)[^\\\r\n]|\\z(?:\r\n|\s)|\\(?:\r\n|[^z]))*\1|\[(=*)\[[\s\S]*?\]\2\]/,
    greedy: !0,
  },
  number:
    /\b0x[a-f\d]+(?:\.[a-f\d]*)?(?:p[+-]?\d+)?\b|\b\d+(?:\.\B|(?:\.\d*)?(?:e[+-]?\d+)?\b)|\B\.\d+(?:e[+-]?\d+)?\b/i,
  keyword:
    /\b(?:and|break|do|else|elseif|end|false|for|function|goto|if|in|local|nil|not|or|repeat|return|then|true|until|while)\b/,
  function: /(?!\d)\w+(?=\s*(?:[({]))/,
  operator: [
    /[-+*%^&|#]|\/\/?|<[<=]?|>[>=]?|[=~]=?/,
    { pattern: /(^|[^.])\.\.(?!\.)/, lookbehind: !0 },
  ],
  punctuation: /[\[\](){},;]|\.+|:+/,
};
!(function (n) {
  function e(n) {
    return (
      (n = n.replace(/<inner>/g, function () {
        return "(?:\\\\.|[^\\\\\n\r]|(?:\n|\r\n?)(?![\r\n]))";
      })),
      RegExp("((?:^|[^\\\\])(?:\\\\{2})*)(?:" + n + ")")
    );
  }
  var t = "(?:\\\\.|``(?:[^`\r\n]|`(?!`))+``|`[^`\r\n]+`|[^\\\\|\r\n`])+",
    a = "\\|?__(?:\\|__)+\\|?(?:(?:\n|\r\n?)|(?![^]))".replace(
      /__/g,
      function () {
        return t;
      },
    ),
    i =
      "\\|?[ \t]*:?-{3,}:?[ \t]*(?:\\|[ \t]*:?-{3,}:?[ \t]*)+\\|?(?:\n|\r\n?)";
  (n.languages.markdown = n.languages.extend("markup", {})),
    n.languages.insertBefore("markdown", "prolog", {
      "front-matter-block": {
        pattern: /(^(?:\s*[\r\n])?)---(?!.)[\s\S]*?[\r\n]---(?!.)/,
        lookbehind: !0,
        greedy: !0,
        inside: {
          punctuation: /^---|---$/,
          "front-matter": {
            pattern: /\S+(?:\s+\S+)*/,
            alias: ["yaml", "language-yaml"],
            inside: n.languages.yaml,
          },
        },
      },
      blockquote: { pattern: /^>(?:[\t ]*>)*/m, alias: "punctuation" },
      table: {
        pattern: RegExp("^" + a + i + "(?:" + a + ")*", "m"),
        inside: {
          "table-data-rows": {
            pattern: RegExp("^(" + a + i + ")(?:" + a + ")*$"),
            lookbehind: !0,
            inside: {
              "table-data": {
                pattern: RegExp(t),
                inside: n.languages.markdown,
              },
              punctuation: /\|/,
            },
          },
          "table-line": {
            pattern: RegExp("^(" + a + ")" + i + "$"),
            lookbehind: !0,
            inside: { punctuation: /\||:?-{3,}:?/ },
          },
          "table-header-row": {
            pattern: RegExp("^" + a + "$"),
            inside: {
              "table-header": {
                pattern: RegExp(t),
                alias: "important",
                inside: n.languages.markdown,
              },
              punctuation: /\|/,
            },
          },
        },
      },
      code: [
        {
          pattern:
            /((?:^|\n)[ \t]*\n|(?:^|\r\n?)[ \t]*\r\n?)(?: {4}|\t).+(?:(?:\n|\r\n?)(?: {4}|\t).+)*/,
          lookbehind: !0,
          alias: "keyword",
        },
        {
          pattern: /^```[\s\S]*?^```$/m,
          greedy: !0,
          inside: {
            "code-block": {
              pattern: /^(```.*(?:\n|\r\n?))[\s\S]+?(?=(?:\n|\r\n?)^```$)/m,
              lookbehind: !0,
            },
            "code-language": { pattern: /^(```).+/, lookbehind: !0 },
            punctuation: /```/,
          },
        },
      ],
      title: [
        {
          pattern: /\S.*(?:\n|\r\n?)(?:==+|--+)(?=[ \t]*$)/m,
          alias: "important",
          inside: { punctuation: /==+$|--+$/ },
        },
        {
          pattern: /(^\s*)#.+/m,
          lookbehind: !0,
          alias: "important",
          inside: { punctuation: /^#+|#+$/ },
        },
      ],
      hr: {
        pattern: /(^\s*)([*-])(?:[\t ]*\2){2,}(?=\s*$)/m,
        lookbehind: !0,
        alias: "punctuation",
      },
      list: {
        pattern: /(^\s*)(?:[*+-]|\d+\.)(?=[\t ].)/m,
        lookbehind: !0,
        alias: "punctuation",
      },
      "url-reference": {
        pattern:
          /!?\[[^\]]+\]:[\t ]+(?:\S+|<(?:\\.|[^>\\])+>)(?:[\t ]+(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\)))?/,
        inside: {
          variable: { pattern: /^(!?\[)[^\]]+/, lookbehind: !0 },
          string:
            /(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\))$/,
          punctuation: /^[\[\]!:]|[<>]/,
        },
        alias: "url",
      },
      bold: {
        pattern: e(
          "\\b__(?:(?!_)<inner>|_(?:(?!_)<inner>)+_)+__\\b|\\*\\*(?:(?!\\*)<inner>|\\*(?:(?!\\*)<inner>)+\\*)+\\*\\*",
        ),
        lookbehind: !0,
        greedy: !0,
        inside: {
          content: {
            pattern: /(^..)[\s\S]+(?=..$)/,
            lookbehind: !0,
            inside: {},
          },
          punctuation: /\*\*|__/,
        },
      },
      italic: {
        pattern: e(
          "\\b_(?:(?!_)<inner>|__(?:(?!_)<inner>)+__)+_\\b|\\*(?:(?!\\*)<inner>|\\*\\*(?:(?!\\*)<inner>)+\\*\\*)+\\*",
        ),
        lookbehind: !0,
        greedy: !0,
        inside: {
          content: { pattern: /(^.)[\s\S]+(?=.$)/, lookbehind: !0, inside: {} },
          punctuation: /[*_]/,
        },
      },
      strike: {
        pattern: e("(~~?)(?:(?!~)<inner>)+\\2"),
        lookbehind: !0,
        greedy: !0,
        inside: {
          content: {
            pattern: /(^~~?)[\s\S]+(?=\1$)/,
            lookbehind: !0,
            inside: {},
          },
          punctuation: /~~?/,
        },
      },
      "code-snippet": {
        pattern:
          /(^|[^\\`])(?:``[^`\r\n]+(?:`[^`\r\n]+)*``(?!`)|`[^`\r\n]+`(?!`))/,
        lookbehind: !0,
        greedy: !0,
        alias: ["code", "keyword"],
      },
      url: {
        pattern: e(
          '!?\\[(?:(?!\\])<inner>)+\\](?:\\([^\\s)]+(?:[\t ]+"(?:\\\\.|[^"\\\\])*")?\\)|[ \t]?\\[(?:(?!\\])<inner>)+\\])',
        ),
        lookbehind: !0,
        greedy: !0,
        inside: {
          operator: /^!/,
          content: { pattern: /(^\[)[^\]]+(?=\])/, lookbehind: !0, inside: {} },
          variable: { pattern: /(^\][ \t]?\[)[^\]]+(?=\]$)/, lookbehind: !0 },
          url: { pattern: /(^\]\()[^\s)]+/, lookbehind: !0 },
          string: {
            pattern: /(^[ \t]+)"(?:\\.|[^"\\])*"(?=\)$)/,
            lookbehind: !0,
          },
        },
      },
    }),
    ["url", "bold", "italic", "strike"].forEach(function (e) {
      ["url", "bold", "italic", "strike", "code-snippet"].forEach(function (t) {
        e !== t &&
          (n.languages.markdown[e].inside.content.inside[t] =
            n.languages.markdown[t]);
      });
    }),
    n.hooks.add("after-tokenize", function (n) {
      ("markdown" !== n.language && "md" !== n.language) ||
        (function n(e) {
          if (e && "string" != typeof e)
            for (var t = 0, a = e.length; t < a; t++) {
              var i = e[t];
              if ("code" === i.type) {
                var r = i.content[1],
                  o = i.content[3];
                if (
                  r &&
                  o &&
                  "code-language" === r.type &&
                  "code-block" === o.type &&
                  "string" == typeof r.content
                ) {
                  var l = r.content
                      .replace(/\b#/g, "sharp")
                      .replace(/\b\+\+/g, "pp"),
                    s =
                      "language-" +
                      (l = (/[a-z][\w-]*/i.exec(l) || [""])[0].toLowerCase());
                  o.alias
                    ? "string" == typeof o.alias
                      ? (o.alias = [o.alias, s])
                      : o.alias.push(s)
                    : (o.alias = [s]);
                }
              } else n(i.content);
            }
        })(n.tokens);
    }),
    n.hooks.add("wrap", function (e) {
      if ("code-block" === e.type) {
        for (var t = "", a = 0, i = e.classes.length; a < i; a++) {
          var s = e.classes[a],
            d = /language-(.+)/.exec(s);
          if (d) {
            t = d[1];
            break;
          }
        }
        var p = n.languages[t];
        if (p)
          e.content = n.highlight(
            e.content
              .replace(r, "")
              .replace(/&(\w{1,8}|#x?[\da-f]{1,8});/gi, function (n, e) {
                var t;
                return "#" === (e = e.toLowerCase())[0]
                  ? ((t =
                      "x" === e[1]
                        ? parseInt(e.slice(2), 16)
                        : Number(e.slice(1))),
                    l(t))
                  : o[e] || n;
              }),
            p,
            t,
          );
        else if (t && "none" !== t && n.plugins.autoloader) {
          var u =
            "md-" +
            new Date().valueOf() +
            "-" +
            Math.floor(1e16 * Math.random());
          (e.attributes.id = u),
            n.plugins.autoloader.loadLanguages(t, function () {
              var e = document.getElementById(u);
              e &&
                (e.innerHTML = n.highlight(e.textContent, n.languages[t], t));
            });
        }
      }
    });
  var r = RegExp(n.languages.markup.tag.pattern.source, "gi"),
    o = { amp: "&", lt: "<", gt: ">", quot: '"' },
    l = String.fromCodePoint || String.fromCharCode;
  n.languages.md = n.languages.markdown;
})(Prism);
Prism.languages.matlab = {
  comment: [/%\{[\s\S]*?\}%/, /%.+/],
  string: { pattern: /\B'(?:''|[^'\r\n])*'/, greedy: !0 },
  number: /(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:[eE][+-]?\d+)?(?:[ij])?|\b[ij]\b/,
  keyword:
    /\b(?:NaN|break|case|catch|continue|else|elseif|end|for|function|if|inf|otherwise|parfor|pause|pi|return|switch|try|while)\b/,
  function: /\b(?!\d)\w+(?=\s*\()/,
  operator: /\.?[*^\/\\']|[+\-:@]|[<>=~]=?|&&?|\|\|?/,
  punctuation: /\.{3}|[.,;\[\](){}!]/,
};
Prism.languages.metafont = {
  comment: { pattern: /%.*/, greedy: !0 },
  string: { pattern: /"[^\r\n"]*"/, greedy: !0 },
  number: /\d*\.?\d+/,
  boolean: /\b(?:false|true)\b/,
  punctuation: [
    /[,;()]/,
    { pattern: /(^|[^{}])(?:\{|\})(?![{}])/, lookbehind: !0 },
    { pattern: /(^|[^[])\[(?!\[)/, lookbehind: !0 },
    { pattern: /(^|[^\]])\](?!\])/, lookbehind: !0 },
  ],
  constant: [
    { pattern: /(^|[^!?])\?\?\?(?![!?])/, lookbehind: !0 },
    { pattern: /(^|[^/*\\])(?:\\|\\\\)(?![/*\\])/, lookbehind: !0 },
    /\b(?:_|blankpicture|bp|cc|cm|dd|ditto|down|eps|epsilon|fullcircle|halfcircle|identity|in|infinity|left|mm|nullpen|nullpicture|origin|pc|penrazor|penspeck|pensquare|penstroke|proof|pt|quartercircle|relax|right|smoke|unitpixel|unitsquare|up)\b/,
  ],
  quantity: {
    pattern:
      /\b(?:autorounding|blacker|boundarychar|charcode|chardp|chardx|chardy|charext|charht|charic|charwd|currentwindow|day|designsize|displaying|fillin|fontmaking|granularity|hppp|join_radius|month|o_correction|pausing|pen_(?:bot|lft|rt|top)|pixels_per_inch|proofing|showstopping|smoothing|time|tolerance|tracingcapsules|tracingchoices|tracingcommands|tracingedges|tracingequations|tracingmacros|tracingonline|tracingoutput|tracingpens|tracingrestores|tracingspecs|tracingstats|tracingtitles|turningcheck|vppp|warningcheck|xoffset|year|yoffset)\b/,
    alias: "keyword",
  },
  command: {
    pattern:
      /\b(?:addto|batchmode|charlist|cull|display|errhelp|errmessage|errorstopmode|everyjob|extensible|fontdimen|headerbyte|inner|interim|let|ligtable|message|newinternal|nonstopmode|numspecial|openwindow|outer|randomseed|save|scrollmode|shipout|show|showdependencies|showstats|showtoken|showvariable|special)\b/,
    alias: "builtin",
  },
  operator: [
    {
      pattern:
        /(^|[^>=<:|])(?:<|<=|=|=:|\|=:|\|=:>|=:\|>|=:\||\|=:\||\|=:\|>|\|=:\|>>|>|>=|:|:=|<>|::|\|\|:)(?![>=<:|])/,
      lookbehind: !0,
    },
    { pattern: /(^|[^+-])(?:\+|\+\+|-{1,3}|\+-\+)(?![+-])/, lookbehind: !0 },
    { pattern: /(^|[^/*\\])(?:\*|\*\*|\/)(?![/*\\])/, lookbehind: !0 },
    { pattern: /(^|[^.])(?:\.{2,3})(?!\.)/, lookbehind: !0 },
    { pattern: /(^|[^@#&$])&(?![@#&$])/, lookbehind: !0 },
    /\b(?:and|not|or)\b/,
  ],
  macro: {
    pattern:
      /\b(?:abs|beginchar|bot|byte|capsule_def|ceiling|change_width|clear_pen_memory|clearit|clearpen|clearxy|counterclockwise|cullit|cutdraw|cutoff|decr|define_blacker_pixels|define_corrected_pixels|define_good_x_pixels|define_good_y_pixels|define_horizontal_corrected_pixels|define_pixels|define_whole_blacker_pixels|define_whole_pixels|define_whole_vertical_blacker_pixels|define_whole_vertical_pixels|dir|direction|directionpoint|div|dotprod|downto|draw|drawdot|endchar|erase|fill|filldraw|fix_units|flex|font_coding_scheme|font_extra_space|font_identifier|font_normal_shrink|font_normal_space|font_normal_stretch|font_quad|font_size|font_slant|font_x_height|gfcorners|gobble|gobbled|good\.(?:bot|lft|rt|top|x|y)|grayfont|hide|hround|imagerules|incr|interact|interpath|intersectionpoint|inverse|italcorr|killtext|labelfont|labels|lft|loggingall|lowres_fix|makegrid|makelabel(?:\.(?:bot|lft|rt|top)(?:\.nodot)?)?|max|min|mod|mode_def|mode_setup|nodisplays|notransforms|numtok|openit|penlabels|penpos|pickup|proofoffset|proofrule|proofrulethickness|range|reflectedabout|rotatedabout|rotatedaround|round|rt|savepen|screenchars|screenrule|screenstrokes|shipit|showit|slantfont|softjoin|solve|stop|superellipse|tensepath|thru|titlefont|top|tracingall|tracingnone|undraw|undrawdot|unfill|unfilldraw|upto|vround)\b/,
    alias: "function",
  },
  builtin:
    /\b(?:ASCII|angle|char|cosd|decimal|directiontime|floor|hex|intersectiontimes|jobname|known|length|makepath|makepen|mexp|mlog|normaldeviate|oct|odd|pencircle|penoffset|point|postcontrol|precontrol|reverse|rotated|sind|sqrt|str|subpath|substring|totalweight|turningnumber|uniformdeviate|unknown|xpart|xxpart|xypart|ypart|yxpart|yypart)\b/,
  keyword:
    /\b(?:also|at|atleast|begingroup|charexists|contour|controls|curl|cycle|def|delimiters|doublepath|dropping|dump|else|elseif|end|enddef|endfor|endgroup|endinput|exitif|exitunless|expandafter|fi|for|forever|forsuffixes|from|if|input|inwindow|keeping|kern|of|primarydef|quote|readstring|scaled|scantokens|secondarydef|shifted|skipto|slanted|step|tension|tertiarydef|to|transformed|until|vardef|withpen|withweight|xscaled|yscaled|zscaled)\b/,
  type: {
    pattern:
      /\b(?:boolean|expr|numeric|pair|path|pen|picture|primary|secondary|string|suffix|tertiary|text|transform)\b/,
    alias: "property",
  },
  variable: {
    pattern:
      /(^|[^@#&$])(?:@#|#@|#|@)(?![@#&$])|\b(?:aspect_ratio|currentpen|currentpicture|currenttransform|d|extra_beginchar|extra_endchar|extra_setup|h|localfont|mag|mode|screen_cols|screen_rows|w|whatever|x|y|z)\b/,
    lookbehind: !0,
  },
};
Prism.languages.nim = {
  comment: { pattern: /#.*/, greedy: !0 },
  string: {
    pattern:
      /(?:\b(?!\d)(?:\w|\\x[89a-fA-F][0-9a-fA-F])+)?(?:"""[\s\S]*?"""(?!")|"(?:\\[\s\S]|""|[^"\\])*")/,
    greedy: !0,
  },
  char: { pattern: /'(?:\\(?:\d+|x[\da-fA-F]{0,2}|.)|[^'])'/, greedy: !0 },
  function: {
    pattern:
      /(?:(?!\d)(?:\w|\\x[89a-fA-F][0-9a-fA-F])+|`[^`\r\n]+`)\*?(?:\[[^\]]+\])?(?=\s*\()/,
    greedy: !0,
    inside: { operator: /\*$/ },
  },
  identifier: {
    pattern: /`[^`\r\n]+`/,
    greedy: !0,
    inside: { punctuation: /`/ },
  },
  number:
    /\b(?:0[xXoObB][\da-fA-F_]+|\d[\d_]*(?:(?!\.\.)\.[\d_]*)?(?:[eE][+-]?\d[\d_]*)?)(?:'?[iuf]\d*)?/,
  keyword:
    /\b(?:addr|as|asm|atomic|bind|block|break|case|cast|concept|const|continue|converter|defer|discard|distinct|do|elif|else|end|enum|except|export|finally|for|from|func|generic|if|import|include|interface|iterator|let|macro|method|mixin|nil|object|out|proc|ptr|raise|ref|return|static|template|try|tuple|type|using|var|when|while|with|without|yield)\b/,
  operator: {
    pattern:
      /(^|[({\[](?=\.\.)|(?![({\[]\.).)(?:(?:[=+\-*\/<>@$~&%|!?^:\\]|\.\.|\.(?![)}\]]))+|\b(?:and|div|in|is|isnot|mod|not|notin|of|or|shl|shr|xor)\b)/m,
    lookbehind: !0,
  },
  punctuation: /[({\[]\.|\.[)}\]]|[`(){}\[\],:]/,
};
(Prism.languages.nix = {
  comment: { pattern: /\/\*[\s\S]*?\*\/|#.*/, greedy: !0 },
  string: {
    pattern: /"(?:[^"\\]|\\[\s\S])*"|''(?:(?!'')[\s\S]|''(?:'|\\|\$\{))*''/,
    greedy: !0,
    inside: {
      interpolation: {
        pattern: /(^|(?:^|(?!'').)[^\\])\$\{(?:[^{}]|\{[^}]*\})*\}/,
        lookbehind: !0,
        inside: null,
      },
    },
  },
  url: [
    /\b(?:[a-z]{3,7}:\/\/)[\w\-+%~\/.:#=?&]+/,
    {
      pattern:
        /([^\/])(?:[\w\-+%~.:#=?&]*(?!\/\/)[\w\-+%~\/.:#=?&])?(?!\/\/)\/[\w\-+%~\/.:#=?&]*/,
      lookbehind: !0,
    },
  ],
  antiquotation: { pattern: /\$(?=\{)/, alias: "important" },
  number: /\b\d+\b/,
  keyword: /\b(?:assert|builtins|else|if|in|inherit|let|null|or|then|with)\b/,
  function:
    /\b(?:abort|add|all|any|attrNames|attrValues|baseNameOf|compareVersions|concatLists|currentSystem|deepSeq|derivation|dirOf|div|elem(?:At)?|fetch(?:Tarball|url)|filter(?:Source)?|fromJSON|genList|getAttr|getEnv|hasAttr|hashString|head|import|intersectAttrs|is(?:Attrs|Bool|Function|Int|List|Null|String)|length|lessThan|listToAttrs|map|mul|parseDrvName|pathExists|read(?:Dir|File)|removeAttrs|replaceStrings|seq|sort|stringLength|sub(?:string)?|tail|throw|to(?:File|JSON|Path|String|XML)|trace|typeOf)\b|\bfoldl'\B/,
  boolean: /\b(?:false|true)\b/,
  operator: /[=!<>]=?|\+\+?|\|\||&&|\/\/|->?|[?@]/,
  punctuation: /[{}()[\].,:;]/,
}),
  (Prism.languages.nix.string.inside.interpolation.inside =
    Prism.languages.nix);
(Prism.languages.python = {
  comment: { pattern: /(^|[^\\])#.*/, lookbehind: !0, greedy: !0 },
  "string-interpolation": {
    pattern:
      /(?:f|fr|rf)(?:("""|''')[\s\S]*?\1|("|')(?:\\.|(?!\2)[^\\\r\n])*\2)/i,
    greedy: !0,
    inside: {
      interpolation: {
        pattern:
          /((?:^|[^{])(?:\{\{)*)\{(?!\{)(?:[^{}]|\{(?!\{)(?:[^{}]|\{(?!\{)(?:[^{}])+\})+\})+\}/,
        lookbehind: !0,
        inside: {
          "format-spec": { pattern: /(:)[^:(){}]+(?=\}$)/, lookbehind: !0 },
          "conversion-option": {
            pattern: /![sra](?=[:}]$)/,
            alias: "punctuation",
          },
          rest: null,
        },
      },
      string: /[\s\S]+/,
    },
  },
  "triple-quoted-string": {
    pattern: /(?:[rub]|br|rb)?("""|''')[\s\S]*?\1/i,
    greedy: !0,
    alias: "string",
  },
  string: {
    pattern: /(?:[rub]|br|rb)?("|')(?:\\.|(?!\1)[^\\\r\n])*\1/i,
    greedy: !0,
  },
  function: {
    pattern: /((?:^|\s)def[ \t]+)[a-zA-Z_]\w*(?=\s*\()/g,
    lookbehind: !0,
  },
  "class-name": { pattern: /(\bclass\s+)\w+/i, lookbehind: !0 },
  decorator: {
    pattern: /(^[\t ]*)@\w+(?:\.\w+)*/m,
    lookbehind: !0,
    alias: ["annotation", "punctuation"],
    inside: { punctuation: /\./ },
  },
  keyword:
    /\b(?:_(?=\s*:)|and|as|assert|async|await|break|case|class|continue|def|del|elif|else|except|exec|finally|for|from|global|if|import|in|is|lambda|match|nonlocal|not|or|pass|print|raise|return|try|while|with|yield)\b/,
  builtin:
    /\b(?:__import__|abs|all|any|apply|ascii|basestring|bin|bool|buffer|bytearray|bytes|callable|chr|classmethod|cmp|coerce|compile|complex|delattr|dict|dir|divmod|enumerate|eval|execfile|file|filter|float|format|frozenset|getattr|globals|hasattr|hash|help|hex|id|input|int|intern|isinstance|issubclass|iter|len|list|locals|long|map|max|memoryview|min|next|object|oct|open|ord|pow|property|range|raw_input|reduce|reload|repr|reversed|round|set|setattr|slice|sorted|staticmethod|str|sum|super|tuple|type|unichr|unicode|vars|xrange|zip)\b/,
  boolean: /\b(?:False|None|True)\b/,
  number:
    /\b0(?:b(?:_?[01])+|o(?:_?[0-7])+|x(?:_?[a-f0-9])+)\b|(?:\b\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\B\.\d+(?:_\d+)*)(?:e[+-]?\d+(?:_\d+)*)?j?(?!\w)/i,
  operator: /[-+%=]=?|!=|:=|\*\*?=?|\/\/?=?|<[<=>]?|>[=>]?|[&|^~]/,
  punctuation: /[{}[\];(),.:]/,
}),
  (Prism.languages.python[
    "string-interpolation"
  ].inside.interpolation.inside.rest = Prism.languages.python),
  (Prism.languages.py = Prism.languages.python);
!(function (t) {
  var n = t.util.clone(t.languages.javascript),
    e = "(?:\\{<S>*\\.{3}(?:[^{}]|<BRACES>)*\\})";
  function a(t, n) {
    return (
      (t = t
        .replace(/<S>/g, function () {
          return "(?:\\s|//.*(?!.)|/\\*(?:[^*]|\\*(?!/))\\*/)";
        })
        .replace(/<BRACES>/g, function () {
          return "(?:\\{(?:\\{(?:\\{[^{}]*\\}|[^{}])*\\}|[^{}])*\\})";
        })
        .replace(/<SPREAD>/g, function () {
          return e;
        })),
      RegExp(t, n)
    );
  }
  (e = a(e).source),
    (t.languages.jsx = t.languages.extend("markup", n)),
    (t.languages.jsx.tag.pattern = a(
      "</?(?:[\\w.:-]+(?:<S>+(?:[\\w.:$-]+(?:=(?:\"(?:\\\\[^]|[^\\\\\"])*\"|'(?:\\\\[^]|[^\\\\'])*'|[^\\s{'\"/>=]+|<BRACES>))?|<SPREAD>))*<S>*/?)?>",
    )),
    (t.languages.jsx.tag.inside.tag.pattern = /^<\/?[^\s>\/]*/),
    (t.languages.jsx.tag.inside["attr-value"].pattern =
      /=(?!\{)(?:"(?:\\[\s\S]|[^\\"])*"|'(?:\\[\s\S]|[^\\'])*'|[^\s'">]+)/),
    (t.languages.jsx.tag.inside.tag.inside["class-name"] =
      /^[A-Z]\w*(?:\.[A-Z]\w*)*$/),
    (t.languages.jsx.tag.inside.comment = n.comment),
    t.languages.insertBefore(
      "inside",
      "attr-name",
      { spread: { pattern: a("<SPREAD>"), inside: t.languages.jsx } },
      t.languages.jsx.tag,
    ),
    t.languages.insertBefore(
      "inside",
      "special-attr",
      {
        script: {
          pattern: a("=<BRACES>"),
          alias: "language-javascript",
          inside: {
            "script-punctuation": { pattern: /^=(?=\{)/, alias: "punctuation" },
            rest: t.languages.jsx,
          },
        },
      },
      t.languages.jsx.tag,
    );
  var s = function (t) {
      return t
        ? "string" == typeof t
          ? t
          : "string" == typeof t.content
          ? t.content
          : t.content.map(s).join("")
        : "";
    },
    g = function (n) {
      for (var e = [], a = 0; a < n.length; a++) {
        var o = n[a],
          i = !1;
        if (
          ("string" != typeof o &&
            ("tag" === o.type && o.content[0] && "tag" === o.content[0].type
              ? "</" === o.content[0].content[0].content
                ? e.length > 0 &&
                  e[e.length - 1].tagName === s(o.content[0].content[1]) &&
                  e.pop()
                : "/>" === o.content[o.content.length - 1].content ||
                  e.push({
                    tagName: s(o.content[0].content[1]),
                    openedBraces: 0,
                  })
              : e.length > 0 && "punctuation" === o.type && "{" === o.content
              ? e[e.length - 1].openedBraces++
              : e.length > 0 &&
                e[e.length - 1].openedBraces > 0 &&
                "punctuation" === o.type &&
                "}" === o.content
              ? e[e.length - 1].openedBraces--
              : (i = !0)),
          (i || "string" == typeof o) &&
            e.length > 0 &&
            0 === e[e.length - 1].openedBraces)
        ) {
          var r = s(o);
          a < n.length - 1 &&
            ("string" == typeof n[a + 1] || "plain-text" === n[a + 1].type) &&
            ((r += s(n[a + 1])), n.splice(a + 1, 1)),
            a > 0 &&
              ("string" == typeof n[a - 1] || "plain-text" === n[a - 1].type) &&
              ((r = s(n[a - 1]) + r), n.splice(a - 1, 1), a--),
            (n[a] = new t.Token("plain-text", r, null, r));
        }
        o.content && "string" != typeof o.content && g(o.content);
      }
    };
  t.hooks.add("after-tokenize", function (t) {
    ("jsx" !== t.language && "tsx" !== t.language) || g(t.tokens);
  });
})(Prism);
!(function (e) {
  (e.languages.typescript = e.languages.extend("javascript", {
    "class-name": {
      pattern:
        /(\b(?:class|extends|implements|instanceof|interface|new|type)\s+)(?!keyof\b)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?:\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>)?/,
      lookbehind: !0,
      greedy: !0,
      inside: null,
    },
    builtin:
      /\b(?:Array|Function|Promise|any|boolean|console|never|number|string|symbol|unknown)\b/,
  })),
    e.languages.typescript.keyword.push(
      /\b(?:abstract|declare|is|keyof|readonly|require)\b/,
      /\b(?:asserts|infer|interface|module|namespace|type)\b(?=\s*(?:[{_$a-zA-Z\xA0-\uFFFF]|$))/,
      /\btype\b(?=\s*(?:[\{*]|$))/,
    ),
    delete e.languages.typescript.parameter,
    delete e.languages.typescript["literal-property"];
  var s = e.languages.extend("typescript", {});
  delete s["class-name"],
    (e.languages.typescript["class-name"].inside = s),
    e.languages.insertBefore("typescript", "function", {
      decorator: {
        pattern: /@[$\w\xA0-\uFFFF]+/,
        inside: {
          at: { pattern: /^@/, alias: "operator" },
          function: /^[\s\S]+/,
        },
      },
      "generic-function": {
        pattern:
          /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>(?=\s*\()/,
        greedy: !0,
        inside: {
          function: /^#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*/,
          generic: { pattern: /<[\s\S]+/, alias: "class-name", inside: s },
        },
      },
    }),
    (e.languages.ts = e.languages.typescript);
})(Prism);
!(function (e) {
  var a = e.util.clone(e.languages.typescript);
  (e.languages.tsx = e.languages.extend("jsx", a)),
    delete e.languages.tsx.parameter,
    delete e.languages.tsx["literal-property"];
  var t = e.languages.tsx.tag;
  (t.pattern = RegExp(
    "(^|[^\\w$]|(?=</))(?:" + t.pattern.source + ")",
    t.pattern.flags,
  )),
    (t.lookbehind = !0);
})(Prism);
!(function (e) {
  for (var a = "/\\*(?:[^*/]|\\*(?!/)|/(?!\\*)|<self>)*\\*/", t = 0; t < 2; t++)
    a = a.replace(/<self>/g, function () {
      return a;
    });
  (a = a.replace(/<self>/g, function () {
    return "[^\\s\\S]";
  })),
    (e.languages.rust = {
      comment: [
        { pattern: RegExp("(^|[^\\\\])" + a), lookbehind: !0, greedy: !0 },
        { pattern: /(^|[^\\:])\/\/.*/, lookbehind: !0, greedy: !0 },
      ],
      string: {
        pattern: /b?"(?:\\[\s\S]|[^\\"])*"|b?r(#*)"(?:[^"]|"(?!\1))*"\1/,
        greedy: !0,
      },
      char: {
        pattern:
          /b?'(?:\\(?:x[0-7][\da-fA-F]|u\{(?:[\da-fA-F]_*){1,6}\}|.)|[^\\\r\n\t'])'/,
        greedy: !0,
      },
      attribute: {
        pattern: /#!?\[(?:[^\[\]"]|"(?:\\[\s\S]|[^\\"])*")*\]/,
        greedy: !0,
        alias: "attr-name",
        inside: { string: null },
      },
      "closure-params": {
        pattern: /([=(,:]\s*|\bmove\s*)\|[^|]*\||\|[^|]*\|(?=\s*(?:\{|->))/,
        lookbehind: !0,
        greedy: !0,
        inside: {
          "closure-punctuation": { pattern: /^\||\|$/, alias: "punctuation" },
          rest: null,
        },
      },
      "lifetime-annotation": { pattern: /'\w+/, alias: "symbol" },
      "fragment-specifier": {
        pattern: /(\$\w+:)[a-z]+/,
        lookbehind: !0,
        alias: "punctuation",
      },
      variable: /\$\w+/,
      "function-definition": {
        pattern: /(\bfn\s+)\w+/,
        lookbehind: !0,
        alias: "function",
      },
      "type-definition": {
        pattern: /(\b(?:enum|struct|trait|type|union)\s+)\w+/,
        lookbehind: !0,
        alias: "class-name",
      },
      "module-declaration": [
        {
          pattern: /(\b(?:crate|mod)\s+)[a-z][a-z_\d]*/,
          lookbehind: !0,
          alias: "namespace",
        },
        {
          pattern:
            /(\b(?:crate|self|super)\s*)::\s*[a-z][a-z_\d]*\b(?:\s*::(?:\s*[a-z][a-z_\d]*\s*::)*)?/,
          lookbehind: !0,
          alias: "namespace",
          inside: { punctuation: /::/ },
        },
      ],
      keyword: [
        /\b(?:Self|abstract|as|async|await|become|box|break|const|continue|crate|do|dyn|else|enum|extern|final|fn|for|if|impl|in|let|loop|macro|match|mod|move|mut|override|priv|pub|ref|return|self|static|struct|super|trait|try|type|typeof|union|unsafe|unsized|use|virtual|where|while|yield)\b/,
        /\b(?:bool|char|f(?:32|64)|[ui](?:8|16|32|64|128|size)|str)\b/,
      ],
      function: /\b[a-z_]\w*(?=\s*(?:::\s*<|\())/,
      macro: { pattern: /\b\w+!/, alias: "property" },
      constant: /\b[A-Z_][A-Z_\d]+\b/,
      "class-name": /\b[A-Z]\w*\b/,
      namespace: {
        pattern: /(?:\b[a-z][a-z_\d]*\s*::\s*)*\b[a-z][a-z_\d]*\s*::(?!\s*<)/,
        inside: { punctuation: /::/ },
      },
      number:
        /\b(?:0x[\dA-Fa-f](?:_?[\dA-Fa-f])*|0o[0-7](?:_?[0-7])*|0b[01](?:_?[01])*|(?:(?:\d(?:_?\d)*)?\.)?\d(?:_?\d)*(?:[Ee][+-]?\d+)?)(?:_?(?:f32|f64|[iu](?:8|16|32|64|size)?))?\b/,
      boolean: /\b(?:false|true)\b/,
      punctuation: /->|\.\.=|\.{1,3}|::|[{}[\];(),:]/,
      operator: /[-+*\/%!^]=?|=[=>]?|&[&=]?|\|[|=]?|<<?=?|>>?=?|[@?]/,
    }),
    (e.languages.rust["closure-params"].inside.rest = e.languages.rust),
    (e.languages.rust.attribute.inside.string = e.languages.rust.string);
})(Prism);
(Prism.languages.scss = Prism.languages.extend("css", {
  comment: { pattern: /(^|[^\\])(?:\/\*[\s\S]*?\*\/|\/\/.*)/, lookbehind: !0 },
  atrule: {
    pattern: /@[\w-](?:\([^()]+\)|[^()\s]|\s+(?!\s))*?(?=\s+[{;])/,
    inside: { rule: /@[\w-]+/ },
  },
  url: /(?:[-a-z]+-)?url(?=\()/i,
  selector: {
    pattern:
      /(?=\S)[^@;{}()]?(?:[^@;{}()\s]|\s+(?!\s)|#\{\$[-\w]+\})+(?=\s*\{(?:\}|\s|[^}][^:{}]*[:{][^}]))/,
    inside: {
      parent: { pattern: /&/, alias: "important" },
      placeholder: /%[-\w]+/,
      variable: /\$[-\w]+|#\{\$[-\w]+\}/,
    },
  },
  property: {
    pattern: /(?:[-\w]|\$[-\w]|#\{\$[-\w]+\})+(?=\s*:)/,
    inside: { variable: /\$[-\w]+|#\{\$[-\w]+\}/ },
  },
})),
  Prism.languages.insertBefore("scss", "atrule", {
    keyword: [
      /@(?:content|debug|each|else(?: if)?|extend|for|forward|function|if|import|include|mixin|return|use|warn|while)\b/i,
      { pattern: /( )(?:from|through)(?= )/, lookbehind: !0 },
    ],
  }),
  Prism.languages.insertBefore("scss", "important", {
    variable: /\$[-\w]+|#\{\$[-\w]+\}/,
  }),
  Prism.languages.insertBefore("scss", "function", {
    "module-modifier": {
      pattern: /\b(?:as|hide|show|with)\b/i,
      alias: "keyword",
    },
    placeholder: { pattern: /%[-\w]+/, alias: "selector" },
    statement: { pattern: /\B!(?:default|optional)\b/i, alias: "keyword" },
    boolean: /\b(?:false|true)\b/,
    null: { pattern: /\bnull\b/, alias: "keyword" },
    operator: {
      pattern: /(\s)(?:[-+*\/%]|[=!]=|<=?|>=?|and|not|or)(?=\s)/,
      lookbehind: !0,
    },
  }),
  (Prism.languages.scss.atrule.inside.rest = Prism.languages.scss);
(Prism.languages.scala = Prism.languages.extend("java", {
  "triple-quoted-string": {
    pattern: /"""[\s\S]*?"""/,
    greedy: !0,
    alias: "string",
  },
  string: { pattern: /("|')(?:\\.|(?!\1)[^\\\r\n])*\1/, greedy: !0 },
  keyword:
    /<-|=>|\b(?:abstract|case|catch|class|def|derives|do|else|enum|extends|extension|final|finally|for|forSome|given|if|implicit|import|infix|inline|lazy|match|new|null|object|opaque|open|override|package|private|protected|return|sealed|self|super|this|throw|trait|transparent|try|type|using|val|var|while|with|yield)\b/,
  number:
    /\b0x(?:[\da-f]*\.)?[\da-f]+|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e\d+)?[dfl]?/i,
  builtin:
    /\b(?:Any|AnyRef|AnyVal|Boolean|Byte|Char|Double|Float|Int|Long|Nothing|Short|String|Unit)\b/,
  symbol: /'[^\d\s\\]\w*/,
})),
  Prism.languages.insertBefore("scala", "triple-quoted-string", {
    "string-interpolation": {
      pattern:
        /\b[a-z]\w*(?:"""(?:[^$]|\$(?:[^{]|\{(?:[^{}]|\{[^{}]*\})*\}))*?"""|"(?:[^$"\r\n]|\$(?:[^{]|\{(?:[^{}]|\{[^{}]*\})*\}))*")/i,
      greedy: !0,
      inside: {
        id: { pattern: /^\w+/, greedy: !0, alias: "function" },
        escape: { pattern: /\\\$"|\$[$"]/, greedy: !0, alias: "symbol" },
        interpolation: {
          pattern: /\$(?:\w+|\{(?:[^{}]|\{[^{}]*\})*\})/,
          greedy: !0,
          inside: {
            punctuation: /^\$\{?|\}$/,
            expression: { pattern: /[\s\S]+/, inside: Prism.languages.scala },
          },
        },
        string: /[\s\S]+/,
      },
    },
  }),
  delete Prism.languages.scala["class-name"],
  delete Prism.languages.scala.function,
  delete Prism.languages.scala.constant;
Prism.languages.sql = {
  comment: {
    pattern: /(^|[^\\])(?:\/\*[\s\S]*?\*\/|(?:--|\/\/|#).*)/,
    lookbehind: !0,
  },
  variable: [
    { pattern: /@(["'`])(?:\\[\s\S]|(?!\1)[^\\])+\1/, greedy: !0 },
    /@[\w.$]+/,
  ],
  string: {
    pattern: /(^|[^@\\])("|')(?:\\[\s\S]|(?!\2)[^\\]|\2\2)*\2/,
    greedy: !0,
    lookbehind: !0,
  },
  identifier: {
    pattern: /(^|[^@\\])`(?:\\[\s\S]|[^`\\]|``)*`/,
    greedy: !0,
    lookbehind: !0,
    inside: { punctuation: /^`|`$/ },
  },
  function:
    /\b(?:AVG|COUNT|FIRST|FORMAT|LAST|LCASE|LEN|MAX|MID|MIN|MOD|NOW|ROUND|SUM|UCASE)(?=\s*\()/i,
  keyword:
    /\b(?:ACTION|ADD|AFTER|ALGORITHM|ALL|ALTER|ANALYZE|ANY|APPLY|AS|ASC|AUTHORIZATION|AUTO_INCREMENT|BACKUP|BDB|BEGIN|BERKELEYDB|BIGINT|BINARY|BIT|BLOB|BOOL|BOOLEAN|BREAK|BROWSE|BTREE|BULK|BY|CALL|CASCADED?|CASE|CHAIN|CHAR(?:ACTER|SET)?|CHECK(?:POINT)?|CLOSE|CLUSTERED|COALESCE|COLLATE|COLUMNS?|COMMENT|COMMIT(?:TED)?|COMPUTE|CONNECT|CONSISTENT|CONSTRAINT|CONTAINS(?:TABLE)?|CONTINUE|CONVERT|CREATE|CROSS|CURRENT(?:_DATE|_TIME|_TIMESTAMP|_USER)?|CURSOR|CYCLE|DATA(?:BASES?)?|DATE(?:TIME)?|DAY|DBCC|DEALLOCATE|DEC|DECIMAL|DECLARE|DEFAULT|DEFINER|DELAYED|DELETE|DELIMITERS?|DENY|DESC|DESCRIBE|DETERMINISTIC|DISABLE|DISCARD|DISK|DISTINCT|DISTINCTROW|DISTRIBUTED|DO|DOUBLE|DROP|DUMMY|DUMP(?:FILE)?|DUPLICATE|ELSE(?:IF)?|ENABLE|ENCLOSED|END|ENGINE|ENUM|ERRLVL|ERRORS|ESCAPED?|EXCEPT|EXEC(?:UTE)?|EXISTS|EXIT|EXPLAIN|EXTENDED|FETCH|FIELDS|FILE|FILLFACTOR|FIRST|FIXED|FLOAT|FOLLOWING|FOR(?: EACH ROW)?|FORCE|FOREIGN|FREETEXT(?:TABLE)?|FROM|FULL|FUNCTION|GEOMETRY(?:COLLECTION)?|GLOBAL|GOTO|GRANT|GROUP|HANDLER|HASH|HAVING|HOLDLOCK|HOUR|IDENTITY(?:COL|_INSERT)?|IF|IGNORE|IMPORT|INDEX|INFILE|INNER|INNODB|INOUT|INSERT|INT|INTEGER|INTERSECT|INTERVAL|INTO|INVOKER|ISOLATION|ITERATE|JOIN|KEYS?|KILL|LANGUAGE|LAST|LEAVE|LEFT|LEVEL|LIMIT|LINENO|LINES|LINESTRING|LOAD|LOCAL|LOCK|LONG(?:BLOB|TEXT)|LOOP|MATCH(?:ED)?|MEDIUM(?:BLOB|INT|TEXT)|MERGE|MIDDLEINT|MINUTE|MODE|MODIFIES|MODIFY|MONTH|MULTI(?:LINESTRING|POINT|POLYGON)|NATIONAL|NATURAL|NCHAR|NEXT|NO|NONCLUSTERED|NULLIF|NUMERIC|OFF?|OFFSETS?|ON|OPEN(?:DATASOURCE|QUERY|ROWSET)?|OPTIMIZE|OPTION(?:ALLY)?|ORDER|OUT(?:ER|FILE)?|OVER|PARTIAL|PARTITION|PERCENT|PIVOT|PLAN|POINT|POLYGON|PRECEDING|PRECISION|PREPARE|PREV|PRIMARY|PRINT|PRIVILEGES|PROC(?:EDURE)?|PUBLIC|PURGE|QUICK|RAISERROR|READS?|REAL|RECONFIGURE|REFERENCES|RELEASE|RENAME|REPEAT(?:ABLE)?|REPLACE|REPLICATION|REQUIRE|RESIGNAL|RESTORE|RESTRICT|RETURN(?:ING|S)?|REVOKE|RIGHT|ROLLBACK|ROUTINE|ROW(?:COUNT|GUIDCOL|S)?|RTREE|RULE|SAVE(?:POINT)?|SCHEMA|SECOND|SELECT|SERIAL(?:IZABLE)?|SESSION(?:_USER)?|SET(?:USER)?|SHARE|SHOW|SHUTDOWN|SIMPLE|SMALLINT|SNAPSHOT|SOME|SONAME|SQL|START(?:ING)?|STATISTICS|STATUS|STRIPED|SYSTEM_USER|TABLES?|TABLESPACE|TEMP(?:ORARY|TABLE)?|TERMINATED|TEXT(?:SIZE)?|THEN|TIME(?:STAMP)?|TINY(?:BLOB|INT|TEXT)|TOP?|TRAN(?:SACTIONS?)?|TRIGGER|TRUNCATE|TSEQUAL|TYPES?|UNBOUNDED|UNCOMMITTED|UNDEFINED|UNION|UNIQUE|UNLOCK|UNPIVOT|UNSIGNED|UPDATE(?:TEXT)?|USAGE|USE|USER|USING|VALUES?|VAR(?:BINARY|CHAR|CHARACTER|YING)|VIEW|WAITFOR|WARNINGS|WHEN|WHERE|WHILE|WITH(?: ROLLUP|IN)?|WORK|WRITE(?:TEXT)?|YEAR)\b/i,
  boolean: /\b(?:FALSE|NULL|TRUE)\b/i,
  number: /\b0x[\da-f]+\b|\b\d+(?:\.\d*)?|\B\.\d+\b/i,
  operator:
    /[-+*\/=%^~]|&&?|\|\|?|!=?|<(?:=>?|<|>)?|>[>=]?|\b(?:AND|BETWEEN|DIV|ILIKE|IN|IS|LIKE|NOT|OR|REGEXP|RLIKE|SOUNDS LIKE|XOR)\b/i,
  punctuation: /[;[\]()`,.]/,
};
!(function (e) {
  function n(e) {
    return e.replace(/__/g, function () {
      return "(?:[\\w-]+|'[^'\n\r]*'|\"(?:\\\\.|[^\\\\\"\r\n])*\")";
    });
  }
  e.languages.toml = {
    comment: { pattern: /#.*/, greedy: !0 },
    table: {
      pattern: RegExp(
        n("(^[\t ]*\\[\\s*(?:\\[\\s*)?)__(?:\\s*\\.\\s*__)*(?=\\s*\\])"),
        "m",
      ),
      lookbehind: !0,
      greedy: !0,
      alias: "class-name",
    },
    key: {
      pattern: RegExp(
        n("(^[\t ]*|[{,]\\s*)__(?:\\s*\\.\\s*__)*(?=\\s*=)"),
        "m",
      ),
      lookbehind: !0,
      greedy: !0,
      alias: "property",
    },
    string: {
      pattern:
        /"""(?:\\[\s\S]|[^\\])*?"""|'''[\s\S]*?'''|'[^'\n\r]*'|"(?:\\.|[^\\"\r\n])*"/,
      greedy: !0,
    },
    date: [
      {
        pattern:
          /\b\d{4}-\d{2}-\d{2}(?:[T\s]\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})?)?\b/i,
        alias: "number",
      },
      { pattern: /\b\d{2}:\d{2}:\d{2}(?:\.\d+)?\b/, alias: "number" },
    ],
    number:
      /(?:\b0(?:x[\da-zA-Z]+(?:_[\da-zA-Z]+)*|o[0-7]+(?:_[0-7]+)*|b[10]+(?:_[10]+)*))\b|[-+]?\b\d+(?:_\d+)*(?:\.\d+(?:_\d+)*)?(?:[eE][+-]?\d+(?:_\d+)*)?\b|[-+]?\b(?:inf|nan)\b/,
    boolean: /\b(?:false|true)\b/,
    punctuation: /[.,=[\]{}]/,
  };
})(Prism);
!(function (e) {
  var n = /[*&][^\s[\]{},]+/,
    r =
      /!(?:<[\w\-%#;/?:@&=+$,.!~*'()[\]]+>|(?:[a-zA-Z\d-]*!)?[\w\-%#;/?:@&=+$.~*'()]+)?/,
    t =
      "(?:" +
      r.source +
      "(?:[ \t]+" +
      n.source +
      ")?|" +
      n.source +
      "(?:[ \t]+" +
      r.source +
      ")?)",
    a =
      "(?:[^\\s\\x00-\\x08\\x0e-\\x1f!\"#%&'*,\\-:>?@[\\]`{|}\\x7f-\\x84\\x86-\\x9f\\ud800-\\udfff\\ufffe\\uffff]|[?:-]<PLAIN>)(?:[ \t]*(?:(?![#:])<PLAIN>|:<PLAIN>))*".replace(
        /<PLAIN>/g,
        function () {
          return "[^\\s\\x00-\\x08\\x0e-\\x1f,[\\]{}\\x7f-\\x84\\x86-\\x9f\\ud800-\\udfff\\ufffe\\uffff]";
        },
      ),
    d = "\"(?:[^\"\\\\\r\n]|\\\\.)*\"|'(?:[^'\\\\\r\n]|\\\\.)*'";
  function o(e, n) {
    n = (n || "").replace(/m/g, "") + "m";
    var r =
      "([:\\-,[{]\\s*(?:\\s<<prop>>[ \t]+)?)(?:<<value>>)(?=[ \t]*(?:$|,|\\]|\\}|(?:[\r\n]\\s*)?#))"
        .replace(/<<prop>>/g, function () {
          return t;
        })
        .replace(/<<value>>/g, function () {
          return e;
        });
    return RegExp(r, n);
  }
  (e.languages.yaml = {
    scalar: {
      pattern: RegExp(
        "([\\-:]\\s*(?:\\s<<prop>>[ \t]+)?[|>])[ \t]*(?:((?:\r?\n|\r)[ \t]+)\\S[^\r\n]*(?:\\2[^\r\n]+)*)".replace(
          /<<prop>>/g,
          function () {
            return t;
          },
        ),
      ),
      lookbehind: !0,
      alias: "string",
    },
    comment: /#.*/,
    key: {
      pattern: RegExp(
        "((?:^|[:\\-,[{\r\n?])[ \t]*(?:<<prop>>[ \t]+)?)<<key>>(?=\\s*:\\s)"
          .replace(/<<prop>>/g, function () {
            return t;
          })
          .replace(/<<key>>/g, function () {
            return "(?:" + a + "|" + d + ")";
          }),
      ),
      lookbehind: !0,
      greedy: !0,
      alias: "atrule",
    },
    directive: { pattern: /(^[ \t]*)%.+/m, lookbehind: !0, alias: "important" },
    datetime: {
      pattern: o(
        "\\d{4}-\\d\\d?-\\d\\d?(?:[tT]|[ \t]+)\\d\\d?:\\d{2}:\\d{2}(?:\\.\\d*)?(?:[ \t]*(?:Z|[-+]\\d\\d?(?::\\d{2})?))?|\\d{4}-\\d{2}-\\d{2}|\\d\\d?:\\d{2}(?::\\d{2}(?:\\.\\d*)?)?",
      ),
      lookbehind: !0,
      alias: "number",
    },
    boolean: {
      pattern: o("false|true", "i"),
      lookbehind: !0,
      alias: "important",
    },
    null: { pattern: o("null|~", "i"), lookbehind: !0, alias: "important" },
    string: { pattern: o(d), lookbehind: !0, greedy: !0 },
    number: {
      pattern: o(
        "[+-]?(?:0x[\\da-f]+|0o[0-7]+|(?:\\d+(?:\\.\\d*)?|\\.\\d+)(?:e[+-]?\\d+)?|\\.inf|\\.nan)",
        "i",
      ),
      lookbehind: !0,
    },
    tag: r,
    important: n,
    punctuation: /---|[:[\]{}\-,|>?]|\.\.\./,
  }),
    (e.languages.yml = e.languages.yaml);
})(Prism);
!(function (e) {
  function n(e) {
    return function () {
      return e;
    };
  }
  var r =
      /\b(?:align|allowzero|and|anyframe|anytype|asm|async|await|break|cancel|catch|comptime|const|continue|defer|else|enum|errdefer|error|export|extern|fn|for|if|inline|linksection|nakedcc|noalias|nosuspend|null|or|orelse|packed|promise|pub|resume|return|stdcallcc|struct|suspend|switch|test|threadlocal|try|undefined|union|unreachable|usingnamespace|var|volatile|while)\b/,
    a = "\\b(?!" + r.source + ")(?!\\d)\\w+\\b",
    o = "align\\s*\\((?:[^()]|\\([^()]*\\))*\\)",
    s =
      "(?!\\s)(?:!?\\s*(?:" +
      "(?:\\?|\\bpromise->|(?:\\[[^[\\]]*\\]|\\*(?!\\*)|\\*\\*)(?:\\s*<ALIGN>|\\s*const\\b|\\s*volatile\\b|\\s*allowzero\\b)*)".replace(
        /<ALIGN>/g,
        n(o),
      ) +
      "\\s*)*" +
      "(?:\\bpromise\\b|(?:\\berror\\.)?<ID>(?:\\.<ID>)*(?!\\s+<ID>))".replace(
        /<ID>/g,
        n(a),
      ) +
      ")+";
  (e.languages.zig = {
    comment: [{ pattern: /\/\/[/!].*/, alias: "doc-comment" }, /\/{2}.*/],
    string: [
      {
        pattern: /(^|[^\\@])c?"(?:[^"\\\r\n]|\\.)*"/,
        lookbehind: !0,
        greedy: !0,
      },
      {
        pattern: /([\r\n])([ \t]+c?\\{2}).*(?:(?:\r\n?|\n)\2.*)*/,
        lookbehind: !0,
        greedy: !0,
      },
    ],
    char: {
      pattern:
        /(^|[^\\])'(?:[^'\\\r\n]|[\uD800-\uDFFF]{2}|\\(?:.|x[a-fA-F\d]{2}|u\{[a-fA-F\d]{1,6}\}))'/,
      lookbehind: !0,
      greedy: !0,
    },
    builtin: /\B@(?!\d)\w+(?=\s*\()/,
    label: {
      pattern:
        /(\b(?:break|continue)\s*:\s*)\w+\b|\b(?!\d)\w+\b(?=\s*:\s*(?:\{|while\b))/,
      lookbehind: !0,
    },
    "class-name": [
      /\b(?!\d)\w+(?=\s*=\s*(?:(?:extern|packed)\s+)?(?:enum|struct|union)\s*[({])/,
      {
        pattern: RegExp(
          "(:\\s*)<TYPE>(?=\\s*(?:<ALIGN>\\s*)?[=;,)])|<TYPE>(?=\\s*(?:<ALIGN>\\s*)?\\{)"
            .replace(/<TYPE>/g, n(s))
            .replace(/<ALIGN>/g, n(o)),
        ),
        lookbehind: !0,
        inside: null,
      },
      {
        pattern: RegExp(
          "(\\)\\s*)<TYPE>(?=\\s*(?:<ALIGN>\\s*)?;)"
            .replace(/<TYPE>/g, n(s))
            .replace(/<ALIGN>/g, n(o)),
        ),
        lookbehind: !0,
        inside: null,
      },
    ],
    "builtin-type": {
      pattern:
        /\b(?:anyerror|bool|c_u?(?:int|long|longlong|short)|c_longdouble|c_void|comptime_(?:float|int)|f(?:16|32|64|128)|[iu](?:8|16|32|64|128|size)|noreturn|type|void)\b/,
      alias: "keyword",
    },
    keyword: r,
    function: /\b(?!\d)\w+(?=\s*\()/,
    number:
      /\b(?:0b[01]+|0o[0-7]+|0x[a-fA-F\d]+(?:\.[a-fA-F\d]*)?(?:[pP][+-]?[a-fA-F\d]+)?|\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)\b/,
    boolean: /\b(?:false|true)\b/,
    operator:
      /\.[*?]|\.{2,3}|[-=]>|\*\*|\+\+|\|\||(?:<<|>>|[-+*]%|[-+*/%^&|<>!=])=?|[?~]/,
    punctuation: /[.:,;(){}[\]]/,
  }),
    e.languages.zig["class-name"].forEach(function (n) {
      null === n.inside && (n.inside = e.languages.zig);
    });
})(Prism);
!(function () {
  if ("undefined" != typeof Prism && "undefined" != typeof document) {
    var e = "line-numbers",
      n = /\n(?!$)/g,
      t = (Prism.plugins.lineNumbers = {
        getLine: function (n, t) {
          if ("PRE" === n.tagName && n.classList.contains(e)) {
            var i = n.querySelector(".line-numbers-rows");
            if (i) {
              var r = parseInt(n.getAttribute("data-start"), 10) || 1,
                s = r + (i.children.length - 1);
              t < r && (t = r), t > s && (t = s);
              var l = t - r;
              return i.children[l];
            }
          }
        },
        resize: function (e) {
          r([e]);
        },
        assumeViewportIndependence: !0,
      }),
      i = void 0;
    window.addEventListener("resize", function () {
      (t.assumeViewportIndependence && i === window.innerWidth) ||
        ((i = window.innerWidth),
        r(
          Array.prototype.slice.call(
            document.querySelectorAll("pre.line-numbers"),
          ),
        ));
    }),
      Prism.hooks.add("complete", function (t) {
        if (t.code) {
          var i = t.element,
            s = i.parentNode;
          if (
            s &&
            /pre/i.test(s.nodeName) &&
            !i.querySelector(".line-numbers-rows") &&
            Prism.util.isActive(i, e)
          ) {
            i.classList.remove(e), s.classList.add(e);
            var l,
              o = t.code.match(n),
              a = o ? o.length + 1 : 1,
              u = new Array(a + 1).join("<span></span>");
            (l = document.createElement("span")).setAttribute(
              "aria-hidden",
              "true",
            ),
              (l.className = "line-numbers-rows"),
              (l.innerHTML = u),
              s.hasAttribute("data-start") &&
                (s.style.counterReset =
                  "linenumber " +
                  (parseInt(s.getAttribute("data-start"), 10) - 1)),
              t.element.appendChild(l),
              r([s]),
              Prism.hooks.run("line-numbers", t);
          }
        }
      }),
      Prism.hooks.add("line-numbers", function (e) {
        (e.plugins = e.plugins || {}), (e.plugins.lineNumbers = !0);
      });
  }
  function r(e) {
    if (
      0 !=
      (e = e.filter(function (e) {
        var n,
          t = ((n = e),
          n
            ? window.getComputedStyle
              ? getComputedStyle(n)
              : n.currentStyle || null
            : null)["white-space"];
        return "pre-wrap" === t || "pre-line" === t;
      })).length
    ) {
      var t = e
        .map(function (e) {
          var t = e.querySelector("code"),
            i = e.querySelector(".line-numbers-rows");
          if (t && i) {
            var r = e.querySelector(".line-numbers-sizer"),
              s = t.textContent.split(n);
            r ||
              (((r = document.createElement("span")).className =
                "line-numbers-sizer"),
              t.appendChild(r)),
              (r.innerHTML = "0"),
              (r.style.display = "block");
            var l = r.getBoundingClientRect().height;
            return (
              (r.innerHTML = ""),
              {
                element: e,
                lines: s,
                lineHeights: [],
                oneLinerHeight: l,
                sizer: r,
              }
            );
          }
        })
        .filter(Boolean);
      t.forEach(function (e) {
        var n = e.sizer,
          t = e.lines,
          i = e.lineHeights,
          r = e.oneLinerHeight;
        (i[t.length - 1] = void 0),
          t.forEach(function (e, t) {
            if (e && e.length > 1) {
              var s = n.appendChild(document.createElement("span"));
              (s.style.display = "block"), (s.textContent = e);
            } else i[t] = r;
          });
      }),
        t.forEach(function (e) {
          for (
            var n = e.sizer, t = e.lineHeights, i = 0, r = 0;
            r < t.length;
            r++
          )
            void 0 === t[r] &&
              (t[r] = n.children[i++].getBoundingClientRect().height);
        }),
        t.forEach(function (e) {
          var n = e.sizer,
            t = e.element.querySelector(".line-numbers-rows");
          (n.style.display = "none"),
            (n.innerHTML = ""),
            e.lineHeights.forEach(function (e, n) {
              t.children[n].style.height = e + "px";
            });
        });
    }
  }
})();
