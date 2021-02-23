const sketch_01 = {
    title: "Lantern Festival",

    date: "February 18, 2021",

    inspiration: [
        "<h1>Inspiration</h1>",
        "<p>This is my first experiment in drawing with <a href='https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API'>Canvas</a> instead of SVG. Design came from my <a href='https://chinesenewyear.ifcolorful.com'>Chinese New Year Greetings</a> visualization.</p>",
        "<h1>What's Random?</h1>",
        "Lantern shape, height, has fuzz, has tassel, tassel color, and tassel length."
    ],

    colors: {
        gold: "#F1BF77",
        red: "#EF1635",
        darkRed: "#b61c1c",
        shadow: "#822926",
        black: "#333333",
    },

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

        // --------------- Lantern --------------- //

        class Lantern {
            constructor(colors) {
                this.bodyHeight = Math.random() < 0.5 ? 1 : 2;
                this.isRoundBody = Math.random() < 0.5;
                this.hasFuzz = Math.random() < 0.7;
                this.hasTassel = Math.random() < 0.7;
                this.tasselColor =
                    Math.random() < 0.5 ? colors.gold : colors.red;
                this.tasselLength = Math.random() < 0.5 ? 1 : 2;
            }
        }

        // --------------- Draw Functions --------------- //
        /**
         * Determines lantern body height
         * @param {number} Lantern.bodyHeight
         * @return {number} y
         */
        let lanternBodyHeight = (i) => 30 + 25 * i;

        // Constants
        let Y_POSITION = 0.6 * height,
            CORD_WIDTH = 6,
            STRING_HEIGHT = 20,
            FUZZ_HEIGHT = 15,
            FUZZ_TOP_WIDTH = 10,
            FUZZ_BOTTOM_WIDTH = 35,
            TASSEL_BEAD_RADIUS = 6,
            TASSEL_RADIUS = 4,
            TASSEL_TOP_WIDTH = 5,
            TASSEL_BOTTOM_WIDTH = 18,
            MIN_TASSEL_HEIGHT = 20,
            BODY_CAP_HEIGHT = 10,
            BODY_WIDTH = 50,
            BUFFER = 100,
            SHADOW_DISTANCE = 15;

        /**
         * Draws cord (behind the lantern)
         * @param {Lantern} lantern
         * @param {boolean} isShadow
         */
        let drawCord = (lantern, isShadow) => {
            context.beginPath();
            context.rect(
                -CORD_WIDTH / 2,
                -BUFFER,
                CORD_WIDTH,
                BUFFER +
                    Y_POSITION -
                    (lantern.hasTassel ? 0 : STRING_HEIGHT) -
                    (lantern.hasFuzz || lantern.hasTassel ? 0 : STRING_HEIGHT)
            );
            context.fillStyle = isShadow ? this.colors.shadow : this.colors.red;
            context.fill();
        };

        /**
         * Draw fuzz (below the lantern)
         * @param {Lantern} lantern
         * @param {boolean} isShadow
         */
        let drawFuzz = (lantern, isShadow) => {
            if (!lantern.hasFuzz) {
                return;
            }
            let d = [
                `M${-FUZZ_TOP_WIDTH},${
                    Y_POSITION - STRING_HEIGHT - FUZZ_HEIGHT
                } `,
                `l${FUZZ_TOP_WIDTH * 2},0 `,
                `l${FUZZ_BOTTOM_WIDTH / 2 - FUZZ_TOP_WIDTH},${FUZZ_HEIGHT} `,
                `a${TASSEL_RADIUS},${TASSEL_RADIUS},0,0,1,${-TASSEL_RADIUS},${TASSEL_RADIUS} `,
                `a${FUZZ_BOTTOM_WIDTH / 2 + TASSEL_RADIUS},${
                    FUZZ_BOTTOM_WIDTH / 4
                },0,0,1,${-FUZZ_BOTTOM_WIDTH + 2 * TASSEL_RADIUS},${0} `,
                `a${TASSEL_RADIUS},${TASSEL_RADIUS},0,0,1,${-TASSEL_RADIUS},${-TASSEL_RADIUS} `,
                `l${FUZZ_BOTTOM_WIDTH / 2 - FUZZ_TOP_WIDTH},${-FUZZ_HEIGHT} `,
                "Z",
            ].join(" ");

            let path = new Path2D(d);
            context.beginPath();
            context.fillStyle = isShadow
                ? this.colors.shadow
                : this.colors.gold;
            context.fill(path);
        };

        /**
         * Draw tassel (below the lantern)
         * @param {Lantern} lantern
         * @param {boolean} isShadow
         */
        let drawTassel = (lantern, isShadow) => {
            if (!lantern.hasTassel) {
                return;
            }

            // Draw bead
            context.beginPath();
            context.arc(
                0,
                Y_POSITION,
                TASSEL_BEAD_RADIUS,
                0,
                2 * Math.PI,
                false
            );
            context.fillStyle = isShadow
                ? this.colors.shadow
                : this.colors.gold;
            context.fill();

            // Draw tassel
            let d = [
                `M${-TASSEL_TOP_WIDTH},${Y_POSITION + 1.6 * TASSEL_TOP_WIDTH} `,
                `l${2 * TASSEL_TOP_WIDTH},0 `,
                `l${TASSEL_BOTTOM_WIDTH / 2 - TASSEL_TOP_WIDTH},${
                    lantern.tasselLength * MIN_TASSEL_HEIGHT
                } `,
                `a${TASSEL_RADIUS},${TASSEL_RADIUS},0,0,1,${-TASSEL_RADIUS},${TASSEL_RADIUS} `,
                `a${TASSEL_BOTTOM_WIDTH / 2 + TASSEL_RADIUS},${
                    TASSEL_BOTTOM_WIDTH / 2
                },0,0,1,${-TASSEL_BOTTOM_WIDTH + 2 * TASSEL_RADIUS},${0} `,
                `a${TASSEL_RADIUS},${TASSEL_RADIUS},0,0,1,${-TASSEL_RADIUS},${-TASSEL_RADIUS} `,
                `l${TASSEL_BOTTOM_WIDTH / 2 - TASSEL_TOP_WIDTH},${
                    -lantern.tasselLength * MIN_TASSEL_HEIGHT
                } `,
                "Z",
            ].join(" ");
            let path = new Path2D(d);
            context.beginPath();
            context.fillStyle = isShadow
                ? this.colors.shadow
                : lantern.tasselColor;
            context.fill(path);

            // Draw band
            context.beginPath();
            context.rect(
                -TASSEL_TOP_WIDTH,
                Y_POSITION + 0.75 * TASSEL_TOP_WIDTH,
                2 * TASSEL_TOP_WIDTH,
                TASSEL_TOP_WIDTH
            );
            context.fillStyle = isShadow
                ? this.colors.shadow
                : this.colors.black;
            context.fill();
        };

        /**
         * Draw body (on the lantern)
         * @param {Lantern} lantern
         * @param {boolean} isShadow
         */
        let drawBody = (lantern, isShadow) => {
            let drawSides = (direction) => {
                let path = [];
                let forward = direction === "down" ? 1 : -1;
                if (lantern.isRoundBody) {
                    // Round
                    let radius =
                            lanternBodyHeight(lantern.bodyHeight) /
                            lantern.bodyHeight /
                            2,
                        radiusHalf = radius / 2;
                    path.push(
                        `a${radiusHalf},${radius} 0 0 1 ${
                            forward * radiusHalf
                        } ${forward * radius}`
                    );
                    path.push(
                        `l0,${
                            forward *
                            (lanternBodyHeight(lantern.bodyHeight) - radius * 2)
                        }`
                    );
                    path.push(
                        `a${radiusHalf},${radius} 0,0,1 ${
                            -forward * radiusHalf
                        },${forward * radius}`
                    );
                } else {
                    // Squiggly
                    let radius =
                        lanternBodyHeight(lantern.bodyHeight) /
                        lantern.bodyHeight /
                        16;
                    let forwardFull = forward * radius,
                        forwardHalf = forwardFull / 2,
                        backwardHalf = -forwardHalf;
                    let squiggly = [
                        `c ${0},${forwardHalf / 2} ${
                            backwardHalf / 2
                        },${forwardFull} ${backwardHalf},${forwardFull} `,
                        `s ${backwardHalf},${
                            forwardFull / 2
                        } ${backwardHalf},${forwardFull} `,
                        `s ${
                            forwardHalf / 2
                        },${forwardFull} ${forwardHalf},${forwardFull} `,
                        `s ${forwardHalf},${
                            forwardFull / 2
                        } ${forwardHalf},${forwardFull} `,
                    ].join(" ");
                    for (let i = 0; i < 4 * lantern.bodyHeight; i++) {
                        path.push(squiggly);
                    }
                }
                return path.join(" ");
            };

            let rounded_rect = (x, y, w, h, r, tl, tr, bl, br) => {
                var topright = tr
                        ? `a${r},${r} 0 0 1 ${r},${r}`
                        : `h${r} v${r}`,
                    bottomright = br
                        ? `a${r},${r} 0 0 1 ${-r},${r}`
                        : `v${r} h${-r}`,
                    bottomleft = bl
                        ? `a${r},${r} 0 0 1 ${-r},${-r}`
                        : `h${-r} v${-r}`,
                    topleft = tl
                        ? `a${r},${r} 0 0 1 ${r},${-r}`
                        : `v${-r} h${r}`;
                return [
                    `M${x + r},${y}`,
                    `h${w - 2 * r}`,
                    topright,
                    `v${h - 2 * r}`,
                    bottomright,
                    `h${2 * r - w}`,
                    bottomleft,
                    `v${2 * r - h}`,
                    topleft,
                    "z",
                ].join(" ");
            };

            // Draw top cap
            let d = rounded_rect(
                -BODY_WIDTH / 2,
                Y_POSITION -
                    STRING_HEIGHT -
                    FUZZ_HEIGHT -
                    lanternBodyHeight(lantern.bodyHeight) -
                    BODY_CAP_HEIGHT,
                BODY_WIDTH,
                BODY_CAP_HEIGHT,
                0.5 * BODY_CAP_HEIGHT,
                true,
                true,
                false,
                false
            );
            let path = new Path2D(d);
            context.beginPath();
            context.fillStyle = isShadow
                ? this.colors.shadow
                : this.colors.black;
            context.fill(path);

            // Draw bottom cap
            d = rounded_rect(
                -BODY_WIDTH / 2,
                Y_POSITION - STRING_HEIGHT - FUZZ_HEIGHT,
                BODY_WIDTH,
                BODY_CAP_HEIGHT,
                BODY_CAP_HEIGHT * 0.25,
                false,
                false,
                true,
                true
            );
            path = new Path2D(d);
            context.beginPath();
            context.fillStyle = isShadow
                ? this.colors.shadow
                : this.colors.black;
            context.fill(path);

            // Draw body
            let lanternWidth = lantern.isRoundBody
                ? BODY_WIDTH
                : 1.3 * BODY_WIDTH;

            d = [
                `M${-lanternWidth / 2}, ${
                    Y_POSITION -
                    STRING_HEIGHT -
                    FUZZ_HEIGHT -
                    lanternBodyHeight(lantern.bodyHeight)
                }`,
                `l${lanternWidth}, 0`,
                drawSides("down"),
                `l${-lanternWidth}, 0`,
                drawSides("up"),
                "Z",
            ].join(" ");
            path = new Path2D(d);
            context.beginPath();
            context.fillStyle = isShadow ? this.colors.shadow : this.colors.red;
            context.fill(path);

            // // Draw text
            // context.font = "60px Zhi Mang Xing";
            // context.textAlign = "center";
            // context.textBaseline = "middle";
            // context.fillStyle = isShadow
            //     ? this.colors.shadow
            //     : this.colors.gold;
            // context.fillText(
            //     "福",
            //     0,
            //     Y_POSITION -
            //         STRING_HEIGHT -
            //         FUZZ_HEIGHT -
            //         lanternBodyHeight(lantern.bodyHeight) / 2
            // );
        };

        // --------------- Set Up Sketch --------------- //

        // Background color
        contextBackground.beginPath();
        contextBackground.rect(0, 0, width, height);
        contextBackground.fillStyle = this.colors.darkRed;
        contextBackground.fill();

        // Constants
        const AMPLITUDE = 0.15 * height,
            PERIOD = (5 / 7) * width,
            SHIFT_INCREMENT = 0.3 * width,
            DISTANCE = 3 * BODY_WIDTH;

        /**
         * Create a new lantern
         * @param {number} x
         */
        const createLantern = (x) => {
            SHIFT = (SHIFT + SHIFT_INCREMENT) % PERIOD;
            let s = SHIFT;
            lanterns.unshift({
                lantern: new Lantern(this.colors),
                x: x,
                y: (x) =>
                    AMPLITUDE * Math.sin(((2 * Math.PI) / PERIOD) * (x - s)),
            });
        };

        // Initial lanterns
        let SHIFT = 0;
        let lanterns = [];
        for (
            let i = -BODY_WIDTH / 2 + DISTANCE * Math.floor(width / DISTANCE);
            i > -BODY_WIDTH / 2;
            i -= DISTANCE
        ) {
            createLantern(i);
        }

        // --------------- Run Frames --------------- //

        function step(timestamp) {
            // Clear Canvas
            context.clearRect(0, 0, width, height);

            // Add new lantern
            let obj;
            if (lanterns[0].x > DISTANCE) {
                createLantern(-BODY_WIDTH / 2 - SHADOW_DISTANCE);
            }

            for (obj of lanterns) {
                let isShadow;

                context.translate(obj.x, obj.y(obj.x));
                for (isShadow of [true, false]) {
                    context.translate(
                        isShadow ? SHADOW_DISTANCE : 0,
                        isShadow ? SHADOW_DISTANCE : 0
                    );
                    drawCord(obj.lantern, isShadow);
                    drawFuzz(obj.lantern, isShadow);
                    drawTassel(obj.lantern, isShadow);
                    drawBody(obj.lantern, isShadow);
                    context.translate(
                        isShadow ? -SHADOW_DISTANCE : 0,
                        isShadow ? -SHADOW_DISTANCE : 0
                    );
                }
                context.translate(-obj.x, -obj.y(obj.x));
                obj.x += 1;
            }

            // Remove last lantern when off screen
            if (lanterns[lanterns.length - 1].x > width + BODY_WIDTH / 2) {
                lanterns.pop();
            }

            // Loop forever
            window.requestAnimationFrame(step);
        }
        window.requestAnimationFrame(step);
    },
};

export default sketch_01;
