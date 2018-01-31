
/** Mixin to set classes specifying component coloring. */
export function mixinColor() {
  return class {
    private _color: string;

    get color() { return this._color; }
    set color(value: string) { this._color = value; }
  };
}
