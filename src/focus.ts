/**
 * Mounts an element and focuses it.
 * 
 * @param {HTMLElement} element - The element to be mounted.
 * @param {object} binding - The binding object received by the Vue directive.
 */
export default {
  mounted: (element: HTMLElement, binding: object): void => binding.instance.$nextTick(() => element.focus()),
};