import Image from 'next/image';

const pressLogos = [
  { name: 'Glamour', src: '/assets/aistudio/glamour-logo.png' },
  { name: 'Allure', src: '/assets/aistudio/allure-logo.png' },
  { name: 'Esquire', src: '/assets/aistudio/esquire-logo.png' },
  { name: 'GQ', src: '/assets/aistudio/gq-logo.png' },
  { name: 'Wired', src: '/assets/aistudio/wired-logo.png' },
  { name: 'Mens Health', src: '/assets/aistudio/mens-health-logo.png' },
  { name: 'Forbes', src: '/assets/aistudio/forbes-logo.png' },
];

export default function PressSection() {
  return (
    <section className="w-full bg-white py-16 lg:py-20 border-t border-neutral-100">
      <div className="max-w-[1240px] mx-auto px-6">
        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
          {pressLogos.map((logo) => (
            <div key={logo.name} className="h-8 sm:h-10 relative">
              <Image
                src={logo.src}
                alt={logo.name}
                width={120}
                height={40}
                className="h-full w-auto object-contain"
                quality={100}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
