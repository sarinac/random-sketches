import sketch_01 from "./sketches/sketch_01.js";
import sketch_02 from "./sketches/sketch_02.js";
import sketch_03 from "./sketches/sketch_03.js";
import sketch_04 from "./sketches/sketch_04.js";
import sketch_05 from "./sketches/sketch_05.js";
import sketch_06 from "./sketches/sketch_06.js";
import sketch_07 from "./sketches/sketch_07.js";
import sketch_08 from "./sketches/sketch_08.js";
import sketch_09 from "./sketches/sketch_09.js";

const SKETCHES = {
    1: sketch_01,
    2: sketch_02,
    3: sketch_03,
    4: sketch_04,
    5: sketch_05,
    6: sketch_06,
    7: sketch_07,
    8: sketch_08,
    9: sketch_09,
};
const NUMBER_SKETCHES = Object.keys(SKETCHES).length;

// Create selection / button group
const selection = document.getElementById("selection");
for (let i = 1; i <= NUMBER_SKETCHES; i++) {
    let button = document.createElement("button");
    button.innerHTML = i;
    button.setAttribute("id", `button-${i}`);
    button.style.cssText = `width: ${80 / NUMBER_SKETCHES}%;`;
    button.onclick = () => {
        draw("canvas-container", i);
    };
    selection.appendChild(button);
}

// Create SVG for colors
const svg = d3.select("#colors");
svg.attr("viewBox", `0 0 ${svg.node().getBoundingClientRect().width} 10`).attr(
    "preserveAspectRatio",
    "none"
);

const resize = () => {
    d3.select("div#visualization-container").style(
        "height",
        `${d3.select("canvas").node().getBoundingClientRect().height}px`
    );
};

const draw = (canvasId, number) => {
    // Get Sketch
    let sketch = SKETCHES[number];

    // Select
    d3.selectAll("button").classed("selected", false);
    d3.select(`#button-${number}`).classed("selected", true);

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

    // Remove all objects within canvas container
    d3.select(`#${canvasId}`).selectAll("*").remove();

    // Draw
    sketch.draw(canvasId);

    // Resize container
    resize();

    // Add Description
    document.getElementById(
        "inspiration-container"
    ).innerHTML = sketch.inspiration.join("");
};

$(document).ready(() => {
    // Start with the latest
    draw("canvas-container", NUMBER_SKETCHES);
    window.addEventListener("resize", resize);
});
