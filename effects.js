// effects.js
import { shapes, Shape, createCircle, createSquare, createTriangle, createPolygon, createLine } from './shapes.js';

// Keep track of anchored shapes
export const anchoredShapes = new Set();

// Anchor a shape (it won't move, but others can collide)
export function anchorShape(shape) {
    if (!anchoredShapes.has(shape)) {
        anchoredShapes.add(shape);
        shape.vx = 0;
        shape.vy = 0;
        shape.angularVelocity = 0;
    }
}

// Unanchor a shape
export function unanchorShape(shape) {
    if (anchoredShapes.has(shape)) {
        anchoredShapes.delete(shape);
    }
}

// Toggle anchor state
export function toggleAnchor(shape) {
    if (anchoredShapes.has(shape)) {
        unanchorShape(shape);
    } else {
        anchorShape(shape);
    }
}

// Copy a shape (creates a new shape with same properties)
export function copyShape(shape) {
    let newShape;
    switch (shape.type) {
        case "circle":
            newShape = createCircle(shape.x + 20, shape.y + 20, shape.size, shape.color, shape.mass);
            break;
        case "square":
            newShape = createSquare(shape.x + 20, shape.y + 20, shape.size, shape.color, shape.mass);
            break;
        case "triangle":
            newShape = createTriangle(shape.x + 20, shape.y + 20, shape.size, shape.color, shape.mass);
            break;
        case "polygon":
            newShape = createPolygon(shape.x + 20, shape.y + 20, shape.size, shape.color, shape.mass);
            break;
        case "line":
            newShape = createLine(shape.x + 20, shape.y + 20, shape.size, shape.color, shape.mass);
            break;
    }
    // Copy velocities and rotation
    newShape.vx = shape.vx;
    newShape.vy = shape.vy;
    newShape.rotation = shape.rotation;
    newShape.angularVelocity = shape.angularVelocity;
    return newShape;
}

// Delete a shape from the simulation
export function deleteShape(shape) {
    const index = shapes.indexOf(shape);
    if (index !== -1) {
        shapes.splice(index, 1);
        anchoredShapes.delete(shape);
    }
}

// Anchor all shapes under mouse click (optional helper)
export function anchorShapeAt(x, y) {
    for (let shape of shapes) {
        if (
            x > shape.x &&
            x < shape.x + shape.size &&
            y > shape.y &&
            y < shape.y + shape.size
        ) {
            toggleAnchor(shape);
        }
    }
}

// Copy all anchored shapes
export function copyAnchoredShapes() {
    const copies = [];
    for (let shape of anchoredShapes) {
        copies.push(copyShape(shape));
    }
    return copies;
}
