const Message = require('../models/message.model');
const nodemailer = require('nodemailer');

// Render the Contact Us page
exports.getPageContact = (req, res, next) => {
  const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;

  res.render('contact', {
    user: res.locals.user,
    csrfToken: res.locals.csrfToken,
    title: 'Contact Us | OULAD ABDERRAHMAN - Industrial Solutions',
    description: 'Get in touch with OULAD ABDERRAHMAN, your trusted partner in industrial solutions, CNC machines, milling, and turning machinery. Find our office and contact details here.',
    keywords: 'contact us, industrial solutions, CNC machines, milling, turning, machinery, OULAD ABDERRAHMAN, Morocco, get in touch',
    ogTitle: 'Contact Us | OULAD ABDERRAHMAN',
    ogDescription: 'Reach out to OULAD ABDERRAHMAN for any inquiries. Find our location and contact form on this page.',
    ogImage: '/images/contact-seo-image.jpg',
    ogUrl: fullUrl,
    twitterTitle: 'Contact Us | OULAD ABDERRAHMAN',
    twitterDescription: 'Get in touch with OULAD ABDERRAHMAN for inquiries about our industrial solutions, machinery, and more.',
    twitterImage: '/images/contact-seo-image.jpg',
    twitterUrl: fullUrl,
    fullUrl
  });
};

// Handle form submission: save to DB, send email, then redirect
exports.sendMessage = async (req, res, next) => {
  const { name, email, subject, message } = req.body;

  try {
    // 1) Save to database
    const saved = await Message.create({ name, email, subject, message });
    console.log('✅ Message saved with id:', saved._id);

    // 2) Send email notification to admin
    const transporter = nodemailer.createTransport({
      host:   process.env.SMTP_HOST,
      port:   process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    await transporter.sendMail({
      from: `"Website Contact" <${process.env.SMTP_USER}>`,
      to:   process.env.ADMIN_EMAIL,
      subject: `New Contact Message${subject ? ': '+subject : ''}`,
      text: `
          You've received a new contact message:

            Name:    ${name}
            Email:   ${email}
            Subject: ${subject || '(none)'}
            Message:
            ${message}

          View in dashboard: ${process.env.APP_URL}/dashboard/messages/${saved._id}
      `.trim()
    });

    // 3) Redirect with flash message
    if (req.flash) req.flash('success', 'Your message has been sent!');
    res.redirect('/contact');

  } catch (err) {
    console.error(' Error in sendMessage:', err);
    if (req.flash) req.flash('error', 'Unable to send message right now.');
    res.redirect('/contact');
  }
};
