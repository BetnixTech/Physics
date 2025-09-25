// reset.js
import { shapes } from './shapes.js';
import { clearForces, stopPhysics, startPhysics } from './physics.js';

export function resetSimulation(ctx, canvas) {
    // Stop physics loop
    stopPhysics();

    // Clear all shapes
    shapes.length = 0;

    // Clear forces
    clearForces();

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Optionally restart physics loop after reset
    startPhysics(ctx, canvas);
}
