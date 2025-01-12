import { expect, use } from 'chai';
import chaiDom from 'chai-dom';
import { render, cleanup } from '@marko/testing-library';
import template from '../icons/ebay-add-24-icon';
import template2 from '../icons/ebay-arrow-left-24-icon';
import template3 from '../icons/ebay-arrow-right-24-icon';

use(chaiDom);
afterEach(cleanup);

/** @type import("@marko/testing-library").RenderResult */
let component;

function checkIcon(iconId) {
    const svg = document.body.firstChild.firstChild;
    expect(svg.tagName).to.equal('SVG');

    let iconAdd;
    svg.childNodes.forEach((child) => {
        expect(child.tagName).to.equal('symbol');
        if (child.id === iconId) {
            if (!!iconAdd) {
                throw new Error(`Found multiple ${iconId}, expect only 1.`);
            } else {
                iconAdd = child;
            }
        }
    });
    if (!iconAdd) {
        throw new Error(`${iconId} is not being added into SVG symbols`);
    }
}

describe('rendering an icon in the browser', () => {
    beforeEach(async () => {
        component = await render(template, { a11yText: 'icon' });
    });

    it('should create root SVG', () => {
        expect(document.body.firstChild.hasAttribute('hidden')).to.equal(true);
        expect(() => checkIcon('icon-add-24')).to.not.throw(Error);
    });

    it('should not have defs tag', () => {
        const icon = component.getByLabelText('icon');

        icon.childNodes.forEach((child) => {
            expect(child.tagName).to.not.equal('DEFS');
        });
    });
});

describe('rendering multiple icons in the browser', () => {
    beforeEach(async () => {
        await render(template, { a11yText: 'icon' });
        await render(template2, { a11yText: 'icon2' });
        await render(template3, { a11yText: 'icon3' });
        // render first template again;
        component = await render(template, { a11yText: 'another icon' });
    });

    it('should create root SVG', () => {
        expect(document.body.firstChild.hasAttribute('hidden')).to.equal(true);
        const svg = document.body.firstChild.firstChild;
        expect(svg.tagName).to.equal('SVG');

        expect(() => checkIcon('icon-add-24')).to.not.throw(Error);
        expect(() => checkIcon('icon-arrow-right-24')).to.not.throw(Error);
        expect(() => checkIcon('icon-arrow-left-24')).to.not.throw(Error);
        // Should have at least 3 icon symbols
        expect(svg.childNodes.length).to.be.greaterThan(2);
    });
});
