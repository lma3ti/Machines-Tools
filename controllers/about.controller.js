exports.getPageAbout = (req, res, next) => {
  const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;

  res.render('about', {
    user: res.locals.user,
    csrfToken: res.locals.csrfToken,

    title: 'About Us | OULAD ABDERRAHMAN - Industrial Solutions',
    description: 'Learn more about OULAD ABDERRAHMAN. We specialize in premium CNC machines, industrial tools, and mechanical engineering solutions.',
    keywords: 'About us, OULAD ABDERRAHMAN, CNC machines, industrial tools, mechanical engineering, Morocco',

    ogTitle: 'About OULAD ABDERRAHMAN - Experts in Industrial Tools',
    ogDescription: 'Discover our mission and vision in providing cutting-edge CNC machines and precision tools for professionals.',
    ogImage: '/images/about-seo-image.jpg',
    ogUrl: fullUrl,

    twitterTitle: 'About Us | OULAD ABDERRAHMAN',
    twitterDescription: 'Who we are and what we stand for in industrial solutions.',
    twitterImage: '/images/about-seo-image.jpg',
    twitterUrl: fullUrl,

    fullUrl
  });
};
