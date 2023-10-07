import { DirectiveBinding } from 'vue';

/**
 * Vue directive for handling long click events.
 */
export default {
  /**
   * Handler function that is called before the directive is mounted.
   * @param el - The element the directive is bound to.
   * @param binding - The directive binding object.
   */
  beforeMount: (el: HTMLElement, binding: DirectiveBinding) => {
    const componentName = binding.instance?.name;
    let warning = null;

    // Check if the provided value is a function
    if (typeof binding.value !== 'function') {
      warning = `[v-long-click:] provided expression '${binding.expression}' must be a function`;
      warning += componentName ? `Found in component '${componentName}'` : '';
      console.warn(warning);

      return;
    }

    // Check if the provided argument is a number
    if (`${parseInt(binding.arg, 10)}` !== binding.arg) {
      warning = `[v-long-click:] provided argument '${binding.arg}' must be a number`;
      warning += componentName ? `Found in component '${componentName}'` : '';
      console.warn(warning);

      return;
    }

    let timer: number | null = null;
    const duration = parseInt(binding.arg, 10);

    /**
     * Handler function that starts the timer on mouse down or touch start events.
     * @param event - The mouse or touch event.
     */
    el.longClickStartHandler = (event: MouseEvent | TouchEvent) => {
      // Only start the timer for left mouse button click events
      if (event instanceof MouseEvent && event.button !== 0) {
        return;
      }

      if (timer === null) {
        timer = setTimeout(binding.value, duration);
      }
    };

    /**
     * Handler function that clears the timer on click, mouse out, or touch end/cancel events.
     */
    el.longClickEndHandler = () => {
      if (timer !== null) {
        clearTimeout(timer);
        timer = null;
      }
    };

    // Bind the event listeners
    el.addEventListener('mousedown', el.longClickStartHandler);
    el.addEventListener('touchstart', el.longClickStartHandler);

    el.addEventListener('click', el.longClickEndHandler);
    el.addEventListener('mouseout', el.longClickEndHandler);
    el.addEventListener('touchend', el.longClickEndHandler);
    el.addEventListener('touchcancel', el.longClickEndHandler);
  },

  /**
   * Handler function that is called when the directive is unmounted.
   * @param el - The element the directive is unbound from.
   */
  unmounted: (el: HTMLElement) => {
    // Remove the event listeners
    el.removeEventListener('mousedown', el.longClickStartHandler);
    el.removeEventListener('touchstart', el.longClickStartHandler);

    el.removeEventListener('click', el.longClickEndHandler);
    el.removeEventListener('mouseout', el.longClickEndHandler);
    el.removeEventListener('touchend', el.longClickEndHandler);
    el.removeEventListener('touchcancel', el.longClickEndHandler);

    // Clean up the handler functions
    el.longClickStartHandler = null;
    el.longClickEndHandler = null;
  },
};