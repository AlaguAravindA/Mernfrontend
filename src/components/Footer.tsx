// Footer.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faFilm } from '@fortawesome/free-solid-svg-icons';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  return (
    <footer className=" text-white p-4 text-center">
      <div className="container mx-auto">
        <p className="text-sm">
          {/* <FontAwesomeIcon icon={faFilm} className="mr-2" /> */}
          CinéSync App &copy; {new Date().getFullYear()}
        </p>
        <div className="mt-2 flex justify-center">
        <a href="https://github.com/alaguaravinda" target='_blank' rel="noopener noreferrer" className="mr-4 hover:text-gray-400">
  <FontAwesomeIcon icon={faGithub} size="2x" />
</a>
<a href="https://linkedin.com/in/alaguaravinda" target='_blank' rel="noopener noreferrer" className="hover:text-gray-400">
  <FontAwesomeIcon icon={faLinkedin} size="2x" />
</a>

        </div>
        <p className="text-xs mt-2">
          Designed with <span role="img" aria-label="heart">❤️</span> by Alagu Aravind A
        </p>
      </div>
    </footer>
  );
};

export default Footer;
