import Image from "next/image";
import Zoom from "react-medium-image-zoom";

type ImageCompareSliderProps = {
  imageSrc: string;
  imageAlt: string;
  imageLabel?: string;
};

const ImageCompareSlider = ({
  imageSrc,
  imageAlt,
  imageLabel,
}: ImageCompareSliderProps) => {
  return (
    <section className="flex w-full justify-center">
      <div className="relative w-fit max-w-full overflow-hidden rounded-2xl border border-white/20 bg-black/30 shadow-highlight">
        {imageLabel ? (
          <div className="pointer-events-none absolute left-3 top-3 z-10 rounded-md bg-black/55 px-2 py-1 text-xs font-semibold text-white">
            {imageLabel}
          </div>
        ) : null}
        <Zoom>
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={1400}
            height={900}
            className="block h-auto max-h-screen w-auto max-w-full object-contain"
            priority
          />
        </Zoom>
      </div>
    </section>
  );
};

export default ImageCompareSlider;
