/**
 * This module provides a directive for resizing input elements based on their content.
 */

/**
 * The minimum width for the input element.
 */
let minWidth: number;

/**
 * Resizes the input element based on its content.
 * @param input - The input element.
 */
const resizeInput = (input: HTMLInputElement) => {
    input.style.width = '0';
    const width = input.scrollWidth > minWidth ? input.scrollWidth + 4 : minWidth;
    input.style.width = `${width}px`;
};

/**
 * Handles the resize input event.
 * @param event - The resize input event.
 */
const handleResizeInput = (event: Event) => {
    resizeInput(event.target as HTMLInputElement);
};

/**
 * The resize directive.
 */
export default {
    /**
     * Mounts the resize directive to the element.
     * @param el - The input element.
     * @param binding - The directive binding object.
     */
    mounted: (el: HTMLInputElement, binding: any) => {
        const { name } = binding.instance;

        if (binding.arg && `${parseInt(binding.arg, 10)}` !== binding.arg) {
            let warning = `[v-resize:] The provided argument '${binding.arg}' must be a number.`;
            warning += name ? ` Found in component '${name}'.` : '';
            console.warn(warning);

            return;
        }

        minWidth = binding.arg ? parseInt(binding.arg, 10) : 10;

        resizeInput(el);
        el.addEventListener('input', handleResizeInput);
    },

    /**
     * Unmounts the resize directive from the element.
     * @param el - The input element.
     */
    unmounted: (el: HTMLElement) => {
        el.removeEventListener('input', handleResizeInput);
    },
};