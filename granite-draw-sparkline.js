/*
@license MIT
Copyright (c) 2016 Horacio "LostInBrittany" Gonzalez

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/**
 * `granite-draw-sparkline` is a web component to hand draw a sparkline
 * on a canvas and get its coordinates.
 *
 * ```html
 * <granite-draw-sparkline></granite-draw-sparkline>
 * ```
 *
 * A sparkline is a timeline, so the drawing only advances along the x axis:
 * points whose x coordinate doesn't increase are ignored.
 *
 * Drawing works with mouse, touch and pen (Pointer Events). Each new stroke
 * clears the canvas and starts a new path. When the stroke ends, a `changed`
 * event is fired with the path coordinates as detail.
 *
 * The path can also be read at any moment via the `path` property,
 * an array of `{x, y}` points in CSS pixels relative to the component.
 *
 * @element granite-draw-sparkline
 * @attr {String} stroke-style - The stroke color, any canvas `strokeStyle` value. Defaults to `#000`.
 * @attr {Number} line-width - The stroke width in pixels. Defaults to `1`.
 * @fires changed - Fired when a stroke is completed. `detail` is the path, an array of `{x, y}` points.
 */
export class GraniteDrawSparkline extends HTMLElement {

  static get observedAttributes() {
    return ['stroke-style', 'line-width'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          position: relative;
          width: 100%;
          height: 100%;
        }
        canvas {
          display: block;
          width: 100%;
          height: 100%;
          cursor: crosshair;
          touch-action: none;
        }
      </style>
      <canvas></canvas>
    `;
    this._canvas = this.shadowRoot.querySelector('canvas');
    this._context = this._canvas.getContext('2d');
    this._path = [];
    this._isDrawing = false;
    this._resizeObserver = new ResizeObserver(() => this._resize());

    this._canvas.addEventListener('pointerdown', (evt) => this._onPointerDown(evt));
    this._canvas.addEventListener('pointermove', (evt) => this._onPointerMove(evt));
    this._canvas.addEventListener('pointerup', (evt) => this._onPointerUp(evt));
    this._canvas.addEventListener('pointercancel', (evt) => this._onPointerUp(evt));
  }

  connectedCallback() {
    this._resizeObserver.observe(this);
    this._resize();
  }

  disconnectedCallback() {
    this._resizeObserver.disconnect();
  }

  attributeChangedCallback() {
    // Re-render the current path with the new stroke style or width
    this._redraw();
  }

  /**
   * The coordinates of the path drawn, an array of `{x, y}` points.
   * @type {Array<{x: Number, y: Number}>}
   */
  get path() {
    return this._path;
  }

  /**
   * The stroke color. Reflected to the `stroke-style` attribute.
   * @type {String}
   */
  get strokeStyle() {
    return this.getAttribute('stroke-style') || '#000';
  }
  set strokeStyle(value) {
    this.setAttribute('stroke-style', value);
  }

  /**
   * The stroke width. Reflected to the `line-width` attribute.
   * @type {Number}
   */
  get lineWidth() {
    return Number(this.getAttribute('line-width')) || 1;
  }
  set lineWidth(value) {
    this.setAttribute('line-width', value);
  }

  /**
   * Resets the path and empties the canvas.
   */
  clear() {
    this._path = [];
    this._redraw();
  }

  // ***********************************************************************
  // Event listeners
  // ***********************************************************************

  _onPointerDown(evt) {
    evt.preventDefault();
    // Keep receiving pointer events even when the pointer leaves the canvas
    this._canvas.setPointerCapture(evt.pointerId);
    this.clear();
    this._isDrawing = true;
    this._path.push(this._positionFromEvent(evt));
  }

  _onPointerMove(evt) {
    if (!this._isDrawing) {
      return;
    }
    evt.preventDefault();
    const position = this._positionFromEvent(evt);
    const last = this._path[this._path.length - 1];
    // A sparkline is a timeline: it must always advance along the x axis
    if (position.x <= last.x) {
      return;
    }
    this._context.beginPath();
    this._context.moveTo(last.x, last.y);
    this._context.lineTo(position.x, position.y);
    this._context.strokeStyle = this.strokeStyle;
    this._context.lineWidth = this.lineWidth;
    this._context.stroke();
    this._path.push(position);
  }

  _onPointerUp(evt) {
    if (!this._isDrawing) {
      return;
    }
    evt.preventDefault();
    this._isDrawing = false;
    this.dispatchEvent(new CustomEvent('changed', {
      detail: this._path,
      bubbles: true,
      composed: true,
    }));
  }

  // ***********************************************************************
  // Internal helpers
  // ***********************************************************************

  _positionFromEvent(evt) {
    const rect = this._canvas.getBoundingClientRect();
    return {
      x: Math.min(Math.max(evt.clientX - rect.left, 0), rect.width),
      y: Math.min(Math.max(evt.clientY - rect.top, 0), rect.height),
    };
  }

  _resize() {
    // Size the bitmap to the CSS box, scaled for crisp lines on hi-DPI screens
    const dpr = window.devicePixelRatio || 1;
    const rect = this._canvas.getBoundingClientRect();
    this._canvas.width = Math.round(rect.width * dpr);
    this._canvas.height = Math.round(rect.height * dpr);
    this._context.setTransform(dpr, 0, 0, dpr, 0, 0);
    this._redraw();
  }

  _redraw() {
    const rect = this._canvas.getBoundingClientRect();
    this._context.clearRect(0, 0, rect.width, rect.height);
    if (this._path.length < 2) {
      return;
    }
    this._context.beginPath();
    this._context.moveTo(this._path[0].x, this._path[0].y);
    for (const point of this._path.slice(1)) {
      this._context.lineTo(point.x, point.y);
    }
    this._context.strokeStyle = this.strokeStyle;
    this._context.lineWidth = this.lineWidth;
    this._context.stroke();
  }
}

if (!customElements.get('granite-draw-sparkline')) {
  customElements.define('granite-draw-sparkline', GraniteDrawSparkline);
}
