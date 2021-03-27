import sketch_01 from "./sketch_01.js";
import sketch_02 from "./sketch_02.js";
import sketch_03 from "./sketch_03.js";
import sketch_04 from "./sketch_04.js";

const SKETCHES = {
    1: sketch_01,
    2: sketch_02,
    3: sketch_03,
    4: sketch_04,
};
const svg = d3.select("#colors");
svg.attr("viewBox", `0 0 ${svg.node().getBoundingClientRect().width} 10`).attr(
    "preserveAspectRatio",
    "none"
);

const resize = () => {
    d3.select("div#visualization-container")
        .style("height", `${d3.select("canvas").node().getBoundingClientRect().height}px`);
}

const draw = (canvasId, day) => {
    // Get Sketch
    let sketch = SKETCHES[day];

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

    // Remove current canvases
    d3.selectAll("canvas").remove();

    // Draw
    sketch.draw(canvasId);

    // Resize container
    resize();

    // Add Description
    document.getElementById("inspiration-container").innerHTML = sketch.inspiration.join("");

};

// Update the current slider value (each time you drag the slider handle)
document.getElementById("range").oninput = function() {
    draw("canvas-container", this.value);
}

$(document).ready(() => {
    // Start with Day 1
    draw("canvas-container", 4);
    window.addEventListener("resize", resize);
});
