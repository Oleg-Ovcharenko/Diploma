import {
    NODE_RADIUS,
    NODE_COLOR,
    MAIN_NODE_COLOR,
    MAIN_NODE_RADIUS,
    NODE_RADIUS_COLOR,
    NODE_RADIUS_FILL_COLOR,
    TOOLTIP_BG_COLOR,
    GRID_COLOR,
    LINE_WIDTH,
} from '../constants';

class Animations {
    constructor(ctx, w, h) {
        this.ctx = ctx;
        this.width = w;
        this.height = h;
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.width, this.height);
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
            this.ctx.lineWidth = LINE_WIDTH;
            this.ctx.strokeStyle = NODE_COLOR;
            this.ctx.lineTo(line.x2, line.y2);
            this.ctx.stroke();
        });
    }

    renderNodesRadius(nodes) {
        nodes.forEach((node) => {
            this.ctx.beginPath();
            this.ctx.lineWidth = LINE_WIDTH;
            this.ctx.arc(node.x, node.y, node.params.radius / 2, 2 * Math.PI, false);
            this.ctx.strokeStyle = NODE_RADIUS_COLOR;
            this.ctx.stroke();
        });
    }

    renderGrid(scale) {
        for (let i = 0, horizontalLineCount = 0; i < this.width / scale; i += 1) {
            this.ctx.beginPath();
            this.ctx.moveTo(horizontalLineCount, 0);
            this.ctx.lineTo(horizontalLineCount, this.height);
            this.ctx.lineWidth = 0.5;
            this.ctx.strokeStyle = GRID_COLOR;
            this.ctx.stroke();

            horizontalLineCount += scale;
        }

        for (let i = 0, verticalLineCount = 0; i < this.height / scale; i += 1) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, verticalLineCount);
            this.ctx.lineTo(this.width, verticalLineCount);
            this.ctx.lineWidth = 0.5;
            this.ctx.strokeStyle = GRID_COLOR;
            this.ctx.stroke();

            verticalLineCount += scale;
        }
    }

    getTooltipWidthAndHeight(tooltip, FONT_SIZE) {
        const tooltipHeight = tooltip ? (tooltip.text.length * FONT_SIZE) + 10 : 0;
        let tooltipWidth = 0;

        if (tooltip) {
            for (let i = 0; i < tooltip.text.length; i += 1) {
                if ((tooltip.text[i].length * 6) + 10 > tooltipWidth) {
                    tooltipWidth = (tooltip.text[i].length * 6) + 10;
                }
            }
        }

        return {
            tooltipHeight,
            tooltipWidth,
        };
    }

    // TODO need behavior on the edge of canvas
    renderTooltipAndNodeRadius(tooltip) {
        const FONT_SIZE = 12;
        const TOOLTIP_X = tooltip.x;
        const TOOLTIP_Y = tooltip.y;
        const PADDING = 10;

        const {
            tooltipHeight,
            tooltipWidth,
        } = this.getTooltipWidthAndHeight(tooltip, FONT_SIZE);

        if (tooltip) {
            const x = TOOLTIP_X + PADDING;
            const y = TOOLTIP_Y - (tooltipHeight / 2);

            // Node radius
            this.ctx.beginPath();
            this.ctx.lineWidth = LINE_WIDTH;
            this.ctx.arc(tooltip.x, tooltip.y, tooltip.radius / 2, 2 * Math.PI, false);
            this.ctx.strokeStyle = NODE_RADIUS_COLOR;
            this.ctx.stroke();
            this.ctx.fillStyle = NODE_RADIUS_FILL_COLOR;
            this.ctx.fill();

            // Tooltip
            this.ctx.strokeStyle = 'black';
            this.ctx.lineWidth = 1;
            this.ctx.strokeRect(x, y, tooltipWidth, tooltipHeight);
            this.ctx.fillStyle = TOOLTIP_BG_COLOR;
            this.ctx.fillRect(x, y, tooltipWidth, tooltipHeight);
            this.ctx.textBaseline = 'middle';
            this.ctx.font = `${FONT_SIZE}px Arial`;
            this.ctx.fillStyle = 'black';

            // Fields
            let top = y + 10;

            tooltip.text.map((item) => {
                this.ctx.fillText(`${item}`, x + PADDING, top);
                top += FONT_SIZE;
            });
        }
    }
}

export default Animations;

