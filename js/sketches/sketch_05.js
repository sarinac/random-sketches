const sketch_05 = {
    title: "Pastel Trapezoids",

    date: "March 28, 2021",

    colors: {
        white: "#f1f1ec",
        orange: "#f1e0d5",
        yellow: "#f2f0e4",
        pink: "#d4b2b8",
        green: "#e1e9e0",
        black: "#666666",
    },

    inspiration: [
        "<h1>Inspiration</h1>",
        "<p>I really like these colors... but I don't have an actual use for them :(</p>",
        "<h1>What's Random?</h1>",
        "<p>Size, position, color.</p>",
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

        // --------------- Draw Functions --------------- //

        const MIN_WIDTH = Math.max(width / 50, 20),
            MAX_WIDTH = Math.max(width / 3, 100),
            MIN_HEIGHT = 0.4 * height,
            MAX_HEIGHT = 0.8 * height,
            MAX_VARIATION_FACTOR = 0.1;

        class Trapezoid {
            constructor(color, fill) {
                this.color = color;
                this.fill = fill;
                let width0 =
                        MIN_WIDTH + Math.random() * (MAX_WIDTH - MIN_WIDTH),
                    height0 =
                        MIN_HEIGHT + Math.random() * (MAX_HEIGHT - MIN_HEIGHT);

                // Top Left
                this.tl_x0 = Math.random() * width;
                this.tl_y0 = (Math.random() - 0.1) * height;

                // Top Right
                this.tr_x0 = this.tl_x0 + width0;
                this.tr_y0 =
                    this.tl_y0 +
                    2 * (Math.random() - 0.5) * MAX_VARIATION_FACTOR * height0;

                // Bottom Right
                this.br_x0 =
                    this.tr_x0 +
                    2 * (Math.random() - 0.5) * MAX_VARIATION_FACTOR * width0;
                this.br_y0 = this.tr_y0 + height0;

                // Bottom Left
                this.bl_x0 =
                    this.br_x0 -
                    width0 -
                    2 * (Math.random() - 0.5) * MAX_VARIATION_FACTOR * width0;
                this.bl_y0 =
                    this.br_y0 +
                    2 * (Math.random() - 0.5) * MAX_VARIATION_FACTOR * height0;

                // Next point
                this.tl_x1 = null;
                this.tl_y1 = null;
                this.tr_x1 = null;
                this.tr_y1 = null;
                this.br_x1 = null;
                this.br_y1 = null;
                this.bl_x1 = null;
                this.bl_y1 = null;

                this.generateNextPoints();
            }

            /**
             * Generate points for next trapezoid shape and position
             */
            generateNextPoints() {
                let width1 =
                        MIN_WIDTH + Math.random() * (MAX_WIDTH - MIN_WIDTH),
                    height1 =
                        MIN_HEIGHT + Math.random() * (MAX_HEIGHT - MIN_HEIGHT);

                // Top Left
                this.tl_x1 = Math.random() * width;
                this.tl_y1 = (Math.random() - 0.1) * height;

                // Top Right
                this.tr_x1 = this.tl_x1 + width1;
                this.tr_y1 =
                    this.tl_y1 +
                    2 * (Math.random() - 0.5) * MAX_VARIATION_FACTOR * height1;

                // Bottom Right
                this.br_x1 =
                    this.tr_x1 +
                    2 * (Math.random() - 0.5) * MAX_VARIATION_FACTOR * width1;
                this.br_y1 = this.tr_y1 + height1;

                // Bottom Left
                this.bl_x1 =
                    this.br_x1 -
                    width1 -
                    2 * (Math.random() - 0.5) * MAX_VARIATION_FACTOR * width1;
                this.bl_y1 =
                    this.br_y1 +
                    2 * (Math.random() - 0.5) * MAX_VARIATION_FACTOR * height1;
            }

            /**
             * Point next to current and generate next points
             */
            switchPoints() {
                this.tl_x0 = this.tl_x1;
                this.tl_y0 = this.tl_y1;
                this.tr_x0 = this.tr_x1;
                this.tr_y0 = this.tr_y1;
                this.br_x0 = this.br_x1;
                this.br_y0 = this.br_y1;
                this.bl_x0 = this.bl_x1;
                this.bl_y0 = this.bl_y1;

                this.generateNextPoints();
            }

            /**
             * Generates path (interpolated)
             * @param {number} elapsed
             * @returns d
             */
            generatePath(elapsed) {
                return [
                    `M${this.tl_x0 + (this.tl_x1 - this.tl_x0) * elapsed},${
                        this.tl_y0 + (this.tl_y1 - this.tl_y0) * elapsed
                    }`,
                    `L${this.tr_x0 + (this.tr_x1 - this.tr_x0) * elapsed},${
                        this.tr_y0 + (this.tr_y1 - this.tr_y0) * elapsed
                    }`,
                    `L${this.br_x0 + (this.br_x1 - this.br_x0) * elapsed},${
                        this.br_y0 + (this.br_y1 - this.br_y0) * elapsed
                    }`,
                    `L${this.bl_x0 + (this.bl_x1 - this.bl_x0) * elapsed},${
                        this.bl_y0 + (this.bl_y1 - this.bl_y0) * elapsed
                    }`,
                    "Z",
                ].join(" ");
            }

            /**
             * Draw shape on canvas
             * @param {number} elapsed
             */
            drawPath(elapsed) {
                let path = new Path2D(this.generatePath(elapsed));
                context.beginPath();
                if (this.fill) {
                    context.fillStyle = this.color;
                    context.fill(path);
                } else {
                    context.strokeStyle = this.color;
                    context.lineWidth = 2;
                    context.stroke(path);
                }
            }
        }

        // --------------- Set Up Sketch --------------- //

        // Background color
        contextBackground.beginPath();
        contextBackground.rect(0, 0, width, height);
        contextBackground.fillStyle = this.colors.orange;
        contextBackground.fill();

        // Create fixed objects
        const ELEMENTS = [
            { color: this.colors.white, fill: true },
            { color: this.colors.yellow, fill: true },
            { color: this.colors.yellow, fill: true },
            { color: this.colors.pink, fill: true },
            { color: this.colors.green, fill: true },
            { color: this.colors.black, fill: true },
            { color: this.colors.white, fill: true },
            { color: this.colors.green, fill: true },
            { color: this.colors.white, fill: false },
            { color: this.colors.white, fill: false },
            { color: this.colors.white, fill: false },
            { color: this.colors.black, fill: false },
            { color: this.colors.black, fill: false },
        ];

        // Initialize
        for (let i = 0; i < ELEMENTS.length; i++) {
            ELEMENTS[i].trapezoid = new Trapezoid(
                ELEMENTS[i].color,
                ELEMENTS[i].fill
            );
            ELEMENTS[i].trapezoid.drawPath(0);
        }

        /**
         * Returns output of s-shaped function for easing transitions
         * @param {number} x (between 0 and 1)
         * @returns y (between 0 and 1)
         */
        function scale(x) {
            return 1 / (1 + Math.pow(x / (1 - x), -3));
        }

        // --------------- Draw --------------- //

        let tick = 0;
        setInterval(function () {
            if (tick <= 1) {
                // Clear Canvas
                context.clearRect(0, 0, width, height);

                // Draw
                for (let i = 0; i < ELEMENTS.length; i++) {
                    ELEMENTS[i].trapezoid.drawPath(scale(tick));
                }
            }

            // After ~3 seconds then start over
            else if (tick > 3) {
                for (let i = 0; i < ELEMENTS.length; i++) {
                    ELEMENTS[i].trapezoid.switchPoints();
                }
                tick = 0;
            }
            // Increment
            tick = tick + 0.01;
        }, 1000 / 80); // 80 FPS
    },
};

export default sketch_05;
