/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
interface TestUnit {
  id: string;
  name: string;
  runTest: () => void | Promise<void>;
}

interface TestSuite {
  id: string;
  name: string;
  units: TestUnit[];
}

interface TestResult {
  id: string;
  name: string;
  passed: boolean;
  message?: string;
}

interface SuiteResult {
  id: string;
  name: string;
  results: TestResult[];
  total: number;
  passed: number;
  failed: number;
}

interface TestTotalResult {
  total: number;
  passed: number;
  failed: number;
}

function createId(): string {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (typeof crypto.randomUUID === 'function') {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return crypto.randomUUID();
  }

  return Math.random().toString(36).substr(2, 9);
}

const suitsToTest: [string, () => void][] = [];
let suite: TestSuite = {
  id: '',
  name: '',
  units: []
};

export class Assert {
  static isTrue(value: boolean, message?: string): void {
    if (!value) {
      throw new Error(message ?? 'Assertion failed, value is false');
    }
  }

  static isFalse(value: boolean, message?: string): void {
    if (value) {
      throw new Error(message ?? 'Assertion failed, value is true');
    }
  }

  static isEqual(value1: any, value2: any, message?: string): void {
    if (value1 !== value2) {
      throw new Error(message ?? `Assertion failed, values are not equal: ${value1} !== ${value2}`);
    }
  }

  static isNotEqual(value1: any, value2: any, message?: string): void {
    if (value1 === value2) {
      throw new Error(message ?? `Assertion failed, values are equal: ${value1} === ${value2}`);
    }
  }

  static isNull(value: any, message?: string): void {
    if (value !== null) {
      throw new Error(message ?? `Assertion failed, value is not null: ${value}`);
    }
  }

  static isNotNull(value: any, message?: string): void {
    if (value === null) {
      throw new Error(message ?? `Assertion failed, value is null: ${value}`);
    }
  }

  static isUndefined(value: any, message?: string): void {
    if (value !== undefined) {
      throw new Error(message ?? `Assertion failed, value is not undefined: ${value}`);
    }
  }

  static isNotUndefined(value: any, message?: string): void {
    if (value === undefined) {
      throw new Error(message ?? `Assertion failed, value is undefined: ${value}`);
    }
  }

  static isEmpty(value: any, message?: string): void {
    if (value !== '') {
      throw new Error(message ?? `Assertion failed, value is not empty: ${value}`);
    }
  }

  static isNotEmpty(value: any, message?: string): void {
    if (value === '') {
      throw new Error(message ?? `Assertion failed, value is empty: ${value}`);
    }
  }

  static isNullOrUndefined(value: any, message?: string): void {
    if (value !== null && value !== undefined) {
      throw new Error(message ?? `Assertion failed, value is not null or undefined: ${value}`);
    }
  }

  static isNotNullOrUndefined(value: any, message?: string): void {
    if (value === null || value === undefined) {
      throw new Error(message ?? `Assertion failed, value is null or undefined: ${value}`);
    }
  }

  static throws(fn: () => void, message?: string): void {
    try {
      fn();
    } catch (e) {
      console.log('Assert.throws: ', e);
      return;
    }

    throw new Error(message ?? 'Assertion failed, function did not throw');
  }
}

export function describe(name: string, action: () => void) {
  suitsToTest.push([name, action]);
}

export function it(name: string, runTest: () => void | Promise<void>) {
  const testUnit: TestUnit = {
    id: createId(),
    name,
    runTest
  };
  suite.units.push(testUnit);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
it.skip = function (..._: unknown[]): void { /** */ };

function callRender(render: () => void): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        render();
        resolve();
      } catch (e) {
        console.error(e);
        reject(e);
      }
    }, 0);
  });
}

