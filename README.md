# Rutuparna Purandare — Engineering Portfolio

This repository powers my GitHub Pages engineering portfolio.

## Featured system: Infinity Sketcher

[Infinity-Sketcher](https://github.com/Rutu2701/Infinity-Sketcher) is a mobile differential-drive CNC drawing robot that converts raster images into physical motion.

![Infinity Sketcher vehicle](https://raw.githubusercontent.com/Rutu2701/Infinity-Sketcher/main/docs/images/vehicle.png)

The project combines:

- Python + OpenCV image processing
- contour and skeleton/midline tracing
- nearest-neighbor path optimization
- differential-drive kinematics and dead reckoning
- Bresenham-style motor synchronization
- trapezoidal acceleration
- Arduino-side PID straight-line correction
- synchronous USB serial control
- hardware fault detection and emergency stop handling

### Project GUI

![Infinity Sketcher GUI](https://raw.githubusercontent.com/Rutu2701/Infinity-Sketcher/main/docs/images/gui.svg)

The GUI connects image processing, path generation, simulation, robot-state display and serial control into one workflow.

### Technical documentation

The Infinity Sketcher case study on this portfolio expands into the system architecture and algorithms: kinematics, image processing, path ordering, toolpath generation, firmware execution, concurrency, serial reliability, coordinate mirroring, simulation and skeletonization.

## Portfolio structure

- `index.html` — main landing page
- `styles.css` — visual system and responsive layout
- `projects/` — detailed project case studies
- `research/` — technical investigations
- `docs/` — supporting engineering documentation

The landing page is intentionally project-first: physical builds, software experiments and research are presented as systems with implementation details and evidence rather than as a generic resume.
