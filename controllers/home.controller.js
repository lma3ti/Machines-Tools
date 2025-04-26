// controllers/home.controller.js

const ProductModel = require("../models/product.model");

exports.getPageHome = (req, res) => {
  const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;

  res.render('index', {
    title: 'Home - Machines & Tools',
    description: 'Explore our range of machines and tools.',
    keywords: 'CNC machines, industrial tools, machinery',

    ogTitle: 'Machines & Tools - Your Trusted Industrial Partner',
    ogDescription: 'Find the best industrial tools and machines for your business.',
    ogImage: '/images/og-image.jpg',
    ogUrl: fullUrl,

    twitterTitle: 'Machines & Tools',
    twitterDescription: 'Shop for high-quality machines and tools.',
    twitterImage: '/images/twitter-image.jpg',
    twitterUrl: fullUrl,

    fullUrl // Also used for schema.org
  });
};

exports.threeProductsController = (req, res, next) => {
  ProductModel.getThreeProducts()
    .then(products => {
      const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;

      res.render('index', {
        user: req.session.user,
        products,

        title: 'Top CNC Machines & Industrial Tools | OULAD ABDERRAHMAN',
        description: 'Explore the latest CNC machines, milling and turning tools at OULAD ABDERRAHMAN. Premium industrial equipment for your business.',
        keywords: 'CNC machines, industrial tools, new arrivals, milling machines, turning machines',

        ogTitle: 'Explore Our CNC Machines | OULAD ABDERRAHMAN',
        ogDescription: 'We offer top-of-the-line CNC machines, turning and milling tools for every industrial need.',
        ogImage: '/images/seo-image.jpg',
        ogUrl: fullUrl,

        twitterTitle: 'OULAD ABDERRAHMAN - CNC & Industrial Tools',
        twitterDescription: 'High-quality industrial tools including CNC, milling, and turning machines.',
        twitterImage: '/images/seo-image.jpg',
        twitterUrl: fullUrl,

        fullUrl // For structured data
      });
    })
    .catch(next);
};
