# Responsive Layout Builder


## Overview

The Responsive Layout Builder is a web tool that lets developers quickly create and test page layouts. You can split the screen into sections, adjust them, and instantly see the generated code in JSX + Tailwind or HTML + CSS. Future updates will add breakpoint-specific settings(sm, md, lg) so layouts adapt better on different devices.


https://github.com/user-attachments/assets/c8da0ab6-a0d2-4641-81ba-175b7bbf0998


## What It Can Do

- Interactive canvas with split panes (horizontal / vertical)

- Add a new pane by splitting the selected one

- Choose row or column orientation for the next split

- Resize panes by dragging the divider (live updates with proportional sizing)

- Double-click divider to reset split to 50/50

- Select panes (highlighted visually)

- Rearrange panes by dragging one pane onto another (swaps label and color)

- Delete a pane (parent collapses automatically, root is protected)

- Reset everything back to a single pane

- Real-time code generation:

  	- JSX + Tailwind: flex markup with flex ratios

  	- HTML + CSS: auto-generated class names with proportional flex values

- Copy generated code with one click

## How It Works

- State Tree (layoutSlice): A binary tree of LeafNode and SplitNode

	- SplitNode: has orientation (row | col) and sizes [a,b]

	- LeafNode: stores label and color (for visuals only)

- Actions: split, resize, rearrange, delete, reset

- Canvas Rendering: recursive components (SplitView and LeafView) render the layout

- Resizing: drag events adjust pane sizes (kept between 0.1–0.9)

- Rearranging: swaps colors/labels instead of restructuring nodes (simpler for now)

- Code Output: two code generators (JSX + HTML/CSS) read from the tree

## Running Locally

```bash
npm install
npm run dev
# open http://localhost:3000
```

The builder is at: http://localhost:3000/home

## Roadmap / TODO

- [ ] Undo / Redo history (e.g., last 50 actions)
- [ ] Breakpoint model (different layout for each screen size)

## Contributing

Contributions welcome! Please fork the repo and submit a PR.

Proposed flow:
1. Open an issue describing the enhancement.
2. Discuss and refine the approach.
3. Submit PR with clear before/after notes + screenshots.



---

### Quick Start (TL;DR)
```
npm i
npm run dev
open http://localhost:3000/home
```

Enjoy experimenting and feel free to suggest improvements!
