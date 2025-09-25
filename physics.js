// physics.js
class PhysicsEngine {
  constructor(gravity = 0.5, bounce = 0.7, friction = 0.99, airDrag = 0.995) {
    this.gravity = gravity;     // downward force
    this.bounce = bounce;       // restitution
    this.friction = friction;   // surface friction
    this.airDrag = airDrag;     // slows velocity in air
    this.wind = 0;              // horizontal push
    this.springs = [];          // spring joints
    this.magnetic = false;      // enable/disable magnetic attraction
  }

  // Apply world physics to a single shape
  applyPhysics(shape, canvas) {
    // Apply gravity
    shape.vy += this.gravity;

    // Apply wind
    shape.vx += this.wind;

    // Air resistance
    shape.vx *= this.airDrag;
    shape.vy *= this.airDrag;

    // Update position
    shape.x += shape.vx;
    shape.y += shape.vy;

    // --- Ground collision ---
    if (shape.y + shape.size > canvas.height) {
      shape.y = canvas.height - shape.size;
      shape.vy *= -this.bounce;
      shape.vx *= this.friction;
    }

    // --- Ceiling collision ---
    if (shape.y < 0) {
      shape.y = 0;
      shape.vy *= -this.bounce;
    }

    // --- Wall collisions ---
    if (shape.x < 0) {
      shape.x = 0;
      shape.vx *= -this.bounce;
    }
    if (shape.x + shape.size > canvas.width) {
      shape.x = canvas.width - shape.size;
      shape.vx *= -this.bounce;
    }
  }

  // Handle collisions between all objects
  handleCollisions(objects) {
    for (let i = 0; i < objects.length; i++) {
      for (let j = i + 1; j < objects.length; j++) {
        let a = objects[i];
        let b = objects[j];

        // Approximate using circles
        let dx = (a.x + a.size/2) - (b.x + b.size/2);
        let dy = (a.y + a.size/2) - (b.y + b.size/2);
        let dist = Math.sqrt(dx*dx + dy*dy);
        let minDist = (a.size/2) + (b.size/2);

        if (dist < minDist && dist > 0) {
          // Resolve overlap
          let overlap = (minDist - dist) / 2;
          let nx = dx / dist;
          let ny = dy / dist;

          a.x += nx * overlap;
          a.y += ny * overlap;
          b.x -= nx * overlap;
          b.y -= ny * overlap;

          // Elastic collision
          let tempVx = a.vx;
          let tempVy = a.vy;
          a.vx = b.vx;
          a.vy = b.vy;
          b.vx = tempVx;
          b.vy = tempVy;
        }

        // Magnetic attraction (like gravity between objects)
        if (this.magnetic && dist > 0) {
          let force = 50 / (dist * dist); // inverse square law
          let nx = dx / dist;
          let ny = dy / dist;
          a.vx -= nx * force;
          a.vy -= ny * force;
          b.vx += nx * force;
          b.vy += ny * force;
        }
      }
    }
  }

  // External forces
  applyForce(shape, fx, fy) {
    shape.vx += fx;
    shape.vy += fy;
  }

  setWind(value) {
    this.wind = value;
  }

  toggleMagnetism(state) {
    this.magnetic = state;
  }

  // Springs: connect two shapes
  addSpring(a, b, restLength = 100, k = 0.05) {
    this.springs.push({ a, b, restLength, k });
  }

  applySprings() {
    this.springs.forEach(spring => {
      let dx = (spring.a.x + spring.a.size/2) - (spring.b.x + spring.b.size/2);
      let dy = (spring.a.y + spring.a.size/2) - (spring.b.y + spring.b.size/2);
      let dist = Math.sqrt(dx*dx + dy*dy);
      let diff = dist - spring.restLength;
      let force = spring.k * diff;

      let nx = dx / dist;
      let ny = dy / dist;

      spring.a.vx -= nx * force;
      spring.a.vy -= ny * force;
      spring.b.vx += nx * force;
      spring.b.vy += ny * force;
    });
  }

  // Force field (e.g. vortex at point)
  applyForceField(objects, cx, cy, strength = 0.5) {
    objects.forEach(o => {
      let dx = (cx - (o.x + o.size/2));
      let dy = (cy - (o.y + o.size/2));
      let dist = Math.sqrt(dx*dx + dy*dy) + 0.1;
      let nx = dx / dist;
      let ny = dy / dist;

      o.vx += nx * (strength / dist);
      o.vy += ny * (strength / dist);
    });
  }

