// src/components/FilterDrawer.tsx
import { useEffect, useState, useCallback } from "react";
import { X, Filter } from "lucide-react";
import { Button } from "./ui/Button.jsx";

interface FilterDrawerProps {
  tags?: string[];
  selectedTags?: string[];
  setSelectedTags: (tags: string[]) => void;
  onClose?: () => void;
}

export default function FilterDrawer({
  tags = [],
  selectedTags = [],
  setSelectedTags,
  onClose,
}: FilterDrawerProps): React.ReactElement {
  const [open, setOpen] = useState<boolean>(false);

  // Unified close handler
  const handleCloseDrawer = useCallback((): void => {
    setOpen(false);
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent): void => {
      if (e.key === "Escape") {
        handleCloseDrawer();
      }
    };
    if (open) {
      window.addEventListener("keydown", handleEsc);
    }
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [open, handleCloseDrawer]);

  const handleToggleTag = (tag: string): void => {
    const nextTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(nextTags);
  };



  return (
    <>
      <div className="flex justify-end mb-2">
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-sm bg-surface-raised text-white rounded-md hover:bg-surface-raised focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 focus:ring-offset-surface-base transition-colors"
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls="filter-drawer-panel"
        >
          <Filter size={16} />
          Filter Tags
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-40 flex items-center justify-center p-4 transition-opacity duration-300 ease-in-out">
          <div
            id="filter-drawer-panel"
            className="bg-surface-raised text-white p-6 rounded-lg shadow-2xl max-w-md w-full max-h-[80vh] flex flex-col relative"
            role="dialog"
            aria-modal="true"
            aria-labelledby="filter-drawer-title"
          >
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-surface-border">
              <h2 id="filter-drawer-title" className="text-xl font-semibold text-text-primary">
                Select Tags
              </h2>
              <button
                onClick={handleCloseDrawer}
                className="p-1 text-text-muted hover:text-white rounded-full hover:bg-surface-raised focus:outline-none focus:ring-2 focus:ring-brand-accent"
                aria-label="Close filter selection"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto mb-4 pr-1">
              {tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        onClick={() => handleToggleTag(tag)}
                        type="button"
                        className={`px-3 py-1.5 text-sm rounded-full border transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface-raised ${
                          isSelected
                            ? "bg-brand-accent border-brand-accent text-white hover:bg-interactive-hover"
                            : "bg-surface-raised border-surface-border text-text-primary hover:bg-surface-raised hover:border-brand-accent"
                        }`}
                        aria-pressed={isSelected}
                      >
                        {tag.replace(/^#/, "")}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-text-muted italic text-center py-4">No tags available to filter.</p>
              )}
            </div>

            <div className="mt-auto pt-4 border-t border-surface-border flex justify-end gap-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedTags([])}
              >
                Clear All
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleCloseDrawer}
              >
                Done
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
