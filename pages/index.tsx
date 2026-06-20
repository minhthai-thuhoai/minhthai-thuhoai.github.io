import type { NextPage } from "next";
import type { GetStaticProps } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import Logo from "../components/Icons/Logo";
import Modal from "../components/Modal";
import { readPhotosManifest } from "../utils/photosManifest";
import type { ImageProps } from "../utils/types";
import { useLastViewedPhoto } from "../utils/useLastViewedPhoto";

const INITIAL_VISIBLE_IMAGES = 40;
const IMAGE_BATCH_SIZE = 40;

const Home: NextPage<{ images: ImageProps[] }> = ({ images }) => {
  const router = useRouter();
  const { photoId } = router.query;
  const [lastViewedPhoto, setLastViewedPhoto] = useLastViewedPhoto();
  const [visibleCount, setVisibleCount] = useState(() =>
    Math.min(INITIAL_VISIBLE_IMAGES, images.length),
  );

  const lastViewedPhotoRef = useRef<HTMLAnchorElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // This effect keeps track of the last viewed photo in the modal to keep the index page in sync when the user navigates back
    if (lastViewedPhoto && !photoId) {
      const lastViewedPhotoIndex = images.findIndex(
        (image) => image.id === Number(lastViewedPhoto),
      );

      if (lastViewedPhotoIndex === -1) {
        setLastViewedPhoto(null);
        return;
      }

      if (lastViewedPhotoIndex >= visibleCount) {
        setVisibleCount((previous) => Math.max(previous, lastViewedPhotoIndex + 1));
        return;
      }

      if (!lastViewedPhotoRef.current) {
        return;
      }

      lastViewedPhotoRef.current.scrollIntoView({ block: "center" });
      setLastViewedPhoto(null);
    }
  }, [photoId, lastViewedPhoto, visibleCount, images, setLastViewedPhoto]);

  useEffect(() => {
    if (visibleCount >= images.length) {
      return;
    }

    const target = loadMoreRef.current;
    if (!target) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting) {
          setVisibleCount((previous) => Math.min(previous + IMAGE_BATCH_SIZE, images.length));
        }
      },
      {
        rootMargin: "600px 0px",
      },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [visibleCount, images.length]);

  const visibleImages = images.slice(0, visibleCount);

  return (
    <>
      <Head>
        <title>Album ảnh và video kỷ niệm ngày cưới Minh Thái & Thu Hoài - 14.06.2026</title>
        <meta
          property="og:image"
          content="https://minhthai-thuhoai.github.io/og-image.jpg"
        />
        <meta
          name="twitter:image"
          content="https://minhthai-thuhoai.github.io/og-image.jpg"
        />
      </Head>
      <main className="mx-auto max-w-490 p-4">
        {photoId && images.length > 0 && (
          <Modal
            images={images}
            onClose={() => {
              setLastViewedPhoto(photoId);
            }}
          />
        )}
        <div className="after:content relative w-full mb-5 flex flex-col items-center justify-end gap-4 overflow-hidden rounded-lg bg-white/10 px-6 pb-8 pt-40 text-center text-white shadow-highlight after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight lg:pt-6">
          <div className="flex w-full max-w-[40ch] items-center justify-center">
            <Logo />
          </div>
          <h1 className="mt-8 text-2xl font-bold tracking-widest">
            Minh Thái & Thu Hoài - Wedding Gallery
          </h1>
          <a href="https://photos.app.goo.gl/t7eBx32Xr2cBNMay7" className="font-semibold color-red-500 underline">
            Wedding Gallery Photo Albumn
          </a>
          <p className="max-w-[60ch] text-white/75 sm:max-w-[40ch]">
            Đám cưới Minh Thái & Thu Hoài - 14.06.2026. Nơi lưu giữ câu chuyện tình yêu, khoảnh khắc ngày cưới, album ảnh, video cưới và những lời chúc phúc ý nghĩa.
          </p>
        </div>
        <div className="after:content relative w-full mb-5 flex flex-col items-center justify-end gap-4 overflow-hidden rounded-lg bg-white/10 px-6 pb-8 pt-40 text-center text-white shadow-highlight after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight lg:pt-6">
          <div className="relative w-full overflow-hidden rounded-lg pt-[56.25%]">
            <iframe
              src="https://www.youtube.com/embed/uZaxA0sIUPk?si=NTOTxBLiRCURi-gK&amp;controls=0"
              title="YouTube video player"
              className="absolute inset-0 h-full w-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </div>
        {images.length === 0 && (
          <div className="my-16 text-center text-white/70">No images found in /public/images.</div>
        )}

        <div className="columns-1 gap-4 sm:columns-2 xl:columns-3 2xl:columns-4">
          {visibleImages.map(({ id, src }) => (
            <Link
              key={id}
              href={`/?photoId=${id}`}
              as={`/p/${id}`}
              ref={id === Number(lastViewedPhoto) ? lastViewedPhotoRef : null}
              shallow
              className="after:content group relative mb-5 block w-full cursor-zoom-in after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight"
            >
              <Image
                alt="Ho Chi Minh AI Image photo"
                className="transform rounded-lg brightness-90 transition will-change-auto group-hover:brightness-110"
                style={{ transform: "translate3d(0, 0, 0)" }}
                src={src}
                width={720}
                height={480}
                loading="lazy"
                sizes="(max-width: 640px) 100vw,
                  (max-width: 1280px) 50vw,
                  (max-width: 1536px) 33vw,
                  25vw"
              />
            </Link>
          ))}
        </div>
        {visibleCount < images.length && (
          <div
            ref={loadMoreRef}
            className="my-8 rounded-lg border border-white/15 bg-white/5 p-4 text-center text-sm text-white/65"
          >
            Loading more photos...
          </div>
        )}
      </main>
      <footer className="p-6 text-center text-white/80 sm:p-12">
        Source code{" "}
        <a
          href="https://github.com/minhthai-thuhoai/minhthai-thuhoai.github.io"
          target="_blank"
          className="underline"
          rel="noreferrer"
        >
          github.com/minhthai-thuhoai/minhthai-thuhoai.github.io
        </a>
      </footer>
    </>
  );
};

export default Home;

export const getStaticProps: GetStaticProps = async () => {
  const images = await readPhotosManifest();

  return {
    props: {
      images,
    },
  };
};
