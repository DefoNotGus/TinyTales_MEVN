<template>
    <div class="terms-wrapper">
      <h1>Terms and Conditions</h1>
  
      <section>
        <h2>1. Purpose of the Platform</h2>
        <p>
          TinyTales is a community-driven platform designed to let users read, rate, and contribute micro-stories. The goal is to foster creative expression and provide an enjoyable, respectful reading experience for all users.
        </p>
      </section>
  
      <section>
        <h2>2. Data We Collect</h2>
        <p>
          We collect limited data including user-submitted tales, ratings, comments, email addresses for authentication, and temporary IP addresses for guest usage and security purposes.
        </p>
      </section>
  
      <section>
        <h2>3. How Your Data is Used</h2>
        <p>
          Your data is solely used to enhance the user experience, ensure platform security, and maintain fair usage policies. We do not share or sell any personal information.
        </p>
      </section>
  
      <section>
        <h2>4. Data Retention</h2>
        <p>
          Ratings and temporary data such as IP addresses for guest interactions are stored for a maximum of 24 hours. Registered user data (username and email) is stored until the account is deleted by the user or our team for T&C Violations.
        </p>
      </section>
  
      <section>
        <h2>5. Community Guidelines</h2>
        <p>
          Abuse, harassment, hate speech, or any form of discrimination is strictly prohibited. Violations may result in permanent suspension of access without notice.
        </p>
      </section>
  
      <section>
        <h2>6. Support</h2>
        <p>
          For any platform concerns, data requests, or reports of abuse, please contact our support team at
          <a :href="supportLink" class="hidden-link">this address</a>.
        </p>
      </section>
    </div>
  </template>
  
  <script setup>
  const supportLink = 'mailto:g.rangel@rgu.ac.uk';
  </script>
  
  <style scoped>
  .terms-wrapper {
    max-width: 800px;
    margin: auto;
    padding: 2rem;
    font-family: 'Arial', sans-serif;
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    color: #333;
  }
  
  h1, h2 {
    color: #2c3e50;
  }
  
  p {
    line-height: 1.6;
    margin-bottom: 1rem;
  }
  
  .hidden-link {
    color: #0077cc;
    text-decoration: none;
    border-bottom: 1px dashed #0077cc;
  }
  
  .hidden-link:hover {
    text-decoration: underline;
  }
  </style>