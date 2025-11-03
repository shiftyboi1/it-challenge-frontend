export async function scrollWithSliderOffset(id, { attempts = 6, delay = 80, extra = 8 } = {}) {
  return new Promise((resolve) => {
    if (!id) return resolve();

    const el = document.getElementById(id) || document.querySelector(`#${CSS.escape(id)}`) || document.querySelector(`[name="${id}"]`);
    if (!el) return resolve();

    let tries = 0;

    function doScroll() {
      tries += 1;

      const header = document.querySelector('.nh');
      const hero = document.querySelector('.home-hero');

      const headerHeight = header ? header.getBoundingClientRect().height : 72;

      // If there's a hero/slider, compute how much of it sits below the
      // header in viewport terms and factor that into the offset so the
      // target lands below the slider.
      const heroBottomViewport = hero ? hero.getBoundingClientRect().bottom : 0;
      const extraOffset = hero && heroBottomViewport > headerHeight ? (heroBottomViewport - headerHeight) : 0;

      const targetRect = el.getBoundingClientRect();
      const targetTop = window.scrollY + targetRect.top;
      const finalTop = Math.max(0, Math.round(targetTop - headerHeight - extraOffset - extra));

      // perform smooth scroll
      window.scrollTo({ top: finalTop, behavior: 'smooth' });

      // resolve after animation or retry if measurements look unstable
      if (tries >= attempts) return setTimeout(resolve, 420);

      // If hero rect is zero-height (layout not ready), retry a few times
      if (hero && hero.getBoundingClientRect().height < 4) {
        return setTimeout(doScroll, delay);
      }

      // otherwise resolve after a short delay to let smooth scroll finish
      setTimeout(resolve, 420);
    }

    doScroll();
  });
}
