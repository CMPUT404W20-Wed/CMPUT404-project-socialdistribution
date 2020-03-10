const updateObject = (oldObject, updatedProperties) => (
  {
    ...oldObject,
    ...updatedProperties,
  }
);

// if removing export default, edit ./reducer/auth imports, it will break
export default updateObject;
