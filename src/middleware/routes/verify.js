const router = require('feathers').Router();
const errors = require('../../utils/errors.js');

module.exports = function(app) {
  const users = app.service('/api/users');
  const tokens = app.service('/api/tokens');

  router.get('/:token_id', (req, res, next) => {
    tokens.find({ query: {_id: req.params.token_id, valid: true}}).then((result) => {
      if (!result.data.length) {
        res.render('error', {
          error: errors.NotFoundToken
        });
      }
      else {
        // app.logout();
        res.render('login', {
          verify: true
        });
      }
    }).catch((error) => {
      next(error);
    });
  });

  return router;
};
