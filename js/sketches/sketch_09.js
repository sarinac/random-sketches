const sketch_09 = {
    title: "Sea Blobs",

    date: "April 22, 2021",

    colors: {
        blue1: "#49c6e5",
        blue2: "#54defd",
        green1: "#00bd9d",
        green2: "#8bd7d2",
    },

    inspiration: [
        "<h1>Inspiration</h1>",
        "<p>I used <a href='https://css-tricks.com/gooey-effect/'>this post</a> called \"The Gooey Effect\" to learn more about special SVG effects and implement them in canvas. In this example, I can only blend objects if they have the same color. The filters would then exaggerate the blur and up the alpha contrast. I created my <a href='https://stackoverflow.com/questions/59466926/how-to-apply-colormatrix-along-with-canvas-context'>filters with SVG</a>, since I could not find a good way to stack filters in Canvas.</p>",
        "<h1>What's Random?</h1>",
        "<p>Size and position.</p>",
    ],

    draw: function (canvasId) {
        // --------------- Canvas --------------- //

        const width = d3.select(`#${canvasId}`).node().getBoundingClientRect()
            .width;
        const height = Math.min(400, 0.6 * width);

        const canvasBackground = d3
            .select(`#${canvasId}`)
            .append("canvas")
            .attr("width", width)
            .attr("height", height)
            .style("z-index", "0");
        const contextBackground = canvasBackground.node().getContext("2d");

        const canvas = d3
            .select(`#${canvasId}`)
            .append("canvas")
            .attr("width", width)
            .attr("height", height)
            .style("z-index", "1");
        const context = canvas.node().getContext("2d");

        // Make an SVG to make stacked filters. I don't think there's a good way in canvas. ):
        const filter = d3
            .select(`#${canvasId}`)
            .append("svg")
            .attr("width", 0)
            .attr("height", 0)
            .style("position", "absolute")
            .append("filter")
            .attr("id", "goo");
        filter.append("feGaussianBlur").attr("stdDeviation", 10);
        filter
            .append("feColorMatrix")
            .attr("type", "matrix")
            .attr("values", "1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 60 -8");

        // --------------- Set Up Sketch --------------- //

        // Array of colors
        const COLORS = Object.values(this.colors).splice(1);
        const MIN_BLOBS = 12,
            MAX_BLOBS = 30,
            MIN_RADIUS = 10,
            MAX_RADIUS = height / 4;

        // Background color
        contextBackground.beginPath();
        contextBackground.rect(0, 0, width, height);
        contextBackground.fillStyle = this.colors.blue1;
        contextBackground.fill();

        // Draw blobs
        context.globalCompositeOperation = "hue";
        for (let color of COLORS) {
            context.beginPath();
            for (
                let i = 0;
                i < MIN_BLOBS + (MAX_BLOBS - MIN_BLOBS) * Math.random();
                i++
            ) {
                let x = width * Math.random(),
                    y = height * Math.random(),
                    radius =
                        MIN_RADIUS + (MAX_RADIUS - MIN_RADIUS) * Math.random();

                context.moveTo(x, y);
                context.arc(x, y, radius, 0, 2 * Math.PI);
            }
            context.filter = "url(#goo)";
            context.fillStyle = color;
            context.fill();
        }
    },
};

export default sketch_09;
