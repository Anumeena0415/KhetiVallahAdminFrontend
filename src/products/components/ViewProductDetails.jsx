import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProducts } from "../../api/product";
import { 
  Package, Tag, Store, User, MapPin, IndianRupee, 
  ChevronLeft, Loader2, Sprout, ShieldCheck, ImageIcon 
} from "lucide-react";

const ViewProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchProductById, single, loading } = useProducts();
  
  const product = single?.product || single;
  const stock=single?.stock || single?.product?.stock;

  useEffect(() => {
    if (id) {
      fetchProductById(id);
    }
  }, [id, fetchProductById]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-500">
        <Loader2 className="animate-spin text-[#14532d] mb-4" size={40} />
        <p className="font-medium">Fetching Product Data...</p>
      </div>
    );
  }

  if (!product || !product.name) {
    return (
      <div className="p-10 text-center">
        <p className="text-gray-500">Product details not available.</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-blue-600 underline">Go Back</button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-green-800 transition-colors">
          <ChevronLeft size={20} /> Back
        </button>
        <div className={`px-4 py-1 rounded-full text-xs font-bold border ${
          product.approval?.status === 'APPROVED' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-amber-100 text-amber-700 border-amber-200'
        }`}>
          {product.approval?.status || 'PENDING'}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="space-y-4">
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x scrollbar-hide">
            {product.image && product.image.length > 0 ? (
              product.image.map((img, index) => (
                <img 
                  key={index} 
                  src={img} 
                  alt={product.name} 
                  className="w-full h-80 object-cover rounded-2xl shadow-md snap-center shrink-0"
                />
              ))
            ) : (
              <div className="w-full h-80 bg-gray-200 rounded-2xl flex items-center justify-center text-gray-400">
                <ImageIcon size={48} />
              </div>
            )}
          </div>
          <p className="text-center text-xs text-gray-400">Swipe to view all {product.image?.length || 0} images</p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
          <div>
            <span className="text-green-600 text-xs font-bold uppercase tracking-widest bg-green-50 px-2 py-1 rounded">
              {product.category}
            </span>
            <h1 className="text-4xl font-black text-gray-900 mt-2 capitalize">{product.name}</h1>
            <p className="text-gray-500 mt-4 leading-relaxed">{product.description}</p>
          </div>

          <div className="flex items-center gap-6 py-4 border-y border-gray-50">
            <div>
              <p className="text-xs text-gray-400 uppercase font-bold">Sale Price</p>
              <p className="text-3xl font-black text-[#10913ae8]">₹{product.pricing?.salePrice}</p>
            </div>
            <div className="opacity-50">
              <p className="text-xs text-gray-400 uppercase font-bold">MRP</p>
              <p className="text-xl font-bold line-through">₹{product.pricing?.mrp}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg"><Tag size={18} /></div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-bold">Unit</p>
                <p className="text-sm font-bold capitalize">{product.unit || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg"><Package size={18} /></div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-bold">Stock</p>
                <p className="text-sm font-bold">{stock?.totalStock }</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-gray-800 font-bold">
            <Store size={20} className="text-green-600" />
            <h2>Store & Fulfillment</h2>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Store Name:</span>
              <span className="text-sm font-bold">{product.store?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Verification:</span>
              <span className="text-xs font-bold text-green-600">{product.store?.verification?.verifiedStatus}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-gray-800 font-bold">
            <Sprout size={20} className="text-green-600" />
            <h2>Farm Details</h2>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Farm Name:</span>
              <span className="text-sm font-bold">{product.store?.vendor?.farmName || "Direct Source"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Vendor ID:</span>
              <span className="text-xs font-mono text-gray-400 truncate ml-4">{product.store?.vendor?._id}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProductDetails;