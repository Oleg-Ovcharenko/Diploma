import {
    NODE_RADIUS,
    NODE_COLOR,
    MAIN_NODE_COLOR,
    MAIN_NODE_RADIUS,
} from '../constants';

class Animations {
    static clearCanvas(ctx, w, h) {
        ctx.clearRect(0, 0, w, h);
    }

    static renderNodes(ctx, nodes) {
        nodes.forEach((node) => {
            ctx.beginPath();
            ctx.arc(node.x, node.y, NODE_RADIUS / 2, 2 * Math.PI, false);
            ctx.fillStyle = NODE_COLOR;
            ctx.fill();
        });
    }

    static renderMainNode(ctx, mainNode) {
        ctx.beginPath();
        ctx.arc(mainNode.x, mainNode.y, MAIN_NODE_RADIUS / 2, 0, 2 * Math.PI, false);
        ctx.fillStyle = MAIN_NODE_COLOR;
        ctx.fill();
    }

    static renderLines(ctx, lines) {
        lines.forEach((line) => {
            ctx.beginPath();
            ctx.moveTo(line.x1, line.y1);
            ctx.lineWidth = 1;
            ctx.strokeStyle = NODE_COLOR;
            ctx.lineTo(line.x2, line.y2);
            ctx.stroke();
        });
    }

    static renderNodesRadius(ctx, nodes) {
        nodes.forEach((node) => {
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.params.radius / 2, 2 * Math.PI, false);
            ctx.strokeStyle = '#e9ecef';
            ctx.stroke();
        });
    }

    static renderTooltip(ctx, tooltip) {
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

            ctx.strokeStyle = 'black';
            ctx.lineWidth = 1;
            ctx.strokeRect(x, y, TOOLTIP_WIDTH, tooltipHeight);
            ctx.fillStyle = '#e9ecef';
            ctx.fillRect(x, y, TOOLTIP_WIDTH, tooltipHeight);
            ctx.textBaseline = 'middle';
            ctx.font = `${FONT_SIZE}px Arial`;
            ctx.fillStyle = 'black';
            // fields
            let top = y + 10;
            FIELDS.map((item) => {
                ctx.fillText(`${item}: ${Math.round(tooltip[item])}`, x + PADDING, top);
                top += FONT_SIZE;
            });
        }
    }
}

export default Animations;

