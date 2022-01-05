import sinon from 'sinon';
import { expect } from 'chai';
import {
    StyleNode,
    FillStyle,
    EffectStyle,
    Style,
} from '@figma-export/types';
import { camelCase } from '@figma-export/utils';

// eslint-disable-next-line import/order
import fs = require('fs');
import outputter = require('./index');

const mockFill = (fills: FillStyle[], { visible = true, name = 'variable/name', comment = 'lorem ipsum' } = {}): Style => ({
    fills,
    visible,
    name,
    comment,
    styleType: 'FILL',
    originalNode: { ...({} as StyleNode) },
});

const mockSolid = (value: string, visible = true): FillStyle => ({
    value,
    visible,
    type: 'SOLID',
    color: {
        a: 1, r: 255, g: 255, b: 255, rgba: 'rgba(255, 255, 255, 1)',
    },
});

const mockGradientLinear = (value: string, visible = true): FillStyle => ({
    value,
    visible,
    type: 'GRADIENT_LINEAR',
    gradientStops: [],
    angle: '100deg',
});

const mockEffect = (effects: EffectStyle[] = [], visible = true): Style => ({
    effects,
    visible,
    name: 'variable-name',
    comment: '',
    styleType: 'EFFECT',
    originalNode: { ...({} as StyleNode) },
});

const mockShadow = (value: string, visible = true): EffectStyle => ({
    value,
    visible,
    type: 'INNER_SHADOW',
    color: {
        a: 1, r: 255, g: 255, b: 255, rgba: 'rgba(255, 255, 255, 1)',
    },
    inset: false,
    blurRadius: 10,
    spreadRadius: 10,
    offset: { x: 10, y: 10 },
});

const mockBlur = (value: string, visible = true): EffectStyle => ({
    value,
    visible,
    type: 'LAYER_BLUR',
    blurRadius: 10,
});

const mockText = (visible = true): Style => ({
    style: {
        fontFamily: 'Verdana',
        fontSize: 12,
        fontStyle: 'italic',
        fontVariant: 'normal',
        fontWeight: 100,
        letterSpacing: 10,
        lineHeight: 12,
        textAlign: 'left',
        textDecoration: 'none',
        textTransform: 'uppercase',
        verticalAlign: 'middle',
    },
    visible,
    name: 'variable-name',
    comment: '',
    styleType: 'TEXT',
    originalNode: { ...({} as StyleNode) },
});

