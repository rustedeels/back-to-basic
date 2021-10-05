export function debounce(func: () => (Promise<void> | void), wait: number) {
  const debounceable = {
    cancelled: false,
    cancel: function() {
      this.cancelled = true;
    },
    execute: function() {
      setTimeout(() => {
        if (!this.cancelled) { func(); }
      }, wait);
    }
  };

  return debounceable;
}

export function createDebounce(wait: number) {
  let debounceable = debounce(() => {/** */}, wait);
  return function(func: () => Promise<void>) {
    debounceable.cancel();
    debounceable = debounce(func, wait);
    debounceable.execute();
  };
}
