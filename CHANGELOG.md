# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-06-06

Complete rewrite as a zero-dependency vanilla custom element.

### Changed

- **Breaking:** rewritten as a plain ES module custom element, replacing
  Polymer 1.x and HTML imports — no polyfills or dependencies needed
- **Breaking:** distributed on npm as `@granite-elements/granite-draw-sparkline`
  instead of Bower
- **Breaking:** the `reset` boolean property is replaced by the `clear()` method
- Each new stroke now resets the `path` property, consistently with the canvas
  being cleared
- Input handling uses Pointer Events: mouse, touch and pen work natively, and
  strokes keep tracking when the pointer leaves the component

### Added

- The canvas resizes with the component (via `ResizeObserver`) and replays the
  path after a resize
- Hi-DPI rendering: the canvas is scaled by `devicePixelRatio` for crisp lines
- Changing `stroke-style` or `line-width` re-renders the current path
- `npm run start` launches the demo with `@web/dev-server`
- `LICENSE.md` (MIT) and this changelog

### Fixed

- Canvas was cleared using its width as height
- `path` accumulated strokes mixed with stray empty arrays
- `homepage` in the package manifest pointed to another project

## [0.2.0] - 2017-02-02

### Added

- Touch events support

## [0.1.1] - 2017-02-02

### Fixed

- The sparkline timeline must always advance along the x axis

## [0.1.0] - 2017-02-02

### Added

- Initial release: a Polymer 1.x web component to hand draw a sparkline on a
  canvas and get its coordinates

[2.0.0]: https://github.com/LostInBrittany/granite-draw-sparkline/compare/0.2.0...2.0.0
[0.2.0]: https://github.com/LostInBrittany/granite-draw-sparkline/compare/0.1.1...0.2.0
[0.1.1]: https://github.com/LostInBrittany/granite-draw-sparkline/compare/0.1.0...0.1.1
[0.1.0]: https://github.com/LostInBrittany/granite-draw-sparkline/releases/tag/0.1.0
