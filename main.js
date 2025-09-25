// main.js
import { shapes, createCircle, createSquare, createTriangle, createPolygon, createLine } from './shapes.js';
import { PhysicsEngine, startPhysics, stopPhysics, clearForces } from './physics.js';
import { resetSimulation } from './reset.js';

// Canvas setup
export const canvas = document.getElementById('canvas');
export const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

// Physics engine instance
export const engine = new PhysicsEngine();

// Start physics loop
startPhysics(engine, ctx, canvas);

// Example: Add some initial shapes
createCircle(100, 100, 50, 'red');
createSquare(200, 50, 60, 'blue');
createTriangle(300, 150, 70, 'green');

// Toolbar buttons
const addCircleBtn = document.getElementById('addCircle');
const addSquareBtn = document.getElementById('addSquare');
const resetBtn = document.getElementById('resetSimulation');

// Add shape events
addCircleBtn.addEventListener('click', () => createCircle(Math.random() * 700 + 50, Math.random() * 500 + 50));
addSquareBtn.addEventListener('click', () => createSquare(Math.random() * 700 + 50, Math.random() * 500 + 50));

// Reset button
resetBtn.addEventListener('click', () => resetSimulation());

// Optional: Example wind slider
const windSlider = document.getElementById('windSlider');
windSlider.addEventListener('input', (e) => engine.setWind(parseFloat(e.target.value)));

// Optional: Toggle magnetism
const magnetToggle = document.getElementById('magnetToggle');
magnetToggle.addEventListener('change', (e) => engine.toggleMagnetism(e.target.checked));
