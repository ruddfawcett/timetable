const router = require('feathers').Router();
const errors = require('../../utils/errors.js');
const async = require('async');

module.exports = function(app) {
  const courses = app.service('/api/courses');
  const sections = app.service('/api/sections');

  // Renders a singular course view...
  router.get('/:slug', (req, res, next) => {
    courses.find({ query: { slug: req.params.slug}}).then((courses) => {
      if (!courses.data.length) { next(errors.NotFound); }
      else {
        var sections = [];
        courses.data.forEach((course) => {
          // I don't know why I did this anymore...
          course.sections.forEach((section) => {
            sections.push({
              teacher: section.teacher,
              number: section.number,
              period: section.period,
              code: section.code,
              size: section.students.length
            });
          });
        });
        return res.render('course', {
          course: courses.data[0],
          sections: sections
        });
      }
    }).catch((error) => {
      next(error);
    });
  });

  router.get('/:slug/:section', (req, res, next) => {
    var sectionNumber = parseInt(req.params.section);
    courses.find({ query: { slug: req.params.slug}}).then((courses) => {
      if (!courses.data.length) { next(errors.NotFound); }
      else {
        async.each(courses.data[0].sections, (section, callback) => {
          section.period = addSufix(section.period) + ' Period';
          if (section.number == sectionNumber) {
            var data = {
              course: courses.data[0],
              section: section
            };
            return callback(data);
          }
          callback();
        }, (result) => {
          if (result.error) {
            return res.render('error', {error: errors.NotFound});
          }
          else {
            return res.render('section', result);
          }
        });
      }
    }).catch((error) => {
      next(error);
    });
  });

  function addSufix(p) {
    if (p === 1) return p + 'st';
    if (p === 2) return p + 'nd';
    if (p === 3) return p + 'rd';
    return p + 'th';
  }

  return router;
};
