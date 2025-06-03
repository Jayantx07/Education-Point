import { Link } from 'react-router-dom';
import { FiPhone, FiMail, FiMapPin, FiFacebook, FiInstagram, FiTwitter, FiYoutube } from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: 'Courses',
      links: [
        { name: 'CUET', path: '/courses/cuet' },
        { name: 'NEET', path: '/courses/neet' },
        { name: 'Foundation', path: '/courses/foundation' },
        { name: 'Pre-Foundation', path: '/courses/pre-foundation' },
        { name: 'Class V-XII', path: '/courses/v-xii' },
      ],
    },
    {
      title: 'Services',
      links: [
        { name: 'Library', path: '/library' },
        { name: 'Computer Classes', path: '/computer-classes' },
        { name: 'RS-CIT', path: '/computer-classes/rs-cit' },
        { name: 'English Speaking', path: '/courses/english' },
        { name: 'SST Classes', path: '/courses/sst' },
      ],
    },
    {
      title: 'About',
      links: [
        { name: 'Our Story', path: '/about' },
        { name: 'Our Teachers', path: '/teachers' },
        { name: 'Testimonials', path: '/testimonials' },
        { name: 'Facilities', path: '/facilities' },
        { name: 'Careers', path: '/careers' },
      ],
    },
  ];

  const contactInfo = [
    { icon: <FiPhone />, text: 'RAM SIR: 8059853968' },
    { icon: <FiPhone />, text: 'SURYADEV SIR: 8209797019' },
    { icon: <FiMail />, text: 'info@educationpoint.com' },
    { icon: <FiMapPin />, text: 'The Education Point, Main Campus' },
  ];

  const socialLinks = [
    { icon: <FiFacebook />, path: 'https://facebook.com' },
    { icon: <FiInstagram />, path: 'https://instagram.com' },
    { icon: <FiTwitter />, path: 'https://twitter.com' },
    { icon: <FiYoutube />, path: 'https://youtube.com' },
  ];

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo and Description */}
          <div className="lg:col-span-2">
          <div className="flex items-center mb-6 md:mb-0 space-x-2">
            <img src="/Logo.png" alt="Education Point" className="h-12" />
            <span className="font-catamaran text-2xl font-bold white">Education Point</span>
          </div>
            <p className="text-gray-400 mb-6">
              The Education Point is your premier destination for quality education. 
              We offer coaching for CUET, NEET, Foundation courses, and more. 
              Our facilities include a well-equipped library and computer classes.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a 
                  key={index} 
                  href={social.path} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors duration-300"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="text-lg font-bold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      to={link.path} 
                      className="text-gray-400 hover:text-white transition-colors duration-300"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <ul className="space-y-4">
              {contactInfo.map((info, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-primary mr-3 mt-1">{info.icon}</span>
                  <span className="text-gray-400">{info.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-gray-800 my-8" />

        {/* Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            &copy; {currentYear} The Education Point. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy-policy" className="text-gray-500 hover:text-white text-sm transition-colors duration-300">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="text-gray-500 hover:text-white text-sm transition-colors duration-300">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;