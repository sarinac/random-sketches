const sketch_07 = {
    title: "Animal Crossing",

    date: "April 6, 2021",

    colors: {
        green: "#5CAD69",
        gold: "#E8A025",
        tint: "#C2B361",
        pale: "#F9F5CA",
        red: "#A82A2A",
    },

    inspiration: [
        "<h1>Inspiration</h1>",
        "<p><a href='https://www.youtube.com/watch?v=UWzD1727wzw'>Animal Crossing</a> is so cute... but some things should really be drawn in Illustrator instead of coded in Javascript.</p>",
        "<h1>What's Random?</h1>",
        "<p>Colors, placement, house upgrade timing.</p>",
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

        // --------------- House --------------- //

        const COLORS = this.colors;
        const HEIGHT_BIG_HOUSE = 0.25 * height,
            HEIGHT_SMALL_HOUSE = 0.75 * HEIGHT_BIG_HOUSE,
            RATIO_ROOF_BASE_HOUSE = 0.7,
            RATIO_ROOF_BASE_TENT = 0.1,
            WIDTH_BASE_TENT = (0.9 * HEIGHT_BIG_HOUSE) / 2,
            WIDTH_BASE_HOUSE = (0.8 * HEIGHT_BIG_HOUSE) / 2,
            WIDTH_ROOF_HOUSE = 1.05 * WIDTH_BASE_HOUSE,
            WIDTH_EXTENSION = 0.2 * HEIGHT_BIG_HOUSE,
            WIDTH_DOOR = 0.5 * WIDTH_BASE_HOUSE,
            RADIUS_DOOR = 15,
            BOARDS = 5;

        class House {
            constructor() {
                // Position
                this.x = 0.1 * width + Math.random() * 0.8 * width;
                this.y = 0.2 * height + Math.random() * 0.8 * height;

                // Colors
                this.wallColor = COLORS.pale;
                this.frameColor = COLORS.gold;
                this.windowColor = COLORS.tint;
                let roofHex = Math.random();
                this.roofColor = d3.interpolateSpectral(roofHex);
                this.doorColor = d3.interpolateSpectral(
                    roofHex + 0.3 * (Math.random() - 0.5)
                );

                // House dimensions
                this.heightRoofTip = HEIGHT_SMALL_HOUSE;
                this.heightRoofBase = RATIO_ROOF_BASE_TENT * HEIGHT_SMALL_HOUSE;
                this.widthBase = WIDTH_BASE_TENT;
                this.widthRoof = WIDTH_BASE_TENT;

                // Leveling states
                this.tick = 0;
                this.level = 1;
                this.leveling = false;
                this.levelingRate = 2 + Math.random() * 5;
            }

            /**
             * Upgrade housing and update dimensions corresponding to level
             */
            levelStats() {
                // Level up
                if (this.tick > this.levelingRate && ~this.level < 5) {
                    this.level++; // Increase level
                    this.tick = 0; // Set as 0
                    this.leveling = true; // Set state
                }

                // Update animations
                if (this.tick <= 1 && this.leveling) {
                    if (this.level === 2) {
                        this.heightRoofBase =
                            HEIGHT_SMALL_HOUSE *
                            (RATIO_ROOF_BASE_TENT +
                                this.tick *
                                    (RATIO_ROOF_BASE_HOUSE -
                                        RATIO_ROOF_BASE_TENT));
                        this.widthBase =
                            WIDTH_BASE_TENT +
                            this.tick * (WIDTH_BASE_HOUSE - WIDTH_BASE_TENT);
                        this.widthRoof =
                            WIDTH_BASE_TENT +
                            this.tick * (WIDTH_ROOF_HOUSE - WIDTH_BASE_TENT);
                    } else if (this.level === 3) {
                        this.heightRoofTip =
                            HEIGHT_SMALL_HOUSE +
                            this.tick *
                                (0.5 * (HEIGHT_BIG_HOUSE - HEIGHT_SMALL_HOUSE));
                    } else if (this.level === 5) {
                        this.heightRoofTip =
                            0.5 * (HEIGHT_BIG_HOUSE + HEIGHT_SMALL_HOUSE) +
                            this.tick *
                                (HEIGHT_BIG_HOUSE -
                                    0.5 *
                                        (HEIGHT_BIG_HOUSE +
                                            HEIGHT_SMALL_HOUSE));
                        this.widthBase =
                            WIDTH_BASE_HOUSE +
                            this.tick * (WIDTH_ROOF_HOUSE - WIDTH_BASE_HOUSE);
                    }
                } else {
                    this.leveling = false;
                }
            }

            /**
             * Draw house on canvas
             */
            draw() {
                this.drawSide(true);
                this.drawSide(false);
                this.drawMain();
                this.tick = this.tick + 0.01;
                this.levelStats();
            }

            /**
             * Draw the left or right extension of house
             * @param {Boolean} left
             */
            drawSide(left) {
                if ((left && this.level >= 3) || (~left && this.level >= 4)) {
                    let d, path;
                    let side = left ? -1 : 1;
                    let ticks = this.tickElapsed();
                    let tick = left ? ticks["t23"] : ticks["t34"];

                    context.translate(
                        this.x + (tick - 1) * side * WIDTH_EXTENSION * 2,
                        this.y
                    );

                    // Roof
                    d = [
                        `M${
                            side * (this.widthRoof + WIDTH_EXTENSION + BOARDS)
                        },${-this.heightRoofBase}`,
                        `L${side * this.widthRoof},${-this.heightRoofBase}`,
                        `L${side * 0.3 * this.widthRoof},${
                            -this.heightRoofBase -
                            0.7 * (this.heightRoofTip - this.heightRoofBase)
                        }`,
                        `L${side * (this.widthRoof + WIDTH_EXTENSION)},${
                            -this.heightRoofBase -
                            0.75 * (this.heightRoofTip - this.heightRoofBase)
                        }`,
                        "Z",
                    ].join(" ");
                    path = new Path2D(d);
                    context.beginPath();
                    context.fillStyle = this.roofColor;
                    context.fill(path);
                    // Wall
                    d = [
                        `M${side * (this.widthBase + WIDTH_EXTENSION)},${0}`,
                        `L${side * this.widthBase},${0}`,
                        `L${side * this.widthRoof},${-this.heightRoofBase}`,
                        `L${side * (this.widthRoof + WIDTH_EXTENSION)},${-this
                            .heightRoofBase}`,
                        "Z",
                    ].join(" ");
                    path = new Path2D(d);
                    context.beginPath();
                    context.fillStyle = this.wallColor;
                    context.fill(path);
                    // Window Frame
                    d = [
                        `M${side * (this.widthBase + 0.8 * WIDTH_EXTENSION)},${
                            -0.4 * this.heightRoofBase
                        }`,
                        `L${side * (this.widthBase + 0.2 * WIDTH_EXTENSION)},${
                            -0.4 * this.heightRoofBase
                        }`,
                        `L${side * (this.widthRoof + 0.2 * WIDTH_EXTENSION)},${
                            -0.8 * this.heightRoofBase
                        }`,
                        `L${side * (this.widthRoof + 0.8 * WIDTH_EXTENSION)},${
                            -0.8 * this.heightRoofBase
                        }`,
                        "Z",
                    ].join(" ");
                    path = new Path2D(d);
                    context.beginPath();
                    context.fillStyle = this.frameColor;
                    context.fill(path);
                    // Window Interior
                    d = [
                        `M${side * (this.widthBase + 0.7 * WIDTH_EXTENSION)},${
                            -0.45 * this.heightRoofBase
                        }`,
                        `L${side * (this.widthBase + 0.3 * WIDTH_EXTENSION)},${
                            -0.45 * this.heightRoofBase
                        }`,
                        `L${side * (this.widthRoof + 0.3 * WIDTH_EXTENSION)},${
                            -0.75 * this.heightRoofBase
                        }`,
                        `L${side * (this.widthRoof + 0.7 * WIDTH_EXTENSION)},${
                            -0.75 * this.heightRoofBase
                        }`,
                        "Z",
                    ].join(" ");
                    path = new Path2D(d);
                    context.beginPath();
                    context.fillStyle = this.windowColor;
                    context.fill(path);
                    // Left side horizontal board
                    d = [
                        `M${
                            side *
                            (this.widthBase +
                                WIDTH_EXTENSION +
                                0.25 * (this.widthRoof - this.widthBase))
                        },${-0.25 * this.heightRoofBase}`,
                        `L${side * this.widthBase},${
                            -0.25 * this.heightRoofBase
                        }`,
                        `L${side * this.widthBase},${
                            -0.35 * this.heightRoofBase
                        }`,
                        `L${
                            side *
                            (this.widthBase +
                                WIDTH_EXTENSION +
                                0.35 * (this.widthRoof - this.widthBase))
                        },${-0.35 * this.heightRoofBase}`,
                        "Z",
                    ].join(" ");
                    path = new Path2D(d);
                    context.beginPath();
                    context.fillStyle = this.frameColor;
                    context.fill(path);
                    // Left side roof
                    d = [
                        `M${
                            side *
                            (this.widthRoof + WIDTH_EXTENSION + BOARDS / 2)
                        },${-this.heightRoofBase + BOARDS}`,
                        `L${side * this.widthRoof},${
                            -this.heightRoofBase + BOARDS
                        }`,
                        `L${side * this.widthRoof},${-this.heightRoofBase}`,
                        `L${
                            side *
                            (this.widthRoof + WIDTH_EXTENSION + BOARDS / 2)
                        },${-this.heightRoofBase}`,
                        "Z",
                    ].join(" ");
                    path = new Path2D(d);
                    context.beginPath();
                    context.fillStyle = this.frameColor;
                    context.fill(path);

                    context.translate(
                        -(this.x + (tick - 1) * side * WIDTH_EXTENSION * 2),
                        -this.y
                    );
                }
            }

            /**
             * Draw door
             * @param {number} t01
             * @param {number} t12
             */
            drawDoor(t01, t12) {
                let d, path;

                // Body
                let arcRight =
                    this.level > 1
                        ? `A${t12 * RADIUS_DOOR} ${t12 * RADIUS_DOOR} 0 0 0 ${
                              WIDTH_DOOR - t12 * RADIUS_DOOR
                          } ${-this.heightRoofBase}`
                        : "";
                let arcLeft =
                    this.level > 1
                        ? `A${t12 * RADIUS_DOOR} ${
                              t12 * RADIUS_DOOR
                          } 0 0 0 ${-WIDTH_DOOR} ${
                              -this.heightRoofBase + t12 * RADIUS_DOOR
                          }`
                        : "";
                d = [
                    `M${-Math.pow(t01, 3) * WIDTH_DOOR} ${0}`,
                    `L${Math.pow(t01, 3) * WIDTH_DOOR} ${0}`,
                    `L${Math.pow(t01, 3) * WIDTH_DOOR} ${
                        Math.pow(t01, 3) * -this.heightRoofBase +
                        t12 * RADIUS_DOOR
                    }`,
                    arcRight,
                    `L${-Math.pow(t01, 3) * WIDTH_DOOR + t12 * RADIUS_DOOR} ${
                        Math.pow(t01, 3) * -this.heightRoofBase
                    }`,
                    arcLeft,
                    "Z",
                ].join(" ");
                path = new Path2D(d);
                context.beginPath();
                context.fillStyle = this.doorColor;
                context.fill(path);

                // Knob
                if (this.level > 1) {
                    context.beginPath();
                    context.arc(
                        -WIDTH_DOOR + 8,
                        -0.4 * this.heightRoofBase,
                        4,
                        0,
                        2 * Math.PI
                    );
                    context.fillStyle = this.frameColor;
                    context.fill();
                }
            }

            /**
             * Draw window
             * @param {number} t45
             * @returns
             */
            drawMainWindow(t45) {
                // WINDOW (Frame)
                context.beginPath();
                context.rect(
                    t45 * (-0.8 * WIDTH_DOOR),
                    -this.heightRoofBase + t45 * (-1.2 * WIDTH_DOOR - BOARDS),
                    t45 * (1.6 * WIDTH_DOOR),
                    t45 * (0.8 * 1.4 * WIDTH_DOOR)
                );
                context.fillStyle = this.frameColor;
                context.fill();
                // WINDOW (Top window)
                context.beginPath();
                context.rect(
                    t45 * (-0.6 * WIDTH_DOOR),
                    -this.heightRoofBase + t45 * (-WIDTH_DOOR - BOARDS),
                    t45 * (1.2 * WIDTH_DOOR),
                    t45 * (0.8 * WIDTH_DOOR)
                );
                context.fillStyle = this.windowColor;
                context.fill();
                // WINDOW (Top window cross vertical)
                context.beginPath();
                context.rect(
                    t45 * (-0.05 * WIDTH_DOOR),
                    -this.heightRoofBase + t45 * (-WIDTH_DOOR - BOARDS),
                    t45 * (0.1 * WIDTH_DOOR),
                    t45 * (0.8 * WIDTH_DOOR)
                );
                context.fillStyle = this.frameColor;
                context.fill();
                // WINDOW (Top window cross horizontal)
                context.beginPath();
                context.rect(
                    t45 * (-0.6 * WIDTH_DOOR),
                    -this.heightRoofBase + t45 * (-0.8 * WIDTH_DOOR),
                    t45 * (1.2 * WIDTH_DOOR),
                    t45 * (0.1 * WIDTH_DOOR)
                );
                context.fillStyle = this.frameColor;
                context.fill();
            }

            /**
             * Draw frames
             * @param {number} t12
             * @param {number} t23
             */
            drawMainFrames(t12, t23) {
                let d, path;
                let dArray = [];
                // FRAMES (Roof)
                d = [
                    `M${-this.widthRoof},${-t12 * this.heightRoofBase}`,
                    `l${0},${t12 * BOARDS}`, // Down
                    `L${0},${t12 * (-this.heightRoofTip + BOARDS)}`,
                    `L${this.widthRoof},${
                        t12 * (-this.heightRoofBase + BOARDS)
                    }`,
                    `l${0},${-t12 * BOARDS}`, // Up
                    `L${0},${-t12 * this.heightRoofTip}`,
                    "Z",
                ].join(" ");
                dArray.push(d);

                // FRAMES (Door)
                d = [
                    `M${t12 * (-WIDTH_DOOR - BOARDS)} ${0}`,
                    `L${t12 * (WIDTH_DOOR + BOARDS)} ${0}`,
                    `L${t12 * (WIDTH_DOOR + BOARDS)} ${
                        t12 * (-this.heightRoofBase + RADIUS_DOOR - BOARDS)
                    }`,
                    `A${t12 * (RADIUS_DOOR + BOARDS)} ${
                        t12 * (RADIUS_DOOR + BOARDS)
                    } 0 0 0 ${t12 * (WIDTH_DOOR - RADIUS_DOOR)} ${
                        t12 * (-this.heightRoofBase - BOARDS)
                    }`,
                    `L${t12 * (-WIDTH_DOOR + RADIUS_DOOR - BOARDS)} ${
                        t12 * (-this.heightRoofBase - BOARDS)
                    }`,
                    `A${t12 * (RADIUS_DOOR + BOARDS)} ${
                        t12 * (RADIUS_DOOR + BOARDS)
                    } 0 0 0 ${t12 * (-WIDTH_DOOR - BOARDS)} ${
                        t12 * (-this.heightRoofBase + RADIUS_DOOR)
                    }`,
                    "Z",
                ].join(" ");
                dArray.push(d);

                // Bottom horizontal board (Expand horizontally)
                d = [
                    `M${
                        t23 *
                        (-this.widthBase -
                            0.2 * (this.widthRoof - this.widthBase))
                    },${-0.2 * this.heightRoofBase}`,
                    `L${
                        t23 *
                        (this.widthBase +
                            0.2 * (this.widthRoof - this.widthBase))
                    },${-0.2 * this.heightRoofBase}`,
                    `L${
                        t23 *
                        (this.widthBase +
                            0.2 * (this.widthRoof - this.widthBase))
                    },${-0.3 * this.heightRoofBase}`,
                    `L${
                        t23 *
                        (-this.widthBase -
                            0.2 * (this.widthRoof - this.widthBase))
                    },${-0.3 * this.heightRoofBase}`,
                    "Z",
                ].join(" ");
                dArray.push(d);
                // Top horizontal board (Expand horizontally)
                d = [
                    `M${t23 * (-0.85 * this.widthRoof)},${
                        -1.05 * this.heightRoofBase
                    }`,
                    `L${t23 * (0.85 * this.widthRoof)},${
                        -1.05 * this.heightRoofBase
                    }`,
                    `L${t23 * (0.75 * this.widthRoof)},${
                        -1.15 * this.heightRoofBase
                    }`,
                    `L${t23 * (-0.75 * this.widthRoof)},${
                        -1.15 * this.heightRoofBase
                    }`,
                    "Z",
                ].join(" ");
                dArray.push(d);
                // Left vertical board (Expand horizontally)
                d = [
                    `M${-this.widthBase},${0}`,
                    `L${-this.widthBase + t23 * BOARDS},${0}`,
                    `L${-this.widthRoof + t23 * BOARDS},${-this
                        .heightRoofBase}`,
                    `L${-this.widthRoof},${-this.heightRoofBase}`,
                    "Z",
                ].join(" ");
                dArray.push(d);
                // Right vertical board (Expand horizontally)
                d = [
                    `M${this.widthBase},${0}`,
                    `L${this.widthBase - t23 * BOARDS},${0}`,
                    `L${this.widthRoof - t23 * BOARDS},${-this.heightRoofBase}`,
                    `L${this.widthRoof},${-this.heightRoofBase}`,
                    "Z",
                ].join(" ");
                dArray.push(d);

                // Draw
                for (d of dArray) {
                    path = new Path2D(d);
                    context.beginPath();
                    context.fillStyle = this.frameColor;
                    context.fill(path);
                }
            }

            /**
             * Draw main section of house
             */
            drawMain() {
                let d, path;
                let ticks = this.tickElapsed();
                let t01 = ticks["t01"],
                    t12 = ticks["t12"],
                    t23 = ticks["t23"],
                    t45 = ticks["t45"];

                context.translate(this.x, this.y);

                // ROOF (pentagon)
                d = [
                    `M${-t01 * this.widthRoof},${-t12 * this.heightRoofBase}`,
                    `L${t01 * this.widthRoof},${-t12 * this.heightRoofBase}`,
                    `L${t01 * this.widthRoof},${
                        -t01 * this.heightRoofBase - t12 * (2 * BOARDS)
                    }`,
                    `L${0},${-t01 * this.heightRoofTip - t12 * (2 * BOARDS)}`,
                    `L${-t01 * this.widthRoof},${
                        -t01 * this.heightRoofBase - t12 * (2 * BOARDS)
                    }`,
                    "Z",
                ].join(" ");
                path = new Path2D(d);
                context.beginPath();
                context.fillStyle = this.roofColor;
                context.fill(path);

                // WALL
                d = [
                    `M${-this.widthBase},${0}`,
                    `L${this.widthBase},${0}`,
                    `L${this.widthRoof},${-t12 * this.heightRoofBase}`,
                    `L${0},${-t12 * this.heightRoofTip}`,
                    `L${-this.widthRoof},${-t12 * this.heightRoofBase}`,
                    "Z",
                ].join(" ");
                path = new Path2D(d);
                context.beginPath();
                context.fillStyle = this.wallColor;
                context.fill(path);

                // WINDOW
                this.drawMainWindow(t45);

                // FRAMES
                this.drawMainFrames(t12, t23);

                // DOOR
                this.drawDoor(t01, t12);

                context.translate(-this.x, -this.y);
            }

            /**
             * Calculates ticks for each stage
             * @param {number} t between 0 and 1
             * @returns {Object} with t for each stage
             */
            tickElapsed() {
                return {
                    t01:
                        this.level >= 2
                            ? 1
                            : this.level === 1
                            ? Math.min(this.tick, 1)
                            : 0,
                    t12:
                        this.level >= 3
                            ? 1
                            : this.level === 2
                            ? Math.min(this.tick, 1)
                            : 0,
                    t23:
                        this.level >= 4
                            ? 1
                            : this.level === 3
                            ? Math.min(this.tick, 1)
                            : 0,
                    t34:
                        this.level >= 5
                            ? 1
                            : this.level === 4
                            ? Math.min(this.tick, 1)
                            : 0,
                    t45:
                        this.level >= 6
                            ? 1
                            : this.level === 5
                            ? Math.min(this.tick, 1)
                            : 0,
                };
            }
        }

        // --------------- Draw --------------- //

        // Background color
        contextBackground.beginPath();
        contextBackground.rect(0, 0, width, height);
        contextBackground.fillStyle = this.colors.green;
        contextBackground.fill();
        let tick = 0;
        let house;
        let houses = [];

        setInterval(function () {
            if (tick % 300 === 0) {
                houses.push(new House());
            }

            // Sort houses by proximity
            houses.sort((a, b) => (a.y > b.y ? 1 : -1));
            // Clear
            context.clearRect(0, 0, width, height);

            // Draw
            for (house of houses) {
                house.draw();
            }
            tick++;
        }, 1000 / 60); // 60 FPS
    },
};

export default sketch_07;
