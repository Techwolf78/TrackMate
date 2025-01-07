// Sales.jsx
import React from 'react';
import PlacementForm from './placementform';  // Importing SalesForm component
import PlacementFormSubmit from './placementformsubmit';  // Importing Submit component

function Sales() {
  return (
    <div className='bg-gradient-to-r from-blue-200 via-teal-100 to-slate-50 font-inter '>
      <PlacementForm />  {/* You can use SalesForm here */}
      <PlacementFormSubmit />     {/* You can use Submit here */}
    </div>
  );
}

export default Sales;
