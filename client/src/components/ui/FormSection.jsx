import React from "react";

const FormSection = ({
  index,
  title,
  description,
  children,
  className = "",
  bodyClassName = "",
}) => {
  return (
    <section
      className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:p-8 ${className}`}
    >
      {(title || index) && (
        <div className="flex items-center gap-3 mb-5">
          {index && (
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-purple-50 text-purple-700 text-xs font-bold flex-shrink-0">
              {index}
            </span>
          )}
          <div className="min-w-0">
            <h3 className="text-md font-semibold text-gray-900 leading-tight">
              {title}
            </h3>
            {description && (
              <p className="text-xs text-gray-500 mt-0.5">{description}</p>
            )}
          </div>
        </div>
      )}
      <div className={bodyClassName}>{children}</div>
    </section>
  );
};

export default FormSection;
