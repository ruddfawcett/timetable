const service = require('feathers-mongoose');
const User = require('../models/user');
const hooks = require('../hooks/users');

module.exports = function() {
  const app = this;

  const options = {
    Model: User,
    paginate: {
      default: 5,
      max: 25
    }
  };

  app.use('/api/users', service(options));
  app.service('/api/users').before(hooks.before);
  app.service('/api/users').after(hooks.after);
};