import React from 'react';
import './About.css';
import Navbar from './Navbar';

const phases = [
  {
    no: '01',
    title: 'Data Pipeline',
    body: "Pulled ~35,000 products across 27 categories from a public Amazon US dataset. Parsed the CSV with csv-parse, deduped by ASIN, converted USD to NGN, batch-seeded into MongoDB.",
  },
  {
    no: '02',
    title: 'Catalog & Search',
    body: "REST routes for search, filtering, pagination, related products, suggestions. Product listing + detail pages on top, with debounced autocomplete and skeleton loading.",
  },
  {
    no: '03',
    title: 'Authentication',
    body: "JWT auth, Formik + Yup for validation. Added a role field to the User schema early so admin could slot in later without a migration — first admin set by hand in Mongo.",
  },
  {
    no: '04',
    title: 'Cart & Checkout',
    body: "Cart is one document per item, not a nested array. Paystack integration with crypto-generated references per transaction.",
  },
  {
    no: '05',
    title: 'Confirmation & Account',
    body: "Order confirmation emails through Nodemailer. Built a MyOrders view and account dropdown so a signed-in user can see what they bought.",
  },
];

export default function About() {
  return (
    <>
    <Navbar/>
    <div className="about">
      <section className="about-hero">
        <div className="about-orbit" ></div>
        <p className="about-eyebrow">build log</p>
        <img style={{width: '8rem', height:"7rem", marginBottom:"10px"}} src="/sly-logo-white.svg" alt="Sly" />
        <p className="about-sub">
          Full MERN e-commerce build, submitted in fulfillment of the SQI Level 3 project. This is what actually happened.
        </p>
      </section>

      <section className="about-overview">
        <p>
          Real product data, real Paystack payments, real emails when an order
          goes through. Complete checkout flow.
        </p>
        <div className="about-stack">
          {['React (Vite)', 'Swiper', 'Express.js', 'MongoDB', 'bcrypt', 'Paystack', 'Nodemailer', 'JWT'].map((t) => (
            <span className="about-pill" key={t}>{t}</span>
          ))}
        </div>
      </section>

      <section className="about-log">
        <div className="about-entries">
          {phases.map((p) => (
            <div className="about-entry" data-n={p.no} key={p.no}>
              <h3>{p.title}</h3>
              <p>{p.body}</p>
            </div>
          ))}
        </div>

        <div className="about-note">
          <span className="about-note-tag">field note</span>
          <p>
            Paystack's verify response was nested deeper than I expected —
            checking <code>paystackref.data.status</code> failed silently.
            Dropped <code>console.log</code> at every layer until the real
            path showed up: <code>paystackref.data.data.status</code>. Read
            the actual shape, don't assume it.
          </p>
        </div>
      </section>

      <p className="about-sign">— Sly</p>
    </div>
    </>
  );
}
