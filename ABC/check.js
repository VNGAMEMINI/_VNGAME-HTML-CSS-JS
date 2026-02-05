const AT = {
  css(el, prop) {
    return getComputedStyle(el).getPropertyValue(prop).trim();
  },
  style(el, prop) {
    return getComputedStyle(el)[prop];
  }
};

AT.pseudo = {
  hover: el => el.matches(':hover'),
  active: el => el.matches(':active'),
  focus: el => el.matches(':focus'),
  focusVisible: el => el.matches(':focus-visible'),
  focusWithin: el => el.matches(':focus-within'),
  checked: el => el.matches(':checked'),
  disabled: el => el.matches(':disabled'),
  target: el => el.matches(':target'),
  anyLink: el => el.matches(':any-link')
};

AT.layer = function (el) {
  const s = getComputedStyle(el);

  if (s.animationName !== 'none') return 'B / D (animation)';
  if (s.transform !== 'none') return 'C (pseudo-element)';
  return 'A (base)';
};

AT.isRunning = function (el) {
  const s = getComputedStyle(el);
  return (
    s.animationName !== 'none' ||
    (parseFloat(s.transitionDuration) > 0)
  );
};

AT.vars = function (el) {
  const read = n => AT.css(el, n);

  return {
    A: {
      background: read('--background-A-'),
      color: read('--color-A-'),
      transform: read('--transform-A-')
    },
    B: {
      background: read('--background-B-'),
      color: read('--color-B-'),
      animation: read('--animation-name-A')
    },
    C: {
      background: read('--background-C-'),
      transform: read('--transform-C-')
    },
    D: {
      background: read('--background-D-'),
      animation: read('--animation-name-B-')
    }
  };
};

AT.animation = function (el) {
  const s = getComputedStyle(el);
  return {
    name: s.animationName,
    duration: s.animationDuration,
    timing: s.animationTimingFunction,
    delay: s.animationDelay,
    iteration: s.animationIterationCount,
    fillMode: s.animationFillMode,
    state: s.animationPlayState
  };
};

AT.debug = function (el) {
  return {
    element: el,
    layer: AT.layer(el),

    pseudo: {
      hover: AT.pseudo.hover(el),
      active: AT.pseudo.active(el),
      focus: AT.pseudo.focus(el),
      checked: AT.pseudo.checked(el),
      disabled: AT.pseudo.disabled(el),
      target: AT.pseudo.target(el)
    },

    running: AT.isRunning(el),

    vars: AT.vars(el),
    animation: AT.animation(el)
  };
};

const el = document.querySelector('#animation_transition__x_y__hover');

console.table(AT.debug(el));

['mouseenter','mouseleave','mousedown','mouseup'].forEach(e => {
  el.addEventListener(e, () => {
    console.log(AT.debug(el));
  });
});

el.addEventListener('animationstart', e =>
  console.log('▶ animation start:', e.animationName)
);

el.addEventListener('animationend', e =>
  console.log('■ animation end:', e.animationName)
);
