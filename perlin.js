/**
 * Class to generate Perlin noise
 */

class Perlin {
    constructor(ixmax, iymax) {
        this.IXMAX = ixmax;
        this.IYMAX = iymax;
        this.rng = new Math.seedrandom();
        this.Gradient = []; // Precomputed (or otherwise) gradient vectors at each grid node
        for (var y = 0; y < this.IYMAX; y++) {
            this.Gradient.push([])
        }
        for (var y = 0; y < this.IYMAX; y++) {
            for (var x = 0; x < this.IXMAX; x++) {
                this.Gradient[y].push([0, 0]);
            }
        }
    }

    /**
     * Sets seed for Perlin noise generation
     * @param {String} seed 
     */
    setSeed(seed) {
        this.rng = new Math.seedrandom(seed);
    }

    /**
     * Populates Gradient with random 2-D vectors
     */
    computeGradient() {
        for (var y = 0; y < this.IYMAX; y++) {
            for (var x = 0; x < this.IXMAX; x++) {
                this.Gradient[y][x][0] = rng();
                this.Gradient[y][x][1] = rng();
            }
        }
    }

    // Compute Perlin noise at coordinates x, y
    // Ref.: https://en.wikipedia.org/wiki/Perlin_noise#Implementation
    getNoise(x, y) {

        // Function to linearly interpolate between a0 and a1
        // Weight w should be in the range [0.0, 1.0]
        function lerp(a0, a1, w) {
            return (1.0 - w) * a0 + w * a1;

            // as an alternative, this slightly faster equivalent formula can be used:
            // return a0 + w*(a1 - a0);
        }

        // Computes the dot product of the distance and gradient vectors.
        function dotGridGradient(ix, iy, x, y) {

            // Compute the distance vector
            var dx = x - ix;
            var dy = y - iy;

            // Compute the dot-product
            return (dx * this.Gradient[iy][ix][0] + dy * this.Gradient[iy][ix][1]);
        }

        // Determine grid cell coordinates
        var x0 = int(x);
        var x1 = x0 + 1;
        var y0 = int(y);
        var y1 = y0 + 1;

        // Determine interpolation weights
        // Could also use higher order polynomial/s-curve here
        var sx = x - x0;
        var sy = y - y0;

        // Interpolate between grid point gradients
        var n0, n1, ix0, ix1, value;
        n0 = dotGridGradient(x0, y0, x, y);
        n1 = dotGridGradient(x1, y0, x, y);
        ix0 = lerp(n0, n1, sx);
        n0 = dotGridGradient(x0, y1, x, y);
        n1 = dotGridGradient(x1, y1, x, y);
        ix1 = lerp(n0, n1, sx);
        value = lerp(ix0, ix1, sy);

        return value;
    }
}