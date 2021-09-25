import {
  appContainer,
  Inject,
} from './engine/core/index.js';

class Logger {
  count = 0;

  public log(message: string) {
    this.count++;
    console.warn(`[${this.count}] ${message}`);
  }
}
class App1 {
  @Inject()
  private logger!: Logger;

  public run() {
    this.logger.log("Hello World from 1!");
  }
}

class App2 {
  @Inject()
  private logger!: Logger;

  public run() {
    this.logger.log("Hello World from 2!");
  }
}

appContainer.register(Logger, 'transient');

const a1 = new App1();
const a2 = new App2();

a1.run();
a2.run();
a1.run();
a1.run();
a2.run();
