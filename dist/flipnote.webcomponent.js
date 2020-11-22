/*!!
 flipnote.js v5.0.0 (webcomponent build)
 Javascript parsing and in-browser playback for the .PPM and .KWZ animation formats used by Flipnote Studio and Flipnote Studio 3D.
 Flipnote Studio is (c) Nintendo Co., Ltd. This project isn't endorsed by them in any way.
 2018 - 2021 James Daniel
 github.com/jaames/flipnote.js
 Keep on Flipnoting!
*/

(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = global || self, factory(global.flipnote = {}));
}(this, (function (exports) { 'use strict';

    function noop() { }
    function is_promise(value) {
        return value && typeof value === 'object' && typeof value.then === 'function';
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_custom_element_data(node, prop, value) {
        if (prop in node) {
            node[prop] = value;
        }
        else {
            attr(node, prop, value);
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error(`Function called outside component initialization`);
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    function handle_promise(promise, info) {
        const token = info.token = {};
        function update(type, index, key, value) {
            if (info.token !== token)
                return;
            info.resolved = value;
            let child_ctx = info.ctx;
            if (key !== undefined) {
                child_ctx = child_ctx.slice();
                child_ctx[key] = value;
            }
            const block = type && (info.current = type)(child_ctx);
            let needs_flush = false;
            if (info.block) {
                if (info.blocks) {
                    info.blocks.forEach((block, i) => {
                        if (i !== index && block) {
                            group_outros();
                            transition_out(block, 1, 1, () => {
                                info.blocks[i] = null;
                            });
                            check_outros();
                        }
                    });
                }
                else {
                    info.block.d(1);
                }
                block.c();
                transition_in(block, 1);
                block.m(info.mount(), info.anchor);
                needs_flush = true;
            }
            info.block = block;
            if (info.blocks)
                info.blocks[index] = block;
            if (needs_flush) {
                flush();
            }
        }
        if (is_promise(promise)) {
            const current_component = get_current_component();
            promise.then(value => {
                set_current_component(current_component);
                update(info.then, 1, info.value, value);
                set_current_component(null);
            }, error => {
                set_current_component(current_component);
                update(info.catch, 2, info.error, error);
                set_current_component(null);
            });
            // if we previously had a then/catch block, destroy it
            if (info.current !== info.pending) {
                update(info.pending, 0);
                return true;
            }
        }
        else {
            if (info.current !== info.then) {
                update(info.then, 1, info.value, promise);
                return true;
            }
            info.resolved = promise;
        }
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if ($$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    let SvelteElement;
    if (typeof HTMLElement === 'function') {
        SvelteElement = class extends HTMLElement {
            constructor() {
                super();
                this.attachShadow({ mode: 'open' });
            }
            connectedCallback() {
                // @ts-ignore todo: improve typings
                for (const key in this.$$.slotted) {
                    // @ts-ignore todo: improve typings
                    this.appendChild(this.$$.slotted[key]);
                }
            }
            attributeChangedCallback(attr, _oldValue, newValue) {
                this[attr] = newValue;
            }
            $destroy() {
                destroy_component(this, 1);
                this.$destroy = noop;
            }
            $on(type, callback) {
                // TODO should this delegate to addEventListener?
                const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
                callbacks.push(callback);
                return () => {
                    const index = callbacks.indexOf(callback);
                    if (index !== -1)
                        callbacks.splice(index, 1);
                };
            }
            $set() {
                // overridden by instance, if it has props
            }
        };
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.24.0' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev("SvelteDOMSetData", { node: text, data });
        text.data = data;
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    /** @internal */
    var ByteArray = /** @class */ (function () {
        function ByteArray() {
            this.pageSize = ByteArray.pageSize;
            this.currPageIndex = -1;
            this.pages = [];
            this.cursor = 0;
            this.newPage();
        }
        ByteArray.prototype.newPage = function () {
            this.pages[++this.currPageIndex] = new Uint8Array(this.pageSize);
            this.currPage = this.pages[this.currPageIndex];
            this.cursor = 0;
        };
        ByteArray.prototype.getData = function () {
            var data = new Uint8Array(this.currPageIndex * this.pageSize + this.cursor);
            for (var index = 0; index < this.pages.length; index++) {
                var page = this.pages[index];
                if (index === this.currPageIndex)
                    data.set(page.slice(0, this.cursor), index * this.pageSize);
                else
                    data.set(page, index * this.pageSize);
            }
            return data;
        };
        ByteArray.prototype.getBuffer = function () {
            var data = this.getData();
            return data.buffer;
        };
        ByteArray.prototype.writeByte = function (val) {
            if (this.cursor >= this.pageSize)
                this.newPage();
            this.currPage[this.cursor++] = val;
        };
        ByteArray.prototype.writeBytes = function (bytes, offset, length) {
            for (var l = length || bytes.length, i = offset || 0; i < l; i++)
                this.writeByte(bytes[i]);
        };
        ByteArray.pageSize = 4096 * 4;
        return ByteArray;
    }());

    /** @internal */
    var DataStream = /** @class */ (function () {
        function DataStream(arrayBuffer) {
            this.buffer = arrayBuffer;
            this.data = new DataView(arrayBuffer);
            this.cursor = 0;
        }
        Object.defineProperty(DataStream.prototype, "bytes", {
            get: function () {
                return new Uint8Array(this.buffer);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DataStream.prototype, "byteLength", {
            get: function () {
                return this.data.byteLength;
            },
            enumerable: false,
            configurable: true
        });
        DataStream.prototype.seek = function (offset, whence) {
            switch (whence) {
                case 2 /* End */:
                    this.cursor = this.data.byteLength + offset;
                    break;
                case 1 /* Current */:
                    this.cursor += offset;
                    break;
                case 0 /* Begin */:
                default:
                    this.cursor = offset;
                    break;
            }
        };
        DataStream.prototype.readUint8 = function () {
            var val = this.data.getUint8(this.cursor);
            this.cursor += 1;
            return val;
        };
        DataStream.prototype.writeUint8 = function (value) {
            this.data.setUint8(this.cursor, value);
            this.cursor += 1;
        };
        DataStream.prototype.readInt8 = function () {
            var val = this.data.getInt8(this.cursor);
            this.cursor += 1;
            return val;
        };
        DataStream.prototype.writeInt8 = function (value) {
            this.data.setInt8(this.cursor, value);
            this.cursor += 1;
        };
        DataStream.prototype.readUint16 = function (littleEndian) {
            if (littleEndian === void 0) { littleEndian = true; }
            var val = this.data.getUint16(this.cursor, littleEndian);
            this.cursor += 2;
            return val;
        };
        DataStream.prototype.writeUint16 = function (value, littleEndian) {
            if (littleEndian === void 0) { littleEndian = true; }
            this.data.setUint16(this.cursor, value, littleEndian);
            this.cursor += 2;
        };
        DataStream.prototype.readInt16 = function (littleEndian) {
            if (littleEndian === void 0) { littleEndian = true; }
            var val = this.data.getInt16(this.cursor, littleEndian);
            this.cursor += 2;
            return val;
        };
        DataStream.prototype.writeInt16 = function (value, littleEndian) {
            if (littleEndian === void 0) { littleEndian = true; }
            this.data.setInt16(this.cursor, value, littleEndian);
            this.cursor += 2;
        };
        DataStream.prototype.readUint32 = function (littleEndian) {
            if (littleEndian === void 0) { littleEndian = true; }
            var val = this.data.getUint32(this.cursor, littleEndian);
            this.cursor += 4;
            return val;
        };
        DataStream.prototype.writeUint32 = function (value, littleEndian) {
            if (littleEndian === void 0) { littleEndian = true; }
            this.data.setUint32(this.cursor, value, littleEndian);
            this.cursor += 4;
        };
        DataStream.prototype.readInt32 = function (littleEndian) {
            if (littleEndian === void 0) { littleEndian = true; }
            var val = this.data.getInt32(this.cursor, littleEndian);
            this.cursor += 4;
            return val;
        };
        DataStream.prototype.writeInt32 = function (value, littleEndian) {
            if (littleEndian === void 0) { littleEndian = true; }
            this.data.setInt32(this.cursor, value, littleEndian);
            this.cursor += 4;
        };
        DataStream.prototype.readBytes = function (count) {
            var bytes = new Uint8Array(this.data.buffer, this.cursor, count);
            this.cursor += bytes.byteLength;
            return bytes;
        };
        DataStream.prototype.writeBytes = function (bytes) {
            var _this = this;
            bytes.forEach(function (byte) { return _this.writeUint8(byte); });
        };
        DataStream.prototype.readHex = function (count, reverse) {
            if (reverse === void 0) { reverse = false; }
            var bytes = this.readBytes(count);
            var hex = [];
            for (var i = 0; i < bytes.length; i++) {
                hex.push(bytes[i].toString(16).padStart(2, '0'));
            }
            if (reverse)
                hex.reverse();
            return hex.join('').toUpperCase();
        };
        DataStream.prototype.readChars = function (count) {
            var chars = this.readBytes(count);
            var str = '';
            for (var i = 0; i < chars.length; i++) {
                var char = chars[i];
                if (char === 0)
                    break;
                str += String.fromCharCode(char);
            }
            return str;
        };
        DataStream.prototype.writeChars = function (string) {
            for (var i = 0; i < string.length; i++) {
                var char = string.charCodeAt(i);
                this.writeUint8(char);
            }
        };
        DataStream.prototype.readWideChars = function (count) {
            var chars = new Uint16Array(this.data.buffer, this.cursor, count);
            var str = '';
            for (var i = 0; i < chars.length; i++) {
                var char = chars[i];
                if (char == 0)
                    break;
                str += String.fromCharCode(char);
            }
            this.cursor += chars.byteLength;
            return str;
        };
        return DataStream;
    }());

    /**
     * Utils to find out information about the current code execution environment
     */
    /**
     * Is the code running in a browser environment?
     * @internal
     */
    var isBrowser = typeof window !== 'undefined'
        && typeof window.document !== 'undefined';
    /**
     * Is the code running in a Node environment?
     * @internal
     */
    var isNode = typeof process !== 'undefined'
        && process.versions != null
        && process.versions.node != null;

    var webUrlLoader = {
        matches: function (source) {
            return isBrowser && typeof source === 'string';
        },
        load: function (source, resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', source, true);
            xhr.responseType = 'arraybuffer';
            xhr.onreadystatechange = function (e) {
                if (xhr.readyState === 4) {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        resolve(xhr.response);
                    }
                    else {
                        reject({
                            type: 'httpError',
                            status: xhr.status,
                            statusText: xhr.statusText
                        });
                    }
                }
            };
            xhr.send(null);
        }
    };

    var nodeUrlLoader = {
        matches: function (source) {
            return isNode && typeof source === 'string';
        },
        load: function (source, resolve, reject) {
            var http = require('https');
            http.get(source, function (res) {
                var chunks = [];
                res.on('data', function (chunk) { return chunks.push(chunk); });
                res.on('end', function () {
                    var buffer = Buffer.concat(chunks);
                    resolve(buffer.buffer);
                });
                res.on('error', function (err) { return reject(err); });
            });
        }
    };

    /**
     * Loader for File objects (browser only)
     * @internal
     */
    var fileLoader = {
        matches: function (source) {
            return isBrowser && typeof File !== 'undefined' && source instanceof File;
        },
        load: function (source, resolve, reject) {
            if (typeof FileReader !== 'undefined') {
                var reader_1 = new FileReader();
                reader_1.onload = function (event) {
                    resolve(reader_1.result);
                };
                reader_1.onerror = function (event) {
                    reject({ type: 'fileReadError' });
                };
                reader_1.readAsArrayBuffer(source);
            }
            else {
                reject();
            }
        }
    };

    var nodeBufferLoader = {
        matches: function (source) {
            return isNode && (source instanceof Buffer);
        },
        load: function (source, resolve, reject) {
            resolve(source.buffer);
        }
    };

    /**
     * Loader for ArrayBuffer objects
     * @internal
     */
    var arrayBufferLoader = {
        matches: function (source) {
            return (source instanceof ArrayBuffer);
        },
        load: function (source, resolve, reject) {
            resolve(source);
        }
    };

    /** @internal */
    var loaders = [
        webUrlLoader,
        nodeUrlLoader,
        fileLoader,
        nodeBufferLoader,
        arrayBufferLoader
    ];
    /** @internal */
    function loadSource(source) {
        return new Promise(function (resolve, reject) {
            for (var i = 0; i < loaders.length; i++) {
                var loader = loaders[i];
                if (loader.matches(source)) {
                    loader.load(source, resolve, reject);
                    return;
                }
            }
            reject('No loader available for source type');
        });
    }

    (function (FlipnoteFormat) {
        /** Animation format used by Flipnote Studio (Nintendo DSiWare) */
        FlipnoteFormat[FlipnoteFormat["PPM"] = 0] = "PPM";
        /** Animation format used by Flipnote Studio 3D (Nintendo 3DS) */
        FlipnoteFormat[FlipnoteFormat["KWZ"] = 1] = "KWZ";
    })(exports.FlipnoteFormat || (exports.FlipnoteFormat = {}));
    (function (FlipnoteAudioTrack) {
        /** Background music track */
        FlipnoteAudioTrack[FlipnoteAudioTrack["BGM"] = 0] = "BGM";
        /** Sound effect 1 track */
        FlipnoteAudioTrack[FlipnoteAudioTrack["SE1"] = 1] = "SE1";
        /** Sound effect 2 track */
        FlipnoteAudioTrack[FlipnoteAudioTrack["SE2"] = 2] = "SE2";
        /** Sound effect 3 track */
        FlipnoteAudioTrack[FlipnoteAudioTrack["SE3"] = 3] = "SE3";
        /** Sound effect 4 track (only used by KWZ files) */
        FlipnoteAudioTrack[FlipnoteAudioTrack["SE4"] = 4] = "SE4";
    })(exports.FlipnoteAudioTrack || (exports.FlipnoteAudioTrack = {}));
    /**
     * Base Flipnote parser class
     *
     * This doesn't implement any parsing functionality itself,
     * it just provides a consistent API for every format parser to implement.
     * @category File Parser
    */
    var FlipnoteParser = /** @class */ (function (_super) {
        __extends(FlipnoteParser, _super);
        function FlipnoteParser() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * Does an audio track exist in the Flipnote?
         * @category Audio
        */
        FlipnoteParser.prototype.hasAudioTrack = function (trackId) {
            if (this.soundMeta.hasOwnProperty(trackId) && this.soundMeta[trackId].length > 0)
                return true;
            return false;
        };
        return FlipnoteParser;
    }(DataStream));

    /** @internal */
    function clamp(n, l, h) {
        if (n < l)
            return l;
        if (n > h)
            return h;
        return n;
    }
    /**
     * zero-order hold interpolation
     * @internal
     */
    function pcmDsAudioResample(src, srcFreq, dstFreq) {
        var srcDuration = src.length / srcFreq;
        var dstLength = srcDuration * dstFreq;
        var dst = new Int16Array(dstLength);
        var adjFreq = (srcFreq) / dstFreq;
        for (var n = 0; n < dst.length; n++) {
            dst[n] = src[Math.floor(n * adjFreq)];
        }
        return dst;
    }
    /** @internal */
    function pcmAudioMix(src, dst, dstOffset) {
        if (dstOffset === void 0) { dstOffset = 0; }
        var srcSize = src.length;
        var dstSize = dst.length;
        for (var n = 0; n < srcSize; n++) {
            if (dstOffset + n > dstSize)
                break;
            // half src volume
            var samp = dst[dstOffset + n] + (src[n] / 2);
            dst[dstOffset + n] = clamp(samp, -32768, 32767);
        }
    }
    /** @internal */
    var ADPCM_INDEX_TABLE_2BIT = new Int8Array([
        -1, 2, -1, 2
    ]);
    /** @internal */
    var ADPCM_INDEX_TABLE_4BIT = new Int8Array([
        -1, -1, -1, -1, 2, 4, 6, 8,
        -1, -1, -1, -1, 2, 4, 6, 8
    ]);
    /**
     * note that this is a slight deviation from the normal adpcm table
     * @internal
     */
    var ADPCM_STEP_TABLE = new Int16Array([
        7, 8, 9, 10, 11, 12, 13, 14, 16, 17,
        19, 21, 23, 25, 28, 31, 34, 37, 41, 45,
        50, 55, 60, 66, 73, 80, 88, 97, 107, 118,
        130, 143, 157, 173, 190, 209, 230, 253, 279, 307,
        337, 371, 408, 449, 494, 544, 598, 658, 724, 796,
        876, 963, 1060, 1166, 1282, 1411, 1552, 1707, 1878, 2066,
        2272, 2499, 2749, 3024, 3327, 3660, 4026, 4428, 4871, 5358,
        5894, 6484, 7132, 7845, 8630, 9493, 10442, 11487, 12635, 13899,
        15289, 16818, 18500, 20350, 22385, 24623, 27086, 29794, 32767, 0
    ]);
    /** @internal */
    var ADPCM_SAMPLE_TABLE_2BIT = new Int16Array(90 * 4);
    for (var sample = 0; sample < 4; sample++) {
        for (var stepIndex = 0; stepIndex < 90; stepIndex++) {
            var step = ADPCM_STEP_TABLE[stepIndex];
            var diff = step >> 3;
            if (sample & 1)
                diff += step;
            if (sample & 2)
                diff = -diff;
            ADPCM_SAMPLE_TABLE_2BIT[sample + 4 * stepIndex] = diff;
        }
    }
    /** @internal */
    var ADPCM_SAMPLE_TABLE_4BIT = new Int16Array(90 * 16);
    for (var sample = 0; sample < 16; sample++) {
        for (var stepIndex = 0; stepIndex < 90; stepIndex++) {
            var step = ADPCM_STEP_TABLE[stepIndex];
            var diff = step >> 3;
            if (sample & 4)
                diff += step;
            if (sample & 2)
                diff += step >> 1;
            if (sample & 1)
                diff += step >> 2;
            if (sample & 8)
                diff = -diff;
            ADPCM_SAMPLE_TABLE_4BIT[sample + 16 * stepIndex] = diff;
        }
    }

    /**
     * PPM decoder
     * Reads frames, audio, and metadata from Flipnote Studio PPM files
     * Based on my Python PPM decoder implementation (https://github.com/jaames/flipnote-tools)
     *
     * Credits:
     *  PPM format reverse-engineering and documentation:
     *   - bricklife (http://ugomemo.g.hatena.ne.jp/bricklife/20090307/1236391313)
     *   - mirai-iro (http://mirai-iro.hatenablog.jp/entry/20090116/ugomemo_ppm)
     *   - harimau_tigris (http://ugomemo.g.hatena.ne.jp/harimau_tigris)
     *   - steven (http://www.dsibrew.org/wiki/User:Steven)
     *   - yellows8 (http://www.dsibrew.org/wiki/User:Yellows8)
     *   - PBSDS (https://github.com/pbsds)
     *   - jaames (https://github.com/jaames)
     *  Identifying the PPM sound codec:
     *   - Midmad from Hatena Haiku
     *   - WDLMaster from hcs64.com
     *  Helping me to identify issues with the Python decoder that this is based on:
     *   - Austin Burk (https://sudomemo.net)
     *
     *  Lastly, a huge thanks goes to Nintendo for creating Flipnote Studio,
     *  and to Hatena for providing the Flipnote Hatena online service, both of which inspired so many c:
    */
    /**
     * PPM framerates in frames per second, indexed by the in-app frame speed.
     * Frame speed 0 is never noramally used
     */
    var PPM_FRAMERATES = [0.5, 0.5, 1, 2, 4, 6, 12, 20, 30];
    /**
     * PPM color defines (red, green, blue, alpha)
     */
    var PPM_PALETTE = {
        WHITE: [0xff, 0xff, 0xff, 0xff],
        BLACK: [0x0e, 0x0e, 0x0e, 0xff],
        RED: [0xff, 0x2a, 0x2a, 0xff],
        BLUE: [0x0a, 0x39, 0xff, 0xff]
    };
    /**
     * Parser class for (DSiWare) Flipnote Studio's PPM animation format.
     *
     * Format docs: https://github.com/Flipnote-Collective/flipnote-studio-docs/wiki/PPM-format
     * @category File Parser
     */
    var PpmParser = /** @class */ (function (_super) {
        __extends(PpmParser, _super);
        /**
         * Create a new PPM file parser instance
         * @param arrayBuffer an ArrayBuffer containing file data
         * @param settings parser settings (none currently implemented)
         */
        function PpmParser(arrayBuffer, settings) {
            var _this = _super.call(this, arrayBuffer) || this;
            /** File format type, reflects {@link PpmParser.format} */
            _this.format = exports.FlipnoteFormat.PPM;
            _this.formatString = 'PPM';
            /** Animation frame width, reflects {@link PpmParser.width} */
            _this.width = PpmParser.width;
            /** Animation frame height, reflects {@link PpmParser.height} */
            _this.height = PpmParser.height;
            /** Number of animation frame layers, reflects {@link PpmParser.numLayers} */
            _this.numLayers = PpmParser.numLayers;
            /** Audio track base sample rate, reflects {@link PpmParser.rawSampleRate} */
            _this.rawSampleRate = PpmParser.rawSampleRate;
            /** Audio output sample rate, reflects {@link PpmParser.sampleRate} */
            _this.sampleRate = PpmParser.sampleRate;
            /** Global animation frame color palette, reflects {@link PpmParser.globalPalette} */
            _this.globalPalette = PpmParser.globalPalette;
            _this.prevDecodedFrame = null;
            _this.decodeHeader();
            _this.decodeAnimationHeader();
            _this.decodeSoundHeader();
            // this is always true afaik, it's likely just a remnant from development
            // doesn't hurt to be accurate though...
            if (((_this.version >> 4) & 0xf) !== 0) {
                _this.decodeMeta();
            }
            // create image buffers
            _this.layers = [
                new Uint8Array(PpmParser.width * PpmParser.height),
                new Uint8Array(PpmParser.width * PpmParser.height)
            ];
            _this.prevLayers = [
                new Uint8Array(PpmParser.width * PpmParser.height),
                new Uint8Array(PpmParser.width * PpmParser.height)
            ];
            _this.prevDecodedFrame = null;
            return _this;
        }
        PpmParser.validateFSID = function (fsid) {
            return /[0159]{1}[0-9A-F]{6}0[0-9A-F]{8}/.test(fsid);
        };
        PpmParser.validateFilename = function (filename) {
            return /[0-9A-F]{6}_[0-9A-F]{13}_[0-9]{3}/.test(filename);
        };
        PpmParser.prototype.decodeHeader = function () {
            this.seek(0);
            // decode header
            // https://github.com/Flipnote-Collective/flipnote-studio-docs/wiki/PPM-format#header
            var magic = this.readUint32();
            this.frameDataLength = this.readUint32();
            this.soundDataLength = this.readUint32();
            this.frameCount = this.readUint16() + 1;
            this.version = this.readUint16();
        };
        PpmParser.prototype.readFilename = function () {
            return [
                this.readHex(3),
                this.readChars(13),
                this.readUint16().toString().padStart(3, '0')
            ].join('_');
        };
        PpmParser.prototype.decodeMeta = function () {
            // https://github.com/Flipnote-Collective/flipnote-studio-docs/wiki/PPM-format#metadata
            this.seek(0x10);
            var lock = this.readUint16(), thumbIndex = this.readInt16(), rootAuthorName = this.readWideChars(11), parentAuthorName = this.readWideChars(11), currentAuthorName = this.readWideChars(11), parentAuthorId = this.readHex(8, true), currentAuthorId = this.readHex(8, true), parentFilename = this.readFilename(), currentFilename = this.readFilename(), rootAuthorId = this.readHex(8, true);
            this.seek(0x9A);
            var timestamp = new Date((this.readUint32() + 946684800) * 1000);
            this.seek(0x06A6);
            var flags = this.readUint16();
            this.thumbFrameIndex = thumbIndex;
            this.layerVisibility = {
                1: (flags & 0x800) === 0,
                2: (flags & 0x400) === 0,
                3: false
            };
            this.isSpinoff = (currentAuthorId !== parentAuthorId) || (currentAuthorId !== rootAuthorId);
            this.meta = {
                lock: lock === 1,
                loop: (flags >> 1 & 0x01) === 1,
                frameCount: this.frameCount,
                frameSpeed: this.frameSpeed,
                bgmSpeed: this.bgmSpeed,
                thumbIndex: thumbIndex,
                timestamp: timestamp,
                root: {
                    filename: null,
                    username: rootAuthorName,
                    fsid: rootAuthorId,
                },
                parent: {
                    username: parentAuthorName,
                    fsid: parentAuthorId,
                    filename: parentFilename
                },
                current: {
                    username: currentAuthorName,
                    fsid: currentAuthorId,
                    filename: currentFilename
                },
            };
        };
        PpmParser.prototype.decodeAnimationHeader = function () {
            // jump to the start of the animation data section
            // https://github.com/Flipnote-Collective/flipnote-studio-docs/wiki/PPM-format#animation-header
            this.seek(0x06A0);
            var offsetTableLength = this.readUint16();
            var numOffsets = offsetTableLength / 4;
            // skip padding + flags
            this.seek(0x06A8);
            // read frame offsets and build them into a table
            var frameOffsets = new Uint32Array(numOffsets);
            for (var n = 0; n < numOffsets; n++) {
                frameOffsets[n] = 0x06A8 + offsetTableLength + this.readUint32();
            }
            this.frameOffsets = frameOffsets;
        };
        PpmParser.prototype.decodeSoundHeader = function () {
            var _a;
            // https://github.com/Flipnote-Collective/flipnote-studio-docs/wiki/PPM-format#sound-header
            // offset = frame data offset + frame data length + sound effect flags
            var offset = 0x06A0 + this.frameDataLength + this.frameCount;
            // account for multiple-of-4 padding
            if (offset % 4 != 0)
                offset += 4 - (offset % 4);
            this.seek(offset);
            var bgmLen = this.readUint32();
            var se1Len = this.readUint32();
            var se2Len = this.readUint32();
            var se3Len = this.readUint32();
            this.frameSpeed = 8 - this.readUint8();
            this.bgmSpeed = 8 - this.readUint8();
            offset += 32;
            this.framerate = PPM_FRAMERATES[this.frameSpeed];
            this.bgmrate = PPM_FRAMERATES[this.bgmSpeed];
            this.soundMeta = (_a = {},
                _a[exports.FlipnoteAudioTrack.BGM] = { offset: offset, length: bgmLen },
                _a[exports.FlipnoteAudioTrack.SE1] = { offset: offset += bgmLen, length: se1Len },
                _a[exports.FlipnoteAudioTrack.SE2] = { offset: offset += se1Len, length: se2Len },
                _a[exports.FlipnoteAudioTrack.SE3] = { offset: offset += se2Len, length: se3Len },
                _a);
        };
        PpmParser.prototype.isNewFrame = function (frameIndex) {
            this.seek(this.frameOffsets[frameIndex]);
            var header = this.readUint8();
            return (header >> 7) & 0x1;
        };
        PpmParser.prototype.readLineEncoding = function () {
            var unpacked = new Uint8Array(PpmParser.height);
            var unpackedPtr = 0;
            for (var byteIndex = 0; byteIndex < 48; byteIndex++) {
                var byte = this.readUint8();
                // each line's encoding type is stored as a 2-bit value
                for (var bitOffset = 0; bitOffset < 8; bitOffset += 2) {
                    unpacked[unpackedPtr++] = (byte >> bitOffset) & 0x03;
                }
            }
            return unpacked;
        };
        /**
         * Decode a frame, returning the raw pixel buffers for each layer
         * @category Image
        */
        PpmParser.prototype.decodeFrame = function (frameIndex) {
            if ((this.prevDecodedFrame !== frameIndex - 1) && (!this.isNewFrame(frameIndex) && (frameIndex !== 0)))
                this.decodeFrame(frameIndex - 1);
            // https://github.com/Flipnote-Collective/flipnote-studio-docs/wiki/PPM-format#animation-data
            this.seek(this.frameOffsets[frameIndex]);
            var header = this.readUint8();
            var isNewFrame = (header >> 7) & 0x1;
            var isTranslated = (header >> 5) & 0x3;
            var translateX = 0;
            var translateY = 0;
            this.prevDecodedFrame = frameIndex;
            // reset current layer buffers
            this.layers[0].fill(0);
            this.layers[1].fill(0);
            if (isTranslated) {
                translateX = this.readInt8();
                translateY = this.readInt8();
            }
            var layerEncoding = [
                this.readLineEncoding(),
                this.readLineEncoding(),
            ];
            // start decoding layer bitmaps
            for (var layer = 0; layer < 2; layer++) {
                var layerBitmap = this.layers[layer];
                for (var line = 0; line < PpmParser.height; line++) {
                    var lineType = layerEncoding[layer][line];
                    var lineOffset = line * PpmParser.width;
                    switch (lineType) {
                        // line type 0 = blank line, decode nothing
                        case 0:
                            break;
                        // line types 1 + 2 = compressed bitmap line
                        case 1:
                        case 2:
                            var lineHeader = this.readUint32(false);
                            // line type 2 starts as an inverted line
                            if (lineType == 2)
                                layerBitmap.fill(1, lineOffset, lineOffset + PpmParser.width);
                            // loop through each bit in the line header
                            while (lineHeader & 0xFFFFFFFF) {
                                // if the bit is set, this 8-pix wide chunk is stored
                                // else we can just leave it blank and move on to the next chunk
                                if (lineHeader & 0x80000000) {
                                    var chunk = this.readUint8();
                                    // unpack chunk bits
                                    for (var pixel = 0; pixel < 8; pixel++) {
                                        layerBitmap[lineOffset + pixel] = chunk >> pixel & 0x1;
                                    }
                                }
                                lineOffset += 8;
                                // shift lineheader to the left by 1 bit, now on the next loop cycle the next bit will be checked
                                lineHeader <<= 1;
                            }
                            break;
                        // line type 3 = raw bitmap line
                        case 3:
                            while (lineOffset < (line + 1) * PpmParser.width) {
                                var chunk = this.readUint8();
                                for (var pixel = 0; pixel < 8; pixel++) {
                                    layerBitmap[lineOffset + pixel] = chunk >> pixel & 0x1;
                                }
                                lineOffset += 8;
                            }
                            break;
                    }
                }
            }
            // if the current frame is based on changes from the preivous one, merge them by XORing their values
            var layer1 = this.layers[0];
            var layer2 = this.layers[1];
            var layer1Prev = this.prevLayers[0];
            var layer2Prev = this.prevLayers[1];
            if (!isNewFrame) {
                var dest = void 0, src = void 0;
                // loop through each line
                for (var y = 0; y < PpmParser.height; y++) {
                    // skip to next line if this one falls off the top edge of the screen
                    if (y - translateY < 0)
                        continue;
                    // stop once the bottom screen edge has been reached
                    if (y - translateY >= PpmParser.height)
                        break;
                    // loop through each pixel in the line
                    for (var x = 0; x < PpmParser.width; x++) {
                        // skip to the next pixel if this one falls off the left edge of the screen
                        if (x - translateX < 0)
                            continue;
                        // stop diffing this line once the right screen edge has been reached
                        if (x - translateX >= PpmParser.width)
                            break;
                        dest = x + y * PpmParser.width;
                        src = dest - (translateX + translateY * PpmParser.width);
                        // diff pixels with a binary XOR
                        layer1[dest] ^= layer1Prev[src];
                        layer2[dest] ^= layer2Prev[src];
                    }
                }
            }
            // copy the current layer buffers to the previous ones
            this.prevLayers[0].set(this.layers[0]);
            this.prevLayers[1].set(this.layers[1]);
            return this.layers;
        };
        /**
         * Get the layer draw order for a given frame
         * @category Image
         * @returns Array of layer indexes, in the order they should be drawn
        */
        PpmParser.prototype.getFrameLayerOrder = function (frameIndex) {
            return [0, 1];
        };
        /**
         * Get the color palette indices for a given frame. RGBA colors for these values can be indexed from {@link PpmParser.globalPalette}
         *
         * Returns an array where:
         *  - index 0 is the paper color index
         *  - index 1 is the layer 1 color index
         *  - index 2 is the layer 2 color index
         * @category Image
        */
        PpmParser.prototype.getFramePaletteIndices = function (frameIndex) {
            this.seek(this.frameOffsets[frameIndex]);
            var header = this.readUint8();
            var isInverted = (header & 0x1) !== 1;
            var penMap = [
                isInverted ? 0 : 1,
                isInverted ? 0 : 1,
                2,
                3,
            ];
            return [
                isInverted ? 1 : 0,
                penMap[(header >> 1) & 0x3],
                penMap[(header >> 3) & 0x3],
            ];
        };
        /**
         * Get the RGBA colors for a given frame
         *
         * Returns an array where:
         *  - index 0 is the paper color
         *  - index 1 is the layer 1 color
         *  - index 2 is the layer 2 color
         * @category Image
         */
        PpmParser.prototype.getFramePalette = function (frameIndex) {
            var _this = this;
            var indices = this.getFramePaletteIndices(frameIndex);
            return indices.map(function (colorIndex) { return _this.globalPalette[colorIndex]; });
        };
        /**
         * Get the pixels for a given frame layer
         * @category Image
        */
        PpmParser.prototype.getLayerPixels = function (frameIndex, layerIndex) {
            if (this.prevDecodedFrame !== frameIndex) {
                this.decodeFrame(frameIndex);
            }
            var palette = this.getFramePaletteIndices(frameIndex);
            var layer = this.layers[layerIndex];
            var image = new Uint8Array(PpmParser.width * PpmParser.height);
            var layerColor = palette[layerIndex + 1];
            for (var pixel = 0; pixel < image.length; pixel++) {
                if (layer[pixel] === 1)
                    image[pixel] = layerColor;
            }
            return image;
        };
        /**
         * Get the pixels for a given frame
         * @category Image
        */
        PpmParser.prototype.getFramePixels = function (frameIndex) {
            var palette = this.getFramePaletteIndices(frameIndex);
            var layers = this.decodeFrame(frameIndex);
            var image = new Uint8Array(PpmParser.width * PpmParser.height);
            var layer1 = layers[0];
            var layer2 = layers[1];
            var paperColor = palette[0];
            var layer1Color = palette[1];
            var layer2Color = palette[2];
            image.fill(paperColor);
            for (var pixel = 0; pixel < image.length; pixel++) {
                var a = layer1[pixel];
                var b = layer2[pixel];
                if (a === 1)
                    image[pixel] = layer1Color;
                else if (b === 1)
                    image[pixel] = layer2Color;
            }
            return image;
        };
        /**
         * Get the sound effect flags for every frame in the Flipnote
         * @category Audio
        */
        PpmParser.prototype.decodeSoundFlags = function () {
            // https://github.com/Flipnote-Collective/flipnote-studio-docs/wiki/PPM-format#sound-effect-flags
            this.seek(0x06A0 + this.frameDataLength);
            var numFlags = this.frameCount;
            var flags = this.readBytes(numFlags);
            var unpacked = new Array(numFlags);
            for (var i = 0; i < numFlags; i++) {
                var byte = flags[i];
                unpacked[i] = [
                    (byte & 0x1) !== 0,
                    (byte & 0x2) !== 0,
                    (byte & 0x4) !== 0,
                ];
            }
            return unpacked;
        };
        /**
         * Get the raw compressed audio data for a given track
         * @returns byte array
         * @category Audio
        */
        PpmParser.prototype.getAudioTrackRaw = function (trackId) {
            var trackMeta = this.soundMeta[trackId];
            this.seek(trackMeta.offset);
            return this.readBytes(trackMeta.length);
        };
        /**
         * Get the decoded audio data for a given track, using the track's native samplerate
         * @returns Signed 16-bit PCM audio
         * @category Audio
        */
        PpmParser.prototype.decodeAudioTrack = function (trackId) {
            // note this doesn't resample
            // TODO: kinda slow, maybe use sample lookup table
            // decode a 4 bit IMA adpcm audio track
            // https://github.com/Flipnote-Collective/flipnote-studio-docs/wiki/PPM-format#sound-data
            var src = this.getAudioTrackRaw(trackId);
            var srcSize = src.length;
            var dst = new Int16Array(srcSize * 2);
            var srcPtr = 0;
            var dstPtr = 0;
            var sample = 0;
            var stepIndex = 0;
            var predictor = 0;
            var lowNibble = true;
            while (srcPtr < srcSize) {
                // switch between hi and lo nibble each loop iteration
                // increments srcPtr after every hi nibble
                if (lowNibble)
                    sample = src[srcPtr] & 0xF;
                else
                    sample = src[srcPtr++] >> 4;
                lowNibble = !lowNibble;
                var step = ADPCM_STEP_TABLE[stepIndex];
                var diff = step >> 3;
                if (sample & 1)
                    diff += step >> 2;
                if (sample & 2)
                    diff += step >> 1;
                if (sample & 4)
                    diff += step;
                if (sample & 8)
                    diff = -diff;
                predictor += diff;
                predictor = clamp(predictor, -32768, 32767);
                stepIndex += ADPCM_INDEX_TABLE_4BIT[sample];
                stepIndex = clamp(stepIndex, 0, 88);
                dst[dstPtr++] = predictor;
            }
            return dst;
        };
        /**
         * Get the decoded audio data for a given track, using the specified samplerate
         * @returns Signed 16-bit PCM audio
         * @category Audio
        */
        PpmParser.prototype.getAudioTrackPcm = function (trackId, dstFreq) {
            if (dstFreq === void 0) { dstFreq = this.sampleRate; }
            var srcPcm = this.decodeAudioTrack(trackId);
            var srcFreq = this.rawSampleRate;
            if (trackId === exports.FlipnoteAudioTrack.BGM) {
                var bgmAdjust = (1 / this.bgmrate) / (1 / this.framerate);
                srcFreq = this.rawSampleRate * bgmAdjust;
            }
            if (srcFreq !== dstFreq)
                return pcmDsAudioResample(srcPcm, srcFreq, dstFreq);
            return srcPcm;
        };
        /**
         * Get the full mixed audio for the Flipnote, using the specified samplerate
         * @returns Signed 16-bit PCM audio
         * @category Audio
        */
        PpmParser.prototype.getAudioMasterPcm = function (dstFreq) {
            if (dstFreq === void 0) { dstFreq = this.sampleRate; }
            var duration = this.frameCount * (1 / this.framerate);
            var dstSize = Math.ceil(duration * dstFreq);
            var master = new Int16Array(dstSize);
            var hasBgm = this.hasAudioTrack(exports.FlipnoteAudioTrack.BGM);
            var hasSe1 = this.hasAudioTrack(exports.FlipnoteAudioTrack.SE1);
            var hasSe2 = this.hasAudioTrack(exports.FlipnoteAudioTrack.SE2);
            var hasSe3 = this.hasAudioTrack(exports.FlipnoteAudioTrack.SE3);
            // Mix background music
            if (hasBgm) {
                var bgmPcm = this.getAudioTrackPcm(exports.FlipnoteAudioTrack.BGM, dstFreq);
                pcmAudioMix(bgmPcm, master, 0);
            }
            // Mix sound effects
            if (hasSe1 || hasSe2 || hasSe3) {
                var seFlags = this.decodeSoundFlags();
                var se1Pcm = hasSe1 ? this.getAudioTrackPcm(exports.FlipnoteAudioTrack.SE1, dstFreq) : null;
                var se2Pcm = hasSe2 ? this.getAudioTrackPcm(exports.FlipnoteAudioTrack.SE2, dstFreq) : null;
                var se3Pcm = hasSe3 ? this.getAudioTrackPcm(exports.FlipnoteAudioTrack.SE3, dstFreq) : null;
                var adjFreq = dstFreq / this.rawSampleRate;
                var samplesPerFrame = Math.round(this.rawSampleRate / this.framerate) * adjFreq;
                for (var frame = 0; frame < this.frameCount; frame++) {
                    // places sound effect halfway through frame
                    var seOffset = (frame + .5) * samplesPerFrame;
                    var flag = seFlags[frame];
                    if (hasSe1 && flag[0])
                        pcmAudioMix(se1Pcm, master, seOffset);
                    if (hasSe2 && flag[1])
                        pcmAudioMix(se2Pcm, master, seOffset);
                    if (hasSe3 && flag[2])
                        pcmAudioMix(se3Pcm, master, seOffset);
                }
            }
            return master;
        };
        /** Default PPM parser settings */
        PpmParser.defaultSettings = {};
        /** File format type */
        PpmParser.format = exports.FlipnoteFormat.PPM;
        /** Animation frame width */
        PpmParser.width = 256;
        /** Animation frame height */
        PpmParser.height = 192;
        /** Number of animation frame layers */
        PpmParser.numLayers = 2;
        /** Audio track base sample rate */
        PpmParser.rawSampleRate = 8192;
        /** Nintendo DSi audio output rate */
        PpmParser.sampleRate = 32768;
        /** Global animation frame color palette */
        PpmParser.globalPalette = [
            PPM_PALETTE.WHITE,
            PPM_PALETTE.BLACK,
            PPM_PALETTE.RED,
            PPM_PALETTE.BLUE
        ];
        return PpmParser;
    }(FlipnoteParser));

    // Every possible sequence of pixels for each tile line
    /** @internal */
    var KWZ_LINE_TABLE = new Uint8Array(6561 * 8);
    /** @internal */
    var offset = 0;
    for (var a = 0; a < 3; a++)
        for (var b = 0; b < 3; b++)
            for (var c = 0; c < 3; c++)
                for (var d = 0; d < 3; d++)
                    for (var e = 0; e < 3; e++)
                        for (var f = 0; f < 3; f++)
                            for (var g = 0; g < 3; g++)
                                for (var h = 0; h < 3; h++) {
                                    KWZ_LINE_TABLE.set([
                                        b,
                                        a,
                                        d,
                                        c,
                                        f,
                                        e,
                                        h,
                                        g
                                    ], offset);
                                    offset += 8;
                                }
    // Line offsets, but the lines are shifted to the left by one pixel
    /** @internal */
    var KWZ_LINE_TABLE_SHIFT = new Uint8Array(6561 * 8);
    /** @internal */
    var offset = 0;
    for (var a = 0; a < 2187; a += 729)
        for (var b = 0; b < 729; b += 243)
            for (var c = 0; c < 243; c += 81)
                for (var d = 0; d < 81; d += 27)
                    for (var e = 0; e < 27; e += 9)
                        for (var f = 0; f < 9; f += 3)
                            for (var g = 0; g < 3; g += 1)
                                for (var h = 0; h < 6561; h += 2187) {
                                    var lineTableIndex = a + b + c + d + e + f + g + h;
                                    var pixels = KWZ_LINE_TABLE.subarray(lineTableIndex * 8, lineTableIndex * 8 + 8);
                                    KWZ_LINE_TABLE_SHIFT.set(pixels, offset);
                                    offset += 8;
                                }
    // Commonly occuring line offsets
    /** @internal */
    var KWZ_LINE_TABLE_COMMON = new Uint8Array(32 * 8);
    [
        0x0000, 0x0CD0, 0x19A0, 0x02D9, 0x088B, 0x0051, 0x00F3, 0x0009,
        0x001B, 0x0001, 0x0003, 0x05B2, 0x1116, 0x00A2, 0x01E6, 0x0012,
        0x0036, 0x0002, 0x0006, 0x0B64, 0x08DC, 0x0144, 0x00FC, 0x0024,
        0x001C, 0x0004, 0x0334, 0x099C, 0x0668, 0x1338, 0x1004, 0x166C
    ].forEach(function (lineTableIndex, index) {
        var pixels = KWZ_LINE_TABLE.subarray(lineTableIndex * 8, lineTableIndex * 8 + 8);
        KWZ_LINE_TABLE_COMMON.set(pixels, index * 8);
    });
    // Commonly occuring line offsets, but the lines are shifted to the left by one pixel
    /** @internal */
    var KWZ_LINE_TABLE_COMMON_SHIFT = new Uint8Array(32 * 8);
    [
        0x0000, 0x0CD0, 0x19A0, 0x0003, 0x02D9, 0x088B, 0x0051, 0x00F3,
        0x0009, 0x001B, 0x0001, 0x0006, 0x05B2, 0x1116, 0x00A2, 0x01E6,
        0x0012, 0x0036, 0x0002, 0x02DC, 0x0B64, 0x08DC, 0x0144, 0x00FC,
        0x0024, 0x001C, 0x099C, 0x0334, 0x1338, 0x0668, 0x166C, 0x1004
    ].forEach(function (lineTableIndex, index) {
        var pixels = KWZ_LINE_TABLE.subarray(lineTableIndex * 8, lineTableIndex * 8 + 8);
        KWZ_LINE_TABLE_COMMON_SHIFT.set(pixels, index * 8);
    });

    /**
     * KWZ framerates in frames per second, indexed by the in-app frame speed
     */
    var KWZ_FRAMERATES = [.2, .5, 1, 2, 4, 6, 8, 12, 20, 24, 30];
    /**
     * KWZ color defines (red, green, blue, alpha)
     */
    var KWZ_PALETTE = {
        WHITE: [0xff, 0xff, 0xff, 0xff],
        BLACK: [0x10, 0x10, 0x10, 0xff],
        RED: [0xff, 0x10, 0x10, 0xff],
        YELLOW: [0xff, 0xe7, 0x00, 0xff],
        GREEN: [0x00, 0x86, 0x31, 0xff],
        BLUE: [0x00, 0x38, 0xce, 0xff],
        NONE: [0xff, 0xff, 0xff, 0x00]
    };
    /**
     * Pre computed bitmasks for readBits; done as a slight optimisation
     * @internal
     */
    var BITMASKS = new Uint16Array(16);
    for (var i = 0; i < 16; i++) {
        BITMASKS[i] = (1 << i) - 1;
    }
    /**
     * Parser class for Flipnote Studio 3D's KWZ animation format
     *
     * Format docs: https://github.com/Flipnote-Collective/flipnote-studio-3d-docs/wiki/KWZ-Format
     * @category File Parser
     */
    var KwzParser = /** @class */ (function (_super) {
        __extends(KwzParser, _super);
        /**
         * Create a new KWZ file parser instance
         * @param arrayBuffer an ArrayBuffer containing file data
         * @param settings parser settings
         */
        function KwzParser(arrayBuffer, settings) {
            if (settings === void 0) { settings = {}; }
            var _this = _super.call(this, arrayBuffer) || this;
            /** File format type, reflects {@link KwzParser.format} */
            _this.format = exports.FlipnoteFormat.KWZ;
            _this.formatString = 'KWZ';
            /** Animation frame width, reflects {@link KwzParser.width} */
            _this.width = KwzParser.width;
            /** Animation frame height, reflects {@link KwzParser.height} */
            _this.height = KwzParser.height;
            /** Number of animation frame layers, reflects {@link KwzParser.numLayers} */
            _this.numLayers = KwzParser.numLayers;
            /** Audio track base sample rate, reflects {@link KwzParser.rawSampleRate} */
            _this.rawSampleRate = KwzParser.rawSampleRate;
            /** Audio output sample rate, reflects {@link KwzParser.sampleRate} */
            _this.sampleRate = KwzParser.sampleRate;
            /** Global animation frame color palette, reflects {@link KwzParser.globalPalette} */
            _this.globalPalette = KwzParser.globalPalette;
            _this.prevFrameIndex = null;
            _this.bitIndex = 0;
            _this.bitValue = 0;
            _this.settings = __assign(__assign({}, KwzParser.defaultSettings), settings);
            _this.layers = [
                new Uint8Array(KwzParser.width * KwzParser.height),
                new Uint8Array(KwzParser.width * KwzParser.height),
                new Uint8Array(KwzParser.width * KwzParser.height),
            ];
            _this.bitIndex = 0;
            _this.bitValue = 0;
            _this.buildSectionMap();
            if (!_this.settings.quickMeta)
                _this.decodeMeta();
            else
                _this.decodeMetaQuick();
            _this.getFrameOffsets();
            _this.decodeSoundHeader();
            return _this;
        }
        KwzParser.prototype.buildSectionMap = function () {
            this.seek(0);
            this.sections = {};
            var fileSize = this.byteLength - 256;
            var offset = 0;
            var sectionCount = 0;
            // counting sections should mitigate against one of mrnbayoh's notehax exploits
            while ((offset < fileSize) && (sectionCount < 6)) {
                this.seek(offset);
                var sectionMagic = this.readChars(4).substring(0, 3);
                var sectionLength = this.readUint32();
                this.sections[sectionMagic] = {
                    offset: offset,
                    length: sectionLength
                };
                offset += sectionLength + 8;
                sectionCount += 1;
            }
        };
        KwzParser.prototype.readBits = function (num) {
            if (this.bitIndex + num > 16) {
                var nextBits = this.readUint16();
                this.bitValue |= nextBits << (16 - this.bitIndex);
                this.bitIndex -= 16;
            }
            var result = this.bitValue & BITMASKS[num];
            this.bitValue >>= num;
            this.bitIndex += num;
            return result;
        };
        KwzParser.prototype.decodeMeta = function () {
            this.seek(this.sections['KFH'].offset + 12);
            var creationTimestamp = new Date((this.readUint32() + 946684800) * 1000), modifiedTimestamp = new Date((this.readUint32() + 946684800) * 1000), appVersion = this.readUint32(), rootAuthorId = this.readHex(10), parentAuthorId = this.readHex(10), currentAuthorId = this.readHex(10), rootAuthorName = this.readWideChars(11), parentAuthorName = this.readWideChars(11), currentAuthorName = this.readWideChars(11), rootFilename = this.readChars(28), parentFilename = this.readChars(28), currentFilename = this.readChars(28), frameCount = this.readUint16(), thumbIndex = this.readUint16(), flags = this.readUint16(), frameSpeed = this.readUint8(), layerFlags = this.readUint8();
            this.isSpinoff = (currentAuthorId !== parentAuthorId) || (currentAuthorId !== rootAuthorId);
            this.frameCount = frameCount;
            this.thumbFrameIndex = thumbIndex;
            this.frameSpeed = frameSpeed;
            this.framerate = KWZ_FRAMERATES[frameSpeed];
            this.layerVisibility = {
                1: (layerFlags & 0x1) === 0,
                2: (layerFlags & 0x2) === 0,
                3: (layerFlags & 0x3) === 0,
            };
            this.meta = {
                lock: (flags & 0x1) !== 0,
                loop: (flags & 0x2) !== 0,
                frameCount: frameCount,
                frameSpeed: frameSpeed,
                thumbIndex: thumbIndex,
                timestamp: modifiedTimestamp,
                creationTimestamp: creationTimestamp,
                root: {
                    username: rootAuthorName,
                    fsid: rootAuthorId,
                    filename: rootFilename,
                },
                parent: {
                    username: parentAuthorName,
                    fsid: parentAuthorId,
                    filename: parentFilename,
                },
                current: {
                    username: currentAuthorName,
                    fsid: currentAuthorId,
                    filename: currentFilename,
                },
            };
        };
        KwzParser.prototype.decodeMetaQuick = function () {
            this.seek(this.sections['KFH'].offset + 0x8 + 0xC4);
            var frameCount = this.readUint16();
            var thumbFrameIndex = this.readUint16();
            var flags = this.readUint16();
            var frameSpeed = this.readUint8();
            var layerFlags = this.readUint8();
            this.frameCount = frameCount;
            this.thumbFrameIndex = thumbFrameIndex;
            this.frameSpeed = frameSpeed;
            this.framerate = KWZ_FRAMERATES[frameSpeed];
        };
        KwzParser.prototype.getFrameOffsets = function () {
            var numFrames = this.frameCount;
            var kmiSection = this.sections['KMI'];
            var kmcSection = this.sections['KMC'];
            var frameMetaOffsets = new Uint32Array(numFrames);
            var frameDataOffsets = new Uint32Array(numFrames);
            var frameLayerSizes = [];
            var frameMetaOffset = kmiSection.offset + 8;
            var frameDataOffset = kmcSection.offset + 12;
            for (var frameIndex = 0; frameIndex < numFrames; frameIndex++) {
                this.seek(frameMetaOffset + 4);
                var layerASize = this.readUint16();
                var layerBSize = this.readUint16();
                var layerCSize = this.readUint16();
                frameMetaOffsets[frameIndex] = frameMetaOffset;
                frameDataOffsets[frameIndex] = frameDataOffset;
                frameMetaOffset += 28;
                frameDataOffset += layerASize + layerBSize + layerCSize;
                frameLayerSizes.push([layerASize, layerBSize, layerCSize]);
            }
            this.frameMetaOffsets = frameMetaOffsets;
            this.frameDataOffsets = frameDataOffsets;
            this.frameLayerSizes = frameLayerSizes;
        };
        KwzParser.prototype.decodeSoundHeader = function () {
            var _a;
            if (this.sections.hasOwnProperty('KSN')) {
                var offset = this.sections['KSN'].offset + 8;
                this.seek(offset);
                var bgmSpeed = this.readUint32();
                this.bgmSpeed = bgmSpeed;
                this.bgmrate = KWZ_FRAMERATES[bgmSpeed];
                var trackSizes = new Uint32Array(this.buffer, offset + 4, 20);
                this.soundMeta = (_a = {},
                    _a[exports.FlipnoteAudioTrack.BGM] = { offset: offset += 28, length: trackSizes[0] },
                    _a[exports.FlipnoteAudioTrack.SE1] = { offset: offset += trackSizes[0], length: trackSizes[1] },
                    _a[exports.FlipnoteAudioTrack.SE2] = { offset: offset += trackSizes[1], length: trackSizes[2] },
                    _a[exports.FlipnoteAudioTrack.SE3] = { offset: offset += trackSizes[2], length: trackSizes[3] },
                    _a[exports.FlipnoteAudioTrack.SE4] = { offset: offset += trackSizes[3], length: trackSizes[4] },
                    _a);
            }
        };
        /**
         * Get the color palette indices for a given frame. RGBA colors for these values can be indexed from {@link KwzParser.globalPalette}
         *
         * Returns an array where:
         *  - index 0 is the paper color index
         *  - index 1 is the layer A color 1 index
         *  - index 2 is the layer A color 2 index
         *  - index 3 is the layer B color 1 index
         *  - index 4 is the layer B color 2 index
         *  - index 5 is the layer C color 1 index
         *  - index 6 is the layer C color 2 index
         * @category Image
        */
        KwzParser.prototype.getFramePaletteIndices = function (frameIndex) {
            this.seek(this.frameMetaOffsets[frameIndex]);
            var flags = this.readUint32();
            return [
                flags & 0xF,
                (flags >> 8) & 0xF,
                (flags >> 12) & 0xF,
                (flags >> 16) & 0xF,
                (flags >> 20) & 0xF,
                (flags >> 24) & 0xF,
                (flags >> 28) & 0xF,
            ];
        };
        /**
         * Get the RGBA colors for a given frame
         *
         * Returns an array where:
         *  - index 0 is the paper color
         *  - index 1 is the layer A color 1
         *  - index 2 is the layer A color 2
         *  - index 3 is the layer B color 1
         *  - index 4 is the layer B color 2
         *  - index 5 is the layer C color 1
         *  - index 6 is the layer C color 2
         * @category Image
        */
        KwzParser.prototype.getFramePalette = function (frameIndex) {
            var _this = this;
            var indices = this.getFramePaletteIndices(frameIndex);
            return indices.map(function (colorIndex) { return _this.globalPalette[colorIndex]; });
        };
        KwzParser.prototype.getFrameDiffingFlag = function (frameIndex) {
            this.seek(this.frameMetaOffsets[frameIndex]);
            var flags = this.readUint32();
            return (flags >> 4) & 0x07;
        };
        KwzParser.prototype.getFrameLayerSizes = function (frameIndex) {
            this.seek(this.frameMetaOffsets[frameIndex] + 0x4);
            return [
                this.readUint16(),
                this.readUint16(),
                this.readUint16()
            ];
        };
        KwzParser.prototype.getFrameLayerDepths = function (frameIndex) {
            this.seek(this.frameMetaOffsets[frameIndex] + 0x14);
            return [
                this.readUint8(),
                this.readUint8(),
                this.readUint8()
            ];
        };
        KwzParser.prototype.getFrameAuthor = function (frameIndex) {
            this.seek(this.frameMetaOffsets[frameIndex] + 0xA);
            return this.readHex(10);
        };
        KwzParser.prototype.getFrameSoundFlags = function (frameIndex) {
            this.seek(this.frameMetaOffsets[frameIndex] + 0x17);
            var soundFlags = this.readUint8();
            return [
                (soundFlags & 0x1) !== 0,
                (soundFlags & 0x2) !== 0,
                (soundFlags & 0x4) !== 0,
                (soundFlags & 0x8) !== 0,
            ];
        };
        KwzParser.prototype.getFrameCameraFlags = function (frameIndex) {
            this.seek(this.frameMetaOffsets[frameIndex] + 0x1A);
            var cameraFlags = this.readUint8();
            return [
                (cameraFlags & 0x1) !== 0,
                (cameraFlags & 0x2) !== 0,
                (cameraFlags & 0x4) !== 0,
            ];
        };
        /**
         * Get the layer draw order for a given frame
         * @category Image
         * @returns Array of layer indexes, in the order they should be drawn
        */
        KwzParser.prototype.getFrameLayerOrder = function (frameIndex) {
            var depths = this.getFrameLayerDepths(frameIndex);
            return [2, 1, 0].sort(function (a, b) { return depths[b] - depths[a]; });
        };
        /**
         * Decode a frame, returning the raw pixel buffers for each layer
         * @category Image
        */
        KwzParser.prototype.decodeFrame = function (frameIndex, diffingFlag, isPrevFrame) {
            if (diffingFlag === void 0) { diffingFlag = 0x7; }
            if (isPrevFrame === void 0) { isPrevFrame = false; }
            // the prevDecodedFrame check is an optimisation for decoding frames in full sequence
            if (this.prevFrameIndex !== frameIndex - 1 && frameIndex !== 0) {
                // if this frame is being decoded as a prev frame, then we only want to decode the layers necessary
                // diffingFlag is negated with ~ so if no layers are diff-based, diffingFlag is 0
                if (isPrevFrame)
                    diffingFlag = diffingFlag & ~this.getFrameDiffingFlag(frameIndex + 1);
                // if diffing flag isn't 0, decode the previous frame before this one
                if (diffingFlag !== 0)
                    this.decodeFrame(frameIndex - 1, diffingFlag, true);
            }
            var ptr = this.frameDataOffsets[frameIndex];
            var layerSizes = this.frameLayerSizes[frameIndex];
            for (var layerIndex = 0; layerIndex < 3; layerIndex++) {
                // dsi gallery conversions don't use the third layer, so it can be skipped if this is set
                if (this.settings.dsiGalleryNote && layerIndex === 3)
                    break;
                this.seek(ptr);
                var layerSize = layerSizes[layerIndex];
                ptr += layerSize;
                // if the layer is 38 bytes then it hasn't changed at all since the previous frame, so we can skip it
                if (layerSize === 38)
                    continue;
                // if this layer doesn't need to be decoded for diffing
                if (((diffingFlag >> layerIndex) & 0x1) === 0)
                    continue;
                // reset readbits state
                this.bitIndex = 16;
                this.bitValue = 0;
                // tile skip counter
                var skip = 0;
                for (var tileOffsetY = 0; tileOffsetY < KwzParser.height; tileOffsetY += 128) {
                    for (var tileOffsetX = 0; tileOffsetX < KwzParser.width; tileOffsetX += 128) {
                        // loop small tiles
                        for (var subTileOffsetY = 0; subTileOffsetY < 128; subTileOffsetY += 8) {
                            var y = tileOffsetY + subTileOffsetY;
                            if (y >= KwzParser.height)
                                break;
                            for (var subTileOffsetX = 0; subTileOffsetX < 128; subTileOffsetX += 8) {
                                var x = tileOffsetX + subTileOffsetX;
                                if (x >= KwzParser.width)
                                    break;
                                if (skip > 0) {
                                    skip -= 1;
                                    continue;
                                }
                                var pixelOffset = y * KwzParser.width + x;
                                var pixelBuffer = this.layers[layerIndex];
                                var type = this.readBits(3);
                                if (type == 0) {
                                    var lineIndex = this.readBits(5);
                                    var pixels = KWZ_LINE_TABLE_COMMON.subarray(lineIndex * 8, lineIndex * 8 + 8);
                                    pixelBuffer.set(pixels, pixelOffset);
                                    pixelBuffer.set(pixels, pixelOffset + 320);
                                    pixelBuffer.set(pixels, pixelOffset + 640);
                                    pixelBuffer.set(pixels, pixelOffset + 960);
                                    pixelBuffer.set(pixels, pixelOffset + 1280);
                                    pixelBuffer.set(pixels, pixelOffset + 1600);
                                    pixelBuffer.set(pixels, pixelOffset + 1920);
                                    pixelBuffer.set(pixels, pixelOffset + 2240);
                                }
                                else if (type == 1) {
                                    var lineIndex = this.readBits(13);
                                    var pixels = KWZ_LINE_TABLE.subarray(lineIndex * 8, lineIndex * 8 + 8);
                                    pixelBuffer.set(pixels, pixelOffset);
                                    pixelBuffer.set(pixels, pixelOffset + 320);
                                    pixelBuffer.set(pixels, pixelOffset + 640);
                                    pixelBuffer.set(pixels, pixelOffset + 960);
                                    pixelBuffer.set(pixels, pixelOffset + 1280);
                                    pixelBuffer.set(pixels, pixelOffset + 1600);
                                    pixelBuffer.set(pixels, pixelOffset + 1920);
                                    pixelBuffer.set(pixels, pixelOffset + 2240);
                                }
                                else if (type == 2) {
                                    var lineValue = this.readBits(5);
                                    var a = KWZ_LINE_TABLE_COMMON.subarray(lineValue * 8, lineValue * 8 + 8);
                                    var b = KWZ_LINE_TABLE_COMMON_SHIFT.subarray(lineValue * 8, lineValue * 8 + 8);
                                    pixelBuffer.set(a, pixelOffset);
                                    pixelBuffer.set(b, pixelOffset + 320);
                                    pixelBuffer.set(a, pixelOffset + 640);
                                    pixelBuffer.set(b, pixelOffset + 960);
                                    pixelBuffer.set(a, pixelOffset + 1280);
                                    pixelBuffer.set(b, pixelOffset + 1600);
                                    pixelBuffer.set(a, pixelOffset + 1920);
                                    pixelBuffer.set(b, pixelOffset + 2240);
                                }
                                else if (type == 3) {
                                    var lineValue = this.readBits(13);
                                    var a = KWZ_LINE_TABLE.subarray(lineValue * 8, lineValue * 8 + 8);
                                    var b = KWZ_LINE_TABLE_SHIFT.subarray(lineValue * 8, lineValue * 8 + 8);
                                    pixelBuffer.set(a, pixelOffset);
                                    pixelBuffer.set(b, pixelOffset + 320);
                                    pixelBuffer.set(a, pixelOffset + 640);
                                    pixelBuffer.set(b, pixelOffset + 960);
                                    pixelBuffer.set(a, pixelOffset + 1280);
                                    pixelBuffer.set(b, pixelOffset + 1600);
                                    pixelBuffer.set(a, pixelOffset + 1920);
                                    pixelBuffer.set(b, pixelOffset + 2240);
                                }
                                // most common tile type
                                else if (type == 4) {
                                    var mask = this.readBits(8);
                                    var ptr_1 = pixelOffset;
                                    for (var line = 0; line < 8; line++) {
                                        if ((mask & 0x1) !== 0) {
                                            var lineIndex = this.readBits(5);
                                            var pixels = KWZ_LINE_TABLE_COMMON.subarray(lineIndex * 8, lineIndex * 8 + 8);
                                            pixelBuffer.set(pixels, ptr_1);
                                        }
                                        else {
                                            var lineIndex = this.readBits(13);
                                            var pixels = KWZ_LINE_TABLE.subarray(lineIndex * 8, lineIndex * 8 + 8);
                                            pixelBuffer.set(pixels, ptr_1);
                                        }
                                        mask >>= 1;
                                        ptr_1 += 320;
                                    }
                                }
                                else if (type == 5) {
                                    skip = this.readBits(5);
                                    continue;
                                }
                                // type 6 doesnt exist
                                else if (type == 7) {
                                    var pattern = this.readBits(2);
                                    var useCommonLines = this.readBits(1);
                                    var a = void 0;
                                    var b = void 0;
                                    if (useCommonLines !== 0) {
                                        var lineIndexA = this.readBits(5);
                                        var lineIndexB = this.readBits(5);
                                        a = KWZ_LINE_TABLE_COMMON.subarray(lineIndexA * 8, lineIndexA * 8 + 8);
                                        b = KWZ_LINE_TABLE_COMMON.subarray(lineIndexB * 8, lineIndexB * 8 + 8);
                                        pattern = (pattern + 1) % 4;
                                    }
                                    else {
                                        var lineIndexA = this.readBits(13);
                                        var lineIndexB = this.readBits(13);
                                        a = KWZ_LINE_TABLE.subarray(lineIndexA * 8, lineIndexA * 8 + 8);
                                        b = KWZ_LINE_TABLE.subarray(lineIndexB * 8, lineIndexB * 8 + 8);
                                    }
                                    if (pattern == 0) {
                                        pixelBuffer.set(a, pixelOffset);
                                        pixelBuffer.set(b, pixelOffset + 320);
                                        pixelBuffer.set(a, pixelOffset + 640);
                                        pixelBuffer.set(b, pixelOffset + 960);
                                        pixelBuffer.set(a, pixelOffset + 1280);
                                        pixelBuffer.set(b, pixelOffset + 1600);
                                        pixelBuffer.set(a, pixelOffset + 1920);
                                        pixelBuffer.set(b, pixelOffset + 2240);
                                    }
                                    else if (pattern == 1) {
                                        pixelBuffer.set(a, pixelOffset);
                                        pixelBuffer.set(a, pixelOffset + 320);
                                        pixelBuffer.set(b, pixelOffset + 640);
                                        pixelBuffer.set(a, pixelOffset + 960);
                                        pixelBuffer.set(a, pixelOffset + 1280);
                                        pixelBuffer.set(b, pixelOffset + 1600);
                                        pixelBuffer.set(a, pixelOffset + 1920);
                                        pixelBuffer.set(a, pixelOffset + 2240);
                                    }
                                    else if (pattern == 2) {
                                        pixelBuffer.set(a, pixelOffset);
                                        pixelBuffer.set(b, pixelOffset + 320);
                                        pixelBuffer.set(a, pixelOffset + 640);
                                        pixelBuffer.set(a, pixelOffset + 960);
                                        pixelBuffer.set(b, pixelOffset + 1280);
                                        pixelBuffer.set(a, pixelOffset + 1600);
                                        pixelBuffer.set(a, pixelOffset + 1920);
                                        pixelBuffer.set(b, pixelOffset + 2240);
                                    }
                                    else if (pattern == 3) {
                                        pixelBuffer.set(a, pixelOffset);
                                        pixelBuffer.set(b, pixelOffset + 320);
                                        pixelBuffer.set(b, pixelOffset + 640);
                                        pixelBuffer.set(a, pixelOffset + 960);
                                        pixelBuffer.set(b, pixelOffset + 1280);
                                        pixelBuffer.set(b, pixelOffset + 1600);
                                        pixelBuffer.set(a, pixelOffset + 1920);
                                        pixelBuffer.set(b, pixelOffset + 2240);
                                    }
                                }
                            }
                        }
                    }
                }
            }
            this.prevFrameIndex = frameIndex;
            return this.layers;
        };
        /**
         * Get the pixels for a given frame layer
         * @category Image
        */
        KwzParser.prototype.getLayerPixels = function (frameIndex, layerIndex) {
            if (this.prevFrameIndex !== frameIndex)
                this.decodeFrame(frameIndex);
            var palette = this.getFramePaletteIndices(frameIndex);
            var layers = this.layers[layerIndex];
            var image = new Uint8Array(KwzParser.width * KwzParser.height);
            var paletteOffset = layerIndex * 2 + 1;
            for (var pixelIndex = 0; pixelIndex < layers.length; pixelIndex++) {
                var pixel = layers[pixelIndex];
                if (pixel === 1)
                    image[pixelIndex] = palette[paletteOffset];
                else if (pixel === 2)
                    image[pixelIndex] = palette[paletteOffset + 1];
            }
            return image;
        };
        /**
         * Get the pixels for a given frame
         * @category Image
        */
        KwzParser.prototype.getFramePixels = function (frameIndex) {
            if (this.prevFrameIndex !== frameIndex)
                this.decodeFrame(frameIndex);
            var palette = this.getFramePaletteIndices(frameIndex);
            var layerOrder = this.getFrameLayerOrder(frameIndex);
            var layerA = this.layers[layerOrder[2]]; // top
            var layerB = this.layers[layerOrder[1]]; // middle
            var layerC = this.layers[layerOrder[0]]; // bottom
            var layerAOffset = layerOrder[2] * 2;
            var layerBOffset = layerOrder[1] * 2;
            var layerCOffset = layerOrder[0] * 2;
            if (!this.settings.dsiGalleryNote) {
                var image = new Uint8Array(KwzParser.width * KwzParser.height);
                image.fill(palette[0]); // fill with paper color first
                for (var pixel = 0; pixel < image.length; pixel++) {
                    var a = layerA[pixel];
                    var b = layerB[pixel];
                    var c = layerC[pixel];
                    if (a !== 0)
                        image[pixel] = palette[layerAOffset + a];
                    else if (b !== 0)
                        image[pixel] = palette[layerBOffset + b];
                    else if (c !== 0)
                        image[pixel] = palette[layerCOffset + c];
                }
                return image;
            }
            // for dsi gallery notes, bottom layer is ignored and edge is cropped
            else {
                var image = new Uint8Array(KwzParser.width * KwzParser.height);
                image.fill(palette[0]); // fill with paper color first
                var cropStartY = 32;
                var cropStartX = 24;
                var cropWidth = KwzParser.width - 64;
                var cropHeight = KwzParser.height - 48;
                var srcStride = KwzParser.width;
                for (var y = cropStartY; y < cropHeight; y++) {
                    var srcPtr = y * srcStride;
                    for (var x = cropStartX; x < cropWidth; x++) {
                        var a = layerA[srcPtr];
                        var b = layerB[srcPtr];
                        if (a !== 0)
                            image[srcPtr] = palette[layerAOffset + a];
                        else if (b !== 0)
                            image[srcPtr] = palette[layerBOffset + b];
                        srcPtr += 1;
                    }
                }
                return image;
            }
        };
        /**
         * Get the sound effect flags for every frame in the Flipnote
         * @category Audio
        */
        KwzParser.prototype.decodeSoundFlags = function () {
            var result = [];
            for (var i = 0; i < this.frameCount; i++) {
                result.push(this.getFrameSoundFlags(i));
            }
            return result;
        };
        /**
         * Get the raw compressed audio data for a given track
         * @returns Byte array
         * @category Audio
        */
        KwzParser.prototype.getAudioTrackRaw = function (trackId) {
            var trackMeta = this.soundMeta[trackId];
            return new Uint8Array(this.buffer, trackMeta.offset, trackMeta.length);
        };
        /**
         * Get the decoded audio data for a given track, using the track's native samplerate
         * @returns Signed 16-bit PCM audio
         * @category Audio
        */
        KwzParser.prototype.decodeAudioTrack = function (trackId) {
            var adpcm = this.getAudioTrackRaw(trackId);
            var output = new Int16Array(16364 * 60);
            var outputOffset = 0;
            // initial decoder state
            // Flipnote 3D's initial audio decoder state is actually bugged, so these aren't 1:1 to what the app does
            var prevDiff = 0;
            var prevStepIndex = 0;
            // we can still optionally enable the original setup here
            if (this.settings.originalAudioSettings)
                prevStepIndex = 40;
            var sample;
            var diff;
            var stepIndex;
            // loop through each byte in the raw adpcm data
            for (var adpcmOffset = 0; adpcmOffset < adpcm.length; adpcmOffset++) {
                var byte = adpcm[adpcmOffset];
                var bitPos = 0;
                while (bitPos < 8) {
                    if (prevStepIndex < 18 || bitPos == 6) {
                        // isolate 2-bit sample
                        sample = (byte >> bitPos) & 0x3;
                        // get diff
                        diff = prevDiff + ADPCM_SAMPLE_TABLE_2BIT[sample + 4 * prevStepIndex];
                        // get step index
                        stepIndex = prevStepIndex + ADPCM_INDEX_TABLE_2BIT[sample];
                        bitPos += 2;
                    }
                    else {
                        // isolate 4-bit sample
                        sample = (byte >> bitPos) & 0xF;
                        // get diff
                        diff = prevDiff + ADPCM_SAMPLE_TABLE_4BIT[sample + 16 * prevStepIndex];
                        // get step index
                        stepIndex = prevStepIndex + ADPCM_INDEX_TABLE_4BIT[sample];
                        bitPos += 4;
                    }
                    // clamp step index and diff
                    stepIndex = clamp(stepIndex, 0, 79);
                    diff = clamp(diff, -2047, 2047);
                    // add result to output buffer
                    output[outputOffset] = (diff * 16);
                    outputOffset += 1;
                    // set prev decoder state
                    prevStepIndex = stepIndex;
                    prevDiff = diff;
                }
            }
            return output.slice(0, outputOffset);
        };
        /**
         * Get the decoded audio data for a given track, using the specified samplerate
         * @returns Signed 16-bit PCM audio
         * @category Audio
        */
        KwzParser.prototype.getAudioTrackPcm = function (trackId, dstFreq) {
            if (dstFreq === void 0) { dstFreq = this.sampleRate; }
            var srcPcm = this.decodeAudioTrack(trackId);
            var srcFreq = this.rawSampleRate;
            if (trackId === exports.FlipnoteAudioTrack.BGM) {
                var bgmAdjust = (1 / this.bgmrate) / (1 / this.framerate);
                srcFreq = this.rawSampleRate * bgmAdjust;
            }
            if (srcFreq !== dstFreq) {
                return pcmDsAudioResample(srcPcm, srcFreq, dstFreq);
            }
            return srcPcm;
        };
        /**
         * Get the full mixed audio for the Flipnote, using the specified samplerate
         * @returns Signed 16-bit PCM audio
         * @category Audio
        */
        KwzParser.prototype.getAudioMasterPcm = function (dstFreq) {
            if (dstFreq === void 0) { dstFreq = this.sampleRate; }
            var duration = this.frameCount * (1 / this.framerate);
            var dstSize = Math.ceil(duration * dstFreq);
            var master = new Int16Array(dstSize);
            var hasBgm = this.hasAudioTrack(exports.FlipnoteAudioTrack.BGM);
            var hasSe1 = this.hasAudioTrack(exports.FlipnoteAudioTrack.SE1);
            var hasSe2 = this.hasAudioTrack(exports.FlipnoteAudioTrack.SE2);
            var hasSe3 = this.hasAudioTrack(exports.FlipnoteAudioTrack.SE3);
            var hasSe4 = this.hasAudioTrack(exports.FlipnoteAudioTrack.SE4);
            // Mix background music
            if (hasBgm) {
                var bgmPcm = this.getAudioTrackPcm(exports.FlipnoteAudioTrack.BGM, dstFreq);
                pcmAudioMix(bgmPcm, master, 0);
            }
            // Mix sound effects
            if (hasSe1 || hasSe2 || hasSe3) {
                var samplesPerFrame = Math.floor(dstFreq / this.framerate);
                var se1Pcm = hasSe1 ? this.getAudioTrackPcm(exports.FlipnoteAudioTrack.SE1, dstFreq) : null;
                var se2Pcm = hasSe2 ? this.getAudioTrackPcm(exports.FlipnoteAudioTrack.SE2, dstFreq) : null;
                var se3Pcm = hasSe3 ? this.getAudioTrackPcm(exports.FlipnoteAudioTrack.SE3, dstFreq) : null;
                var se4Pcm = hasSe4 ? this.getAudioTrackPcm(exports.FlipnoteAudioTrack.SE4, dstFreq) : null;
                for (var i = 0; i < this.frameCount; i++) {
                    var seFlags = this.getFrameSoundFlags(i);
                    var seOffset = samplesPerFrame * i;
                    if (hasSe1 && seFlags[0])
                        pcmAudioMix(se1Pcm, master, seOffset);
                    if (hasSe2 && seFlags[1])
                        pcmAudioMix(se2Pcm, master, seOffset);
                    if (hasSe3 && seFlags[2])
                        pcmAudioMix(se3Pcm, master, seOffset);
                    if (hasSe4 && seFlags[3])
                        pcmAudioMix(se4Pcm, master, seOffset);
                }
            }
            return master;
        };
        /** Default KWZ parser settings */
        KwzParser.defaultSettings = {
            quickMeta: false,
            dsiGalleryNote: false,
            originalAudioSettings: false
        };
        /** File format type */
        KwzParser.format = exports.FlipnoteFormat.KWZ;
        /** Animation frame width */
        KwzParser.width = 320;
        /** Animation frame height */
        KwzParser.height = 240;
        /** Number of animation frame layers */
        KwzParser.numLayers = 3;
        /** Audio track base sample rate */
        KwzParser.rawSampleRate = 16364;
        /** Audio output sample rate. NOTE: probably isn't accurate, full KWZ audio stack is still on the todo */
        KwzParser.sampleRate = 16364;
        /** Global animation frame color palette */
        KwzParser.globalPalette = [
            KWZ_PALETTE.WHITE,
            KWZ_PALETTE.BLACK,
            KWZ_PALETTE.RED,
            KWZ_PALETTE.YELLOW,
            KWZ_PALETTE.GREEN,
            KWZ_PALETTE.BLUE,
            KWZ_PALETTE.NONE,
        ];
        return KwzParser;
    }(FlipnoteParser));

    function parseSource(source, parserConfig) {
        return loadSource(source)
            .then(function (arrayBuffer) {
            return new Promise(function (resolve, reject) {
                // check the buffer's magic to identify which format it uses
                var magicBytes = new Uint8Array(arrayBuffer.slice(0, 4));
                var magic = (magicBytes[0] << 24) | (magicBytes[1] << 16) | (magicBytes[2] << 8) | magicBytes[3];
                // check if magic is PARA (ppm magic)
                if (magic === 0x50415241)
                    resolve(new PpmParser(arrayBuffer, parserConfig));
                // check if magic is KFH (kwz magic)
                else if ((magic & 0xFFFFFF00) === 0x4B464800)
                    resolve(new KwzParser(arrayBuffer, parserConfig));
                else
                    reject();
            });
        });
    }

    /*
      LZWEncoder.js

      Authors
      Kevin Weiner (original Java version - kweiner@fmsware.com)
      Thibault Imbert (AS3 version - bytearray.org)
      Johan Nordberg (JS version - code@johan-nordberg.com)
      James Daniel (ES6/TS version)

      Acknowledgements
      GIFCOMPR.C - GIF Image compression routines
      Lempel-Ziv compression based on 'compress'. GIF modifications by
      David Rowley (mgardi@watdcsu.waterloo.edu)
      GIF Image compression - modified 'compress'
      Based on: compress.c - File compression ala IEEE Computer, June 1984.
      By Authors: Spencer W. Thomas (decvax!harpo!utah-cs!utah-gr!thomas)
      Jim McKie (decvax!mcvax!jim)
      Steve Davies (decvax!vax135!petsd!peora!srd)
      Ken Turkowski (decvax!decwrl!turtlevax!ken)
      James A. Woods (decvax!ihnp4!ames!jaw)
      Joe Orost (decvax!vax135!petsd!joe)
    */
    /** @internal */
    var EOF = -1;
    /** @internal */
    var BITS = 12;
    /** @internal */
    var HSIZE = 5003; // 80% occupancy
    /** @internal */
    var masks = [
        0x0000, 0x0001, 0x0003, 0x0007, 0x000F, 0x001F,
        0x003F, 0x007F, 0x00FF, 0x01FF, 0x03FF, 0x07FF,
        0x0FFF, 0x1FFF, 0x3FFF, 0x7FFF, 0xFFFF
    ];
    /** @internal */
    var LzwCompressor = /** @class */ (function () {
        function LzwCompressor(width, height, colorDepth) {
            this.accum = new Uint8Array(256);
            this.htab = new Int32Array(HSIZE);
            this.codetab = new Int32Array(HSIZE);
            this.cur_accum = 0;
            this.cur_bits = 0;
            this.curPixel = 0;
            this.free_ent = 0; // first unused entry
            // block compression parameters -- after all codes are used up,
            // and compression rate changes, start over.
            this.clear_flg = false;
            // Algorithm: use open addressing double hashing (no chaining) on the
            // prefix code / next character combination. We do a variant of Knuth's
            // algorithm D (vol. 3, sec. 6.4) along with G. Knott's relatively-prime
            // secondary probe. Here, the modular division first probe is gives way
            // to a faster exclusive-or manipulation. Also do block compression with
            // an adaptive reset, whereby the code table is cleared when the compression
            // ratio decreases, but after the table fills. The variable-length output
            // codes are re-sized at this point, and a special CLEAR code is generated
            // for the decompressor. Late addition: construct the table according to
            // file size for noticeable speed improvement on small files. Please direct
            // questions about this implementation to ames!jaw.
            this.g_init_bits = undefined;
            this.ClearCode = undefined;
            this.EOFCode = undefined;
            this.width = width;
            this.height = height;
            this.colorDepth = colorDepth;
            this.reset();
        }
        LzwCompressor.prototype.reset = function () {
            this.initCodeSize = Math.max(2, this.colorDepth);
            this.accum.fill(0);
            this.htab.fill(0);
            this.codetab.fill(0);
            this.cur_accum = 0;
            this.cur_bits = 0;
            this.curPixel = 0;
            this.free_ent = 0; // first unused entry
            this.maxcode;
            // block compression parameters -- after all codes are used up,
            // and compression rate changes, start over.
            this.clear_flg = false;
            // Algorithm: use open addressing double hashing (no chaining) on the
            // prefix code / next character combination. We do a variant of Knuth's
            // algorithm D (vol. 3, sec. 6.4) along with G. Knott's relatively-prime
            // secondary probe. Here, the modular division first probe is gives way
            // to a faster exclusive-or manipulation. Also do block compression with
            // an adaptive reset, whereby the code table is cleared when the compression
            // ratio decreases, but after the table fills. The variable-length output
            // codes are re-sized at this point, and a special CLEAR code is generated
            // for the decompressor. Late addition: construct the table according to
            // file size for noticeable speed improvement on small files. Please direct
            // questions about this implementation to ames!jaw.
            this.g_init_bits = undefined;
            this.ClearCode = undefined;
            this.EOFCode = undefined;
        };
        // Add a character to the end of the current packet, and if it is 254
        // characters, flush the packet to disk.
        LzwCompressor.prototype.char_out = function (c, outs) {
            this.accum[this.a_count++] = c;
            if (this.a_count >= 254)
                this.flush_char(outs);
        };
        // Clear out the hash table
        // table clear for block compress
        LzwCompressor.prototype.cl_block = function (outs) {
            this.cl_hash(HSIZE);
            this.free_ent = this.ClearCode + 2;
            this.clear_flg = true;
            this.output(this.ClearCode, outs);
        };
        // Reset code table
        LzwCompressor.prototype.cl_hash = function (hsize) {
            for (var i = 0; i < hsize; ++i)
                this.htab[i] = -1;
        };
        LzwCompressor.prototype.compress = function (init_bits, outs) {
            var fcode, c, i, ent, disp, hsize_reg, hshift;
            // Set up the globals: this.g_init_bits - initial number of bits
            this.g_init_bits = init_bits;
            // Set up the necessary values
            this.clear_flg = false;
            this.n_bits = this.g_init_bits;
            this.maxcode = this.get_maxcode(this.n_bits);
            this.ClearCode = 1 << (init_bits - 1);
            this.EOFCode = this.ClearCode + 1;
            this.free_ent = this.ClearCode + 2;
            this.a_count = 0; // clear packet
            ent = this.nextPixel();
            hshift = 0;
            for (fcode = HSIZE; fcode < 65536; fcode *= 2)
                ++hshift;
            hshift = 8 - hshift; // set hash code range bound
            hsize_reg = HSIZE;
            this.cl_hash(hsize_reg); // clear hash table
            this.output(this.ClearCode, outs);
            outer_loop: while ((c = this.nextPixel()) != EOF) {
                fcode = (c << BITS) + ent;
                i = (c << hshift) ^ ent; // xor hashing
                if (this.htab[i] === fcode) {
                    ent = this.codetab[i];
                    continue;
                }
                else if (this.htab[i] >= 0) { // non-empty slot
                    disp = hsize_reg - i; // secondary hash (after G. Knott)
                    if (i === 0) {
                        disp = 1;
                    }
                    do {
                        if ((i -= disp) < 0) {
                            i += hsize_reg;
                        }
                        if (this.htab[i] === fcode) {
                            ent = this.codetab[i];
                            continue outer_loop;
                        }
                    } while (this.htab[i] >= 0);
                }
                this.output(ent, outs);
                ent = c;
                if (this.free_ent < 1 << BITS) {
                    this.codetab[i] = this.free_ent++; // code -> hasthis.htable
                    this.htab[i] = fcode;
                }
                else {
                    this.cl_block(outs);
                }
            }
            // Put out the final code.
            this.output(ent, outs);
            this.output(this.EOFCode, outs);
        };
        LzwCompressor.prototype.encode = function (pixels, outs) {
            this.pixels = pixels;
            outs.writeByte(this.initCodeSize); // write 'initial code size' byte
            this.remaining = this.width * this.height; // reset navigation variables
            this.curPixel = 0;
            this.compress(this.initCodeSize + 1, outs); // compress and write the pixel data
            outs.writeByte(0); // write block terminator
        };
        // Flush the packet to disk, and reset the this.accumulator
        LzwCompressor.prototype.flush_char = function (outs) {
            if (this.a_count > 0) {
                outs.writeByte(this.a_count);
                outs.writeBytes(this.accum, 0, this.a_count);
                this.a_count = 0;
            }
        };
        LzwCompressor.prototype.get_maxcode = function (n_bits) {
            return (1 << n_bits) - 1;
        };
        // Return the next pixel from the image
        LzwCompressor.prototype.nextPixel = function () {
            if (this.remaining === 0)
                return EOF;
            --this.remaining;
            var pix = this.pixels[this.curPixel++];
            return pix & 0xff;
        };
        LzwCompressor.prototype.output = function (code, outs) {
            this.cur_accum &= masks[this.cur_bits];
            if (this.cur_bits > 0)
                this.cur_accum |= (code << this.cur_bits);
            else
                this.cur_accum = code;
            this.cur_bits += this.n_bits;
            while (this.cur_bits >= 8) {
                this.char_out((this.cur_accum & 0xff), outs);
                this.cur_accum >>= 8;
                this.cur_bits -= 8;
            }
            // If the next entry is going to be too big for the code size,
            // then increase it, if possible.
            if (this.free_ent > this.maxcode || this.clear_flg) {
                if (this.clear_flg) {
                    this.maxcode = this.get_maxcode(this.n_bits = this.g_init_bits);
                    this.clear_flg = false;
                }
                else {
                    ++this.n_bits;
                    if (this.n_bits == BITS)
                        this.maxcode = 1 << BITS;
                    else
                        this.maxcode = this.get_maxcode(this.n_bits);
                }
            }
            if (code == this.EOFCode) {
                // At EOF, write the rest of the buffer.
                while (this.cur_bits > 0) {
                    this.char_out((this.cur_accum & 0xff), outs);
                    this.cur_accum >>= 8;
                    this.cur_bits -= 8;
                }
                this.flush_char(outs);
            }
        };
        return LzwCompressor;
    }());

    /**
     * GIF image encoder
     *
     * Supports static single-frame GIF export as well as animated GIF
     * @category File Encoder
     */
    var GifImage = /** @class */ (function () {
        /**
         * Create a new GIF image object
         * @param width image width
         * @param height image height
         * @param settings image settings, such as whether it should loop, the delay between frames, etc
         */
        function GifImage(width, height, settings) {
            if (settings === void 0) { settings = {}; }
            /** Number of current GIF frames */
            this.numFrames = 0;
            this.dataUrl = null;
            this.width = width;
            this.height = height;
            this.data = new ByteArray();
            this.settings = __assign(__assign({}, GifImage.defaultSettings), settings);
            this.compressor = new LzwCompressor(width, height, settings.colorDepth);
        }
        /**
         * Create an animated GIF image from a Flipnote
         *
         * This will encode the entire animation, so depending on the number of frames it could take a while to return.
         * @param flipnote {@link PpmParser} or {@link KwzParser} instance
         * @param settings image settings, such as whether it should loop, the delay between frames, etc
         */
        GifImage.fromFlipnote = function (flipnote, settings) {
            if (settings === void 0) { settings = {}; }
            var gif = new GifImage(flipnote.width, flipnote.height, __assign({ delay: 100 / flipnote.framerate, repeat: flipnote.meta.loop ? -1 : 0 }, settings));
            gif.palette = flipnote.globalPalette;
            for (var frameIndex = 0; frameIndex < flipnote.frameCount; frameIndex++) {
                gif.writeFrame(flipnote.getFramePixels(frameIndex));
            }
            return gif;
        };
        /**
         * Create an GIF image from a single Flipnote frame
         * @param flipnote {@link PpmParser} or {@link KwzParser} instance
         * @param frameIndex animation frame index to encode
         * @param settings image settings, such as whether it should loop, the delay between frames, etc
         */
        GifImage.fromFlipnoteFrame = function (flipnote, frameIndex, settings) {
            if (settings === void 0) { settings = {}; }
            var gif = new GifImage(flipnote.width, flipnote.height, __assign({ 
                // TODO: look at ideal delay and repeat settings for single frame GIF
                delay: 100 / flipnote.framerate, repeat: -1 }, settings));
            gif.palette = flipnote.globalPalette;
            gif.writeFrame(flipnote.getFramePixels(frameIndex));
            return gif;
        };
        /**
         * Add a frame to the GIF image
         * @param pixels Raw pixels to encode, must be an uncompressed 8bit array of palette indices with a size matching image width * image height
         */
        GifImage.prototype.writeFrame = function (pixels) {
            if (this.numFrames === 0)
                this.writeFirstFrame(pixels);
            else
                this.writeAdditionalFrame(pixels);
            this.numFrames += 1;
        };
        GifImage.prototype.writeFirstFrame = function (pixels) {
            var paletteSize = this.palette.length;
            // calc colorDepth
            for (var p = 1; 1 << p < paletteSize; p += 1)
                continue;
            this.settings.colorDepth = p;
            this.writeHeader();
            this.writeColorTable();
            this.writeNetscapeExt();
            this.writeFrameHeader();
            this.writePixels(pixels);
        };
        GifImage.prototype.writeAdditionalFrame = function (pixels) {
            this.writeFrameHeader();
            this.writePixels(pixels);
        };
        GifImage.prototype.writeHeader = function () {
            var header = new DataStream(new ArrayBuffer(13));
            header.writeChars('GIF89a');
            // Logical Screen Descriptor
            header.writeUint16(this.width);
            header.writeUint16(this.height);
            header.writeUint8(0x80 | // 1 : global color table flag = 1 (gct used)
                (this.settings.colorDepth - 1) // 6-8 : gct size
            );
            header.writeBytes([
                0x0,
                0x0
            ]);
            this.data.writeBytes(new Uint8Array(header.buffer));
        };
        GifImage.prototype.writeColorTable = function () {
            var palette = new Uint8Array(3 * Math.pow(2, this.settings.colorDepth));
            var offset = 0;
            for (var index = 0; index < this.palette.length; index += 1) {
                var _a = this.palette[index], r = _a[0], g = _a[1], b = _a[2], a = _a[3];
                palette[offset++] = r;
                palette[offset++] = g;
                palette[offset++] = b;
            }
            this.data.writeBytes(palette);
        };
        GifImage.prototype.writeNetscapeExt = function () {
            var netscapeExt = new DataStream(new ArrayBuffer(19));
            netscapeExt.writeBytes([
                0x21,
                0xFF,
                11,
            ]);
            netscapeExt.writeChars('NETSCAPE2.0');
            netscapeExt.writeUint8(3); // subblock size
            netscapeExt.writeUint8(1); // loop subblock id
            netscapeExt.writeUint16(this.settings.repeat); // loop flag
            this.data.writeBytes(new Uint8Array(netscapeExt.buffer));
        };
        GifImage.prototype.writeFrameHeader = function () {
            var fHeader = new DataStream(new ArrayBuffer(18));
            // graphics control ext block
            var transparentFlag = this.settings.transparentBg ? 0x1 : 0x0;
            fHeader.writeBytes([
                0x21,
                0xF9,
                0x4,
                0x0 | transparentFlag // bitflags
            ]);
            fHeader.writeUint16(this.settings.delay); // loop flag
            fHeader.writeBytes([
                0x0,
                0x0
            ]);
            // image desc block
            fHeader.writeUint8(0x2C);
            fHeader.writeUint16(0); // image left
            fHeader.writeUint16(0); // image top
            fHeader.writeUint16(this.width);
            fHeader.writeUint16(this.height);
            fHeader.writeUint8(0);
            this.data.writeBytes(new Uint8Array(fHeader.buffer));
        };
        GifImage.prototype.writePixels = function (pixels) {
            this.compressor.colorDepth = this.settings.colorDepth;
            this.compressor.reset();
            this.compressor.encode(pixels, this.data);
        };
        /**
         * Returns the GIF image data as an ArrayBuffer
         */
        GifImage.prototype.getArrayBuffer = function () {
            return this.data.getBuffer();
        };
        /**
         * Returns the GIF image data as a NodeJS Buffer
         *
         * Note: This method does not work outside of node.js environments
         *
         * Buffer API: https://nodejs.org/api/buffer.html
         */
        GifImage.prototype.getBuffer = function () {
            if (isNode) {
                return Buffer.from(this.getArrayBuffer());
            }
            throw new Error('The Buffer object only available in Node.js environments');
        };
        /**
         * Returns the GIF image data as a file blob
         *
         * Blob API: https://developer.mozilla.org/en-US/docs/Web/API/Blob
         */
        GifImage.prototype.getBlob = function () {
            if (isBrowser) {
                return new Blob([this.getArrayBuffer()], { type: 'image/gif' });
            }
            throw new Error('The Blob object is only available in browser environments');
        };
        /**
         * Returns the GIF image data as an object URL
         *
         * Note: This method does not work outside of browser environments
         *
         * Object URL API: https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL
         */
        GifImage.prototype.getUrl = function () {
            if (isBrowser) {
                if (this.dataUrl)
                    return this.dataUrl;
                return window.URL.createObjectURL(this.getBlob());
            }
            throw new Error('Data URLs are only available in browser environments');
        };
        /**
         * Revokes this image's object URL if one has been created
         *
         * Note: This method does not work outside of browser environments
         *
         * Object URL API: https://developer.mozilla.org/en-US/docs/Web/API/URL/revokeObjectURL
         */
        GifImage.prototype.revokeUrl = function () {
            if (isBrowser) {
                if (this.dataUrl)
                    window.URL.revokeObjectURL(this.dataUrl);
            }
            else {
                throw new Error('Data URLs are only available in browser environments');
            }
        };
        /**
         * Returns the GIF image data as an Image object
         *
         * Note: This method does not work outside of browser environments
         *
         * Image API: https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/Image
         */
        GifImage.prototype.getImage = function () {
            if (isBrowser) {
                var img = new Image(this.width, this.height);
                img.src = this.getUrl();
                return img;
            }
            throw new Error('Image objects are only available in browser environments');
        };
        /**
         * Default GIF encoder settings
         */
        GifImage.defaultSettings = {
            transparentBg: false,
            delay: 100,
            repeat: -1,
            colorDepth: 8
        };
        return GifImage;
    }());

    /**
     * WAV audio encoder
     *
     * Creates WAV file containing uncompressed PCM audio data
     * WAV info: https://en.wikipedia.org/wiki/WAV
     * @category File Encoder
     */
    var WavAudio = /** @class */ (function () {
        /**
         * Create a WAV audio file
         * @param sampleRate audio samplerate
         * @param channels number of audio channels
         * @param bitsPerSample number of bits per sample
         */
        function WavAudio(sampleRate, channels, bitsPerSample) {
            if (channels === void 0) { channels = 1; }
            if (bitsPerSample === void 0) { bitsPerSample = 16; }
            this.sampleRate = sampleRate;
            this.channels = channels;
            this.bitsPerSample = bitsPerSample;
            // Write WAV file header
            // Reference: http://www.topherlee.com/software/pcm-tut-wavformat.html
            var headerBuffer = new ArrayBuffer(44);
            var header = new DataStream(headerBuffer);
            // 'RIFF' indent
            header.writeChars('RIFF');
            // filesize (set later)
            header.writeUint32(0);
            // 'WAVE' indent
            header.writeChars('WAVE');
            // 'fmt ' section header
            header.writeChars('fmt ');
            // fmt section length
            header.writeUint32(16);
            // specify audio format is pcm (type 1)
            header.writeUint16(1);
            // number of audio channels
            header.writeUint16(this.channels);
            // audio sample rate
            header.writeUint32(this.sampleRate);
            // byterate = (sampleRate * bitsPerSample * channelCount) / 8
            header.writeUint32((this.sampleRate * this.bitsPerSample * this.channels) / 8);
            // blockalign = (bitsPerSample * channels) / 8
            header.writeUint16((this.bitsPerSample * this.channels) / 8);
            // bits per sample
            header.writeUint16(this.bitsPerSample);
            // 'data' section header
            header.writeChars('data');
            // data section length (set later)
            header.writeUint32(0);
            this.header = header;
            this.pcmData = null;
        }
        /**
         * Create a WAV audio file from a Flipnote's master audio track
         * @param flipnote {@link PpmParser} or {@link KwzParser} instance
         * @param trackId {@link FlipnoteAudioTrack}
         */
        WavAudio.fromFlipnote = function (note) {
            var sampleRate = note.sampleRate;
            var wav = new WavAudio(sampleRate, 1, 16);
            var pcm = note.getAudioMasterPcm(sampleRate);
            wav.writeFrames(pcm);
            return wav;
        };
        /**
         * Create a WAV audio file from a given Flipnote audio track
         * @param flipnote {@link PpmParser} or {@link KwzParser} instance
         * @param trackId {@link FlipnoteAudioTrack}
         */
        WavAudio.fromFlipnoteTrack = function (flipnote, trackId) {
            var sampleRate = flipnote.sampleRate;
            var wav = new WavAudio(sampleRate, 1, 16);
            var pcm = flipnote.getAudioTrackPcm(trackId, sampleRate);
            wav.writeFrames(pcm);
            return wav;
        };
        /**
         * Add PCM audio frames to the WAV
         * @param pcmData signed int16 PCM audio samples
         */
        WavAudio.prototype.writeFrames = function (pcmData) {
            var header = this.header;
            // fill in filesize
            header.seek(4);
            header.writeUint32(header.byteLength + pcmData.byteLength);
            // fill in data section length
            header.seek(40);
            header.writeUint32(pcmData.byteLength);
            this.pcmData = pcmData;
        };
        /**
         * Returns the WAV audio data as an ArrayBuffer
         */
        WavAudio.prototype.getArrayBuffer = function () {
            var headerBytes = this.header.bytes;
            var pcmBytes = new Uint8Array(this.pcmData.buffer);
            var resultBytes = new Uint8Array(this.header.byteLength + this.pcmData.byteLength);
            resultBytes.set(headerBytes);
            resultBytes.set(pcmBytes, headerBytes.byteLength);
            return resultBytes.buffer;
        };
        /**
         * Returns the WAV audio data as a NodeJS Buffer
         *
         * Note: This method does not work outside of node.js environments
         *
         * Buffer API: https://nodejs.org/api/buffer.html
         */
        WavAudio.prototype.getBuffer = function () {
            if (isNode) {
                return Buffer.from(this.getArrayBuffer());
            }
            throw new Error('The Buffer object is only available in Node.js environments');
        };
        /**
         * Returns the GIF image data as a file blob
         *
         * Note: This method will not work outside of browser environments
         *
         * Blob API: https://developer.mozilla.org/en-US/docs/Web/API/Blob
         */
        WavAudio.prototype.getBlob = function () {
            if (isBrowser) {
                var buffer = this.getArrayBuffer();
                return new Blob([buffer], { type: 'audio/wav' });
            }
            throw new Error('The Blob object is only available in browser environments');
        };
        return WavAudio;
    }());

    /* @license twgl.js 4.15.2 Copyright (c) 2015, Gregg Tavares All Rights Reserved.
    Available via the MIT license.
    see: http://github.com/greggman/twgl.js for details */

    /*
     * Copyright 2019 Gregg Tavares
     *
     * Permission is hereby granted, free of charge, to any person obtaining a
     * copy of this software and associated documentation files (the "Software"),
     * to deal in the Software without restriction, including without limitation
     * the rights to use, copy, modify, merge, publish, distribute, sublicense,
     * and/or sell copies of the Software, and to permit persons to whom the
     * Software is furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
     * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
     * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
     * DEALINGS IN THE SOFTWARE.
     */

    /* DataType */
    const BYTE                           = 0x1400;
    const UNSIGNED_BYTE                  = 0x1401;
    const SHORT                          = 0x1402;
    const UNSIGNED_SHORT                 = 0x1403;
    const INT                            = 0x1404;
    const UNSIGNED_INT                   = 0x1405;
    const FLOAT                          = 0x1406;

    /**
     * Get the GL type for a typedArray
     * @param {ArrayBufferView} typedArray a typedArray
     * @return {number} the GL type for array. For example pass in an `Int8Array` and `gl.BYTE` will
     *   be returned. Pass in a `Uint32Array` and `gl.UNSIGNED_INT` will be returned
     * @memberOf module:twgl/typedArray
     */
    function getGLTypeForTypedArray(typedArray) {
      if (typedArray instanceof Int8Array)         { return BYTE; }           // eslint-disable-line
      if (typedArray instanceof Uint8Array)        { return UNSIGNED_BYTE; }  // eslint-disable-line
      if (typedArray instanceof Uint8ClampedArray) { return UNSIGNED_BYTE; }  // eslint-disable-line
      if (typedArray instanceof Int16Array)        { return SHORT; }          // eslint-disable-line
      if (typedArray instanceof Uint16Array)       { return UNSIGNED_SHORT; } // eslint-disable-line
      if (typedArray instanceof Int32Array)        { return INT; }            // eslint-disable-line
      if (typedArray instanceof Uint32Array)       { return UNSIGNED_INT; }   // eslint-disable-line
      if (typedArray instanceof Float32Array)      { return FLOAT; }          // eslint-disable-line
      throw new Error('unsupported typed array type');
    }

    /**
     * Get the GL type for a typedArray type
     * @param {ArrayBufferView} typedArrayType a typedArray constructor
     * @return {number} the GL type for type. For example pass in `Int8Array` and `gl.BYTE` will
     *   be returned. Pass in `Uint32Array` and `gl.UNSIGNED_INT` will be returned
     * @memberOf module:twgl/typedArray
     */
    function getGLTypeForTypedArrayType(typedArrayType) {
      if (typedArrayType === Int8Array)         { return BYTE; }           // eslint-disable-line
      if (typedArrayType === Uint8Array)        { return UNSIGNED_BYTE; }  // eslint-disable-line
      if (typedArrayType === Uint8ClampedArray) { return UNSIGNED_BYTE; }  // eslint-disable-line
      if (typedArrayType === Int16Array)        { return SHORT; }          // eslint-disable-line
      if (typedArrayType === Uint16Array)       { return UNSIGNED_SHORT; } // eslint-disable-line
      if (typedArrayType === Int32Array)        { return INT; }            // eslint-disable-line
      if (typedArrayType === Uint32Array)       { return UNSIGNED_INT; }   // eslint-disable-line
      if (typedArrayType === Float32Array)      { return FLOAT; }          // eslint-disable-line
      throw new Error('unsupported typed array type');
    }

    const isArrayBuffer = typeof SharedArrayBuffer !== 'undefined'
      ? function isArrayBufferOrSharedArrayBuffer(a) {
        return a && a.buffer && (a.buffer instanceof ArrayBuffer || a.buffer instanceof SharedArrayBuffer);
      }
      : function isArrayBuffer(a) {
        return a && a.buffer && a.buffer instanceof ArrayBuffer;
      };

    function isBuffer(gl, t) {
      return typeof WebGLBuffer !== 'undefined' && t instanceof WebGLBuffer;
    }

    function isTexture(gl, t) {
      return typeof WebGLTexture !== 'undefined' && t instanceof WebGLTexture;
    }

    /*
     * Copyright 2019 Gregg Tavares
     *
     * Permission is hereby granted, free of charge, to any person obtaining a
     * copy of this software and associated documentation files (the "Software"),
     * to deal in the Software without restriction, including without limitation
     * the rights to use, copy, modify, merge, publish, distribute, sublicense,
     * and/or sell copies of the Software, and to permit persons to whom the
     * Software is furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
     * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
     * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
     * DEALINGS IN THE SOFTWARE.
     */

    const STATIC_DRAW                  = 0x88e4;
    const ARRAY_BUFFER                 = 0x8892;
    const ELEMENT_ARRAY_BUFFER         = 0x8893;
    const BUFFER_SIZE                  = 0x8764;

    const BYTE$1                         = 0x1400;
    const UNSIGNED_BYTE$1                = 0x1401;
    const SHORT$1                        = 0x1402;
    const UNSIGNED_SHORT$1               = 0x1403;
    const INT$1                          = 0x1404;
    const UNSIGNED_INT$1                 = 0x1405;
    const FLOAT$1                        = 0x1406;
    const defaults = {
      attribPrefix: "",
    };

    function setBufferFromTypedArray(gl, type, buffer, array, drawType) {
      gl.bindBuffer(type, buffer);
      gl.bufferData(type, array, drawType || STATIC_DRAW);
    }

    /**
     * Given typed array creates a WebGLBuffer and copies the typed array
     * into it.
     *
     * @param {WebGLRenderingContext} gl A WebGLRenderingContext
     * @param {ArrayBuffer|SharedArrayBuffer|ArrayBufferView|WebGLBuffer} typedArray the typed array. Note: If a WebGLBuffer is passed in it will just be returned. No action will be taken
     * @param {number} [type] the GL bind type for the buffer. Default = `gl.ARRAY_BUFFER`.
     * @param {number} [drawType] the GL draw type for the buffer. Default = 'gl.STATIC_DRAW`.
     * @return {WebGLBuffer} the created WebGLBuffer
     * @memberOf module:twgl/attributes
     */
    function createBufferFromTypedArray(gl, typedArray, type, drawType) {
      if (isBuffer(gl, typedArray)) {
        return typedArray;
      }
      type = type || ARRAY_BUFFER;
      const buffer = gl.createBuffer();
      setBufferFromTypedArray(gl, type, buffer, typedArray, drawType);
      return buffer;
    }

    function isIndices(name) {
      return name === "indices";
    }

    // This is really just a guess. Though I can't really imagine using
    // anything else? Maybe for some compression?
    function getNormalizationForTypedArray(typedArray) {
      if (typedArray instanceof Int8Array)    { return true; }  // eslint-disable-line
      if (typedArray instanceof Uint8Array)   { return true; }  // eslint-disable-line
      return false;
    }

    // This is really just a guess. Though I can't really imagine using
    // anything else? Maybe for some compression?
    function getNormalizationForTypedArrayType(typedArrayType) {
      if (typedArrayType === Int8Array)    { return true; }  // eslint-disable-line
      if (typedArrayType === Uint8Array)   { return true; }  // eslint-disable-line
      return false;
    }

    function getArray(array) {
      return array.length ? array : array.data;
    }

    const texcoordRE = /coord|texture/i;
    const colorRE = /color|colour/i;

    function guessNumComponentsFromName(name, length) {
      let numComponents;
      if (texcoordRE.test(name)) {
        numComponents = 2;
      } else if (colorRE.test(name)) {
        numComponents = 4;
      } else {
        numComponents = 3;  // position, normals, indices ...
      }

      if (length % numComponents > 0) {
        throw new Error(`Can not guess numComponents for attribute '${name}'. Tried ${numComponents} but ${length} values is not evenly divisible by ${numComponents}. You should specify it.`);
      }

      return numComponents;
    }

    function getNumComponents(array, arrayName) {
      return array.numComponents || array.size || guessNumComponentsFromName(arrayName, getArray(array).length);
    }

    function makeTypedArray(array, name) {
      if (isArrayBuffer(array)) {
        return array;
      }

      if (isArrayBuffer(array.data)) {
        return array.data;
      }

      if (Array.isArray(array)) {
        array = {
          data: array,
        };
      }

      let Type = array.type;
      if (!Type) {
        if (isIndices(name)) {
          Type = Uint16Array;
        } else {
          Type = Float32Array;
        }
      }
      return new Type(array.data);
    }

    /**
     * The info for an attribute. This is effectively just the arguments to `gl.vertexAttribPointer` plus the WebGLBuffer
     * for the attribute.
     *
     * @typedef {Object} AttribInfo
     * @property {number[]|ArrayBufferView} [value] a constant value for the attribute. Note: if this is set the attribute will be
     *    disabled and set to this constant value and all other values will be ignored.
     * @property {number} [numComponents] the number of components for this attribute.
     * @property {number} [size] synonym for `numComponents`.
     * @property {number} [type] the type of the attribute (eg. `gl.FLOAT`, `gl.UNSIGNED_BYTE`, etc...) Default = `gl.FLOAT`
     * @property {boolean} [normalize] whether or not to normalize the data. Default = false
     * @property {number} [offset] offset into buffer in bytes. Default = 0
     * @property {number} [stride] the stride in bytes per element. Default = 0
     * @property {number} [divisor] the divisor in instances. Default = undefined. Note: undefined = don't call gl.vertexAttribDivisor
     *    where as anything else = do call it with this value
     * @property {WebGLBuffer} buffer the buffer that contains the data for this attribute
     * @property {number} [drawType] the draw type passed to gl.bufferData. Default = gl.STATIC_DRAW
     * @memberOf module:twgl
     */

    /**
     * Use this type of array spec when TWGL can't guess the type or number of components of an array
     * @typedef {Object} FullArraySpec
     * @property {number[]|ArrayBufferView} [value] a constant value for the attribute. Note: if this is set the attribute will be
     *    disabled and set to this constant value and all other values will be ignored.
     * @property {(number|number[]|ArrayBufferView)} data The data of the array. A number alone becomes the number of elements of type.
     * @property {number} [numComponents] number of components for `vertexAttribPointer`. Default is based on the name of the array.
     *    If `coord` is in the name assumes `numComponents = 2`.
     *    If `color` is in the name assumes `numComponents = 4`.
     *    otherwise assumes `numComponents = 3`
     * @property {constructor} [type] type. This is only used if `data` is a JavaScript array. It is the constructor for the typedarray. (eg. `Uint8Array`).
     * For example if you want colors in a `Uint8Array` you might have a `FullArraySpec` like `{ type: Uint8Array, data: [255,0,255,255, ...], }`.
     * @property {number} [size] synonym for `numComponents`.
     * @property {boolean} [normalize] normalize for `vertexAttribPointer`. Default is true if type is `Int8Array` or `Uint8Array` otherwise false.
     * @property {number} [stride] stride for `vertexAttribPointer`. Default = 0
     * @property {number} [offset] offset for `vertexAttribPointer`. Default = 0
     * @property {number} [divisor] divisor for `vertexAttribDivisor`. Default = undefined. Note: undefined = don't call gl.vertexAttribDivisor
     *    where as anything else = do call it with this value
     * @property {string} [attrib] name of attribute this array maps to. Defaults to same name as array prefixed by the default attribPrefix.
     * @property {string} [name] synonym for `attrib`.
     * @property {string} [attribName] synonym for `attrib`.
     * @property {WebGLBuffer} [buffer] Buffer to use for this attribute. This lets you use your own buffer
     *    but you will need to supply `numComponents` and `type`. You can effectively pass an `AttribInfo`
     *    to provide this. Example:
     *
     *         const bufferInfo1 = twgl.createBufferInfoFromArrays(gl, {
     *           position: [1, 2, 3, ... ],
     *         });
     *         const bufferInfo2 = twgl.createBufferInfoFromArrays(gl, {
     *           position: bufferInfo1.attribs.position,  // use the same buffer from bufferInfo1
     *         });
     *
     * @memberOf module:twgl
     */

    /**
     * An individual array in {@link module:twgl.Arrays}
     *
     * When passed to {@link module:twgl.createBufferInfoFromArrays} if an ArraySpec is `number[]` or `ArrayBufferView`
     * the types will be guessed based on the name. `indices` will be `Uint16Array`, everything else will
     * be `Float32Array`. If an ArraySpec is a number it's the number of floats for an empty (zeroed) buffer.
     *
     * @typedef {(number|number[]|ArrayBufferView|module:twgl.FullArraySpec)} ArraySpec
     * @memberOf module:twgl
     */

    /**
     * This is a JavaScript object of arrays by name. The names should match your shader's attributes. If your
     * attributes have a common prefix you can specify it by calling {@link module:twgl.setAttributePrefix}.
     *
     *     Bare JavaScript Arrays
     *
     *         var arrays = {
     *            position: [-1, 1, 0],
     *            normal: [0, 1, 0],
     *            ...
     *         }
     *
     *     Bare TypedArrays
     *
     *         var arrays = {
     *            position: new Float32Array([-1, 1, 0]),
     *            color: new Uint8Array([255, 128, 64, 255]),
     *            ...
     *         }
     *
     * *   Will guess at `numComponents` if not specified based on name.
     *
     *     If `coord` is in the name assumes `numComponents = 2`
     *
     *     If `color` is in the name assumes `numComponents = 4`
     *
     *     otherwise assumes `numComponents = 3`
     *
     * Objects with various fields. See {@link module:twgl.FullArraySpec}.
     *
     *     var arrays = {
     *       position: { numComponents: 3, data: [0, 0, 0, 10, 0, 0, 0, 10, 0, 10, 10, 0], },
     *       texcoord: { numComponents: 2, data: [0, 0, 0, 1, 1, 0, 1, 1],                 },
     *       normal:   { numComponents: 3, data: [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],     },
     *       indices:  { numComponents: 3, data: [0, 1, 2, 1, 2, 3],                       },
     *     };
     *
     * @typedef {Object.<string, module:twgl.ArraySpec>} Arrays
     * @memberOf module:twgl
     */


    /**
     * Creates a set of attribute data and WebGLBuffers from set of arrays
     *
     * Given
     *
     *      var arrays = {
     *        position: { numComponents: 3, data: [0, 0, 0, 10, 0, 0, 0, 10, 0, 10, 10, 0], },
     *        texcoord: { numComponents: 2, data: [0, 0, 0, 1, 1, 0, 1, 1],                 },
     *        normal:   { numComponents: 3, data: [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],     },
     *        color:    { numComponents: 4, data: [255, 255, 255, 255, 255, 0, 0, 255, 0, 0, 255, 255], type: Uint8Array, },
     *        indices:  { numComponents: 3, data: [0, 1, 2, 1, 2, 3],                       },
     *      };
     *
     * returns something like
     *
     *      var attribs = {
     *        position: { numComponents: 3, type: gl.FLOAT,         normalize: false, buffer: WebGLBuffer, },
     *        texcoord: { numComponents: 2, type: gl.FLOAT,         normalize: false, buffer: WebGLBuffer, },
     *        normal:   { numComponents: 3, type: gl.FLOAT,         normalize: false, buffer: WebGLBuffer, },
     *        color:    { numComponents: 4, type: gl.UNSIGNED_BYTE, normalize: true,  buffer: WebGLBuffer, },
     *      };
     *
     * notes:
     *
     * *   Arrays can take various forms
     *
     *     Bare JavaScript Arrays
     *
     *         var arrays = {
     *            position: [-1, 1, 0],
     *            normal: [0, 1, 0],
     *            ...
     *         }
     *
     *     Bare TypedArrays
     *
     *         var arrays = {
     *            position: new Float32Array([-1, 1, 0]),
     *            color: new Uint8Array([255, 128, 64, 255]),
     *            ...
     *         }
     *
     * *   Will guess at `numComponents` if not specified based on name.
     *
     *     If `coord` is in the name assumes `numComponents = 2`
     *
     *     If `color` is in the name assumes `numComponents = 4`
     *
     *     otherwise assumes `numComponents = 3`
     *
     * @param {WebGLRenderingContext} gl The webgl rendering context.
     * @param {module:twgl.Arrays} arrays The arrays
     * @param {module:twgl.BufferInfo} [srcBufferInfo] a BufferInfo to copy from
     *   This lets you share buffers. Any arrays you supply will override
     *   the buffers from srcBufferInfo.
     * @return {Object.<string, module:twgl.AttribInfo>} the attribs
     * @memberOf module:twgl/attributes
     */
    function createAttribsFromArrays(gl, arrays) {
      const attribs = {};
      Object.keys(arrays).forEach(function(arrayName) {
        if (!isIndices(arrayName)) {
          const array = arrays[arrayName];
          const attribName = array.attrib || array.name || array.attribName || (defaults.attribPrefix + arrayName);
          if (array.value) {
            if (!Array.isArray(array.value) && !isArrayBuffer(array.value)) {
              throw new Error('array.value is not array or typedarray');
            }
            attribs[attribName] = {
              value: array.value,
            };
          } else {
            let buffer;
            let type;
            let normalization;
            let numComponents;
            if (array.buffer && array.buffer instanceof WebGLBuffer) {
              buffer = array.buffer;
              numComponents = array.numComponents || array.size;
              type = array.type;
              normalization = array.normalize;
            } else if (typeof array === "number" || typeof array.data === "number") {
              const numValues = array.data || array;
              const arrayType = array.type || Float32Array;
              const numBytes = numValues * arrayType.BYTES_PER_ELEMENT;
              type = getGLTypeForTypedArrayType(arrayType);
              normalization = array.normalize !== undefined ? array.normalize : getNormalizationForTypedArrayType(arrayType);
              numComponents = array.numComponents || array.size || guessNumComponentsFromName(arrayName, numValues);
              buffer = gl.createBuffer();
              gl.bindBuffer(ARRAY_BUFFER, buffer);
              gl.bufferData(ARRAY_BUFFER, numBytes, array.drawType || STATIC_DRAW);
            } else {
              const typedArray = makeTypedArray(array, arrayName);
              buffer = createBufferFromTypedArray(gl, typedArray, undefined, array.drawType);
              type = getGLTypeForTypedArray(typedArray);
              normalization = array.normalize !== undefined ? array.normalize : getNormalizationForTypedArray(typedArray);
              numComponents = getNumComponents(array, arrayName);
            }
            attribs[attribName] = {
              buffer:        buffer,
              numComponents: numComponents,
              type:          type,
              normalize:     normalization,
              stride:        array.stride || 0,
              offset:        array.offset || 0,
              divisor:       array.divisor === undefined ? undefined : array.divisor,
              drawType:      array.drawType,
            };
          }
        }
      });
      gl.bindBuffer(ARRAY_BUFFER, null);
      return attribs;
    }

    function getBytesPerValueForGLType(gl, type) {
      if (type === BYTE$1)           return 1;  // eslint-disable-line
      if (type === UNSIGNED_BYTE$1)  return 1;  // eslint-disable-line
      if (type === SHORT$1)          return 2;  // eslint-disable-line
      if (type === UNSIGNED_SHORT$1) return 2;  // eslint-disable-line
      if (type === INT$1)            return 4;  // eslint-disable-line
      if (type === UNSIGNED_INT$1)   return 4;  // eslint-disable-line
      if (type === FLOAT$1)          return 4;  // eslint-disable-line
      return 0;
    }

    // Tries to get the number of elements from a set of arrays.
    const positionKeys = ['position', 'positions', 'a_position'];

    function getNumElementsFromAttributes(gl, attribs) {
      let key;
      let ii;
      for (ii = 0; ii < positionKeys.length; ++ii) {
        key = positionKeys[ii];
        if (key in attribs) {
          break;
        }
        key = defaults.attribPrefix + key;
        if (key in attribs) {
          break;
        }
      }
      if (ii === positionKeys.length) {
        key = Object.keys(attribs)[0];
      }
      const attrib = attribs[key];
      gl.bindBuffer(ARRAY_BUFFER, attrib.buffer);
      const numBytes = gl.getBufferParameter(ARRAY_BUFFER, BUFFER_SIZE);
      gl.bindBuffer(ARRAY_BUFFER, null);

      const bytesPerValue = getBytesPerValueForGLType(gl, attrib.type);
      const totalElements = numBytes / bytesPerValue;
      const numComponents = attrib.numComponents || attrib.size;
      // TODO: check stride
      const numElements = totalElements / numComponents;
      if (numElements % 1 !== 0) {
        throw new Error(`numComponents ${numComponents} not correct for length ${length}`);
      }
      return numElements;
    }

    /**
     * @typedef {Object} BufferInfo
     * @property {number} numElements The number of elements to pass to `gl.drawArrays` or `gl.drawElements`.
     * @property {number} [elementType] The type of indices `UNSIGNED_BYTE`, `UNSIGNED_SHORT` etc..
     * @property {WebGLBuffer} [indices] The indices `ELEMENT_ARRAY_BUFFER` if any indices exist.
     * @property {Object.<string, module:twgl.AttribInfo>} [attribs] The attribs appropriate to call `setAttributes`
     * @memberOf module:twgl
     */

    /**
     * Creates a BufferInfo from an object of arrays.
     *
     * This can be passed to {@link module:twgl.setBuffersAndAttributes} and to
     * {@link module:twgl:drawBufferInfo}.
     *
     * Given an object like
     *
     *     var arrays = {
     *       position: { numComponents: 3, data: [0, 0, 0, 10, 0, 0, 0, 10, 0, 10, 10, 0], },
     *       texcoord: { numComponents: 2, data: [0, 0, 0, 1, 1, 0, 1, 1],                 },
     *       normal:   { numComponents: 3, data: [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],     },
     *       indices:  { numComponents: 3, data: [0, 1, 2, 1, 2, 3],                       },
     *     };
     *
     *  Creates an BufferInfo like this
     *
     *     bufferInfo = {
     *       numElements: 4,        // or whatever the number of elements is
     *       indices: WebGLBuffer,  // this property will not exist if there are no indices
     *       attribs: {
     *         position: { buffer: WebGLBuffer, numComponents: 3, },
     *         normal:   { buffer: WebGLBuffer, numComponents: 3, },
     *         texcoord: { buffer: WebGLBuffer, numComponents: 2, },
     *       },
     *     };
     *
     *  The properties of arrays can be JavaScript arrays in which case the number of components
     *  will be guessed.
     *
     *     var arrays = {
     *        position: [0, 0, 0, 10, 0, 0, 0, 10, 0, 10, 10, 0],
     *        texcoord: [0, 0, 0, 1, 1, 0, 1, 1],
     *        normal:   [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
     *        indices:  [0, 1, 2, 1, 2, 3],
     *     };
     *
     *  They can also be TypedArrays
     *
     *     var arrays = {
     *        position: new Float32Array([0, 0, 0, 10, 0, 0, 0, 10, 0, 10, 10, 0]),
     *        texcoord: new Float32Array([0, 0, 0, 1, 1, 0, 1, 1]),
     *        normal:   new Float32Array([0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1]),
     *        indices:  new Uint16Array([0, 1, 2, 1, 2, 3]),
     *     };
     *
     *  Or AugmentedTypedArrays
     *
     *     var positions = createAugmentedTypedArray(3, 4);
     *     var texcoords = createAugmentedTypedArray(2, 4);
     *     var normals   = createAugmentedTypedArray(3, 4);
     *     var indices   = createAugmentedTypedArray(3, 2, Uint16Array);
     *
     *     positions.push([0, 0, 0, 10, 0, 0, 0, 10, 0, 10, 10, 0]);
     *     texcoords.push([0, 0, 0, 1, 1, 0, 1, 1]);
     *     normals.push([0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1]);
     *     indices.push([0, 1, 2, 1, 2, 3]);
     *
     *     var arrays = {
     *        position: positions,
     *        texcoord: texcoords,
     *        normal:   normals,
     *        indices:  indices,
     *     };
     *
     * For the last example it is equivalent to
     *
     *     var bufferInfo = {
     *       attribs: {
     *         position: { numComponents: 3, buffer: gl.createBuffer(), },
     *         texcoord: { numComponents: 2, buffer: gl.createBuffer(), },
     *         normal: { numComponents: 3, buffer: gl.createBuffer(), },
     *       },
     *       indices: gl.createBuffer(),
     *       numElements: 6,
     *     };
     *
     *     gl.bindBuffer(gl.ARRAY_BUFFER, bufferInfo.attribs.position.buffer);
     *     gl.bufferData(gl.ARRAY_BUFFER, arrays.position, gl.STATIC_DRAW);
     *     gl.bindBuffer(gl.ARRAY_BUFFER, bufferInfo.attribs.texcoord.buffer);
     *     gl.bufferData(gl.ARRAY_BUFFER, arrays.texcoord, gl.STATIC_DRAW);
     *     gl.bindBuffer(gl.ARRAY_BUFFER, bufferInfo.attribs.normal.buffer);
     *     gl.bufferData(gl.ARRAY_BUFFER, arrays.normal, gl.STATIC_DRAW);
     *     gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, bufferInfo.indices);
     *     gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, arrays.indices, gl.STATIC_DRAW);
     *
     * @param {WebGLRenderingContext} gl A WebGLRenderingContext
     * @param {module:twgl.Arrays} arrays Your data
     * @param {module:twgl.BufferInfo} [srcBufferInfo] An existing
     *        buffer info to start from. WebGLBuffers etc specified
     *        in the srcBufferInfo will be used in a new BufferInfo
     *        with any arrays specified overriding the ones in
     *        srcBufferInfo.
     * @return {module:twgl.BufferInfo} A BufferInfo
     * @memberOf module:twgl/attributes
     */
    function createBufferInfoFromArrays(gl, arrays, srcBufferInfo) {
      const newAttribs = createAttribsFromArrays(gl, arrays);
      const bufferInfo = Object.assign({}, srcBufferInfo ? srcBufferInfo : {});
      bufferInfo.attribs = Object.assign({}, srcBufferInfo ? srcBufferInfo.attribs : {}, newAttribs);
      const indices = arrays.indices;
      if (indices) {
        const newIndices = makeTypedArray(indices, "indices");
        bufferInfo.indices = createBufferFromTypedArray(gl, newIndices, ELEMENT_ARRAY_BUFFER);
        bufferInfo.numElements = newIndices.length;
        bufferInfo.elementType = getGLTypeForTypedArray(newIndices);
      } else if (!bufferInfo.numElements) {
        bufferInfo.numElements = getNumElementsFromAttributes(gl, bufferInfo.attribs);
      }

      return bufferInfo;
    }

    /*
     * Copyright 2019 Gregg Tavares
     *
     * Permission is hereby granted, free of charge, to any person obtaining a
     * copy of this software and associated documentation files (the "Software"),
     * to deal in the Software without restriction, including without limitation
     * the rights to use, copy, modify, merge, publish, distribute, sublicense,
     * and/or sell copies of the Software, and to permit persons to whom the
     * Software is furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
     * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
     * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
     * DEALINGS IN THE SOFTWARE.
     */

    /**
     * Gets the gl version as a number
     * @param {WebGLRenderingContext} gl A WebGLRenderingContext
     * @return {number} version of gl
     * @private
     */
    //function getVersionAsNumber(gl) {
    //  return parseFloat(gl.getParameter(gl."5.0.0").substr(6));
    //}

    /**
     * Check if context is WebGL 2.0
     * @param {WebGLRenderingContext} gl A WebGLRenderingContext
     * @return {bool} true if it's WebGL 2.0
     * @memberOf module:twgl
     */
    function isWebGL2(gl) {
      // This is the correct check but it's slow
      //  return gl.getParameter(gl."5.0.0").indexOf("WebGL 2.0") === 0;
      // This might also be the correct check but I'm assuming it's slow-ish
      // return gl instanceof WebGL2RenderingContext;
      return !!gl.texStorage2D;
    }

    const TEXTURE0                       = 0x84c0;

    const ARRAY_BUFFER$1                   = 0x8892;

    const ACTIVE_UNIFORMS                = 0x8b86;
    const ACTIVE_ATTRIBUTES              = 0x8b89;
    const TRANSFORM_FEEDBACK_VARYINGS    = 0x8c83;
    const ACTIVE_UNIFORM_BLOCKS          = 0x8a36;
    const UNIFORM_BLOCK_REFERENCED_BY_VERTEX_SHADER   = 0x8a44;
    const UNIFORM_BLOCK_REFERENCED_BY_FRAGMENT_SHADER = 0x8a46;
    const UNIFORM_BLOCK_DATA_SIZE                     = 0x8a40;
    const UNIFORM_BLOCK_ACTIVE_UNIFORM_INDICES        = 0x8a43;

    const FLOAT$3                         = 0x1406;
    const FLOAT_VEC2                    = 0x8B50;
    const FLOAT_VEC3                    = 0x8B51;
    const FLOAT_VEC4                    = 0x8B52;
    const INT$3                           = 0x1404;
    const INT_VEC2                      = 0x8B53;
    const INT_VEC3                      = 0x8B54;
    const INT_VEC4                      = 0x8B55;
    const BOOL                          = 0x8B56;
    const BOOL_VEC2                     = 0x8B57;
    const BOOL_VEC3                     = 0x8B58;
    const BOOL_VEC4                     = 0x8B59;
    const FLOAT_MAT2                    = 0x8B5A;
    const FLOAT_MAT3                    = 0x8B5B;
    const FLOAT_MAT4                    = 0x8B5C;
    const SAMPLER_2D                    = 0x8B5E;
    const SAMPLER_CUBE                  = 0x8B60;
    const SAMPLER_3D                    = 0x8B5F;
    const SAMPLER_2D_SHADOW             = 0x8B62;
    const FLOAT_MAT2x3                  = 0x8B65;
    const FLOAT_MAT2x4                  = 0x8B66;
    const FLOAT_MAT3x2                  = 0x8B67;
    const FLOAT_MAT3x4                  = 0x8B68;
    const FLOAT_MAT4x2                  = 0x8B69;
    const FLOAT_MAT4x3                  = 0x8B6A;
    const SAMPLER_2D_ARRAY              = 0x8DC1;
    const SAMPLER_2D_ARRAY_SHADOW       = 0x8DC4;
    const SAMPLER_CUBE_SHADOW           = 0x8DC5;
    const UNSIGNED_INT$3                  = 0x1405;
    const UNSIGNED_INT_VEC2             = 0x8DC6;
    const UNSIGNED_INT_VEC3             = 0x8DC7;
    const UNSIGNED_INT_VEC4             = 0x8DC8;
    const INT_SAMPLER_2D                = 0x8DCA;
    const INT_SAMPLER_3D                = 0x8DCB;
    const INT_SAMPLER_CUBE              = 0x8DCC;
    const INT_SAMPLER_2D_ARRAY          = 0x8DCF;
    const UNSIGNED_INT_SAMPLER_2D       = 0x8DD2;
    const UNSIGNED_INT_SAMPLER_3D       = 0x8DD3;
    const UNSIGNED_INT_SAMPLER_CUBE     = 0x8DD4;
    const UNSIGNED_INT_SAMPLER_2D_ARRAY = 0x8DD7;

    const TEXTURE_2D$1                    = 0x0DE1;
    const TEXTURE_CUBE_MAP$1              = 0x8513;
    const TEXTURE_3D$1                    = 0x806F;
    const TEXTURE_2D_ARRAY$1              = 0x8C1A;

    const typeMap = {};

    /**
     * Returns the corresponding bind point for a given sampler type
     */
    function getBindPointForSamplerType(gl, type) {
      return typeMap[type].bindPoint;
    }

    // This kind of sucks! If you could compose functions as in `var fn = gl[name];`
    // this code could be a lot smaller but that is sadly really slow (T_T)

    function floatSetter(gl, location) {
      return function(v) {
        gl.uniform1f(location, v);
      };
    }

    function floatArraySetter(gl, location) {
      return function(v) {
        gl.uniform1fv(location, v);
      };
    }

    function floatVec2Setter(gl, location) {
      return function(v) {
        gl.uniform2fv(location, v);
      };
    }

    function floatVec3Setter(gl, location) {
      return function(v) {
        gl.uniform3fv(location, v);
      };
    }

    function floatVec4Setter(gl, location) {
      return function(v) {
        gl.uniform4fv(location, v);
      };
    }

    function intSetter(gl, location) {
      return function(v) {
        gl.uniform1i(location, v);
      };
    }

    function intArraySetter(gl, location) {
      return function(v) {
        gl.uniform1iv(location, v);
      };
    }

    function intVec2Setter(gl, location) {
      return function(v) {
        gl.uniform2iv(location, v);
      };
    }

    function intVec3Setter(gl, location) {
      return function(v) {
        gl.uniform3iv(location, v);
      };
    }

    function intVec4Setter(gl, location) {
      return function(v) {
        gl.uniform4iv(location, v);
      };
    }

    function uintSetter(gl, location) {
      return function(v) {
        gl.uniform1ui(location, v);
      };
    }

    function uintArraySetter(gl, location) {
      return function(v) {
        gl.uniform1uiv(location, v);
      };
    }

    function uintVec2Setter(gl, location) {
      return function(v) {
        gl.uniform2uiv(location, v);
      };
    }

    function uintVec3Setter(gl, location) {
      return function(v) {
        gl.uniform3uiv(location, v);
      };
    }

    function uintVec4Setter(gl, location) {
      return function(v) {
        gl.uniform4uiv(location, v);
      };
    }

    function floatMat2Setter(gl, location) {
      return function(v) {
        gl.uniformMatrix2fv(location, false, v);
      };
    }

    function floatMat3Setter(gl, location) {
      return function(v) {
        gl.uniformMatrix3fv(location, false, v);
      };
    }

    function floatMat4Setter(gl, location) {
      return function(v) {
        gl.uniformMatrix4fv(location, false, v);
      };
    }

    function floatMat23Setter(gl, location) {
      return function(v) {
        gl.uniformMatrix2x3fv(location, false, v);
      };
    }

    function floatMat32Setter(gl, location) {
      return function(v) {
        gl.uniformMatrix3x2fv(location, false, v);
      };
    }

    function floatMat24Setter(gl, location) {
      return function(v) {
        gl.uniformMatrix2x4fv(location, false, v);
      };
    }

    function floatMat42Setter(gl, location) {
      return function(v) {
        gl.uniformMatrix4x2fv(location, false, v);
      };
    }

    function floatMat34Setter(gl, location) {
      return function(v) {
        gl.uniformMatrix3x4fv(location, false, v);
      };
    }

    function floatMat43Setter(gl, location) {
      return function(v) {
        gl.uniformMatrix4x3fv(location, false, v);
      };
    }

    function samplerSetter(gl, type, unit, location) {
      const bindPoint = getBindPointForSamplerType(gl, type);
      return isWebGL2(gl) ? function(textureOrPair) {
        let texture;
        let sampler;
        if (isTexture(gl, textureOrPair)) {
          texture = textureOrPair;
          sampler = null;
        } else {
          texture = textureOrPair.texture;
          sampler = textureOrPair.sampler;
        }
        gl.uniform1i(location, unit);
        gl.activeTexture(TEXTURE0 + unit);
        gl.bindTexture(bindPoint, texture);
        gl.bindSampler(unit, sampler);
      } : function(texture) {
        gl.uniform1i(location, unit);
        gl.activeTexture(TEXTURE0 + unit);
        gl.bindTexture(bindPoint, texture);
      };
    }

    function samplerArraySetter(gl, type, unit, location, size) {
      const bindPoint = getBindPointForSamplerType(gl, type);
      const units = new Int32Array(size);
      for (let ii = 0; ii < size; ++ii) {
        units[ii] = unit + ii;
      }

      return isWebGL2(gl) ? function(textures) {
        gl.uniform1iv(location, units);
        textures.forEach(function(textureOrPair, index) {
          gl.activeTexture(TEXTURE0 + units[index]);
          let texture;
          let sampler;
          if (isTexture(gl, textureOrPair)) {
            texture = textureOrPair;
            sampler = null;
          } else {
            texture = textureOrPair.texture;
            sampler = textureOrPair.sampler;
          }
          gl.bindSampler(unit, sampler);
          gl.bindTexture(bindPoint, texture);
        });
      } : function(textures) {
        gl.uniform1iv(location, units);
        textures.forEach(function(texture, index) {
          gl.activeTexture(TEXTURE0 + units[index]);
          gl.bindTexture(bindPoint, texture);
        });
      };
    }

    typeMap[FLOAT$3]                         = { Type: Float32Array, size:  4, setter: floatSetter,      arraySetter: floatArraySetter, };
    typeMap[FLOAT_VEC2]                    = { Type: Float32Array, size:  8, setter: floatVec2Setter,  };
    typeMap[FLOAT_VEC3]                    = { Type: Float32Array, size: 12, setter: floatVec3Setter,  };
    typeMap[FLOAT_VEC4]                    = { Type: Float32Array, size: 16, setter: floatVec4Setter,  };
    typeMap[INT$3]                           = { Type: Int32Array,   size:  4, setter: intSetter,        arraySetter: intArraySetter, };
    typeMap[INT_VEC2]                      = { Type: Int32Array,   size:  8, setter: intVec2Setter,    };
    typeMap[INT_VEC3]                      = { Type: Int32Array,   size: 12, setter: intVec3Setter,    };
    typeMap[INT_VEC4]                      = { Type: Int32Array,   size: 16, setter: intVec4Setter,    };
    typeMap[UNSIGNED_INT$3]                  = { Type: Uint32Array,  size:  4, setter: uintSetter,       arraySetter: uintArraySetter, };
    typeMap[UNSIGNED_INT_VEC2]             = { Type: Uint32Array,  size:  8, setter: uintVec2Setter,   };
    typeMap[UNSIGNED_INT_VEC3]             = { Type: Uint32Array,  size: 12, setter: uintVec3Setter,   };
    typeMap[UNSIGNED_INT_VEC4]             = { Type: Uint32Array,  size: 16, setter: uintVec4Setter,   };
    typeMap[BOOL]                          = { Type: Uint32Array,  size:  4, setter: intSetter,        arraySetter: intArraySetter, };
    typeMap[BOOL_VEC2]                     = { Type: Uint32Array,  size:  8, setter: intVec2Setter,    };
    typeMap[BOOL_VEC3]                     = { Type: Uint32Array,  size: 12, setter: intVec3Setter,    };
    typeMap[BOOL_VEC4]                     = { Type: Uint32Array,  size: 16, setter: intVec4Setter,    };
    typeMap[FLOAT_MAT2]                    = { Type: Float32Array, size: 16, setter: floatMat2Setter,  };
    typeMap[FLOAT_MAT3]                    = { Type: Float32Array, size: 36, setter: floatMat3Setter,  };
    typeMap[FLOAT_MAT4]                    = { Type: Float32Array, size: 64, setter: floatMat4Setter,  };
    typeMap[FLOAT_MAT2x3]                  = { Type: Float32Array, size: 24, setter: floatMat23Setter, };
    typeMap[FLOAT_MAT2x4]                  = { Type: Float32Array, size: 32, setter: floatMat24Setter, };
    typeMap[FLOAT_MAT3x2]                  = { Type: Float32Array, size: 24, setter: floatMat32Setter, };
    typeMap[FLOAT_MAT3x4]                  = { Type: Float32Array, size: 48, setter: floatMat34Setter, };
    typeMap[FLOAT_MAT4x2]                  = { Type: Float32Array, size: 32, setter: floatMat42Setter, };
    typeMap[FLOAT_MAT4x3]                  = { Type: Float32Array, size: 48, setter: floatMat43Setter, };
    typeMap[SAMPLER_2D]                    = { Type: null,         size:  0, setter: samplerSetter,    arraySetter: samplerArraySetter, bindPoint: TEXTURE_2D$1,       };
    typeMap[SAMPLER_CUBE]                  = { Type: null,         size:  0, setter: samplerSetter,    arraySetter: samplerArraySetter, bindPoint: TEXTURE_CUBE_MAP$1, };
    typeMap[SAMPLER_3D]                    = { Type: null,         size:  0, setter: samplerSetter,    arraySetter: samplerArraySetter, bindPoint: TEXTURE_3D$1,       };
    typeMap[SAMPLER_2D_SHADOW]             = { Type: null,         size:  0, setter: samplerSetter,    arraySetter: samplerArraySetter, bindPoint: TEXTURE_2D$1,       };
    typeMap[SAMPLER_2D_ARRAY]              = { Type: null,         size:  0, setter: samplerSetter,    arraySetter: samplerArraySetter, bindPoint: TEXTURE_2D_ARRAY$1, };
    typeMap[SAMPLER_2D_ARRAY_SHADOW]       = { Type: null,         size:  0, setter: samplerSetter,    arraySetter: samplerArraySetter, bindPoint: TEXTURE_2D_ARRAY$1, };
    typeMap[SAMPLER_CUBE_SHADOW]           = { Type: null,         size:  0, setter: samplerSetter,    arraySetter: samplerArraySetter, bindPoint: TEXTURE_CUBE_MAP$1, };
    typeMap[INT_SAMPLER_2D]                = { Type: null,         size:  0, setter: samplerSetter,    arraySetter: samplerArraySetter, bindPoint: TEXTURE_2D$1,       };
    typeMap[INT_SAMPLER_3D]                = { Type: null,         size:  0, setter: samplerSetter,    arraySetter: samplerArraySetter, bindPoint: TEXTURE_3D$1,       };
    typeMap[INT_SAMPLER_CUBE]              = { Type: null,         size:  0, setter: samplerSetter,    arraySetter: samplerArraySetter, bindPoint: TEXTURE_CUBE_MAP$1, };
    typeMap[INT_SAMPLER_2D_ARRAY]          = { Type: null,         size:  0, setter: samplerSetter,    arraySetter: samplerArraySetter, bindPoint: TEXTURE_2D_ARRAY$1, };
    typeMap[UNSIGNED_INT_SAMPLER_2D]       = { Type: null,         size:  0, setter: samplerSetter,    arraySetter: samplerArraySetter, bindPoint: TEXTURE_2D$1,       };
    typeMap[UNSIGNED_INT_SAMPLER_3D]       = { Type: null,         size:  0, setter: samplerSetter,    arraySetter: samplerArraySetter, bindPoint: TEXTURE_3D$1,       };
    typeMap[UNSIGNED_INT_SAMPLER_CUBE]     = { Type: null,         size:  0, setter: samplerSetter,    arraySetter: samplerArraySetter, bindPoint: TEXTURE_CUBE_MAP$1, };
    typeMap[UNSIGNED_INT_SAMPLER_2D_ARRAY] = { Type: null,         size:  0, setter: samplerSetter,    arraySetter: samplerArraySetter, bindPoint: TEXTURE_2D_ARRAY$1, };

    function floatAttribSetter(gl, index) {
      return function(b) {
        if (b.value) {
          gl.disableVertexAttribArray(index);
          switch (b.value.length) {
            case 4:
              gl.vertexAttrib4fv(index, b.value);
              break;
            case 3:
              gl.vertexAttrib3fv(index, b.value);
              break;
            case 2:
              gl.vertexAttrib2fv(index, b.value);
              break;
            case 1:
              gl.vertexAttrib1fv(index, b.value);
              break;
            default:
              throw new Error('the length of a float constant value must be between 1 and 4!');
          }
        } else {
          gl.bindBuffer(ARRAY_BUFFER$1, b.buffer);
          gl.enableVertexAttribArray(index);
          gl.vertexAttribPointer(
              index, b.numComponents || b.size, b.type || FLOAT$3, b.normalize || false, b.stride || 0, b.offset || 0);
          if (b.divisor !== undefined) {
            gl.vertexAttribDivisor(index, b.divisor);
          }
        }
      };
    }

    function intAttribSetter(gl, index) {
      return function(b) {
        if (b.value) {
          gl.disableVertexAttribArray(index);
          if (b.value.length === 4) {
            gl.vertexAttrib4iv(index, b.value);
          } else {
            throw new Error('The length of an integer constant value must be 4!');
          }
        } else {
          gl.bindBuffer(ARRAY_BUFFER$1, b.buffer);
          gl.enableVertexAttribArray(index);
          gl.vertexAttribIPointer(
              index, b.numComponents || b.size, b.type || INT$3, b.stride || 0, b.offset || 0);
          if (b.divisor !== undefined) {
            gl.vertexAttribDivisor(index, b.divisor);
          }
        }
      };
    }

    function uintAttribSetter(gl, index) {
      return function(b) {
        if (b.value) {
          gl.disableVertexAttribArray(index);
          if (b.value.length === 4) {
            gl.vertexAttrib4uiv(index, b.value);
          } else {
            throw new Error('The length of an unsigned integer constant value must be 4!');
          }
        } else {
          gl.bindBuffer(ARRAY_BUFFER$1, b.buffer);
          gl.enableVertexAttribArray(index);
          gl.vertexAttribIPointer(
              index, b.numComponents || b.size, b.type || UNSIGNED_INT$3, b.stride || 0, b.offset || 0);
          if (b.divisor !== undefined) {
            gl.vertexAttribDivisor(index, b.divisor);
          }
        }
      };
    }

    function matAttribSetter(gl, index, typeInfo) {
      const defaultSize = typeInfo.size;
      const count = typeInfo.count;

      return function(b) {
        gl.bindBuffer(ARRAY_BUFFER$1, b.buffer);
        const numComponents = b.size || b.numComponents || defaultSize;
        const size = numComponents / count;
        const type = b.type || FLOAT$3;
        const typeInfo = typeMap[type];
        const stride = typeInfo.size * numComponents;
        const normalize = b.normalize || false;
        const offset = b.offset || 0;
        const rowOffset = stride / count;
        for (let i = 0; i < count; ++i) {
          gl.enableVertexAttribArray(index + i);
          gl.vertexAttribPointer(
              index + i, size, type, normalize, stride, offset + rowOffset * i);
          if (b.divisor !== undefined) {
            gl.vertexAttribDivisor(index + i, b.divisor);
          }
        }
      };
    }



    const attrTypeMap = {};
    attrTypeMap[FLOAT$3]             = { size:  4, setter: floatAttribSetter, };
    attrTypeMap[FLOAT_VEC2]        = { size:  8, setter: floatAttribSetter, };
    attrTypeMap[FLOAT_VEC3]        = { size: 12, setter: floatAttribSetter, };
    attrTypeMap[FLOAT_VEC4]        = { size: 16, setter: floatAttribSetter, };
    attrTypeMap[INT$3]               = { size:  4, setter: intAttribSetter,   };
    attrTypeMap[INT_VEC2]          = { size:  8, setter: intAttribSetter,   };
    attrTypeMap[INT_VEC3]          = { size: 12, setter: intAttribSetter,   };
    attrTypeMap[INT_VEC4]          = { size: 16, setter: intAttribSetter,   };
    attrTypeMap[UNSIGNED_INT$3]      = { size:  4, setter: uintAttribSetter,  };
    attrTypeMap[UNSIGNED_INT_VEC2] = { size:  8, setter: uintAttribSetter,  };
    attrTypeMap[UNSIGNED_INT_VEC3] = { size: 12, setter: uintAttribSetter,  };
    attrTypeMap[UNSIGNED_INT_VEC4] = { size: 16, setter: uintAttribSetter,  };
    attrTypeMap[BOOL]              = { size:  4, setter: intAttribSetter,   };
    attrTypeMap[BOOL_VEC2]         = { size:  8, setter: intAttribSetter,   };
    attrTypeMap[BOOL_VEC3]         = { size: 12, setter: intAttribSetter,   };
    attrTypeMap[BOOL_VEC4]         = { size: 16, setter: intAttribSetter,   };
    attrTypeMap[FLOAT_MAT2]        = { size:  4, setter: matAttribSetter,   count: 2, };
    attrTypeMap[FLOAT_MAT3]        = { size:  9, setter: matAttribSetter,   count: 3, };
    attrTypeMap[FLOAT_MAT4]        = { size: 16, setter: matAttribSetter,   count: 4, };

    /**
     * Returns true if attribute/uniform is a reserved/built in
     *
     * It makes no sense to me why GL returns these because it's
     * illegal to call `gl.getUniformLocation` and `gl.getAttribLocation`
     * with names that start with `gl_` (and `webgl_` in WebGL)
     *
     * I can only assume they are there because they might count
     * when computing the number of uniforms/attributes used when you want to
     * know if you are near the limit. That doesn't really make sense
     * to me but the fact that these get returned are in the spec.
     *
     * @param {WebGLActiveInfo} info As returned from `gl.getActiveUniform` or
     *    `gl.getActiveAttrib`.
     * @return {bool} true if it's reserved
     * @private
     */
    function isBuiltIn(info) {
      const name = info.name;
      return name.startsWith("gl_") || name.startsWith("webgl_");
    }

    /**
     * Creates setter functions for all uniforms of a shader
     * program.
     *
     * @see {@link module:twgl.setUniforms}
     *
     * @param {WebGLRenderingContext} gl The WebGLRenderingContext to use.
     * @param {WebGLProgram} program the program to create setters for.
     * @returns {Object.<string, function>} an object with a setter by name for each uniform
     * @memberOf module:twgl/programs
     */
    function createUniformSetters(gl, program) {
      let textureUnit = 0;

      /**
       * Creates a setter for a uniform of the given program with it's
       * location embedded in the setter.
       * @param {WebGLProgram} program
       * @param {WebGLUniformInfo} uniformInfo
       * @returns {function} the created setter.
       */
      function createUniformSetter(program, uniformInfo, location) {
        const isArray = (uniformInfo.size > 1 && uniformInfo.name.substr(-3) === "[0]");
        const type = uniformInfo.type;
        const typeInfo = typeMap[type];
        if (!typeInfo) {
          throw new Error(`unknown type: 0x${type.toString(16)}`); // we should never get here.
        }
        let setter;
        if (typeInfo.bindPoint) {
          // it's a sampler
          const unit = textureUnit;
          textureUnit += uniformInfo.size;
          if (isArray) {
            setter = typeInfo.arraySetter(gl, type, unit, location, uniformInfo.size);
          } else {
            setter = typeInfo.setter(gl, type, unit, location, uniformInfo.size);
          }
        } else {
          if (typeInfo.arraySetter && isArray) {
            setter = typeInfo.arraySetter(gl, location);
          } else {
            setter = typeInfo.setter(gl, location);
          }
        }
        setter.location = location;
        return setter;
      }

      const uniformSetters = { };
      const numUniforms = gl.getProgramParameter(program, ACTIVE_UNIFORMS);

      for (let ii = 0; ii < numUniforms; ++ii) {
        const uniformInfo = gl.getActiveUniform(program, ii);
        if (isBuiltIn(uniformInfo)) {
            continue;
        }
        let name = uniformInfo.name;
        // remove the array suffix.
        if (name.substr(-3) === "[0]") {
          name = name.substr(0, name.length - 3);
        }
        const location = gl.getUniformLocation(program, uniformInfo.name);
        // the uniform will have no location if it's in a uniform block
        if (location) {
          uniformSetters[name] = createUniformSetter(program, uniformInfo, location);
        }
      }
      return uniformSetters;
    }

    /**
     * @typedef {Object} TransformFeedbackInfo
     * @property {number} index index of transform feedback
     * @property {number} type GL type
     * @property {number} size 1 - 4
     * @memberOf module:twgl
     */

    /**
     * Create TransformFeedbackInfo for passing to bindTransformFeedbackInfo.
     * @param {WebGLRenderingContext} gl The WebGLRenderingContext to use.
     * @param {WebGLProgram} program an existing WebGLProgram.
     * @return {Object<string, module:twgl.TransformFeedbackInfo>}
     * @memberOf module:twgl
     */
    function createTransformFeedbackInfo(gl, program) {
      const info = {};
      const numVaryings = gl.getProgramParameter(program, TRANSFORM_FEEDBACK_VARYINGS);
      for (let ii = 0; ii < numVaryings; ++ii) {
        const varying = gl.getTransformFeedbackVarying(program, ii);
        info[varying.name] = {
          index: ii,
          type: varying.type,
          size: varying.size,
        };
      }
      return info;
    }

    /**
     * @typedef {Object} UniformData
     * @property {number} type The WebGL type enum for this uniform
     * @property {number} size The number of elements for this uniform
     * @property {number} blockNdx The block index this uniform appears in
     * @property {number} offset The byte offset in the block for this uniform's value
     * @memberOf module:twgl
     */

    /**
     * The specification for one UniformBlockObject
     *
     * @typedef {Object} BlockSpec
     * @property {number} index The index of the block.
     * @property {number} size The size in bytes needed for the block
     * @property {number[]} uniformIndices The indices of the uniforms used by the block. These indices
     *    correspond to entries in a UniformData array in the {@link module:twgl.UniformBlockSpec}.
     * @property {bool} usedByVertexShader Self explanatory
     * @property {bool} usedByFragmentShader Self explanatory
     * @property {bool} used Self explanatory
     * @memberOf module:twgl
     */

    /**
     * A `UniformBlockSpec` represents the data needed to create and bind
     * UniformBlockObjects for a given program
     *
     * @typedef {Object} UniformBlockSpec
     * @property {Object.<string, module:twgl.BlockSpec> blockSpecs The BlockSpec for each block by block name
     * @property {UniformData[]} uniformData An array of data for each uniform by uniform index.
     * @memberOf module:twgl
     */

    /**
     * Creates a UniformBlockSpec for the given program.
     *
     * A UniformBlockSpec represents the data needed to create and bind
     * UniformBlockObjects
     *
     * @param {WebGL2RenderingContext} gl A WebGL2 Rendering Context
     * @param {WebGLProgram} program A WebGLProgram for a successfully linked program
     * @return {module:twgl.UniformBlockSpec} The created UniformBlockSpec
     * @memberOf module:twgl/programs
     */
    function createUniformBlockSpecFromProgram(gl, program) {
      const numUniforms = gl.getProgramParameter(program, ACTIVE_UNIFORMS);
      const uniformData = [];
      const uniformIndices = [];

      for (let ii = 0; ii < numUniforms; ++ii) {
        uniformIndices.push(ii);
        uniformData.push({});
        const uniformInfo = gl.getActiveUniform(program, ii);
        if (isBuiltIn(uniformInfo)) {
          break;
        }
        // REMOVE [0]?
        uniformData[ii].name = uniformInfo.name;
      }

      [
        [ "UNIFORM_TYPE", "type" ],
        [ "UNIFORM_SIZE", "size" ],  // num elements
        [ "UNIFORM_BLOCK_INDEX", "blockNdx" ],
        [ "UNIFORM_OFFSET", "offset", ],
      ].forEach(function(pair) {
        const pname = pair[0];
        const key = pair[1];
        gl.getActiveUniforms(program, uniformIndices, gl[pname]).forEach(function(value, ndx) {
          uniformData[ndx][key] = value;
        });
      });

      const blockSpecs = {};

      const numUniformBlocks = gl.getProgramParameter(program, ACTIVE_UNIFORM_BLOCKS);
      for (let ii = 0; ii < numUniformBlocks; ++ii) {
        const name = gl.getActiveUniformBlockName(program, ii);
        const blockSpec = {
          index: gl.getUniformBlockIndex(program, name),
          usedByVertexShader: gl.getActiveUniformBlockParameter(program, ii, UNIFORM_BLOCK_REFERENCED_BY_VERTEX_SHADER),
          usedByFragmentShader: gl.getActiveUniformBlockParameter(program, ii, UNIFORM_BLOCK_REFERENCED_BY_FRAGMENT_SHADER),
          size: gl.getActiveUniformBlockParameter(program, ii, UNIFORM_BLOCK_DATA_SIZE),
          uniformIndices: gl.getActiveUniformBlockParameter(program, ii, UNIFORM_BLOCK_ACTIVE_UNIFORM_INDICES),
        };
        blockSpec.used = blockSpec.usedByVertexShader || blockSpec.usedByFragmentShader;
        blockSpecs[name] = blockSpec;
      }

      return {
        blockSpecs: blockSpecs,
        uniformData: uniformData,
      };
    }

    /**
     * Set uniforms and binds related textures.
     *
     * example:
     *
     *     const programInfo = createProgramInfo(
     *         gl, ["some-vs", "some-fs"]);
     *
     *     const tex1 = gl.createTexture();
     *     const tex2 = gl.createTexture();
     *
     *     ... assume we setup the textures with data ...
     *
     *     const uniforms = {
     *       u_someSampler: tex1,
     *       u_someOtherSampler: tex2,
     *       u_someColor: [1,0,0,1],
     *       u_somePosition: [0,1,1],
     *       u_someMatrix: [
     *         1,0,0,0,
     *         0,1,0,0,
     *         0,0,1,0,
     *         0,0,0,0,
     *       ],
     *     };
     *
     *     gl.useProgram(program);
     *
     * This will automatically bind the textures AND set the
     * uniforms.
     *
     *     twgl.setUniforms(programInfo, uniforms);
     *
     * For the example above it is equivalent to
     *
     *     var texUnit = 0;
     *     gl.activeTexture(gl.TEXTURE0 + texUnit);
     *     gl.bindTexture(gl.TEXTURE_2D, tex1);
     *     gl.uniform1i(u_someSamplerLocation, texUnit++);
     *     gl.activeTexture(gl.TEXTURE0 + texUnit);
     *     gl.bindTexture(gl.TEXTURE_2D, tex2);
     *     gl.uniform1i(u_someSamplerLocation, texUnit++);
     *     gl.uniform4fv(u_someColorLocation, [1, 0, 0, 1]);
     *     gl.uniform3fv(u_somePositionLocation, [0, 1, 1]);
     *     gl.uniformMatrix4fv(u_someMatrix, false, [
     *         1,0,0,0,
     *         0,1,0,0,
     *         0,0,1,0,
     *         0,0,0,0,
     *       ]);
     *
     * Note it is perfectly reasonable to call `setUniforms` multiple times. For example
     *
     *     const uniforms = {
     *       u_someSampler: tex1,
     *       u_someOtherSampler: tex2,
     *     };
     *
     *     const moreUniforms {
     *       u_someColor: [1,0,0,1],
     *       u_somePosition: [0,1,1],
     *       u_someMatrix: [
     *         1,0,0,0,
     *         0,1,0,0,
     *         0,0,1,0,
     *         0,0,0,0,
     *       ],
     *     };
     *
     *     twgl.setUniforms(programInfo, uniforms);
     *     twgl.setUniforms(programInfo, moreUniforms);
     *
     * You can also add WebGLSamplers to uniform samplers as in
     *
     *     const uniforms = {
     *       u_someSampler: {
     *         texture: someWebGLTexture,
     *         sampler: someWebGLSampler,
     *       },
     *     };
     *
     * In which case both the sampler and texture will be bound to the
     * same unit.
     *
     * @param {(module:twgl.ProgramInfo|Object.<string, function>)} setters a `ProgramInfo` as returned from `createProgramInfo` or the setters returned from
     *        `createUniformSetters`.
     * @param {Object.<string, ?>} values an object with values for the
     *        uniforms.
     *   You can pass multiple objects by putting them in an array or by calling with more arguments.For example
     *
     *     const sharedUniforms = {
     *       u_fogNear: 10,
     *       u_projection: ...
     *       ...
     *     };
     *
     *     const localUniforms = {
     *       u_world: ...
     *       u_diffuseColor: ...
     *     };
     *
     *     twgl.setUniforms(programInfo, sharedUniforms, localUniforms);
     *
     *     // is the same as
     *
     *     twgl.setUniforms(programInfo, [sharedUniforms, localUniforms]);
     *
     *     // is the same as
     *
     *     twgl.setUniforms(programInfo, sharedUniforms);
     *     twgl.setUniforms(programInfo, localUniforms};
     *
     * @memberOf module:twgl/programs
     */
    function setUniforms(setters, values) {  // eslint-disable-line
      const actualSetters = setters.uniformSetters || setters;
      const numArgs = arguments.length;
      for (let aNdx = 1; aNdx < numArgs; ++aNdx) {
        const values = arguments[aNdx];
        if (Array.isArray(values)) {
          const numValues = values.length;
          for (let ii = 0; ii < numValues; ++ii) {
            setUniforms(actualSetters, values[ii]);
          }
        } else {
          for (const name in values) {
            const setter = actualSetters[name];
            if (setter) {
              setter(values[name]);
            }
          }
        }
      }
    }

    /**
     * Creates setter functions for all attributes of a shader
     * program. You can pass this to {@link module:twgl.setBuffersAndAttributes} to set all your buffers and attributes.
     *
     * @see {@link module:twgl.setAttributes} for example
     * @param {WebGLRenderingContext} gl The WebGLRenderingContext to use.
     * @param {WebGLProgram} program the program to create setters for.
     * @return {Object.<string, function>} an object with a setter for each attribute by name.
     * @memberOf module:twgl/programs
     */
    function createAttributeSetters(gl, program) {
      const attribSetters = {
      };

      const numAttribs = gl.getProgramParameter(program, ACTIVE_ATTRIBUTES);
      for (let ii = 0; ii < numAttribs; ++ii) {
        const attribInfo = gl.getActiveAttrib(program, ii);
        if (isBuiltIn(attribInfo)) {
            continue;
        }
        const index = gl.getAttribLocation(program, attribInfo.name);
        const typeInfo = attrTypeMap[attribInfo.type];
        const setter = typeInfo.setter(gl, index, typeInfo);
        setter.location = index;
        attribSetters[attribInfo.name] = setter;
      }

      return attribSetters;
    }

    /**
     * Sets attributes and binds buffers (deprecated... use {@link module:twgl.setBuffersAndAttributes})
     *
     * Example:
     *
     *     const program = createProgramFromScripts(
     *         gl, ["some-vs", "some-fs");
     *
     *     const attribSetters = createAttributeSetters(program);
     *
     *     const positionBuffer = gl.createBuffer();
     *     const texcoordBuffer = gl.createBuffer();
     *
     *     const attribs = {
     *       a_position: {buffer: positionBuffer, numComponents: 3},
     *       a_texcoord: {buffer: texcoordBuffer, numComponents: 2},
     *     };
     *
     *     gl.useProgram(program);
     *
     * This will automatically bind the buffers AND set the
     * attributes.
     *
     *     setAttributes(attribSetters, attribs);
     *
     * Properties of attribs. For each attrib you can add
     * properties:
     *
     * *   type: the type of data in the buffer. Default = gl.FLOAT
     * *   normalize: whether or not to normalize the data. Default = false
     * *   stride: the stride. Default = 0
     * *   offset: offset into the buffer. Default = 0
     * *   divisor: the divisor for instances. Default = undefined
     *
     * For example if you had 3 value float positions, 2 value
     * float texcoord and 4 value uint8 colors you'd setup your
     * attribs like this
     *
     *     const attribs = {
     *       a_position: {buffer: positionBuffer, numComponents: 3},
     *       a_texcoord: {buffer: texcoordBuffer, numComponents: 2},
     *       a_color: {
     *         buffer: colorBuffer,
     *         numComponents: 4,
     *         type: gl.UNSIGNED_BYTE,
     *         normalize: true,
     *       },
     *     };
     *
     * @param {Object.<string, function>} setters Attribute setters as returned from createAttributeSetters
     * @param {Object.<string, module:twgl.AttribInfo>} buffers AttribInfos mapped by attribute name.
     * @memberOf module:twgl/programs
     * @deprecated use {@link module:twgl.setBuffersAndAttributes}
     */
    function setAttributes(setters, buffers) {
      for (const name in buffers) {
        const setter = setters[name];
        if (setter) {
          setter(buffers[name]);
        }
      }
    }

    /**
     * @typedef {Object} ProgramInfo
     * @property {WebGLProgram} program A shader program
     * @property {Object<string, function>} uniformSetters object of setters as returned from createUniformSetters,
     * @property {Object<string, function>} attribSetters object of setters as returned from createAttribSetters,
     * @property {module:twgl.UniformBlockSpec} [uniformBlockSpace] a uniform block spec for making UniformBlockInfos with createUniformBlockInfo etc..
     * @property {Object<string, module:twgl.TransformFeedbackInfo>} [transformFeedbackInfo] info for transform feedbacks
     * @memberOf module:twgl
     */

    /**
     * Creates a ProgramInfo from an existing program.
     *
     * A ProgramInfo contains
     *
     *     programInfo = {
     *        program: WebGLProgram,
     *        uniformSetters: object of setters as returned from createUniformSetters,
     *        attribSetters: object of setters as returned from createAttribSetters,
     *     }
     *
     * @param {WebGLRenderingContext} gl The WebGLRenderingContext
     *        to use.
     * @param {WebGLProgram} program an existing WebGLProgram.
     * @return {module:twgl.ProgramInfo} The created ProgramInfo.
     * @memberOf module:twgl/programs
     */
    function createProgramInfoFromProgram(gl, program) {
      const uniformSetters = createUniformSetters(gl, program);
      const attribSetters = createAttributeSetters(gl, program);
      const programInfo = {
        program: program,
        uniformSetters: uniformSetters,
        attribSetters: attribSetters,
      };

      if (isWebGL2(gl)) {
        programInfo.uniformBlockSpec = createUniformBlockSpecFromProgram(gl, program);
        programInfo.transformFeedbackInfo = createTransformFeedbackInfo(gl, program);
      }

      return programInfo;
    }

    var quadShader = "#define GLSLIFY 1\nattribute vec4 position;attribute vec2 texcoord;varying vec2 v_texel;varying vec2 v_uv;varying float v_scale;uniform bool u_flipY;uniform vec2 u_textureSize;uniform vec2 u_screenSize;void main(){v_uv=texcoord;v_scale=floor(u_screenSize.y/u_textureSize.y+0.01);gl_Position=position;if(u_flipY){gl_Position.y*=-1.;}}"; // eslint-disable-line

    var layerDrawShader = "precision highp float;\n#define GLSLIFY 1\nvarying vec2 v_uv;uniform sampler2D u_palette;uniform sampler2D u_bitmap;uniform float u_paletteOffset;const vec4 transparent=vec4(0,0,0,0);void main(){float index=texture2D(u_bitmap,v_uv).a*255.;if(index>0.){gl_FragColor=texture2D(u_palette,vec2((u_paletteOffset+index)/255.,.5));}else{gl_FragColor=transparent;}}"; // eslint-disable-line

    var postProcessShader = "precision highp float;\n#define GLSLIFY 1\nvarying vec2 v_uv;uniform sampler2D u_tex;varying float v_scale;uniform vec2 u_textureSize;uniform vec2 u_screenSize;void main(){vec2 v_texel=v_uv*u_textureSize;vec2 texel_floored=floor(v_texel);vec2 s=fract(v_texel);float region_range=0.5-0.5/v_scale;vec2 center_dist=s-0.5;vec2 f=(center_dist-clamp(center_dist,-region_range,region_range))*v_scale+0.5;vec2 mod_texel=texel_floored+f;vec2 coord=mod_texel.xy/u_textureSize.xy;gl_FragColor=texture2D(u_tex,coord);}"; // eslint-disable-line

    /** webgl canvas wrapper class */
    var WebglRenderer = /** @class */ (function () {
        function WebglRenderer(el, width, height) {
            if (width === void 0) { width = 640; }
            if (height === void 0) { height = 480; }
            this.refs = {
                programs: [],
                shaders: [],
                textures: [],
                buffers: [],
                framebuffers: []
            };
            if (!isBrowser) {
                throw new Error('The WebGL renderer is only available in browser environments');
            }
            var gl = el.getContext('webgl', {
                antialias: false,
                alpha: true
            });
            this.el = el;
            this.gl = gl;
            this.layerDrawProgram = this.createProgram(quadShader, layerDrawShader);
            this.postProcessProgram = this.createProgram(quadShader, postProcessShader);
            this.quadBuffer = this.createScreenQuad(-1, -1, 2, 2, 8, 8);
            this.setBuffersAndAttribs(this.layerDrawProgram, this.quadBuffer);
            this.setBuffersAndAttribs(this.postProcessProgram, this.quadBuffer);
            this.paletteTexture = this.createTexture(gl.RGBA, gl.NEAREST, gl.CLAMP_TO_EDGE, 256, 1);
            this.layerTexture = this.createTexture(gl.ALPHA, gl.NEAREST, gl.CLAMP_TO_EDGE);
            this.frameTexture = this.createTexture(gl.RGBA, gl.LINEAR, gl.CLAMP_TO_EDGE);
            this.frameBuffer = this.createFrameBuffer(this.frameTexture);
            this.setCanvasSize(width, height);
        }
        WebglRenderer.prototype.createProgram = function (vertexShaderSource, fragmentShaderSource) {
            var gl = this.gl;
            var vert = this.createShader(gl.VERTEX_SHADER, vertexShaderSource);
            var frag = this.createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
            var program = gl.createProgram();
            // set up shaders
            gl.attachShader(program, vert);
            gl.attachShader(program, frag);
            // link program
            gl.linkProgram(program);
            if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
                var log = gl.getProgramInfoLog(program);
                gl.deleteProgram(program);
                throw new Error(log);
            }
            var programInfo = createProgramInfoFromProgram(gl, program);
            this.refs.programs.push(program);
            return programInfo;
        };
        WebglRenderer.prototype.createShader = function (type, source) {
            var gl = this.gl;
            var shader = gl.createShader(type);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            // test if shader compilation was successful
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                var log = gl.getShaderInfoLog(shader);
                gl.deleteShader(shader);
                throw new Error(log);
            }
            this.refs.shaders.push(shader);
            return shader;
        };
        // creating a subdivided quad seems to produce slightly nicer texture filtering
        WebglRenderer.prototype.createScreenQuad = function (x0, y0, width, height, xSubdivs, ySubdivs) {
            var numVerts = (xSubdivs + 1) * (ySubdivs + 1);
            var numVertsAcross = xSubdivs + 1;
            var positions = new Float32Array(numVerts * 2);
            var texCoords = new Float32Array(numVerts * 2);
            var positionPtr = 0;
            var texCoordPtr = 0;
            for (var y = 0; y <= ySubdivs; y++) {
                for (var x = 0; x <= xSubdivs; x++) {
                    var u = x / xSubdivs;
                    var v = y / ySubdivs;
                    positions[positionPtr++] = x0 + width * u;
                    positions[positionPtr++] = y0 + height * v;
                    texCoords[texCoordPtr++] = u;
                    texCoords[texCoordPtr++] = v;
                }
            }
            var indices = new Uint16Array(xSubdivs * ySubdivs * 2 * 3);
            var indicesPtr = 0;
            for (var y = 0; y < ySubdivs; y++) {
                for (var x = 0; x < xSubdivs; x++) {
                    // triangle 1
                    indices[indicesPtr++] = (y + 0) * numVertsAcross + x;
                    indices[indicesPtr++] = (y + 1) * numVertsAcross + x;
                    indices[indicesPtr++] = (y + 0) * numVertsAcross + x + 1;
                    // triangle 2
                    indices[indicesPtr++] = (y + 0) * numVertsAcross + x + 1;
                    indices[indicesPtr++] = (y + 1) * numVertsAcross + x;
                    indices[indicesPtr++] = (y + 1) * numVertsAcross + x + 1;
                }
            }
            var bufferInfo = createBufferInfoFromArrays(this.gl, {
                position: {
                    numComponents: 2,
                    data: positions
                },
                texcoord: {
                    numComponents: 2,
                    data: texCoords
                },
                indices: indices
            });
            // collect references to buffer objects
            for (var name_1 in bufferInfo.attribs) {
                this.refs.buffers.push(bufferInfo.attribs[name_1].buffer);
            }
            return bufferInfo;
        };
        WebglRenderer.prototype.setBuffersAndAttribs = function (program, buffer) {
            var gl = this.gl;
            setAttributes(program.attribSetters, buffer.attribs);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer.indices);
        };
        WebglRenderer.prototype.createTexture = function (type, minMag, wrap, width, height) {
            if (width === void 0) { width = 1; }
            if (height === void 0) { height = 1; }
            var gl = this.gl;
            var tex = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, tex);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrap);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrap);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minMag);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, minMag);
            gl.texImage2D(gl.TEXTURE_2D, 0, type, width, height, 0, type, gl.UNSIGNED_BYTE, null);
            this.refs.textures.push(tex);
            return tex;
        };
        WebglRenderer.prototype.createFrameBuffer = function (colorTexture) {
            var gl = this.gl;
            var fb = gl.createFramebuffer();
            gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
            // enable alpha blending
            gl.enable(gl.BLEND);
            gl.blendEquation(gl.FUNC_ADD);
            gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
            // bind a texture to the framebuffer
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, colorTexture, 0);
            this.refs.framebuffers.push(fb);
            return fb;
        };
        WebglRenderer.prototype.setCanvasSize = function (width, height) {
            var dpi = window.devicePixelRatio || 1;
            var internalWidth = width * dpi;
            var internalHeight = height * dpi;
            this.el.width = internalWidth;
            this.el.height = internalHeight;
            this.screenWidth = internalWidth;
            this.screenHeight = internalHeight;
            this.el.style.width = width + "px";
            this.el.style.height = height + "px";
        };
        WebglRenderer.prototype.setTextureSize = function (width, height) {
            var gl = this.gl;
            this.textureWidth = width;
            this.textureHeight = height;
            // resize frame texture
            gl.bindTexture(gl.TEXTURE_2D, this.frameTexture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.textureWidth, this.textureHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        };
        WebglRenderer.prototype.clearFrameBuffer = function (paperColor) {
            var gl = this.gl;
            // bind to the frame buffer
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
            gl.viewport(0, 0, this.textureWidth, this.textureHeight);
            // clear it using the paper color
            var r = paperColor[0], g = paperColor[1], b = paperColor[2], a = paperColor[3];
            gl.clearColor(r / 255, g / 255, b / 255, a / 255);
            gl.clear(gl.COLOR_BUFFER_BIT);
        };
        WebglRenderer.prototype.setPalette = function (colors) {
            var gl = this.gl;
            var data = new Uint8Array(256 * 4);
            var dataPtr = 0;
            for (var i = 0; i < colors.length; i++) {
                var _a = colors[i], r = _a[0], g = _a[1], b = _a[2], a = _a[3];
                data[dataPtr++] = r;
                data[dataPtr++] = g;
                data[dataPtr++] = b;
                data[dataPtr++] = a;
            }
            // update layer texture pixels
            gl.bindTexture(gl.TEXTURE_2D, this.paletteTexture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 256, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
        };
        WebglRenderer.prototype.drawPixels = function (pixels, paletteOffset) {
            var _a = this, gl = _a.gl, layerDrawProgram = _a.layerDrawProgram, layerTexture = _a.layerTexture, textureWidth = _a.textureWidth, textureHeight = _a.textureHeight;
            // we wanna draw to the frame buffer
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
            gl.viewport(0, 0, textureWidth, textureHeight);
            // using the layer draw program
            gl.useProgram(layerDrawProgram.program);
            // update layer texture pixels
            gl.bindTexture(gl.TEXTURE_2D, layerTexture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.ALPHA, textureWidth, textureHeight, 0, gl.ALPHA, gl.UNSIGNED_BYTE, pixels);
            // prep uniforms
            setUniforms(layerDrawProgram, {
                u_palette: this.paletteTexture,
                u_paletteOffset: paletteOffset,
                u_bitmap: layerTexture,
                u_textureSize: [textureWidth, textureHeight],
                u_screenSize: [gl.drawingBufferWidth, gl.drawingBufferHeight],
            });
            // draw screen quad
            gl.drawElements(gl.TRIANGLES, this.quadBuffer.numElements, this.quadBuffer.elementType, 0);
        };
        WebglRenderer.prototype.composite = function () {
            var gl = this.gl;
            // setting gl.FRAMEBUFFER will draw directly to the screen
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
            // using postprocess program
            gl.useProgram(this.postProcessProgram.program);
            // clear whatever's already been drawn
            gl.clear(gl.COLOR_BUFFER_BIT);
            // prep uniforms
            setUniforms(this.postProcessProgram, {
                u_flipY: true,
                u_tex: this.frameTexture,
                u_textureSize: [this.textureWidth, this.textureHeight],
                u_screenSize: [gl.drawingBufferWidth, gl.drawingBufferHeight],
            });
            // draw screen quad
            gl.drawElements(gl.TRIANGLES, this.quadBuffer.numElements, this.quadBuffer.elementType, 0);
        };
        WebglRenderer.prototype.resize = function (width, height) {
            if (width === void 0) { width = 640; }
            if (height === void 0) { height = 480; }
            this.setCanvasSize(width, height);
        };
        WebglRenderer.prototype.destroy = function () {
            // free resources
            var refs = this.refs;
            var gl = this.gl;
            refs.shaders.forEach(function (shader) {
                gl.deleteShader(shader);
            });
            refs.shaders = [];
            refs.framebuffers.forEach(function (fb) {
                gl.deleteFramebuffer(fb);
            });
            refs.framebuffers = [];
            refs.textures.forEach(function (texture) {
                gl.deleteTexture(texture);
            });
            refs.textures = [];
            refs.buffers.forEach(function (buffer) {
                gl.deleteBuffer(buffer);
            });
            refs.buffers = [];
            refs.programs.forEach(function (program) {
                gl.deleteProgram(program);
            });
            refs.programs = [];
            // shrink the canvas to reduce memory usage until it is garbage collected
            gl.canvas.width = 1;
            gl.canvas.height = 1;
        };
        return WebglRenderer;
    }());

    /** @internal */
    var _AudioContext = (function () {
        if (isBrowser)
            return (window.AudioContext || window.webkitAudioContext);
        return null;
    })();
    var WebAudioPlayer = /** @class */ (function () {
        function WebAudioPlayer() {
            this.useEq = false;
            // Thanks to Sudomemo for the default settings
            this.eqSettings = [
                [31.25, 4.1],
                [62.5, 1.2],
                [125, 0],
                [250, -4.1],
                [500, -2.3],
                [1000, 0.5],
                [2000, 6.5],
                [8000, 5.1],
                [16000, 5.1]
            ];
            this._volume = 1;
            if (!isBrowser) {
                throw new Error('The WebAudio player is only available in browser environments');
            }
            this.ctx = new _AudioContext();
        }
        Object.defineProperty(WebAudioPlayer.prototype, "volume", {
            get: function () {
                return this._volume;
            },
            set: function (value) {
                this.setVolume(value);
            },
            enumerable: false,
            configurable: true
        });
        WebAudioPlayer.prototype.setSamples = function (sampleData, sampleRate) {
            var numSamples = sampleData.length;
            var audioBuffer = this.ctx.createBuffer(1, numSamples, sampleRate);
            var channelData = audioBuffer.getChannelData(0);
            if (sampleData instanceof Float32Array)
                channelData.set(sampleData, 0);
            else if (sampleData instanceof Int16Array) {
                for (var i = 0; i < numSamples; i++) {
                    channelData[i] = sampleData[i] / 32767;
                }
            }
            this.buffer = audioBuffer;
            this.sampleRate = sampleRate;
        };
        WebAudioPlayer.prototype.connectEqNodesTo = function (inNode) {
            var _a = this, ctx = _a.ctx, eqSettings = _a.eqSettings;
            var lastNode = inNode;
            eqSettings.forEach(function (_a, index) {
                var frequency = _a[0], gain = _a[1];
                var node = ctx.createBiquadFilter();
                node.frequency.value = frequency;
                node.gain.value = gain;
                if (index === 0)
                    node.type = 'lowshelf';
                else if (index === eqSettings.length - 1)
                    node.type = 'highshelf';
                else
                    node.type = 'peaking';
                lastNode.connect(node);
                lastNode = node;
            });
            return lastNode;
        };
        WebAudioPlayer.prototype.initNodes = function () {
            var ctx = this.ctx;
            var source = ctx.createBufferSource();
            source.buffer = this.buffer;
            var gainNode = ctx.createGain();
            if (this.useEq) {
                var eq = this.connectEqNodesTo(source);
                eq.connect(gainNode);
            }
            else
                source.connect(gainNode);
            source.connect(gainNode);
            gainNode.connect(ctx.destination);
            this.source = source;
            this.gainNode = gainNode;
            this.setVolume(this._volume);
        };
        WebAudioPlayer.prototype.setVolume = function (value) {
            this._volume = value;
            if (this.gainNode) {
                // human perception of loudness is logarithmic, rather than linear
                // https://www.dr-lex.be/info-stuff/volumecontrols.html
                this.gainNode.gain.value = Math.pow(value, 2);
            }
        };
        WebAudioPlayer.prototype.stop = function () {
            this.source.stop(0);
        };
        WebAudioPlayer.prototype.playFrom = function (currentTime) {
            this.initNodes();
            this.source.start(0, currentTime);
        };
        return WebAudioPlayer;
    }());

    /** @internal */
    var saveData = (function () {
        if (!isBrowser) {
            return function () { };
        }
        var a = document.createElement("a");
        // document.body.appendChild(a);
        // a.style.display = "none";
        return function (blob, filename) {
            var url = window.URL.createObjectURL(blob);
            a.href = url;
            a.download = filename;
            a.click();
            window.URL.revokeObjectURL(url);
        };
    })();
    /** flipnote player API, based on HTMLMediaElement (https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement) */
    var Player = /** @class */ (function () {
        function Player(el, width, height) {
            this.loop = false;
            this.paused = true;
            this.duration = 0;
            this.isOpen = false;
            this.events = {};
            this._lastTick = -1;
            this._frame = -1;
            this._time = -1;
            this.hasPlaybackStarted = false;
            this.wasPlaying = false;
            this.isSeeking = false;
            // if `el` is a string, use it to select an Element, else assume it's an element
            el = ('string' == typeof el) ? document.querySelector(el) : el;
            this.canvas = new WebglRenderer(el, width, height);
            this.audio = new WebAudioPlayer();
            this.el = this.canvas.el;
            this.customPalette = null;
            this.state = __assign({}, Player.defaultState);
        }
        Object.defineProperty(Player.prototype, "currentFrame", {
            get: function () {
                return this._frame;
            },
            set: function (frameIndex) {
                this.setFrame(frameIndex);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "currentTime", {
            get: function () {
                return this.isOpen ? this._time : null;
            },
            set: function (value) {
                if ((this.isOpen) && (value <= this.duration) && (value >= 0)) {
                    this.setFrame(Math.round(value / (1 / this.framerate)));
                    this._time = value;
                    this.emit('progress', this.progress);
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "progress", {
            get: function () {
                return this.isOpen ? (this._time / this.duration) * 100 : 0;
            },
            set: function (value) {
                this.currentTime = this.duration * (value / 100);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "volume", {
            get: function () {
                return this.audio.volume;
            },
            set: function (value) {
                this.audio.volume = value;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "muted", {
            get: function () {
                // return this.audioTracks[3].audio.muted;
                return false;
            },
            set: function (value) {
                // for (let i = 0; i < this.audioTracks.length; i++) {
                //   this.audioTracks[i].audio.muted = value;
                // }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "framerate", {
            get: function () {
                return this.note.framerate;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "frameCount", {
            get: function () {
                return this.note.frameCount;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "frameSpeed", {
            get: function () {
                return this.note.frameSpeed;
            },
            enumerable: false,
            configurable: true
        });
        Player.prototype.setState = function (newState) {
            newState = __assign(__assign({}, this.state), newState);
            var oldState = this.state;
            this.emit('state:change');
        };
        /**
         * Open a Flipnote from a source
         * @category Lifecycle
         */
        Player.prototype.open = function (source) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    if (this.isOpen)
                        this.close();
                    return [2 /*return*/, parseSource(source)
                            .then(function (note) { return _this.load(note); })
                            .catch(function (err) {
                            _this.emit('error', err);
                            console.error('Error loading Flipnote:', err);
                            throw 'Error loading Flipnote';
                        })];
                });
            });
        };
        /**
         * Close the currently loaded Flipnote
         * @category Lifecycle
         */
        Player.prototype.close = function () {
            this.pause();
            this.note = null;
            this.isOpen = false;
            this.paused = true;
            this.loop = null;
            this.meta = null;
            this._frame = null;
            this._time = null;
            this.duration = null;
            this.loop = null;
            this.hasPlaybackStarted = null;
            // this.canvas.clearFrameBuffer();
        };
        /**
         * Load a Flipnote into the player
         * @category Lifecycle
         */
        Player.prototype.load = function (note) {
            this.note = note;
            this.meta = note.meta;
            this.noteFormat = note.format;
            this.noteFormatString = note.formatString;
            this.loop = note.meta.loop;
            this.duration = (this.note.frameCount) * (1 / this.note.framerate);
            this.paused = true;
            this.isOpen = true;
            this.hasPlaybackStarted = false;
            this.layerVisibility = this.note.layerVisibility;
            var sampleRate = this.note.sampleRate;
            var pcm = note.getAudioMasterPcm();
            this.audio.setSamples(pcm, sampleRate);
            this.canvas.setTextureSize(note.width, note.height);
            this.setFrame(this.note.thumbFrameIndex);
            this._time = 0;
            this.emit('load');
        };
        Player.prototype.playAudio = function () {
            this.audio.playFrom(this.currentTime);
        };
        Player.prototype.stopAudio = function () {
            this.audio.stop();
        };
        /**
         * Toggle audio equalizer filter
         * @category Audio Control
         */
        Player.prototype.toggleEq = function () {
            this.stopAudio();
            this.audio.useEq = !this.audio.useEq;
            this.playAudio();
        };
        /**
         * Toggle audio mute
         * MUTE NOT CURRENTLY IMPLEMENTED
         * @category Audio Control
         */
        Player.prototype.toggleMute = function () {
            this.muted = !this.muted;
        };
        Player.prototype.playbackLoop = function (timestamp) {
            if (this.paused) { // break loop if paused is set to true
                this.stopAudio();
                return null;
            }
            var time = timestamp / 1000;
            var progress = time - this._lastTick;
            if (progress > this.duration) {
                if (this.loop) {
                    this.currentTime = 0;
                    this.playAudio();
                    this._lastTick = time;
                    this.emit('playback:loop');
                }
                else {
                    this.pause();
                    this.emit('playback:end');
                }
            }
            else {
                this.currentTime = progress;
            }
            requestAnimationFrame(this.playbackLoop.bind(this));
        };
        /**
         * Begin playback starting at the current position
         * @category Playback Control
         */
        Player.prototype.play = function () {
            window.__activeFlipnotePlayer = this;
            if ((!this.isOpen) || (!this.paused))
                return null;
            if ((!this.hasPlaybackStarted) || ((!this.loop) && (this.currentFrame == this.frameCount - 1)))
                this._time = 0;
            this.paused = false;
            this.hasPlaybackStarted = true;
            this._lastTick = (performance.now() / 1000) - this.currentTime;
            this.playAudio();
            requestAnimationFrame(this.playbackLoop.bind(this));
            this.emit('playback:start');
        };
        /**
         * Pause playback starting at the current position
         * @category Playback Control
         */
        Player.prototype.pause = function () {
            if ((!this.isOpen) || (this.paused))
                return null;
            this.paused = true;
            this.stopAudio();
            this.emit('playback:stop');
        };
        /**
         * Resumes playback if paused, otherwise pauses
         * @category Playback Control
         */
        Player.prototype.togglePlay = function () {
            if (this.paused) {
                this.play();
            }
            else {
                this.pause();
            }
        };
        /**
         * Jump to a given Flipnote frame
         * @category Frame Control
         */
        Player.prototype.setFrame = function (frameIndex) {
            if ((this.isOpen) && (frameIndex !== this.currentFrame)) {
                // clamp frame index
                frameIndex = Math.max(0, Math.min(Math.floor(frameIndex), this.frameCount - 1));
                this.drawFrame(frameIndex);
                this._frame = frameIndex;
                if (this.paused) {
                    this._time = frameIndex * (1 / this.framerate);
                    this.emit('progress', this.progress);
                }
                this.emit('frame:update', this.currentFrame);
            }
        };
        /**
         * Jump to the next Flipnote frame
         * If the Flipnote loops, and is currently on its last frame, it will wrap to the first frame
         * @category Frame Control
         */
        Player.prototype.nextFrame = function () {
            if ((this.loop) && (this.currentFrame >= this.frameCount - 1)) {
                this.currentFrame = 0;
            }
            else {
                this.currentFrame += 1;
            }
        };
        /**
         * Jump to the next Flipnote frame
         * If the Flipnote loops, and is currently on its first frame, it will wrap to the last frame
         * @category Frame Control
         */
        Player.prototype.prevFrame = function () {
            if ((this.loop) && (this.currentFrame <= 0)) {
                this.currentFrame = this.frameCount - 1;
            }
            else {
                this.currentFrame -= 1;
            }
        };
        /**
         * Jump to the last Flipnote frame
         * @category Frame Control
         */
        Player.prototype.lastFrame = function () {
            this.currentFrame = this.frameCount - 1;
        };
        /**
         * Jump to the first Flipnote frame
         * @category Frame Control
         */
        Player.prototype.firstFrame = function () {
            this.currentFrame = 0;
        };
        /**
         * Jump to the thumbnail frame
         * @category Frame Control
         */
        Player.prototype.thumbnailFrame = function () {
            this.currentFrame = this.note.thumbFrameIndex;
        };
        /**
         * Begins a seek operation
         * @category Playback Control
         */
        Player.prototype.startSeek = function () {
            if (!this.isSeeking) {
                this.wasPlaying = !this.paused;
                this.pause();
                this.isSeeking = true;
            }
        };
        /**
         * Seek the playback progress to a different position
         * @category Playback Control
         */
        Player.prototype.seek = function (progress) {
            if (this.isSeeking) {
                this.progress = progress;
            }
        };
        /**
         * Ends a seek operation
         * @category Playback Control
         */
        Player.prototype.endSeek = function () {
            if ((this.isSeeking) && (this.wasPlaying === true)) {
                this.play();
            }
            this.wasPlaying = false;
            this.isSeeking = false;
        };
        /**
         * Returns the Flipnote's master audio as a WavEncoder object
         * @category Quick Export
         */
        Player.prototype.getMasterWav = function () {
            return WavAudio.fromFlipnote(this.note);
        };
        /**
         * Saves the Flipnote's master audio as a WAV file
         * @category Quick Export
         */
        Player.prototype.saveMasterWav = function () {
            var wav = this.getMasterWav();
            saveData(wav.getBlob(), this.meta.current.filename + ".wav");
        };
        /**
         * Returns a Flipnote frame as a GifEncoder object
         * @category Quick Export
         */
        Player.prototype.getFrameGif = function (frameIndex, meta) {
            if (meta === void 0) { meta = {}; }
            return GifImage.fromFlipnoteFrame(this.note, frameIndex, meta);
        };
        /**
         * Saves a Flipnote frame as a GIF file
         * @category Quick Export
         */
        Player.prototype.saveFrameGif = function (frameIndex, meta) {
            if (meta === void 0) { meta = {}; }
            var gif = this.getFrameGif(frameIndex, meta);
            saveData(gif.getBlob(), this.meta.current.filename + "_" + frameIndex.toString().padStart(3, '0') + ".gif");
        };
        /**
         * Returns the full Flipnote as an animated GifEncoder object
         * @category Quick Export
         */
        Player.prototype.getAnimatedGif = function (meta) {
            if (meta === void 0) { meta = {}; }
            return GifImage.fromFlipnote(this.note, meta);
        };
        /**
         * Saves the full Flipnote as an animated GIF file
         * @category Quick Export
         */
        Player.prototype.saveAnimatedGif = function (meta) {
            if (meta === void 0) { meta = {}; }
            var gif = this.getAnimatedGif(meta);
            saveData(gif.getBlob(), this.meta.current.filename + ".gif");
        };
        Player.prototype.drawFrame = function (frameIndex) {
            var colors = this.note.getFramePalette(frameIndex);
            var layerBuffers = this.note.decodeFrame(frameIndex);
            // this.canvas.setPaperColor(colors[0]);
            this.canvas.setPalette(colors);
            this.canvas.clearFrameBuffer(colors[0]);
            if (this.note.format === exports.FlipnoteFormat.PPM) {
                if (this.layerVisibility[2]) // bottom
                    this.canvas.drawPixels(layerBuffers[1], 1);
                if (this.layerVisibility[1]) // top
                    this.canvas.drawPixels(layerBuffers[0], 0);
            }
            else if (this.note.format === exports.FlipnoteFormat.KWZ) {
                var order = this.note.getFrameLayerOrder(frameIndex);
                var layerIndexC = order[0];
                var layerIndexB = order[1];
                var layerIndexA = order[2];
                if (this.layerVisibility[layerIndexC + 1]) // bottom
                    this.canvas.drawPixels(layerBuffers[layerIndexC], layerIndexC * 2);
                if (this.layerVisibility[layerIndexB + 1]) // middle
                    this.canvas.drawPixels(layerBuffers[layerIndexB], layerIndexB * 2);
                if (this.layerVisibility[layerIndexA + 1]) // top
                    this.canvas.drawPixels(layerBuffers[layerIndexA], layerIndexA * 2);
            }
            this.canvas.composite();
        };
        Player.prototype.forceUpdate = function () {
            if (this.isOpen) {
                this.drawFrame(this.currentFrame);
            }
        };
        Player.prototype.resize = function (width, height) {
            this.canvas.resize(width, height);
            this.forceUpdate();
        };
        Player.prototype.setLayerVisibility = function (layerIndex, value) {
            this.layerVisibility[layerIndex] = value;
            this.forceUpdate();
        };
        Player.prototype.toggleLayerVisibility = function (layerIndex) {
            this.setLayerVisibility(layerIndex, !this.layerVisibility[layerIndex]);
        };
        // public setPalette(palette: any): void {
        //   this.customPalette = palette;
        //   this.note.palette = palette;
        //   this.forceUpdate();
        // }
        /**
         * Add an event callback
         * @category Event API
         */
        Player.prototype.on = function (eventType, callback) {
            var events = this.events;
            (events[eventType] || (events[eventType] = [])).push(callback);
        };
        /**
         * Remove an event callback
         * @category Event API
         */
        Player.prototype.off = function (eventType, callback) {
            var callbackList = this.events[eventType];
            if (callbackList)
                callbackList.splice(callbackList.indexOf(callback), 1);
        };
        /**
         * Emit an event - mostly used internally
         * @category Event API
         */
        Player.prototype.emit = function (eventType) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var callbackList = this.events[eventType] || [];
            for (var i = 0; i < callbackList.length; i++) {
                callbackList[i].apply(null, args);
            }
        };
        /**
         * Remove all registered event callbacks
         * @category Event API
         */
        Player.prototype.clearEvents = function () {
            this.events = {};
        };
        /**
         * Destroy a Player instace
         * @category Lifecycle
         */
        Player.prototype.destroy = function () {
            this.close();
            this.canvas.destroy();
        };
        Player.defaultState = {
            noteType: null,
            isNoteOpen: false,
            paused: false,
            hasPlaybackStarted: false,
            frame: -1,
            time: -1,
            loop: false,
            volume: 1,
            muted: false,
            layerVisibility: {
                1: true,
                2: true,
                3: true
            },
            isSeeking: false,
            wasPlaying: false,
        };
        return Player;
    }());

    function createDomEventDispatcher() {
        var component = get_current_component();
        var svelteDispatch = createEventDispatcher();
        return function (name, detail) {
            svelteDispatch(name, detail);
            component.dispatchEvent && component.dispatchEvent(new CustomEvent(name, { detail: detail }));
        };
    }
    function padNumber(num, strLength) {
        return num.toString().padStart(strLength, '0');
    }
    function formatTime(seconds) {
        var m = Math.floor((seconds % 3600) / 60);
        var s = Math.round(seconds % 60);
        return m + ":" + padNumber(s, 2);
    }
    function injectSvgStyle(svgString, styleString) {
        return svgString.replace(/<svg ([^>]*)>/, function (match, svgAttrs) { return "<svg " + svgAttrs + " style=\"" + styleString + "\">"; });
    }

    /* src/components/Slider.svelte generated by Svelte v3.24.0 */
    const file = "src/components/Slider.svelte";

    function create_fragment(ctx) {
    	let div3;
    	let div2;
    	let div0;
    	let t;
    	let div1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			t = space();
    			div1 = element("div");
    			this.c = noop;
    			attr_dev(div0, "class", "PlayerSlider__level");
    			set_style(div0, "width", /*value*/ ctx[0] * 100 + "%");
    			add_location(div0, file, 51, 4, 1230);
    			attr_dev(div1, "class", "PlayerSlider__handle");
    			set_style(div1, "left", /*value*/ ctx[0] * 100 + "%");
    			add_location(div1, file, 55, 4, 1319);
    			attr_dev(div2, "class", "PlayerSlider__track");
    			add_location(div2, file, 47, 2, 1151);
    			attr_dev(div3, "class", "PlayerSlider");
    			add_location(div3, file, 43, 0, 1081);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			append_dev(div2, div0);
    			append_dev(div2, t);
    			append_dev(div2, div1);
    			/*div2_binding*/ ctx[6](div2);

    			if (!mounted) {
    				dispose = [
    					listen_dev(
    						window,
    						"mousemove",
    						function () {
    							if (is_function(/*isSliderActive*/ ctx[2]
    							? /*onSliderInput*/ ctx[5]
    							: null)) (/*isSliderActive*/ ctx[2]
    							? /*onSliderInput*/ ctx[5]
    							: null).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						window,
    						"mouseup",
    						function () {
    							if (is_function(/*isSliderActive*/ ctx[2]
    							? /*onSliderInputEnd*/ ctx[4]
    							: null)) (/*isSliderActive*/ ctx[2]
    							? /*onSliderInputEnd*/ ctx[4]
    							: null).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(div3, "mousedown", /*onSliderInputStart*/ ctx[3], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;

    			if (dirty & /*value*/ 1) {
    				set_style(div0, "width", /*value*/ ctx[0] * 100 + "%");
    			}

    			if (dirty & /*value*/ 1) {
    				set_style(div1, "left", /*value*/ ctx[0] * 100 + "%");
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			/*div2_binding*/ ctx[6](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { value = 0 } = $$props;
    	let sliderElement; // will be bound to the progress bar element
    	let isSliderActive = false;
    	const dispatch = createDomEventDispatcher();

    	function onSliderInputStart(event) {
    		event.preventDefault();
    		$$invalidate(2, isSliderActive = true);
    		onSliderInput(event);
    		dispatch("inputstart");
    	}

    	function onSliderInputEnd(event) {
    		event.preventDefault();
    		$$invalidate(2, isSliderActive = false);
    		onSliderInput(event);
    		dispatch("inputend");
    	}

    	function onSliderInput(event) {
    		event.preventDefault();
    		const rect = sliderElement.getBoundingClientRect();
    		const railCap = rect.height / 2;
    		const railLength = rect.width - railCap * 2;
    		const x = event.pageX - rect.left - railCap;
    		const newValue = Math.max(0, Math.min(1, x / railLength));

    		if (value !== newValue) {
    			dispatch("change", { value: newValue });
    		}
    	}

    	const writable_props = ["value"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<flipnote-player-slider-bar> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("flipnote-player-slider-bar", $$slots, []);

    	function div2_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			sliderElement = $$value;
    			$$invalidate(1, sliderElement);
    		});
    	}

    	$$self.$set = $$props => {
    		if ("value" in $$props) $$invalidate(0, value = $$props.value);
    	};

    	$$self.$capture_state = () => ({
    		createDomEventDispatcher,
    		value,
    		sliderElement,
    		isSliderActive,
    		dispatch,
    		onSliderInputStart,
    		onSliderInputEnd,
    		onSliderInput
    	});

    	$$self.$inject_state = $$props => {
    		if ("value" in $$props) $$invalidate(0, value = $$props.value);
    		if ("sliderElement" in $$props) $$invalidate(1, sliderElement = $$props.sliderElement);
    		if ("isSliderActive" in $$props) $$invalidate(2, isSliderActive = $$props.isSliderActive);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		value,
    		sliderElement,
    		isSliderActive,
    		onSliderInputStart,
    		onSliderInputEnd,
    		onSliderInput,
    		div2_binding
    	];
    }

    class Slider extends SvelteElement {
    	constructor(options) {
    		super();
    		this.shadowRoot.innerHTML = `<style>.PlayerSlider{padding:4px 0;cursor:pointer}.PlayerSlider__track{position:relative;flex:1;height:4px;border-radius:3px;margin:6px 0;background:var(--flipnote-player-slider-track, #FFD3A6)}.PlayerSlider__level{position:absolute;width:100%;height:6px;margin:-1px;border-radius:8px;background:var(--flipnote-player-slider-level, #F36A2D)}.PlayerSlider__handle{display:none;position:absolute;top:0;height:10px;width:6px;margin-left:-3px;margin-top:-3px;border-radius:2px;background:var(--flipnote-player-slider-handle, #F36A2D)}.PlayerSlider:hover .PlayerSlider__handle{display:block}</style>`;
    		init(this, { target: this.shadowRoot }, instance, create_fragment, safe_not_equal, { value: 0 });

    		if (options) {
    			if (options.target) {
    				insert_dev(options.target, this, options.anchor);
    			}

    			if (options.props) {
    				this.$set(options.props);
    				flush();
    			}
    		}
    	}

    	static get observedAttributes() {
    		return ["value"];
    	}

    	get value() {
    		return this.$$.ctx[0];
    	}

    	set value(value) {
    		this.$set({ value });
    		flush();
    	}
    }

    customElements.define("flipnote-player-slider-bar", Slider);

    var IconPlay = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 241 240\"><path fill-rule=\"evenodd\" d=\"M74.137 48h8.985a4 4 0 012.129.614l91.994 57.84c7.48 4.704 9.732 14.582 5.028 22.062a16 16 0 01-5.028 5.03l-91.994 57.84a4 4 0 01-2.13.614h-8.984C68.54 192 64 187.461 64 181.863V58.137C64 52.54 68.539 48 74.137 48z\"/></svg>";

    var IconPause = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 240 240\"><path fill-rule=\"evenodd\" d=\"M64 48h24c8.837 0 16 7.163 16 16v112c0 8.837-7.163 16-16 16H64c-8.837 0-16-7.163-16-16V64c0-8.837 7.163-16 16-16zm88 0h24c8.837 0 16 7.163 16 16v112c0 8.837-7.163 16-16 16h-24c-8.837 0-16-7.163-16-16V64c0-8.837 7.163-16 16-16z\"/></svg>";

    var IconLoader = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 240 240\"><path fill-rule=\"evenodd\" d=\"M120 176c8.837 0 16 7.163 16 16s-7.163 16-16 16-16-7.163-16-16 7.163-16 16-16zm48.497-28c4.419-7.653 14.204-10.275 21.857-5.856 7.653 4.418 10.275 14.203 5.856 21.856-4.418 7.653-14.203 10.275-21.856 5.856-7.653-4.418-10.275-14.203-5.857-21.856zm-118.85-5.856c7.652-4.419 17.437-1.797 21.856 5.856 4.418 7.653 1.796 17.438-5.857 21.856-7.653 4.419-17.438 1.797-21.856-5.856-4.419-7.653-1.797-17.438 5.856-21.856zm124.707-72c7.653-4.419 17.438-1.797 21.856 5.856 4.419 7.653 1.797 17.438-5.856 21.856-7.653 4.419-17.438 1.797-21.857-5.856-4.418-7.653-1.796-17.438 5.857-21.856zM43.79 76c4.418-7.653 14.203-10.275 21.856-5.856C73.3 74.562 75.921 84.347 71.503 92c-4.419 7.653-14.204 10.275-21.857 5.856C41.993 93.438 39.371 83.653 43.79 76zM120 32c8.837 0 16 7.163 16 16s-7.163 16-16 16-16-7.163-16-16 7.163-16 16-16z\"/></svg>";

    var IconVolumeOn = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 240 240\"><path d=\"M113.3 42.022a10 10 0 0110-1.2 10 10 0 015.7 9v140a10 10 0 01-5.7 9 9.116 9.116 0 01-4.3 1.001 10.009 10.009 0 01-6.2-2.2l-47.3-37.8H29c-5.523 0-10-4.478-10-10v-60c0-5.524 4.477-10 10-10h36.5zm82.986 17.298c17.008 16.234 25.715 36.022 25.715 58.68 0 22.37-8.465 43.147-24.992 61.928-4.378 4.975-11.96 5.459-16.936 1.08-4.975-4.378-5.46-11.96-1.08-16.936C191.798 149.52 198 134.297 198 118c0-16.009-5.96-29.554-18.286-41.32-4.794-4.576-4.97-12.172-.395-16.966 4.577-4.794 12.172-4.97 16.966-.394zM165.201 87.4c10.904 8.178 16.8 18.987 16.8 31.6 0 12.433-5.712 23.38-16.318 32.219-5.091 4.242-12.658 3.555-16.9-1.537-4.174-5.008-3.577-12.41 1.289-16.69l.246-.21c5.395-4.496 7.683-8.881 7.683-13.782 0-4.613-2.01-8.403-6.857-12.14l-.343-.26c-5.302-3.976-6.377-11.498-2.4-16.8 3.976-5.302 11.498-6.376 16.8-2.4z\"/></svg>";

    var IconVolumeOff = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 240 240\"><path d=\"M123.3 40.822a10 10 0 00-10 1.2l-47.8 37.8H29c-5.523 0-10 4.477-10 10v60c0 5.523 4.477 10 10 10h36.5l47.3 37.8a10.009 10.009 0 006.2 2.201 9.116 9.116 0 004.3-1 10 10 0 005.7-9v-140a10 10 0 00-5.7-9zm70.451 50.462c4.702-4.454 12.126-4.377 16.734.23 4.608 4.609 4.685 12.033.23 16.735l-.23.236L198.971 120l11.514 11.515c4.687 4.686 4.687 12.284 0 16.97-4.608 4.608-12.032 4.685-16.734.23l-.236-.23L182 136.971l-11.515 11.514-.236.23c-4.702 4.455-12.126 4.378-16.734-.23-4.608-4.608-4.685-12.032-.23-16.734l.23-.236L165.029 120l-11.514-11.515c-4.687-4.686-4.687-12.284 0-16.97 4.608-4.608 12.032-4.685 16.734-.23l.236.23L182 103.029l11.515-11.514.236-.23z\"/></svg>";

    /* src/components/Icon.svelte generated by Svelte v3.24.0 */
    const file$1 = "src/components/Icon.svelte";

    function create_fragment$1(ctx) {
    	let div;
    	let raw_value = /*iconMap*/ ctx[1][/*icon*/ ctx[0]] + "";

    	const block = {
    		c: function create() {
    			div = element("div");
    			this.c = noop;
    			attr_dev(div, "class", "PlayerIcon");
    			add_location(div, file$1, 26, 0, 865);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			div.innerHTML = raw_value;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*icon*/ 1 && raw_value !== (raw_value = /*iconMap*/ ctx[1][/*icon*/ ctx[0]] + "")) div.innerHTML = raw_value;		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const style = "fill:currentColor";

    function instance$1($$self, $$props, $$invalidate) {
    	let { icon = "play" } = $$props;

    	const iconMap = {
    		play: injectSvgStyle(IconPlay, style),
    		pause: injectSvgStyle(IconPause, style),
    		loader: injectSvgStyle(IconLoader, style),
    		volumeOn: injectSvgStyle(IconVolumeOn, style),
    		volumeOff: injectSvgStyle(IconVolumeOff, style)
    	};

    	const writable_props = ["icon"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<flipnote-player-icon> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("flipnote-player-icon", $$slots, []);

    	$$self.$set = $$props => {
    		if ("icon" in $$props) $$invalidate(0, icon = $$props.icon);
    	};

    	$$self.$capture_state = () => ({
    		injectSvgStyle,
    		IconPlay,
    		IconPause,
    		IconLoader,
    		IconVolumeOn,
    		IconVolumeOff,
    		icon,
    		style,
    		iconMap
    	});

    	$$self.$inject_state = $$props => {
    		if ("icon" in $$props) $$invalidate(0, icon = $$props.icon);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [icon, iconMap];
    }

    class Icon extends SvelteElement {
    	constructor(options) {
    		super();
    		this.shadowRoot.innerHTML = `<style>.PlayerIcon{width:100%;height:100%;color:var(--flipnote-player-icon-color, #F36A2D)}</style>`;
    		init(this, { target: this.shadowRoot }, instance$1, create_fragment$1, safe_not_equal, { icon: 0 });

    		if (options) {
    			if (options.target) {
    				insert_dev(options.target, this, options.anchor);
    			}

    			if (options.props) {
    				this.$set(options.props);
    				flush();
    			}
    		}
    	}

    	static get observedAttributes() {
    		return ["icon"];
    	}

    	get icon() {
    		return this.$$.ctx[0];
    	}

    	set icon(icon) {
    		this.$set({ icon });
    		flush();
    	}
    }

    customElements.define("flipnote-player-icon", Icon);

    /* src/components/Player.svelte generated by Svelte v3.24.0 */
    const file$2 = "src/components/Player.svelte";

    // (120:4) {:catch error}
    function create_catch_block(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Error";
    			attr_dev(div, "class", "FlipnotePlayer__overlay");
    			add_location(div, file$2, 120, 6, 2771);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block.name,
    		type: "catch",
    		source: "(120:4) {:catch error}",
    		ctx
    	});

    	return block;
    }

    // (1:0) <svelte:options   tag={ null }
    function create_then_block(ctx) {
    	const block = { c: noop, m: noop, d: noop };

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block.name,
    		type: "then",
    		source: "(1:0) <svelte:options   tag={ null }",
    		ctx
    	});

    	return block;
    }

    // (116:27)        <div class="FlipnotePlayer__overlay">         <flipnote-player-icon icon="loader" class="FlipnotePlayer__loaderIcon"/>       </div>     {:catch error}
    function create_pending_block(ctx) {
    	let div;
    	let flipnote_player_icon;

    	const block = {
    		c: function create() {
    			div = element("div");
    			flipnote_player_icon = element("flipnote-player-icon");
    			set_custom_element_data(flipnote_player_icon, "icon", "loader");
    			set_custom_element_data(flipnote_player_icon, "class", "FlipnotePlayer__loaderIcon");
    			add_location(flipnote_player_icon, file$2, 117, 8, 2660);
    			attr_dev(div, "class", "FlipnotePlayer__overlay");
    			add_location(div, file$2, 116, 6, 2614);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, flipnote_player_icon);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block.name,
    		type: "pending",
    		source: "(116:27)        <div class=\\\"FlipnotePlayer__overlay\\\">         <flipnote-player-icon icon=\\\"loader\\\" class=\\\"FlipnotePlayer__loaderIcon\\\"/>       </div>     {:catch error}",
    		ctx
    	});

    	return block;
    }

    // (174:32) 
    function create_if_block_2(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "todo :)";
    			attr_dev(div, "class", "FlipnotePlayerControls FlipnotePlayerControls--full");
    			add_location(div, file$2, 174, 4, 4795);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(174:32) ",
    		ctx
    	});

    	return block;
    }

    // (142:35) 
    function create_if_block_1(ctx) {
    	let div3;
    	let flipnote_player_slider_bar0;
    	let flipnote_player_slider_bar0_value_value;
    	let t0;
    	let div2;
    	let div0;
    	let button;
    	let flipnote_player_icon0;
    	let flipnote_player_icon0_icon_value;
    	let t1;
    	let span;
    	let t2;
    	let t3;
    	let div1;
    	let flipnote_player_icon1;
    	let flipnote_player_icon1_icon_value;
    	let t4;
    	let flipnote_player_slider_bar1;
    	let flipnote_player_slider_bar1_value_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			flipnote_player_slider_bar0 = element("flipnote-player-slider-bar");
    			t0 = space();
    			div2 = element("div");
    			div0 = element("div");
    			button = element("button");
    			flipnote_player_icon0 = element("flipnote-player-icon");
    			t1 = space();
    			span = element("span");
    			t2 = text(/*timeString*/ ctx[6]);
    			t3 = space();
    			div1 = element("div");
    			flipnote_player_icon1 = element("flipnote-player-icon");
    			t4 = space();
    			flipnote_player_slider_bar1 = element("flipnote-player-slider-bar");
    			set_custom_element_data(flipnote_player_slider_bar0, "class", "FlipnotePlayerControls__progressBar");
    			set_custom_element_data(flipnote_player_slider_bar0, "value", flipnote_player_slider_bar0_value_value = /*progress*/ ctx[3] / 100);
    			add_location(flipnote_player_slider_bar0, file$2, 143, 6, 3584);
    			set_custom_element_data(flipnote_player_icon0, "icon", flipnote_player_icon0_icon_value = /*isPlaying*/ ctx[4] ? "pause" : "play");
    			add_location(flipnote_player_icon0, file$2, 153, 12, 4057);
    			attr_dev(button, "class", "Button FlipnotePlayerControls__playButton");
    			add_location(button, file$2, 152, 10, 3962);
    			attr_dev(span, "class", "FlipnotePlayerControls__frameCounter");
    			add_location(span, file$2, 155, 10, 4149);
    			attr_dev(div0, "class", "FlipnotePlayerControls__groupLeft");
    			add_location(div0, file$2, 151, 8, 3904);
    			set_custom_element_data(flipnote_player_icon1, "class", "FlipnotePlayerControls__muteIcon");

    			set_custom_element_data(flipnote_player_icon1, "icon", flipnote_player_icon1_icon_value = /*muted*/ ctx[0] || /*volume*/ ctx[5] === 0
    			? "volumeOff"
    			: "volumeOn");

    			add_location(flipnote_player_icon1, file$2, 160, 10, 4328);
    			set_custom_element_data(flipnote_player_slider_bar1, "class", "FlipnotePlayerControls__volumeBar");
    			set_custom_element_data(flipnote_player_slider_bar1, "value", flipnote_player_slider_bar1_value_value = /*muted*/ ctx[0] ? 0 : /*volume*/ ctx[5]);
    			add_location(flipnote_player_slider_bar1, file$2, 165, 10, 4535);
    			attr_dev(div1, "class", "FlipnotePlayerControls__groupRight");
    			add_location(div1, file$2, 159, 8, 4269);
    			attr_dev(div2, "class", "FlipnotePlayerControls__row");
    			add_location(div2, file$2, 150, 6, 3854);
    			attr_dev(div3, "class", "FlipnotePlayerControls FlipnotePlayerControls--default");
    			add_location(div3, file$2, 142, 4, 3509);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, flipnote_player_slider_bar0);
    			append_dev(div3, t0);
    			append_dev(div3, div2);
    			append_dev(div2, div0);
    			append_dev(div0, button);
    			append_dev(button, flipnote_player_icon0);
    			append_dev(div0, t1);
    			append_dev(div0, span);
    			append_dev(span, t2);
    			append_dev(div2, t3);
    			append_dev(div2, div1);
    			append_dev(div1, flipnote_player_icon1);
    			append_dev(div1, t4);
    			append_dev(div1, flipnote_player_slider_bar1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(flipnote_player_slider_bar0, "change", /*handleProgressBarChange*/ ctx[9], false, false, false),
    					listen_dev(flipnote_player_slider_bar0, "inputstart", /*handleProgressBarInputStart*/ ctx[8], false, false, false),
    					listen_dev(flipnote_player_slider_bar0, "inputend", /*handleProgressBarInputEnd*/ ctx[10], false, false, false),
    					listen_dev(button, "click", /*togglePlay*/ ctx[12], false, false, false),
    					listen_dev(flipnote_player_icon1, "click", /*toggleMute*/ ctx[13], false, false, false),
    					listen_dev(flipnote_player_slider_bar1, "change", /*handleVolumeBarChange*/ ctx[11], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*progress*/ 8 && flipnote_player_slider_bar0_value_value !== (flipnote_player_slider_bar0_value_value = /*progress*/ ctx[3] / 100)) {
    				set_custom_element_data(flipnote_player_slider_bar0, "value", flipnote_player_slider_bar0_value_value);
    			}

    			if (dirty & /*isPlaying*/ 16 && flipnote_player_icon0_icon_value !== (flipnote_player_icon0_icon_value = /*isPlaying*/ ctx[4] ? "pause" : "play")) {
    				set_custom_element_data(flipnote_player_icon0, "icon", flipnote_player_icon0_icon_value);
    			}

    			if (dirty & /*timeString*/ 64) set_data_dev(t2, /*timeString*/ ctx[6]);

    			if (dirty & /*muted, volume*/ 33 && flipnote_player_icon1_icon_value !== (flipnote_player_icon1_icon_value = /*muted*/ ctx[0] || /*volume*/ ctx[5] === 0
    			? "volumeOff"
    			: "volumeOn")) {
    				set_custom_element_data(flipnote_player_icon1, "icon", flipnote_player_icon1_icon_value);
    			}

    			if (dirty & /*muted, volume*/ 33 && flipnote_player_slider_bar1_value_value !== (flipnote_player_slider_bar1_value_value = /*muted*/ ctx[0] ? 0 : /*volume*/ ctx[5])) {
    				set_custom_element_data(flipnote_player_slider_bar1, "value", flipnote_player_slider_bar1_value_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(142:35) ",
    		ctx
    	});

    	return block;
    }

    // (126:2) {#if controls === 'compact'}
    function create_if_block(ctx) {
    	let div;
    	let button;
    	let flipnote_player_icon;
    	let flipnote_player_icon_icon_value;
    	let t;
    	let flipnote_player_slider_bar;
    	let flipnote_player_slider_bar_value_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			button = element("button");
    			flipnote_player_icon = element("flipnote-player-icon");
    			t = space();
    			flipnote_player_slider_bar = element("flipnote-player-slider-bar");
    			set_custom_element_data(flipnote_player_icon, "icon", flipnote_player_icon_icon_value = /*isPlaying*/ ctx[4] ? "pause" : "play");
    			add_location(flipnote_player_icon, file$2, 131, 8, 3110);
    			attr_dev(button, "class", "Button FlipnotePlayerControls__playButton");
    			add_location(button, file$2, 127, 6, 2996);
    			set_custom_element_data(flipnote_player_slider_bar, "class", "FlipnotePlayerControls__progressBar");
    			set_custom_element_data(flipnote_player_slider_bar, "value", flipnote_player_slider_bar_value_value = /*progress*/ ctx[3] / 100);
    			add_location(flipnote_player_slider_bar, file$2, 133, 6, 3194);
    			attr_dev(div, "class", "FlipnotePlayerControls FlipnotePlayerControls--compact FlipnotePlayerControls__row");
    			add_location(div, file$2, 126, 4, 2893);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, button);
    			append_dev(button, flipnote_player_icon);
    			append_dev(div, t);
    			append_dev(div, flipnote_player_slider_bar);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button, "click", /*togglePlay*/ ctx[12], false, false, false),
    					listen_dev(flipnote_player_slider_bar, "change", /*handleProgressBarChange*/ ctx[9], false, false, false),
    					listen_dev(flipnote_player_slider_bar, "inputstart", /*handleProgressBarInputStart*/ ctx[8], false, false, false),
    					listen_dev(flipnote_player_slider_bar, "inputend", /*handleProgressBarInputEnd*/ ctx[10], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*isPlaying*/ 16 && flipnote_player_icon_icon_value !== (flipnote_player_icon_icon_value = /*isPlaying*/ ctx[4] ? "pause" : "play")) {
    				set_custom_element_data(flipnote_player_icon, "icon", flipnote_player_icon_icon_value);
    			}

    			if (dirty & /*progress*/ 8 && flipnote_player_slider_bar_value_value !== (flipnote_player_slider_bar_value_value = /*progress*/ ctx[3] / 100)) {
    				set_custom_element_data(flipnote_player_slider_bar, "value", flipnote_player_slider_bar_value_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(126:2) {#if controls === 'compact'}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div1;
    	let div0;
    	let canvas;
    	let t0;
    	let promise;
    	let t1;
    	let mounted;
    	let dispose;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		pending: create_pending_block,
    		then: create_then_block,
    		catch: create_catch_block,
    		error: 24
    	};

    	handle_promise(promise = /*flipnoteLoader*/ ctx[7], info);

    	function select_block_type(ctx, dirty) {
    		if (/*controls*/ ctx[1] === "compact") return create_if_block;
    		if (/*controls*/ ctx[1] === "default") return create_if_block_1;
    		if (/*controls*/ ctx[1] === "full") return create_if_block_2;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type && current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			canvas = element("canvas");
    			t0 = space();
    			info.block.c();
    			t1 = space();
    			if (if_block) if_block.c();
    			this.c = noop;
    			attr_dev(canvas, "class", "FlipnotePlayer__canvas");
    			add_location(canvas, file$2, 110, 4, 2464);
    			attr_dev(div0, "class", "FlipnotePlayer__canvasArea");
    			add_location(div0, file$2, 109, 2, 2419);
    			attr_dev(div1, "class", "FlipnotePlayer");
    			add_location(div1, file$2, 108, 0, 2388);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, canvas);
    			/*canvas_binding*/ ctx[16](canvas);
    			append_dev(div0, t0);
    			info.block.m(div0, info.anchor = null);
    			info.mount = () => div0;
    			info.anchor = null;
    			append_dev(div1, t1);
    			if (if_block) if_block.m(div1, null);

    			if (!mounted) {
    				dispose = listen_dev(canvas, "click", /*togglePlay*/ ctx[12], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			info.ctx = ctx;
    			dirty & /*flipnoteLoader*/ 128 && promise !== (promise = /*flipnoteLoader*/ ctx[7]) && handle_promise(promise, info);

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if (if_block) if_block.d(1);
    				if_block = current_block_type && current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div1, null);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			/*canvas_binding*/ ctx[16](null);
    			info.block.d();
    			info.token = null;
    			info = null;

    			if (if_block) {
    				if_block.d();
    			}

    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { src = null } = $$props;
    	let { controls = "default" } = $$props;
    	let { timeformat = "frames" } = $$props;
    	let { muted = false } = $$props;
    	let player; // will be bound to flipnote player object
    	let canvasElement; // will be bound to the canvas element
    	let progress = 0;
    	let currentFrame = 0;
    	let totalFrames = 0;
    	let currentTime = 0;
    	let duration = 0;
    	let isPlaying = false;
    	let volume = 1;
    	let isMuted = false;
    	let timeString = "";

    	onMount(() => {
    		$$invalidate(17, player = new Player(canvasElement, 256, 192));

    		player.on("load", () => {
    			$$invalidate(19, totalFrames = player.frameCount);
    			$$invalidate(21, duration = player.duration);
    			$$invalidate(5, volume = player.volume);
    			$$invalidate(17, player.muted = muted, player);
    			player.resize(player.note.width, player.note.height);
    		});

    		player.on("progress", playbackProgress => {
    			$$invalidate(3, progress = playbackProgress);
    			$$invalidate(20, currentTime = player.currentTime);
    		});

    		player.on("playback:start", () => {
    			$$invalidate(4, isPlaying = true);
    		});

    		player.on("playback:stop", () => {
    			$$invalidate(4, isPlaying = false);
    		});

    		player.on("frame:update", () => {
    			$$invalidate(18, currentFrame = player.currentFrame + 1);
    		});
    	});

    	async function loadSource(src) {
    		await player.open(src);
    	}

    	function handleProgressBarInputStart(event) {
    		player && player.startSeek();
    	}

    	function handleProgressBarChange(event) {
    		const { value } = event.detail;
    		player && player.seek(value * 100);
    	}

    	function handleProgressBarInputEnd(event) {
    		player && player.endSeek();
    	}

    	function handleVolumeBarChange(event) {
    		const { value } = event.detail;

    		if (player) {
    			$$invalidate(17, player.volume = value, player);
    			$$invalidate(5, volume = value);
    			if (volume > 0 && muted) $$invalidate(0, muted = false);
    		}
    	}

    	function togglePlay() {
    		player && player.togglePlay();
    	}

    	function toggleMute() {
    		$$invalidate(0, muted = !muted);
    	}

    	let flipnoteLoader = new Promise((resolve, reject) => reject());
    	const writable_props = ["src", "controls", "timeformat", "muted"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<undefined> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("undefined", $$slots, []);

    	function canvas_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			canvasElement = $$value;
    			$$invalidate(2, canvasElement);
    		});
    	}

    	$$self.$set = $$props => {
    		if ("src" in $$props) $$invalidate(14, src = $$props.src);
    		if ("controls" in $$props) $$invalidate(1, controls = $$props.controls);
    		if ("timeformat" in $$props) $$invalidate(15, timeformat = $$props.timeformat);
    		if ("muted" in $$props) $$invalidate(0, muted = $$props.muted);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		FlipnotePlayer: Player,
    		createDomEventDispatcher,
    		padNumber,
    		formatTime,
    		src,
    		controls,
    		timeformat,
    		muted,
    		player,
    		canvasElement,
    		progress,
    		currentFrame,
    		totalFrames,
    		currentTime,
    		duration,
    		isPlaying,
    		volume,
    		isMuted,
    		timeString,
    		loadSource,
    		handleProgressBarInputStart,
    		handleProgressBarChange,
    		handleProgressBarInputEnd,
    		handleVolumeBarChange,
    		togglePlay,
    		toggleMute,
    		flipnoteLoader
    	});

    	$$self.$inject_state = $$props => {
    		if ("src" in $$props) $$invalidate(14, src = $$props.src);
    		if ("controls" in $$props) $$invalidate(1, controls = $$props.controls);
    		if ("timeformat" in $$props) $$invalidate(15, timeformat = $$props.timeformat);
    		if ("muted" in $$props) $$invalidate(0, muted = $$props.muted);
    		if ("player" in $$props) $$invalidate(17, player = $$props.player);
    		if ("canvasElement" in $$props) $$invalidate(2, canvasElement = $$props.canvasElement);
    		if ("progress" in $$props) $$invalidate(3, progress = $$props.progress);
    		if ("currentFrame" in $$props) $$invalidate(18, currentFrame = $$props.currentFrame);
    		if ("totalFrames" in $$props) $$invalidate(19, totalFrames = $$props.totalFrames);
    		if ("currentTime" in $$props) $$invalidate(20, currentTime = $$props.currentTime);
    		if ("duration" in $$props) $$invalidate(21, duration = $$props.duration);
    		if ("isPlaying" in $$props) $$invalidate(4, isPlaying = $$props.isPlaying);
    		if ("volume" in $$props) $$invalidate(5, volume = $$props.volume);
    		if ("isMuted" in $$props) isMuted = $$props.isMuted;
    		if ("timeString" in $$props) $$invalidate(6, timeString = $$props.timeString);
    		if ("flipnoteLoader" in $$props) $$invalidate(7, flipnoteLoader = $$props.flipnoteLoader);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*src*/ 16384) {
    			 if (src) {
    				$$invalidate(7, flipnoteLoader = loadSource(src));
    			}
    		}

    		if ($$self.$$.dirty & /*player, muted*/ 131073) {
    			 {
    				if (player) {
    					$$invalidate(17, player.muted = muted, player);
    				}
    			}
    		}

    		if ($$self.$$.dirty & /*timeformat, currentTime, duration, currentFrame, totalFrames*/ 3964928) {
    			 {
    				if (timeformat === "time") {
    					$$invalidate(6, timeString = `${formatTime(currentTime)} / ${formatTime(duration)}`);
    				} else {
    					// default is 'frames'
    					$$invalidate(6, timeString = `${padNumber(currentFrame, 3)} / ${padNumber(totalFrames, 3)}`);
    				}
    			}
    		}
    	};

    	return [
    		muted,
    		controls,
    		canvasElement,
    		progress,
    		isPlaying,
    		volume,
    		timeString,
    		flipnoteLoader,
    		handleProgressBarInputStart,
    		handleProgressBarChange,
    		handleProgressBarInputEnd,
    		handleVolumeBarChange,
    		togglePlay,
    		toggleMute,
    		src,
    		timeformat,
    		canvas_binding
    	];
    }

    class Player$1 extends SvelteElement {
    	constructor(options) {
    		super();
    		this.shadowRoot.innerHTML = `<style>.Button{border:0;padding:0;outline:0;-webkit-appearance:none;display:block;font-family:inherit;font-size:inherit;text-align:center;cursor:pointer;background:var(--flipnote-player-button-background, #FFD3A6);color:var(--flipnote-player-button-color, #F36A2D);border-radius:4px}.Button flipnote-player-icon{display:block}.FlipnotePlayer{display:inline-block;position:relative;font-family:var(--flipnote-player-font-family, sans-serif)}.FlipnotePlayer__canvasArea{position:relative}.FlipnotePlayer__canvas{position:relative;display:block}.FlipnotePlayer__overlay{position:absolute;top:0;left:0;background:#e5e5e9;color:#4b4c53;width:100%;height:100%;display:flex;justify-content:center;align-items:center}@keyframes spin{from{transform:rotateZ(0)}to{transform:rotateZ(360deg)}}.FlipnotePlayer__loaderIcon{animation:spin infinite 1.2s linear}.FlipnotePlayerControls{background:var(--flipnote-player-controls-background, none)}.FlipnotePlayerControls__muteIcon{width:28px;height:28px}.FlipnotePlayerControls__row,.FlipnotePlayerControls__groupLeft,.FlipnotePlayerControls__groupRight{display:flex;align-items:center}.FlipnotePlayerControls__groupLeft{margin-right:auto}.FlipnotePlayerControls__groupRight{margin-left:auto}.FlipnotePlayerControls__playButton{height:32px;width:32px;padding:2px}.FlipnotePlayerControls__frameCounter{font-variant-numeric:tabular-nums}.FlipnotePlayerControls--compact .FlipnotePlayerControls__playButton{margin-right:12px}.FlipnotePlayerControls--compact .FlipnotePlayerControls__progressBar{flex:1}.FlipnotePlayerControls--default .FlipnotePlayerControls__playButton{margin-right:8px}.FlipnotePlayerControls--default .FlipnotePlayerControls__volumeBar{width:70px;margin-left:8px}</style>`;

    		init(this, { target: this.shadowRoot }, instance$2, create_fragment$2, safe_not_equal, {
    			src: 14,
    			controls: 1,
    			timeformat: 15,
    			muted: 0
    		});

    		if (options) {
    			if (options.target) {
    				insert_dev(options.target, this, options.anchor);
    			}

    			if (options.props) {
    				this.$set(options.props);
    				flush();
    			}
    		}
    	}

    	static get observedAttributes() {
    		return ["src", "controls", "timeformat", "muted"];
    	}

    	get src() {
    		return this.$$.ctx[14];
    	}

    	set src(src) {
    		this.$set({ src });
    		flush();
    	}

    	get controls() {
    		return this.$$.ctx[1];
    	}

    	set controls(controls) {
    		this.$set({ controls });
    		flush();
    	}

    	get timeformat() {
    		return this.$$.ctx[15];
    	}

    	set timeformat(timeformat) {
    		this.$set({ timeformat });
    		flush();
    	}

    	get muted() {
    		return this.$$.ctx[0];
    	}

    	set muted(muted) {
    		this.$set({ muted });
    		flush();
    	}
    }

    // Main entrypoint for web
    var version = "5.0.0"; // replaced by @rollup/plugin-replace; see rollup.config.js

    // Entrypoint for webcomponent build
    // https://svelte.dev/docs#Custom_element_API
    // Had to do a hacky type coercion fix to get this to compile without complaints :/
    customElements.define('flipnote-player', Player$1);
    /** @internal */
    var playerComponent = Player$1; // adds window.flipnote.playerComponent

    exports.GifImage = GifImage;
    exports.KwzParser = KwzParser;
    exports.Player = Player;
    exports.PpmParser = PpmParser;
    exports.WavAudio = WavAudio;
    exports.parseSource = parseSource;
    exports.playerComponent = playerComponent;
    exports.version = version;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=flipnote.webcomponent.js.map