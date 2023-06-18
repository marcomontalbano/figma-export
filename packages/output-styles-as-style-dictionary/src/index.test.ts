import sinon from 'sinon';
import { expect } from 'chai';
import {
    StyleNode,
    FillStyle,
    EffectStyle,
    Style,
} from '@figma-export/types';
import { camelCase } from '@figma-export/utils';

import fs from 'fs';
import path from 'path';
import outputter from './index';

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
        fontFamily: 'Roboto Condensed',
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

describe('style output as style-dictionary json', () => {
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
        expect(writeFileSync).to.be.calledWithMatch(path.join('output-folder', 'base.json'), '');
    });

    it('should be able to change the filename, the extension and output folder', async () => {
        await outputter({
            output: 'output-folder',
            getExtension: () => 'JSON',
            getFilename: () => 'base-file',
        })([]);

        expect(writeFileSync).to.be.calledOnce;
        expect(writeFileSync).to.be.calledWithMatch(path.join('output-folder', 'base-file.json'));
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

            JSON.stringify({
                grey: {
                    900: {
                        comment: 'lorem ipsum',
                        value: 'rgba(26, 26, 26, 1)',
                    },
                },
            }, undefined, 2),
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

            JSON.stringify({
                greyDark: {
                    comment: 'lorem ipsum',
                    value: 'rgba(26, 26, 26, 1)',
                },
            }, undefined, 2),
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
            expect(writeFileSync).to.be.calledWithMatch(path.join('output-folder', 'base.json'), '');
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

                JSON.stringify({
                    variable: {
                        name: {
                            comment: 'lorem ipsum',
                            value: 'rgba(solid-1)',
                        },
                    },
                }, undefined, 2),
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

                JSON.stringify({
                    variable: {
                        name: {
                            comment: 'lorem ipsum',
                            value: 'linear-gradient-1, linear-gradient-2',
                        },
                    },
                }, undefined, 2),
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

                JSON.stringify({
                    variable: {
                        name: {
                            value: 'shadow-effect-1, shadow-effect-2',
                        },
                    },
                }, undefined, 2),
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

                JSON.stringify({
                    variable: {
                        name: {
                            value: 'blur-effect',
                        },
                    },
                }, undefined, 2),
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

                JSON.stringify({
                    variable: {
                        name: {
                            value: 'shadow-effect-1, shadow-effect-2',
                        },
                    },
                }, undefined, 2),
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

                JSON.stringify({
                    variable: {
                        name: {
                            font: {
                                family: {
                                    value: '"Roboto Condensed"',
                                },
                                size: {
                                    value: '12px',
                                },
                                style: {
                                    value: 'italic',
                                },
                                variant: {
                                    value: 'normal',
                                },
                                weight: {
                                    value: '100',
                                },
                            },
                            letter: {
                                spacing: {
                                    value: '10px',
                                },
                            },
                            line: {
                                height: {
                                    value: '12px',
                                },
                            },
                            text: {
                                align: {
                                    value: 'left',
                                },
                                decoration: {
                                    value: 'none',
                                },
                                transform: {
                                    value: 'uppercase',
                                },
                            },
                            vertical: {
                                align: {
                                    value: 'middle',
                                },
                            },
                        },
                    },
                }, undefined, 2),
            );
        });
    });
});
