const DRAG_THRESHOLD = 1;

export class CalendarDragHelper {
  private readonly startPosition: ClientRect;

  constructor(
    private dragContainerElement: HTMLElement,
    draggableElement: HTMLElement
  ) {
    this.startPosition = draggableElement.getBoundingClientRect();
  }

  validateDrag({
    x,
    y,
    snapDraggedEvents
  }: {
    x: number;
    y: number;
    snapDraggedEvents: boolean;
  }): boolean {
    const isWithinThreshold =
      Math.abs(x) > DRAG_THRESHOLD || Math.abs(y) > DRAG_THRESHOLD;

    if (snapDraggedEvents) {
      const newRect: ClientRect = Object.assign({}, this.startPosition, {
        left: this.startPosition.left + x,
        right: this.startPosition.right + x,
        top: this.startPosition.top + y,
        bottom: this.startPosition.bottom + y
      });

      return (
        isWithinThreshold &&
        this.isInside(this.dragContainerElement.getBoundingClientRect(), newRect)
      );
    } else {
      return isWithinThreshold;
    }
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
