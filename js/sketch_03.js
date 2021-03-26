const sketch_03 = {
    title: "Fractals",

    date: "March 24, 2021",

    colors: {
        orange: "#FCA579",
        purple: "#6062FC",
        black: "#000000",
    },

    inspiration: [
        "<h1>Inspiration</h1>",
        "<p><a href='http://rectangleworld.com/blog/archives/538'>Rectangle World</a> has a genius post and code on fractals. I spent a whole afternoon reading the code, realizing that the creator, <a href='https://dangries.com/art.html'>Dan Gries</a>, does even more amazing generative art. I recreated his work for fun. :)</p>",
        "<h1>What's Random?</h1>",
        "<p>Shape of curve.</p>",
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

        // --------------- Shape Functions --------------- //

        const ITERATIONS = 9,
            RADIUS = 0.2 * height,
            NUM_CIRCLES = (2 * width) / RADIUS,
            TWIST_AMOUNT = 0.67 * 2 * Math.PI,
            RADIUS_BUFFER = 0.4 * RADIUS;

        /**
         * Generates an array of randomized and normalized y values for each iteration
         * @returns {Array} length: ITERATIONS
         */
        function setLinePoints() {
            // Keep track of min and max values generated
            let minY = 1,
                maxY = 1;

            // Set up linked list {x, y, next}
            let pointList = {};
            pointList.first = { x: 0, y: 1 }; // first
            pointList.first.next = { x: 1, y: 1 }; // last (is first.next)

            // Add points in a linked list
            // - First and last values are fixed
            // - New values are added right before the last
            for (let i = 0; i < ITERATIONS; i++) {
                let current = pointList.first;
                while (current.next != null) {
                    // Interpolate new X and Y
                    let newX = 0.5 * (current.x + current.next.x);
                    let newY = 0.5 * (current.y + current.next.y);
                    newY +=
                        (current.next.x - current.x) * (Math.random() * 2 - 1);

                    // Update the min and max
                    if (newY < minY) {
                        minY = newY;
                    } else if (newY > maxY) {
                        maxY = newY;
                    }

                    // Put new point before the next, join after current
                    let next = current.next;
                    current.next = { x: newX, y: newY, next: next };
                    // Go to next
                    current = next;
                }
            }

            // Normalize to values between 0 and 1 and store y values in array
            let pointArray = [];
            let current = pointList.first;
            while (current != null) {
                // Normalize y value
                current.y =
                    maxY != minY ? (1 / (maxY - minY)) * (current.y - minY) : 1;
                // Store in array
                pointArray.push(current.y);
                // Move to next
                current = current.next;
            }

            return pointArray;
        }

        /**
         * Generates circle cross-sections spanning across x-axis
         * @returns {Array} length: NUM_CIRCLES
         */
        function setCircles() {
            let circles = [];
            for (let i = 0; i < NUM_CIRCLES + 1; i++) {
                let newCircle = {
                    centerX:
                        -2 * RADIUS + (i / NUM_CIRCLES) * (width + 6 * RADIUS),
                    centerY: height / 2,
                    radius: RADIUS - Math.random() * RADIUS_BUFFER,
                    phase: (i / NUM_CIRCLES) * TWIST_AMOUNT,
                    pointArray: setLinePoints(),
                };
                circles.push(newCircle);
            }
            return circles;
        }

        // --------------- Color Functions --------------- //

        const ALPHA = 0.15;

        /**
         * Converts hex code to RGB object
         * @param {string} hex
         * @returns {object} R, G, B values
         */
        function hexToRgb(hex) {
            let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result
                ? {
                      r: parseInt(result[1], 16),
                      g: parseInt(result[2], 16),
                      b: parseInt(result[3], 16),
                  }
                : null;
        }

        /**
         * Generates array for RGBA colors based on a randomized y value
         * @returns {Array} length: ITERATIONS
         */
        function setColorList(colors) {
            var colorParamArray = setLinePoints();
            let colorArray = [];
            for (let i = 0; i < colorParamArray.length; i++) {
                let param = colorParamArray[i];
                let color0 = hexToRgb(colors.orange),
                    color1 = hexToRgb(colors.purple);
                let r = Math.floor(color0.r + param * (color1.r - color0.r)),
                    g = Math.floor(color0.g + param * (color1.g - color0.g)),
                    b = Math.floor(color0.b + param * (color1.b - color0.b));

                let newColor = `rgba(${r},${g},${b},${ALPHA})`;
                colorArray.push(newColor);
            }
            return colorArray;
        }

        // --------------- Run Frames --------------- //

        const DRAWS_PER_FRAME = 8,
            LINE_WIDTH = 1.5,
            NUM_POINTS = Math.pow(2, ITERATIONS) + 1,
            FULL_TURN = (2 * Math.PI * NUM_POINTS) / (1 + NUM_POINTS),
            X_SQUEEZE = 0.75, // Condenses x-axis to make it look 3D
            STEPS_PER_SEGMENT = Math.floor(800 / NUM_CIRCLES);

        function onTimer(circles, colorArray) {
            for (let k = 0; k < DRAWS_PER_FRAME; k++) {
                // Set up stroke features
                context.globalCompositeOperation = "lighter";
                context.lineJoin = "miter";
                context.strokeStyle = colorArray[lineNumber];
                context.lineWidth = LINE_WIDTH;
                context.beginPath();

                // move to first point, relative to first circle
                let centerX = circles[0].centerX;
                let centerY = circles[0].centerY;
                let radius =
                    circles[0].radius +
                    circles[0].pointArray[lineNumber] * circles[0].radius;
                let phase = circles[0].phase;
                let theta = (lineNumber / (NUM_POINTS - 1)) * FULL_TURN;
                let x0 = centerX + X_SQUEEZE * radius * Math.cos(theta + phase);
                let y0 = centerY + radius * Math.sin(theta + phase);
                context.moveTo(x0, y0);

                for (let i = 0; i < NUM_CIRCLES - 1; i++) {
                    //draw between i and i+1 circle
                    let rad0 =
                        circles[i].radius +
                        circles[i].pointArray[lineNumber] * circles[i].radius;
                    let rad1 =
                        circles[i + 1].radius +
                        circles[i + 1].pointArray[lineNumber] *
                            circles[i + 1].radius;
                    let phase0 = circles[i].phase;
                    let phase1 = circles[i + 1].phase;

                    for (let j = 0; j < STEPS_PER_SEGMENT; j++) {
                        let linParam = j / (STEPS_PER_SEGMENT - 1);
                        let cosParam = 0.5 - 0.5 * Math.cos(linParam * Math.PI);

                        //interpolate center
                        centerX =
                            circles[i].centerX +
                            linParam *
                                (circles[i + 1].centerX - circles[i].centerX);
                        centerY =
                            circles[i].centerY +
                            cosParam *
                                (circles[i + 1].centerY - circles[i].centerY);

                        //interpolate radius
                        radius = rad0 + cosParam * (rad1 - rad0);

                        //interpolate phase
                        phase = phase0 + cosParam * (phase1 - phase0);

                        x0 =
                            centerX +
                            X_SQUEEZE * radius * Math.cos(theta + phase);
                        y0 = centerY + radius * Math.sin(theta + phase);

                        context.lineTo(x0, y0);
                    }
                }

                context.stroke();

                lineNumber++;
                if (lineNumber > NUM_POINTS - 1) {
                    clearInterval(timer);
                    timer = null;
                    break;
                }
            }
        }
        // --------------- Set Up Sketch --------------- //

        // Background color
        contextBackground.beginPath();
        contextBackground.rect(0, 0, width, height);
        contextBackground.fillStyle = this.colors.black;
        contextBackground.fill();

        // --------------- Draw --------------- //
        let timer;
        let circles = setCircles();
        console.log(circles);
        let colorArray = setColorList(this.colors);
        let lineNumber = 0;
        const FPS = 1000 / 360; // 360 fps
        // Restart timer
        if (timer) {
            clearInterval(timer);
        }
        timer = setInterval(function () {
            onTimer(circles, colorArray);
        }, 1000 / 60);
    },
};

export default sketch_03;
