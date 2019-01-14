// To allow custom data-attributes on the {{#link-to}} helper as per:
// https://guides.emberjs.com/release/templates/binding-element-attributes
import LinkComponent from '@ember/routing/link-component';

export default LinkComponent.extend({
  attributeBindings: ['data-type']
});
