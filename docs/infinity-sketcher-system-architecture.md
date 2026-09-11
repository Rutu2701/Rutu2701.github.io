# Differential Drive Plotter: System Architecture & Algorithms Review

## 1. System Overview and Philosophy

The Differential Drive Plotter operates on a strictly decoupled **"Smart Host, Dumb Executor"** architecture.

- **The Python Host Application:** Acts as the "brain." It is responsible for image processing, pathfinding algorithms, floating-point kinematics, and coordinate mapping. It translates an image into a raw list of physical motor steps.
- **The Arduino Firmware:** Acts as the "nervous system." It receives commands such as `STEPS L:100 R:50` and executes them with synchronized stepping, acceleration, and PID correction.

This separation keeps computationally expensive image processing and kinematics on the PC while the Arduino focuses on deterministic motor execution.

---

## 2. Hardware Wiring and Pinout

According to the firmware documentation, the system uses two stepper motors with shared enable and fault detection:

- **Left Motor:** `STEP_L` Pin 2, `DIR_L` Pin 3
- **Right Motor:** `STEP_R` Pin 6, `DIR_R` Pin 7
- **Power/Control:** `EN_ALL` Pin 8, active LOW
- **Safety/Faults:** `FLT_L` Pin 9 and `FLT_R` Pin 10, using input pull-ups

Grounding either fault input triggers an immediate halt.

---

## 3. Mathematical Foundations: Kinematics

The system uses standard Differential Drive Kinematics mapped to a top-down paper coordinate system.

- **Coordinate system:** +Y is Up/North and +X is Right/East.
- **Heading:** θ = 0° points along +Y and increases clockwise.

### 3.1 Step Conversion

**Steps per millimeter:**

`S_mm = (Full Steps × Microsteps) / (π × Wheel Diameter)`

**Steps per degree:**

`S_deg = (π × Axle Width / 360) × S_mm`

### 3.2 Forward Kinematics

For left and right step counts `st_L` and `st_R`:

1. `d_L = st_L / S_mm` and `d_R = st_R / S_mm`
2. `d = (d_L + d_R) / 2`
3. `Δθ = (d_R - d_L) / Axle Width`
4. `X_new = X_old + d × sin(θ_new)`
5. `Y_new = Y_old + d × cos(θ_new)`

The host uses this odometry model to simulate the robot pose before and during execution.

---

## 4. Python Image Pipeline

When an image is uploaded, `image_to_strokes` processes it through an OpenCV pipeline.

### 4.1 Pre-processing

1. **Resolution thinning:** the image is scaled down to a working resolution so thick strokes collapse toward single-pixel structures.
2. **Auto-invert:** average brightness is checked and the image is normalized to black ink on white.
3. **Thresholding:** a binary inverse threshold creates the drawing mask.

### 4.2 Contour Extraction and Simplification

1. **Suzuki-Abe contour extraction:** `cv2.findContours` traces boundaries.
2. **Douglas-Peucker simplification:** `approxPolyDP` removes redundant vertices while preserving the visual shape, reducing move count substantially.

### 4.3 Path Optimization

The drawing order is optimized as a variation of the **Traveling Salesperson Problem** using a greedy nearest-neighbor strategy. The algorithm evaluates both the start and end of remaining strokes, reverses a stroke when entering from its end is shorter, and continues until all strokes are ordered.

---

## 5. Toolpath Generation

Because a differential-drive robot cannot directly follow arbitrary XY curves, the system uses **piecewise linear approximation**.

### 5.1 Resample and Drive

Long strokes are divided into short segments. For each segment the robot:

1. rotates in place toward the next segment bearing;
2. drives straight for the segment distance.

Small segments make the resulting path appear smooth while preserving sharp corners.

---

## 6. Arduino Firmware Execution

### 6.1 Bresenham Synchronization

The firmware repurposes **Bresenham's Line Algorithm** to interleave left and right motor pulses so both wheels finish a command at the same time even when their step counts differ.

### 6.2 Trapezoidal Acceleration

`rampDelay()` creates acceleration, cruise, and deceleration phases to reduce motor stalls and slip.

### 6.3 Straight-Line PID Correction

For pure straight commands (`stL == stR`), the controller uses `err = doneL - doneR` and applies a small timing correction to compensate for differential friction or execution error.

---

## 7. Software Architecture: Concurrency and GUI

The Tkinter application cannot block its main event loop during image processing or serial execution. The system therefore uses daemon background threads for `GENERATE`, `DEMO`, and `START` operations.

