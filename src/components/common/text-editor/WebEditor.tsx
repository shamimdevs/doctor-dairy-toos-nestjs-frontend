"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading2,
  Heading3,
  Pilcrow,
  List,
  ListOrdered,
  Quote,
  Link2,
  Unlink,
  Undo2,
  Redo2,
} from "lucide-react";

interface WebEditorProps {
  content: string;
  setContent: (html: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  minHeight?: number;
}

type ToolbarCommand =
  | "bold"
  | "italic"
  | "underline"
  | "strikeThrough"
  | "insertUnorderedList"
  | "insertOrderedList"
  | "undo"
  | "redo"
  | "unlink";

interface ToolbarButtonConfig {
  command: ToolbarCommand;
  icon: React.ElementType;
  label: string;
}

const INLINE_BUTTONS: ToolbarButtonConfig[] = [
  { command: "bold", icon: Bold, label: "Bold" },
  { command: "italic", icon: Italic, label: "Italic" },
  { command: "underline", icon: Underline, label: "Underline" },
  { command: "strikeThrough", icon: Strikethrough, label: "Strikethrough" },
];

const LIST_BUTTONS: ToolbarButtonConfig[] = [
  { command: "insertUnorderedList", icon: List, label: "Bullet list" },
  { command: "insertOrderedList", icon: ListOrdered, label: "Numbered list" },
];

const HISTORY_BUTTONS: ToolbarButtonConfig[] = [
  { command: "undo", icon: Undo2, label: "Undo" },
  { command: "redo", icon: Redo2, label: "Redo" },
];

const WebEditor: React.FC<WebEditorProps> = ({
  content,
  setContent,
  placeholder = "Write something...",
  label,
  className = "",
  minHeight = 180,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [activeCommands, setActiveCommands] = useState<Set<string>>(new Set());
  const [activeBlock, setActiveBlock] = useState("p");
  const [isEmpty, setIsEmpty] = useState(!content);

  // Keep the contentEditable DOM in sync with external `content` changes
  // (e.g. when the parent resets the form) without fighting the caret
  // while the user is actively typing inside it.
  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    if (document.activeElement !== el && (content || "") !== el.innerHTML) {
      el.innerHTML = content || "";
      setIsEmpty(!content);
    }
  }, [content]);

  const refreshToolbarState = useCallback(() => {
    if (typeof document === "undefined") return;

    const next = new Set<string>();
    [
      "bold",
      "italic",
      "underline",
      "strikeThrough",
      "insertUnorderedList",
      "insertOrderedList",
    ].forEach((cmd) => {
      try {
        if (document.queryCommandState(cmd)) next.add(cmd);
      } catch {
        // queryCommandState can throw for unsupported commands — ignore
      }
    });
    setActiveCommands(next);

    try {
      const block = document.queryCommandValue("formatBlock");
      setActiveBlock(block ? block.toLowerCase() : "p");
    } catch {
      setActiveBlock("p");
    }
  }, []);

  const handleInput = useCallback(() => {
    const el = editorRef.current;
    if (!el) return;
    setContent(el.innerHTML);
    setIsEmpty(el.textContent?.trim().length === 0 && !el.querySelector("img"));
    refreshToolbarState();
  }, [setContent, refreshToolbarState]);

  const runCommand = useCallback(
    (command: string, value?: string) => {
      editorRef.current?.focus();
      document.execCommand(command, false, value);
      handleInput();
    },
    [handleInput],
  );

  const toggleBlock = useCallback(
    (tag: "h2" | "h3" | "blockquote" | "p") => {
      editorRef.current?.focus();
      const isActive = activeBlock === tag;
      document.execCommand("formatBlock", false, isActive ? "p" : tag);
      handleInput();
    },
    [activeBlock, handleInput],
  );

  const handleLink = useCallback(() => {
    const url = window.prompt("Enter URL");
    if (url) runCommand("createLink", url);
  }, [runCommand]);

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label className="font-semibold text-sm text-gray-700">{label}</label>
      )}

      <div className="w-full rounded-md border border-gray-300 bg-white overflow-hidden focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 bg-gray-50 px-2 py-1.5">
          {INLINE_BUTTONS.map(({ command, icon: Icon, label: btnLabel }) => (
            <ToolbarButton
              key={command}
              icon={Icon}
              label={btnLabel}
              active={activeCommands.has(command)}
              onClick={() => runCommand(command)}
            />
          ))}

          <Divider />

          <ToolbarButton
            icon={Heading2}
            label="Heading 2"
            active={activeBlock === "h2"}
            onClick={() => toggleBlock("h2")}
          />
          <ToolbarButton
            icon={Heading3}
            label="Heading 3"
            active={activeBlock === "h3"}
            onClick={() => toggleBlock("h3")}
          />
          <ToolbarButton
            icon={Pilcrow}
            label="Paragraph"
            active={activeBlock === "p"}
            onClick={() => toggleBlock("p")}
          />

          <Divider />

          {LIST_BUTTONS.map(({ command, icon: Icon, label: btnLabel }) => (
            <ToolbarButton
              key={command}
              icon={Icon}
              label={btnLabel}
              active={activeCommands.has(command)}
              onClick={() => runCommand(command)}
            />
          ))}
          <ToolbarButton
            icon={Quote}
            label="Quote"
            active={activeBlock === "blockquote"}
            onClick={() => toggleBlock("blockquote")}
          />

          <Divider />

          <ToolbarButton
            icon={Link2}
            label="Insert link"
            onClick={handleLink}
          />
          <ToolbarButton
            icon={Unlink}
            label="Remove link"
            onClick={() => runCommand("unlink")}
          />

          <Divider />

          {HISTORY_BUTTONS.map(({ command, icon: Icon, label: btnLabel }) => (
            <ToolbarButton
              key={command}
              icon={Icon}
              label={btnLabel}
              onClick={() => runCommand(command)}
            />
          ))}
        </div>

        {/* Editable area */}
        <div className="relative">
          {isEmpty && (
            <span className="pointer-events-none absolute left-3 top-3 text-sm text-gray-400">
              {placeholder}
            </span>
          )}
          <div
            ref={editorRef}
            role="textbox"
            aria-multiline="true"
            aria-label={label || placeholder}
            contentEditable
            suppressContentEditableWarning
            onInput={handleInput}
            onBlur={handleInput}
            onKeyUp={refreshToolbarState}
            onMouseUp={refreshToolbarState}
            onFocus={refreshToolbarState}
            style={{ minHeight }}
            className="w-full max-h-105 overflow-y-auto px-3 py-3 text-sm text-gray-800 outline-none [&_a]:text-emerald-600 [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-emerald-200 [&_blockquote]:pl-3 [&_blockquote]:text-gray-500 [&_h2]:text-lg [&_h2]:font-bold [&_h3]:text-base [&_h3]:font-bold [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5"
          />
        </div>
      </div>
    </div>
  );
};

interface ToolbarButtonProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick: () => void;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  icon: Icon,
  label,
  active = false,
  onClick,
}) => (
  <button
    type="button"
    title={label}
    aria-label={label}
    aria-pressed={active}
    // Mouse down (not click) so the editor selection isn't lost before the command runs
    onMouseDown={(e) => {
      e.preventDefault();
      onClick();
    }}
    className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors cursor-pointer ${
      active
        ? "bg-emerald-100 text-emerald-700"
        : "text-gray-600 hover:bg-gray-200"
    }`}
  >
    <Icon size={16} />
  </button>
);

const Divider = () => <div className="mx-1 h-5 w-px bg-gray-300" />;

export default WebEditor;
