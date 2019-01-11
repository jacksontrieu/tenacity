import DS from 'ember-data';

export default DS.Model.extend({
  email: DS.attr('string'),
  firstName: DS.attr('string'),
  lastName: DS.attr('string'),
  phone: DS.attr('string'),
  password: DS.attr('string'),
  confirmPassword: DS.attr('string')
});
