import {
  oak,
  path,
} from '../_deps.ts';
import * as Console from '../utils/console.ts';
import { OakTargetHandler } from '../utils/target-handler.ts';

export interface Server {
  start: () => Promise<void>;
  reload: () => void;
  styles: () => void;
  close: () => void;
}

interface ErrorEvent {
  context?: {
    matched: {
      path: string;
    }[]
  },
  message: string;
}

function addEventSource(content: string): string {
  const parts = content.split('</head>');
  return `${parts[0]}
    <script>
    function startEventSource(reload = false) {
      let source = new EventSource('/sse');

      source.addEventListener('refresh', () => {
        source.close();
        setTimeout(() => {
          window.location.reload();
        }, 500);
      });

      source.addEventListener('styles', () => {
        const links = document.getElementsByTagName('link');
        for (const l of links) {
          if (l.rel == 'stylesheet') {
            l.href = l.href + '?v=' + new Date().getTime();
          }
        }
      });

      source.onerror = () => {
        source.close();
        source = undefined;
        setTimeout(() => {
          startEventSource(true);
        }, 5000);
      };

      source.onopen = () => {
        if (reload) {
          source.close();
          window.location.reload();
        }
      };
    }

    setTimeout(() => {
      startEventSource(false);
    }, 500);
    </script>
  </head>
  ${parts[1]}`;
}

export function createServer(folder: string, port: number): Server {
  const app = new oak.Application({ logErrors: false });
  const router = new oak.Router();
  const handlers = new OakTargetHandler();
  const controller = new AbortController();

  router.get('/sse', (ctx) => {
    const target = ctx.sendEvents();
    handlers.addTarget(target);
    target.dispatchMessage('started');
  });

  router.get('/', async (ctx) => {
    const content = await Deno.readTextFile(`${folder}/index.html`);
    ctx.response.body = addEventSource(content);
    ctx.response.type = 'text/html';
  });

  router.get('/tests', async (ctx) => {
    const content = await Deno.readTextFile(`${folder}/tests.html`);
    ctx.response.body = addEventSource(content);
    ctx.response.type = 'text/html';
  });

  app.use(router.routes());

  app.use(async (context, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    context.response.headers.set('X-Response-Time', `${ms}ms`);
  });

  app.use(async context => {
    await context.send({
      root: `${Deno.cwd()}/${folder}`,
    });
  });

  app.addEventListener('listen', ({ hostname, port }) => {
    Console.success(`Listening on http://${hostname}:${port}`);
  });

  const handleError = (event: ErrorEvent) => {
    if (!event.message) return;

    if (event.context && event.context.matched.length > 0) {
      const path = event.context.matched[0].path;
      if (path === '/sse') return;
      Console.error(`${path}: ${event.message}`);
      return;
    }

    Console.error(event.message);
  };

  // deno-lint-ignore no-explicit-any
  app.addEventListener('error', handleError as any);

  return {
    reload: () => handlers.refresh(),
    close: () => controller.abort(),
    styles: () => handlers.styles(),
    start: () => app.listen({
      port,
      hostname: '127.0.0.1',
      signal: controller.signal
    }),
  };
}

export async function runServer(folder: string, port: number): Promise<number> {
  const server = createServer(folder, port);
  const fullPath = path.join(Deno.cwd(), folder);

  try {
    Console.info(`Running server in '${fullPath}'`);
    await server.start();
    return 0;
  } catch (e) {
    Console.error(e);
    return 1;
  }
}
