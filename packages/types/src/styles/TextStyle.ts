export type TextTransform = 'none' | 'uppercase' | 'lowercase' | 'capitalize';
export type TextDecoration = 'none' | 'line-through' | 'underline';
export type FontVariant = 'normal' | 'small-caps' | 'all-small-caps';
export type FontStyle = 'normal' | 'italic';
export type TextAlign = 'left' | 'right' | 'center' | 'justify';
export type VerticalAlign = 'top' | 'middle' | 'bottom';

export type TextStyle = {
  /** Font family of text (standard name) */
  fontFamily: string;
  /** Numeric font weight */
  fontWeight: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
  /** Font size in px */
  fontSize: number;
  /**
   * Line height value with units.
   *
   * Examples: `"18px", "120%", "1.2"`
   *
   * ---
   * More on units https://developer.mozilla.org/en-US/docs/Web/CSS/line-height
   */
  lineHeight: string;
  /** Space between characters in px */
  letterSpacing: number;

  /** text-transform property, default is none */
  textTransform: TextTransform;
  /** font-variant property, default is none */
  fontVariant: FontVariant;
  /** text-decoration property, default is none */
  textDecoration: TextDecoration;
  /** font-style property, default is normal */
  fontStyle: FontStyle;
  /** text-align property */
  textAlign: TextAlign;
  /** text-align property */
  verticalAlign: VerticalAlign;
};

export type StyleTypeText = {
  styleType: 'TEXT';
  style: TextStyle;
};
