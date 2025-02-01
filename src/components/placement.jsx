// Sales.jsx
import React from 'react';
import PlacementForm from './placementform';  // Importing SalesForm component
import PlacementFormSubmit from './placementformsubmit';  // Importing Submit component

function Sales() {
  return (
    <div className='bg-white font-inter '>
      <PlacementForm />  {/* You can use SalesForm here */}
      <PlacementFormSubmit />     {/* You can use Submit here */}
    </div>
  );
}

export default Sales;
