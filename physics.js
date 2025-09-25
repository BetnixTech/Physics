// physics.js
import { shapes } from './shapes.js';

export class PhysicsEngine {
    constructor(gravity = 0.5, bounce = 0.7, friction = 0.99, airDrag = 0.995) {
        this.gravity = gravity;
        this.bounce = bounce;
        this.friction = friction;
        this.airDrag = airDrag;
        this.wind = 0;
        this.magnetic = false;
        this.springs = [];
    }

    addSpring(a, b, restLength = 100, k = 0.05) {
        this.springs.push({ a, b, restLength, k });
    }

    toggleMagnetism(state) {
        this.magnetic = state;
    }

    setWind(value) {
        this.wind = value;
    }

    applyForces(shape) {
        // Linear forces
        shape.vy += this.gravity;
        shape.vx += this.wind;
        shape.vx *= this.airDrag;
        shape.vy *= this.airDrag;
        shape.vx *= this.friction;
        shape.vy *= this.friction;

        // Angular motion (rotation)
        if (shape.angularVelocity !== undefined) {
            shape.rotation += shape.angularVelocity;
            shape.angularVelocity *= 0.98; // angular drag
        }
    }

    handleCollisions() {
        const objs = shapes;
        for (let i = 0; i < objs.length; i++) {
            for (let j = i + 1; j < objs.length; j++) {
                const a = objs[i];
                const b = objs[j];

                const dx = (a.x + a.size / 2) - (b.x + b.size / 2);
                const dy = (a.y + a.size / 2) - (b.y + b.size / 2);
                const dist = Math.sqrt(dx * dx + dy * dy);
                const minDist = (a.size / 2) + (b.size / 2);

                if (dist < minDist && dist > 0) {
                    // Resolve overlap
                    const overlap = (minDist - dist) / 2;
                    const nx = dx / dist;
                    const ny = dy / dist;

                    a.x += nx * overlap;
                    a.y += ny * overlap;
                    b.x -= nx * overlap;
                    b.y -= ny * overlap;

                    // Linear velocity exchange
                    const tempVx = a.vx;
                    const tempVy = a.vy;
                    a.vx = b.vx;
                    a.vy = b.vy;
                    b.vx = tempVx;
                    b.vy = tempVy;

                    // Angular velocity change on collision
                    const torque = 0.05;
                    a.angularVelocity = (a.angularVelocity || 0) + torque * (Math.random() > 0.5 ? 1 : -1);
                    b.angularVelocity = (b.angularVelocity || 0) - torque * (Math.random() > 0.5 ? 1 : -1);
                }

                // Magnetic attraction
                if (this.magnetic && dist > 0) {
                    const force = 50 / (dist * dist);
                    a.vx -= (dx / dist) * force;
                    a.vy -= (dy / dist) * force;
                    b.vx += (dx / dist) * force;
                    b.vy += (dy / dist) * force;
                }
            }
        }
    }

    applySprings() {
        for (let spring of this.springs) {
            const { a, b, restLength, k } = spring;
            const dx = (a.x + a.size / 2) - (b.x + b.size / 2);
            const dy = (a.y + a.size / 2) - (b.y + b.size / 2);
            const dist = Math.sqrt(dx * dx + dy * dy);
            const diff = dist - restLength;
            const force = k * diff;
            const nx = dx / dist;
            const ny = dy / dist;

            a.vx -= nx * force;
            a.vy -= ny * force;
            b.vx += nx * force;
            b.vy += ny * force;

            // Small spin from spring
            a.angularVelocity = (a.angularVelocity || 0) + 0.001 * force;
            b.angularVelocity = (b.angularVelocity || 0) - 0.001 * force;
        }
    }

    applyPhysics(canvas) {
        for (let shape of shapes) {
            this.applyForces(shape);

            // Update position
            shape.x += shape.vx;
            shape.y += shape.vy;

            // Boundary collisions
            if (shape.x < 0) { shape.x = 0; shape.vx *= -this.bounce; shape.angularVelocity *= -0.5; }
            if (shape.x + shape.size > canvas.width) { shape.x = canvas.width - shape.size; shape.vx *= -this.bounce; shape.angularVelocity *= -0.5; }
            if (shape.y < 0) { shape.y = 0; shape.vy *= -this.bounce; shape.angularVelocity *= -0.5; }
            if (shape.y + shape.size > canvas.height) { shape.y = canvas.height - shape.size; shape.vy *= -this.bounce; shape.angularVelocity *= -0.5; }
        }
    }

    step(canvas) {
        this.applyPhysics(canvas);
        this.handleCollisions();
        this.applySprings();
    }
}

// Animation loop
export function startPhysics(engine, ctx, canvas) {
    function loop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        engine.step(canvas);

        // Draw all shapes
        for (let shape of shapes) {
            shape.draw(ctx);
        }

        requestAnimationFrame(loop);
    }
    loop();
}

// physics.js additions
// physics.js additions

let currentAnimationId = null;

// Stop the physics animation loop
export function stopPhysics() {
    if (currentAnimationId) {
        cancelAnimationFrame(currentAnimationId);
        currentAnimationId = null;
    }
}

// Clear all forces on all shapes
export function clearForces() {
    for (let shape of shapes) {
        shape.vx = 0;
        shape.vy = 0;
        shape.angularVelocity = 0;
    }
}

// Update startPhysics to save the requestAnimationFrame ID
export function startPhysics(engine, ctx, canvas) {
    function loop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        engine.step(canvas);

        // Draw all shapes
        for (let shape of shapes) {
            shape.draw(ctx);
        }

        currentAnimationId = requestAnimationFrame(loop);
    }
    loop();
}



