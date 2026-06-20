export interface ImageProps {
  id: number;
  src: string;
  name: string;
  width: number;
  height: number;
  blurDataUrl?: string;
}

export interface SharedModalProps {
  index: number;
  images?: ImageProps[];
  currentPhoto?: ImageProps;
  closeModal: () => void;
  direction?: number;
}
