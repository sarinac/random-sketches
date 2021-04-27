const sketch_10 = {
    title: "City Buildings",

    date: "April 26, 2021",

    colors: {
        white: "#f7f7f2",
        green: "#aad1d0",
        sky: "#ccdde7",
        slate: "#bfcdd0",
        gray: "#9ba5ab",
        beige: "#d6d3cb",
        gold: "#d9c7ae",
        brown: "#686168",
    },

    inspiration: [
        "<h1>Inspiration</h1>",
        "<p></p>",
        "<h1>What's Random?</h1>",
        "<p>Size, color, and position.</p>",
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

        // --------------- Objects --------------- //
        // Array of colors
        const COLORS = Object.values(this.colors).splice(2);
        COLORS.splice(-1, 1); // Remove last color (for outline)
        const outline = Object.values(this.colors).splice(-1);
        const white = this.colors.white;

        // Thresholds
        const HEIGHT_SKY = 0.2 * height,
            HEIGHT_FLAT = 0.4 * height,
            MIN_BUILDING_HORIZONTAL = 10,
            MAX_BUILDING_HORIZONTAL = 40,
            MIN_BUILDING_VERTICAL = 5,
            MAX_BUILDING_VERTICAL = 15,
            MIN_CLOUD_LENGTH = 30,
            MAX_CLOUD_LENGTH = 80,
            CLOUD_RADIUS = 10;

        class Building {
            constructor() {
                // Position
                this.x = Math.random() * width;
                this.y = HEIGHT_SKY + Math.random() * (height - HEIGHT_SKY); // Building is below skyline

                // Color
                this.color = COLORS[Math.floor(Math.random() * COLORS.length)];

                // Roof and walls
                this.LRhorizontal = 0;
                this.LRvertical = 0;
                this.TDhorizontal = 0;
                this.TDvertical = 0;
                this.roof = "";
                this.leftWall = "";
                this.rightWall = "";
                this.makeRoofCoordinates();
                this.generateRoof();
                this.generalWall();
            }

            /**
             * Create points for roof
             */
            makeRoofCoordinates() {
                this.LRhorizontal =
                    MIN_BUILDING_HORIZONTAL +
                    Math.random() * MAX_BUILDING_HORIZONTAL;
                this.LRvertical =
                    this.y < HEIGHT_FLAT
                        ? 0
                        : Math.min(
                              MIN_BUILDING_VERTICAL +
                                  Math.random() * MAX_BUILDING_VERTICAL,
                              this.LRhorizontal
                          );
                this.TDhorizontal =
                    MIN_BUILDING_HORIZONTAL +
                    Math.random() * MAX_BUILDING_HORIZONTAL;
                this.TDvertical =
                    this.y < HEIGHT_FLAT
                        ? 0
                        : Math.min(
                              MIN_BUILDING_VERTICAL +
                                  Math.random() * MAX_BUILDING_VERTICAL,
                              this.TDhorizontal
                          );
            }

            /**
             * Create path for drawing roof
             */
            generateRoof() {
                this.roof = [
                    `M${-this.LRhorizontal}, ${this.LRvertical}`,
                    `L${this.TDhorizontal}, ${this.TDvertical}`,
                    `L${this.LRhorizontal}, ${-this.LRvertical}`,
                    `L${-this.TDhorizontal}, ${-this.TDvertical}`,
                    "Z",
                ].join(" ");
            }

            /**
             * Create path for drawing walls
             */
            generalWall() {
                let outerX = Math.max(this.LRhorizontal, this.TDhorizontal),
                    outerY =
                        Math.max(this.LRhorizontal, this.TDhorizontal) ===
                        this.LRhorizontal
                            ? this.LRvertical
                            : this.TDvertical,
                    side = this.LRhorizontal > this.TDhorizontal ? 1 : -1,
                    midX =
                        Math.min(this.LRhorizontal, this.TDhorizontal) * side,
                    midY =
                        side *
                            Math.min(this.LRhorizontal, this.TDhorizontal) ===
                        this.LRhorizontal
                            ? this.LRvertical
                            : this.TDvertical;

                this.leftWall = [
                    `M${-outerX}, ${side * outerY}`,
                    `L${midX}, ${side * midY}`,
                    `L${midX}, ${height}`,
                    `L${-outerX}, ${height}`,
                    "Z",
                ].join(" ");
                this.rightWall = [
                    `M${midX}, ${side * midY}`,
                    `L${outerX}, ${side * -outerY}`,
                    `L${outerX}, ${height}`,
                    `L${midX}, ${height}`,
                    "Z",
                ].join(" ");
            }

            /**
             * Draw on canvas
             */
            draw() {
                context.translate(this.x, this.y);

                let paths = [];
                paths.push(new Path2D(this.leftWall));
                paths.push(new Path2D(this.rightWall));
                paths.push(new Path2D(this.roof));

                for (let path of paths) {
                    // Color building
                    context.fillStyle = this.color;
                    context.fill(path);

                    // Outline building
                    context.lineWidth = 3;
                    context.strokeStyle = outline;
                    context.lineCap = "round";
                    context.lineJoin = "round";
                    context.stroke(path);
                }
                context.translate(-this.x, -this.y);
            }
        }

        class Cloud {
            constructor() {
                this.x = width * Math.random();
                this.y = height * Math.random();
                this.length =
                    MIN_CLOUD_LENGTH +
                    (MAX_CLOUD_LENGTH - MIN_CLOUD_LENGTH) * Math.random();
            }

            /**
             * Draw cloud on canvas
             */
            draw() {
                context.translate(this.x, this.y);
                context.beginPath();
                context.moveTo(CLOUD_RADIUS, 0);
                context.lineTo(this.length - CLOUD_RADIUS, 0);
                context.quadraticCurveTo(
                    this.length,
                    0,
                    this.length,
                    CLOUD_RADIUS
                );
                context.lineTo(this.length, CLOUD_RADIUS);
                context.quadraticCurveTo(
                    this.length,
                    2 * CLOUD_RADIUS,
                    this.length - CLOUD_RADIUS,
                    2 * CLOUD_RADIUS
                );
                context.lineTo(CLOUD_RADIUS, 2 * CLOUD_RADIUS);
                context.quadraticCurveTo(0, 2 * CLOUD_RADIUS, 0, CLOUD_RADIUS);
                context.lineTo(0, CLOUD_RADIUS);
                context.quadraticCurveTo(0, 0, CLOUD_RADIUS, 0);
                context.closePath();

                context.fillStyle = white;
                context.fill();
                context.translate(-this.x, -this.y);
            }
        }

        // --------------- Set Up Sketch --------------- //

        // Background color
        contextBackground.beginPath();
        contextBackground.rect(0, 0, width, height);
        contextBackground.fillStyle = this.colors.green;
        contextBackground.fill();

        // Draw clouds
        let clouds = [];
        for (let i = 0; i < 20; i++) {
            clouds.push(new Cloud());
        }
        for (let cloud of clouds) {
            cloud.draw();
        }

        // Draw buildings
        let buildings = [];
        for (let i = 0; i < 40; i++) {
            buildings.push(new Building());
        }
        buildings.sort((a, b) => (a.y > b.y ? 1 : -1));
        for (let building of buildings) {
            building.draw();
        }
    },
};

export default sketch_10;
