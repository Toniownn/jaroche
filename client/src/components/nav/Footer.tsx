import Link from 'next/link';
import { YarnIcon } from '@/components/icons/YarnIcon';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <span className="footer-logo">Jaroché</span>
          <p>Heirloom crochet, made slowly in Lisbon.</p>
          <div className="socials">
            <a href="#" aria-label="Instagram">Instagram</a>
            <a href="#" aria-label="Pinterest">Pinterest</a>
            <a href="#" aria-label="TikTok">TikTok</a>
          </div>
        </div>
        <div className="footer-col">
          <h4>Shop</h4>
          <ul>
            <li><Link href="/shop">All pieces</Link></li>
            <li><Link href="/shop?category=Bouquets">Bouquets</Link></li>
            <li><Link href="/shop?category=Gift+Sets">Gift Sets</Link></li>
            <li><Link href="/shop?category=Amigurumi">Amigurumi</Link></li>
            <li><Link href="/shop?category=Tops">Tops</Link></li>
            <li><Link href="/shop?category=Bags">Bags</Link></li>
            <li><Link href="/shop?category=Home">Home</Link></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Studio</h4>
          <ul>
            <li><Link href="/about">Our story</Link></li>
            <li><Link href="/journal">Journal</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Help</h4>
          <ul>
            <li><Link href="/contact">Shipping</Link></li>
            <li><Link href="/contact">Returns</Link></li>
            <li><Link href="/contact">FAQ</Link></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 Jaroché Atelier — Rua das Flores 12, Lisboa</span>
        <span className="footer-credit"><YarnIcon size={14} /> Made with hands, not machines</span>
      </div>
    </footer>
  );
}
