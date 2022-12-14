import React from 'react'



const Footer = () => {
  return (
    <div className="bg-dark my-0 text-white text-center py-2">
      <p>
        @ {new Date().getFullYear()} Clientlance - All rights reserved.
        Policies & terms
      </p>
      <p>
        Have a question or need help? Email us: support@clientlance.com,
        WhatsApp: 0799295587{" "}
      </p>
    </div>
  );
}

export default Footer