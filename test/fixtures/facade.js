/**
 * Creates a new Facade.js object with either a preexisting canvas tag or a unique name, width, and height.
 *
 * @example var stage = new Facade(document.querySelector('canvas'));
 * @example var stage = new Facade('stage', 500, 300);
 * @property {Object} canvas Reference to the canvas element.
 * @property {Object} context Reference to the <a href="https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D" target="_blank">CanvasRenderingContext2D</a> object.
 * @property {Integer} dt Current time in milliseconds since last canvas draw.
 * @property {Integer} fps Current frames per second.
 * @property {Integer} ftime Time of last canvas draw.
 * @param {Object|String} [canvas] Reference to an HTML canvas element or a unique name.
 * @param {Integer} [width] Width of the canvas.
 * @param {Integer} [height] Height of the canvas.
 * @return {Object} New Facade.js object.
 * @public
 */

function Facade(canvas, width, height) {

    if (!(this instanceof Facade)) {

        return new Facade(canvas, width, height);

    }

    this.dt = null;
    this.fps = null;
    this.ftime = null;

    this._callback = null;

    this._requestAnimation = null;

    this._width = null;
    this._height = null;

    if (canvas && typeof canvas === 'object' && canvas.nodeType === 1) {

        this.canvas = canvas;

    } else {

        this.canvas = document.createElement('canvas');

        if (typeof canvas === 'string') {

            this.canvas.setAttribute('id', canvas);

        }

    }

    if (width) {

        this.width(width);

    } else if (this.canvas.hasAttribute('width')) {

        this._width = parseInt(this.canvas.getAttribute('width'), 10);

    } else {

        this.width(this.canvas.clientWidth);

    }

    if (height) {

        this.height(height);

    } else if (this.canvas.hasAttribute('height')) {

        this._height = parseInt(this.canvas.getAttribute('height'), 10);

    } else {

        this.height(this.canvas.clientHeight);

    }

    try {

        this.context = this.canvas.getContext('2d');

    } catch (e) {

        console.error('Object passed to Facade.js was not a valid canvas element.');

    }

}

/**
 * Draws a Facade.js entity (or multiple entities) to the stage.
 *
 * @example stage.addToStage(circle);
 * @example stage.addToStage(circle, { x: 100, y: 100 });
 * @param {Object|Array} obj Facade.js entity or an array of entities.
 * @param {Object} [options] Temporary options for rendering a Facade.js entity (or multiple entities).
 * @return {Object} Facade.js object.
 * @public
 */

Facade.prototype.addToStage = function (obj, options) {

    var i,
        length;

    if (obj instanceof Facade.Entity) {

        obj.draw(this, options);

    } else if (Array.isArray(obj)) {

        for (i = 0, length = obj.length; i < length; i += 1) {

            this.addToStage(obj[i], options);

        }

    } else {

        console.error('Object passed to Facade.addToStage is not a valid Facade.js entity.');

    }

    return this;

};

