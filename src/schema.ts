import { Entity, Type } from '@graphprotocol/hypergraph';

export class AcademicField extends Entity.Class<AcademicField>('AcademicField')({
  name: Type.Text,
  description: Type.Text,
}) {}

export class Project extends Entity.Class<Project>('Project')({
  name: Type.Text,
}) {}
