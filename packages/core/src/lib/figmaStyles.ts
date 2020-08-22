import * as Figma from 'figma-js';

type ExtractableColor = {
    opacity?: number;
    color?: Figma.Color
}

/**
 * A color-stop's <color> value, followed by one or two optional stop positions.
 */
interface GradientStop {
    color: Figma.Color,
    position: number
}

/**
 * The linear-gradient() CSS function creates an image consisting of a progressive transition between two or more colors along a straight line.
 * Its result is an object of the <gradient> data type, which is a special kind of <image>.
 * @url https://developer.mozilla.org/en-US/docs/Web/CSS/linear-gradient
 */
interface GradientLinear {
    /**
     * The gradient line's angle of direction. A value of 0deg is equivalent to to top; increasing values rotate clockwise from there.
     * @default 180deg
     */
    angle: string
    gradientStops: GradientStop[]
}

const extractColor = (paint: ExtractableColor): (Figma.Color | undefined) => {
    if (!paint.color) {
        return undefined;
    }

    const {
        r = 0,
        g = 0,
        b = 0,
        a = 1,
    } = paint.color;

    const { opacity } = paint;

    return {
        r: parseInt((r * 255).toFixed(0), 10),
        g: parseInt((g * 255).toFixed(0), 10),
        b: parseInt((b * 255).toFixed(0), 10),
        a: opacity || a,
    };
};

const extractGradientLinear = (paint: Figma.Paint): (GradientLinear | undefined) => {
    if (!paint.gradientStops || !paint.gradientHandlePositions) {
        return undefined;
    }

    const gradientStops: GradientStop[] = [];

    const [startPoint, endPoint] = paint.gradientHandlePositions;
    const deltaY = (endPoint.y - startPoint.y);
    const deltaX = (endPoint.x - startPoint.x);
    const deg = ((Math.atan2(deltaY, deltaX) * 180) / Math.PI) + 90;
    const angle = `${parseFloat(deg.toFixed(2))}deg`;

    paint.gradientStops.forEach((stop) => {
        const color = extractColor(stop);
        const position = parseFloat((stop.position * 100).toFixed(3));

        if (color) {
            gradientStops.push({ color, position });
        }
    });

    return {
        angle,
        gradientStops,
    };
};

const getColorStyles = (fill: Figma.Paint): Record<string, unknown> | undefined => {
    if (fill.type === 'SOLID') {
        const color = extractColor(fill);

        if (color) {
            return {
                type: fill.type,
                color,
                value: `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`,
            };
        }
    }

    if (fill.type === 'GRADIENT_LINEAR') {
        const gradient = extractGradientLinear(fill);
        if (gradient) {
            return {
                type: fill.type,
                ...gradient,
                value: `linear-gradient(${gradient.angle}, ${gradient.gradientStops.map((stop) => {
                    return `rgba(${stop.color.r}, ${stop.color.g}, ${stop.color.b}, ${stop.color.a}) ${stop.position}%`;
                }).join(', ')})`,
            };
        }
    }

    return undefined;
};

const parseFigmaStyles = (nodes: ((Figma.Style & Figma.Node) | undefined)[]): any[] => {
    return nodes.map((node) => {
        // Color Styles
        if (node?.styleType === 'FILL' && node?.type === 'RECTANGLE') {
            return {
                styleType: 'FILL',
                // TODO: sanitize the property "name"
                name: node.name,
                comment: node.description,
                fills: node.fills.map(getColorStyles),
            };
        }

        // if (node?.styleType === 'EFFECT' && node?.type === 'RECTANGLE') {
        //     // TODO: Effect Styles
        // }

        // if (node?.styleType === 'TEXT' && node?.type === 'TEXT') {
        //     // TODO: Text Styles
        // }

        // if (node?.styleType === 'GRID' && node?.type === 'FRAME') {
        //     // TODO: Grid Styles
        // }

        return undefined;
    }).filter((node) => node);
};

const fetchStyles = async (client: Figma.ClientInterface, fileId: string): Promise<(Figma.Style & Figma.Node)[]> => {
    const { data: { styles } = {} } = await client.file(fileId);

    if (!styles) {
        throw new Error('\'styles\' are missing.');
    }

    const { data: { nodes } } = await client.fileNodes(fileId, { ids: Object.keys(styles) });

    const styleNodes = Object.values(nodes).map((node) => node?.document);

    return styleNodes.map((node) => ({
        ...(node ? styles[node.id] : ({} as Figma.Style)),
        ...(node as Figma.Node),
    }));
};

export {
    fetchStyles,
    parseFigmaStyles,
};