- **Background thread:** OpenCV processing, path planning, math, and blocking serial communication.
- **Main GUI thread:** canvas rendering, controls, and status updates.
- **Thread-safe UI updates:** background work posts callbacks through `self.after(0, ...)` rather than directly modifying Tkinter widgets.

---

## 8. Serial Handshake Protocol

The host and Arduino use a synchronous command-response protocol.

- Python clears the input buffer before sending a new command.
- Arduino's `serialEvent()` assembles newline-terminated commands.
- `STOP` is treated as an immediate override that sets `stopFlag` and disables motors.
- `cmd_timeout` estimates the physical execution time and applies a safety margin before aborting a stalled command.

---

## 9. Advanced Path Optimizations

### 9.1 Bidirectional TSP Reversal

The planner compares distance to both endpoints of every candidate stroke. If the end is closer, the stroke coordinate array is reversed in memory before drawing.

### 9.2 Chain-Stitching

After ordering, strokes separated by a gap of at most 3.0 mm can be merged, eliminating unnecessary travel operations.

---

## 10. Live Simulation and Coordinate Spaces

The GUI has separate screen and mathematical coordinate conventions:

- **Screen space:** origin at top-left, +Y downward.
- **Math space:** +Y upward.

A physical mirror flag can invert Y before motor planning while the renderer reverses that transformation for an intuitive preview.

The central preview is based on **simulated motor steps**, not merely the source image. The same forward-kinematics model used by the physical robot is used to render the predicted pose, producing a WYSIWYG-style motion preview.

---

## 11. Hardware and Electronics Nuances

### 11.1 Microstepping and Torque

The software exposes microstepping values from 1 through 32. The selected value must match the physical driver configuration. Higher microstepping improves smoothness but reduces available holding torque; lower settings provide more torque but can increase visible stepping and resonance.

### 11.2 Enable Pin Management

`EN_ALL` is asserted only when motion begins. On completion, STOP, or a hardware fault, `disableMotors()` removes coil power so the motors do not remain unnecessarily energized while idle.

---

## 12. Morphological Skeletonization Engine

A major raster-to-vector issue is the **double-outline problem**: thick digital strokes can produce inner and outer contours and therefore two physical lines.

Infinity Sketcher addresses this with **morphological skeletonization**. A 3×3 cross-shaped structuring element is used through iterative erosion and dilation. Each extracted layer is accumulated into a skeleton mask until the source shape is consumed.

The resulting central spine is intended to make the robot execute one physical pass per original stroke rather than tracing both boundaries.

---

## 13. User Interface Engineering

The GUI is designed for workshop use, emphasizing rapid parameter tuning without excessive menus.

### 13.1 High-Contrast Visual Standards

The documented interface uses pure black text against warm beige and white surfaces for strong legibility and clear live coordinate/heading status.

### 13.2 Interactive Data Entry

Sensitive parameters such as **Axle Width**, **Wheel Diameter**, and **PID Gains** use editable text fields rather than conventional sliders.

- **Precision typing:** exact numerical values can be entered directly.
- **Scroll-wheel modulation:** hovering over a field and scrolling increments or decrements the value for rapid physical tuning.

---

## 14. Reliability and Safety Protocols

### 14.1 Hardware Fault Detection

The Arduino monitors `FLT_L` and `FLT_R` with internal pull-ups. A driver fault pulls the corresponding input LOW, causing `stopFlag = true`, `disableMotors()`, and an error message to be sent to the Python log.

### 14.2 Synchronous Command-Response Handshaking

The Python host sends one `STEPS` command and waits for an `OK` response before issuing the next. This prevents serial-buffer accumulation and keeps simulated and physical motion synchronized.

---

## 15. Practical Impact and Problem Statement

### 15.1 The Problem

Traditional mobile drawing robots can suffer trajectory drift from mechanical asymmetry, while constrained microcontrollers are poorly suited to heavy image processing and vector-path optimization.

### 15.2 The Infinity Sketcher Solution

**Infinity Sketcher fixes trajectory drift by offloading path optimization to a PC and using real-time PID correction on the Arduino for precise motor execution.**

---

## 16. Future Enhancements and Roadmap

The documented roadmap includes:

1. **Inertial Navigation (IMU):** add a 6-axis gyroscope/accelerometer so the controller can compensate for wheel slip.
2. **Wireless Umbilical:** replace the USB serial connection with Bluetooth HC-05 or Wi-Fi/ESP32 connectivity.
3. **Optical Flow Tracking:** add a downward-facing optical sensor to estimate true X/Y movement and reduce dependence on wheel odometry.
