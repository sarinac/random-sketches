import sketch_01 from "./sketch_01.js";

const svg = d3.select("#colors");
svg.attr("viewBox", `0 0 ${svg.node().getBoundingClientRect().width} 10`).attr(
    "preserveAspectRatio",
    "none"
);

const draw = (canvasId, day) => {
    // Get Sketch
    let sketch = sketch_01;

    // Set title and date
    $("#sketch-title-text").html(sketch.title);
    $("#sketch-date-text").html(sketch.date);

    // Populate colors
    for (let i = 0; i < Object.keys(sketch.colors).length; i++) {
        svg.append("rect")
            .attr(
                "x",
                (i * svg.node().getBoundingClientRect().width) /
                    Object.keys(sketch.colors).length
            )
            .attr("y", 0)
            .attr(
                "width",
                svg.node().getBoundingClientRect().width /
                    Object.keys(sketch.colors).length
            )
            .attr("height", svg.node().getBoundingClientRect().height)
            .attr("fill", sketch.colors[Object.keys(sketch.colors)[i]]);
    }

    // Draw
    sketch.draw(canvasId);
};

$(document).ready(() => {
    // Start with Day 1
    draw("canvas-container", 1);
});
