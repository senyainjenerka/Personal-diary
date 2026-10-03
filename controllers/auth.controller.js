const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const invalidCredentials = 'Invalid email or password';

async function register(req, res, next) {
  const { email, password } = req.body || {};
  if (typeof email !== 'string' || typeof password !== 'string' || !email.trim() || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const normalizedEmail = email.trim().toLowerCase();
    if (await User.findOne({ where: { email: normalizedEmail } })) {
      return res.status(400).json({ error: 'Email is already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ email: normalizedEmail, passwordHash });
    const { passwordHash: omittedPasswordHash, ...publicUser } = user.toJSON();
    return res.status(201).json(publicUser);
  } catch (error) {
    return next(error);
  }
}

async function login(req, res, next) {
  const { email, password } = req.body || {};
  if (typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ where: { email: email.trim().toLowerCase() } });
    if (!user) {
      return res.status(401).json({ error: invalidCredentials });
    }

    // Заблокированный аккаунт не проверяет пароль до окончания срока блокировки.
    if (user.lockUntil && user.lockUntil.getTime() > Date.now()) {
      return res.status(423).json({
        error: `Account is locked. Try again after ${user.lockUntil.toISOString()}`
      });
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) {
      user.failedLoginAttempts += 1;
      if (user.failedLoginAttempts >= 5) {
        user.failedLoginAttempts = 0;
        user.lockUntil = new Date(Date.now() + 5 * 60 * 1000);
      }
      await user.save();
      return res.status(401).json({ error: invalidCredentials });
    }

    user.failedLoginAttempts = 0;
    user.lockUntil = null;
    await user.save();
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return res.json({ token });
  } catch (error) {
    return next(error);
  }
}

async function getProfile(req, res, next) {
  try {
    const user = await User.findByPk(req.user.id, { attributes: { exclude: ['passwordHash'] } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.json(user);
  } catch (error) {
    return next(error);
  }
}

module.exports = { register, login, getProfile };