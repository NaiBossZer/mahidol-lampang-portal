import { useState } from "react";
import { ShoppingCart, Star, Plus, Check } from "lucide-react";

const products = [
  {
    id: 1,
    name: "ครั่งแท่งอินทรีย์ Shellac Grade A",
    desc: "ครั่งธรรมชาติจากต้นจามจุรี 100% อินทรีย์ ปราศจากสารเคมี",
    price: 280,
    unit: "ต่อ 100 กรัม",
    standard: "มาตรฐานอินทรีย์ ACT",
    rating: 4.8,
    reviews: 124,
    available: true,
    image: "https://images.unsplash.com/photo-1647879826700-cfc5fd9d9a31?w=400&h=300&fit=crop&auto=format",
    category: "ครั่ง",
  },
  {
    id: 2,
    name: "ข้าวกล้องหอมมะลิ ลำปาง",
    desc: "ข้าวกล้องอินทรีย์จาก Smart Farm มหิดล ลำปาง เพาะปลูกด้วยระบบ IoT",
    price: 95,
    unit: "ต่อ 1 กิโลกรัม",
    standard: "มาตรฐาน Organic Thailand",
    rating: 4.9,
    reviews: 89,
    available: true,
    image: "https://images.unsplash.com/photo-1560559383-338dc7faf062?w=400&h=300&fit=crop&auto=format",
    category: "เกษตร",
  },
  {
    id: 3,
    name: "น้ำผึ้งป่าชันโรง",
    desc: "น้ำผึ้งแท้จากชันโรงท้องถิ่น เก็บเกี่ยวโดยชุมชนเกษตรกรลำปาง",
    price: 350,
    unit: "ต่อ 250 มล.",
    standard: "GI ลำปาง",
    rating: 4.7,
    reviews: 56,
    available: true,
    image: "https://images.unsplash.com/photo-1647879826700-cfc5fd9d9a31?w=400&h=300&fit=crop&auto=format",
    category: "เกษตร",
  },
  {
    id: 4,
    name: "ชาเขียวออร์แกนิก มหิดล",
    desc: "ชาเขียวจากสวนอินทรีย์ในเขตพื้นที่ดูแลของมหาวิทยาลัย",
    price: 180,
    unit: "ต่อ 50 กรัม",
    standard: "มาตรฐานอินทรีย์ ACT",
    rating: 4.6,
    reviews: 43,
    available: false,
    image: "https://images.unsplash.com/photo-1560559383-338dc7faf062?w=400&h=300&fit=crop&auto=format",
    category: "เกษตร",
  },
];

