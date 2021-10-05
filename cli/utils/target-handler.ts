import { oak } from '../_deps.ts';

export class OakTargetHandler {
  private _targets: oak.ServerSentEventTarget[] = [];

  public addTarget(target: oak.ServerSentEventTarget) {
    if (this._targets.find(t => t === target)) return;

    target.addEventListener('close', () => {
      this._targets = this._targets.filter(t => t !== target);
    });

    this._targets.push(target);
  }

  public refresh() {
    const refreshEvent = new oak.ServerSentEvent('refresh', {});
    this._targets.forEach(target => target.dispatchEvent(refreshEvent));
  }

  public styles() {
    const refreshEvent = new oak.ServerSentEvent('styles', {});
    this._targets.forEach(target => target.dispatchEvent(refreshEvent));
  }
}
