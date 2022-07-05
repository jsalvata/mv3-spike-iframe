(async () => {
  const urlParams = new URLSearchParams(window.location.search);

  const module = await import(urlParams.get(`script`));
  module.default();
})();
