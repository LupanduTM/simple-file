"use client"; // This is a client component

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    // Navbar scroll effect
    const handleScroll = () => {
      const navbar = document.getElementById("navbar");
      if (window.scrollY > 20) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      {/* Navigation Bar */}
      <nav className="navbar" id="navbar">
        <div className="logo">
          <Image
            src="https://www.svgrepo.com/show/354380/qr-code.svg"
            alt="Logo"
            className="logo-icon"
            width={32}
            height={32}
          />
          GoCashless
        </div>
        <div className="nav-links">
          <Link href="/" className="nav-link">
            Home
          </Link>
          <Link href="#about" className="nav-link">
            About
          </Link>
          <Link href="#features" className="nav-link">
            Features
          </Link>
          <Link href="#contact" className="nav-link">
            Contact
          </Link>
          <Link href="/login">
            <button className="nav-btn">Login / Register</button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero" id="hero">
        <div className="hero-content">
          <div className="hero-title">Seamless Payments for Public Transport.</div>
          <div className="hero-sub">Pay instantly with your phone. No more cash hassle.</div>
          <div className="hero-buttons">
            <Link href="/login">
              <button className="hero-btn-primary">Get Started</button>
            </Link>
            <button
              className="hero-btn-secondary"
              onClick={() =>
                document.getElementById("features").scrollIntoView({ behavior: "smooth" })
              }
            >
              Learn More
            </button>
          </div>
        </div>
        <div className="hero-illustration"></div>
      </section>

      {/* Features Section */}
      <section className="features" id="features">
        <div className="feature">
          <Image
            src="https://www.svgrepo.com/show/354380/qr-code.svg"
            alt="QR Payment"
            className="feature-icon"
            width={48}
            height={48}
          />
          <div className="feature-title">Cashless Payments</div>
          <div className="feature-desc">
            QR-based payment with MTN MoMo for instant, secure transactions.
          </div>
        </div>
        <div className="feature">
          <Image
            src="https://www.svgrepo.com/show/354200/history.svg"
            alt="History"
            className="feature-icon"
            width={48}
            height={48}
          />
          <div className="feature-title">Transaction History</div>
          <div className="feature-desc">
            Track your past rides and payments easily in one place.
          </div>
        </div>
        <div className="feature">
          <Image
            src="https://www.svgrepo.com/show/354262/shield.svg"
            alt="Security"
            className="feature-icon"
            width={48}
            height={48}
          />
          <div className="feature-title">Secure & Reliable</div>
          <div className="feature-desc">
            Your payments are safe and protected with industry standards.
          </div>
        </div>
        <div className="feature">
          <Image
            src="https://www.svgrepo.com/show/354273/dashboard.svg"
            alt="Dashboard"
            className="feature-icon"
            width={48}
            height={48}
          />
          <div className="feature-title">Company Dashboard</div>
          <div className="feature-desc">
            Bus operators manage revenue and monitor performance.
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works" id="how">
        <h2 style={{ textAlign: "center", fontSize: "2rem", color: "#1e90ff", marginBottom: "2rem" }}>
          How It Works
        </h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <Image
              src="https://www.svgrepo.com/show/354273/dashboard.svg"
              alt="Destination"
              className="step-icon"
              width={40}
              height={40}
            />
            <div className="step-desc">Conductor selects destination.</div>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <Image
              src="https://www.svgrepo.com/show/354380/qr-code.svg"
              alt="QR"
              className="step-icon"
              width={40}
              height={40}
            />
            <div className="step-desc">QR code is generated.</div>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <Image
              src="https://www.svgrepo.com/show/354380/qr-code.svg"
              alt="Scan"
              className="step-icon"
              width={40}
              height={40}
            />
            <div className="step-desc">Passenger scans QR with GoCashless app.</div>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <Image
              src="https://www.svgrepo.com/show/354262/shield.svg"
              alt="Payment"
              className="step-icon"
              width={40}
              height={40}
            />
            <div className="step-desc">MoMo payment is confirmed instantly.</div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials" id="testimonials">
        <h2 style={{ textAlign: "center", fontSize: "2rem", color: "#1e90ff", marginBottom: "2rem" }}>
          What Our Users Say
        </h2>
        <div className="testimonial-grid">
          <div className="testimonial">
            <Image
              src="https://randomuser.me/api/portraits/men/32.jpg"
              alt="Avatar"
              className="avatar"
              width={48}
              height={48}
            />
            <div className="quote">“Paying for my bus rides has never been easier. I love GoCashless!”</div>
            <div className="user">– Samuel, Passenger</div>
          </div>
          <div className="testimonial">
            <Image
              src="https://randomuser.me/api/portraits/women/44.jpg"
              alt="Avatar"
              className="avatar"
              width={48}
              height={48}
            />
            <div className="quote">“Managing transactions and revenue is so simple now.”</div>
            <div className="user">– Linda, Bus Operator</div>
          </div>
          <div className="testimonial">
            <Image
              src="https://randomuser.me/api/portraits/men/65.jpg"
              alt="Avatar"
              className="avatar"
              width={48}
              height={48}
            />
            <div className="quote">“No more cash hassle. The QR system is super fast!”</div>
            <div className="user">– John, Conductor</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-links">
          <Link href="/" className="footer-link">
            Home
          </Link>
          <Link href="#features" className="footer-link">
            Features
          </Link>
          <Link href="#about" className="footer-link">
            About
          </Link>
          <Link href="#contact" className="footer-link">
            Contact
          </Link>
        </div>
        <div className="footer-social">
          <a href="#">
            <svg className="footer-social-icon" viewBox="0 0 24 24">
              <path d="M22.46 6c-.77.35-1.6.59-2.47.7a4.3 4.3 0 0 0 1.88-2.37c-.83.5-1.75.87-2.72 1.07A4.28 4.28 0 0 0 16.11 4c-2.37 0-4.29 1.92-4.29 4.29 0 .34.04.67.11.99C7.69 9.13 4.07 7.13 1.64 4.16c-.37.64-.58 1.38-.58 2.17 0 1.5.76 2.83 1.92 3.61-.71-.02-1.38-.22-1.97-.54v.05c0 2.1 1.49 3.85 3.47 4.25-.36.1-.74.16-1.13.16-.28 0-.54-.03-.8-.08.54 1.68 2.11 2.9 3.97 2.93A8.6 8.6 0 0 1 2 19.54c-.29 0-.57-.02-.85-.05A12.13 12.13 0 0 0 8.29 21c7.55 0 11.68-6.26 11.68-11.68 0-.18-.01-.36-.02-.54A8.18 8.18 0 0 0 24 4.59c-.77.34-1.6.58-2.47.7z" />
            </svg>
          </a>
          <a href="#">
            <svg className="footer-social-icon" viewBox="0 0 24 24">
              <path d="M12 2.04c-5.5 0-9.96 4.46-9.96 9.96 0 4.41 3.6 8.06 8.01 8.94v-6.33h-2.41v-2.61h2.41V9.41c0-2.39 1.43-3.7 3.62-3.7 1.05 0 2.15.19 2.15.19v2.37h-1.21c-1.19 0-1.56.74-1.56 1.5v1.8h2.65l-.42 2.61h-2.23v6.33c4.41-.88 8.01-4.53 8.01-8.94 0-5.5-4.46-9.96-9.96-9.96z" />
            </svg>
          </a>
          <a href="#">
            <svg className="footer-social-icon" viewBox="0 0 24 24">
              <path d="M21.35 11.1c.04.28.07.56.07.85 0 4.36-3.32 9.39-9.39 9.39-1.87 0-3.61-.55-5.08-1.5.26.03.52.05.79.05 1.55 0 2.98-.53 4.12-1.42-1.45-.03-2.67-.98-3.09-2.29.2.04.41.07.62.07.3 0 .59-.04.87-.11-1.51-.3-2.65-1.64-2.65-3.25v-.04c.45.25.97.4 1.52.42a3.29 3.29 0 0 1-1.46-2.74c0-.6.16-1.16.44-1.64 1.6 1.96 4.01 3.25 6.72 3.39-.06-.24-.09-.49-.09-.75 0-1.8 1.46-3.26 3.26-3.26.94 0 1.79.4 2.39 1.04.75-.15 1.46-.42 2.1-.8-.25.78-.78 1.43-1.47 1.84.67-.08 1.31-.26 1.91-.53-.44.67-.99 1.26-1.62 1.73z" />
            </svg>
          </a>
        </div>
        <div style={{ marginBottom: "1rem" }}>Contact: info@gocashless.com | +260 900 000 000</div>
        <div style={{ fontSize: "0.9rem", color: "#aaa" }}>© 2025 GoCashless. All rights reserved.</div>
      </footer>
    </>
  );
}