async function load() {
  setTimeout(() => {
    import(/* webpackPreload: true */ "./preload.css");
  }, 1000);
}

load();
