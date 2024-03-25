'use client';

import { useEffect, useState } from 'react';

export default function useRefMatcher(value: string) {
    const [matches, setMatches] = useState<string[]>([]);

    useEffect(() => {
        const findMatches = () => {
            const captureRegex = /\$\(([a-zA-Z].*?)\)/g;
            const matches = value.match(captureRegex);
            if (matches) {
                setMatches(
                    matches.map((match) =>
                        match.replace('$(', '').replace(')', ''),
                    ),
                );
            } else {
                setMatches([]);
            }
        };
        findMatches();
    }, [value]);

    return matches;
}
