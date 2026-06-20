import Head from "next/head";
import Link from "next/link";
import type { GetStaticProps, NextPage } from "next";
import { access } from "node:fs/promises";
import path from "node:path";
import { useMemo, useState } from "react";
import ImageCompareSlider from "../components/ImageCompareSlider";
import { readPhotosManifest } from "../utils/photosManifest";

type ComparePair = {
  fileName: string;
  beforeImageSrc: string;
  afterImageSrc: string;
};

type ComparePageProps = {
  comparePairs: ComparePair[];
};

const ComparePage: NextPage<ComparePageProps> = ({ comparePairs }) => {
  const [selectedFileName, setSelectedFileName] = useState(
    comparePairs[0]?.fileName ?? "",
  );

  const selectedPair = useMemo(
    () =>
      comparePairs.find((pair) => pair.fileName === selectedFileName) ??
      comparePairs[0] ??
      null,
    [comparePairs, selectedFileName],
  );

  return (
    <>
      <Head>
        <title>Single Image Viewer | Ho Chi Minh AI Gallery</title>
      </Head>

      <main className="mx-auto min-h-screen w-full p-4 sm:p-6">
        <div className="rounded-2xl border border-white/15 bg-white/10 p-5 text-white shadow-highlight sm:p-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            
            <Link
              href="/"
              className="rounded-lg border border-white/50 px-3 py-2 text-sm font-semibold transition hover:bg-white hover:text-black"
            >
              Back to Gallery
            </Link>
          </div>
          {selectedPair ? (
            <>
              <div className="mb-4">
                <label htmlFor="compare-select" className="mb-2 block text-sm text-white/75">
                  Select image file
                </label>
                <select
                  id="compare-select"
                  value={selectedPair.fileName}
                  onChange={(event) => setSelectedFileName(event.target.value)}
                  className="w-full rounded-lg border border-white/35 bg-black/40 px-3 py-2 text-sm text-white outline-none transition focus:border-white"
                >
                  {comparePairs.map((pair) => (
                    <option key={pair.fileName} value={pair.fileName}>
                      {pair.fileName}
                    </option>
                  ))}
                </select>
              </div>

              <ImageCompareSlider
                imageSrc={selectedPair.afterImageSrc}
                imageAlt={`Colorized Ho Chi Minh portrait (${selectedPair.fileName})`}
                imageLabel="Colorized"
              />
            </>
          ) : (
            <div className="rounded-lg border border-white/15 bg-white/5 p-4 text-white/75">
              No matching image pairs found in /public/photo/old and /public/images.
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default ComparePage;

export const getStaticProps: GetStaticProps<ComparePageProps> = async () => {
  const colorizedImages = await readPhotosManifest();
  const oldDir = path.join(process.cwd(), "public", "photo", "old");

  const comparePairs = (
    await Promise.all(
      colorizedImages.map(async (image) => {
        const oldFilePath = path.join(oldDir, image.name);
        try {
          await access(oldFilePath);
          return {
            fileName: image.name,
            beforeImageSrc: `/photo/old/${image.name}`,
            afterImageSrc: image.src,
          };
        } catch {
          return null;
        }
      }),
    )
  ).filter((pair): pair is ComparePair => pair !== null);

  return {
    props: {
      comparePairs,
    },
  };
};
