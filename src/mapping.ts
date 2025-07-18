import { Id } from '@graphprotocol/grc-20';
import type { Mapping } from '@graphprotocol/hypergraph';

export const mapping: Mapping = {
  AcademicField: {
    typeIds: [Id.Id('37d2167f-b64a-4b68-be26-55b3608050e7')],
    properties: {
      name: Id.Id('a126ca53-0c8e-48d5-b888-82c734c38935'),
      description: Id.Id('9b1f76ff-9711-404c-861e-59dc3fa7d037'),
    },
  },
  Project: {
    typeIds: [Id.Id('12345678-1234-4567-8901-123456789012')],
    properties: {
      name: Id.Id('87654321-4321-4567-8901-210987654321'),
      description: Id.Id('11223344-5566-4789-9012-345678901234'),
    },
  },
};
