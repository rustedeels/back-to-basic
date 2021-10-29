export const ID_INITIAL_RENDER_ITEM = '$initial-render-item';

export interface IRenderItem {
  id: string;
  /** Html tag to render */
  tag: string;
  /** Html attributes to render */
  attributes?: { [key: string]: string };
  /** Class names to add */
  classNames?: string[];
}

/** Events for render service */
export interface RenderEvents {
  /** Add new items to render collection */
  addRender: IRenderItem[];
  /** Set renderId and trigger its render process */
  activateView: string;
  /** Trigger render for current onde */
  refresh: never;
  /** Render the item before current, ignored if initial */
  renderLast: never;

  /** Event trigged befor render starts */
  renderStarting: string;
  /** Event trigged after render ends */
  renderCompleted: string;
}

/** Engine that can render an item */
export interface IViewRender {
  render(item: IRenderItem): Promise<void>;
}

export const INITIAL_RENDER_ITEM: IRenderItem = {
  id: ID_INITIAL_RENDER_ITEM,
  tag: 'p',
};
