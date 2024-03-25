'use client';

import { OntologyPropertyDocument } from '@/lib/models/OntologyIndexModel';
import { useMemo } from 'react';

const usePossibleClassesConnection = (
  incoming_predicate: OntologyPropertyDocument | null,
) => {
  return useMemo(() => {
    if (!incoming_predicate) {
      return [];
    }
    return incoming_predicate.property_range;
  }, [incoming_predicate]);
};

export default usePossibleClassesConnection;
