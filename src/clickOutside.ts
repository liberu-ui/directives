```typescript
/**
 * Get the value of a CSS property for a given element.
 * @param elem - The element to get the property value from.
 * @param property - The CSS property to get the value of.
 * @returns The value of the CSS property for the given element.
 */
const getPropertyValue = (elem: HTMLElement, property: string): string => window
  .getComputedStyle(elem)
  .getPropertyValue(property);

/**
 * Get the z-index property value for a given element.
 * @param elem - The element to get the z-index property value from.
 * @returns The parsed integer value of the z-index property for the given element.
 */
const getZIndexPropertyValue = (elem: HTMLElement): number => parseInt(getPropertyValue(elem, 'z-index'), 10);

/**
 * Get the z-index value for a given element, recursively checking its parent elements.
 * @param elem - The element to get the z-index value from.
 * @returns The z-index value of the given element, or 0 if not found.
 */
const getZIndexValue = (elem: HTMLElement | null): number => elem === null
  ? 0
  : getZIndexPropertyValue(elem) || getZIndexValue(elem.parentElement);

/**
 * Check if two elements intersect each other.
 * @param container - The container element.
 * @param target - The target element.
 * @returns True if the two elements intersect, false otherwise.
 */
const doElementsIntersect = (container: HTMLElement, target: HTMLElement): boolean => {
  const containerRect = target.getClientRects()[0] || {};
  const targetRect = container.getClientRects()[0] || {};

  return !(targetRect.right < containerRect.left
    || targetRect.bottom < containerRect.top
    || containerRect.bottom < targetRect.top
    || containerRect.right < targetRect.left);
};

/**
 * Check if a given container element is an indirect child of a target element.
 * @param container - The container element.
 * @param target - The target element.
 * @returns True if the container is an indirect child of the target, false otherwise.
 */
const isIndirectChild = (container: HTMLElement, target: HTMLElement): boolean =>
  !target.contains(container)
  && doElementsIntersect(container, target)
  && getZIndexValue(target) >= getZIndexValue(container);

/**
 * Check if a given target element is outside of a container element.
 * @param container - The container element.
 * @param target - The target element.
 * @returns True if the target is outside of the container, false otherwise.
 */
const isOutside = (container: HTMLElement, target: HTMLElement): boolean => {
  if (target === null) {
    return true;
  }

  const isOutside = container !== target
    && !container.contains(target)
    && !isIndirectChild(container, target);

  const isOutsideOfChildren = (): boolean => Array
    .from(container.children)
    .every(elem => isOutside(elem, target));

  return isOutside && isOutsideOfChildren();
};

/**
 * Log a warning message to the console.
 * @param component - The component instance.
 */
const warn = (component: { name?: string }): void => {
  let warnMsg = '[v-click-outside:] provided expression must be a function';
  warnMsg += component.name ? `Found in component '${component.name}'` : '';
  console.warn(warnMsg);
};

/**
 * Event handler to check if a click event happened outside of the provided element.
 * @param event - The click event.
 * @param element - The element to check against.
 * @param binding - The binding object.
 */
const clickOutsideHandler = (event: MouseEvent, element: HTMLElement, binding: any): void => {
  if (isOutside(element, event.target as HTMLElement)) {
    binding.value(event);
  }
};

export default {
  beforeMount: (element: HTMLElement, binding: any): void => {
    if (typeof binding.value !== 'function') {
      warn(binding.instance);
    } else {
      document.addEventListener('click', event => clickOutsideHandler(event, element, binding));
    }
  },

  unmounted: (): void => {
    document.removeEventListener('click', clickOutsideHandler);
  },
};
```