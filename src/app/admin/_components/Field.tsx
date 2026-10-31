"use client";

import { useState } from "react";

import type { FieldSchema } from "@/content/types";

type LocalizedValue = { en?: string; bn?: string };

const inputClass =
  "w-full rounded-xl border border-pine-900/15 bg-white px-3.5 py-2.5 text-sm text-ink shadow-sm outline-none transition placeholder:text-ink/30 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 disabled:bg-paper disabled:text-ink/40";

function Label({ field }: { field: FieldSchema }) {
  return (
    <span className="mb-1.5 flex items-baseline justify-between gap-2">
      <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-ink/55">
        {field.label}
      </span>
      <span className="rounded bg-pine-900/5 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-ink/35">
        {field.type === "localized" || field.type === "localizedList" ? "EN + BN" : field.type}
      </span>
    </span>
  );
}

function Help({ text }: { text?: string }) {
  if (!text) return null;
  return <p className="mt-1.5 text-[11px] leading-relaxed text-ink/45">{text}</p>;
}

function LocalizedInput({
  field,
  value,
  onChange,
  disabled,
}: {
  field: FieldSchema;
  value: LocalizedValue;
  onChange: (v: LocalizedValue) => void;
  disabled?: boolean;
}) {
  const [showBn, setShowBn] = useState(false);
  const hasBn = Boolean(value?.bn?.trim());
  const multiline = field.type === "localized" && (field.rows ?? 0) > 1;

  return (
    <div>
      <Label field={field} />
      {multiline ? (
        <textarea
          rows={field.rows ?? 3}
          value={value?.en ?? ""}
          disabled={disabled}
          onChange={(e) => onChange({ ...value, en: e.target.value })}
          className={inputClass}
          placeholder={field.placeholder}
        />
      ) : (
        <input
          value={value?.en ?? ""}
          disabled={disabled}
          onChange={(e) => onChange({ ...value, en: e.target.value })}
          className={inputClass}
          placeholder={field.placeholder}
        />
      )}

      <button
        type="button"
        onClick={() => setShowBn((v) => !v)}
        className="mt-1.5 text-[11px] font-semibold text-pine-700 hover:underline"
      >
        {showBn ? "Hide Bengali backup" : hasBn ? "Bengali backup ✓" : "Add Bengali backup"}
      </button>

      {showBn && (
        <div className="mt-2 rounded-xl border border-dashed border-pine-900/15 bg-paper/60 p-2.5">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-ink/35">
            Bengali (used by the বাংলা toggle only)
          </p>
          {multiline ? (
            <textarea
              rows={field.rows ?? 3}
              value={value?.bn ?? ""}
              disabled={disabled}
              onChange={(e) => onChange({ ...value, bn: e.target.value })}
              className={inputClass}
            />
          ) : (
            <input
              value={value?.bn ?? ""}
              disabled={disabled}
              onChange={(e) => onChange({ ...value, bn: e.target.value })}
              className={inputClass}
            />
          )}
        </div>
      )}
      <Help text={field.help} />
    </div>
  );
}

function JsonInput({
  field,
  value,
  onChange,
  disabled,
}: {
  field: FieldSchema;
  value: unknown;
  onChange: (v: unknown) => void;
  disabled?: boolean;
}) {
  const [text, setText] = useState(() => JSON.stringify(value ?? null, null, 2));
  const [error, setError] = useState<string | null>(null);

  return (
    <div>
      <Label field={field} />
      <textarea
        rows={field.rows ?? 10}
        value={text}
        disabled={disabled}
        spellCheck={false}
        onChange={(e) => {
          const next = e.target.value;
          setText(next);
          try {
            onChange(JSON.parse(next));
            setError(null);
          } catch {
            setError("Not valid JSON — the server will reject this until it parses.");
          }
        }}
        className={`${inputClass} font-mono text-xs`}
      />
      {error && <p className="mt-1.5 text-[11px] font-medium text-red-600">{error}</p>}
      <Help text={field.help} />
    </div>
  );
}

