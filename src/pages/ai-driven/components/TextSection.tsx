import { useState, useEffect } from "react";

interface TextSectionProps {
  title: string;
  introText?: string;
  content: string;
  imageSrc?: string;
  imagePosition?: "left" | "right";
  imageAlt?: string;
}

export function TextSection({
  title,
  introText,
  content,
  imageSrc,
  imagePosition = "right",
  imageAlt = "Climate data visualization",
}: TextSectionProps) {
  const [formattedContent, setFormattedContent] = useState<string>(content);

  useEffect(() => {
    // Convert markdown-style line breaks to HTML
    const withLineBreaks = content.replace(/\n\n/g, "<br/><br/>");
    setFormattedContent(withLineBreaks);
  }, [content]);

  return (
    <div className="mb-8">
      {introText && <p className="text-gray-400 mb-4">{introText}</p>}
      <div
        className={`flex flex-col ${
          imageSrc ? "md:flex-row" : ""
        } gap-6 items-start`}
      >
        {imageSrc && imagePosition === "left" && (
          <div className="w-full md:w-2/5">
            <img
              src={imageSrc}
              alt={imageAlt}
              className="w-full h-auto rounded-level-2 object-cover"
            />
          </div>
        )}
        <div
          className={`text-grey-1 leading-relaxed ${
            imageSrc ? "w-full md:w-3/5" : "w-full"
          }`}
          dangerouslySetInnerHTML={{ __html: formattedContent }}
        />
        {imageSrc && imagePosition === "right" && (
          <div className="w-full md:w-2/5">
            <img
              src={imageSrc}
              alt={imageAlt}
              className="w-full h-auto rounded-level-2 object-cover"
            />
          </div>
        )}
      </div>
    </div>
  );
}
