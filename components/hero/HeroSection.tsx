import { heroConfig } from '@/config/hero';
import HeroTileMain from './HeroTileMain';
import HeroTileSecondary from './HeroTileSecondary';

export default function HeroSection() {
  return (
    <section className="relative w-full bg-[#121212] overflow-hidden">
      <div className="w-full flex flex-col lg:flex-row">
        {/* Main Left Tile */}
        <HeroTileMain tile={heroConfig.mainTile} />

        {/* Right Stacked Tiles */}
        <div className="w-full lg:w-[38.4%] flex flex-col flex-shrink-0">
          <HeroTileSecondary
            tile={heroConfig.topRightTile}
            heightClass="h-[250px] xs:h-[280px] sm:h-[350px] lg:h-[359px]"
          />
          <HeroTileSecondary
            tile={heroConfig.bottomRightTile}
            heightClass="h-[250px] xs:h-[280px] sm:h-[350px] lg:h-[359px]"
          />
        </div>
      </div>
    </section>
  );
}
