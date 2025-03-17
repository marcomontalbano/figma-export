import type * as FigmaExport from '@figma-export/types';
import type * as Figma from '@figma/rest-api-spec';

const translateTextTransform = (
  figmaTextCase?: string,
): FigmaExport.TextTransform => {
  const map: { [key: string]: FigmaExport.TextTransform } = {
    undefined: 'none',
    UPPER: 'uppercase',
    LOWER: 'lowercase',
    TITLE: 'capitalize',
  };

  // biome-ignore lint/style/noNonNullAssertion: <explanation>
  return map[figmaTextCase!] || map.undefined;
};

const translateFontVariant = (
  figmaTextCase?: string,
): FigmaExport.FontVariant => {
  const map: { [key: string]: FigmaExport.FontVariant } = {
    undefined: 'normal',
    SMALL_CAPS: 'small-caps',
    SMALL_CAPS_FORCED: 'all-small-caps',
  };

  // biome-ignore lint/style/noNonNullAssertion: <explanation>
  return map[figmaTextCase!] || map.undefined;
};

const translateTextDecoration = (
  figmaTextDecoration?: string,
): FigmaExport.TextDecoration => {
  const map: { [key: string]: FigmaExport.TextDecoration } = {
    undefined: 'none',
    STRIKETHROUGH: 'line-through',
    UNDERLINE: 'underline',
  };

  // biome-ignore lint/style/noNonNullAssertion: <explanation>
  return map[figmaTextDecoration!] || map.undefined;
};

const translateTextAlign = (
  figmaTextAlignHorizontal = 'LEFT',
): FigmaExport.TextAlign => {
  const map: { [key: string]: FigmaExport.TextAlign } = {
    LEFT: 'left',
    RIGHT: 'right',
    CENTER: 'center',
    JUSTIFIED: 'justify',
  };

  return map[figmaTextAlignHorizontal];
};

const translateVerticalAlign = (
  figmaTextAlignVertical = 'TOP',
): FigmaExport.VerticalAlign => {
  const map: { [key: string]: FigmaExport.VerticalAlign } = {
    TOP: 'top',
    CENTER: 'middle',
    BOTTOM: 'bottom',
  };

  return map[figmaTextAlignVertical];
};

const translateLineHeight = ({
  lineHeightPx,
  lineHeightPercentFontSize,
  lineHeightUnit,
}: Figma.TypeStyle): string => {
  if (lineHeightUnit === 'FONT_SIZE_%') {
    // Figma API doesn't return `lineHeightPercentFontSize`
    // if lineHeightPercent is 100
    return lineHeightPercentFontSize
      ? Math.fround(lineHeightPercentFontSize / 100).toString()
      : '1';
  }

  // this unit is deprecated and will be
  // removed in future version of Figma API
  // https://www.figma.com/developers/api#files-types
  if (lineHeightUnit === 'INTRINSIC_%') {
    // this looks wrong at first
    // but Pixels in this if-branch are intentional
    // https://github.com/marcomontalbano/figma-export/pull/156#issuecomment-1931415352
    return `${lineHeightPx}px`;
  }

  if (lineHeightUnit === 'PIXELS') {
    return `${lineHeightPx}px`;
  }

  throw new Error(`Unknown lineHeightUnit: ${lineHeightUnit}`);
};

const createTextStyle = (
  textNode: Figma.Style & Figma.TextNode,
): FigmaExport.TextStyle => {
  const {
    fontFamily,
    fontWeight,
    fontSize,
    letterSpacing,
    italic,
    textCase,
    textDecoration,
    textAlignHorizontal,
    textAlignVertical,
  } = textNode.style;

  return {
    fontFamily: fontFamily ?? '',
    fontWeight: fontWeight ?? 400,
    fontSize: fontSize ?? 16,
    letterSpacing: letterSpacing ?? 0,
    lineHeight: translateLineHeight(textNode.style),
    fontStyle: italic ? 'italic' : 'normal',
    fontVariant: translateFontVariant(textCase),
    textTransform: translateTextTransform(textCase),
    textDecoration: translateTextDecoration(textDecoration),
    textAlign: translateTextAlign(textAlignHorizontal),
    verticalAlign: translateVerticalAlign(textAlignVertical),
  };
};

const parse = (
  node: FigmaExport.StyleNode,
): FigmaExport.StyleTypeText | undefined => {
  if (node.styleType === 'TEXT' && node.type === 'TEXT') {
    return {
      styleType: 'TEXT',
      style: createTextStyle(node),
    };
  }

  return undefined;
};

export { parse };
