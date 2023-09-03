import focusEditableElement from '@/utils/focus-editable-element';

export function moveCaretToTheEnd(el: HTMLElement) {
  // Place the caret at the end of the element
  const target = document.createTextNode('');
  el.appendChild(target);
  // do not move caret if element was not focused
  const isTargetFocused = document.activeElement === el;
  if (!isTargetFocused) {
    focusEditableElement(el);
  }

  if (target.nodeValue !== null) {
    const sel = window.getSelection();
    if (sel !== null) {
      const range = document.createRange();
      range.setStart(target, target.nodeValue.length);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }
}

export function insertTextAtSelection(div: HTMLDivElement, txt: string) {
  const sel = window.getSelection();
  if (!sel) throw new Error('No selection found');

  const text = div.textContent ?? '';
  const before = Math.min(sel.focusOffset, sel.anchorOffset);
  const after = Math.max(sel.focusOffset, sel.anchorOffset);

  // ensure string ends with \n so it displays properly
  let afterStr = text.substring(after);
  if (afterStr == '') afterStr = '\n';
  //insert content
  div.textContent = text.substring(0, before) + txt + afterStr;
  // restore cursor at correct position
  sel.removeAllRanges();
  const range = document.createRange();
  //childNodes[0] should be all the text
  range.setStart(div.childNodes[0], before + txt.length);
  range.setEnd(div.childNodes[0], before + txt.length);
  sel.addRange(range);
}
