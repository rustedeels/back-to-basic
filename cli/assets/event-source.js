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