export default function StorefrontPage() {
  const [cart, setCart] = useState<number[]>([]);
  const [addedId, setAddedId] = useState<number | null>(null);

  const addToCart = (id: number) => {
    setCart((prev) => [...prev, id]);
    setAddedId(id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <div>
      {/* Header */}
      <div className="bg-white border-b border-[#EEE9DF]">
        <div className="max-w-[1280px] mx-auto px-8 max-md:px-4 py-10">
          <div className="flex items-start justify-between max-sm:flex-col max-sm:gap-4">
            <div>
              <div className="text-[#C66B4F] text-xs font-semibold uppercase tracking-widest mb-2">ร้านค้าชุมชน</div>
              <h1 className="text-[#123B63] font-bold text-4xl max-md:text-2xl mb-2">ผลิตภัณฑ์ชุมชนมหิดล ลำปาง</h1>
              <p className="text-[#667085] text-base">ผลิตภัณฑ์อินทรีย์ได้มาตรฐาน จากเกษตรกรและชุมชนในเครือข่าย</p>
            </div>
            <div className="relative">
              <button className="flex items-center gap-2 px-5 py-3 rounded-xl border border-[#EEE9DF] bg-white text-[#1F2933] font-medium text-sm hover:border-[#123B63]/30 transition-colors min-h-[44px]">
                <ShoppingCart size={18} />
                ตะกร้า
                {cart.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#C66B4F] text-white text-xs flex items-center justify-center font-bold">
                    {cart.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-8 max-md:px-4 py-10">
        {/* Trust badges */}
        <div className="flex flex-wrap gap-4 mb-10">
          {[
            { color: "#5F8D62", label: "ผลิตภัณฑ์อินทรีย์ 100%" },
            { color: "#1677A8", label: "ผ่านการรับรองมาตรฐาน" },
            { color: "#D6A84F", label: "ส่งตรงจากเกษตรกร" },
          ].map((b) => (
            <div
              key={b.label}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border"
              style={{ borderColor: b.color + "40", color: b.color, backgroundColor: b.color + "10" }}
            >
              <Check size={14} />
              {b.label}
            </div>
          ))}
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-4 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-6">
          {products.map((p) => (
            <div
              key={p.id}
              className={`bg-white rounded-2xl border overflow-hidden transition-all duration-200 ${
                p.available ? "border-[#EEE9DF] hover:shadow-md hover:border-[#D6A84F]/30" : "border-[#EEE9DF] opacity-75"
              }`}
            >
              <div className="aspect-[4/3] overflow-hidden bg-[#EEE9DF] relative">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-cover"
                />
                {!p.available && (
                  <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                    <span className="bg-[#667085] text-white text-xs font-semibold px-3 py-1 rounded-full">สินค้าหมด</span>
                  </div>
                )}
                <div className="absolute top-3 left-3">
                  <span className="bg-[#5F8D62] text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                    {p.category}
                  </span>
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-[#1F2933] font-semibold text-sm leading-snug mb-1.5">{p.name}</h3>
                <p className="text-[#667085] text-xs leading-relaxed mb-3 line-clamp-2">{p.desc}</p>

                <div className="flex items-center gap-1.5 mb-3">
                  <Star size={12} className="text-[#D6A84F] fill-[#D6A84F]" />
                  <span className="text-[#1F2933] text-xs font-semibold">{p.rating}</span>
                  <span className="text-[#9BA8B7] text-xs">({p.reviews})</span>
                </div>

                <div className="text-[11px] text-[#5F8D62] font-medium mb-4 bg-[#5F8D62]/10 px-2.5 py-1 rounded-full inline-block">
                  {p.standard}
                </div>

                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-[#123B63] font-bold text-xl">฿{p.price.toLocaleString()}</div>
                    <div className="text-[#9BA8B7] text-xs">{p.unit}</div>
                  </div>
                  <button
                    onClick={() => p.available && addToCart(p.id)}
                    disabled={!p.available}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all min-h-[40px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1677A8] ${
                      !p.available
                        ? "bg-[#EEE9DF] text-[#9BA8B7] cursor-not-allowed"
                        : addedId === p.id
                        ? "bg-[#5F8D62] text-white"
                        : "bg-[#123B63] text-white hover:bg-[#0e2d4f]"
                    }`}
                  >
                    {addedId === p.id ? (
                      <><Check size={14} /> เพิ่มแล้ว</>
                    ) : (
                      <><Plus size={14} /> เพิ่ม</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Notice */}
        <div className="mt-10 bg-[#F8F6F0] rounded-2xl border border-[#EEE9DF] p-6 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#1677A8]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <ShoppingCart size={18} className="text-[#1677A8]" />
          </div>
          <div>
            <h3 className="text-[#1F2933] font-semibold text-sm mb-1">การชำระเงินและจัดส่ง</h3>
            <p className="text-[#667085] text-sm leading-relaxed">
              ขณะนี้ระบบชำระเงินออนไลน์อยู่ในระหว่างการพัฒนา หากสนใจสั่งซื้อสินค้า กรุณาติดต่อ
              ร้านค้าชุมชนมหิดล ลำปาง โดยตรง หรือมารับสินค้าด้วยตนเองที่ศูนย์ฯ
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
