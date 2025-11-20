import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, MessageCircle } from 'lucide-react';
import './Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">🌍 MuhuTravel</h3>
            <p className="footer-description">
              Tu agencia de turismo de confianza para viajes inolvidables alrededor del mundo.
            </p>
            <div className="footer-social">
              <a href="#" className="social-link" title="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" className="social-link" title="Twitter">
                <Twitter size={20} />
              </a>
              <a href="#" className="social-link" title="Instagram">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h4 className="footer-subtitle">Enlaces Rápidos</h4>
            <ul className="footer-links">
              <li>
                <Link to="/">Dashboard</Link>
              </li>
              <li>
                <Link to="/clientes">Clientes</Link>
              </li>
              <li>
                <Link to="/paquetes">Paquetes</Link>
              </li>
              <li>
                <Link to="/reservas">Reservas</Link>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-subtitle">Contacto</h4>
            <div className="contact-info">
              <div className="contact-item">
                <Phone size={18} />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="contact-item">
                <Mail size={18} />
                <span>info@muhutravel.com</span>
              </div>
              <div className="contact-item">
                <MapPin size={18} />
                <span>Calle Principal 123, Ciudad</span>
              </div>
            </div>
          </div>

          <div className="footer-section">
            <h4 className="footer-subtitle">Soporte</h4>
            <Link to="/comunicacion" className="footer-support-link">
              <MessageCircle size={18} />
              <span>Centro de Comunicación</span>
            </Link>
            <p className="footer-support-text">
              Contacta con nuestro equipo a través de WhatsApp
            </p>
          </div>
        </div>

        <div className="footer-divider"></div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            &copy; {currentYear} MuhuTravel. Todos los derechos reservados.
          </p>
          <div className="footer-legal">
            <a href="#">Política de Privacidad</a>
            <span className="separator">|</span>
            <a href="#">Términos de Servicio</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
