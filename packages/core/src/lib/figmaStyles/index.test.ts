/* eslint-disable max-len */
/* eslint-disable object-curly-newline */

import sinon from 'sinon';
import { expect } from 'chai';

import * as Figma from 'figma-js';
import * as FigmaExport from '@figma-export/types';

import * as figmaStyles from './index';

import file from '../_mocks_/figma.files.json';
import fileNodes from '../_mocks_/figma.fileNodes.json';

const nodeIds = Object.keys(fileNodes.nodes);

const getNode = (styleNodes: FigmaExport.StyleNode[], name: string): FigmaExport.StyleNode => {
    const node = styleNodes.find((n) => n.name === name);

    if (!node) {
        throw new Error('\'node\' cannot be undefined');
    }

    return node;
};

describe('figmaStyles.', () => {
    describe('fetch', () => {
        it('should throw an error if styles are not present', async () => {
            const client = {
                ...({} as Figma.ClientInterface),
                file: sinon.stub().resolves({ data: {} }),
            };

            await expect(figmaStyles.fetchStyles(client, 'ABC123')).to.be.rejectedWith(Error, '\'styles\' are missing.');
        });

        it('should fetch style from a specified Figma fileId', async () => {
            const client = {
                ...({} as Figma.ClientInterface),
                file: sinon.stub().resolves({
                    data: {
                        styles: {
                            '121:10': { name: 'color-1', styleType: 'FILL' },
                            '131:20': { name: 'text-A', styleType: 'TEXT' },
                        },
                    },
                }),
                fileNodes: sinon.stub().resolves({
                    data: {
                        nodes: {
                            '121:10': {
                                document: { id: '121:10', name: 'color-1' },
                            },
                            '131:20': {
                                document: { id: '131:20', name: 'text-A' },
                            },
                        },
                    },
                }),
            };

            const styleNodes = await figmaStyles.fetchStyles(client, 'ABC123');

            expect(client.file).to.have.been.calledOnceWith('ABC123');
            expect(client.fileNodes).to.have.been.calledWith('ABC123', { ids: ['121:10', '131:20'] });

            expect(styleNodes.length).to.equal(2);
            expect(styleNodes).to.deep.equal([
                { id: '121:10', name: 'color-1', styleType: 'FILL' },
                { id: '131:20', name: 'text-A', styleType: 'TEXT' },
            ]);
        });

        it('should fetch style from a specified Figma fileId using a real example (mocked)', async () => {
            const client = {
                ...({} as Figma.ClientInterface),
                file: sinon.stub().resolves({ data: file }),
                fileNodes: sinon.stub().resolves({ data: fileNodes }),
            };

            const styleNodes = await figmaStyles.fetchStyles(client, 'ABC123');

            expect(client.file).to.have.been.calledOnceWith('ABC123');
            expect(client.fileNodes).to.have.been.calledWith('ABC123', { ids: nodeIds });

            const expectedStyleNodesLength = 30;
            const expectedUnusedLength = 1;
            expect(styleNodes.length).to.equal(expectedStyleNodesLength);
            expect(styleNodes.filter((node) => node.visible === false).map((node) => node.name)).to.deep.equal(['black']);
            expect(styleNodes.filter((node) => node.visible !== false).length).to.equal(expectedStyleNodesLength - expectedUnusedLength);
            expect(styleNodes.filter((node) => node?.id === '121:10')[0]?.name).to.equal('color-1');
            expect(styleNodes.filter((node) => node?.id === '121:10')[0]?.styleType).to.equal('FILL');
            expect(styleNodes.filter((node) => node?.id === '121:10')[0]?.type).to.equal('RECTANGLE');
        });
    });

    describe('parse', () => {
        let styleNodes: FigmaExport.StyleNode[] = [];

        beforeEach(async () => {
            const client = {
                ...({} as Figma.ClientInterface),
                file: sinon.stub().resolves({ data: file }),
                fileNodes: sinon.stub().resolves({ data: fileNodes }),
            };

            styleNodes = await figmaStyles.fetchStyles(client, 'ABC123');
        });

        describe('Color Styles', () => {
            it('should parse a solid color', () => {
                const node = getNode(styleNodes, 'color-2');

                const parsed = figmaStyles.parseStyles([node]);

                expect(parsed).to.deep.equal([
                    {
                        styleType: 'FILL',
                        visible: true,
                        name: 'color-2',
                        comment: 'Purple',
                        originalNode: node,
                        fills: [{
                            type: 'SOLID',
                            visible: true,
                            color: {
                                r: 162,
                                g: 89,
                                b: 255,
                                a: 1,
                                rgba: 'rgba(162, 89, 255, 1)',
                            },
                            value: 'rgba(162, 89, 255, 1)',
                        }],
                    },
                ]);
            });

            it('should parse a solid color with alpha (with comment on multi-line)', () => {
                const node = getNode(styleNodes, 'color-alpha-50');

                const parsed = figmaStyles.parseStyles([node]);

                expect(parsed).to.deep.equal([
                    {
                        styleType: 'FILL',
                        visible: true,
                        name: 'color-alpha-50',
                        comment: 'Red color with 50% opacity +\nComment on multi-line.',
                        originalNode: node,
                        fills: [{
                            type: 'SOLID',
                            visible: true,
                            color: {
                                r: 242,
                                g: 78,
                                b: 30,
                                a: 0.5,
                                rgba: 'rgba(242, 78, 30, 0.5)',
                            },
                            value: 'rgba(242, 78, 30, 0.5)',
                        }],
                    },
                ]);
            });

            it('should parse a linear gradient', () => {
                const node = getNode(styleNodes, 'color-figma-gradient');

                const parsed = figmaStyles.parseStyles([node]);

                expect(parsed).to.deep.equal([
                    {
                        styleType: 'FILL',
                        visible: true,
                        name: 'color-figma-gradient',
                        comment: '',
                        originalNode: node,
                        fills: [
                            {
                                type: 'GRADIENT_LINEAR',
                                visible: true,
                                angle: '90deg',
                                gradientStops: [
                                    { color: { r: 242, g: 78, b: 30, a: 1, rgba: 'rgba(242, 78, 30, 1)' }, position: 0 },
                                    { color: { r: 184, g: 89, b: 255, a: 1, rgba: 'rgba(184, 89, 255, 1)' }, position: 34.375 },
                                    { color: { r: 26, g: 188, b: 254, a: 1, rgba: 'rgba(26, 188, 254, 1)' }, position: 67.708 },
                                    { color: { r: 10, g: 207, b: 131, a: 1, rgba: 'rgba(10, 207, 131, 1)' }, position: 100 },
                                ],
                                value: 'linear-gradient(90deg, rgba(242, 78, 30, 1) 0%, rgba(184, 89, 255, 1) 34.375%, rgba(26, 188, 254, 1) 67.708%, rgba(10, 207, 131, 1) 100%)',
                            },
                            {
                                type: 'SOLID',
                                visible: false,
                                color: { r: 255, g: 255, b: 255, a: 1, rgba: 'rgba(255, 255, 255, 1)' },
                                value: 'rgba(255, 255, 255, 1)',
                            },
                        ],
                    },
                ]);
            });

            it('should parse a linear gradient with alpha', () => {
                const node = getNode(styleNodes, 'color-figma-gradient-10');

                const parsed = figmaStyles.parseStyles([node]);

                expect(parsed).to.deep.equal([
                    {
                        styleType: 'FILL',
                        visible: true,
                        name: 'color-figma-gradient-10',
                        comment: '',
                        originalNode: node,
                        fills: [
                            {
                                type: 'GRADIENT_LINEAR',
                                visible: true,
                                angle: '90deg',
                                gradientStops: [
                                    { color: { r: 242, g: 78, b: 30, a: 0.1, rgba: 'rgba(242, 78, 30, 0.1)' }, position: 0 },
                                    { color: { r: 184, g: 89, b: 255, a: 0.1, rgba: 'rgba(184, 89, 255, 0.1)' }, position: 34.375 },
                                    { color: { r: 26, g: 188, b: 254, a: 0.1, rgba: 'rgba(26, 188, 254, 0.1)' }, position: 67.708 },
                                    { color: { r: 10, g: 207, b: 131, a: 0.1, rgba: 'rgba(10, 207, 131, 0.1)' }, position: 100 },
                                ],
                                value: 'linear-gradient(90deg, rgba(242, 78, 30, 0.1) 0%, rgba(184, 89, 255, 0.1) 34.375%, rgba(26, 188, 254, 0.1) 67.708%, rgba(10, 207, 131, 0.1) 100%)',
                            },
                            {
                                type: 'SOLID',
                                visible: true,
                                color: { r: 255, g: 255, b: 255, a: 1, rgba: 'rgba(255, 255, 255, 1)' },
                                value: 'rgba(255, 255, 255, 1)',
                            },
                        ],
                    },
                ]);
            });

            it('should parse a combination of colors and keep the right order', () => {
                const node = getNode(styleNodes, 'color-multi-gradient');

                const parsed = figmaStyles.parseStyles([node]);

                expect(parsed).to.deep.equal([
                    {
                        styleType: 'FILL',
                        visible: true,
                        name: 'color-multi-gradient',
                        comment: 'This color is composed by two linear gradient and one solid color',
                        originalNode: node,
                        fills: [
                            {
                                type: 'GRADIENT_LINEAR',
                                visible: true,
                                angle: '180deg',
                                gradientStops: [
                                    { color: { r: 255, g: 255, b: 255, a: 1, rgba: 'rgba(255, 255, 255, 1)' }, position: 0 },
                                    { color: { r: 255, g: 255, b: 255, a: 0, rgba: 'rgba(255, 255, 255, 0)' }, position: 100 },
                                ],
                                value: 'linear-gradient(180deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 100%)',
                            },
                            {
                                type: 'GRADIENT_LINEAR',
                                visible: true,
                                angle: '90deg',
                                gradientStops: [
                                    { color: { r: 184, g: 89, b: 255, a: 1, rgba: 'rgba(184, 89, 255, 1)' }, position: 0 },
                                    { color: { r: 255, g: 255, b: 255, a: 0, rgba: 'rgba(255, 255, 255, 0)' }, position: 100 },
                                ],
                                value: 'linear-gradient(90deg, rgba(184, 89, 255, 1) 0%, rgba(255, 255, 255, 0) 100%)',
                            },
                            {
                                type: 'SOLID',
                                visible: true,
                                color: {
                                    a: 1,
                                    b: 131,
                                    g: 207,
                                    r: 10,
                                    rgba: 'rgba(10, 207, 131, 1)',
                                },
                                value: 'rgba(10, 207, 131, 1)',
                            },
                        ],
                    },
                ]);
            });
        });

        describe('Effect Styles', () => {
            it('should not parse a non visible effect style', () => {
                const originalNode = getNode(styleNodes, 'inner-shadow');
                const node = {
                    ...originalNode,
                    effects: [{
                        ...(originalNode as Figma.Rectangle).effects[0],
                        visible: false,
                    }],
                };

                const parsed = figmaStyles.parseStyles([node]);

                expect(parsed).to.deep.equal([
                    {
                        styleType: 'EFFECT',
                        visible: true,
                        name: 'inner-shadow',
                        comment: '',
                        originalNode: node,
                        effects: [{
                            type: 'INNER_SHADOW',
                            visible: false,
                            offset: {
                                x: 4,
                                y: 5,
                            },
                            inset: true,
                            blurRadius: 10,
                            spreadRadius: 0,
                            color: {
                                r: 242,
                                g: 78,
                                b: 30,
                                a: 0.5,
                                rgba: 'rgba(242, 78, 30, 0.5)',
                            },
                            value: 'inset 4px 5px 10px 0px rgba(242, 78, 30, 0.5)',
                        }],
                    },
                ]);
            });

            it('should parse a Inner Shadow effect', () => {
                const node = getNode(styleNodes, 'inner-shadow');

                const parsed = figmaStyles.parseStyles([node]);

                expect(parsed).to.deep.equal([
                    {
                        styleType: 'EFFECT',
                        visible: true,
                        name: 'inner-shadow',
                        comment: '',
                        originalNode: node,
                        effects: [{
                            type: 'INNER_SHADOW',
                            visible: true,
                            offset: {
                                x: 4,
                                y: 5,
                            },
                            inset: true,
                            blurRadius: 10,
                            spreadRadius: 0,
                            color: {
                                r: 242,
                                g: 78,
                                b: 30,
                                a: 0.5,
                                rgba: 'rgba(242, 78, 30, 0.5)',
                            },
                            value: 'inset 4px 5px 10px 0px rgba(242, 78, 30, 0.5)',
                        }],
                    },
                ]);
            });

            it('should parse a Drop Shadow effect', () => {
                const node = getNode(styleNodes, 'drop-shadow');

                const parsed = figmaStyles.parseStyles([node]);

                expect(parsed).to.deep.equal([
                    {
                        styleType: 'EFFECT',
                        visible: true,
                        name: 'drop-shadow',
                        comment: '',
                        originalNode: node,
                        effects: [{
                            type: 'DROP_SHADOW',
                            visible: true,
                            offset: {
                                x: 3,
                                y: 4,
                            },
                            inset: false,
                            blurRadius: 7,
                            spreadRadius: 0,
                            color: {
                                r: 0,
                                g: 0,
                                b: 0,
                                a: 0.25,
                                rgba: 'rgba(0, 0, 0, 0.25)',
                            },
                            value: '3px 4px 7px 0px rgba(0, 0, 0, 0.25)',
                        }],
                    },
                ]);
            });

            it('should parse a Layer Blur effect', () => {
                const node = getNode(styleNodes, 'layer-blur');

                const parsed = figmaStyles.parseStyles([node]);

                expect(parsed).to.deep.equal([
                    {
                        styleType: 'EFFECT',
                        visible: true,
                        name: 'layer-blur',
                        comment: '',
                        originalNode: node,
                        effects: [{
                            type: 'LAYER_BLUR',
                            visible: true,
                            blurRadius: 4,
                            value: 'blur(4px)',
                        }],
                    },
                ]);
            });

            it('should parse a combination of effects and keep the right order', () => {
                const node = getNode(styleNodes, 'mixed-effects');

                const parsed = figmaStyles.parseStyles([node]);

                expect(parsed).to.deep.equal([
                    {
                        styleType: 'EFFECT',
                        visible: true,
                        name: 'mixed-effects',
                        comment: 'This mixed effect will not consider the Layer Blur.\nBlur and Shadow are not compatible.',
                        originalNode: node,
                        effects: [
                            {
                                type: 'INNER_SHADOW',
                                visible: true,
                                offset: {
                                    x: 0,
                                    y: 4,
                                },
                                inset: true,
                                blurRadius: 4,
                                spreadRadius: 0,
                                color: {
                                    r: 0,
                                    g: 0,
                                    b: 0,
                                    a: 0.25,
                                    rgba: 'rgba(0, 0, 0, 0.25)',
                                },
                                value: 'inset 0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
                            },
                            {
                                type: 'DROP_SHADOW',
                                visible: true,
                                offset: {
                                    x: 0,
                                    y: 4,
                                },
                                inset: false,
                                blurRadius: 4,
                                spreadRadius: 0,
                                color: {
                                    r: 0,
                                    g: 0,
                                    b: 0,
                                    a: 0.25,
                                    rgba: 'rgba(0, 0, 0, 0.25)',
                                },
                                value: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
                            },
                            {
                                type: 'LAYER_BLUR',
                                visible: true,
                                blurRadius: 4,
                                value: 'blur(4px)',
                            },
                        ],
                    },
                ]);
            });
        });

        describe('Text Styles', () => {
            it('should parse a Text style', () => {
                const node = getNode(styleNodes, 'h1');

                const parsed = figmaStyles.parseStyles([node]);

                expect(parsed).to.deep.equal([
                    {
                        styleType: 'TEXT',
                        visible: true,
                        name: 'h1',
                        comment: 'Page title',
                        originalNode: node,
                        style: {
                            fontFamily: 'Spinnaker',
                            fontSize: 24,
                            fontStyle: 'normal',
                            fontVariant: 'normal',
                            fontWeight: 400,
                            letterSpacing: 2,
                            lineHeight: 30,
                            textAlign: 'left',
                            textDecoration: 'underline',
                            textTransform: 'capitalize',
                            verticalAlign: 'top',
                        },
                    },
                ]);
            });
        });
    });
});
