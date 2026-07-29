import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";

interface BreadcrumbItem {
  title: string;
  link?: string;
}

interface PageHeaderProps {
  title: string;
  breadcrumbs: BreadcrumbItem[];
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, breadcrumbs }) => {
  return (
    <div className="mb-6">
      {/* Title */}
      <h1 className="text-lg sm:text-3xl font-bold text-gray-900 wrap-break-word">
        {title}
      </h1>

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mt-2 overflow-x-auto">
        <ol className="flex min-w-max items-center text-sm whitespace-nowrap">
          {breadcrumbs.map((breadcrumb, index) => (
            <React.Fragment key={index}>
              <li className="flex items-center">
                {breadcrumb.link ? (
                  <Link
                    href={breadcrumb.link}
                    className="text-gray-500 hover:text-blue-600 hover:underline transition-colors"
                  >
                    {breadcrumb.title}
                  </Link>
                ) : (
                  <span className="font-medium text-blue-600">
                    {breadcrumb.title}
                  </span>
                )}
              </li>

              {index < breadcrumbs.length - 1 && (
                <ChevronRight
                  size={16}
                  className="mx-2 shrink-0 text-gray-400"
                />
              )}
            </React.Fragment>
          ))}
        </ol>
      </nav>
    </div>
  );
};

export default PageHeader;
