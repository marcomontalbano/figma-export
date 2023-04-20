import sinon from 'sinon';
import { expect } from 'chai';
import nock from 'nock';

import * as Figma from 'figma-js';

import * as figmaDocument from './_config.test';
import * as figma from './figma';

describe('figma.', () => {
    beforeEach(() => {
        nock(figmaDocument.svg.domain, { reqheaders: { 'Content-Type': 'images/svg+xml' } })
            .get(figmaDocument.svg.path)
            .reply(200, figmaDocument.svg.content);
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('getComponents', () => {
        it('should get zero results if no children are provided', () => {
            expect(figma.getComponents()).to.eql([]);
        });

        it('should get all components from a list of children', () => {
            expect(figma.getComponents([
                figmaDocument.component1,
                figmaDocument.group1,
            ], undefined, [{ name: 'A Frame', type: 'FRAME' }])).to.eql([
                figmaDocument.componentOutput1,
                figmaDocument.componentOutput3,
            ]);
        });
    });

    describe('getPages', () => {
        const document = figmaDocument.createDocument({ children: [figmaDocument.page1, figmaDocument.page2] });

        it('should get all pages by default', () => {
            expect(figma.getPages(document))
                .to.contain.an.item.with.property('name', 'page1')
                .to.contain.an.item.with.property('name', 'page2');
        });

        it('should get all pages if "empty" list is provided', () => {
            expect(figma.getPages(document, { only: [''] }))
                .to.contain.an.item.with.property('name', 'page1')
                .to.contain.an.item.with.property('name', 'page2');

            expect(figma.getPages(document, { only: [] }))
                .to.contain.an.item.with.property('name', 'page1')
                .to.contain.an.item.with.property('name', 'page2');

            expect(figma.getPages(document, { only: '' }))
                .to.contain.an.item.with.property('name', 'page1')
                .to.contain.an.item.with.property('name', 'page2');
        });

        it('should get all requested pages', () => {
            expect(figma.getPages(document, { only: 'page2' }))
                .to.not.contain.an.item.with.property('name', 'page1')
                .to.contain.an.item.with.property('name', 'page2');

            expect(figma.getPages(document, { only: ['page1', 'page2'] }))
                .to.contain.an.item.with.property('name', 'page1')
                .to.contain.an.item.with.property('name', 'page2');
        });

        it('should get zero results if a non existing page is provided', () => {
            expect(figma.getPages(document, { only: 'page20' }))
                .to.be.an('array').that.is.empty;
        });

        it('should excludes pages without components', () => {
            const pages = figma.getPages(
                figmaDocument.createDocument({
                    children: [
                        figmaDocument.page1,
                        figmaDocument.pageWithoutComponents,
                    ],
                }),
            );

            expect(pages)
                .to.be.an('array')
                .to.contain.an.item.with.property('name', 'page1')
                .to.not.contain.an.item.with.property('name', 'page2');
        });
    });

    describe('getIdsFromPages', () => {
        it('should get component ids from specified pages', () => {
            const document = figmaDocument.createDocument({ children: [figmaDocument.page1, figmaDocument.page2] });
            const pages = figma.getPages(document, {
                only: 'page2',
            });

            expect(figma.getIdsFromPages(pages)).to.eql(['9:1']);
        });
    });

    describe('getClient', () => {
        it('should not create a figma client if no token is provided', () => {
            expect(() => {
                figma.getClient('');
            }).to.throw(Error);
        });

        it('should create a figma client providing a token', () => {
            sinon.spy(Figma, 'Client');
            figma.getClient('token1234');
            expect(Figma.Client).to.have.been.calledOnceWith({ personalAccessToken: 'token1234' });
        });
    });

    describe('fileImages', () => {
        it('should get a pair id-url based of provided ids', async () => {
            const client = {
                ...({} as Figma.ClientInterface),
                fileImages: sinon.stub().returns(Promise.resolve({
                    data: {
                        images: {
                            A1: 'https://example.com/A1.svg',
                            B2: 'https://example.com/B2.svg',
                        },
                    },
                })),
            };

            const fileImages = await figma.getImages(client, 'ABC123', ['A1', 'B2']);

            expect(client.fileImages).to.have.been.calledOnceWith('ABC123', {
                ids: ['A1', 'B2'],
                format: 'svg',
                svg_include_id: true,
            });

            expect(fileImages).to.deep.equal({
                A1: 'https://example.com/A1.svg',
                B2: 'https://example.com/B2.svg',
            });
        });

        it('should throw an error when connection issue', async () => {
            const client = {
                ...({} as Figma.ClientInterface),
                fileImages: sinon.stub().returns(Promise.reject(new Error('some network error'))),
            };

            await expect(figma.getImages(client, 'ABC123', ['A1', 'B2']))
                .to.be.rejectedWith(Error, 'while fetching fileImages: some network error');
        });
    });

    describe('fileSvgs', () => {
        it('should get a pair id-url based of provided ids', async () => {
            const client = {
                ...({} as Figma.ClientInterface),
                fileImages: sinon.stub().returns(Promise.resolve({
                    data: {
                        images: {
                            A1: figmaDocument.svg.url,
                            B1: figmaDocument.svg.url,
                        },
                    },
                })),
            };

            const fileSvgs = await figma.fileSvgs(client, 'ABC123', ['A1', 'B1']);

            expect(client.fileImages).to.have.been.calledOnceWith('ABC123', {
                ids: ['A1', 'B1'],
                format: 'svg',
                svg_include_id: true,
            });

            expect(fileSvgs).to.deep.equal({
                A1: figmaDocument.svg.content,
                B1: figmaDocument.svg.content,
            });
        });
    });

    describe.skip('enrichPagesWithSvg', () => {
        it('TODO: move here test from "export-components.test.ts"');
    });
});
