import { useState } from "react";

interface ImageSectionProps {
  imageSrc: string;
  caption?: string;
  altText?: string;
  width?: "full" | "large" | "medium" | "small";
}

export function ImageSection({
  imageSrc,
  caption,
  altText = "Climate data visualization",
  width = "full",
}: ImageSectionProps) {
  const [error, setError] = useState(false);

  const widthClasses = {
    full: "w-full",
    large: "w-full md:w-4/5 mx-auto",
    medium: "w-full md:w-2/3 mx-auto",
    small: "w-full md:w-1/2 mx-auto",
  };

  const handleError = () => {
    setError(true);
  };

  if (error) {
    return (
      <div className={`${widthClasses[width]} mb-8 bg-black-2 rounded-level-2 p-4 text-center`}>
        <p className="text-grey-1">Image could not be loaded</p>
        {caption && <p className="text-xs text-grey mt-2 italic">{caption}</p>}
      </div>
    );
  }

  return (
    <figure className={`${widthClasses[width]} mb-8`}>
      <img
        src={imageSrc}
        alt={altText}
        className="w-full h-auto rounded-level-2 object-cover"
        onError={handleError}
      />
      {caption && (
        <figcaption className="text-center text-sm text-grey mt-2">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}