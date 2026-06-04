import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Building2, MapPin, Phone, Mail, Globe, Clock, Calendar,
  Image as ImageIcon, FileText, Tag, Save, ArrowLeft, CheckCircle, X, Navigation
} from "lucide-react";
import { addBusiness } from "@/lib/api/add-business.functions";

const API = import.meta.env.VITE_API_BASE_URL || "https://vanigan-app-automation-5il0.onrender.com";

const SUBCATEGORY_MAPPING: Record<string, string[]> = {
  "Advertising": ["Branding & Marketing", "Digital & Display Advertising"],
  "Advocate & Legal": ["Notary & Documentation", "Property Case Advocates"],
  "Agriculture": ["Agricultural Equipment", "Fertilizers & Organic Products", "Nursery & Cattle", "Seeds & Trees"],
  "Automobile": ["Auto Parts & Accessories", "Car & Bike Sales"],
  "B2B Services": ["Chemicals & Industrial Supplies"],
  "Banking & Finance": ["Share Market & Crypto"],
  "Caterers": ["Party & Birthday Caterers"],
  "Civil Contractors": ["Building & Construction", "Interior & Flooring", "Painting & Waterproofing"],
  "Construction Materials": ["Cement, Sand & Bricks", "PVC, Doors & Windows", "Paints & Hardware", "Tiles, Granite & Mosaic"],
  "Courier Services": ["Local Courier"],
  "Daily Needs": ["Dry Fruits & Pooja Items", "Fish & Meat Shops", "Fruits & Vegetable Shops", "Grocery & Supermarkets", "Juice Bars & Drinking Water"],
  "Demand Services": ["Housekeeping Services"],
  "Digital & IT Products": ["Computer Sales & Service", "Networking & UPS"],
  "Doctors": ["General Physicians"],
  "Education": ["Colleges & Universities", "Music, Art & Language Classes", "Schools", "Study Abroad Consultants", "Tuition Centres"],
  "Electricals & Electronics": ["Electrical Shops", "Electronics Showrooms", "GPS Vehicle Tracking", "Hardware Stores", "Plumbing & Water Treatment"],
  "Hire Services": ["Furniture & Appliances on Hire"],
  "Home Appliances": ["Furniture Showrooms", "TV Showrooms"],
  "Hospitals & Clinics": ["Multi-specialty Hospitals"],
  "Hotels & Restaurants": ["Coffee Shops & Cafes", "Fast Food & Biryani Shops", "Resorts & Guest Houses", "Veg & Non-Veg Restaurants"],
  "IT & Software": ["IT Consultants & Solutions", "Software Development Companies"],
  "Insurance": ["Health Insurance", "Insurance Agents", "Life Insurance (LIC)"],
  "Jewellery": ["Jewellery Showrooms"],
  "Jobs": ["BPO & Call Centres", "HR & Manpower Services", "Part-time & Work-from-Home"],
  "Organic Products": ["Organic Food & Dairy"],
  "Packers & Movers": ["Local Movers"],
  "Pest Control": ["Residential & Commercial Pest Control"],
  "Printing Services": ["Books & Stationery Printing", "Digital Printing", "Printing Press", "Stickers & Labels"],
  "Real Estate": ["Plots & Lands", "Real Estate Agents & Builders", "Villas"],
  "Religious": ["Religious Trusts & Organisations"],
  "Repairs": ["AC & Refrigerator Repair"],
  "Spa & Beauty": ["Beauty Parlours", "Facial Services"],
  "Sports": ["Sports Coaching"],
  "Textiles & Garments": ["Handloom & Fabrics", "Men's Wear", "Ready-made Garment Retailers"],
  "Transport": ["Cab Services", "Drivers on Hire", "Travels & Tour Operators", "Vehicle Transport"],
  "Wedding Services": ["Bridal Makeup & Mehendi", "Decorators & Florists", "Wedding Cards & Event Organisers", "Wedding Photographers"]
};

const DAYS_OF_WEEK = [
  { label: "M", value: "Monday" },
  { label: "T", value: "Tuesday" },
  { label: "W", value: "Wednesday" },
  { label: "T", value: "Thursday" },
  { label: "F", value: "Friday" },
  { label: "S", value: "Saturday" },
  { label: "S", value: "Sunday" },
];

