const User = require('../models/User');

(async () => {
  try {
    console.log('Llamando a User.findByEmail(testuser@example.com)');
    const u = await User.findByEmail('testuser@example.com');
    console.log('RESULT findByEmail:', u);
  } catch (err) {
    console.error('ERROR findByEmail:', err && err.message ? err.message : err);
    console.error(err.stack || err);
  }

  try {
    console.log('Llamando a User.findByEmailWithPassword(testuser@example.com)');
    const u2 = await User.findByEmailWithPassword('testuser@example.com');
    console.log('RESULT findByEmailWithPassword:', u2);
  } catch (err) {
    console.error('ERROR findByEmailWithPassword:', err && err.message ? err.message : err);
    console.error(err.stack || err);
  }

  process.exit(0);
})();
