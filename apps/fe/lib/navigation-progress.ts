export function startNavigationProgress() {
  window.dispatchEvent(new Event("navigation-start"));
}
