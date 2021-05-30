/**
 * Return value for possibly containing an error.
 *
 * @author Louis Meyer
 */
export type MaybeError<T> = [err?: any, res?: T];
