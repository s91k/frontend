import React from "react";

interface SupportMethodProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  details: string[] | Record<string, string> | { [key: string]: any };
  action?: {
    text: string;
    link: string;
  };
}

export function SupportMethod({
  icon,
  title,
  description,
  details,
  action,
}: SupportMethodProps) {
  const detailsArray = Array.isArray(details)
    ? details
    : Object.values(details);

  return (
    <div className="bg-black-2 rounded-level-1 p-6">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-black-1 rounded-full">{icon}</div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-white mb-2">{title}</h2>
          <p className="text-grey mb-4">{description}</p>
          <ul className="space-y-2 mb-4">
            {detailsArray.map((detail, index) => (
              <li key={index} className="flex items-center gap-2 text-grey">
                <span className="w-1.5 h-1.5 bg-blue-3 rounded-full" />
                {detail}
              </li>
            ))}
          </ul>
          {action && (
            <a
              href={action.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-black-1 hover:bg-blue-5 text-white px-6 py-2 rounded-lg transition-colors duration-200"
            >
              {action.text}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
