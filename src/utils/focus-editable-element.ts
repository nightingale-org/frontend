import { isTouchDevice } from '@/utils/window-environment';

export default function focusEditableElement(
  element: HTMLElement,
  force?: boolean,
  forcePlaceCaretAtEnd?: boolean
) {
  if (!force && element === document.activeElement) {
    return;
  }

  const selection = window.getSelection()!;
  const range = document.createRange();
  const lastChild = element.lastChild || element;

  if (!isTouchDevice() && !forcePlaceCaretAtEnd && (!lastChild || !lastChild.nodeValue)) {
    element.focus();
    return;
  }

  range.selectNodeContents(forcePlaceCaretAtEnd ? element : lastChild);
  // `false` means collapse to the end rather than the start
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);
}
