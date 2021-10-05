interface MAP {
  ev1: never;
  ev2: string;
  'data.p': number;
}

// eslint-disable-next-line @typescript-eslint/ban-types
class Handler<T extends object> {
  public emit<K extends Extract<keyof T, string>>(event: K, data?: T[K]): void {
    console.log(event, data);
  }
}

const handler = new Handler<MAP>();
handler.emit('ev1');
handler.emit('ev2', 'data');
handler.emit('data.p', 1);