/**
 * Create a polygon object. Inherits all methods from <b>Facade.Entity</b>.
 *
 * ```
 * var polygon = new Facade.Polygon({
 *     x: 0,
 *     y: 0,
 *     points: [ [100, 0], [200, 100], [100, 200], [0, 100] ],
 *     lineWidth: 10,
 *     strokeStyle: '#333E4B',
 *     fillStyle: '#1C73A8',
 *     anchor: 'top/left'
 * });
 * ```
 *
 * @param {Object} [options] Options to create the polygon with.
 * @param {String} [options.anchor] Position to anchor the polygon. <i>Default:</i> "top/left"<br><ul><li>top/left</li><li>top/center</li><li>top/right</li><li>center/left</li><li>center</li><li>center/right</li><li>bottom/left</li><li>bottom/center</li><li>bottom/right</li></ul>
 * @param {Boolean} [options.closePath] Boolean to determine if the polygon should be self closing or not. <i>Default:</i> true
 * @param {String} [options.fillStyle] Fill color for the polygon. Can be a text representation of a color, HEX, RGB(a), HSL(a). <i>Default:</i> "#000"<br><ul><li>HTML Colors: red, green, blue, etc.</li><li>HEX: #f00, #ff0000</li><li>RGB(a): rgb(255, 0, 0), rgba(0, 255, 0, 0.5)</li><li>HSL(a): hsl(100, 100%, 50%), hsla(100, 100%, 50%, 0.5)</li></ul>
 * @param {String} [options.lineCap] The style of line cap. <i>Default:</i> "butt"<br><ul><li>butt</li><li>round</li><li>square</li></ul>
 * @param {String} [options.lineJoin] The style of line join. <i>Default:</i> "miter"<br><ul><li>miter</li><li>round</li><li>bevel</li></ul>
 * @param {Integer} [options.lineWidth] Width of the stroke. <i>Default:</i> 0
 * @param {Integer} [options.opacity] Opacity of the polygon. Integer between 0 and 100. <i>Default:</i> 100
 * @param {Array} [options.points] Multi-dimensional array of points used to render a polygon. Point arrays with 2 values is rendered as a line, 5 values is rendered as an arc and 6 values is rendered as a bezier curve.
 * @param {Integer} [options.rotate] Degrees to rotate the polygon. <i>Default:</i> 0
 * @param {Integer} [options.scale] A float representing the scale of a polygon. <i>Default:</i> 1
 * @param {String} [options.strokeStyle] Color of a polygon's stroke. Can be a text representation of a color, HEX, RGB(a), HSL(a). <i>Default:</i> "#000"<br><ul><li>HTML Colors: red, green, blue, etc.</li><li>HEX: #f00, #ff0000</li><li>RGB(a): rgb(255, 0, 0), rgba(0, 255, 0, 0.5)</li><li>HSL(a): hsl(100, 100%, 50%), hsla(100, 100%, 50%, 0.5)</li></ul>
 * @param {Integer} [options.x] X coordinate to position the polygon. <i>Default:</i> 0
 * @param {Integer} [options.y] Y coordinate to position the polygon. <i>Default:</i> 0
 * @return {Object} New Facade.Polygon object.
 * @public
 */

Facade.Polygon = function (options) {

    if (!(this instanceof Facade.Polygon)) {

        return new Facade.Polygon(options);

    }

    this._options = this._defaultOptions();
    this._metrics = this._defaultMetrics();

    this.setOptions(options);

};

/*!
 * Extend from Facade.Entity
 */

Facade.Polygon.prototype = Object.create(Facade.Entity.prototype);
Facade.Polygon.constructor = Facade.Entity;

/**
 * Returns a default set of options common to all Facade.js polygon entities.
 *
 * @example console.log(Facade.Polygon.prototype._defaultOptions());
 * @param {Object} updated Additional options as key-value pairs.
 * @return {Object} Default set of options.
 * @private
 */

Facade.Polygon.prototype._defaultOptions = function (updated) {

    var options,
        keys,
        i,
        length;

    options = Facade.Entity.prototype._defaultOptions({
        opacity: 100,
        points: [],
        fillStyle: '#000',
        strokeStyle: '',
        lineWidth: 0,
        lineCap: 'butt',
        lineJoin: 'miter',
        closePath: true
    });

    if (updated) {

        keys = Object.keys(updated);

        for (i = 0, length = keys.length; i < length; i += 1) {

            options[keys[i]] = updated[keys[i]];

        }

    }

    return options;

};

/**
 * Renders a polygon entity to a canvas.
 *
 * @example polygon._draw(facade, options, metrics);
 * @param {Object} facade Facade.js object.
 * @param {Object} options Options used to render the polygon.
 * @param {Object} metrics Metrics used to render the polygon.
 * @return {Void}
 * @private
 */

Facade.Polygon.prototype._draw = function (facade, options, metrics) {

    var context = facade.context,
        i,
        length;

    this._applyTransforms(context, options, metrics);

    if (options.points.length) {

        context.beginPath();

        for (i = 0, length = options.points.length; i < length; i += 1) {

            if (options.points[i].length === 6) {

                context.bezierCurveTo.apply(context, options.points[i]);

            } else if (options.points[i].length === 5) {

                context.arc.apply(context, options.points[i]);

            } else if (options.points[i].length === 2) {

                context.lineTo.apply(context, options.points[i]);

            }

        }

        if (options.closePath) {

            context.closePath();

        } else {

            context.moveTo.apply(context, options.points[length - 1]);

        }

        if (options.fillStyle) {

            context.fill();

        }

        if (options.lineWidth > 0) {

            context.stroke();

        }

    }

};
