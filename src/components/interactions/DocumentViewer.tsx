"use client";
import { useState, useEffect } from "react";

interface Section {
  heading: string;
  content: string;
}

interface Props {
  title: string;
  sections: Section[];
  onComplete: () => void;
}

export default function DocumentViewer({ title, sections, onComplete }: Props) {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    if (visibleCount >= sections.length) return;
    const timer = setTimeout(() => {
      setVisibleCount((c) => c + 1);
    }, 600);
    return () => clearTimeout(timer);
  }, [visibleCount, sections.length]);

  const allVisible = visibleCount >= sections.length;

  return (
    <div className="screen">
      <div className="document-viewer">
        <div className="document-viewer-header">
          <div className="document-viewer-title">{title}</div>
        </div>
        <div className="document-viewer-body">
          {sections.map((section, i) =>
            i < visibleCount ? (
              <div
                key={i}
                className={`doc-section${
                  i === sections.length - 1 ? " doc-section-highlight" : ""
                }`}
                style={{ animation: "lineIn 0.4s ease both" }}
              >
                <div className="doc-section-heading">{section.heading}</div>
                <div className="doc-section-content">{section.content}</div>
              </div>
            ) : null
          )}
        </div>
      </div>

      {allVisible && (
        <div className="actions">
          <button type="button" className="btn" onClick={onComplete}>
            次へ
            <span className="btn-jp">NEXT</span>
          </button>
        </div>
      )}
    </div>
  );
}
