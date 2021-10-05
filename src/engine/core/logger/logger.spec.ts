import {
  Assert,
  describe,
  it,
} from '/tests/index.js';

import { InternalLoggerEngine } from './engine.js';
import { LoggerService } from './logger.js';
import { LoggerEngine } from './models.js';

function createLoggerEngine(): LoggerEngine & { props: { [key in keyof LoggerEngine]: boolean } } {
  return {
    props: {
      debug: false,
      error: false,
      info: false,
      warning: false,
      default: false,
      engine: false,
    },
    default() { this.props.default = true; },
    engine() { this.props.engine = true; },
    debug() { this.props.debug = true; },
    error() { this.props.error = true; },
    info() { this.props.info = true; },
    warning() { this.props.warning = true; },
  };
}

describe('Logger', () => {
  it('Should call right engine method', () => {
    const engine = createLoggerEngine();

    const logger = new LoggerService();
    logger.addEngine(engine);
    logger.removeEngine(InternalLoggerEngine);

    logger.debug('debug');
    Assert.isTrue(engine.props.debug);
    logger.info('info');
    Assert.isTrue(engine.props.info);
    logger.warning('warning');
    Assert.isTrue(engine.props.warning);
    logger.error('error');
    Assert.isTrue(engine.props.error);
    logger.engine('engine');
    Assert.isTrue(engine.props.engine);

    logger.LOG({
      level: 100,
      message: 'test',
    });
    Assert.isTrue(engine.props.default);
  });

  it('Should call multiple engines', async () => {
    const engine1 = createLoggerEngine();

    const logger = new LoggerService();
    logger.addEngine(engine1);

    await logger.debug('debug');
    Assert.isTrue(engine1.props.debug);
    await logger.info('info');
    Assert.isTrue(engine1.props.info);
    await logger.warning('warning');
    Assert.isTrue(engine1.props.warning);
    await logger.error('error');
    Assert.isTrue(engine1.props.error);
    await logger.engine('engine');
    Assert.isTrue(engine1.props.engine);

    await logger.LOG({
      level: 100,
      message: 'test',
    });
    Assert.isTrue(engine1.props.default);
  });
});
