/* eslint-disable max-len */
/* eslint-disable object-curly-newline */

import sinon from 'sinon';
import { expect } from 'chai';

import * as Figma from 'figma-js';

import * as figmaStyles from './figmaStyles';

import file from './_mocks_/figma.files.json';
import fileNodes from './_mocks_/figma.fileNodes.json';

const nodeIds = Object.keys(fileNodes.nodes);

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

            expect(styleNodes.length).to.equal(23);
            expect(styleNodes.filter((node) => node?.id === '121:10')[0]?.name).to.equal('color-1');
            expect(styleNodes.filter((node) => node?.id === '121:10')[0]?.styleType).to.equal('FILL');
            expect(styleNodes.filter((node) => node?.id === '121:10')[0]?.type).to.equal('RECTANGLE');
        });
    });

    describe('parse', () => {
        let styleNodes: (Figma.Style & Figma.Node)[] = [];

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
                const node = styleNodes.find((n) => n.name === 'color-2');

                const parsed = figmaStyles.parseFigmaStyles([node]);

                expect(parsed).to.deep.equal([
                    {
                        styleType: 'FILL',
                        name: 'color-2',
                        comment: 'Purple',
                        fills: [{
                            type: 'SOLID',
                            color: {
                                r: 162,
                                g: 89,
                                b: 255,
                                a: 1,
                            },
                            value: 'rgba(162, 89, 255, 1)',
                        }],
                    },
                ]);
            });

            it('should parse a solid color with alpha (with comment on multi-line)', () => {
                const node = styleNodes.find((n) => n.name === 'color-alpha-50');

                const parsed = figmaStyles.parseFigmaStyles([node]);

                expect(parsed).to.deep.equal([
                    {
                        styleType: 'FILL',
                        name: 'color-alpha-50',
                        comment: 'Red color with 50% opacity +\nComment on multi-line.',
                        fills: [{
                            type: 'SOLID',
                            color: {
                                r: 242,
                                g: 78,
                                b: 30,
                                a: 0.5,
                            },
                            value: 'rgba(242, 78, 30, 0.5)',
                        }],
                    },
                ]);
            });

            it('should parse a linear gradient', () => {
                const node = styleNodes.find((n) => n.name === 'color-linear-gradient-complex');

                const parsed = figmaStyles.parseFigmaStyles([node]);

                expect(parsed).to.deep.equal([
                    {
                        styleType: 'FILL',
                        name: 'color-linear-gradient-complex',
                        comment: '',
                        fills: [{
                            type: 'GRADIENT_LINEAR',
                            angle: '135deg',
                            gradientStops: [
                                { color: { r: 242, g: 78, b: 30, a: 1 }, position: 0 },
                                { color: { r: 184, g: 89, b: 255, a: 1 }, position: 34.375 },
                                { color: { r: 10, g: 207, b: 131, a: 1 }, position: 64.583 },
                                { color: { r: 26, g: 188, b: 254, a: 1 }, position: 100 },
                            ],
                            value: 'linear-gradient(135deg, rgba(242, 78, 30, 1) 0%, rgba(184, 89, 255, 1) 34.375%, rgba(10, 207, 131, 1) 64.583%, rgba(26, 188, 254, 1) 100%)',
                        }],
                    },
                ]);
            });
        });
    });
});
