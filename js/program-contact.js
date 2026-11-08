document.querySelectorAll('[data-copy]').forEach(function (btn) {
  btn.addEventListener('click', function () {
    var label = btn.textContent;
    function done(msg) { btn.textContent = msg; setTimeout(function () { btn.textContent = label; }, 1800); }
    function fallback() {
      try {
        var el = document.getElementById(btn.dataset.target);
        var range = document.createRange(); range.selectNodeContents(el);
        var sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(range);
        done('Selected');
      } catch (e) { done('Copy manually'); }
    }
    try {
      navigator.clipboard.writeText(btn.dataset.copy).then(function () { done('Copied'); }, fallback);
    } catch (e) { fallback(); }
  });
});
