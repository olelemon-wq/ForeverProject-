'use client';

import { useEffect } from 'react';

const HIDE_SELECTORS = [
  'nextjs-portal',
  '[data-next-badge-root]',
  '[data-nextjs-dev-overlay]',
].join(',');

function hideDevOverlays(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>(HIDE_SELECTORS).forEach((el) => {
    el.style.setProperty('display', 'none', 'important');
    el.style.setProperty('visibility', 'hidden', 'important');
    el.style.setProperty('pointer-events', 'none', 'important');
    el.style.setProperty('opacity', '0', 'important');
    el.style.setProperty('height', '0', 'important');
    el.style.setProperty('width', '0', 'important');
    el.style.setProperty('overflow', 'hidden', 'important');
  });
}

/** Next.js can paint an empty white portal over the page while scrolling in dev. */
export function HideNextDevOverlay() {
  useEffect(() => {
    const style = document.createElement('style');
    style.setAttribute('data-hide-next-overlay', '');
    style.textContent = `${HIDE_SELECTORS}{display:none!important;visibility:hidden!important;pointer-events:none!important;opacity:0!important;height:0!important;width:0!important;overflow:hidden!important}`;
    document.head.appendChild(style);

    hideDevOverlays();
    const observer = new MutationObserver(() => hideDevOverlays());
    observer.observe(document.documentElement, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      style.remove();
    };
  }, []);

  return null;
}
