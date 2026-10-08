import React from "react";

/** Judul section dengan eyebrow, judul, dan deskripsi opsional. */
export default function SectionHeading({
  eyebrow,
  eyebrowClassName = "text-primary",
  title,
  description,
  align = "center",
  className = "",
}) {
  const alignment =
    align === "left"
      ? "max-w-xl text-left"
      : "max-w-2xl mx-auto text-center";

  return (
    <div className={`${alignment} ${className}`}>
      {eyebrow ? (
        <span
          className={`font-label-sm text-label-sm uppercase tracking-widest font-bold ${eyebrowClassName}`}
        >
          {eyebrow}
        </span>
      ) : null}
      <h2 className="font-headline-lg text-headline-lg text-on-surface mt-1 font-extrabold">
        {title}
      </h2>
      {description ? (
        <p className="font-body-md text-body-md text-on-surface-variant mt-2">
          {description}
        </p>
      ) : null}
    </div>
  );
}
