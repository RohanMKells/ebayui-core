const assign = require('core-js-pure/features/object/assign');
const { expect, use } = require('chai');
const { render, fireEvent, cleanup, wait } = require('@marko/testing-library');
const { fastAnimations } = require('../../../common/test-utils/browser');
const mock = require('./mock');
const template = require('..');

use(require('chai-dom'));
before(fastAnimations.start);
after(fastAnimations.stop);
afterEach(cleanup);
let component;

describe('given the details is in the default state', () => {
    const input = mock.Default_Details;

    beforeEach(async() => {
        component = await render(template, input);
    });

    it('should render with open false', () => {
        expect(component.getByText(input.text).closest('details').open).to.equal(false);
    });
});

describe('given the details is in the open state', () => {
    const input = mock.Open_Details;

    beforeEach(async() => {
        component = await render(template, input);
    });

    it('should render with open false', () => {
        expect(component.getByText(input.text).closest('details').open).to.equal(true);
    });
});

describe('given the details is in the default state and click is triggered', () => {
    const input = mock.Default_Details;
    const detailsText = input.text;

    beforeEach(async() => {
        component = await render(template, input);
    });

    describe('click on details', () => {
        beforeEach(async() => {
            await fireEvent.click(component.getByText(detailsText));
        });

        it('then it emits the details-toggle and click', async() => {
            wait(() => verifyToggleEvent());
            wait(() => verifyClickEvent());
        });
    });

    describe('details should properly toggle open property', () => {
        beforeEach(async() => {
            await component.rerender(assign({}, input, { open: true }));
        });

        it('then it should have open true', () => {
            expect(component.getByText(detailsText).closest('details').open).to.equal(true);
        });
        describe('click after rerender', () => {
            beforeEach(async() => {
                await fireEvent.click(component.getByText(detailsText).parentNode);
            });

            it('then it should be closed', async() => {
                wait(() => verifyToggleEvent());
                wait(() => verifyClickEvent());
            });
        });
    });
});

describe('given the details is in the open state and click is triggered', () => {
    const input = mock.Open_Details;
    const detailsText = input.text;

    beforeEach(async() => {
        component = await render(template, input);
    });

    describe('click on details', () => {
        beforeEach(async() => {
            await fireEvent.click(component.getByText(detailsText));
        });

        it('then it emits the details-toggle and click', async() => {
            wait(() => verifyToggleEvent());
            wait(() => verifyClickEvent());
        });
    });

    describe('details should properly toggle open property', () => {
        beforeEach(async() => {
            await component.rerender(assign({}, input, { open: false }));
        });

        it('then it should have open true', () => {
            expect(component.getByText(detailsText).closest('details').open).to.equal(false);
        });
        describe('click after rerender', () => {
            beforeEach(async() => {
                await fireEvent.click(component.getByText(detailsText).parentNode);
            });
            it('then it should be open', async() => {
                wait(() => verifyToggleEvent());
                wait(() => verifyClickEvent());
            });
        });
    });
});

function verifyToggleEvent() {
    const toggleEvent = component.emitted('details-toggle');
    expect(toggleEvent.length).to.be.greaterThan(0);

    const [eventArg] = toggleEvent.pop();
    expect(eventArg).has.property('open');
    expect(eventArg).has.property('originalEvent').is.an.instanceOf(Event);
}

function verifyClickEvent() {
    const toggleEvent = component.emitted('details-click');
    expect(toggleEvent).to.length(1);
    const [[eventArg]] = toggleEvent;
    expect(eventArg).has.property('originalEvent').is.an.instanceOf(Event);
}
