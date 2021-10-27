import {
  Assert,
  describe,
  it,
} from '/tests/index.js';

import { CustomElement } from './custom-element.js';
import {
  Attribute,
  Watch,
  WebComponent,
} from './decorators.js';
import { RenderResult } from './models.js';

@WebComponent('test-element')
class TestElem extends CustomElement<TestElem> {
  static readonly value = 'CONTENT';

  @Attribute('data-test')
  declare dataTest: string;

  @Attribute('n', { type: Number })
  declare xTest: number;

  batatas = 'batatas';

  _trigger = false;

  public get isTrigger(): boolean {
    return this._trigger;
  }

  constructor() {
    super();
  }

  public off(): void {
    this._trigger = false;
  }

  @Watch('n')
  public onNChange(nOld: number, nNew: number): void {
    this._trigger = true;
    console.log(`${nOld} -> ${nNew}`);
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

  it('Should bind to simple attributes', () => {
    const elem = document.createElement('test-element') as TestElem;

    elem.setAttribute('data-test', 'test');
    Assert.isEqual(elem.dataTest, 'test');

    elem.setAttribute('n', '10');
    Assert.isEqual(elem.xTest, 10);
    elem.xTest = 25;
    Assert.isEqual(elem.getAttribute('n'), '25');

    elem.setAttribute('batatas', 'batatas2');
    Assert.isNotEqual(elem.batatas, 'batatas2');
  });

  it('should trigger watch methods when value changes', () => {
    const elem = document.createElement('test-element') as TestElem;
    elem.xTest = 10;

    Assert.isTrue(elem.isTrigger);
    elem.off();
    Assert.isFalse(elem.isTrigger);
    elem.xTest = 10;
    Assert.isFalse(elem.isTrigger);

    elem.setAttribute('n', '15');
    Assert.isTrue(elem.isTrigger);

  });

  it('Should be able to render', () => {
    const elem = document.createElement('test-element');
    document.body.appendChild(elem);
    const nodes = elem.childNodes;
    Assert.isNotEmpty(nodes);
    const node = nodes[0];
    Assert.isInstanceOf(HTMLDivElement, node);
    Assert.isEqual(node.innerText, TestElem.value);
  });

});