  // Step world
  step(objects, canvas) {
    objects.forEach(obj => this.applyPhysics(obj, canvas));
    this.handleCollisions(objects);
    this.applySprings();
  }
}

// physics.js

class PhysicsEngine {
    constructor(gravity = 0.5, bounce = 0.7, friction = 0.99, airDrag = 0.995) {
        this.gravity = gravity;
        this.bounce = bounce;
        this.friction = friction;
        this.airDrag = airDrag;
        this.wind = 0;
        this.magnetic = false;
        this.springs = [];
        this.shapes = []; // physics engine manages its own shape list
    }

    addShape(shape) {
        this.shapes.push(shape);
    }

    removeShape(shape) {
        const index = this.shapes.indexOf(shape);
        if (index !== -1) this.shapes.splice(index, 1);
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
        // Gravity
        shape.vy += this.gravity;

        // Wind
        shape.vx += this.wind;

        // Air drag
        shape.vx *= this.airDrag;
        shape.vy *= this.airDrag;

        // Friction (surface)
        shape.vx *= this.friction;
        shape.vy *= this.friction;

        // Torque for rotation (if shape has angular velocity)
        if (shape.angularVelocity) {
            shape.rotation += shape.angularVelocity;
            shape.angularVelocity *= 0.98; // angular drag
        }
    }

    handleCollisions() {
        const objs = this.shapes;
        for (let i = 0; i < objs.length; i++) {
            for (let j = i + 1; j < objs.length; j++) {
                const a = objs[i];
                const b = objs[j];

                // Simple circle approximation for collisions
                const dx = (a.x + a.size/2) - (b.x + b.size/2);
                const dy = (a.y + a.size/2) - (b.y + b.size/2);
                const dist = Math.sqrt(dx*dx + dy*dy);
                const minDist = (a.size/2) + (b.size/2);

                if (dist < minDist && dist > 0) {
                    // Resolve overlap
                    const overlap = (minDist - dist) / 2;
                    const nx = dx / dist;
                    const ny = dy / dist;

                    a.x += nx * overlap;
                    a.y += ny * overlap;
                    b.x -= nx * overlap;
                    b.y -= ny * overlap;

                    // Elastic collision
                    const tempVx = a.vx;
                    const tempVy = a.vy;
                    a.vx = b.vx;
                    a.vy = b.vy;
                    b.vx = tempVx;
                    b.vy = tempVy;
                }

                // Magnetic attraction
                if (this.magnetic && dist > 0) {
                    const force = 50 / (dist * dist);
                    const nx = dx / dist;
                    const ny = dy / dist;
                    a.vx -= nx * force;
                    a.vy -= ny * force;
                    b.vx += nx * force;
                    b.vy += ny * force;
                }
            }
        }
    }

    applySprings() {
        for (let spring of this.springs) {
            const { a, b, restLength, k } = spring;
            const dx = (a.x + a.size/2) - (b.x + b.size/2);
            const dy = (a.y + a.size/2) - (b.y + b.size/2);
            const dist = Math.sqrt(dx*dx + dy*dy);
            const diff = dist - restLength;
            const force = k * diff;
            const nx = dx / dist;
            const ny = dy / dist;

            a.vx -= nx * force;
            a.vy -= ny * force;
            b.vx += nx * force;
            b.vy += ny * force;
        }
    }

    applyForceField(cx, cy, strength = 0.5) {
        for (let shape of this.shapes) {
            const dx = cx - (shape.x + shape.size/2);
            const dy = cy - (shape.y + shape.size/2);
            const dist = Math.sqrt(dx*dx + dy*dy) + 0.1;
            const nx = dx / dist;
            const ny = dy / dist;
            shape.vx += nx * (strength / dist);
            shape.vy += ny * (strength / dist);
        }
    }

    applyPhysics(canvas) {
        for (let shape of this.shapes) {
            this.applyForces(shape);

            // Update position
            shape.x += shape.vx;
            shape.y += shape.vy;

            // Boundary collisions
            if (shape.x < 0) { shape.x = 0; shape.vx *= -this.bounce; }
            if (shape.x + shape.size > canvas.width) { shape.x = canvas.width - shape.size; shape.vx *= -this.bounce; }
            if (shape.y < 0) { shape.y = 0; shape.vy *= -this.bounce; }
            if (shape.y + shape.size > canvas.height) { shape.y = canvas.height - shape.size; shape.vy *= -this.bounce; }
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

        // Draw shapes
        for (let shape of engine.shapes) {
            shape.draw(ctx);
        }

        requestAnimationFrame(loop);
    }
    loop();
}

window.PhysicsEngine = PhysicsEngine;
