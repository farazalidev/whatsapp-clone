export function getEntityType(entity: any) {
  const typeMetadata = Reflect.getMetadata('entity', entity);
  return typeMetadata;
}
