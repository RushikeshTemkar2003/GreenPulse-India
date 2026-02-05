import React from 'react';

const About = () => {
  return (
    <div className="about-page py-5 bg-light">
      <div className="container">
        <div className="text-center mb-5">
          <h1 className="fw-bold text-success">🌿 About GreenPulse</h1>
          <p className="lead text-muted">
            Empowering communities to create a greener, cleaner, and more sustainable planet.
          </p>
        </div>

        {/* Our Motivation */}
        <div className="card shadow mb-4">
          <div className="card-body">
            <h3 className="text-success mb-3">💡 Our Motivation</h3>
            <p>
              GreenPulse was founded with a simple yet powerful vision — to inspire environmental
              consciousness and bring together people who believe that every small action counts.
              With increasing waste generation, pollution, and climate change, we realized the urgent
              need to build a platform that bridges technology with sustainability.
            </p>
            <p>
              Every tree planted, every plastic bottle recycled, and every volunteer effort adds up
              to make a massive difference. Our motivation stems from the belief that collective action
              can reshape our future.
            </p>
          </div>
        </div>

        {/* Our Goals */}
        <div className="card shadow mb-4">
          <div className="card-body">
            <h3 className="text-success mb-3">🎯 Our Goals</h3>
            <ul>
              <li>To reduce carbon footprint through eco-friendly initiatives.</li>
              <li>To connect volunteers, donors, and organizations on a unified green platform.</li>
              <li>To promote recycling and tree plantation across urban and rural areas.</li>
              <li>To spread environmental education and encourage youth participation.</li>
            </ul>
          </div>
        </div>

        {/* Our Vision */}
        <div className="card shadow mb-4">
          <div className="card-body">
            <h3 className="text-success mb-3">🌱 Our Vision</h3>
            <p>
              Our vision is to build an India where sustainability is not an option but a way of life.
              Through GreenPulse, we aim to make environmental action accessible, measurable, and
              community-driven.
            </p>
            <p>
              Together, we can transform awareness into action — one step, one initiative, one green
              pulse at a time.
            </p>
          </div>
        </div>

        {/* Team Section (Optional) */}
        <div className="card shadow mb-4">
          <div className="card-body">
            <h3 className="text-success mb-3">👥 Meet the Team</h3>
            <p>
              GreenPulse is powered by a passionate team of developers, innovators, and environmental
              enthusiasts who share a common dream — to make sustainability simple and impactful for
              everyone.
            </p>
          </div>
        </div>

        <div className="text-center mt-4">
          <h5 className="text-muted">“Small actions, when multiplied by millions, can transform the world.”</h5>
        </div>
      </div>
    </div>
  );
};

export default About;
