import Link from 'next/link';
import { 
  Sparkles, 
  UserPlus, 
  Heart, 
  Calendar, 
  HeartHandshake, 
  Mail, 
  PenTool, 
  CreditCard, 
  GitBranch, 
  BookOpen, 
  MessageSquare, 
  FileEdit, 
  Book, 
  PawPrint, 
  Check, 
  Plus, 
  ChevronRight 
} from 'lucide-react';

export default function MarketingHome() {
  return (
    <main className="bg-[#FFFFFF] text-[#1D1D1F] antialiased selection:bg-[#0071e3] selection:text-[#FFFFFF] min-h-screen">
      
      {/* HERO SECTION */}
      <section className="max-w-[1040px] mx-auto px-6 py-20 md:py-32 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#0071e3]/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-6">
          <h1 className="text-[48px] md:text-[80px] font-bold tracking-tight text-[#1D1D1F] leading-[1.05] font-sans">
            Timeless digital legacies.
          </h1>
          <p className="text-[21px] md:text-[24px] text-[#86868B] max-w-2xl font-medium leading-snug">
            Create beautiful, enduring spaces to celebrate lives lived, love shared, and stories that deserve to be remembered forever.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <Link 
              href="/login" 
              className="inline-flex items-center justify-center bg-[#0071e3] text-[#FFFFFF] font-medium text-[17px] px-8 py-3 rounded-full hover:bg-[#0071e3]/90 transition-all active:scale-[0.98]"
            >
              Start a Memorial
            </Link>
            <Link 
              href="/kittiemeaw" 
              className="inline-flex items-center justify-center bg-transparent text-[#0071e3] font-medium text-[17px] px-8 py-3 rounded-full hover:underline transition-all flex items-center gap-1"
            >
              Explore Examples <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* MEMORIAL SECTION */}
      <section id="memorial" className="py-8 md:py-12">
        <div className="max-w-[1040px] mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-12 bg-[#F5F5F7] rounded-[28px] overflow-hidden p-12 md:p-16">
            <div className="w-full md:w-1/2 order-2 md:order-1 relative rounded-3xl overflow-hidden aspect-[4/5] bg-[#F5F5F7]">
              <img 
                className="w-full h-full object-cover" 
                alt="Premium lifestyle photography for a memorial service website" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDpnY3Uwxk0XiEohL9UGRkc8Hc9BwOPmZ242HyhpqVqu3t52QxxmSxKuQc8FNiFclznZvPBCIV4Hxrlyt13LDNgaMd9PrfyDYKXN8LLHZpkvcVIb5xtAfXZCfPKYVidBSTtaVkZ9X-sq-6ZXQWxXEn6ScaiRB58xRknLM1zQZTYyIac-UA48-I99R2hxNNm5WWWWQZ9ekLTZwFJy9RVNdoDIyPyrVFcab0mp4SKC1NgdBnxJGs4X3k"
              />
            </div>
            <div className="w-full md:w-1/2 order-1 md:order-2 space-y-6">
              <h2 className="text-[40px] md:text-[56px] tracking-tight text-[#1D1D1F] font-semibold leading-tight">Individual Memorials</h2>
              <p className="text-[19px] text-[#86868B] font-medium">
                A dignified, beautifully designed space to honor a loved one. Collect stories, photos, and tributes in an ad-free, respectful environment that lasts generations.
              </p>
              <ul className="space-y-4 pt-4">
                <li className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-[#1D1D1F] shrink-0" />
                  <span className="text-[17px] text-[#1D1D1F] font-medium">Elegant timelines &amp; biographies</span>
                </li>
                <li className="flex items-center gap-3">
                  <UserPlus className="w-5 h-5 text-[#1D1D1F] shrink-0" />
                  <span className="text-[17px] text-[#1D1D1F] font-medium">Collaborative photo albums</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* COUPLE / WEDDING SECTION */}
      <section id="couple" className="py-8 md:py-12">
        <div className="max-w-[1040px] mx-auto px-6 space-y-8">
          <div className="relative w-full rounded-[32px] overflow-hidden bg-[#F5F5F7] flex flex-col md:flex-row items-stretch min-h-[560px]">
            <div className="w-full md:w-1/2 p-12 md:p-20 flex flex-col justify-center z-10 bg-[#FFFFFF] md:bg-transparent md:bg-gradient-to-r md:from-[#FFFFFF] md:via-[#FFFFFF]/90 md:to-transparent">
              <h2 className="text-[40px] md:text-[56px] tracking-tight text-[#1D1D1F] font-semibold mb-4 leading-tight">
                คู่รัก (Couple)
              </h2>
              <p className="text-[21px] text-[#86868B] font-medium mb-8 max-w-md">
                บันทึกการเดินทางของความรักไว้ในที่เดียว
              </p>
              <div>
                <Link 
                  href="/login" 
                  className="inline-flex items-center justify-center bg-[#0071e3] text-[#FFFFFF] font-medium text-[17px] px-8 py-3 rounded-full hover:bg-[#0071e3]/90 transition-colors"
                >
                  สร้างเว็บคู่รัก
                </Link>
              </div>
            </div>
            <div className="relative md:absolute md:inset-0 md:left-1/2 w-full md:w-1/2 h-[300px] md:h-full">
              <img 
                alt="A beautiful, high-end editorial photo of a couple" 
                className="w-full h-full object-cover object-center absolute inset-0" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4sFtiQx4Dpew3HfPkRhGl6Zst2ZmqJ9H6gUoYOCM92DkS31dUFPofTEXqFMhRURonfspY9nve80gTgXL49Fma9YCCnAxXqQnqwcWuzEuPi1SegvQ_-Pk-x6Gfivy_0H6TS6H4JSMPVttqFaMYP_DV9RhcUZlFsWAh-xo_ReMD_9iJdpTT5qB_U3J_NeVzI3lSufok1NLoKsTcD76c-GQKanaa20zLsrjKcSj-JAYdnH4EOhdXurE"
              />
            </div>
          </div>

          <div className="space-y-6 pt-4">
            <h3 className="font-semibold text-[24px] text-[#1D1D1F] text-center md:text-left">สิ่งที่คุณจะได้</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="bg-[#F5F5F7] rounded-[28px] overflow-hidden p-8 transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] relative flex flex-col h-full group cursor-pointer">
                <div className="mb-6">
                  <Heart className="w-8 h-8 text-[#1D1D1F]" />
                </div>
                <h3 className="font-semibold text-[21px] mb-2 text-[#1D1D1F] tracking-tight">ไดอารี่ความทรงจำ</h3>
                <p className="font-medium text-[17px] text-[#86868B] mb-8 flex-grow">เขียนเล่าเรื่องราวและความรู้สึกระหว่างเรา</p>
                <div className="mt-auto self-end h-8 w-8 rounded-full bg-[#1D1D1F]/5 flex items-center justify-center text-[#1D1D1F] group-hover:bg-[#1D1D1F] group-hover:text-[#FFFFFF] transition-colors">
                  <Plus className="w-4 h-4" />
                </div>
              </div>

              <div className="bg-[#F5F5F7] rounded-[28px] overflow-hidden p-8 transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] relative flex flex-col h-full group cursor-pointer">
                <div className="mb-6">
                  <Calendar className="w-8 h-8 text-[#1D1D1F]" />
                </div>
                <h3 className="font-semibold text-[21px] mb-2 text-[#1D1D1F] tracking-tight">บันทึกวันสำคัญ</h3>
                <p className="font-medium text-[17px] text-[#86868B] mb-8 flex-grow">ครบรอบและเส้นทางความรักของสองเรา</p>
                <div className="mt-auto self-end h-8 w-8 rounded-full bg-[#1D1D1F]/5 flex items-center justify-center text-[#1D1D1F] group-hover:bg-[#1D1D1F] group-hover:text-[#FFFFFF] transition-colors">
                  <Plus className="w-4 h-4" />
                </div>
              </div>

              <div className="bg-[#F5F5F7] rounded-[28px] overflow-hidden p-8 transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] relative flex flex-col h-full group cursor-pointer">
                <div className="mb-6">
                  <HeartHandshake className="w-8 h-8 text-[#1D1D1F]" />
                </div>
                <h3 className="font-semibold text-[21px] mb-2 text-[#1D1D1F] tracking-tight">ฟีดส่งความรัก</h3>
                <p className="font-medium text-[17px] text-[#86868B] mb-8 flex-grow">คอมเมนต์ ส่งหัวใจ และแชร์โมเมนต์หวาน</p>
                <div className="mt-auto self-end h-8 w-8 rounded-full bg-[#1D1D1F]/5 flex items-center justify-center text-[#1D1D1F] group-hover:bg-[#1D1D1F] group-hover:text-[#FFFFFF] transition-colors">
                  <Plus className="w-4 h-4" />
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* WEDDING SECTION */}
      <section id="wedding" className="py-8 md:py-12 bg-[#F5F5F7]">
        <div className="max-w-[1040px] mx-auto px-6 space-y-8">
          <div className="relative w-full rounded-[32px] overflow-hidden flex flex-col md:flex-row items-stretch min-h-[560px] bg-[#FFFFFF]">
            <div className="relative md:absolute md:inset-0 md:right-1/2 w-full md:w-1/2 h-[300px] md:h-full">
              <img 
                className="w-full h-full object-cover object-center absolute inset-0" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHdjxvQPuNhszIMX-3M2Oil12emtUPsor3Yfl9xM3qiC2OcRc2lWGMo_HJGP9_b-_hfr_tyEds6diKcLX-4zG4xvnIx9Yh0tIgi_XNqAWmZQajGYnDutcVXkatf99poKkRFK-W2yce8zacJ2bQnZhTVjwzlidUqudw8OX8kgkoEfMkxGFA2HNuBVWDMxQYwMgzGLnnryzIb0jNDh5fZPk8Bd3eHtnKIyzqwJ7WFEFoGppfS0acl3g"
                alt="Wedding editorial photograph"
              />
            </div>
            <div className="w-full md:w-1/2 md:ml-auto p-12 md:p-20 flex flex-col justify-center z-10 bg-[#FFFFFF] md:bg-transparent md:bg-gradient-to-l md:from-[#FFFFFF] md:via-[#FFFFFF]/90 md:to-transparent">
              <h2 className="text-[40px] md:text-[56px] tracking-tight font-semibold mb-4 leading-tight text-[#1D1D1F]">
                งานแต่งงาน (Wedding)
              </h2>
              <p className="text-[21px] text-[#86868B] font-medium mb-8 max-w-md">
                การ์ดเชิญและความทรงจำวันสำคัญ ครบในเว็บเดียว
              </p>
              <div>
                <Link 
                  href="/login" 
                  className="inline-flex items-center justify-center bg-[#0071e3] text-[#FFFFFF] font-medium text-[17px] px-8 py-3 rounded-full hover:bg-[#0071e3]/90 transition-colors"
                >
                  สร้างเว็บงานแต่ง
                </Link>
              </div>
            </div>
          </div>

          <div className="space-y-6 pt-4">
            <h3 className="font-semibold text-[24px] text-[#1D1D1F] text-center md:text-left">สิ่งที่คุณจะได้</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="bg-[#FFFFFF] rounded-[28px] overflow-hidden p-8 transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] relative flex flex-col h-full group cursor-pointer">
                <div className="mb-6">
                  <Mail className="w-8 h-8 text-[#1D1D1F]" />
                </div>
                <h3 className="font-semibold text-[21px] mb-2 text-[#1D1D1F] tracking-tight">การ์ดเชิญ &amp; กำหนดการ</h3>
                <p className="font-medium text-[17px] text-[#86868B] mb-8 flex-grow">การ์ดเชิญออนไลน์และแจ้งกำหนดการพิธี</p>
                <div className="mt-auto self-end h-8 w-8 rounded-full bg-[#1D1D1F]/5 flex items-center justify-center text-[#1D1D1F] group-hover:bg-[#1D1D1F] group-hover:text-[#FFFFFF] transition-colors">
                  <Plus className="w-4 h-4" />
                </div>
              </div>

              <div className="bg-[#FFFFFF] rounded-[28px] overflow-hidden p-8 transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] relative flex flex-col h-full group cursor-pointer">
                <div className="mb-6">
                  <PenTool className="w-8 h-8 text-[#1D1D1F]" />
                </div>
                <h3 className="font-semibold text-[21px] mb-2 text-[#1D1D1F] tracking-tight">สมุดลงนามอวยพร</h3>
                <p className="font-medium text-[17px] text-[#86868B] mb-8 flex-grow">รวมคำอวยพรและความยินดีถึงบ่าวสาว</p>
                <div className="mt-auto self-end h-8 w-8 rounded-full bg-[#1D1D1F]/5 flex items-center justify-center text-[#1D1D1F] group-hover:bg-[#1D1D1F] group-hover:text-[#FFFFFF] transition-colors">
                  <Plus className="w-4 h-4" />
                </div>
              </div>

              <div className="bg-[#FFFFFF] rounded-[28px] overflow-hidden p-8 transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] relative flex flex-col h-full group cursor-pointer">
                <div className="mb-6">
                  <CreditCard className="w-8 h-8 text-[#1D1D1F]" />
                </div>
                <h3 className="font-semibold text-[21px] mb-2 text-[#1D1D1F] tracking-tight">ร่วมใส่ซองออนไลน์</h3>
                <p className="font-medium text-[17px] text-[#86868B] mb-8 flex-grow">ส่งเงินและของขวัญวันแต่งผ่าน PromptPay</p>
                <div className="mt-auto self-end h-8 w-8 rounded-full bg-[#1D1D1F]/5 flex items-center justify-center text-[#1D1D1F] group-hover:bg-[#1D1D1F] group-hover:text-[#FFFFFF] transition-colors">
                  <Plus className="w-4 h-4" />
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* FAMILY LEGACY SECTION */}
      <section id="family-legacy" className="py-8 md:py-12">
        <div className="max-w-[1040px] mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-12 bg-[#F5F5F7] rounded-[28px] overflow-hidden p-12 md:p-16">
            <div className="w-full md:w-1/2 order-2 md:order-1 relative rounded-3xl overflow-hidden aspect-[16/9] bg-[#F5F5F7]">
              <img 
                className="w-full h-full object-cover" 
                alt="A multi-generational family" 
                src="https://lh3.googleusercontent.com/aida/AP1WRLs5KxS0ef4ywjKOR9h_L-_j3jEUTXn06zLG0A1OoZqYtPDEHRFy4xMXpU2MajHk4EhE6OV5V3xGNUVWtYWZXsvXztjhw36C4yVI5JYm1TEjm3r03dLNoGLMrRScyPKhbKBdhf8V680js1iJ-TSSmlcyYCaFrM07zRQVPkFVP7Rz_gnzyGIWluXomluhNlSx4jGuY5IHEKeGJ9qDkq2yuVKUFYKWfklqPFRrGzJFhFNIl7fZDO838Y6Z2Q"
              />
            </div>
            <div className="w-full md:w-1/2 order-1 md:order-2 space-y-6">
              <h2 className="text-[40px] md:text-[56px] tracking-tight text-[#1D1D1F] font-semibold leading-tight">Family Legacy</h2>
              <p className="text-[19px] text-[#86868B] font-medium">
                Map your ancestry, preserve family recipes, and pass down wisdom. A private, secure vault for your family's enduring narrative.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="bg-[#FFFFFF] p-6 rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-[#bfc9c3]/20 flex flex-col gap-2">
                  <GitBranch className="w-6 h-6 text-[#1D1D1F]" />
                  <h3 className="font-semibold text-[17px] text-[#1D1D1F]">Interactive Family Trees</h3>
                </div>
                <div className="bg-[#FFFFFF] p-6 rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-[#bfc9c3]/20 flex flex-col gap-2">
                  <BookOpen className="w-6 h-6 text-[#1D1D1F]" />
                  <h3 className="font-semibold text-[17px] text-[#1D1D1F]">Heirloom Recipes</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FRIENDS SECTION */}
      <section id="friends" className="py-8 md:py-12">
        <div className="max-w-[1040px] mx-auto px-6 space-y-8">
          <div className="relative w-full rounded-[32px] overflow-hidden bg-[#F5F5F7] flex flex-col md:flex-row items-stretch min-h-[560px]">
            <div className="w-full md:w-1/2 p-12 md:p-20 flex flex-col justify-center z-10 bg-[#FFFFFF] md:bg-transparent md:bg-gradient-to-r md:from-[#FFFFFF] md:via-[#FFFFFF]/90 md:to-transparent">
              <h2 className="text-[40px] md:text-[56px] tracking-tight text-[#1D1D1F] font-semibold mb-4 leading-tight">
                กลุ่มเพื่อน (Friends)
              </h2>
              <p className="text-[21px] text-[#86868B] font-medium mb-8 max-w-md">
                รวมมิตรภาพและเรื่องราวของพวกเราไว้ตลอดกาล
              </p>
              <div>
                <Link 
                  href="/login" 
                  className="inline-flex items-center justify-center bg-[#0071e3] text-[#FFFFFF] font-medium text-[17px] px-8 py-3 rounded-full hover:bg-[#0071e3]/90 transition-colors"
                >
                  สร้างเว็บกลุ่มเพื่อน
                </Link>
              </div>
            </div>
            <div className="relative md:absolute md:inset-0 md:left-1/2 w-full md:w-1/2 h-[300px] md:h-full">
              <img 
                alt="Friends laughing" 
                className="w-full h-full object-cover object-center absolute inset-0" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwyOR5_KWg2H8t5M27y7ySRwuTQLc_opZIs4G6hJ69Lp1TOYjD1c-SBJCvO3k_Li3Sh2vmqr5aEF5c1tjz-dLLDUpKTuCqBOCvKqm5us1jjVLDtC6o7tYUAl7uubQxSrFtl_Rb3Y0zOVXuzbn8xHURQFIvOJj-Q3zY039j6OO2l2uxbghYq85gz_1tMYbi0C2B9VvyqfmHCvS3s8TbghrmN56HBqbVYBxoyAWzwBWt5i2zZUVP_gI"
              />
            </div>
          </div>

          <div className="space-y-6 pt-4">
            <h3 className="font-semibold text-[24px] text-[#1D1D1F] text-center md:text-left">สิ่งที่คุณจะได้</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="bg-[#F5F5F7] rounded-[28px] overflow-hidden p-8 transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] relative flex flex-col h-full group cursor-pointer">
                <div className="mb-6 overflow-hidden rounded-2xl aspect-[4/3] bg-[#FFFFFF]/50">
                  <img 
                    alt="Friends sharing a moment" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjRhbLYVspt9pxc5FXOkbM6RADZ3KSLyI925hR-6fKdfhISiDUJv4KFMn-v6G97N4CV9fvF85SPSjosd_E54Tia9z3qcTpbXGcdvswCJwELN53eb6PZgAJkM6ujWT_jOA6Kk2F1rWLLj4r6ua6ZBL8cmuMq-nJAvAZcsIaXps051w1Y1csMRGmPQOO3z3a-HtoyzlvsbvqxHEzIUy-b7QpgXPoa-nf8arZZnoy3FZaqpCbzC4QSn4"
                  />
                </div>
                <div className="mb-4">
                  <MessageSquare className="w-8 h-8 text-[#1D1D1F]" />
                </div>
                <h3 className="font-semibold text-[21px] mb-2 text-[#1D1D1F] tracking-tight">บอร์ดแชร์วีรกรรม</h3>
                <p className="font-medium text-[17px] text-[#86868B] mb-8 flex-grow">โพสต์เรื่องเล่าและความหลังของแก๊ง</p>
                <div className="mt-auto self-end h-8 w-8 rounded-full bg-[#1D1D1F]/5 flex items-center justify-center text-[#1D1D1F] group-hover:bg-[#1D1D1F] group-hover:text-[#FFFFFF] transition-colors">
                  <Plus className="w-4 h-4" />
                </div>
              </div>

              <div className="bg-[#F5F5F7] rounded-[28px] overflow-hidden p-8 transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] relative flex flex-col h-full group cursor-pointer">
                <div className="mb-6 overflow-hidden rounded-2xl aspect-[4/3] bg-[#FFFFFF]/50">
                  <img 
                    alt="Friends laughing together" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQ-xrzDbXcPLy4OIs3GGcUSfmKalHZ8uBdMA6HFimV3q4aUDuNO2vLApV7IqR7Ybb53C2hAsgDnHd4PXY2Bz7IE-CB-Vbj9iDMenCguNwWl3boMyKxCJQot-9k_LECU_ZeCdfIdFOYw_ddekaaBLJ8ApDV6zW6zre8D9rts2JG1__4NVPHEoYUJjgQCpCrBVSd-poajMYiu_Sb-PQLjORkBbC4lKdzW43UdIytvESNZbSgK-QRkcM"
                  />
                </div>
                <div className="mb-4">
                  <Sparkles className="w-8 h-8 text-[#1D1D1F]" />
                </div>
                <h3 className="font-semibold text-[21px] mb-2 text-[#1D1D1F] tracking-tight">คลังภาพแก๊งเพื่อน</h3>
                <p className="font-medium text-[17px] text-[#86868B] mb-8 flex-grow">อัลบั้มรูปทริปและโมเมนต์สุดฮา</p>
                <div className="mt-auto self-end h-8 w-8 rounded-full bg-[#1D1D1F]/5 flex items-center justify-center text-[#1D1D1F] group-hover:bg-[#1D1D1F] group-hover:text-[#FFFFFF] transition-colors">
                  <Plus className="w-4 h-4" />
                </div>
              </div>

              <div className="bg-[#F5F5F7] rounded-[28px] overflow-hidden p-8 transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] relative flex flex-col h-full group cursor-pointer">
                <div className="mb-6">
                  <BookOpen className="w-8 h-8 text-[#1D1D1F]" />
                </div>
                <h3 className="font-semibold text-[21px] mb-2 text-[#1D1D1F] tracking-tight">หนังสือรุ่นออนไลน์</h3>
                <p className="font-medium text-[17px] text-[#86868B] mb-8 flex-grow">E-Yearbook บันทึกความทรงจำร่วมกัน ค้นหาและพูดคุยกับเพื่อนเก่าได้ทุกเมื่อ</p>
                <div className="mt-auto self-end h-8 w-8 rounded-full bg-[#1D1D1F]/5 flex items-center justify-center text-[#1D1D1F] group-hover:bg-[#1D1D1F] group-hover:text-[#FFFFFF] transition-colors">
                  <Plus className="w-4 h-4" />
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* PET SECTION */}
      <section id="pet-memorial" className="py-8 md:py-12">
        <div className="max-w-[1040px] mx-auto px-6 space-y-8">
          <div className="relative w-full rounded-[32px] overflow-hidden flex flex-col md:flex-row items-stretch min-h-[560px] bg-[#F5F5F7]">
            <div className="relative md:absolute md:inset-0 md:right-1/2 w-full md:w-1/2 h-[300px] md:h-full">
              <img 
                className="w-full h-full object-cover object-center absolute inset-0" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAz2pGinLl6I0W9a40FYq3VtO-LvGKt-wrsWP_rd5npjmAAv8lM6I3FkjcSmiUiTppfWjtKLgXA6xfRK5Ghic1_WAXr-NDt-Fbvtvm_Lm2E62Lq16BHKP_TyM52OBktxG0kgtPDSqH1dwPQGDxPlvDGvK4PNFrFw-WJ9XhKwcNKwX9VMlJvDhqJLJ0XYYI7JratIH2v5foXRPHMOzVX8b4bGHXXQLDuNeRB2N70DyEfMaN24kptZCs"
                alt="Pet editorial photograph"
              />
            </div>
            <div className="w-full md:w-1/2 md:ml-auto p-12 md:p-20 flex flex-col justify-center z-10 bg-[#F5F5F7] md:bg-transparent md:bg-gradient-to-l md:from-[#F5F5F7] md:via-[#F5F5F7]/90 md:to-transparent">
              <h2 className="text-[40px] md:text-[56px] tracking-tight font-semibold mb-4 leading-tight text-[#1D1D1F]">
                สัตว์เลี้ยง (Pet Memorial)
              </h2>
              <p className="text-[21px] text-[#86868B] font-medium mb-8 max-w-md">
                อนุสรณ์แห่งรักถึงเจ้าตัวน้อยในครอบครัว
              </p>
              <div>
                <Link 
                  href="/login" 
                  className="inline-flex items-center justify-center bg-[#0071e3] text-[#FFFFFF] font-medium text-[17px] px-8 py-3 rounded-full hover:bg-[#0071e3]/90 transition-colors"
                >
                  สร้างเว็บสัตว์เลี้ยง
                </Link>
              </div>
            </div>
          </div>

          <div className="space-y-6 pt-4">
            <h3 className="font-semibold text-[24px] text-[#1D1D1F] text-center md:text-left">สิ่งที่คุณจะได้</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="bg-[#F5F5F7] rounded-[28px] overflow-hidden p-8 transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] relative flex flex-col h-full group cursor-pointer">
                <div className="mb-6 overflow-hidden rounded-2xl aspect-[16/9] bg-[#FFFFFF]/50 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
                  <img 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCIxLkfzmvAuAolaGpul_xvo2K4S3tly6NV59mSVrHvPXPaRAR04z-avcFb_IyFIIGKhAnM2I-wQxbILN_yrieU1afVJ0OZNfpPfqzjUpZr-km0rQ9sXwNlj0JZoKAt3qT3QHn2Ztup47QqGWxxRwTkaze_5I7QKD9entCRu7QxOufzfNyhrWwek_onJz--O8Lg_sTCVp2KOdG8I2ciTxhdAhLSw6GxWiWRK3ifEVnTw4REedWXfepycOl7QIXm9Fzv" 
                    alt="Pet guestbook preview" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="mb-4">
                  <FileEdit className="w-8 h-8 text-[#1D1D1F]" />
                </div>
                <h3 className="font-semibold text-[21px] mb-2 text-[#1D1D1F] tracking-tight">สมุดส่งความคิดถึง</h3>
                <p className="font-medium text-[17px] text-[#86868B] mb-8 flex-grow">ฝากคำรักและข้อความคิดถึงถึงเจ้าตัวน้อย</p>
                <div className="mt-auto self-end h-8 w-8 rounded-full bg-[#1D1D1F]/5 flex items-center justify-center text-[#1D1D1F] group-hover:bg-[#1D1D1F] group-hover:text-[#FFFFFF] transition-colors">
                  <Plus className="w-4 h-4" />
                </div>
              </div>

              <div className="bg-[#F5F5F7] rounded-[28px] overflow-hidden p-8 transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] relative flex flex-col h-full group cursor-pointer">
                <div className="mb-6 overflow-hidden rounded-2xl aspect-[4/3] bg-[#FFFFFF]/50 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
                  <img 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD820QBgMfc-5pN5og1xXtoq_UQTU7WavbhOKky7GCd62tebOjx1BHsAbPSsOvFemIZUXbYUYyWYqzglJfK2pjylxjDVcbWAmdSIraZQQMnjIPbwVF0dMIckVkoAJJNnx3-FBee5hDiQpj1hHTfDP92wQcFHwoRo0b4tchupTZAFKUuHnc_AporchqfZLmL7hlaxn6IC38la4WyL91s5inkfnAJ8QAHytDGxt7enHkuS2mEpSwTqQUVvRnB5pkKjOBj" 
                    alt="Cute pet memorial illustration" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="mb-4">
                  <Book className="w-8 h-8 text-[#1D1D1F]" />
                </div>
                <h3 className="font-semibold text-[21px] mb-2 text-[#1D1D1F] tracking-tight">ไดอารี่ความสุข</h3>
                <p className="font-medium text-[17px] text-[#86868B] mb-8 flex-grow">โพสต์รูปและเล่าเรื่องราวความสุขระหว่างเรา</p>
                <div className="mt-auto self-end h-8 w-8 rounded-full bg-[#1D1D1F]/5 flex items-center justify-center text-[#1D1D1F] group-hover:bg-[#1D1D1F] group-hover:text-[#FFFFFF] transition-colors">
                  <Plus className="w-4 h-4" />
                </div>
              </div>

              <div className="bg-[#F5F5F7] rounded-[28px] overflow-hidden p-8 transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] relative flex flex-col h-full group cursor-pointer">
                <div className="mb-6 overflow-hidden rounded-2xl aspect-[4/3] bg-[#FFFFFF]/50 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
                  <img 
                    src="/images/pet-polaroids.jpg" 
                    alt="Pet gallery preview" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="mb-4">
                  <PawPrint className="w-8 h-8 text-[#1D1D1F]" />
                </div>
                <h3 className="font-semibold text-[21px] mb-2 text-[#1D1D1F] tracking-tight">คลังภาพเจ้าตัวน้อย</h3>
                <p className="font-medium text-[17px] text-[#86868B] mb-8 flex-grow">อัลบั้มภาพและโมเมนต์น่ารักทั้งหมด</p>
                <div className="mt-auto self-end h-8 w-8 rounded-full bg-[#1D1D1F]/5 flex items-center justify-center text-[#1D1D1F] group-hover:bg-[#1D1D1F] group-hover:text-[#FFFFFF] transition-colors">
                  <Plus className="w-4 h-4" />
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section className="py-12 md:py-20">
        <div className="max-w-[1040px] mx-auto px-6 text-center">
          <div className="space-y-6">
            <p className="text-[14px] text-[#86868B] font-medium uppercase tracking-widest">แผนสมาชิก</p>
            <h2 className="text-[48px] md:text-[80px] tracking-tight text-[#1D1D1F] font-bold">฿2,000 / ปี</h2>
            <div className="flex flex-col items-center gap-3 pt-4">
              <div className="flex items-center gap-2 text-[#1D1D1F] font-medium text-[17px]">
                <Check className="w-4 h-4 text-[#0071e3]" />
                <span>พื้นที่ 1 GB</span>
              </div>
              <div className="flex items-center gap-2 text-[#1D1D1F] font-medium text-[17px]">
                <Check className="w-4 h-4 text-[#0071e3]" />
                <span>ครบทุกฟีเจอร์</span>
              </div>
              <div className="flex items-center gap-2 text-[#1D1D1F] font-medium text-[17px]">
                <Check className="w-4 h-4 text-[#0071e3]" />
                <span>QR ถาวรสำหรับพิมพ์</span>
              </div>
            </div>
            <div className="pt-8">
              <Link 
                href="/login" 
                className="inline-flex items-center justify-center bg-[#0071e3] text-[#FFFFFF] font-medium text-[17px] px-8 py-3 rounded-full hover:bg-[#0071e3]/90 transition-colors"
              >
                เริ่มสร้างเลย
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-12 md:py-20 bg-[#F5F5F7]">
        <div className="max-w-[1040px] mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-[40px] md:text-[56px] tracking-tight text-[#1D1D1F] font-semibold leading-tight">พร้อมเริ่มเก็บความทรงจำแล้วหรือยัง</h2>
            <Link 
              href="/login" 
              className="inline-flex items-center justify-center bg-[#0071e3] text-[#FFFFFF] font-medium text-[17px] px-8 py-3 rounded-full hover:bg-[#0071e3]/90 transition-colors"
            >
              สร้างเว็บไซต์ของคุณ
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#FFFFFF] border-t border-[#bfc9c3]/20 py-12 text-xs">
        <div className="max-w-[1040px] mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 border-b border-[#bfc9c3]/20 pb-12">
            <div className="space-y-3">
              <h4 className="font-semibold text-[#1D1D1F]">ผลิตภัณฑ์</h4>
              <ul className="space-y-2">
                <li><a className="text-[#86868B] hover:text-[#1D1D1F] transition-colors" href="#features">ฟีเจอร์</a></li>
                <li><Link className="text-[#86868B] hover:text-[#1D1D1F] transition-colors" href="/kittiemeaw">ตัวอย่าง</Link></li>
                <li><Link className="text-[#86868B] hover:text-[#1D1D1F] transition-colors" href="/pricing">ราคา</Link></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-[#1D1D1F]">ประเภท</h4>
              <ul className="space-y-2">
                <li><Link className="text-[#86868B] hover:text-[#1D1D1F] transition-colors" href="/login">อนุสรณ์บุคคล</Link></li>
                <li><Link className="text-[#86868B] hover:text-[#1D1D1F] transition-colors" href="/login">งานแต่งงาน</Link></li>
                <li><Link className="text-[#86868B] hover:text-[#1D1D1F] transition-colors" href="/login">สัตว์เลี้ยง</Link></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-[#1D1D1F]">บริษัท</h4>
              <ul className="space-y-2">
                <li><a className="text-[#86868B] hover:text-[#1D1D1F] transition-colors" href="#">เกี่ยวกับเรา</a></li>
                <li><a className="text-[#86868B] hover:text-[#1D1D1F] transition-colors" href="#">ติดต่อ</a></li>
                <li><a className="text-[#86868B] hover:text-[#1D1D1F] transition-colors" href="#">ร่วมงานกับเรา</a></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-[#1D1D1F]">ช่วยเหลือ</h4>
              <ul className="space-y-2">
                <li><a className="text-[#86868B] hover:text-[#1D1D1F] transition-colors" href="#">ศูนย์ช่วยเหลือ</a></li>
                <li><a className="text-[#86868B] hover:text-[#1D1D1F] transition-colors" href="#">คำถามที่พบบ่อย</a></li>
                <li><a className="text-[#86868B] hover:text-[#1D1D1F] transition-colors" href="#">ความปลอดภัย</a></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[#86868B]">
            <p>© 2024 FOREVER. All rights reserved.</p>
            <div className="flex gap-4">
              <a className="hover:text-[#1D1D1F] transition-colors" href="#">Privacy Policy</a>
              <span className="hidden md:inline">|</span>
              <a className="hover:text-[#1D1D1F] transition-colors" href="#">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

    </main>
  );
}
