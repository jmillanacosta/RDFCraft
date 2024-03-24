'use client';

// Zustand set function type

export type ZustandSet<T> = {
    _(
        partial:
            | T
            | Partial<T>
            | {
                  _(state: T): T | Partial<T>;
              }['_'],
        replace?: boolean | undefined,
    ): void;
}['_'];

// Zustand get function type

export type ZustandGet<T> = () => T;

/**
 * Zustand actions function type.
 * @template A - Actions object type.
 * @template S - State object type.
 */
export type ZustandActions<A, S> = (
    set: ZustandSet<S & A>,
    get: ZustandGet<S & A>,
) => A;
