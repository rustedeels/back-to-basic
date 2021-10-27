import {
  Assert,
  describe,
  it,
} from '/tests/index.js';

import { StateMachine } from './state-machine.js';

interface TestState {
  state1: never;
  state2: never;
  state3: never;
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe('State Machine', () => {

  it('should be able to create a state machine', () => {
    const stateMachine = new StateMachine<TestState>('state1');
    Assert.isTrue(stateMachine instanceof StateMachine);
  });

  it('should be able to add a state', () => {
    const stateMachine = new StateMachine<TestState>('state1');
    stateMachine.next('state2');
    Assert.isEqual(stateMachine.current, 'state2');
  });

  it('should be able to add multiple states', () => {
    const stateMachine = new StateMachine<TestState>('state1');
    stateMachine.next('state2');
    stateMachine.next('state3');
    Assert.isEqual(stateMachine.current, 'state3');
  });

  it('should be able to add multiple states and go back', () => {
    const stateMachine = new StateMachine<TestState>('state1');
    stateMachine.next('state2');
    stateMachine.next('state3');
    stateMachine.prev();
    Assert.isEqual(stateMachine.current, 'state2');
  });

  it('should be able to add multiple states and go back to the first state', () => {
    const stateMachine = new StateMachine<TestState>('state1');
    stateMachine.next('state2');
    stateMachine.next('state3');
    stateMachine.prev();
    stateMachine.prev();
    Assert.isEqual(stateMachine.current, 'state1');
  });

  it('should be able to add multiple states and reset to first', () => {
    const stateMachine = new StateMachine<TestState>('state1');
    stateMachine.next('state2');
    stateMachine.next('state3');
    stateMachine.reset();
    Assert.isEqual(stateMachine.current, 'state1');
  });

  it('should return a valid story', () => {
    const stateMachine = new StateMachine<TestState>('state1');
    stateMachine.next('state2');
    stateMachine.next('state3');
    Assert.isEqual(stateMachine.story[0], 'state1');
    Assert.isEqual(stateMachine.story[1], 'state2');
    Assert.isEqual(stateMachine.story[2], 'state3');
  });

  it('should trigger on state change', async () => {
    const stateMachine = new StateMachine<TestState>('state1');
    let lastState = 'state1';
    stateMachine.state.subscribe((state) => lastState = state);
    stateMachine.next('state2');
    await sleep(10);
    Assert.isEqual(lastState, 'state2');

    stateMachine.prev();
    await sleep(10);
    Assert.isEqual(lastState, 'state1');
  });

  it('should trigger on state reset', async () => {
    const stateMachine = new StateMachine<TestState>('state1');
    let lastState = 'state1';
    stateMachine.state.subscribe((state) => lastState = state);
    stateMachine.next('state2');
    stateMachine.next('state3');
    stateMachine.reset();
    await sleep(10);
    Assert.isEqual(lastState, 'state1');
  });

});
