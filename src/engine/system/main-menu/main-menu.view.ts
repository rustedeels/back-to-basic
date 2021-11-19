import {
  RenderResult,
  WebComponent,
} from '/engine/core/composition/components/index.js';
import { CustomElement } from '/engine/core/composition/index.js';

@WebComponent('sc-main-menu')
export class MainMenuView extends CustomElement<MainMenuView> {

  public render(): RenderResult | Promise<RenderResult> {
    return '<p></p>';
  }

}
