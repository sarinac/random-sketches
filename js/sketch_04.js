// import rough from "./rough.js";
const sketch_04 = {
    title: "Polygons",

    date: "March 25, 2021",

    colors: {
        white: "#FFFFFF",
        gold: "#F0D15C",
        blue: "#4353F0",
        red: "#F04F50",
        green: "#73F096",
        black: "#000000",
    },

    inspiration: [
        "<h1>Inspiration</h1>",
        "<p>I wanted to draw something playful with <a href='https://roughjs.com/'>Rough.js</a> which has a crayon type of feel</p>",
        "<h1>What's Random?</h1>",
        "<p>Number of sides per shape, position, color, texture.</p>",
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

        const rc = rough.canvas(canvas.node());

        // --------------- Draw Functions --------------- //

        const MAX_NUMBER_OF_SIDES = 6,
            FILL_STYLES = [
                "hachure",
                "solid",
                "zigzag",
                "dots",
                "cross-hatch",
            ],
            COLORS = Object.values(this.colors),
            MAX_WEIGHT = 3;
        COLORS.pop(); // Remove black
        COLORS.shift(); // Remove white

        class Polygon {
            constructor() {
                // Shape
                this.radius = 20;
                this.numberOfSides = Math.round(
                    MAX_NUMBER_OF_SIDES * Math.random()
                );
                this.path = this.createPolygonPath();
                // Colors
                this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
                this.fillStyle = "dots";
                    // FILL_STYLES[Math.floor(Math.random() * FILL_STYLES.length)];
                this.fillWeight = Math.round(Math.random() * MAX_WEIGHT);
                // Position
                this.x =
                    this.radius + Math.random() * (width - 2 * this.radius);
                this.y =
                    this.radius + Math.random() * (height - 2 * this.radius);
                this.rotation = 2 * Math.PI * Math.random();
            }

            /**
             * Draws a path for polygon
             * @returns {string} path
             */
            createPolygonPath() {
                if (this.numberOfSides < 3) {
                    return "";
                } else {
                    let path = `M${this.radius * Math.cos(0)} ${
                        this.radius * Math.sin(0)
                    } `;
                    for (let i = 1; i <= this.numberOfSides; i++) {
                        path += `L ${
                            this.radius *
                            Math.cos((i * 2 * Math.PI) / this.numberOfSides)
                        } ${
                            this.radius *
                            Math.sin((i * 2 * Math.PI) / this.numberOfSides)
                        } `;
                    }
                    path += "Z";
                    return path;
                }
            }

            /**
             * Draw polygon on canvas
             */
            drawPolygon() {
                // Transform canvas
                context.translate(this.x, this.y);
                context.rotate(this.rotation);
                // Draw
                if (this.numberOfSides < 3) {
                    rc.circle(0, 0, this.radius, {
                        fill: this.color,
                        fillStyle: this.fill,
                        fillWeight: this.fillWeight,
                    });
                } else {
                    rc.path(this.path, {
                        fill: this.color,
                        fillStyle: this.fill,
                        fillWeight: this.fillWeight,
                    });
                }
                // Transform canvas
                context.rotate(-this.rotation);
                context.translate(-this.x, -this.y);
            }
        }

        // --------------- Set Up Sketch --------------- //

        // Background color
        contextBackground.beginPath();
        contextBackground.rect(0, 0, width, height);
        contextBackground.fillStyle = this.colors.white;
        contextBackground.fill();

        // --------------- Draw --------------- //

        const NUM_SHAPES = 100;
        let p;
        for (let i = 0; i < NUM_SHAPES; i++) {
            p = new Polygon();
            p.drawPolygon();
        }
    },
};

export default sketch_04;
