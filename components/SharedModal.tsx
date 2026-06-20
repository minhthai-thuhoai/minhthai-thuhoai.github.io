import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Zoom from "react-medium-image-zoom";
import { variants } from "../utils/animationVariants";
import type { SharedModalProps } from "../utils/types";
import Twitter from "./Icons/Twitter";
import Facebook from "./Icons/Facebook";

export default function SharedModal({
    index,
    images,
    closeModal,
    currentPhoto,
    direction,
}: SharedModalProps) {
    const currentImage = images ? images[index] : currentPhoto;

    if (!currentImage) {
        return null;
    }

    const currentImageWidth = Number(currentImage.width) > 0 ? Number(currentImage.width) : 1920;
    const currentImageHeight = Number(currentImage.height) > 0 ? Number(currentImage.height) : 1280;
    const shareUrl = `https://minhthai-thuhoai.pages.dev/p/${index}`;
    const tweetHref =
        "https://twitter.com/intent/tweet?text=" +
        encodeURIComponent("Check out this pic from Ho Chi Minh Minh Thái & Thu Hoài - Wedding Gallery!") +
        "%0A%0A" +
        encodeURIComponent(shareUrl);
    const facebookHref =
        "https://www.facebook.com/sharer/sharer.php?u=" +
        encodeURIComponent(shareUrl) +
        "&quote=" +
        encodeURIComponent("Check out this pic from Ho Chi Minh Minh Thái & Thu Hoài - Wedding Gallery!");

    return (
        <MotionConfig
            transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
            }}
        >
            <div className="relative z-50 flex min-h-dvh w-full max-w-7xl items-center justify-center px-2 sm:px-4">
                <div className="flex min-h-dvh w-full items-center justify-center overflow-hidden">
                    <div className="relative flex h-full w-full items-center justify-center">
                        <AnimatePresence initial={false} custom={direction}>
                            <motion.div
                                key={index}
                                custom={direction}
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                className="absolute flex h-full w-full items-center justify-center"
                            >
                                <Zoom>
                                    <Image
                                        key={currentImage.src}
                                        src={currentImage.src}
                                        width={currentImageWidth}
                                        height={currentImageHeight}
                                        priority
                                        alt="Ho Chi Minh AI Image"
                                        className="h-auto max-h-screen w-auto max-w-full object-contain"
                                    />
                                </Zoom>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                <div
                    className="pointer-events-none fixed inset-x-0 top-0 z-80 flex items-start justify-between p-2 text-white sm:p-3"
                    style={{ paddingTop: "max(env(safe-area-inset-top), 0.75rem)" }}
                >
                    <div className="flex items-center gap-2">
                        <a
                            href={tweetHref}
                            className="pointer-events-auto rounded-full border border-white/60 bg-black/70 p-1.5 text-white/90 backdrop-blur-lg transition hover:bg-black/85 hover:text-white cursor-pointer sm:p-2"
                            target="_blank"
                            title="Share on Twitter"
                            rel="noreferrer"
                            aria-label="Share on Twitter"
                        >
                            <Twitter className="h-4 w-4 sm:h-5 sm:w-5" />
                        </a>
                        <a
                            href={facebookHref}
                            className="pointer-events-auto rounded-full border border-white/60 bg-black/70 p-1.5 text-white/90 backdrop-blur-lg transition hover:bg-black/85 hover:text-white cursor-pointer sm:p-2"
                            target="_blank"
                            title="Share on Facebook"
                            rel="noreferrer"
                            aria-label="Share on Facebook"
                        >
                            <Facebook className="h-4 w-4 sm:h-5 sm:w-5" />
                        </a>
                    </div>
                    <div className="text-white">
                        <button
                            onClick={closeModal}
                            className="pointer-events-auto rounded-full border border-white/60 bg-black/70 p-1.5 text-white/90 backdrop-blur-lg transition hover:bg-black/85 hover:text-white cursor-pointer sm:p-2"
                            title="Close"
                            aria-label="Close image"
                        >
                            <XMarkIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </MotionConfig>
    );
}
