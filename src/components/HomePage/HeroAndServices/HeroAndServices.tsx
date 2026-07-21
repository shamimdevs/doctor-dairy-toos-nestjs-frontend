import {
  Phone,
  MessageSquare,
  UploadCloud,
  Percent,
  Store,
  ArrowRight,
  Shield,
  Truck,
  Sparkles,
  TrendingUp,
  Star,
  Zap,
} from "lucide-react";

const HomepageHero = () => {
  return (
    <div className="bg-linear-to-br from-slate-50 via-white to-emerald-50/30 font-sans antialiased py-8 md:py-12">
      <div className="container ">
        {/* Section Header with Animation */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 md:mb-10">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-400/20 blur-xl rounded-full"></div>
              <div className="relative bg-linear-to-r from-emerald-500 to-emerald-600 p-2.5 rounded-xl shadow-lg shadow-emerald-500/20">
                <Percent className="h-5 w-5 text-white" />
              </div>
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-800">
                Quick Services & Offers
              </h2>
              <p className="text-sm text-slate-500 hidden sm:block">
                Get the best deals and services at your fingertips
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3 sm:mt-0">
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
              🎉 Limited Time Offers
            </span>
          </div>
        </div>

        {/* Main Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {/* Box 1: WhatsApp Order */}
          <div className="group relative bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 flex flex-col justify-between overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-bl from-green-500/10 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-green-500/5 rounded-full -ml-10 -mb-10"></div>

            <div>
              <div className="relative">
                <div className="bg-linear-to-br from-green-400 to-green-600 p-3 rounded-xl w-14 h-14 flex items-center justify-center mb-4 shadow-lg shadow-green-500/20 group-hover:shadow-green-500/40 transition-all">
                  <MessageSquare className="h-7 w-7 text-white fill-current" />
                </div>
                <div className="absolute -top-1 -right-1">
                  <span className="flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </span>
                </div>
              </div>

              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                Order Via WhatsApp
                <Sparkles className="h-4 w-4 text-green-500" />
              </h3>
              <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                Send your medicine list or prescription picture instantly.
              </p>
              <div className="mt-3 flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-green-600" />
                <span className="text-sm font-semibold bg-linear-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
                  01810-117100
                </span>
              </div>
              <div className="mt-2 flex items-center gap-1">
                <Star className="h-3 w-3 text-yellow-400 fill-current" />
                <Star className="h-3 w-3 text-yellow-400 fill-current" />
                <Star className="h-3 w-3 text-yellow-400 fill-current" />
                <Star className="h-3 w-3 text-yellow-400 fill-current" />
                <Star className="h-3 w-3 text-yellow-400 fill-current" />
                <span className="text-xs text-slate-400 ml-1">
                  (2.3k+ orders)
                </span>
              </div>
            </div>

            <a
              href="https://wa.me/8801810117100"
              target="_blank"
              className="mt-6 w-full py-3 bg-linear-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-medium text-sm rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg group"
            >
              <span>Chat & Order</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          {/* Box 2: Upload Prescription */}
          <div className="group relative bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 flex flex-col justify-between overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-bl from-emerald-500/10 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>

            <div>
              <div className="relative">
                <div className="bg-linear-to-br from-emerald-400 to-emerald-600 p-3 rounded-xl w-14 h-14 flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-all">
                  <UploadCloud className="h-7 w-7 text-white" />
                </div>
              </div>

              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    Upload Prescription
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                      UPTO 10% OFF
                    </span>
                  </h3>
                </div>
              </div>
              <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                Upload your prescription and let our certified pharmacists
                handle the rest.
              </p>
              <div className="mt-3 flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="text-xs text-emerald-600 font-medium">
                    100% Genuine
                  </span>
                </div>
                <div className="w-px h-4 bg-slate-200"></div>
                <div className="flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5 text-amber-500" />
                  <span className="text-xs text-amber-600 font-medium">
                    Fast Delivery
                  </span>
                </div>
              </div>
            </div>

            <button className="mt-6 w-full py-3 bg-linear-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-medium text-sm rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg group">
              <span>Upload Now</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Box 3: Register Pharmacy */}
          <div className="group relative bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 flex flex-col justify-between overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-bl from-blue-500/10 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>

            <div>
              <div className="relative">
                <div className="bg-linear-to-br from-blue-400 to-blue-600 p-3 rounded-xl w-14 h-14 flex items-center justify-center mb-4 shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all">
                  <Store className="h-7 w-7 text-white" />
                </div>
              </div>

              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    Register Pharmacy
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                      UPTO 14% OFF
                    </span>
                  </h3>
                </div>
              </div>
              <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                B2B portal for retail pharmacies. Order wholesale stock.
              </p>
              <div className="mt-3 flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5 text-blue-600" />
                  <span className="text-xs text-blue-600 font-medium">
                    Wholesale Price
                  </span>
                </div>
                <div className="w-px h-4 bg-slate-200"></div>
                <div className="flex items-center gap-1.5">
                  <Truck className="h-3.5 w-3.5 text-blue-500" />
                  <span className="text-xs text-blue-600 font-medium">
                    Pan-India
                  </span>
                </div>
              </div>
            </div>

            <button className="mt-6 w-full py-3 bg-linear-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-slate-950 text-white font-medium text-sm rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg group">
              <span>Join Partner App</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomepageHero;