function renderToTest(toTest: TestSuite[]) {
  for (const s of toTest) {
    const root = document.createElement('div');
    root.classList.add('test-suite', 'test-suite-pending');
    root.id = s.id;
    root.setAttribute('data-total', s.units.length.toString());
    root.setAttribute('data-name', s.name);
    root.setAttribute('data-passed', '0');
    root.setAttribute('data-failed', '0');

    const header = document.createElement('div');
    header.classList.add('test-suite-header');
    header.innerText = s.name;
    header.addEventListener('click', () => {
      const el = document.getElementById(s.id);
      if (!el) return;
      el.classList.toggle('test-suite-closed');
    });
    root.appendChild(header);

    const body = document.createElement('div');
    body.classList.add('test-suite-body');
    root.appendChild(body);

    for (const u of s.units) {
      const unit = document.createElement('div');
      unit.classList.add('test-unit', 'test-unit-pending');
      unit.id = u.id;
      unit.setAttribute('data-message', '');

      const unitHeader = document.createElement('div');
      unitHeader.classList.add('test-unit-header');
      unitHeader.innerText = u.name;
      unit.appendChild(unitHeader);

      body.appendChild(unit);
    }
    document.body.appendChild(root);
  }
  document.body.classList.remove('test-loading');
}

function renderRunningSuite(suiteId: string, unitId: string) {
  const suite = document.getElementById(suiteId);
  const unit = document.getElementById(unitId);
  suite?.classList.replace('test-suite-pending', 'test-suite-running');
  unit?.classList.replace('test-unit-pending', 'test-unit-running');
}

function renderUnitResult(result: TestResult) {
  const unit = document.getElementById(result.id);
  unit?.classList.replace('test-unit-running', result.passed ? 'test-unit-passed' : 'test-unit-failed');
  unit?.setAttribute('data-message', result.message || '');
}

function renderSuiteResult(result: SuiteResult) {
  const suite = document.getElementById(result.id);
  suite?.classList.replace('test-suite-running', result.passed ? 'test-suite-passed' : 'test-suite-failed');
  suite?.setAttribute('data-passed', result.passed.toString());
  suite?.setAttribute('data-failed', result.failed.toString());
}

function renderTotalResult(result: TestTotalResult) {
  const totalResult = document.createElement('div');
  totalResult.classList.add('test-total-result');

  const total = document.createElement('div');
  total.classList.add('test-total-result-total');
  total.innerText = `Total: ${result.total}`;
  totalResult.appendChild(total);

  const passed = document.createElement('div');
  passed.classList.add('test-total-result-passed');
  passed.innerText = `Passed: ${result.passed}`;
  totalResult.appendChild(passed);

  const failed = document.createElement('div');
  failed.classList.add('test-total-result-failed');
  failed.innerText = `Failed: ${result.failed}`;
  totalResult.appendChild(failed);

  document.body.prepend(totalResult);
}

export async function runUnitTests(suiteId: string, unit: TestUnit) {
  await callRender(() => renderRunningSuite(suiteId, unit.id));

  const result: TestResult = {
    id: unit.id,
    name: unit.name,
    passed: false
  };

  console.groupCollapsed(unit.name);
  try {
    await unit.runTest();
    result.passed = true;
  }
  catch (e) {
    console.error(e);
    result.message = String(e);
  }
  console.groupEnd();

  await callRender(() => renderUnitResult(result));
  return result;
}

export async function runTests() {
  const results: SuiteResult[] = [];
  const toTest: TestSuite[] = [];

  for (const [name, action] of suitsToTest) {
    suite = {
      id: createId(),
      name,
      units: []
    };
    action();
    toTest.push(suite);
  }

  await callRender(() => renderToTest(toTest));

  for (const s of toTest) {
    console.groupCollapsed(s.name);
    const result: SuiteResult = {
      id: s.id,
      name: s.name,
      results: [],
      total: s.units.length,
      passed: 0,
      failed: 0
    };

    for (const u of s.units) {
      const unitResult = await runUnitTests(s.id, u);
      result.results.push(unitResult);
      if (unitResult.passed) {
        result.passed++;
      } else {
        result.failed++;
      }
    }

    await callRender(() => renderSuiteResult(result));
    results.push(result);
    console.groupEnd();
  }

  const totalResult: TestTotalResult = {
    total: 0,
    passed: 0,
    failed: 0
  };

  for (const r of results) {
    totalResult.total += r.total;
    totalResult.passed += r.passed;
    totalResult.failed += r.failed;
  }

  await callRender(() => renderTotalResult(totalResult));
}
