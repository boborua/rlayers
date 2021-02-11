"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var ol_1 = require("ol");
var ol_2 = require("ol");
var extent_1 = require("ol/extent");
var context_1 = require("./context");
var REvent_1 = require("./REvent");
var debug_1 = __importDefault(require("./debug"));
var RFeature = (function (_super) {
    __extends(RFeature, _super);
    function RFeature(props, context) {
        var _a;
        var _this = _super.call(this, props, context) || this;
        if (!_this.context || !_this.context.layer)
            throw new Error('An RFeature must be part of a vector layer');
        if (props.feature)
            _this.ol = props.feature;
        else
            _this.ol = new ol_2.Feature(__assign(__assign({}, ((_a = props.properties) !== null && _a !== void 0 ? _a : {})), { geometry: props.geometry, style: props.style }));
        RFeature.initEventRelay(_this.context.map);
        _this.onchange = function () { return _this.forceUpdate(); };
        return _this;
    }
    RFeature.initEventRelay = function (map) {
        var e_1, _a;
        try {
            for (var _b = __values(RFeature.pointerEvents), _c = _b.next(); !_c.done; _c = _b.next()) {
                var ev = _c.value;
                map.on(ev, RFeature.eventRelay);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    RFeature.eventRelay = function (e) {
        var feature = e.map.forEachFeatureAtPixel(e.pixel, function (f) { return f.dispatchEvent && f; }, {
            hitTolerance: RFeature.hitTolerance
        });
        if (e.dragging) {
            if (!RFeature.lastFeatureDragged)
                RFeature.lastFeatureDragged = feature;
            feature = RFeature.lastFeatureDragged;
        }
        else {
            if (RFeature.lastFeatureDragged)
                RFeature.lastFeatureDragged.dispatchEvent(new ol_1.MapBrowserEvent('pointerdragend', e.map, e.originalEvent));
            RFeature.lastFeatureDragged = undefined;
        }
        if (e.type === 'pointermove') {
            if (RFeature.lastFeatureEntered !== feature) {
                if (RFeature.lastFeatureEntered)
                    RFeature.lastFeatureEntered.dispatchEvent(new ol_1.MapBrowserEvent('pointerleave', e.map, e.originalEvent));
                RFeature.lastFeatureEntered = feature;
                if (feature)
                    feature.dispatchEvent(new ol_1.MapBrowserEvent('pointerenter', e.map, e.originalEvent));
            }
        }
        if (feature) {
            return feature.dispatchEvent(new ol_1.MapBrowserEvent(e.type, e.map, e.originalEvent));
        }
        return true;
    };
    RFeature.prototype.refresh = function () {
        _super.prototype.refresh.call(this);
        if (this.props.properties && this.props.properties !== this.ol.getProperties())
            this.ol.setProperties(this.props.properties);
        if (this.props.geometry && this.props.geometry !== this.ol.getGeometry())
            this.ol.setGeometry(this.props.geometry);
        if (this.props.style && this.props.style !== this.ol.getStyle())
            this.ol.setStyle(this.props.style);
    };
    RFeature.prototype.componentDidMount = function () {
        debug_1.default('didMount', this.ol);
        _super.prototype.componentDidMount.call(this);
        this.ol.on('change', this.onchange);
        this.context.source.addFeature(this.ol);
    };
    RFeature.prototype.componentWillUnmount = function () {
        _super.prototype.componentWillUnmount.call(this);
        this.ol.un('change', this.onchange);
        this.context.source.removeFeature(this.ol);
    };
    RFeature.prototype.render = function () {
        var _a, _b;
        var extent = (_b = (_a = this.ol) === null || _a === void 0 ? void 0 : _a.getGeometry()) === null || _b === void 0 ? void 0 : _b.getExtent();
        var center = extent && extent_1.getCenter(extent);
        return (react_1.default.createElement(context_1.RLocationContext.Provider, { value: {
                map: this.context.map,
                layer: this.context.layer,
                feature: this.ol,
                location: center
            } }, this.props.children));
    };
    RFeature.pointerEvents = ['click', 'pointerdrag', 'pointermove', 'singleclick', 'dblclick'];
    RFeature.contextType = context_1.RVectorContext;
    RFeature.hitTolerance = 10;
    return RFeature;
}(REvent_1.ReactLayersBase));
exports.default = RFeature;
//# sourceMappingURL=RFeature.js.map