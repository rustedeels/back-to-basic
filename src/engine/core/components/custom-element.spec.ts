import {
  Assert,
  describe,
  it,
} from '/tests/index.js';

import { CustomElement } from './custom-element.js';
import {
  Attribute,
  WebComponent,
} from './decorators.js';
import { RenderResult } from './models.js';

@WebComponent('test-element')
class TestElem extends CustomElement<TestElem> {
  static readonly value = 'CONTENT';

  @Attribute('data-test')
  public dataTest = 'test';

  constructor() {
    super();
  }

  public render(): RenderResult {
    const div = document.createElement('div');
    div.style.display = 'none';
    div.innerText = TestElem.value;
    return div;
  }
}

describe('Custom Element', () => {

  it('Should be registed as custom element', () => {
    const elem = document.createElement('test-element');
    Assert.isTrue(elem instanceof TestElem);
  });

  it('Should be able to render', () => {
    const elem = document.createElement('test-element');
    document.body.appendChild(elem);
    const nodes = elem.childNodes;
    elem.setAttribute('data-test', 'test');

    Assert.isNotEmpty(nodes);
    const node = nodes[0];
    Assert.isInstanceOf(HTMLDivElement, node);
    Assert.isEqual(node.innerText, TestElem.value);
  });

});
