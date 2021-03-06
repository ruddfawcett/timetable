var self = module.exports = {
  parse: (str) => {
    return {
      course: self.course(str),
      section: self.section(str)
    }
  },
  course: (str) => {
    var parts = self.parts(str);
    var data = parts[0].split('/');

    var title = parts[1];
    if (parts.length === 5) {
      // Master course 'Advising' vs 'Advising - Teacher'
      // title += ' - ' + parts[2];
    }

    var code = data[0];
    var info = data[1].split('-');

    var year = 0;

    if (info.length > 1) {
      var term = info[1].split('T')[1];
      year = parseInt(info[0]) || 0
    }

    return {
      code: code,
      year: year,
      term: parseInt(term) || 0,
      title: title
    }
  },
  section: (str) => {
    var parts = self.parts(str);
    var data = parts[0].split('/');
    var number = data[1].split('-');

    var room = parts[3];
    var teacher = {
      name: self.teacher(parts[2]),
      role: 'TEACHER'
    };

    if (parts.length === 5) {
      teacher = {
        name: self.teacher(parts[3]),
        role: 'TEACHER'
      };
      room = parts[4]
    }

    return {
      code: parts[0],
      number: parseInt(number[2]) || 0,
      room: room || null,
      teacher: teacher
    }
  },
  parts: (str) => {
    return str.split(' - ');
  },
  teacher: (str) => {
    var parts = str.split(', ');
    var first = parts[1] ? parts[1].trim() : 'No';
    var last = parts[0] ? parts[0].trim() : 'Teacher';

    return {
      first: first,
      last: last
    }
  }
}
