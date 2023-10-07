```typescript
/**
 * A module for handling focus events and related functionality.
 * @module 
 */

interface MountableElement extends Element {
  select: () => void;
}

/**
 * Attaches an event listener to the given element, to automatically select its content when focused.
 * @param {MountableElement} element - The element to attach the event listener to.
 */
const mounted = (element: MountableElement): void => {
  element.addEventListener('focus', element.select);
};

/**
 * Removes the event listener from the given element, that was added with the `mounted` function.
 * @param {MountableElement} element - The element to remove the event listener from.
 */
const unmounted = (element: MountableElement): void => {
  element.removeEventListener('focus', element.select);
};

export default {
  mounted,
  unmounted,
};
```