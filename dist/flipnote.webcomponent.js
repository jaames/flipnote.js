/*!!
 flipnote.js v4.1.0 (webcomponent version)
 Browser-based playback of .ppm and .kwz animations from Flipnote Studio and Flipnote Studio 3D
 2018 - 2020 James Daniel
 github.com/jaames/flipnote.js
 Flipnote Studio is (c) Nintendo Co., Ltd.
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

    var urlLoader = {
        matches: function (source) {
            return typeof source === 'string';
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

    var fileLoader = {
        matches: function (source) {
            return (typeof File !== 'undefined' && source instanceof File);
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

    var arrayBufferLoader = {
        matches: function (source) {
            return (source instanceof ArrayBuffer);
        },
        load: function (source, resolve, reject) {
            resolve(source);
        }
    };

    var loaders = [
        urlLoader,
        fileLoader,
        arrayBufferLoader
    ];
    function loadSource(source) {
        return new Promise(function (resolve, reject) {
            loaders.forEach(function (loader) {
                if (loader.matches(source)) {
                    loader.load(source, resolve, reject);
                }
            });
        });
    }

    var ByteArray = /** @class */ (function () {
        function ByteArray() {
            this.page = -1;
            this.pages = [];
            this.cursor = 0;
            this.newPage();
        }
        ByteArray.prototype.newPage = function () {
            this.pages[++this.page] = new Uint8Array(ByteArray.pageSize);
            this.cursor = 0;
        };
        ByteArray.prototype.getData = function () {
            var _this = this;
            var data = new Uint8Array((this.page) * ByteArray.pageSize + this.cursor);
            this.pages.map(function (page, index) {
                if (index === _this.page) {
                    data.set(page.slice(0, _this.cursor), index * ByteArray.pageSize);
                }
                else {
                    data.set(page, index * ByteArray.pageSize);
                }
            });
            return data;
        };
        ByteArray.prototype.getBuffer = function () {
            var data = this.getData();
            return data.buffer;
        };
        ByteArray.prototype.writeByte = function (val) {
            if (this.cursor >= ByteArray.pageSize)
                this.newPage();
            this.pages[this.page][this.cursor++] = val;
        };
        ByteArray.prototype.writeBytes = function (array, offset, length) {
            for (var l = length || array.length, i = offset || 0; i < l; i++)
                this.writeByte(array[i]);
        };
        ByteArray.pageSize = 4096;
        return ByteArray;
    }());

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

    var FlipnoteAudioTrack;
    (function (FlipnoteAudioTrack) {
        FlipnoteAudioTrack[FlipnoteAudioTrack["BGM"] = 0] = "BGM";
        FlipnoteAudioTrack[FlipnoteAudioTrack["SE1"] = 1] = "SE1";
        FlipnoteAudioTrack[FlipnoteAudioTrack["SE2"] = 2] = "SE2";
        FlipnoteAudioTrack[FlipnoteAudioTrack["SE3"] = 3] = "SE3";
        FlipnoteAudioTrack[FlipnoteAudioTrack["SE4"] = 4] = "SE4";
    })(FlipnoteAudioTrack || (FlipnoteAudioTrack = {}));
    var FlipnoteParserBase = /** @class */ (function (_super) {
        __extends(FlipnoteParserBase, _super);
        function FlipnoteParserBase() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        FlipnoteParserBase.prototype.hasAudioTrack = function (trackId) {
            if (this.soundMeta.hasOwnProperty(trackId) && this.soundMeta[trackId].length > 0) {
                return true;
            }
            return false;
        };
        return FlipnoteParserBase;
    }(DataStream));

    function clamp(n, l, h) {
        if (n < l)
            return l;
        if (n > h)
            return h;
        return n;
    }
    // zero-order hold interpolation
    function pcmDsAudioResample(src, srcFreq, dstFreq) {
        var srcDuration = src.length / srcFreq;
        var dstLength = srcDuration * dstFreq;
        var dst = new Int16Array(dstLength);
        var adjFreq = (srcFreq << 8) / dstFreq;
        for (var n = 0; n < dst.length; n++) {
            dst[n] = src[(n * adjFreq) >> 8];
            // dst[n] = clamp(samp, -32768, 32767);
        }
        return dst;
    }
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
    var ADPCM_INDEX_TABLE_2BIT = new Int8Array([
        -1, 2, -1, 2
    ]);
    var ADPCM_INDEX_TABLE_4BIT = new Int8Array([
        -1, -1, -1, -1, 2, 4, 6, 8,
        -1, -1, -1, -1, 2, 4, 6, 8
    ]);
    // note that this is a slight deviation from the normal adpcm table
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
    // internal frame speed value -> FPS table
    var FRAMERATES = [0.5, 0.5, 1, 2, 4, 6, 12, 20, 30];
    var PALETTE = {
        WHITE: [0xff, 0xff, 0xff],
        BLACK: [0x0e, 0x0e, 0x0e],
        RED: [0xff, 0x2a, 0x2a],
        BLUE: [0x0a, 0x39, 0xff]
    };
    var DS_SAMPLE_RATE = 32768;
    var PpmParser = /** @class */ (function (_super) {
        __extends(PpmParser, _super);
        function PpmParser(arrayBuffer) {
            var _this = _super.call(this, arrayBuffer) || this;
            _this.type = PpmParser.type;
            _this.width = PpmParser.width;
            _this.height = PpmParser.height;
            _this.globalPalette = PpmParser.globalPalette;
            _this.sampleRate = PpmParser.sampleRate;
            _this.prevDecodedFrame = null;
            _this.decodeHeader();
            _this.decodeAnimationHeader();
            _this.decodeSoundHeader();
            // this is always true afaik, it's likely just a remnamt from development
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
            // https://github.com/pbsds/hatena-server/wiki/PPM-format#file-header
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
            // https://github.com/pbsds/hatena-server/wiki/PPM-format#file-header
            this.seek(0x10);
            var lock = this.readUint16(), thumbIndex = this.readInt16(), rootAuthorName = this.readWideChars(11), parentAuthorName = this.readWideChars(11), currentAuthorName = this.readWideChars(11), parentAuthorId = this.readHex(8, true), currentAuthorId = this.readHex(8, true), parentFilename = this.readFilename(), currentFilename = this.readFilename(), rootAuthorId = this.readHex(8, true);
            this.seek(0x9A);
            var timestamp = new Date((this.readUint32() + 946684800) * 1000);
            this.seek(0x06A6);
            var flags = this.readUint16();
            this.thumbFrameIndex = thumbIndex;
            this.meta = {
                lock: lock === 1,
                loop: (flags >> 1 & 0x01) === 1,
                frame_count: this.frameCount,
                frame_speed: this.frameSpeed,
                bgm_speed: this.bgmSpeed,
                thumb_index: thumbIndex,
                timestamp: timestamp,
                spinoff: (currentAuthorId !== parentAuthorId) || (currentAuthorId !== rootAuthorId),
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
            // https://github.com/pbsds/hatena-server/wiki/PPM-format#animation-data-section
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
            // https://github.com/pbsds/hatena-server/wiki/PPM-format#sound-data-section
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
            this.framerate = FRAMERATES[this.frameSpeed];
            this.bgmrate = FRAMERATES[this.bgmSpeed];
            this.soundMeta = (_a = {},
                _a[FlipnoteAudioTrack.BGM] = { offset: offset, length: bgmLen },
                _a[FlipnoteAudioTrack.SE1] = { offset: offset += bgmLen, length: se1Len },
                _a[FlipnoteAudioTrack.SE2] = { offset: offset += se1Len, length: se2Len },
                _a[FlipnoteAudioTrack.SE3] = { offset: offset += se2Len, length: se3Len },
                _a);
        };
        PpmParser.prototype.isNewFrame = function (frameIndex) {
            this.seek(this.frameOffsets[frameIndex]);
            var header = this.readUint8();
            return (header >> 7) & 0x1;
        };
        PpmParser.prototype.getLayerOrder = function (frameIndex) {
            return [0, 1];
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
        PpmParser.prototype.decodeFrame = function (frameIndex) {
            if ((this.prevDecodedFrame !== frameIndex - 1) && (!this.isNewFrame(frameIndex) && (frameIndex !== 0)))
                this.decodeFrame(frameIndex - 1);
            // https://github.com/pbsds/hatena-server/wiki/PPM-format#animation-frame
            this.seek(this.frameOffsets[frameIndex]);
            var header = this.readUint8();
            var isNewFrame = (header >> 7) & 0x1;
            var isTranslated = (header >> 5) & 0x3;
            var translateX = 0;
            var translateY = 0;
            // copy the current layer buffers to the previous ones
            this.prevLayers[0].set(this.layers[0]);
            this.prevLayers[1].set(this.layers[1]);
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
                    var chunkOffset = line * PpmParser.width;
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
                                layerBitmap.fill(0xFF, chunkOffset, chunkOffset + PpmParser.width);
                            // loop through each bit in the line header
                            while (lineHeader & 0xFFFFFFFF) {
                                // if the bit is set, this 8-pix wide chunk is stored
                                // else we can just leave it blank and move on to the next chunk
                                if (lineHeader & 0x80000000) {
                                    var chunk = this.readUint8();
                                    // unpack chunk bits
                                    for (var pixel = 0; pixel < 8; pixel++) {
                                        layerBitmap[chunkOffset + pixel] = (chunk >> pixel & 0x1) ? 0xFF : 0x00;
                                    }
                                }
                                chunkOffset += 8;
                                // shift lineheader to the left by 1 bit, now on the next loop cycle the next bit will be checked
                                lineHeader <<= 1;
                            }
                            break;
                        // line type 3 = raw bitmap line
                        case 3:
                            while (chunkOffset < (line + 1) * PpmParser.width) {
                                var chunk = this.readUint8();
                                for (var pixel = 0; pixel < 8; pixel++) {
                                    layerBitmap[chunkOffset + pixel] = (chunk >> pixel & 0x1) ? 0xFF : 0x00;
                                }
                                chunkOffset += 8;
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
            return this.layers;
        };
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
        PpmParser.prototype.getFramePalette = function (frameIndex) {
            var _this = this;
            var indices = this.getFramePaletteIndices(frameIndex);
            return indices.map(function (colorIndex) { return _this.globalPalette[colorIndex]; });
        };
        // retuns an uint8 array where each item is a pixel's palette index
        PpmParser.prototype.getLayerPixels = function (frameIndex, layerIndex) {
            if (this.prevDecodedFrame !== frameIndex) {
                this.decodeFrame(frameIndex);
            }
            var palette = this.getFramePaletteIndices(frameIndex);
            var layer = this.layers[layerIndex];
            var image = new Uint8Array(PpmParser.width * PpmParser.height);
            var layerColor = palette[layerIndex + 1];
            for (var pixel = 0; pixel < image.length; pixel++) {
                if (layer[pixel] !== 0)
                    image[pixel] = layerColor;
            }
            return image;
        };
        // retuns an uint8 array where each item is a pixel's palette index
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
                if (a !== 0)
                    image[pixel] = layer1Color;
                else if (b !== 0)
                    image[pixel] = layer2Color;
            }
            return image;
        };
        PpmParser.prototype.decodeSoundFlags = function () {
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
        PpmParser.prototype.getAudioTrackRaw = function (trackId) {
            var trackMeta = this.soundMeta[trackId];
            var adpcm = new Uint8Array(this.buffer, trackMeta.offset, trackMeta.length);
            return adpcm;
        };
        // kinda slow, maybe use sample lookup table
        PpmParser.prototype.decodeAudioTrack = function (trackId) {
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
        PpmParser.prototype.getAudioTrackPcm = function (trackId, dstFreq) {
            if (dstFreq === void 0) { dstFreq = DS_SAMPLE_RATE; }
            var srcPcm = this.decodeAudioTrack(trackId);
            var srcFreq = this.sampleRate;
            if (trackId === FlipnoteAudioTrack.BGM) {
                var bgmAdjust = (1 / this.bgmrate) / (1 / this.framerate);
                srcFreq = this.sampleRate * bgmAdjust;
            }
            if (srcFreq !== dstFreq) {
                return pcmDsAudioResample(srcPcm, srcFreq, dstFreq);
            }
            return srcPcm;
        };
        PpmParser.prototype.getAudioMasterPcm = function (dstFreq) {
            if (dstFreq === void 0) { dstFreq = DS_SAMPLE_RATE; }
            var duration = this.frameCount * (1 / this.framerate);
            var dstSize = Math.floor(duration * dstFreq);
            var master = new Int16Array(dstSize);
            var hasBgm = this.hasAudioTrack(FlipnoteAudioTrack.BGM);
            var hasSe1 = this.hasAudioTrack(FlipnoteAudioTrack.SE1);
            var hasSe2 = this.hasAudioTrack(FlipnoteAudioTrack.SE2);
            var hasSe3 = this.hasAudioTrack(FlipnoteAudioTrack.SE3);
            // Mix background music
            if (hasBgm) {
                var bgmPcm = this.getAudioTrackPcm(FlipnoteAudioTrack.BGM, dstFreq);
                pcmAudioMix(bgmPcm, master, 0);
            }
            // Mix sound effects
            if (hasSe1 || hasSe2 || hasSe3) {
                var samplesPerFrame = Math.floor(dstFreq / this.framerate);
                var seFlags = this.decodeSoundFlags();
                var se1Pcm = hasSe1 ? this.getAudioTrackPcm(FlipnoteAudioTrack.SE1, dstFreq) : null;
                var se2Pcm = hasSe2 ? this.getAudioTrackPcm(FlipnoteAudioTrack.SE2, dstFreq) : null;
                var se3Pcm = hasSe3 ? this.getAudioTrackPcm(FlipnoteAudioTrack.SE3, dstFreq) : null;
                for (var i = 0; i < this.frameCount; i++) {
                    var seOffset = samplesPerFrame * i;
                    var flag = seFlags[i];
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
        PpmParser.type = 'PPM';
        PpmParser.width = 256;
        PpmParser.height = 192;
        PpmParser.sampleRate = 8192;
        PpmParser.outputSampleRate = 32768;
        PpmParser.globalPalette = [
            PALETTE.WHITE,
            PALETTE.BLACK,
            PALETTE.RED,
            PALETTE.BLUE
        ];
        return PpmParser;
    }(FlipnoteParserBase));

    // Every possible sequence of pixels for each tile line
    var KWZ_LINE_TABLE = new Uint16Array(6561 * 8);
    var pixelValues = [0x0000, 0xFF00, 0x00FF];
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
                                        pixelValues[b],
                                        pixelValues[a],
                                        pixelValues[d],
                                        pixelValues[c],
                                        pixelValues[f],
                                        pixelValues[e],
                                        pixelValues[h],
                                        pixelValues[g]
                                    ], offset);
                                    offset += 8;
                                }
    // Line offsets, but the lines are shifted to the left by one pixel
    var KWZ_LINE_TABLE_SHIFT = new Uint16Array(6561 * 8);
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
    var KWZ_LINE_TABLE_COMMON = new Uint16Array(32 * 8);
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
    var KWZ_LINE_TABLE_COMMON_SHIFT = new Uint16Array(32 * 8);
    [
        0x0000, 0x0CD0, 0x19A0, 0x0003, 0x02D9, 0x088B, 0x0051, 0x00F3,
        0x0009, 0x001B, 0x0001, 0x0006, 0x05B2, 0x1116, 0x00A2, 0x01E6,
        0x0012, 0x0036, 0x0002, 0x02DC, 0x0B64, 0x08DC, 0x0144, 0x00FC,
        0x0024, 0x001C, 0x099C, 0x0334, 0x1338, 0x0668, 0x166C, 0x1004
    ].forEach(function (lineTableIndex, index) {
        var pixels = KWZ_LINE_TABLE.subarray(lineTableIndex * 8, lineTableIndex * 8 + 8);
        KWZ_LINE_TABLE_COMMON_SHIFT.set(pixels, index * 8);
    });

    var FRAMERATES$1 = [.2, .5, 1, 2, 4, 6, 8, 12, 20, 24, 30];
    var PALETTE$1 = {
        WHITE: [0xff, 0xff, 0xff],
        BLACK: [0x10, 0x10, 0x10],
        RED: [0xff, 0x10, 0x10],
        YELLOW: [0xff, 0xe7, 0x00],
        GREEN: [0x00, 0x86, 0x31],
        BLUE: [0x00, 0x38, 0xce],
        NONE: [0xff, 0xff, 0xff]
    };
    var CTR_SAMPLE_RATE = 32768;
    var KwzParser = /** @class */ (function (_super) {
        __extends(KwzParser, _super);
        function KwzParser(arrayBuffer) {
            var _this = _super.call(this, arrayBuffer) || this;
            _this.type = KwzParser.type;
            _this.width = KwzParser.width;
            _this.height = KwzParser.height;
            _this.globalPalette = KwzParser.globalPalette;
            _this.sampleRate = KwzParser.sampleRate;
            _this.prevDecodedFrame = null;
            _this.bitIndex = 0;
            _this.bitValue = 0;
            _this.layers = [
                new Uint16Array(KwzParser.width * KwzParser.height),
                new Uint16Array(KwzParser.width * KwzParser.height),
                new Uint16Array(KwzParser.width * KwzParser.height),
            ];
            _this.bitIndex = 0;
            _this.bitValue = 0;
            _this.load();
            return _this;
        }
        KwzParser.prototype.load = function () {
            this.seek(0);
            this.sections = {};
            this.frameMeta = [];
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
            this.decodeMeta();
            this.decodeFrameMeta();
            this.decodeSoundHeader();
        };
        KwzParser.prototype.readBits = function (num) {
            if (this.bitIndex + num > 16) {
                var nextBits = this.readUint16();
                this.bitValue |= nextBits << (16 - this.bitIndex);
                this.bitIndex -= 16;
            }
            var mask = (1 << num) - 1;
            var result = this.bitValue & mask;
            this.bitValue >>= num;
            this.bitIndex += num;
            return result;
        };
        KwzParser.prototype.decodeMeta = function () {
            this.seek(this.sections['KFH'].offset + 12);
            var creationTimestamp = new Date((this.readUint32() + 946684800) * 1000), modifiedTimestamp = new Date((this.readUint32() + 946684800) * 1000), appVersion = this.readUint32(), rootAuthorId = this.readHex(10), parentAuthorId = this.readHex(10), currentAuthorId = this.readHex(10), rootAuthorName = this.readWideChars(11), parentAuthorName = this.readWideChars(11), currentAuthorName = this.readWideChars(11), rootFilename = this.readChars(28), parentFilename = this.readChars(28), currentFilename = this.readChars(28), frameCount = this.readUint16(), thumbIndex = this.readUint16(), flags = this.readUint16(), frameSpeed = this.readUint8(), layerFlags = this.readUint8();
            this.frameCount = frameCount;
            this.thumbFrameIndex = thumbIndex;
            this.frameSpeed = frameSpeed;
            this.framerate = FRAMERATES$1[frameSpeed];
            this.meta = {
                lock: (flags & 0x1) === 1,
                loop: ((flags >> 1) & 0x01) === 1,
                frame_count: frameCount,
                frame_speed: frameSpeed,
                thumb_index: thumbIndex,
                timestamp: modifiedTimestamp,
                creation_timestamp: creationTimestamp,
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
        KwzParser.prototype.decodeFrameMeta = function () {
            this.frameOffsets = new Uint32Array(this.frameCount);
            this.seek(this.sections['KMI'].offset + 8);
            var offset = this.sections['KMC'].offset + 12;
            for (var i = 0; i < this.frameCount; i++) {
                var frame = {
                    flags: this.readUint32(),
                    layerSize: [
                        this.readUint16(),
                        this.readUint16(),
                        this.readUint16()
                    ],
                    frameAuthor: this.readHex(10),
                    layerDepth: [
                        this.readUint8(),
                        this.readUint8(),
                        this.readUint8(),
                    ],
                    soundFlags: this.readUint8(),
                    cameraFlag: this.readUint32(),
                };
                this.frameMeta.push(frame);
                this.frameOffsets[i] = offset;
                offset += frame.layerSize[0] + frame.layerSize[1] + frame.layerSize[2];
            }
        };
        KwzParser.prototype.decodeSoundHeader = function () {
            var _a;
            if (this.sections.hasOwnProperty('KSN')) {
                var offset = this.sections['KSN'].offset + 8;
                this.seek(offset);
                var bgmSpeed = this.readUint32();
                this.bgmSpeed = bgmSpeed;
                this.bgmrate = FRAMERATES$1[bgmSpeed];
                var trackSizes = new Uint32Array(this.buffer, offset + 4, 20);
                this.soundMeta = (_a = {},
                    _a[FlipnoteAudioTrack.BGM] = { offset: offset += 28, length: trackSizes[0] },
                    _a[FlipnoteAudioTrack.SE1] = { offset: offset += trackSizes[0], length: trackSizes[1] },
                    _a[FlipnoteAudioTrack.SE2] = { offset: offset += trackSizes[1], length: trackSizes[2] },
                    _a[FlipnoteAudioTrack.SE3] = { offset: offset += trackSizes[2], length: trackSizes[3] },
                    _a[FlipnoteAudioTrack.SE4] = { offset: offset += trackSizes[3], length: trackSizes[4] },
                    _a);
            }
        };
        KwzParser.prototype.getDiffingFlag = function (frameIndex) {
            return ~(this.frameMeta[frameIndex].flags >> 4) & 0x07;
        };
        KwzParser.prototype.getLayerDepths = function (frameIndex) {
            return this.frameMeta[frameIndex].layerDepth;
        };
        // sort layer indices sorted by depth, from bottom to top
        KwzParser.prototype.getLayerOrder = function (frameIndex) {
            var depths = this.getLayerDepths(frameIndex);
            return [2, 1, 0].sort(function (a, b) { return depths[b] - depths[a]; });
        };
        KwzParser.prototype.decodeFrame = function (frameIndex, diffingFlag, isPrevFrame) {
            if (diffingFlag === void 0) { diffingFlag = 0x7; }
            if (isPrevFrame === void 0) { isPrevFrame = false; }
            // if this frame is being decoded as a prev frame, then we only want to decode the layers necessary
            if (isPrevFrame)
                diffingFlag &= this.getDiffingFlag(frameIndex + 1);
            // the prevDecodedFrame check is an optimisation for decoding frames in full sequence
            if ((this.prevDecodedFrame !== frameIndex - 1) && (diffingFlag) && (frameIndex !== 0))
                this.decodeFrame(frameIndex - 1, diffingFlag = diffingFlag, isPrevFrame = true);
            var meta = this.frameMeta[frameIndex];
            var offset = this.frameOffsets[frameIndex];
            for (var layerIndex = 0; layerIndex < 3; layerIndex++) {
                this.seek(offset);
                var layerSize = meta.layerSize[layerIndex];
                offset += layerSize;
                // if the layer is 38 bytes then it hasn't changed at all since the previous frame, so we can skip it
                if (layerSize === 38)
                    continue;
                if (((diffingFlag >> layerIndex) & 0x1) === 0)
                    continue;
                this.bitIndex = 16;
                this.bitValue = 0;
                var skip = 0;
                for (var tileOffsetY = 0; tileOffsetY < KwzParser.height; tileOffsetY += 128) {
                    for (var tileOffsetX = 0; tileOffsetX < KwzParser.width; tileOffsetX += 128) {
                        for (var subTileOffsetY = 0; subTileOffsetY < 128; subTileOffsetY += 8) {
                            var y = tileOffsetY + subTileOffsetY;
                            if (y >= KwzParser.height)
                                break;
                            for (var subTileOffsetX = 0; subTileOffsetX < 128; subTileOffsetX += 8) {
                                var x = tileOffsetX + subTileOffsetX;
                                if (x >= KwzParser.width)
                                    break;
                                if (skip) {
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
                                    for (var line = 0; line < 8; line++) {
                                        if (mask & (1 << line)) {
                                            var lineIndex = this.readBits(5);
                                            var pixels = KWZ_LINE_TABLE_COMMON.subarray(lineIndex * 8, lineIndex * 8 + 8);
                                            pixelBuffer.set(pixels, pixelOffset + line * 320);
                                        }
                                        else {
                                            var lineIndex = this.readBits(13);
                                            var pixels = KWZ_LINE_TABLE.subarray(lineIndex * 8, lineIndex * 8 + 8);
                                            pixelBuffer.set(pixels, pixelOffset + line * 320);
                                        }
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
                                    if (useCommonLines) {
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
            this.prevDecodedFrame = frameIndex;
            // return this._layers;
            return [
                new Uint8Array(this.layers[0].buffer),
                new Uint8Array(this.layers[1].buffer),
                new Uint8Array(this.layers[2].buffer),
            ];
        };
        KwzParser.prototype.getFramePaletteIndices = function (frameIndex) {
            var flags = this.frameMeta[frameIndex].flags;
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
        KwzParser.prototype.getFramePalette = function (frameIndex) {
            var _this = this;
            var indices = this.getFramePaletteIndices(frameIndex);
            return indices.map(function (colorIndex) { return _this.globalPalette[colorIndex]; });
        };
        // retuns an uint8 array where each item is a pixel's palette index
        KwzParser.prototype.getLayerPixels = function (frameIndex, layerIndex) {
            if (this.prevDecodedFrame !== frameIndex)
                this.decodeFrame(frameIndex);
            var palette = this.getFramePaletteIndices(frameIndex);
            var layers = this.layers[layerIndex];
            var image = new Uint8Array((KwzParser.width * KwzParser.height));
            var paletteOffset = layerIndex * 2 + 1;
            for (var pixelIndex = 0; pixelIndex < layers.length; pixelIndex++) {
                var pixel = layers[pixelIndex];
                if (pixel & 0xff00)
                    image[pixelIndex] = palette[paletteOffset];
                else if (pixel & 0x00ff)
                    image[pixelIndex] = palette[paletteOffset + 1];
            }
            return image;
        };
        // retuns an uint8 array where each item is a pixel's palette index
        KwzParser.prototype.getFramePixels = function (frameIndex) {
            var _this = this;
            var palette = this.getFramePaletteIndices(frameIndex);
            var image = new Uint8Array((KwzParser.width * KwzParser.height));
            image.fill(palette[0]); // fill with paper color first
            var layerOrder = this.getLayerOrder(frameIndex);
            layerOrder.forEach(function (layerIndex) {
                var layer = _this.getLayerPixels(frameIndex, layerIndex);
                // merge layer into image result
                for (var pixelIndex = 0; pixelIndex < layer.length; pixelIndex++) {
                    var pixel = layer[pixelIndex];
                    if (pixel !== 0)
                        image[pixelIndex] = pixel;
                }
            });
            return image;
        };
        KwzParser.prototype.decodeSoundFlags = function () {
            return this.frameMeta.map(function (frame) {
                var soundFlags = frame.soundFlags;
                return [
                    (soundFlags & 0x1) !== 0,
                    (soundFlags & 0x2) !== 0,
                    (soundFlags & 0x4) !== 0,
                    (soundFlags & 0x8) !== 0,
                ];
            });
        };
        KwzParser.prototype.getAudioTrackRaw = function (trackId) {
            var trackMeta = this.soundMeta[trackId];
            return new Uint8Array(this.buffer, trackMeta.offset, trackMeta.length);
        };
        KwzParser.prototype.decodeAudioTrack = function (trackId) {
            var adpcm = this.getAudioTrackRaw(trackId);
            var output = new Int16Array(16364 * 60);
            var outputOffset = 0;
            // initial decoder state
            var prevDiff = 0;
            var prevStepIndex = 40;
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
        KwzParser.prototype.getAudioTrackPcm = function (trackId, dstFreq) {
            if (dstFreq === void 0) { dstFreq = CTR_SAMPLE_RATE; }
            var srcPcm = this.decodeAudioTrack(trackId);
            var srcFreq = this.sampleRate;
            if (trackId === FlipnoteAudioTrack.BGM) {
                var bgmAdjust = (1 / this.bgmrate) / (1 / this.framerate);
                srcFreq = this.sampleRate * bgmAdjust;
            }
            if (srcFreq !== dstFreq) {
                return pcmDsAudioResample(srcPcm, srcFreq, dstFreq);
            }
            return srcPcm;
        };
        KwzParser.prototype.getAudioMasterPcm = function (dstFreq) {
            if (dstFreq === void 0) { dstFreq = CTR_SAMPLE_RATE; }
            var duration = this.frameCount * (1 / this.framerate);
            var dstSize = Math.floor(duration * dstFreq);
            var master = new Int16Array(dstSize);
            var hasBgm = this.hasAudioTrack(FlipnoteAudioTrack.BGM);
            var hasSe1 = this.hasAudioTrack(FlipnoteAudioTrack.SE1);
            var hasSe2 = this.hasAudioTrack(FlipnoteAudioTrack.SE2);
            var hasSe3 = this.hasAudioTrack(FlipnoteAudioTrack.SE3);
            var hasSe4 = this.hasAudioTrack(FlipnoteAudioTrack.SE4);
            // Mix background music
            if (hasBgm) {
                var bgmPcm = this.getAudioTrackPcm(FlipnoteAudioTrack.BGM, dstFreq);
                pcmAudioMix(bgmPcm, master, 0);
            }
            // Mix sound effects
            if (hasSe1 || hasSe2 || hasSe3) {
                var samplesPerFrame = Math.floor(dstFreq / this.framerate);
                var seFlags = this.decodeSoundFlags();
                var se1Pcm = hasSe1 ? this.getAudioTrackPcm(FlipnoteAudioTrack.SE1, dstFreq) : null;
                var se2Pcm = hasSe2 ? this.getAudioTrackPcm(FlipnoteAudioTrack.SE2, dstFreq) : null;
                var se3Pcm = hasSe3 ? this.getAudioTrackPcm(FlipnoteAudioTrack.SE3, dstFreq) : null;
                var se4Pcm = hasSe4 ? this.getAudioTrackPcm(FlipnoteAudioTrack.SE4, dstFreq) : null;
                for (var i = 0; i < this.frameCount; i++) {
                    var seOffset = samplesPerFrame * i;
                    var flag = seFlags[i];
                    if (hasSe1 && flag[0])
                        pcmAudioMix(se1Pcm, master, seOffset);
                    if (hasSe2 && flag[1])
                        pcmAudioMix(se2Pcm, master, seOffset);
                    if (hasSe3 && flag[2])
                        pcmAudioMix(se3Pcm, master, seOffset);
                    if (hasSe4 && flag[3])
                        pcmAudioMix(se4Pcm, master, seOffset);
                }
            }
            return master;
        };
        KwzParser.type = 'KWZ';
        KwzParser.width = 320;
        KwzParser.height = 240;
        KwzParser.sampleRate = 16364;
        KwzParser.globalPalette = [
            PALETTE$1.WHITE,
            PALETTE$1.BLACK,
            PALETTE$1.RED,
            PALETTE$1.YELLOW,
            PALETTE$1.GREEN,
            PALETTE$1.BLUE,
            PALETTE$1.NONE,
        ];
        return KwzParser;
    }(FlipnoteParserBase));

    function parseSource(source) {
        return loadSource(source)
            .then(function (arrayBuffer) {
            return new Promise(function (resolve, reject) {
                // check the buffer's magic to identify which format it uses
                var magicBytes = new Uint8Array(arrayBuffer.slice(0, 4));
                var magic = (magicBytes[0] << 24) | (magicBytes[1] << 16) | (magicBytes[2] << 8) | magicBytes[3];
                // check if magic is PARA (ppm magic)
                if (magic === 0x50415241)
                    resolve(new PpmParser(arrayBuffer));
                // check if magic is KFH (kwz magic)
                else if ((magic & 0xFFFFFF00) === 0x4B464800)
                    resolve(new KwzParser(arrayBuffer));
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
    var EOF = -1;
    var BITS = 12;
    var HSIZE = 5003; // 80% occupancy
    var masks = [
        0x0000, 0x0001, 0x0003, 0x0007, 0x000F, 0x001F,
        0x003F, 0x007F, 0x00FF, 0x01FF, 0x03FF, 0x07FF,
        0x0FFF, 0x1FFF, 0x3FFF, 0x7FFF, 0xFFFF
    ];
    var LZWEncoder = /** @class */ (function () {
        function LZWEncoder(width, height, pixels, colorDepth) {
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
            this.pixels = pixels;
            this.colorDepth = colorDepth;
            this.initCodeSize = Math.max(2, this.colorDepth);
            this.accum = new Uint8Array(256);
            this.htab = new Int32Array(HSIZE);
            this.codetab = new Int32Array(HSIZE);
            this.cur_accum = 0;
            this.cur_bits = 0;
            this.a_count;
            this.remaining;
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
        }
        // Add a character to the end of the current packet, and if it is 254
        // characters, flush the packet to disk.
        LZWEncoder.prototype.char_out = function (c, outs) {
            this.accum[this.a_count++] = c;
            if (this.a_count >= 254)
                this.flush_char(outs);
        };
        // Clear out the hash table
        // table clear for block compress
        LZWEncoder.prototype.cl_block = function (outs) {
            this.cl_hash(HSIZE);
            this.free_ent = this.ClearCode + 2;
            this.clear_flg = true;
            this.output(this.ClearCode, outs);
        };
        // Reset code table
        LZWEncoder.prototype.cl_hash = function (hsize) {
            for (var i = 0; i < hsize; ++i)
                this.htab[i] = -1;
        };
        LZWEncoder.prototype.compress = function (init_bits, outs) {
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
                    if (i === 0)
                        disp = 1;
                    do {
                        if ((i -= disp) < 0)
                            i += hsize_reg;
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
        LZWEncoder.prototype.encode = function (outs) {
            outs.writeByte(this.initCodeSize); // write 'initial code size' byte
            this.remaining = this.width * this.height; // reset navigation variables
            this.curPixel = 0;
            this.compress(this.initCodeSize + 1, outs); // compress and write the pixel data
            outs.writeByte(0); // write block terminator
        };
        // Flush the packet to disk, and reset the this.accumulator
        LZWEncoder.prototype.flush_char = function (outs) {
            if (this.a_count > 0) {
                outs.writeByte(this.a_count);
                outs.writeBytes(this.accum, 0, this.a_count);
                this.a_count = 0;
            }
        };
        LZWEncoder.prototype.get_maxcode = function (n_bits) {
            return (1 << n_bits) - 1;
        };
        // Return the next pixel from the image
        LZWEncoder.prototype.nextPixel = function () {
            if (this.remaining === 0)
                return EOF;
            --this.remaining;
            var pix = this.pixels[this.curPixel++];
            return pix & 0xff;
        };
        LZWEncoder.prototype.output = function (code, outs) {
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
        return LZWEncoder;
    }());

    var GifEncoder = /** @class */ (function () {
        function GifEncoder(width, height) {
            this.delay = 100;
            // -1 = no repeat, 0 = forever. anything else is repeat count
            this.repeat = -1;
            this.colorDepth = 8;
            this.palette = [];
            this.width = width;
            this.height = height;
            this.data = new ByteArray();
        }
        GifEncoder.fromFlipnote = function (flipnote) {
            var gif = new GifEncoder(flipnote.width, flipnote.height);
            gif.palette = flipnote.globalPalette;
            gif.delay = 100 / flipnote.framerate;
            gif.repeat = flipnote.meta.loop ? -1 : 0;
            gif.init();
            for (var frameIndex = 0; frameIndex < flipnote.frameCount; frameIndex++) {
                gif.writeFrame(flipnote.getFramePixels(frameIndex));
            }
            return gif;
        };
        GifEncoder.fromFlipnoteFrame = function (flipnote, frameIndex) {
            var gif = new GifEncoder(flipnote.width, flipnote.height);
            gif.palette = flipnote.globalPalette;
            // TODO: look at ideal delay and repeat settings for single frame GIF
            gif.delay = 100 / flipnote.framerate;
            gif.repeat = flipnote.meta.loop ? -1 : 0;
            gif.init();
            gif.writeFrame(flipnote.getFramePixels(frameIndex));
            return gif;
        };
        GifEncoder.prototype.init = function () {
            var paletteSize = this.palette.length;
            for (var p = 1; 1 << p < paletteSize; p += 1)
                continue;
            this.colorDepth = p;
            this.writeHeader();
            this.writeColorTable();
            this.writeNetscapeExt();
        };
        GifEncoder.prototype.writeHeader = function () {
            var header = new DataStream(new ArrayBuffer(13));
            header.writeChars('GIF89a');
            // Logical Screen Descriptor
            header.writeUint16(this.width);
            header.writeUint16(this.height);
            header.writeUint8(0x80 | // 1 : global color table flag = 1 (gct used)
                (this.colorDepth - 1) // 6-8 : gct size
            );
            header.writeUint8(0);
            header.writeUint8(0);
            this.data.writeBytes(new Uint8Array(header.buffer));
        };
        GifEncoder.prototype.writeColorTable = function () {
            var palette = new Uint8Array(3 * Math.pow(2, this.colorDepth));
            for (var index = 0, offset = 0; index < this.palette.length; index += 1, offset += 3) {
                palette.set(this.palette[index], offset);
            }
            this.data.writeBytes(palette);
        };
        GifEncoder.prototype.writeGraphicsControlExt = function () {
            var graphicsControlExt = new DataStream(new ArrayBuffer(8));
            graphicsControlExt.writeBytes([
                0x21,
                0xF9,
                4,
                0 // bitfield
            ]);
            graphicsControlExt.writeUint16(this.delay); // loop flag
            graphicsControlExt.writeBytes([
                0,
                0
            ]);
            this.data.writeBytes(new Uint8Array(graphicsControlExt.buffer));
        };
        GifEncoder.prototype.writeNetscapeExt = function () {
            var netscapeExt = new DataStream(new ArrayBuffer(19));
            netscapeExt.writeBytes([
                0x21,
                0xFF,
                11,
            ]);
            netscapeExt.writeChars('NETSCAPE2.0');
            netscapeExt.writeUint8(3); // subblock size
            netscapeExt.writeUint8(1); // loop subblock id
            netscapeExt.writeUint16(this.repeat); // loop flag
            this.data.writeBytes(new Uint8Array(netscapeExt.buffer));
        };
        GifEncoder.prototype.writeImageDesc = function () {
            var desc = new DataStream(new ArrayBuffer(10));
            desc.writeUint8(0x2C);
            desc.writeUint16(0); // image left
            desc.writeUint16(0); // image top
            desc.writeUint16(this.width);
            desc.writeUint16(this.height);
            desc.writeUint8(0);
            this.data.writeBytes(new Uint8Array(desc.buffer));
        };
        GifEncoder.prototype.writePixels = function (pixels) {
            var lzw = new LZWEncoder(this.width, this.height, pixels, this.colorDepth);
            lzw.encode(this.data);
        };
        GifEncoder.prototype.writeFrame = function (pixels) {
            this.writeGraphicsControlExt();
            this.writeImageDesc();
            this.writePixels(pixels);
        };
        GifEncoder.prototype.getBuffer = function () {
            return this.data.getBuffer();
        };
        GifEncoder.prototype.getBlob = function () {
            return new Blob([this.getBuffer()], { type: 'image/gif' });
        };
        GifEncoder.prototype.getUrl = function () {
            return window.URL.createObjectURL(this.getBlob());
        };
        GifEncoder.prototype.getImage = function () {
            var img = new Image(this.width, this.height);
            img.src = this.getUrl();
            return img;
        };
        return GifEncoder;
    }());

    // Typical WAV sample rate
    var WAV_SAMPLE_RATE = 44100;
    var WavEncoder = /** @class */ (function () {
        function WavEncoder(sampleRate, channels, bitsPerSample) {
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
        WavEncoder.fromFlipnote = function (note) {
            var wav = new WavEncoder(WAV_SAMPLE_RATE, 1, 16);
            var pcm = note.getAudioMasterPcm(WAV_SAMPLE_RATE);
            wav.writeFrames(pcm);
            return wav;
        };
        WavEncoder.fromFlipnoteTrack = function (note, trackId) {
            var wav = new WavEncoder(WAV_SAMPLE_RATE, 1, 16);
            var pcm = note.getAudioTrackPcm(trackId, WAV_SAMPLE_RATE);
            wav.writeFrames(pcm);
            return wav;
        };
        WavEncoder.prototype.writeFrames = function (pcmData) {
            var header = this.header;
            // fill in filesize
            header.seek(4);
            header.writeUint32(header.byteLength + pcmData.byteLength);
            // fill in data section length
            header.seek(40);
            header.writeUint32(pcmData.byteLength);
            this.pcmData = pcmData;
        };
        WavEncoder.prototype.getBlob = function () {
            return new Blob([this.header.buffer, this.pcmData.buffer], { type: 'audio/wav' });
        };
        return WavEncoder;
    }());

    var vertexShader = "#define GLSLIFY 1\nattribute vec4 a_position;varying vec2 v_texel;varying float v_scale;uniform vec2 u_textureSize;uniform vec2 u_screenSize;void main(){gl_Position=a_position;vec2 uv=a_position.xy*vec2(0.5,-0.5)+0.5;v_texel=uv*u_textureSize;v_scale=floor(u_screenSize.y/u_textureSize.y+0.01);}"; // eslint-disable-line

    var fragmentShader = "precision highp float;\n#define GLSLIFY 1\nvarying vec2 v_texel;varying float v_scale;uniform vec4 u_color1;uniform vec4 u_color2;uniform sampler2D u_bitmap;uniform bool u_isSmooth;uniform vec2 u_textureSize;uniform vec2 u_screenSize;void main(){vec2 texel_floored=floor(v_texel);vec2 s=fract(v_texel);float region_range=0.5-0.5/v_scale;vec2 center_dist=s-0.5;vec2 f=(center_dist-clamp(center_dist,-region_range,region_range))*v_scale+0.5;vec2 mod_texel=texel_floored+f;vec2 coord=mod_texel.xy/u_textureSize.xy;vec2 colorWeights=texture2D(u_bitmap,coord).ra;gl_FragColor=vec4(u_color1.rgb,1.0)*colorWeights.y+vec4(u_color2.rgb,1.0)*colorWeights.x;}"; // eslint-disable-line

    var TextureType;
    (function (TextureType) {
        TextureType[TextureType["Alpha"] = WebGLRenderingContext.ALPHA] = "Alpha";
        TextureType[TextureType["LuminanceAlpha"] = WebGLRenderingContext.LUMINANCE_ALPHA] = "LuminanceAlpha";
    })(TextureType || (TextureType = {}));
    /** webgl canvas wrapper class */
    var WebglCanvas = /** @class */ (function () {
        function WebglCanvas(el, width, height, params) {
            if (width === void 0) { width = 640; }
            if (height === void 0) { height = 480; }
            if (params === void 0) { params = { antialias: false, alpha: false }; }
            this.uniforms = {};
            this.refs = {
                shaders: [],
                textures: [],
                buffers: []
            };
            var gl = el.getContext('webgl', params);
            this.el = el;
            this.gl = gl;
            this.createProgram();
            this.setCanvasSize(width, height);
            this.createScreenQuad();
            this.createBitmapTexture();
            gl.enable(gl.BLEND);
            gl.blendEquation(gl.FUNC_ADD);
            gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
        }
        WebglCanvas.prototype.createProgram = function () {
            var gl = this.gl;
            var program = gl.createProgram();
            // set up shaders
            gl.attachShader(program, this.createShader(gl.VERTEX_SHADER, vertexShader));
            gl.attachShader(program, this.createShader(gl.FRAGMENT_SHADER, fragmentShader));
            // link program
            gl.linkProgram(program);
            if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
                var log = gl.getProgramInfoLog(program);
                gl.deleteProgram(program);
                throw new Error(log);
            }
            // activate the program
            gl.useProgram(program);
            // map uniform locations
            var uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
            for (var index = 0; index < uniformCount; index++) {
                var name_1 = gl.getActiveUniform(program, index).name;
                this.uniforms[name_1] = gl.getUniformLocation(program, name_1);
            }
            this.program = program;
        };
        WebglCanvas.prototype.createScreenQuad = function () {
            var gl = this.gl;
            // create quad that fills the screen, this will be our drawing surface
            var vertBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, vertBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([1, 1, -1, 1, -1, -1, 1, 1, -1, -1, 1, -1]), gl.STATIC_DRAW);
            gl.enableVertexAttribArray(0);
            gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
            this.refs.buffers.push(vertBuffer);
        };
        WebglCanvas.prototype.createBitmapTexture = function () {
            var gl = this.gl;
            // create texture to use as the layer bitmap
            gl.activeTexture(gl.TEXTURE0);
            var tex = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, tex);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.uniform1i(this.uniforms['u_bitmap'], 0);
            this.refs.textures.push(tex);
        };
        WebglCanvas.prototype.createShader = function (type, source) {
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
        WebglCanvas.prototype.setInputSize = function (width, height) {
            this.gl.uniform2f(this.uniforms['u_textureSize'], width, height);
        };
        WebglCanvas.prototype.setCanvasSize = function (width, height) {
            var dpi = window.devicePixelRatio || 1;
            var internalWidth = width * dpi;
            var internalHeight = height * dpi;
            this.el.width = internalWidth;
            this.el.height = internalHeight;
            this.width = internalWidth;
            this.height = internalHeight;
            this.gl.viewport(0, 0, internalWidth, internalHeight);
            this.gl.uniform2f(this.uniforms['u_screenSize'], internalWidth, internalHeight);
            this.el.style.width = width + "px";
            this.el.style.height = height + "px";
        };
        WebglCanvas.prototype.setLayerType = function (textureType) {
            this.textureType = textureType;
        };
        WebglCanvas.prototype.toImage = function (type) {
            return this.el.toDataURL(type);
        };
        WebglCanvas.prototype.setColor = function (color, value) {
            this.gl.uniform4f(this.uniforms[color], value[0] / 255, value[1] / 255, value[2] / 255, 1);
        };
        WebglCanvas.prototype.setPaperColor = function (value) {
            this.gl.clearColor(value[0] / 255, value[1] / 255, value[2] / 255, 1);
        };
        WebglCanvas.prototype.drawLayer = function (buffer, width, height, color1, color2) {
            var gl = this.gl;
            // gl.activeTexture(gl.TEXTURE0);
            gl.texImage2D(gl.TEXTURE_2D, 0, this.textureType, width, height, 0, this.textureType, gl.UNSIGNED_BYTE, buffer);
            this.setColor('u_color1', color1);
            this.setColor('u_color2', color2);
            gl.drawArrays(gl.TRIANGLES, 0, 6);
        };
        WebglCanvas.prototype.resize = function (width, height) {
            if (width === void 0) { width = 640; }
            if (height === void 0) { height = 480; }
            this.setCanvasSize(width, height);
        };
        WebglCanvas.prototype.clear = function () {
            this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        };
        WebglCanvas.prototype.destroy = function () {
            // free resources
            var refs = this.refs;
            var gl = this.gl;
            refs.shaders.forEach(function (shader) {
                gl.deleteShader(shader);
            });
            refs.shaders = [];
            refs.textures.forEach(function (texture) {
                gl.deleteTexture(texture);
            });
            refs.textures = [];
            refs.buffers.forEach(function (buffer) {
                gl.deleteBuffer(buffer);
            });
            refs.buffers = [];
            gl.deleteProgram(this.program);
            // shrink the canvas to reduce memory usage until it is garbage collected
            gl.canvas.width = 1;
            gl.canvas.height = 1;
        };
        return WebglCanvas;
    }());

    var _AudioContext = (window.AudioContext || window.webkitAudioContext);
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
            if (sampleData instanceof Float32Array) {
                channelData.set(sampleData, 0);
            }
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
                if (index === 0)
                    node.type = 'lowshelf';
                else if (index === eqSettings.length - 1)
                    node.type = 'highshelf';
                else
                    node.type = 'peaking';
                node.frequency.value = frequency;
                node.gain.value = gain;
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
            else {
                source.connect(gainNode);
            }
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

    var saveData = (function () {
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
    }());
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
            this.canvas = new WebglCanvas(el, width, height);
            this.audio = new WebAudioPlayer();
            this.el = this.canvas.el;
            this.customPalette = null;
            this.state = __assign({}, Player.defaultState);
        }
        Player.prototype.saveWav = function () {
            var wav = WavEncoder.fromFlipnote(this.note);
            saveData(wav.getBlob(), 'audio.wav');
        };
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
            this.canvas.clear();
        };
        Player.prototype.load = function (note) {
            this.note = note;
            this.meta = note.meta;
            this.type = note.type;
            this.loop = note.meta.loop;
            this.duration = (this.note.frameCount) * (1 / this.note.framerate);
            this.paused = true;
            this.isOpen = true;
            this.hasPlaybackStarted = false;
            this.layerVisibility = {
                1: true,
                2: true,
                3: true
            };
            var sampleRate = this.audio.ctx.sampleRate;
            var pcm = note.getAudioMasterPcm(sampleRate);
            this.audio.setSamples(pcm, sampleRate);
            this.canvas.setInputSize(note.width, note.height);
            this.canvas.setLayerType(this.type === 'PPM' ? TextureType.Alpha : TextureType.LuminanceAlpha);
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
        Player.prototype.toggleEq = function () {
            this.stopAudio();
            this.audio.useEq = !this.audio.useEq;
            this.playAudio();
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
        Player.prototype.pause = function () {
            if ((!this.isOpen) || (this.paused))
                return null;
            this.paused = true;
            this.stopAudio();
            this.emit('playback:stop');
        };
        Player.prototype.togglePlay = function () {
            if (this.paused) {
                this.play();
            }
            else {
                this.pause();
            }
        };
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
        Player.prototype.nextFrame = function () {
            if ((this.loop) && (this.currentFrame >= this.frameCount - 1)) {
                this.currentFrame = 0;
            }
            else {
                this.currentFrame += 1;
            }
        };
        Player.prototype.prevFrame = function () {
            if ((this.loop) && (this.currentFrame <= 0)) {
                this.currentFrame = this.frameCount - 1;
            }
            else {
                this.currentFrame -= 1;
            }
        };
        Player.prototype.lastFrame = function () {
            this.currentFrame = this.frameCount - 1;
        };
        Player.prototype.firstFrame = function () {
            this.currentFrame = 0;
        };
        Player.prototype.thumbnailFrame = function () {
            this.currentFrame = this.note.thumbFrameIndex;
        };
        Player.prototype.startSeek = function () {
            if (!this.isSeeking) {
                this.wasPlaying = !this.paused;
                this.pause();
                this.isSeeking = true;
            }
        };
        Player.prototype.seek = function (progress) {
            if (this.isSeeking) {
                this.progress = progress;
            }
        };
        Player.prototype.endSeek = function () {
            if ((this.isSeeking) && (this.wasPlaying === true)) {
                this.play();
            }
            this.wasPlaying = false;
            this.isSeeking = false;
        };
        Player.prototype.drawFrame = function (frameIndex) {
            var _this = this;
            var width = this.note.width;
            var height = this.note.height;
            var colors = this.note.getFramePalette(frameIndex);
            var layerBuffers = this.note.decodeFrame(frameIndex);
            this.canvas.setPaperColor(colors[0]);
            this.canvas.clear();
            if (this.note.type === 'PPM') {
                if (this.layerVisibility[2]) {
                    this.canvas.drawLayer(layerBuffers[1], width, height, colors[2], [0, 0, 0, 0]);
                }
                if (this.layerVisibility[1]) {
                    this.canvas.drawLayer(layerBuffers[0], width, height, colors[1], [0, 0, 0, 0]);
                }
            }
            else if (this.note.type === 'KWZ') {
                // loop through each layer
                this.note.getLayerOrder(frameIndex).forEach(function (layerIndex) {
                    // only draw layer if it's visible
                    if (_this.layerVisibility[layerIndex + 1]) {
                        _this.canvas.drawLayer(layerBuffers[layerIndex], width, height, colors[layerIndex * 2 + 1], colors[layerIndex * 2 + 2]);
                    }
                });
            }
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
        Player.prototype.on = function (eventType, callback) {
            var events = this.events;
            (events[eventType] || (events[eventType] = [])).push(callback);
        };
        Player.prototype.off = function (eventType, callback) {
            var callbackList = this.events[eventType];
            if (callbackList)
                callbackList.splice(callbackList.indexOf(callback), 1);
        };
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
        Player.prototype.clearEvents = function () {
            this.events = {};
        };
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
    var api;
    (function (api) {
        api.version = "4.1.0"; // replaced by @rollup/plugin-replace; see rollup.config.js
        api.player = Player;
        api.parseSource = parseSource;
        api.kwzParser = KwzParser;
        api.ppmParser = PpmParser;
        api.gifEncoder = GifEncoder;
        api.wavEncoder = WavEncoder;
    })(api || (api = {}));
    var version = "4.1.0";
    var player = Player;
    var parseSource$1 = parseSource;
    var kwzParser = KwzParser;
    var ppmParser = PpmParser;
    var gifEncoder = GifEncoder;
    var wavEncoder = WavEncoder;

    // Entrypoint for webcomponent build
    // https://svelte.dev/docs#Custom_element_API
    // Had to do a hacky type coercion fix to get this to compile without complaints :/
    customElements.define('flipnote-player', Player$1);
    var playerComponent = Player$1; // adds window.flipnote.playerComponent

    exports.gifEncoder = gifEncoder;
    exports.kwzParser = kwzParser;
    exports.parseSource = parseSource$1;
    exports.player = player;
    exports.playerComponent = playerComponent;
    exports.ppmParser = ppmParser;
    exports.version = version;
    exports.wavEncoder = wavEncoder;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=flipnote.webcomponent.js.map
