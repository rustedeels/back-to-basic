/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  IShowcase,
  IShowcaseProps,
} from './models.js';

const selectedKey = '#name-selected';

function buildNameListContainer(root: HTMLElement): HTMLElement {
  const container = document.createElement('div');
  container.classList.add('sc-name-list__container');
  root.appendChild(container);
  return container;
}

function buildViewContainer(root: HTMLElement): HTMLElement {
  const container = document.createElement('div');
  container.classList.add('sc-view__container');
  root.appendChild(container);
  return container;
}

function getItemName(n: string): string {
  return (n ?? '').replaceAll(' ', '-').trim().toLowerCase();
}

function buildNamelistItem(name: string, root: HTMLElement): HTMLElement {
  const item = document.createElement('div');
  item.classList.add('sc-name-list__item', `item-${getItemName(name)}`);
  item.innerText = name;
  root.appendChild(item);
  return item;
}

function toggleSelected(name: string) {
  const items = document.querySelectorAll('sc-name-list__item');
  for (const item of items) { item.classList.remove('selected'); }
  const item = document.querySelector(`.item-${getItemName(name)}`);
  if (item) {
    item.classList.add('selected');
    localStorage.setItem(selectedKey, name);
  } else {
    localStorage.setItem(selectedKey, '');
  }
}

function selectFromLocalStorate(): string | undefined {
  const name = localStorage.getItem(selectedKey);
  if (name) { toggleSelected(name); }
  return name || undefined;
}

function buildClassTable(root: HTMLElement, classes: { [key: string]: string }) {
  if (!Object.keys(classes).length) { return; }

  const classTable = document.createElement('table');
  classTable.classList.add('sc-view__class-table');
  root.appendChild(classTable);

  const classTableHead = document.createElement('thead');
  classTable.appendChild(classTableHead);

  const classTableHeadRow = document.createElement('tr');
  classTableHeadRow.innerHTML = '<th>Class</th><th>Description</th>';
  classTableHead.appendChild(classTableHeadRow);

  const classTableBody = document.createElement('tbody');
  classTable.appendChild(classTableBody);

  for (const [key, value] of Object.entries(classes)) {
    const classTableRow = document.createElement('tr');
    classTableRow.innerHTML = `<td>${key}</td><td>${value}</td>`;
    classTableBody.appendChild(classTableRow);
  }
}

function buildPropsTable<T extends object>(root: HTMLElement, props: { [key in keyof T]?: IShowcaseProps }) {
  if (!Object.keys(props).length) { return; }

  const propsTable = document.createElement('table');
  propsTable.classList.add('sc-view__props-table');
  root.appendChild(propsTable);

  const propsTableHead = document.createElement('thead');
  propsTable.appendChild(propsTableHead);

  const propsTableHeadRow = document.createElement('tr');
  propsTableHeadRow.innerHTML = '<th>Prop</th><th>Type</th><th>Default</th><th>Required</th><th>Description</th>';
  propsTableHead.appendChild(propsTableHeadRow);

  const propsTableBody = document.createElement('tbody');
  propsTable.appendChild(propsTableBody);

  for (const [key, value] of Object.entries(props) as [keyof T, IShowcaseProps][]) {
    if (!value) { continue; }
    const propsTableRow = document.createElement('tr');
    propsTableRow.innerHTML = `
    <td>${key}</td>
    <td>${value.type}</td>
    <td>${value.defaultValue}</td>
    <td>${value.required ? 'Yes' : 'No'}</td>
    <td>${value.description}</td>`;
    propsTableBody.appendChild(propsTableRow);
  }
}

function buildView(showcase: IShowcase<any>, root: HTMLElement) {
  root.innerHTML = '';
  const title = document.createElement('h1');
  title.classList.add('sc-view__title');
  title.innerText = showcase.name;
  root.appendChild(title);

  const tag = document.createElement('span');
  tag.classList.add('sc-view__tag');
  tag.innerText = showcase.htmlTag;
  title.appendChild(tag);

  const description = document.createElement('p');
  description.classList.add('sc-view__description');
  description.innerText = showcase.description;
  root.appendChild(description);

  buildClassTable(root, showcase.classNames);
  buildPropsTable(root, showcase.props);
}

export function renderShowcase(showcase: Map<string, IShowcase<any>>, rootId: string) {
  const root = document.getElementById(rootId);
  if (!root) { throw new Error('Root element not found'); }

  const nameListContainer = buildNameListContainer(root);
  const viewContainer = buildViewContainer(root);

  function renderView(target: string) {
    toggleSelected(target);
    const comp = showcase.get(target);
    if (!comp) {
      viewContainer.innerHTML = 'Error';
      throw new Error(`Showcase not found for ${target}`);
    }
    buildView(comp, viewContainer);
  }

  function renderNameList() {
    nameListContainer.innerHTML = '';
    showcase.forEach((_, key) => {
      const item = buildNamelistItem(key, nameListContainer);
      item.addEventListener('click', () => renderView(key));
    });
  }

  renderNameList();
  const name = selectFromLocalStorate();
  if (name) { renderView(name); }
}
