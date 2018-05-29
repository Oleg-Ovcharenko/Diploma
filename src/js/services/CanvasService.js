import {
    NODE_RADIUS,
    NODE_COLOR,
    MAIN_NODE_COLOR,
    MAIN_NODE_RADIUS,
    NODE_RADIUS_COLOR,
    NODE_RADIUS_FILL_COLOR,
    TOOLTIP_BG_COLOR,
} from '../constants';

class Animations {
    constructor(ctx) {
        this.ctx = ctx;
    }

    clearCanvas(w, h) {
        this.ctx.clearRect(0, 0, w, h);
    }

    renderNodes(nodes) {
        nodes.forEach((node) => {
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, NODE_RADIUS / 2, 2 * Math.PI, false);
            this.ctx.fillStyle = NODE_COLOR;
            this.ctx.fill();
        });
    }

    renderMainNode(mainNode) {
        this.ctx.beginPath();
        this.ctx.arc(mainNode.x, mainNode.y, MAIN_NODE_RADIUS / 2, 0, 2 * Math.PI, false);
        this.ctx.fillStyle = MAIN_NODE_COLOR;
        this.ctx.fill();
    }

    renderLines(lines) {
        lines.forEach((line) => {
            this.ctx.beginPath();
            this.ctx.moveTo(line.x1, line.y1);
            this.ctx.lineWidth = 1;
            this.ctx.strokeStyle = NODE_COLOR;
            this.ctx.lineTo(line.x2, line.y2);
            this.ctx.stroke();
        });
    }

    renderNodesRadius(nodes) {
        nodes.forEach((node) => {
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, node.params.radius / 2, 2 * Math.PI, false);
            this.ctx.strokeStyle = NODE_RADIUS_COLOR;
            this.ctx.stroke();
        });
    }

    // TODO need behavior on the edge of canvas
    renderTooltipAndNodeRadius(tooltip) {
        const FONT_SIZE = 12;
        const TOOLTIP_X = tooltip.x;
        const TOOLTIP_Y = tooltip.y;
        const TOOLTIP_WIDTH = 90;
        const FIELDS = Object.keys(tooltip);
        const PADDING = 10;

        const tooltipHeight = (FIELDS.length * FONT_SIZE) + 10;

        if (tooltip) {
            const x = TOOLTIP_X + PADDING;
            const y = TOOLTIP_Y - (tooltipHeight / 2);

            // Node radius
            this.ctx.beginPath();
            this.ctx.arc(tooltip.x, tooltip.y, tooltip.radius / 2, 2 * Math.PI, false);
            this.ctx.strokeStyle = NODE_RADIUS_COLOR;
            this.ctx.stroke();
            this.ctx.fillStyle = NODE_RADIUS_FILL_COLOR;
            this.ctx.fill();

            // Tooltip
            this.ctx.strokeStyle = 'black';
            this.ctx.lineWidth = 1;
            this.ctx.strokeRect(x, y, TOOLTIP_WIDTH, tooltipHeight);
            this.ctx.fillStyle = TOOLTIP_BG_COLOR;
            this.ctx.fillRect(x, y, TOOLTIP_WIDTH, tooltipHeight);
            this.ctx.textBaseline = 'middle';
            this.ctx.font = `${FONT_SIZE}px Arial`;
            this.ctx.fillStyle = 'black';

            // Fields
            let top = y + 10;
            FIELDS.map((item) => {
                this.ctx.fillText(`${item}: ${typeof tooltip[item] === 'number' ? Math.round(tooltip[item]) : tooltip[item]}`, x + PADDING, top);
                top += FONT_SIZE;
            });
        }
    }
}

export default Animations;

