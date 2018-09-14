export class CalendarResizeHelper {
  constructor(
    private resizeContainerElement: HTMLElement,
    private minWidth?: number
  ) {}

  validateResize({ rectangle }: { rectangle: ClientRect }): boolean {
    if (
      this.minWidth &&
      Math.ceil(rectangle.width) < Math.ceil(this.minWidth)
    ) {
      return false;
    }

    return this.isInside(
      this.resizeContainerElement.getBoundingClientRect(),
      rectangle
    );
  }

  isInside(outer: ClientRect, inner: ClientRect): boolean {
    return (
      Math.ceil(outer.left) <= Math.ceil(inner.left) &&
      Math.ceil(inner.left) <= Math.ceil(outer.right) &&
      Math.ceil(outer.left) <= Math.ceil(inner.right) &&
      Math.ceil(inner.right) <= Math.ceil(outer.right) &&
      Math.ceil(outer.top) <= Math.ceil(inner.top) &&
      Math.ceil(inner.top) <= Math.ceil(outer.bottom) &&
      Math.ceil(outer.top) <= Math.ceil(inner.bottom) &&
      Math.ceil(inner.bottom) <= Math.ceil(outer.bottom)
    );
  }
}
