import { sleep } from '/engine/helpers/utils.js';
import {
  Assert,
  describe,
  it,
  setup,
} from '/tests/index.js';

import { appContainer } from '../../dependency-container/index.js';
import { IViewRender } from './model.js';
import { ViewRenderService } from './view-render.js';

describe('View Render', () => {

  const viewRenderService = appContainer.resolve(ViewRenderService);

  const viewRender = {
    hasRendered: false,
    reset: () => viewRender.hasRendered = false,
    engine: <IViewRender>{
      render: () => {
        viewRender.hasRendered = true;
        return Promise.resolve();
      }
    }
  };


  function reset() {
    viewRenderService.reset();
    viewRender.reset();
  }

  setup(async () => {
    viewRenderService.addItem({
      id: '1',
      tag: 'div',
    }, {
      id: '2',
      tag: 'div',
    });

    await viewRenderService.init(viewRender.engine);
  });

  it('Should trigger render on changing active view', async () => {
    reset();

    Assert.isFalse(viewRender.hasRendered);
    viewRenderService.activateView('1');
    await sleep(100);
    Assert.isTrue(viewRender.hasRendered);

    Assert.isEqual(viewRenderService.currentItem.id, '1');
  });

  it('Should throw and set fail state on invalid view id', async () => {
    reset();

    await Assert.throwsAsync(async () => {
      viewRenderService.activateView('3');
      await sleep(100);
      await viewRenderService.triggerRender();
    });

    Assert.isTrue(viewRenderService.hasFailed);
  });

  it('Should disable fail state on success render', async () => {
    reset();

    await Assert.throwsAsync(async () => {
      viewRenderService.activateView('3');
      await sleep(100);
      await viewRenderService.triggerRender();
    });

    viewRenderService.activateView('1');
    await sleep(100);

    Assert.isFalse(viewRenderService.hasFailed);
  });

  it('Should allow to return to prev view', async () => {
    reset();

    viewRenderService.activateView('1');
    await sleep(100);

    Assert.isEqual(viewRenderService.currentItem.id, '1');

    viewRenderService.activateView('2');
    await sleep(100);

    Assert.isEqual(viewRenderService.currentItem.id, '2');

    viewRenderService.renderLastView();
    await sleep(100);

    Assert.isEqual(viewRenderService.currentItem.id, '1');
  });

  it('Should trigger render on view replace', async () => {
    reset();

    viewRenderService.activateView('1');
    await sleep(100);
    Assert.isTrue(viewRender.hasRendered);

    viewRender.reset();
    Assert.isFalse(viewRender.hasRendered);

    viewRenderService.addItem({
      id: '1',
      tag: 'div',
    });
    await sleep(100);
    Assert.isTrue(viewRender.hasRendered);
  });

});
