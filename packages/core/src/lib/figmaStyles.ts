import * as Figma from 'figma-js';

type ExtractableColor = {
    opacity?: number;
    color?: Figma.Color
}

type Color = {
    /** Red channel value, between 0 and 255 */
    readonly r: number;
    /** Green channel value, between 0 and 255 */
    readonly g: number;
    /** Blue channel value, between 0 and 255 */
    readonly b: number;
    /** Alpha channel value, between 0 and 1 */
    readonly a: number;
    /** rgba() Function as a string */
    rgba: string
}

/**
 * A color-stop's <color> value, followed by one or two optional stop positions.
 */
type GradientStop = {
    color: Color,
    position: number
}

/**
 * The linear-gradient() CSS function creates an image consisting of a progressive transition between two or more colors along a straight line.
 * Its result is an object of the <gradient> data type, which is a special kind of <image>.
 * @url https://developer.mozilla.org/en-US/docs/Web/CSS/linear-gradient
 */
type GradientLinear = {
    /**
     * The gradient line's angle of direction. A value of 0deg is equivalent to to top; increasing values rotate clockwise from there.
     * @default 180deg
     */
    angle: string
    gradientStops: GradientStop[]
}

const extractColor = (paint: ExtractableColor): (Color | undefined) => {
    if (!paint.color) {
        return undefined;
    }

    const convert = (color: number) => parseInt((color * 255).toFixed(0), 10);

    let {
        r = 0,
        g = 0,
        b = 0,
        a = 1,
    } = paint.color;

    const { opacity } = paint;

    r = convert(r);
    g = convert(g);
    b = convert(b);
    a = opacity || a;

    return {
        r,
        g,
        b,
        a,
        rgba: `rgba(${r}, ${g}, ${b}, ${a})`,
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

type BasicStyle = {
    visible: boolean
    value: string
}

type ColorStyleSolid = {
    type: 'SOLID'
    color: Color
}

type ColorStyleGradientLinear = {
    type: 'GRADIENT_LINEAR'
} & GradientLinear

type ColorStyle = BasicStyle & (ColorStyleSolid | ColorStyleGradientLinear);

const createColorStyles = (fill: Figma.Paint): ColorStyle | undefined => {
    if (fill.type === 'SOLID') {
        const color = extractColor(fill);

        if (color) {
            return {
                type: fill.type,
                visible: fill.visible !== false,
                color,
                value: color.rgba,
            };
        }
    }

    if (fill.type === 'GRADIENT_LINEAR') {
        const gradient = extractGradientLinear(fill);
        if (gradient) {
            return {
                type: fill.type,
                visible: fill.visible !== false,
                ...gradient,
                value: `linear-gradient(${gradient.angle}, ${gradient.gradientStops.map((stop) => {
                    return `${stop.color.rgba} ${stop.position}%`;
                }).join(', ')})`,
            };
        }
    }

    return undefined;
};

type EffectStyleShadow = {
    type: 'DROP_SHADOW' | 'INNER_SHADOW'
    color: Color
    offset: Figma.Vector2
    blurRadius: number
    spreadRadius: number
}

type EffectStyleLayerBlur = {
    type: 'LAYER_BLUR'
    blurRadius: number
}

type EffectStyle = BasicStyle & (EffectStyleShadow | EffectStyleLayerBlur)

const createEffectStyle = (effect: Figma.Effect): EffectStyle | undefined => {
    if (effect.type === 'DROP_SHADOW' || effect.type === 'INNER_SHADOW') {
        const color = extractColor(effect);
        const spreadRadius = 0;
        const inset = effect.type === 'INNER_SHADOW';

        if (color && effect.offset) {
            return {
                type: effect.type,
                visible: effect.visible,
                color,
                offset: effect.offset,
                blurRadius: effect.radius,
                spreadRadius,
                value: `${inset ? 'inset ' : ''}${effect.offset.x}px ${effect.offset.y}px ${effect.radius}px ${spreadRadius}px ${color.rgba}`,
            };
        }
    }

    if (effect.type === 'LAYER_BLUR') {
        return {
            type: effect.type,
            visible: effect.visible,
            blurRadius: effect.radius,
            value: `blur(${effect.radius}px)`,
        };
    }

    return undefined;
};

type FigmaExportPaintStyle = {
    styleType: 'FILL'
    fills: ColorStyle[]
}

type FigmaExportEffectStyle = {
    styleType: 'EFFECT'
    effects: EffectStyle[]
}

type FigmaExportStyle = {
    name: string
    comment: string
    visible: boolean
    originalNode: Figma.Style & Figma.Node
} & (FigmaExportPaintStyle | FigmaExportEffectStyle)

const notEmpty = <TValue>(value: TValue | null | undefined): value is TValue => {
    return value !== null && value !== undefined;
};

const parseFigmaStyles = (nodes: (Figma.Style & Figma.Node)[]): FigmaExportStyle[] => {
    return nodes.map((node) => {
        const basicNode = {
            name: node.name,
            comment: node.description,
            visible: node.visible !== false,
            originalNode: node,
        };

        if (node.styleType === 'FILL' && node.type === 'RECTANGLE') {
            return {
                ...basicNode,
                styleType: node.styleType,
                fills: node.fills.map(createColorStyles).filter(notEmpty),
            };
        }

        if (node.styleType === 'EFFECT' && node.type === 'RECTANGLE') {
            return {
                ...basicNode,
                styleType: node.styleType,
                effects: node.effects.map(createEffectStyle).filter(notEmpty),
            };
        }

        // if (node.styleType === 'TEXT' && node.type === 'TEXT') {
        //     // TODO: Text Styles
        // }

        // if (node.styleType === 'GRID' && node.type === 'FRAME') {
        //     // TODO: Grid Styles
        // }

        return undefined;
    }).filter(notEmpty);
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
