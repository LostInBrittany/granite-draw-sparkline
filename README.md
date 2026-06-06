# granite-draw-sparkline

> A web component to hand draw a sparkline on a canvas and get its coordinates
>
> Zero-dependency vanilla custom element

## Doc & demo

- Demo: [https://lostinbrittany.github.io/granite-draw-sparkline](https://lostinbrittany.github.io/granite-draw-sparkline)
- Source: [https://github.com/LostInBrittany/granite-draw-sparkline](https://github.com/LostInBrittany/granite-draw-sparkline)

## Usage example

```html
<granite-draw-sparkline></granite-draw-sparkline>
```

Drawing works with mouse, touch and pen (Pointer Events). A sparkline is a
timeline, so the drawing only advances along the x axis. Each new stroke clears
the canvas and starts a new path.

The path coordinates can be read at any moment via the `path` property, or from
the `changed` event fired when a stroke is completed.

## Install

Install the component using [npm](https://www.npmjs.com/):

```sh
npm install @granite-elements/granite-draw-sparkline
```

## Usage

1. Import the custom element:

    ```html
    <script type="module" src="node_modules/@granite-elements/granite-draw-sparkline/granite-draw-sparkline.js"></script>
    ```

    Or from JavaScript:

    ```js
    import '@granite-elements/granite-draw-sparkline/granite-draw-sparkline.js';
    ```

2. Start using it!

    ```html
    <granite-draw-sparkline line-width="2" stroke-style="#1976d2"></granite-draw-sparkline>
    ```

    The component fills its container, so give it a size:

    ```css
    granite-draw-sparkline {
      width: 300px;
      height: 300px;
    }
    ```

## API

### Attributes / properties

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `stroke-style` | `strokeStyle` | `String` | `#000` | Stroke color, any canvas `strokeStyle` value |
| `line-width` | `lineWidth` | `Number` | `1` | Stroke width in pixels |
| — | `path` | `Array<{x, y}>` | `[]` | The coordinates of the path drawn (read-only) |

### Methods

| Method | Description |
|---|---|
| `clear()` | Resets the path and empties the canvas |

### Events

| Event | Detail | Description |
|---|---|---|
| `changed` | `Array<{x, y}>` | Fired when a stroke is completed, with the path coordinates |

## Migrating from 1.x (Polymer)

Version 2.0 is a rewrite as a dependency-free vanilla custom element.

- Install from npm instead of Bower, and load with `<script type="module">`
  instead of an HTML import — no polyfills needed
- The `reset` boolean property is replaced by the `clear()` method
- Touch and pen input work out of the box via Pointer Events

## Running the demo locally

```sh
npm install
npm run start
```

This launches [@web/dev-server](https://modern-web.dev/docs/dev-server/overview/) and opens the demo in your browser.

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## License

[MIT License](http://opensource.org/licenses/MIT)
