/**
 * A utility module for highlighting code blocks using the 'highlight.js' library.
 */

import hljs from 'highlight.js';

/**
 * Highlights the code block contained within the specified element before it is mounted in the DOM.
 * 
 * @param element - The element containing the code block to be highlighted.
 */
const highlightCodeBlockBeforeMount = (element: HTMLElement): void => {
  hljs.highlightBlock(element.querySelector('code'));
}

/**
 * Highlights the code block contained within the specified element after it has been updated in the DOM.
 * 
 * @param element - The element containing the code block to be highlighted.
 */
const highlightCodeBlockAfterUpdate = (element: HTMLElement): void => {
  hljs.highlightBlock(element.querySelector('code'));
}

export default {
  beforeMount: highlightCodeBlockBeforeMount,
  updated: highlightCodeBlockAfterUpdate,
};