const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2);
  const minute = i % 2 === 0 ? "00" : "30";
  const hourString = hour.toString().padStart(2, "0");
  const value = `${hourString}:${minute}`;
  const ampm = hour >= 12 ? "PM" : "AM";
  const h12 = hour % 12 || 12;
  const label = `${h12.toString().padStart(2, "0")}:${minute} ${ampm}`;
  return { value, label };
});

const ASSEMBLY_CONSTITUENCIES = [
  "Alandur", "Alangulam", "Ambasamudram", "Ambattur", "Ambur", "Anaikattu",
  "Andipatti", "Anna Nagar", "Arakkonam", "Aranthangi", "Arcot", "Ariyalur",
  "Avadi", "Bhavani", "Chengalpattu", "Chengam", "Chepauk-Thiruvallikeni",
  "Cheyyur", "Coimbatore (North)", "Coimbatore (South)", "Dharmapuri", "Dindigul",
  "Dr.Radhakrishnan Nagar", "Egmore", "Erode (East)", "Erode (West)", "Gangavalli",
  "Gudalur", "Harbour", "Hosur", "Kadayanallur", "Kallakurichi", "Kancheepuram",
  "Kanniyakumari", "Karur", "Kattumannarkoil", "Kavundampalayam", "Kilvaithinankuppam",
  "Kinathukadavu", "Kovilpatti", "Kumbakonam", "Madavaram", "Madurai Central",
  "Madurai East", "Madurai North", "Madurai South", "Madurai West", "Maduravoyal",
  "Mayiladuthurai", "Mettuppalayam", "Mettur", "Mylapore", "Nagapattinam",
  "Nagercoil", "Nanguneri", "Nilakkottai", "Ottapidaram", "Palani", "Palayamkottai",
  "Pallavaram", "Panruti", "Paramakudi", "Pattukkottai", "Perambalur", "Perambur",
  "Peravurani", "Pollachi", "Poonamallee", "Radhapuram", "Rajapalayam",
  "Ramanathapuram", "Saidapet", "Salem (North)", "Salem (South)", "Shozhinganallur",
  "Singanallur", "Sivakasi", "Sriperumbudur", "Srirangam", "Sulur", "Tambaram",
  "Thanjavur", "Thiru-Vi-Ka-Nagar", "Thiruparankundram", "Thiruvaiyaru",
  "Thiruvallur", "Thiruverumbur", "Thiruvottiyur", "Thiyagarayanagar", "Thondamuthur",
  "Thoothukkudi", "Tiruchengodu", "Tiruchirappalli (East)", "Tirunelveli",
  "Tiruppur (North)", "Tiruppur (South)", "Tiruttani", "Udumalaipettai",
  "Uthiramerur", "Vandavasi", "Velachery", "Vellore", "Veppanahalli", "Vilavancode",
  "Villivakkam", "Viluppuram", "Virudhunagar", "Virugampakkam", "Vriddhachalam",
  "Yercaud"
];

const compressImage = (file: File, maxWidth = 1200, maxHeight = 1200, quality = 0.7): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

export const Route = createFileRoute("/add-business")({
  head: () => ({
    meta: [
      { title: "Add Business — Vanigan.org" },
      { name: "description", content: "Register your business with Vanigan" },
    ],
  }),
  component: AddBusinessPage,
});

interface FormData {
  name: string;
  description: string;
  category: string;
  subCategory: string;
  phone: string;
  phone2: string;
  email: string;
  website: string;
  city: string;
  district: string;
  assembly: string;
  address: string;
  pincode: string;
  landmark: string;
  openDays: string;
  openTime: string;
  closeTime: string;
  coverImage: string;
  lat: string;
  lng: string;
}

function AddBusinessPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    category: "",
    subCategory: "",
    phone: "",
    phone2: "",
    email: "",
    website: "",
    city: "",
    district: "",
    assembly: "",
    address: "",
    pincode: "",
    landmark: "",
    openDays: "",
    openTime: "",
    closeTime: "",
    coverImage: "",
    lat: "",
    lng: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCustomSubCategory, setIsCustomSubCategory] = useState(false);
  const [isCustomAssembly, setIsCustomAssembly] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  // Fetch categories for dropdown with fallback
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      try {
        const resp = await fetch(`${API}/api/public/categories`);
        if (!resp.ok) {
          // Return common business categories as fallback
          return [
            "Hotels & Restaurants",
            "Caterers",
            "Daily Needs",
            "Organic Products",
            "Doctors",
            "Hospitals & Clinics",
            "Pharmacy",
            "Spa & Beauty",
            "Education",
            "Coaching Centers",
            "IT & Software",
            "Electricals & Electronics",
            "Construction Materials",
            "Civil Contractors",
            "Real Estate",
            "Interior Design",
            "Transport",
            "Automobiles",
            "Textiles & Garments",
            "Jewellery",
            "Footwear",
            "Agriculture",
            "Nursery & Plants",
            "B2B Services",
            "Finance & Banking",
            "Legal Services",
            "Advertising",
            "Printing Services",
            "Photography",
            "Wedding Services",
            "Event Management",
            "Home Appliances",
            "Furniture",
            "Hardware & Tools"
          ];
        }
        const data = await resp.json();
        // If API returns empty or invalid data, use fallback
        if (!Array.isArray(data) || data.length === 0) {
          return [
            "Hotels & Restaurants",
            "Caterers",
            "Daily Needs",
            "Organic Products",
            "Doctors",
            "Hospitals & Clinics",
            "Pharmacy",
            "Spa & Beauty",
            "Education",
            "Coaching Centers",
            "IT & Software",
            "Electricals & Electronics",
            "Construction Materials",
            "Civil Contractors",
            "Real Estate",
            "Interior Design",
            "Transport",
            "Automobiles",
            "Textiles & Garments",
            "Jewellery",
            "Footwear",
            "Agriculture",
            "Nursery & Plants",
            "B2B Services",
            "Finance & Banking",
            "Legal Services",
            "Advertising",
            "Printing Services",
            "Photography",
            "Wedding Services",
            "Event Management",
            "Home Appliances",
            "Furniture",
            "Hardware & Tools"
          ];
        }
        return data;
      } catch (error) {
        console.error("Error fetching categories:", error);
        // Return common business categories as fallback
        return [
          "Hotels & Restaurants",
          "Caterers",
          "Daily Needs",
          "Organic Products",
          "Doctors",
          "Hospitals & Clinics",
          "Pharmacy",
          "Spa & Beauty",
          "Education",
          "Coaching Centers",
          "IT & Software",
          "Electricals & Electronics",
          "Construction Materials",
          "Civil Contractors",
          "Real Estate",
          "Interior Design",
          "Transport",
          "Automobiles",
          "Textiles & Garments",
          "Jewellery",
          "Footwear",
          "Agriculture",
          "Nursery & Plants",
          "B2B Services",
          "Finance & Banking",
          "Legal Services",
          "Advertising",
          "Printing Services",
          "Photography",
          "Wedding Services",
          "Event Management",
          "Home Appliances",
          "Furniture",
          "Hardware & Tools"
        ];
      }
    },
  });

  // Fetch districts for dropdown with fallback
  const { data: districts = [] } = useQuery({
    queryKey: ["districts"],
    queryFn: async () => {
      try {
        const resp = await fetch(`${API}/api/public/districts`);
        if (!resp.ok) {
          // Return Tamil Nadu's 38 districts as fallback
          return [
            "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore",
            "Dharmapuri", "Dindigul", "Erode", "Kallakurichi", "Kanchipuram",
            "Kanyakumari", "Karur", "Krishnagiri", "Madurai", "Mayiladuthurai",
            "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai",
            "Ramanathapuram", "Ranipet", "Salem", "Sivaganga", "Tenkasi",
            "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli",
            "Tirupathur", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur",
            "Vellore", "Viluppuram", "Virudhunagar"
          ];
        }
        const data = await resp.json();
        // If API returns empty or invalid data, use fallback
        if (!Array.isArray(data) || data.length === 0) {
          return [
            "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore",
            "Dharmapuri", "Dindigul", "Erode", "Kallakurichi", "Kanchipuram",
            "Kanyakumari", "Karur", "Krishnagiri", "Madurai", "Mayiladuthurai",
            "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai",
            "Ramanathapuram", "Ranipet", "Salem", "Sivaganga", "Tenkasi",
            "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli",
            "Tirupathur", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur",
            "Vellore", "Viluppuram", "Virudhunagar"
          ];
        }
        return data;
      } catch (error) {
        console.error("Error fetching districts:", error);
        // Return Tamil Nadu's 38 districts as fallback
        return [
          "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore",
          "Dharmapuri", "Dindigul", "Erode", "Kallakurichi", "Kanchipuram",
          "Kanyakumari", "Karur", "Krishnagiri", "Madurai", "Mayiladuthurai",
          "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai",
          "Ramanathapuram", "Ranipet", "Salem", "Sivaganga", "Tenkasi",
          "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli",
          "Tirupathur", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur",
          "Vellore", "Viluppuram", "Virudhunagar"
        ];
      }
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "category") {
      setFormData(prev => ({ ...prev, category: value, subCategory: "" }));
      setIsCustomSubCategory(false);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubCategorySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === "Other") {
      setIsCustomSubCategory(true);
      setFormData(prev => ({ ...prev, subCategory: "" }));
    } else {
      setIsCustomSubCategory(false);
      setFormData(prev => ({ ...prev, subCategory: val }));
    }
  };

  const handleAssemblySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === "Other") {
      setIsCustomAssembly(true);
      setFormData(prev => ({ ...prev, assembly: "" }));
    } else {
      setIsCustomAssembly(false);
      setFormData(prev => ({ ...prev, assembly: val }));
    }
  };

  const toggleDay = (dayValue: string) => {
    const currentDays = formData.openDays
      ? formData.openDays.split(",").map(d => d.trim()).filter(Boolean)
      : [];
    
    let newDays;
    if (currentDays.includes(dayValue)) {
      newDays = currentDays.filter(d => d !== dayValue);
    } else {
      newDays = [...currentDays, dayValue];
    }
    
    const sortedDays = DAYS_OF_WEEK
      .map(d => d.value)
      .filter(d => newDays.includes(d));

    setFormData(prev => ({
      ...prev,
      openDays: sortedDays.join(","),
    }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setSubmitError('Please select a valid image file');
        return;
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setSubmitError('Image size should be less than 10MB');
        return;
      }

      setImageFile(file);
      setSubmitError('');
      
      try {
        const compressedBase64 = await compressImage(file);
        setImagePreview(compressedBase64);
      } catch (err) {
        console.error("Compression failed, using original base64 preview", err);
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
    setFormData(prev => ({ ...prev, coverImage: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    try {
      let imageUrl = formData.coverImage;
      
      // If user uploaded a file, convert to base64 and save
      if (imageFile) {
        imageUrl = imagePreview; // Use the base64 preview as the image
      }
      
      const dataToSubmit = {
        ...formData,
        coverImage: imageUrl
      };
      
      const result = await addBusiness({ data: dataToSubmit });
      
      setSubmitSuccess(true);
      setTimeout(() => {
        navigate({ to: "/list-business" });
      }, 2000);
    } catch (error) {
      setSubmitError((error as Error).message || "Failed to submit business listing");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-zinc-50/50 flex items-center justify-center p-4">
        <div className="text-center max-w-md w-full bg-white border border-zinc-200/80 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8">
          <div className="size-16 mx-auto mb-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle className="size-8" strokeWidth={2} />
          </div>
          <h2 className="text-xl font-bold text-zinc-900 mb-1">
            Business Added!
          </h2>
          <p className="text-sm text-zinc-500 mb-6">
            Your listing has been submitted successfully.
          </p>
          <div className="flex items-center justify-center gap-2 text-xs text-zinc-400">
            <div className="size-3 border-2 border-zinc-300 border-t-sage rounded-full animate-spin" />
            <span>Redirecting to business list...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50/50">
      {/* Header */}
      <header className="border-b border-zinc-200/60 sticky top-0 z-50 backdrop-blur-md bg-white/90">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-sage/10 flex items-center justify-center text-sage">
                <Building2 className="size-5" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-zinc-900 tracking-tight">Add New Business</h1>
                <p className="text-xs text-zinc-500">Register your business in our directory</p>
              </div>
            </div>
            <button
              onClick={() => navigate({ to: "/" })}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 rounded-lg transition-colors cursor-pointer"
            >
              <ArrowLeft className="size-3.5" />
              Back
            </button>
          </div>
        </div>
      </header>

      {/* Main Form */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Basic Information */}
          <section className="bg-white rounded-2xl border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
            <div className="bg-zinc-50/50 px-6 py-4 border-b border-zinc-200/60 flex items-center gap-2.5">
              <Building2 className="size-4.5 text-zinc-500" />
              <h2 className="text-sm font-semibold text-zinc-900">Basic Information</h2>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                  Business Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Chennai Super Foods"
                  className="w-full px-3.5 py-2.5 bg-white border border-zinc-200 rounded-xl text-zinc-900 placeholder:text-zinc-400/80 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                  Business Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Provide a detailed description of your business, services, or products..."
                  className="w-full px-3.5 py-2.5 bg-white border border-zinc-200 rounded-xl text-zinc-900 placeholder:text-zinc-400/80 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all duration-200 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-3.5 py-2.5 bg-white border border-zinc-200 rounded-xl text-zinc-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all duration-200 text-sm cursor-pointer"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat: any, index: number) => {
                      const categoryName = typeof cat === 'string' ? cat : (cat.name || cat);
                      const categoryKey = typeof cat === 'string' ? `${cat}-${index}` : (cat._id || cat.id || `${categoryName}-${index}`);
                      return (
                        <option key={categoryKey} value={categoryName}>
                          {categoryName}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                    Sub Category
                  </label>
                  {!formData.category ? (
                    <select
                      disabled
                      className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-400 text-sm cursor-not-allowed animate-pulse"
                    >
                      <option>Select Category First</option>
                    </select>
                  ) : SUBCATEGORY_MAPPING[formData.category] ? (
                    <div className="space-y-3">
                      <select
                        name="subCategorySelect"
                        value={isCustomSubCategory ? "Other" : formData.subCategory}
                        onChange={handleSubCategorySelect}
                        className="w-full px-3.5 py-2.5 bg-white border border-zinc-200 rounded-xl text-zinc-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all duration-200 text-sm cursor-pointer"
                      >
                        <option value="">Select Sub Category</option>
                        {SUBCATEGORY_MAPPING[formData.category].map((sub: string) => (
                          <option key={sub} value={sub}>
                            {sub}
                          </option>
                        ))}
                        <option value="Other">Other / Custom</option>
                      </select>
                      
                      {isCustomSubCategory && (
                        <input
                          type="text"
                          name="subCategory"
                          value={formData.subCategory}
                          onChange={handleChange}
                          required
                          placeholder="Type custom subcategory..."
                          className="w-full px-3.5 py-2.5 bg-white border border-zinc-200 rounded-xl text-zinc-900 placeholder:text-zinc-400/80 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all duration-200"
                        />
                      )}
                    </div>
                  ) : (
                    <input
                      type="text"
                      name="subCategory"
                      value={formData.subCategory}
                      onChange={handleChange}
                      placeholder="e.g. South Indian, Catering"
                      className="w-full px-3.5 py-2.5 bg-white border border-zinc-200 rounded-xl text-zinc-900 placeholder:text-zinc-400/80 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all duration-200"
                    />
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section className="bg-white rounded-2xl border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
            <div className="bg-zinc-50/50 px-6 py-4 border-b border-zinc-200/60 flex items-center gap-2.5">
              <Phone className="size-4.5 text-zinc-500" />
              <h2 className="text-sm font-semibold text-zinc-900">Contact Information</h2>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="e.g. 9876543210"
                    className="w-full px-3.5 py-2.5 bg-white border border-zinc-200 rounded-xl text-zinc-900 placeholder:text-zinc-400/80 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                    Alternate Phone
                  </label>
                  <input
                    type="tel"
                    name="phone2"
                    value={formData.phone2}
                    onChange={handleChange}
                    placeholder="e.g. 9876543211"
                    className="w-full px-3.5 py-2.5 bg-white border border-zinc-200 rounded-xl text-zinc-900 placeholder:text-zinc-400/80 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all duration-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. contact@business.com"
                    className="w-full px-3.5 py-2.5 bg-white border border-zinc-200 rounded-xl text-zinc-900 placeholder:text-zinc-400/80 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                    Website URL
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="e.g. https://www.business.com"
                    className="w-full px-3.5 py-2.5 bg-white border border-zinc-200 rounded-xl text-zinc-900 placeholder:text-zinc-400/80 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all duration-200"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Location Information */}
          <section className="bg-white rounded-2xl border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
            <div className="bg-zinc-50/50 px-6 py-4 border-b border-zinc-200/60 flex items-center gap-2.5">
              <MapPin className="size-4.5 text-zinc-500" />
              <h2 className="text-sm font-semibold text-zinc-900">Location Information</h2>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                    District <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    required
                    className="w-full px-3.5 py-2.5 bg-white border border-zinc-200 rounded-xl text-zinc-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all duration-200 text-sm cursor-pointer"
                  >
                    <option value="">Select District</option>
                    {districts.map((dist: any, index: number) => {
                      const districtName = typeof dist === 'string' ? dist : (dist.name || dist);
                      const districtKey = typeof dist === 'string' ? `${dist}-${index}` : (dist._id || dist.id || `${districtName}-${index}`);
                      return (
                        <option key={districtKey} value={districtName}>
                          {districtName}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                    City/Town
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g. T Nagar"
                    className="w-full px-3.5 py-2.5 bg-white border border-zinc-200 rounded-xl text-zinc-900 placeholder:text-zinc-400/80 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                    Pincode
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="e.g. 600017"
                    className="w-full px-3.5 py-2.5 bg-white border border-zinc-200 rounded-xl text-zinc-900 placeholder:text-zinc-400/80 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all duration-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                    Assembly Constituency
                  </label>
                  <div className="space-y-3">
                    <select
                      name="assemblySelect"
                      value={isCustomAssembly ? "Other" : formData.assembly}
                      onChange={handleAssemblySelect}
                      className="w-full px-3.5 py-2.5 bg-white border border-zinc-200 rounded-xl text-zinc-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all duration-200 text-sm cursor-pointer"
                    >
                      <option value="">Select Assembly Constituency</option>
                      {ASSEMBLY_CONSTITUENCIES.map((assemblyName) => (
                        <option key={assemblyName} value={assemblyName}>
                          {assemblyName}
                        </option>
                      ))}
                      <option value="Other">Other / Custom</option>
                    </select>
                    
                    {isCustomAssembly && (
                      <input
                        type="text"
                        name="assembly"
                        value={formData.assembly}
                        onChange={handleChange}
                        required
                        placeholder="Type custom assembly constituency..."
                        className="w-full px-3.5 py-2.5 bg-white border border-zinc-200 rounded-xl text-zinc-900 placeholder:text-zinc-400/80 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all duration-200"
                      />
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                    Landmark
                  </label>
                  <input
                    type="text"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleChange}
                    placeholder="e.g. Opp. Bus Terminus"
                    className="w-full px-3.5 py-2.5 bg-white border border-zinc-200 rounded-xl text-zinc-900 placeholder:text-zinc-400/80 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all duration-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                  Full Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  rows={3}
                  placeholder="Enter full street address, door number, and landmark details..."
                  className="w-full px-3.5 py-2.5 bg-white border border-zinc-200 rounded-xl text-zinc-900 placeholder:text-zinc-400/80 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all duration-200 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                    Latitude (Optional)
                  </label>
                  <input
                    type="text"
                    name="lat"
                    value={formData.lat}
                    onChange={handleChange}
                    placeholder="e.g. 13.0827"
                    className="w-full px-3.5 py-2.5 bg-white border border-zinc-200 rounded-xl text-zinc-900 placeholder:text-zinc-400/80 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all duration-200"
                  />
                  <p className="text-[11px] text-zinc-400 mt-1">Required for showing on the Google Map</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                    Longitude (Optional)
                  </label>
                  <input
                    type="text"
                    name="lng"
                    value={formData.lng}
                    onChange={handleChange}
                    placeholder="e.g. 80.2707"
                    className="w-full px-3.5 py-2.5 bg-white border border-zinc-200 rounded-xl text-zinc-900 placeholder:text-zinc-400/80 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all duration-200"
                  />
                  <p className="text-[11px] text-zinc-400 mt-1">Required for showing on the Google Map</p>
                </div>
              </div>
            </div>
          </section>

          {/* Business Hours */}
          <section className="bg-white rounded-2xl border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
            <div className="bg-zinc-50/50 px-6 py-4 border-b border-zinc-200/60 flex items-center gap-2.5">
              <Clock className="size-4.5 text-zinc-500" />
              <h2 className="text-sm font-semibold text-zinc-900">Business Hours</h2>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-2">
                  Open Days
                </label>
                <div className="flex flex-wrap gap-2 items-center">
                  {DAYS_OF_WEEK.map((day) => {
                    const isSelected = formData.openDays
                      ? formData.openDays.split(",").map(d => d.trim()).includes(day.value)
                      : false;
                    return (
                      <button
                        key={day.value}
                        type="button"
                        onClick={() => toggleDay(day.value)}
                        className={`w-10 h-10 p-0 shrink-0 rounded-full border text-xs font-semibold flex items-center justify-center transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? "bg-sage border-sage text-white shadow-xs focus:ring-2 focus:ring-sage/20"
                            : "bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50"
                        }`}
                        title={day.value}
                      >
                        {day.label}
                      </button>
                    );
                  })}
                </div>
                {formData.openDays && (
                  <p className="text-[11px] text-zinc-500 mt-2">
                    Selected: <span className="font-medium text-zinc-700">{formData.openDays.split(",").join(", ")}</span>
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                    Opening Time
                  </label>
                  <select
                    name="openTime"
                    value={formData.openTime}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-white border border-zinc-200 rounded-xl text-zinc-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all duration-200 text-sm cursor-pointer"
                  >
                    <option value="">Select Opening Time</option>
                    {TIME_OPTIONS.map((time) => (
                      <option key={time.value} value={time.value}>
                        {time.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                    Closing Time
                  </label>
                  <select
                    name="closeTime"
                    value={formData.closeTime}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-white border border-zinc-200 rounded-xl text-zinc-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all duration-200 text-sm cursor-pointer"
                  >
                    <option value="">Select Closing Time</option>
                    {TIME_OPTIONS.map((time) => (
                      <option key={time.value} value={time.value}>
                        {time.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* Business Image */}
          <section className="bg-white rounded-2xl border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
            <div className="bg-zinc-50/50 px-6 py-4 border-b border-zinc-200/60 flex items-center gap-2.5">
              <ImageIcon className="size-4.5 text-zinc-500" />
              <h2 className="text-sm font-semibold text-zinc-900">Business Image</h2>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Image Preview */}
              {imagePreview && (
                <div className="relative rounded-xl overflow-hidden border border-zinc-200 shadow-sm bg-zinc-50">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-48 object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-3 right-3 size-8 rounded-full bg-zinc-900/80 hover:bg-zinc-900 text-white flex items-center justify-center transition-colors shadow-md cursor-pointer"
                  >
                    <X className="size-4.5" />
                  </button>
                </div>
              )}

              {/* File Upload */}
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                  Upload Cover Photo
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="flex flex-col items-center justify-center w-full h-32 border border-dashed border-zinc-300 hover:border-indigo-500 rounded-xl cursor-pointer bg-zinc-50/30 hover:bg-zinc-50 transition-all"
                  >
                    <ImageIcon className="size-7 text-zinc-400 mb-2" />
                    <span className="text-xs font-semibold text-zinc-700">Click to upload photo</span>
                    <span className="text-[10px] text-zinc-400 mt-1">PNG, JPG, JPEG (Max 5MB)</span>
                  </label>
                </div>
              </div>

              {/* OR Divider */}
              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-200/80"></div>
                </div>
                <div className="relative flex justify-center text-[10px] tracking-wider uppercase font-semibold text-zinc-400">
                  <span className="px-3 bg-white text-zinc-400">OR</span>
                </div>
              </div>

              {/* URL Input */}
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                  Or Paste Image URL
                </label>
                <input
                  type="url"
                  name="coverImage"
                  value={formData.coverImage}
                  onChange={handleChange}
                  placeholder="https://example.com/cover-photo.jpg"
                  className="w-full px-3.5 py-2.5 bg-white border border-zinc-200 rounded-xl text-zinc-900 placeholder:text-zinc-400/80 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all duration-200"
                  disabled={!!imageFile}
                />
                <p className="text-[11px] text-zinc-400 mt-1.5">Provide a publicly hosted image URL instead of uploading</p>
              </div>
            </div>
          </section>

          {/* Error Message */}
          {submitError && (
            <div className="bg-red-50 border border-red-200/60 rounded-xl p-4">
              <div className="flex items-start gap-2.5">
                <div className="text-red-500 shrink-0 mt-0.5">
                  <X className="size-4.5" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-red-900 text-xs uppercase tracking-wider">Submission Failed</p>
                  <p className="text-sm text-red-700 mt-1">{submitError}</p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate({ to: "/" })}
              className="px-5 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-100 rounded-xl border border-zinc-200 transition-all cursor-pointer bg-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold bg-sage hover:bg-sage-soft text-white rounded-xl shadow-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="size-4" />
                  Add Business
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
