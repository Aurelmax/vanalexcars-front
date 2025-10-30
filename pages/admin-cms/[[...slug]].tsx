import React from 'react';

const PayloadAdmin: React.FC = () => {
  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <iframe
        src="/api/payload/admin"
        style={{
          border: 'none',
          width: '100%',
          height: '100%',
        }}
        title="Payload CMS Admin"
      />
    </div>
  );
};

export default PayloadAdmin;
