const sketch_08 = {
    title: "Sprinkles",

    date: "April 21, 2021",

    colors: {
        white: "#f7f7f2",
        teal: "#6abbb7",
        blue: "#577c99",
        purple: "#79759a",
        red: "#ed7978",
        orange: "#f5b9a1",
        yellow: "#f5dcbc",
    },

    inspiration: [
        "<h1>Inspiration</h1>",
        "<p>These colors remind me of a birthday cake :9 I actually wanted to draw confetti, which required making everything as random as possible without looking awkward.</p>",
        "<h1>What's Random?</h1>",
        "<p>Size, position, rotation, speed, color.</p>",
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

        const COLORS = Object.values(this.colors).splice(1);
        const SPRITE_WIDTH = 8,
            SPRITE_HEIGHT = 16,
            ROTATION_SPEED = 1,
            SPEED_RANGE = 4,
            ALPHA_DURATION = 0.1,
            X_OFFSET = 0.1;

        class Confetti {
            constructor() {
                this.sprites = [];

                this.render = this.render.bind(this);
                requestAnimationFrame(this.render);
            }

            /**
             * Build individual sprites, stored in this.sprites Array
             */
            buildSprite() {
                this.sprites.push({
                    x: Math.random() * width,
                    xOffset: width * (2 * X_OFFSET * Math.random() - X_OFFSET),
                    y: -Math.max(SPRITE_WIDTH, SPRITE_HEIGHT),
                    rotation: 2 * Math.PI * Math.random(),
                    rotationSpeed: 1 + Math.random() * ROTATION_SPEED,
                    speed: 1 + Math.random() * SPEED_RANGE,
                    color: COLORS[Math.floor(Math.random() * COLORS.length)],
                    fade: 0.5 + 0.5 * Math.random(),
                    elapsed: 0,
                });
            }

            /**
             * Draw confetti sprite on canvas
             * @param {Number} width
             * @param {Number} height
             * @param {Number} radius
             * @param {String} color
             */
            drawSprite(width, height, radius, color) {
                context.fillStyle = color;
                context.fill();
                context.beginPath();
                context.moveTo(radius, 0);
                context.lineTo(width - radius, 0);
                context.quadraticCurveTo(width, 0, width, radius);
                context.lineTo(width, height - radius);
                context.quadraticCurveTo(width, height, width - radius, height);
                context.lineTo(radius, height);
                context.quadraticCurveTo(0, height, 0, height - radius);
                context.lineTo(0, radius);
                context.quadraticCurveTo(0, 0, radius, 0);
                context.closePath();
            }

            /**
             * Draw confetti
             */
            render() {
                // Add new sprites
                if (Math.random() < 0.2) {
                    this.buildSprite();
                }

                // Clear canvas
                context.clearRect(0, 0, width, height);

                // Draw each sprite
                for (let i = 0; i < this.sprites.length; ++i) {
                    let sprite = this.sprites[i];
                    let sHeight =
                            0.5 * SPRITE_HEIGHT +
                            0.5 *
                                SPRITE_HEIGHT *
                                Math.abs(
                                    Math.sin(
                                        sprite.elapsed *
                                            Math.PI *
                                            sprite.rotationSpeed
                                    )
                                ),
                        radius = Math.min(SPRITE_WIDTH, sHeight) / 2,
                        rotate =
                            sprite.elapsed * sprite.rotationSpeed * Math.PI;

                    // Transform
                    context.translate(
                        sprite.x +
                            SPRITE_WIDTH +
                            sprite.elapsed * sprite.xOffset,
                        sprite.y +
                            sprite.elapsed *
                                (height +
                                    2 * Math.max(SPRITE_WIDTH, SPRITE_HEIGHT)) +
                            sHeight
                    );
                    context.rotate(sprite.rotation + rotate);

                    context.globalAlpha =
                        sprite.elapsed < sprite.fade
                            ? 1
                            : 1 -
                              Math.min(
                                  0.8,
                                  (sprite.elapsed - sprite.fade) /
                                      ALPHA_DURATION
                              );

                    // Draw
                    this.drawSprite(
                        SPRITE_WIDTH,
                        sHeight,
                        radius,
                        sprite.color
                    );

                    context.globalAlpha = 1;

                    // Transform back
                    context.rotate(-sprite.rotation - rotate);
                    context.translate(
                        -sprite.x -
                            SPRITE_WIDTH -
                            sprite.elapsed * sprite.xOffset,
                        -(
                            sprite.y +
                            sprite.elapsed *
                                (height +
                                    2 * Math.max(SPRITE_WIDTH, SPRITE_HEIGHT)) +
                            sHeight
                        )
                    );

                    sprite.elapsed = sprite.elapsed + 0.005;
                    if (sprite.elapsed > 1) {
                        // Remove sprite if it reaches the bottom of canvas
                        this.sprites.splice(i, 1);
                    }
                }

                requestAnimationFrame(this.render);
            }
        }

        // --------------- Set Up Sketch --------------- //

        // Background color
        contextBackground.beginPath();
        contextBackground.rect(0, 0, width, height);
        contextBackground.fillStyle = this.colors.white;
        contextBackground.fill();

        // Draw confetti
        new Confetti();
    },
};

export default sketch_08;
