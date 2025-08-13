// src/pages/VolunteerHandbook.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const UpdatedOn = new Date().toLocaleDateString();

const Section = ({ id, title, children }) => (
  <section id={id} className="admin-card hb-section">
    <h2 className="card-title">{title}</h2>
    <div className="hb-body">{children}</div>
  </section>
);

export default function handbook() {
  return (
    <div className="handbook-page">
      <div className="admin-header">
        <h1>Volunteer Handbook</h1>
        <div className="admin-breadcrumb">
          <Link to="/">Home</Link> <span>/</span> <span>Volunteer Handbook</span>
        </div>
      </div>

      <div className="hb-topbar">
        <div className="hb-meta">Paws Home • Chicago • Last updated: {UpdatedOn}</div>
        <div className="hb-actions">
          <button className="btn btn--ghost" onClick={() => window.print()}>Print</button>
        </div>
      </div>

      {/* Table of contents */}
      <nav className="admin-card hb-toc">
        <strong>Contents</strong>
        <ul>
          <li><a href="#about">About Paws Home</a></li>
          <li><a href="#conduct">Code of Conduct</a></li>
          <li><a href="#roles">Roles & Training</a></li>
          <li><a href="#schedule">Scheduling & Check-In</a></li>
          <li><a href="#safety">Animal Handling & Safety</a></li>
          <li><a href="#health">Health, Cleaning & PPE</a></li>
          <li><a href="#emergency">Emergency Procedures</a></li>
          <li><a href="#communication">Communication</a></li>
          <li><a href="#policies">Policies</a></li>
          <li><a href="#hours">Logging Your Hours</a></li>
          <li><a href="#events">Adoption Events</a></li>
          <li><a href="#faq">FAQ & Contacts</a></li>
        </ul>
      </nav>

      <Section id="about" title="About Paws Home">
        <p>
          Paws Home is a <strong>Chicago-based</strong> animal rescue and adoption center. Our mission
          is to <em>rescue, rehabilitate, and rehome</em> animals in need while educating the public
          on responsible pet care.
        </p>
        <ul className="hb-list">
          <li><strong>Main Shelter</strong>: 123 Pet Ave (dog kennels, training space, event room)</li>
          <li><strong>Cat Room</strong>: dedicated cat housing and socialization area — quiet first</li>
          <li><strong>Open Hours</strong>: Tue–Sun 10:00–18:00 (Mon is maintenance day)</li>
        </ul>
      </Section>

      <Section id="conduct" title="Code of Conduct">
        <ul className="hb-list">
          <li>Treat animals, visitors, and teammates with <strong>safety, respect, and empathy</strong>.</li>
          <li>Follow staff and Shift Lead instructions; do not perform unauthorized tasks (meds, isolation, transfers).</li>
          <li>Be punctual. If you must miss a shift, cancel it in <Link to="/schedule">Schedule</Link> and inform the coordinator.</li>
          <li>Do not share sensitive info publicly (medical notes, surrender reasons, adopter data).</li>
          <li>Report any bite/scratch or slip/fall <strong>immediately</strong>.</li>
        </ul>
      </Section>

      <Section id="roles" title="Roles & Training">
        <p>
          Claim roles in <Link to="/schedule">Schedule</Link>. First-time shifts require a quick training or shadow.
        </p>
        <ul className="hb-list">
          <li><strong>Dog Walker / Kennel Buddy</strong>: leash walking, basic cues, enrichment (Kongs, snuffle mats).</li>
          <li><strong>Cat Socializer</strong>: gentle play/brush, stress-signal awareness, enrichment.</li>
          <li><strong>Adoption Ambassador</strong>: greet the public, share animal bios, explain the process.</li>
          <li><strong>Event Support</strong>: setup, check-in, wayfinding, supplies.</li>
          <li><strong>Care & Cleaning</strong>: kennel/cattery cleaning, dishes, laundry, inventory tidy-up.</li>
        </ul>
        <p className="hb-note">
          Once you pass training, your account unlocks the role. Want to switch? Ask for a shadow shift.
        </p>
      </Section>

      <Section id="schedule" title="Scheduling & Check-In">
        <ol className="hb-ol">
          <li>Pick a date and shift in <Link to="/schedule">Schedule</Link> (target at least 2 hours/week).</li>
          <li>On arrival, <strong>check in at the front desk</strong>; before leaving, record time in <Link to="/loghours">Log Your Hours</Link>.</li>
          <li>Cancel as early as possible (24h preferred). Watch <Link to="/message">Message</Link> for weather or schedule changes.</li>
        </ol>
      </Section>

      <Section id="safety" title="Animal Handling & Safety">
        <ul className="hb-list">
          <li>Use a <strong>double-clip leash</strong>. Follow the “<strong>one door at a time</strong>” rule in sally ports.</li>
          <li>Stress signals — Dogs: yawning, avoidance, tight body, hard stare. Cats: pinned ears, tail thrash, growl/hiss.</li>
          <li>Let new dogs sniff first; use a wand/toy for new cats before any pick-up. Never force contact.</li>
          <li>No human food. Use treats only as labeled or directed by staff.</li>
          <li>Public/children interactions require staff present and distance control.</li>
        </ul>
      </Section>

      <Section id="health" title="Health, Cleaning & PPE">
        <ul className="hb-list">
          <li>Sanitize hands before entering the Cat Room; change gloves or re-sanitize between rooms.</li>
          <li>Kennels: solids → pre-rinse → detergent → rinse → dry (“dry surfaces clean best”).</li>
          <li>Litter boxes: scoop as you go; bag clumps in <strong>sealed bins</strong>; full change daily.</li>
          <li>Report symptoms: diarrhea, vomiting, nasal discharge, cough, limping, over-grooming/hair loss.</li>
          <li>Wear <strong>closed-toe shoes</strong>, easy-to-wash clothes, hair tied back; use masks/gloves/aprons as posted.</li>
        </ul>
      </Section>

      <Section id="emergency" title="Emergency Procedures">
        <ul className="hb-list">
          <li><strong>Bite/Scratch</strong>: disengage → flush with saline ≥5 min → disinfect → log and tell Shift Lead.</li>
          <li><strong>Animal Escape</strong>: secure doors, stay calm, don’t chase; report last location/direction to staff.</li>
          <li><strong>Fire/Severe Weather</strong>: evacuate to the assembly point (north side of parking lot) as directed.</li>
          <li>Emergency contacts: Front Desk 100 • On-call (206) 348-0033.</li>
        </ul>
      </Section>

      <Section id="communication" title="Communication">
        <p>How we keep in touch:</p>
        <ul className="hb-list">
          <li><Link to="/message">Message</Link>: announcements and direct messages (recruiting, training updates).</li>
          <li>Shifts & swaps: <Link to="/schedule">Schedule</Link>.</li>
          <li>Personal records: <Link to="/loghours">Log Your Hours</Link>.</li>
          <li>Email: <a href="mailto:volunteer@pawshome.org">volunteer@pawshome.org</a></li>
        </ul>
      </Section>

      <Section id="policies" title="Policies">
        <ul className="hb-list">
          <li><strong>Age</strong>: 16+ may volunteer solo; 14–15 require a guardian co-volunteer and joint training.</li>
          <li><strong>Dress Code</strong>: closed-toe shoes, long pants; avoid dangling jewelry/strings.</li>
          <li><strong>Privacy</strong>: do not post medical/adopter info without permission.</li>
          <li><strong>Donations</strong>: give to the front desk for logging; do not accept cash personally.</li>
        </ul>
      </Section>

      <Section id="hours" title="Logging Your Hours">
        <ol className="hb-ol">
          <li>After each shift, go to <Link to="/loghours">Log Your Hours</Link> to submit date, duration, and role.</li>
          <li>Hours count toward training levels and recognition (e.g., “Dog Town Level 1/2/3”).</li>
          <li>Submitted the wrong time? Email the coordinator to fix it.</li>
        </ol>
      </Section>

      <Section id="events" title="Adoption Events">
        <p>
          Events are held at the <strong>Main Shelter</strong> or partner locations around the city
          (see <Link to="/event">Event</Link>).
        </p>
        <ul className="hb-list">
          <li>Arrival: plan to be there <strong>45 minutes early</strong> for setup and role assignments.</li>
          <li>Common roles: greeter, info table, animal care, supplies/clean-up, breakdown.</li>
          <li>Wear your volunteer T-shirt or name badge. Be warm, clear, and professional with visitors.</li>
        </ul>
      </Section>

      <Section id="faq" title="FAQ & Contacts">
        <dl className="hb-faq">
          <dt>Can I volunteer only with cats or only with dogs?</dt>
          <dd>Yes. Sign up for roles that match your completed training.</dd>

          <dt>What if I’m late or something comes up?</dt>
          <dd>Cancel or reschedule in <Link to="/schedule">Schedule</Link> and notify the coordinator ASAP.</dd>

          <dt>How do I get a volunteer letter/certificate?</dt>
          <dd>Once you reach the required hours, email <a href="mailto:volunteer@pawshome.org">volunteer@pawshome.org</a>.</dd>
        </dl>
        <div className="hb-contacts">
          <p>
            <strong>Paws Home • Chicago</strong><br />
            123 Pet Ave, Chicago, IL<br />
            Front Desk: (206) 348-0033 • Email: volunteer@pawshome.org
          </p>
        </div>
      </Section>
    </div>
  );
}
