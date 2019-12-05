const Controller = require('../utilities/Controller');

require('./LoginRouter');
require('./IndexRouter');
require('./MainRouter');

module.exports = new Controller().routes();
