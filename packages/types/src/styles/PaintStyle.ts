import type * as Figma from 'figma-js';

/** Minimum necessary information for extracting a color */
export type ExtractableColor = {
  color?: Figma.Color;
  opacity?: number;
};

/** An RGBA color */
export type Color = {
  /** Red channel value, between 0 and 255 */
  readonly r: number;
  /** Green channel value, between 0 and 255 */
  readonly g: number;
  /** Blue channel value, between 0 and 255 */
  readonly b: number;
  /** Alpha channel value, between 0 and 1 */
  readonly a: number;
  /** rgba() CSS Function as a string */
  rgba: string;
};

/** A color-stop's <color> value, followed by a stop position */
export type LinearColorStop = {
  /** Color stop */
  color: Color;
  /** Position is a <length> along the gradient's axis */
  position: number;
};

/**
 * The linear-gradient() CSS function creates an image consisting of a progressive transition
 * between two or more colors along a straight line.
 * Its result is an object of the <gradient> data type, which is a special kind of <image>.
 * @url https://developer.mozilla.org/en-US/docs/Web/CSS/linear-gradient
 */
export type LinearGradient = {
  /** The gradient line's angle of direction. A value of 0deg is equivalent to to top; increasing values rotate clockwise from there */
  angle: string;
  /** A color-stop's <color> value, followed by a stop position */
  gradientStops: LinearColorStop[];
};

export type FillStyleSolid = {
  type: 'SOLID';
  color: Color;
};

export type FillStyleGradientLinear = {
  type: 'GRADIENT_LINEAR';
} & LinearGradient;

export type FillStyle = {
  visible: boolean;
  value: string;
} & (FillStyleSolid | FillStyleGradientLinear);

export type StyleTypeFill = {
  styleType: 'FILL';
  fills: FillStyle[];
};
