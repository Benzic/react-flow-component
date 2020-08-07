"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var _react = _interopRequireWildcard(require("react"));

var _reactDom = require("react-dom");

var _lib = require("./lib");

require("./index.css");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var treeData = [{
  title: '检测集中性分析',
  key: '0-0',
  children: [{
    title: '分析子项A01',
    key: '0-0-1',
    type: 1
  }, {
    title: '分析子项A02',
    key: '0-0-2',
    type: 1
  }, {
    title: '分析子项A03',
    key: '0-0-3',
    type: 2
  }, {
    title: '分析子项A04',
    key: '0-0-4',
    type: 2
  }]
}, {
  title: 'Map分析',
  key: '0-1',
  children: [{
    title: '分析子项B01',
    key: '0-1-1',
    type: 1
  }, {
    title: '分析子项B02',
    key: '0-1-2',
    type: 1
  }, {
    title: '分析子项B03',
    key: '0-1-3',
    type: 2
  }, {
    title: '分析子项B04',
    key: '0-1-4',
    type: 2
  }]
}, {
  title: '工艺路径分析',
  key: '0-2',
  children: [{
    title: '分析子项C01',
    key: '0-2-1',
    type: 1
  }, {
    title: '分析子项C02',
    key: '0-2-2',
    type: 1
  }, {
    title: '分析子项C03',
    key: '0-2-3',
    type: 2
  }, {
    title: '分析子项C04',
    key: '0-2-4',
    type: 2
  }]
}, {
  title: '工艺履历分析',
  key: '0-3',
  children: [{
    title: '分析子项D01',
    key: '0-3-1',
    type: 1
  }, {
    title: '分析子项D02',
    key: '0-3-2',
    type: 1
  }, {
    title: '分析子项D03',
    key: '0-3-3',
    type: 2
  }, {
    title: '分析子项D04',
    key: '0-3-4',
    type: 2
  }]
}, {
  title: '过程品质分析',
  key: '0-4',
  children: [{
    title: '分析子项E01',
    key: '0-4-1',
    type: 1
  }, {
    title: '分析子项E02',
    key: '0-4-2',
    type: 1
  }, {
    title: '分析子项E03',
    key: '0-4-3',
    type: 2
  }, {
    title: '分析子项E04',
    key: '0-4-4',
    type: 2
  }]
}, {
  title: '工艺参数分析',
  key: '0-5',
  children: [{
    title: '分析子项F01',
    key: '0-5-1',
    type: 1
  }, {
    title: '分析子项F02',
    key: '0-5-2',
    type: 1
  }, {
    title: '分析子项F03',
    key: '0-5-3',
    type: 2
  }, {
    title: '分析子项F04',
    key: '0-5-4',
    type: 2
  }]
}, {
  title: '工艺原料分析',
  key: '0-6',
  children: [{
    title: '分析子项G01',
    key: '0-6-1',
    type: 1
  }, {
    title: '分析子项G02',
    key: '0-6-2',
    type: 1
  }, {
    title: '分析子项G03',
    key: '0-6-3',
    type: 2
  }, {
    title: '分析子项G04',
    key: '0-6-4',
    type: 2
  }]
}];

var App = function App() {
  var _useState = (0, _react.useState)([]),
      _useState2 = _slicedToArray(_useState, 2),
      selectedKeys = _useState2[0],
      setSelectedKeys = _useState2[1];

  var _useState3 = (0, _react.useState)(0),
      _useState4 = _slicedToArray(_useState3, 2),
      zIndex = _useState4[0],
      setZindex = _useState4[1];

  var _useState5 = (0, _react.useState)(null),
      _useState6 = _slicedToArray(_useState5, 2),
      currentKey = _useState6[0],
      setCurrentKey = _useState6[1];

  var _useState7 = (0, _react.useState)([]),
      _useState8 = _slicedToArray(_useState7, 2),
      showKeys = _useState8[0],
      setShowKeys = _useState8[1];

  var _useState9 = (0, _react.useState)(null),
      _useState10 = _slicedToArray(_useState9, 2),
      editKey = _useState10[0],
      setEditKey = _useState10[1];

  var dragBox = (0, _react.useRef)(null);

  window.ondragstart = function (event) {
    console.log(event);
    setZindex(100);
    var evt = event || window.event;
    setCurrentKey({
      x: evt.clientX - evt.target.offsetLeft,
      y: evt.clientY - evt.target.offsetTop,
      title: evt.target.dataset.title,
      key: evt.target.dataset.key
    });
  };

  window.ondragover = function (event) {
    event.preventDefault();
  };

  window.ondragenter = function (event) {
    event.preventDefault();
  };

  window.ondrop = function (event) {
    var evt = event || window.event;
    var offset_x = currentKey.x,
        offset_y = currentKey.y; //偏移

    evt.preventDefault();
    setZindex(0);

    if (!JSON.stringify(selectedKeys).includes('"key":"' + currentKey.key + '"')) {
      setSelectedKeys([].concat(_toConsumableArray(selectedKeys), [{
        title: currentKey.title,
        key: currentKey.key,
        x: evt.clientX - offset_x + 50 - 200,
        y: evt.clientY - offset_y + 15,
        active: false,
        to: []
      }]));
    }
  };

  return /*#__PURE__*/_react.default.createElement("div", {
    style: {
      width: "100%",
      height: "100%",
      display: "flex"
    }
  }, /*#__PURE__*/_react.default.createElement("div", {
    style: {
      width: "100%",
      height: "100%",
      position: "absolute",
      left: 0,
      top: 0,
      zIndex: zIndex
    }
  }, treeData.map(function (item, index) {
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "list_sub ".concat(showKeys.includes(index) ? 'list_sub_active' : ''),
      ref: dragBox,
      key: item.key
    }, /*#__PURE__*/_react.default.createElement("div", {
      draggable: true,
      className: "list_title",
      onClick: function onClick() {
        if (showKeys.indexOf(index) !== -1) {
          showKeys.splice(showKeys.indexOf(index), 1);
          setShowKeys(showKeys);
        } else {
          setShowKeys([].concat(_toConsumableArray(showKeys), [index]));
        }
      },
      key: item.key,
      "data-title": item.title,
      "data-key": item.key
    }, item.title), item.children.map(function (itx) {
      return /*#__PURE__*/_react.default.createElement("div", {
        draggable: true,
        className: "list_child",
        key: itx.key,
        "data-title": itx.title,
        "data-key": itx.key
      }, itx.title);
    }));
  })), /*#__PURE__*/_react.default.createElement("div", {
    style: {
      marginLeft: "200px",
      width: "calc(100% - 200px)",
      height: "100%",
      position: "relative",
      zIndex: "10",
      background: "#ddd"
    }
  }, /*#__PURE__*/_react.default.createElement(_lib.MultipleFlow, {
    selectedKeys: selectedKeys
  })));
};

(0, _reactDom.render)( /*#__PURE__*/_react.default.createElement(App, null), document.getElementById("root"));