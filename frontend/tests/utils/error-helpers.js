export const generateJsonApiErrors = (field, message) => {
  return {
    errors: [
      {
        status: '422',
        source: { 'pointer': `data/attributes/${field}`},
        title: 'Invalid Attribute',
        detail: `${message}`
      }
    ]
  };
};
