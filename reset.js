// reset.js
import { shapes } from './shapes.js';
import { clearForces, stopPhysics, startPhysics } from './physics.js';
import { engine, canvas, ctx } from './main.js';

export function resetSimulation() {
    // Stop physics loop
    stopPhysics();

    // Clear all shapes
    shapes.length = 0;

    // Reset forces
    clearForces();

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Restart physics loop
    startPhysics(engine, ctx, canvas);
}
