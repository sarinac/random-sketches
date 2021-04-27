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

        // --------------- Blob --------------- //
        // Set constants
        const COLORS = Object.values(this.colors).splice(1);
        const MIN_BLOBS = 12,
            MAX_BLOBS = 30,
            MIN_RADIUS = 10,
            MAX_RADIUS = height / 4;

        // Create blob objects
        let colors = {};
        for (let color of COLORS) {
            let blobs = [];
            for (
                let i = 0;
                i < MIN_BLOBS + (MAX_BLOBS - MIN_BLOBS) * Math.random();
                i++
            ) {
                blobs.push({
                    radius:
                        MIN_RADIUS + (MAX_RADIUS - MIN_RADIUS) * Math.random(),
                    x: width * Math.random(),
                    y: height * Math.random(),
                    xDirection: Math.random() < 0.5 ? -1 : 1,
                    yDirection: Math.random() < 0.5 ? -1 : 1,
                    slope: 2 * Math.random(),
                    speed: 5 * Math.random(),
                });
            }
            colors[color] = blobs;
        }

        /**
         * Updates positions for each blob in Array of blobs
         * @param {Array} blobs
         * @returns blobs
         */
        const update = (blobs) => {
            // Helpful logic from this bl.ocks
            // http://bl.ocks.org/HarryStevens/f59cf33cfe5ea05adec113c64daef59b
            blobs.forEach((blob) => {
                blob.xDirection =
                    blob.x < blob.radius
                        ? 1
                        : blob.x > width - blob.radius
                        ? -1
                        : blob.xDirection;
                blob.yDirection =
                    blob.y < blob.radius
                        ? 1
                        : blob.y > height - blob.radius
                        ? -1
                        : blob.yDirection;

                blob.x =
                    blob.x +
                    blob.speed *
                        Math.sqrt(1 / (1 + Math.pow(blob.slope, 2))) *
                        blob.xDirection;
                blob.y =
                    blob.y +
                    blob.slope *
                        blob.speed *
                        Math.sqrt(1 / (1 + Math.pow(blob.slope, 2))) *
                        blob.yDirection;

                return blob;
            });
            return blobs;
        };

        // --------------- Set Up Sketch --------------- //

        // Background color
        contextBackground.beginPath();
        contextBackground.rect(0, 0, width, height);
        contextBackground.fillStyle = this.colors.blue1;
        contextBackground.fill();

        function draw() {
            // Clear canvas
            context.clearRect(0, 0, width, height);

            // Draw blobs
            context.globalCompositeOperation = "hue";
            for (let color of Object.keys(colors)) {
                let blobs = colors[color];
                context.beginPath();
                for (let blob of blobs) {
                    context.moveTo(blob.x, blob.y);
                    context.arc(blob.x, blob.y, blob.radius, 0, 2 * Math.PI);
                }
                context.filter = "url(#goo)";
                context.fillStyle = color;
                context.fill();
                update(blobs);
            }

            // Loop forever
            requestAnimationFrame(draw);
        }
        requestAnimationFrame(draw);
    },
};

export default sketch_09;
