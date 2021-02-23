const sketch_02 = {
    title: "Bloom",

    date: "February 22, 2021",

    colors: {
        white: "#f9f9f9",
        pink: "#d398ba",
        gray: "#828282",
    },

    inspiration: [
        "<h1>Inspiration</h1>",
        "<p>I found the flower design from <a href='https://support.apple.com/lv-lv/guide/motion/motn14747e9e/5.4.6/mac/10.14.6'>Apple's support page</a> which I unintentionally stumbled upon when searching for Canvas tutorials.</p>",
        "<h1>What's Random?</h1>",
        "<p>Number of petals, size of each petal, angle of each petal, angle of flower, starting position, and number of starting flowers.</p>",
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

        // --------------- Flower --------------- //

        const PETAL_LENGTH_MIN = 50,
            PETAL_LENGTH_MAX = Math.min(70, 0.15 * height),
            PETAL_WIDTH = Math.min(30, 0.07 * height),
            MAX_ANGLE = (70 * Math.PI) / 180,
            PETAL_LENGTHS = [0.9, 0.8],
            MAX_TILT = (30 * Math.PI) / 180;

        class Flower {
            constructor(fx, fy) {
                let length =
                    PETAL_LENGTH_MIN +
                    Math.round(PETAL_LENGTH_MAX * Math.random());
                this.petalLength = length;
                this.petalHandle = length / 2;
                this.petalWidth = PETAL_WIDTH;
                this.flowerTilt =
                    -MAX_TILT + Math.random() * (2 * MAX_TILT) + Math.PI;
                this.fx = fx || width * (0.1 + 0.8 * Math.random());
                this.fy = fy || height * (0.4 + 0.6 * Math.random());

                // Create a range for petals
                let petals = [],
                    numPetals = 4 + Math.round(6 * Math.random()),
                    angle = MAX_ANGLE * (0.6 + 0.4 * Math.random());
                for (let i = 0; i < numPetals; i++) {
                    let length =
                        i === numPetals - 1 || i === 0
                            ? 1
                            : PETAL_LENGTHS[
                                  Math.floor(
                                      Math.random() * PETAL_LENGTHS.length
                                  )
                              ];
                    petals.push({
                        index: i,
                        angle:
                            i === numPetals - 1
                                ? angle
                                : 0.9 * angle * Math.random(),
                        d: [
                            "M0,0",
                            `C0,0 ${this.petalWidth},${
                                (this.petalLength / 2) * length
                            }  0,${this.petalLength * length}`,
                            `C0,${this.petalLength * length} ${-this
                                .petalWidth},${
                                (this.petalLength / 2) * length
                            } 0,0`,
                            "Z",
                        ].join(" "),
                    });
                }
                this.petals = petals;
            }
        }

        // --------------- Draw Functions --------------- //

        /**
         * Draws individual petals
         * @param {Flower} flower
         */
        let drawPetals = (flower) => {
            let petal;
            for (petal of flower.petals) {
                let path = new Path2D(petal.d);
                if (petal.index === 0) {
                    context.beginPath();
                    context.fillStyle = this.colors.pink;
                    context.fill(path);
                } else {
                    let direction;
                    for (direction of [1, -1]) {
                        context.rotate(-1 * direction * petal.angle);
                        context.beginPath();
                        context.fillStyle = this.colors.pink;
                        context.fill(path);
                        context.rotate(direction * petal.angle);
                    }
                }
            }
        };

        /**
         * Draws the stem
         * @param {Flower} flower
         */
        let drawStem = (flower) => {
            let d = [
                `M${flower.fx},${flower.fy}`,
                `Q${flower.fx},${1.2 * height} ${width / 2},${2 * height}`,
            ].join(" ");

            let path = new Path2D(d);
            context.beginPath();
            context.strokeStyle = this.colors.pink;
            context.lineWidth = 5;
            context.lineCap = "round";
            context.stroke(path);
        };

        /**
         * Calls drawStem and drawPetals
         * @param {Flower} flower
         */
        let drawFlower = (flower) => {
            // Draw stem
            context.globalAlpha = 0.2;
            drawStem(flower);

            // Draw petals
            context.globalAlpha = 0.35;
            context.translate(flower.fx, flower.fy);
            context.rotate(flower.flowerTilt);
            drawPetals(flower);
            context.rotate(-flower.flowerTilt);
            context.translate(-flower.fx, -flower.fy);
        };

        // --------------- Set Up Sketch --------------- //

        // Background color
        contextBackground.beginPath();
        contextBackground.rect(0, 0, width, height);
        contextBackground.fillStyle = this.colors.white;
        contextBackground.fill();

        // Initial flowers
        let STARTING_FLOWERS = 5 + 5 * Math.random();
        let flowers = [];
        for (let i = 0; i < STARTING_FLOWERS; i++) {
            flowers.push(new Flower());
        }

        // --------------- Set Up Simulation --------------- //

        let start = true;
        let simulation = d3
            .forceSimulation(flowers)
            .alphaMin(0.9)
            .force(
                "collide",
                d3.forceCollide().radius((d) => d.petalLength)
            )
            .force(
                "x",
                d3.forceX().x((d) => d.fx)
            )
            .force(
                "y",
                d3.forceY().y((d) => d.fy)
            )
            .on("tick", () => {
                // Clear Canvas
                context.clearRect(0, 0, width, height);

                // Draw flowers
                flowers.forEach((d) => {
                    d.fx = Math.min(Math.max(d.x, 0.1 * width), 0.9 * width);
                    d.fy = Math.min(Math.max(d.y, 0.4 * height), 0.9 * height);
                    drawFlower(d);
                });

                // Remove fixed positions
                if (start) {
                    flowers.forEach((d) => {
                        d.fx = null;
                        d.fy = null;
                    });
                    start = false;
                }

                // Add text
                context.globalAlpha = 1;
                context.fillStyle = this.colors.gray;
                context.textAlign = "center";
                context.font = `${0.03 * height}px Verdana`;
                context.fillText(
                    "Click to add flowers.",
                    width / 2,
                    0.1 * height
                );
            });

        // Get cursor position
        let getCursorPosition = (canvas, event) => {
            const rect = canvas.node().getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            drawFlower(new Flower(x, y));
        };

        // Add click event that draws flowers where your cursor is
        canvas.node().addEventListener("mousedown", function (e) {
            getCursorPosition(canvas, e);
        });
    },
};

export default sketch_02;
