class CalculationService {
    static checkNodeInRadius(Xc, Yc, Rc, x, y) {
        return ((x - Xc) * (x - Xc) + (y - Yc) * (y - Yc)) < Rc * Rc;
    }

    static distanceBetweenNodes(x0, x1, y0, y1) {
        return Math.sqrt(Math.pow(x0 - x1, 2) + Math.pow(y0 - y1, 2));
    }

    static trianglePerimeter(x0, y0, x1, y1, x2, y2) {
        return this.distanceBetweenNodes(x0, x1, y0, y1)
                + this.distanceBetweenNodes(x0, x2, y0, y2)
                + this.distanceBetweenNodes(x1, x2, y1, y2);
    }
}

export default CalculationService;