export default function Field({
  field,
  value,
  onChange,
  disabled,
}: {
  field: FieldSchema;
  value: unknown;
  onChange: (value: unknown) => void;
  disabled?: boolean;
}) {
  switch (field.type) {
    case "localized":
      return (
        <LocalizedInput
          field={field}
          value={(value as LocalizedValue) ?? {}}
          onChange={onChange}
          disabled={disabled}
        />
      );

    case "textarea":
      return (
        <label className="block">
          <Label field={field} />
          <textarea
            rows={field.rows ?? 4}
            value={(value as string) ?? ""}
            disabled={disabled}
            onChange={(e) => onChange(e.target.value)}
            className={inputClass}
            placeholder={field.placeholder}
          />
          <Help text={field.help} />
        </label>
      );

    case "number":
      return (
        <label className="block">
          <Label field={field} />
          <input
            type="number"
            value={typeof value === "number" ? value : ""}
            min={field.min}
            max={field.max}
            disabled={disabled}
            onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))}
            className={inputClass}
          />
          <Help text={field.help} />
        </label>
      );

    case "boolean":
      return (
        <div>
          <Label field={field} />
          <button
            type="button"
            role="switch"
            aria-checked={Boolean(value)}
            disabled={disabled}
            onClick={() => onChange(!value)}
            className={[
              "relative inline-flex h-7 w-12 items-center rounded-full transition",
              value ? "bg-pine-700" : "bg-pine-900/15",
              disabled ? "opacity-50" : "",
            ].join(" ")}
          >
            <span
              className={[
                "inline-block h-5 w-5 transform rounded-full bg-white shadow transition",
                value ? "translate-x-6" : "translate-x-1",
              ].join(" ")}
            />
          </button>
          <Help text={field.help} />
        </div>
      );

    case "select":
      return (
        <label className="block">
          <Label field={field} />
          <select
            value={(value as string) ?? ""}
            disabled={disabled}
            onChange={(e) => onChange(e.target.value)}
            className={inputClass}
          >
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <Help text={field.help} />
        </label>
      );

    case "localizedList": {
      const rows = Array.isArray(value) ? (value as LocalizedValue[]) : [];
      return (
        <div>
          <Label field={field} />
          <div className="space-y-2">
            {rows.map((row, i) => (
              <div
                key={i}
                className="rounded-xl border border-pine-900/10 bg-paper/50 p-2.5"
              >
                <div className="flex items-center justify-between pb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wide text-ink/35">
                    {field.itemLabel ?? "Item"} {i + 1}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={disabled || i === 0}
                      onClick={() => {
                        const next = [...rows];
                        [next[i - 1], next[i]] = [next[i], next[i - 1]];
                        onChange(next);
                      }}
                      className="rounded px-1.5 text-xs text-ink/40 hover:bg-white hover:text-ink disabled:opacity-30"
                      aria-label="Move up"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      disabled={disabled || i === rows.length - 1}
                      onClick={() => {
                        const next = [...rows];
                        [next[i + 1], next[i]] = [next[i], next[i + 1]];
                        onChange(next);
                      }}
                      className="rounded px-1.5 text-xs text-ink/40 hover:bg-white hover:text-ink disabled:opacity-30"
                      aria-label="Move down"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      disabled={disabled}
                      onClick={() => onChange(rows.filter((_, index) => index !== i))}
                      className="rounded px-1.5 text-xs font-bold text-red-500/70 hover:bg-white hover:text-red-600"
                      aria-label="Remove"
                    >
                      ✕
                    </button>
                  </div>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <input
                    value={row.en ?? ""}
                    disabled={disabled}
                    placeholder="English"
                    onChange={(e) => {
                      const next = [...rows];
                      next[i] = { ...row, en: e.target.value };
                      onChange(next);
                    }}
                    className={inputClass}
                  />
                  <input
                    value={row.bn ?? ""}
                    disabled={disabled}
                    placeholder="Bengali (optional)"
                    onChange={(e) => {
                      const next = [...rows];
                      next[i] = { ...row, bn: e.target.value };
                      onChange(next);
                    }}
                    className={inputClass}
                  />
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            disabled={disabled}
            onClick={() => onChange([...rows, { en: "", bn: "" }])}
            className="mt-2 rounded-xl border border-dashed border-pine-900/20 px-3 py-2 text-xs font-bold text-pine-700 hover:border-gold-500 hover:bg-gold-500/5"
          >
            + Add {field.itemLabel ?? "item"}
          </button>
          <Help text={field.help} />
        </div>
      );
    }

    case "list": {
      const rows = Array.isArray(value) ? (value as Record<string, unknown>[]) : [];
      return (
        <div>
          <Label field={field} />
          <div className="space-y-3">
            {rows.map((row, i) => (
              <div key={i} className="rounded-xl border border-pine-900/10 bg-paper/50 p-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wide text-ink/35">
                    {field.itemLabel ?? "Item"} {i + 1}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={disabled || i === 0}
                      onClick={() => {
                        const next = [...rows];
                        [next[i - 1], next[i]] = [next[i], next[i - 1]];
                        onChange(next);
                      }}
                      className="rounded px-1.5 text-xs text-ink/40 hover:bg-white hover:text-ink disabled:opacity-30"
                      aria-label="Move up"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      disabled={disabled || i === rows.length - 1}
                      onClick={() => {
                        const next = [...rows];
                        [next[i + 1], next[i]] = [next[i], next[i + 1]];
                        onChange(next);
                      }}
                      className="rounded px-1.5 text-xs text-ink/40 hover:bg-white hover:text-ink disabled:opacity-30"
                      aria-label="Move down"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      disabled={disabled}
                      onClick={() => onChange(rows.filter((_, index) => index !== i))}
                      className="rounded px-1.5 text-xs font-bold text-red-500/70 hover:bg-white hover:text-red-600"
                      aria-label="Remove"
                    >
                      ✕
                    </button>
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {Object.entries(field.fields ?? {}).map(([key, child]) => (
                    <div key={key} className={child.type === "textarea" ? "sm:col-span-2" : ""}>
                      <Field
                        field={child}
                        value={row[key]}
                        disabled={disabled}
                        onChange={(next) => {
                          const copy = [...rows];
                          copy[i] = { ...row, [key]: next };
                          onChange(copy);
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            disabled={disabled}
            onClick={() => onChange([...rows, {}])}
            className="mt-2 rounded-xl border border-dashed border-pine-900/20 px-3 py-2 text-xs font-bold text-pine-700 hover:border-gold-500 hover:bg-gold-500/5"
          >
            + Add {field.itemLabel ?? "item"}
          </button>
          <Help text={field.help} />
        </div>
      );
    }

    case "json":
      return (
        <JsonInput field={field} value={value} onChange={onChange} disabled={disabled} />
      );

    case "image":
    case "url":
    case "text":
    default:
      return (
        <label className="block">
          <Label field={field} />
          <input
            value={(value as string) ?? ""}
            disabled={disabled}
            onChange={(e) => onChange(e.target.value)}
            className={inputClass}
            placeholder={field.placeholder}
          />
          {field.type === "image" && typeof value === "string" && value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={value}
              alt=""
              className="mt-2 h-16 w-auto rounded-lg border border-pine-900/10 object-cover"
            />
          ) : null}
          <Help text={field.help} />
        </label>
      );
  }
}
