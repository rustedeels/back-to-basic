/** Property to hold watched properties */
export const CE_WATCH_FIELDS = '__#WATCH';

/** Fields for an element */
export type Field<T extends object> = Extract<keyof T, string>;

/** Result of an render operation */
export type RenderResult = (string | Node)[] | Node | string;
