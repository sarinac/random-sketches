const sketch_05 = {
    title: "Voronoi",

    date: "March 31, 2021",

    colors: {
        white: "#ffffff",
        100: d3.interpolateInferno(1.0),
        80: d3.interpolateInferno(0.8),
        60: d3.interpolateInferno(0.6),
        40: d3.interpolateInferno(0.4),
        20: d3.interpolateInferno(0.2),
    },

    inspiration: [
        "<h1>Inspiration</h1>",
        "<p>I wanted to learn how to build a <a href='https://en.wikipedia.org/wiki/Voronoi_diagram'>Voronoi Diagram</a> by using D3's <a href='https://github.com/d3/d3-delaunay'>Delanuay API</a>. In a Voronoi, the lines between cells are equidistant from neighboring seeds.</p>",
        "<h1>What's Random?</h1>",
        "<p>Positions, number of cells.</p>",
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

        // --------------- Math Functions --------------- //

        /**
         * Returns euclidean distance from center as a percentage from longest distance
         * @param {number} x
         * @param {number} y
         * @returns percent from longest distance
         */
        function distanceFromCenter(x, y) {
            let distance = Math.sqrt(
                Math.pow(x - width / 2, 2) + Math.pow(y - height / 2, 2)
            );

            return (
                1 -
                distance /
                    Math.sqrt(Math.pow(width / 2, 2) + Math.pow(height / 2, 2))
            );
        }

        /**
         * Get mean x and y
         * @param {Array} array
         * @returns Array [x, y]
         */
        function getAverage(array) {
            // Unzip array

            let x = [],
                y = [];
            for (let i = 0; i < array.length; i++) {
                let element = array[i];
                x.push(element[0]);
                y.push(element[1]);
            }

            // Find mean
            return [d3.mean(x), d3.mean(y)];
        }
        // --------------- Draw --------------- //

        const NUM_TRIANGLES = 800 + Math.random() * 1200;

        // Background color
        contextBackground.beginPath();
        contextBackground.rect(0, 0, width, height);
        contextBackground.fillStyle = this.colors.white;
        contextBackground.fill();

        // Create data points
        let points = [];
        for (let i = 0; i < NUM_TRIANGLES; i++) {
            points.push([Math.random() * width, Math.random() * height]);
        }

        const delaunay = d3.Delaunay.from(points);
        const voronoi = delaunay.voronoi([0, 0, width, height]);
        let cell = voronoi.render().split(/M/).slice(1).length;

        // Color cells
        for (let i = 0; i < cell; i++) {
            context.beginPath();
            voronoi.renderCell(i, context);
            let element = getAverage(voronoi.cellPolygon(i));

            // Fill
            context.fillStyle = d3.interpolateInferno(
                distanceFromCenter(element[0], element[1])
            );
            context.fill();

            // Stroke
            context.lineWidth = 1;
            context.strokeStyle = d3.interpolateInferno(
                distanceFromCenter(element[0], element[1])
            );
            context.stroke();

        }

        // Draw points
        // context.beginPath();
        // delaunay.renderPoints(context, 1);
        // context.fillStyle = this.colors.white;
        // context.fill();
    },
};

export default sketch_05;
