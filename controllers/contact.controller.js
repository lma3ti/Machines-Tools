// controllers/contact.controller.js

exports.getPageContact = (req, res, next) => {
  const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;

  res.render('contact', {
    user: req.session.user,

    // Standard SEO
    title: 'Contact Us | OULAD ABDERRAHMAN - Industrial Solutions',
    description: 'Get in touch with OULAD ABDERRAHMAN, your trusted partner in industrial solutions, CNC machines, milling, and turning machinery. Find our office and contact details here.',
    keywords: 'contact us, industrial solutions, CNC machines, milling, turning, machinery, OULAD ABDERRAHMAN, Morocco, get in touch',

    // Open Graph
    ogTitle: 'Contact Us | OULAD ABDERRAHMAN',
    ogDescription: 'Reach out to OULAD ABDERRAHMAN for any inquiries. Find our location and contact form on this page.',
    ogImage: '/images/contact-seo-image.jpg',
    ogUrl: fullUrl,

    // Twitter Card
    twitterTitle: 'Contact Us | OULAD ABDERRAHMAN',
    twitterDescription: 'Get in touch with OULAD ABDERRAHMAN for inquiries about our industrial solutions, machinery, and more.',
    twitterImage: '/images/contact-seo-image.jpg',
    twitterUrl: fullUrl,

    // Schema URL
    fullUrl
  });
};
