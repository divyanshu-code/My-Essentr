import { auth } from '@/auth';
import Setrole from '@/Components/Setrole';
import connectDB from '@/Config/Db'
import UserModel from '@/Models/userModel';
import { redirect } from 'next/navigation';
import React, { Suspense } from 'react'
import User from '@/app/(user)/components/User';
import Delivery from '@/app/(delivery)/components/Delivery';
import VendorSetup from './(vendor)/components/VendorSetup';
import VendorModel from '@/Models/vendorModel';
import Vendor from './(vendor)/components/Vendor';
import Loading from '@/Components/Loading';
import GroceryModel from '@/Models/groceryModel';
import GeoUpdater from '@/GeoUpdater';

const page = async () => {

  await connectDB();

  const session = await auth();                               // get the session of the logged in user 

  const user = await UserModel.findById(session?.user?.id)

  const vendor = await VendorModel.findOne({ userId: session?.user?.id });

  const grocery = await GroceryModel.find({});

  if (!user) {
    redirect('/register');
  }

  const inComplete = !user.mobile || (!user.mobile && user.role == "user");

  if (inComplete) {
    return <Setrole />
  }

  // In next.js we canot access the json data direct from servercomponent to clientcomponent therefore we have to change the JSON data to plain data using parsing and stringfy.

  const userdata = JSON.parse(JSON.stringify(user));
  const vendordata = JSON.parse(JSON.stringify(vendor));
  const grocerydata = JSON.parse(JSON.stringify(grocery));

  const renderDashboard = () => {
    switch (userdata.role) {
      case 'vendor':
        return vendor?.status ? <Vendor user={userdata} vendor={vendordata} /> : <VendorSetup user={userdata} />;
      case 'customer':
        return <User user={userdata} grocery={grocerydata} />;
      case 'delivery':
        return <Delivery />;
      default:
        return null;
    }
  };

  return (
    <>

    <GeoUpdater userId={userdata._id} />
    <Suspense fallback={<Loading />}>
      {renderDashboard()}
    </Suspense>
    
    </>
  )
}

export default page