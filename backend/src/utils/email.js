const nodemailer = require('nodemailer');

const getEnv = (key) => (process.env[key] || '').trim();

const getSmtpConfig = () => {
  const host = getEnv('SMTP_HOST');
  const portRaw = getEnv('SMTP_PORT');
  const user = getEnv('SMTP_USER');
  const pass = getEnv('SMTP_PASS');
  const from = getEnv('SMTP_FROM');
  const secure = getEnv('SMTP_SECURE');

  if (!host || !portRaw || !user || !pass || !from) {
    return null;
  }

  const port = Number(portRaw);
  if (!Number.isFinite(port)) {
    return null;
  }

  return {
    host,
    port,
    user,
    pass,
    from,
    secure: secure ? secure === 'true' : port === 465,
  };
};

const createTransporter = (config) => nodemailer.createTransport({
  host: config.host,
  port: config.port,
  secure: config.secure,
  auth: {
    user: config.user,
    pass: config.pass,
  },
});

const sendPasswordResetEmail = async ({ to, token }) => {
  const config = getSmtpConfig();
  if (!config) {
    throw new Error('SMTP configuration is incomplete. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM.');
  }

  const transporter = createTransporter(config);
  const message = {
    from: config.from,
    to,
    subject: 'Password Reset Token',
    text: `Your password reset token is: ${token}\n\nEnter this token in the app to reset your password.`,
  };

  await transporter.sendMail(message);
};

module.exports = { sendPasswordResetEmail };
