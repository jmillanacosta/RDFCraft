'use client';

import { useEffect, useState } from 'react';
import useRefMatcher from './useRefMatcher';

export default function useRefValidator(value: string, refs: string[]) {
    const [error, setError] = useState<string | null>(null);
    const matches = useRefMatcher(value);
    useEffect(() => {
        const validate = () => {
            setError(null);
            if (refs.length === 0) {
                return;
            }
            matches?.forEach((match) => {
                if (!refs.includes(match)) {
                    setError(`Reference ${match} is not valid`);
                }
            });
        };
        validate();
    }, [matches, refs]);

    return error;
}
