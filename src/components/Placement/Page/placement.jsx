// Sales.jsx
import React from 'react';
import PlacementForm from '../Components/placementform';  // Importing SalesForm component
import PlacementFormSubmit from '../Components/placementformsubmit';  // Importing Submit component

function Sales() {
  return (
    <div className='bg-white font-inter '>
      <PlacementForm />  {/* You can use SalesForm here */}
      <PlacementFormSubmit />     {/* You can use Submit here */}
    </div>
  );
}

export default Sales;
