export default function PressSection() {
  return (
    <section className="w-full bg-white py-12 lg:py-16 border-t border-neutral-100">
      <div className="max-w-[1240px] mx-auto px-6">
        <p className="text-center text-xs font-semibold tracking-widest text-neutral-400 uppercase mb-8">
          Được các tạp chí hàng đầu vinh danh & đánh giá
        </p>
        <div className="flex flex-wrap justify-center items-center gap-x-12 sm:gap-x-16 gap-y-6 opacity-65 hover:opacity-100 transition-opacity duration-300">
          <span className="text-2xl sm:text-3xl font-black tracking-tighter uppercase font-sans">GQ</span>
          <span className="text-xl sm:text-2xl font-black tracking-[0.25em] uppercase font-sans">WIRED</span>
          <span className="text-xl sm:text-2xl font-sans italic font-extrabold">Forbes</span>
          <span className="text-lg sm:text-xl font-sans tracking-widest uppercase font-extrabold">Esquire</span>
          <span className="text-lg sm:text-xl tracking-[0.2em] uppercase font-extrabold font-sans">GLAMOUR</span>
          <span className="text-xl sm:text-2xl font-sans font-black tracking-tight">allure</span>
          <span className="text-sm sm:text-base font-extrabold tracking-widest uppercase font-sans">Men&apos;s Health</span>
        </div>
      </div>
    </section>
  );
}