describe('style output as scss', () => {
    let writeFileSync;

    beforeEach(() => {
        sinon.stub(fs, 'mkdirSync').returnsArg(0);
        writeFileSync = sinon.stub(fs, 'writeFileSync');
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should not print anything if style is not visible', async () => {
        await outputter({
            output: 'output-folder',
        })([
            mockFill([
                mockSolid('solid-1'),
            ], { visible: false }),
        ]);

        expect(writeFileSync).to.be.calledOnce;
        expect(writeFileSync).to.be.calledWithMatch('/output-folder/_variables.scss', '');
    });

    it('should be able to change the filename, the extension and output folder', async () => {
        await outputter({
            output: 'output-folder',
            getExtension: () => 'SASS',
            getFilename: () => '_figma-styles',
        })([]);

        expect(writeFileSync).to.be.calledOnce;
        expect(writeFileSync).to.be.calledWithMatch('/output-folder/_figma-styles.sass');
    });

    it('should sanitize variable names', async () => {
        await outputter({
            output: 'output-folder',
        })([
            mockFill([
                mockSolid('rgba(26, 26, 26, 1)', true),
            ], { name: 'Grey/900' }),
        ]);

        expect(writeFileSync).to.be.calledOnce;
        expect(writeFileSync).to.be.calledWithMatch(
            sinon.match.any,

            // eslint-disable-next-line indent
            '\n'
            + '/**\n'
            + ' * lorem ipsum\n'
            + ' */\n'
            + '$grey-900: rgba(26, 26, 26, 1);\n',
        );
    });

    it('should be able to change the way a variable name is defined', async () => {
        await outputter({
            output: 'output-folder',
            getVariableName: (style) => camelCase(style.name),
        })([
            mockFill([
                mockSolid('rgba(26, 26, 26, 1)', true),
            ], { name: 'Grey/Dark' }),
        ]);

        expect(writeFileSync).to.be.calledOnce;
        expect(writeFileSync).to.be.calledWithMatch(
            sinon.match.any,

            // eslint-disable-next-line indent
            '\n'
            + '/**\n'
            + ' * lorem ipsum\n'
            + ' */\n'
            + '$greyDark: rgba(26, 26, 26, 1);\n',
        );
    });

    describe('colors', () => {
        it('should not print anything if fill is not visible', async () => {
            await outputter({
                output: 'output-folder',
            })([
                mockFill([
                    mockSolid('solid-1', false),
                ]),
            ]);

            expect(writeFileSync).to.be.calledOnce;
            expect(writeFileSync).to.be.calledWithMatch('/output-folder/_variables.scss', '');
        });

        it('should be able to extract a solid color', async () => {
            await outputter({
                output: 'output-folder',
            })([
                mockFill([
                    mockSolid('rgba(solid-1)', true),
                    mockSolid('rgba(solid-2)', false),
                ]),
            ]);

            expect(writeFileSync).to.be.calledOnce;
            expect(writeFileSync).to.be.calledWithMatch(
                sinon.match.any,

                // eslint-disable-next-line indent
                  '\n'
                + '/**\n'
                + ' * lorem ipsum\n'
                + ' */\n'
                + '$variable-name: rgba(solid-1);\n',
            );
        });

        it('should be able to extract a linear gradient', async () => {
            await outputter({
                output: 'output-folder',
            })([
                mockFill([
                    mockGradientLinear('linear-gradient-1'),
                    mockGradientLinear('linear-gradient-2'),
                ]),
            ]);

            expect(writeFileSync).to.be.calledOnce;
            expect(writeFileSync).to.be.calledWithMatch(
                sinon.match.any,

                // eslint-disable-next-line indent
                  '\n'
                + '/**\n'
                + ' * lorem ipsum\n'
                + ' */\n'
                + '$variable-name: linear-gradient-1, linear-gradient-2;\n',
            );
        });
    });

    describe('effects', () => {
        it('should be able to extract a box-shadow', async () => {
            await outputter({
                output: 'output-folder',
            })([
                mockEffect([
                    mockShadow('shadow-effect-1'),
                    mockShadow('shadow-effect-2'),
                ]),
            ]);

            expect(writeFileSync).to.be.calledOnce;
            expect(writeFileSync).to.be.calledWithMatch(
                sinon.match.any,

                // eslint-disable-next-line indent
                  '\n\n'
                + '$variable-name: shadow-effect-1, shadow-effect-2;\n',
            );
        });

        it('should be able to extract a filter: blur()', async () => {
            await outputter({
                output: 'output-folder',
            })([
                mockEffect([
                    mockBlur('blur-effect'),
                ]),
            ]);

            expect(writeFileSync).to.be.calledOnce;
            expect(writeFileSync).to.be.calledWithMatch(
                sinon.match.any,

                // eslint-disable-next-line indent
                  '\n\n'
                + '$variable-name: blur-effect;\n',
            );
        });

        it('should not combine shadow and blur effects', async () => {
            await outputter({
                output: 'output-folder',
            })([
                mockEffect([
                    mockShadow('shadow-effect-1'),
                    mockBlur('blur-effect-1'),
                    mockShadow('shadow-effect-2'),
                ]),
            ]);

            expect(writeFileSync).to.be.calledOnce;
            expect(writeFileSync).to.be.calledWith(
                sinon.match.any,

                // eslint-disable-next-line indent
                  '\n\n'
                + '$variable-name: shadow-effect-1, shadow-effect-2;\n',
            );
        });
    });

    describe('texts', () => {
        it('should be able to extract a text', async () => {
            await outputter({
                output: 'output-folder',
            })([
                mockText(),
            ]);

            expect(writeFileSync).to.be.calledOnce;
            expect(writeFileSync).to.be.calledWith(
                sinon.match.any,

                // eslint-disable-next-line indent
                  '\n\n'
                + '$variable-name: (\n'
                + '  "font-family": "Verdana",\n'
                + '  "font-size": 12px,\n'
                + '  "font-style": italic,\n'
                + '  "font-variant": normal,\n'
                + '  "font-weight": 100,\n'
                + '  "letter-spacing": 10px,\n'
                + '  "line-height": 12px,\n'
                + '  "text-align": left,\n'
                + '  "text-decoration": none,\n'
                + '  "text-transform": uppercase,\n'
                + '  "vertical-align": middle\n'
                + ');\n',
            );
        });
    });
});
