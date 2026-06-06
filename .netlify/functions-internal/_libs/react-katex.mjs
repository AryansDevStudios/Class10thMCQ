import { b as requireReact } from "./react.mjs";
import { r as requirePropTypes } from "./prop-types.mjs";
import { r as requireKatex } from "./katex.mjs";
var reactKatex$1 = { exports: {} };
var reactKatex = reactKatex$1.exports;
var hasRequiredReactKatex;
function requireReactKatex() {
  if (hasRequiredReactKatex) return reactKatex$1.exports;
  hasRequiredReactKatex = 1;
  (function (module, exports) {
    (function (global, factory) {
      factory(exports, requireReact(), /* @__PURE__ */ requirePropTypes(), requireKatex());
    })(reactKatex, function (exports2, _react, _propTypes, _katex) {
      Object.defineProperty(exports2, "__esModule", {
        value: true,
      });
      function _export(target, all) {
        for (var name in all)
          Object.defineProperty(target, name, {
            enumerable: true,
            get: all[name],
          });
      }
      _export(exports2, {
        BlockMath: () => BlockMath,
        InlineMath: () => InlineMath,
      });
      _react = /* @__PURE__ */ _interopRequireWildcard(_react);
      _propTypes = /* @__PURE__ */ _interopRequireDefault(_propTypes);
      _katex = /* @__PURE__ */ _interopRequireDefault(_katex);
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule
          ? obj
          : {
              default: obj,
            };
      }
      function _getRequireWildcardCache(nodeInterop) {
        if (typeof WeakMap !== "function") return null;
        var cacheBabelInterop = /* @__PURE__ */ new WeakMap();
        var cacheNodeInterop = /* @__PURE__ */ new WeakMap();
        return (_getRequireWildcardCache = function (nodeInterop2) {
          return nodeInterop2 ? cacheNodeInterop : cacheBabelInterop;
        })(nodeInterop);
      }
      function _interopRequireWildcard(obj, nodeInterop) {
        if (obj && obj.__esModule) {
          return obj;
        }
        if (obj === null || (typeof obj !== "object" && typeof obj !== "function")) {
          return {
            default: obj,
          };
        }
        var cache = _getRequireWildcardCache(nodeInterop);
        if (cache && cache.has(obj)) {
          return cache.get(obj);
        }
        var newObj = {};
        var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
        for (var key in obj) {
          if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
              Object.defineProperty(newObj, key, desc);
            } else {
              newObj[key] = obj[key];
            }
          }
        }
        newObj.default = obj;
        if (cache) {
          cache.set(obj, newObj);
        }
        return newObj;
      }
      const createMathComponent = (Component, { displayMode }) => {
        const MathComponent = ({ children, errorColor, math, renderError }) => {
          const formula = math !== null && math !== void 0 ? math : children;
          const { html, error } = (0, _react.useMemo)(() => {
            try {
              const html2 = _katex.default.renderToString(formula, {
                displayMode,
                errorColor,
                throwOnError: !!renderError,
              });
              return {
                html: html2,
                error: void 0,
              };
            } catch (error2) {
              if (error2 instanceof _katex.default.ParseError || error2 instanceof TypeError) {
                return {
                  error: error2,
                };
              }
              throw error2;
            }
          }, [formula, errorColor, renderError]);
          if (error) {
            return renderError
              ? renderError(error)
              : /* @__PURE__ */ _react.default.createElement(Component, {
                  html: `${error.message}`,
                });
          }
          return /* @__PURE__ */ _react.default.createElement(Component, {
            html,
          });
        };
        MathComponent.propTypes = {
          children: _propTypes.default.string,
          errorColor: _propTypes.default.string,
          math: _propTypes.default.string,
          renderError: _propTypes.default.func,
        };
        return MathComponent;
      };
      const InternalPathComponentPropTypes = {
        html: _propTypes.default.string.isRequired,
      };
      const InternalBlockMath = ({ html }) => {
        return /* @__PURE__ */ _react.default.createElement("div", {
          "data-testid": "react-katex",
          dangerouslySetInnerHTML: {
            __html: html,
          },
        });
      };
      InternalBlockMath.propTypes = InternalPathComponentPropTypes;
      const InternalInlineMath = ({ html }) => {
        return /* @__PURE__ */ _react.default.createElement("span", {
          "data-testid": "react-katex",
          dangerouslySetInnerHTML: {
            __html: html,
          },
        });
      };
      InternalInlineMath.propTypes = InternalPathComponentPropTypes;
      const BlockMath = createMathComponent(InternalBlockMath, {
        displayMode: true,
      });
      const InlineMath = createMathComponent(InternalInlineMath, {
        displayMode: false,
      });
    });
  })(reactKatex$1, reactKatex$1.exports);
  return reactKatex$1.exports;
}
var reactKatexExports = requireReactKatex();
export { reactKatexExports as r };
