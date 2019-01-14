import DS from 'ember-data';

export default DS.Model.extend({
  current_password: DS.attr('string'),
  new_password:  DS.attr('string'),
  confirm_password:  DS.attr('string')
});
