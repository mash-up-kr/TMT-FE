"use client";

import { useMemo, useState } from "react";
import { BottomNav, type BottomNavProps } from "@/shared/ui/BottomNav";
import { Button, type ButtonProps } from "@/shared/ui/Button";
import { ButtonStack } from "@/shared/ui/ButtonStack";
import { CheckIcon, ChevronDownIcon } from "@/shared/ui/icons";

const buttonVariants = ["primary", "secondary", "tertiary"] as const;
const buttonSizes = ["lg", "md", "sm"] as const;

type ButtonVariant = NonNullable<ButtonProps["variant"]>;
type ButtonSize = NonNullable<ButtonProps["size"]>;
type ButtonState = "default" | "disabled" | "loading";
type StackDirection = "vertical" | "horizontal";
type BottomNavValue = NonNullable<BottomNavProps["selected"]>;

function Field({ label, children }: Readonly<{ label: string; children: React.ReactNode }>) {
  return (
    <div className="flex flex-col gap-ds-4">
      <span className="text-body-sm-medium text-content-secondary">{label}</span>
      {children}
    </div>
  );
}

const controlClassName =
  "min-h-ds-40 rounded-ds-sm border-sm border-stroke-primary bg-surface-primary px-ds-12 text-body-md-medium text-content-primary";

export default function ButtonsPlaygroundPage() {
  const [variant, setVariant] = useState<ButtonVariant>("primary");
  const [size, setSize] = useState<ButtonSize>("lg");
  const [state, setState] = useState<ButtonState>("default");
  const [stackDirection, setStackDirection] = useState<StackDirection>("horizontal");
  const [showLeftIcon, setShowLeftIcon] = useState(false);
  const [showRightIcon, setShowRightIcon] = useState(false);
  const [selectedNav, setSelectedNav] = useState<BottomNavValue>("home");
  const [createCount, setCreateCount] = useState(0);
  const [copied, setCopied] = useState(false);

  const prompt = useMemo(() => {
    const details: string[] = [];

    if (variant !== "primary") details.push(`${variant} variant`);
    if (size !== "lg") details.push(`${size} size`);
    if (state !== "default") details.push(`${state} state`);
    if (showLeftIcon) details.push("a leading check icon");
    if (showRightIcon) details.push("a trailing chevron icon");

    const direction = details.length > 0 ? ` with ${details.join(", ")}` : " with its defaults";
    return `Use the shared Button${direction}. Keep the native button props and semantic design tokens intact.`;
  }, [showLeftIcon, showRightIcon, size, state, variant]);

  const stateProps = {
    disabled: state === "disabled",
    loading: state === "loading",
  };

  const copyPrompt = async () => {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  };

  return (
    <main className="flex flex-1 flex-col gap-ds-32 overflow-y-auto bg-surface-secondary py-ds-24">
      <header className="content-container flex flex-col gap-ds-4">
        <span className="text-body-sm-bold text-content-interactive-primary">PLAYGROUND</span>
        <h1 className="text-heading-md text-content-primary">Button series</h1>
        <p className="text-body-md-regular text-content-secondary">
          Figma 2032:1522 · 2384:1584 기준으로 크기, 상태, 조합을 실제 컴포넌트로 확인합니다.
        </p>
      </header>

      <section
        className="content-container flex flex-col gap-ds-12"
        aria-labelledby="controls-title"
      >
        <h2 id="controls-title" className="text-body-lg-bold text-content-primary">
          Controls
        </h2>
        <div className="grid grid-cols-2 gap-ds-12 rounded-ds-lg bg-surface-primary p-ds-16 shadow-raised">
          <fieldset className="col-span-2 flex flex-wrap gap-ds-8">
            <legend className="sr-only">Presets</legend>
            <Button
              size="sm"
              variant="tertiary"
              onClick={() => {
                setVariant("primary");
                setSize("lg");
                setState("default");
                setShowLeftIcon(false);
                setShowRightIcon(false);
              }}
            >
              Primary
            </Button>
            <Button
              size="sm"
              variant="tertiary"
              onClick={() => {
                setVariant("secondary");
                setSize("sm");
                setState("default");
                setShowLeftIcon(true);
                setShowRightIcon(false);
              }}
            >
              Compact
            </Button>
            <Button
              size="sm"
              variant="tertiary"
              onClick={() => {
                setVariant("primary");
                setSize("lg");
                setState("loading");
                setShowLeftIcon(false);
                setShowRightIcon(false);
              }}
            >
              Loading
            </Button>
          </fieldset>
          <Field label="Variant">
            <select
              aria-label="Button variant"
              className={controlClassName}
              value={variant}
              onChange={(event) => setVariant(event.target.value as ButtonVariant)}
            >
              {buttonVariants.map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </Field>
          <Field label="Size">
            <select
              aria-label="Button size"
              className={controlClassName}
              value={size}
              onChange={(event) => setSize(event.target.value as ButtonSize)}
            >
              {buttonSizes.map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </Field>
          <Field label="State">
            <select
              aria-label="Button state"
              className={controlClassName}
              value={state}
              onChange={(event) => setState(event.target.value as ButtonState)}
            >
              <option value="default">default</option>
              <option value="disabled">disabled</option>
              <option value="loading">loading</option>
            </select>
          </Field>
          <Field label="Stack">
            <select
              aria-label="Stack direction"
              className={controlClassName}
              value={stackDirection}
              onChange={(event) => setStackDirection(event.target.value as StackDirection)}
            >
              <option value="horizontal">horizontal</option>
              <option value="vertical">vertical</option>
            </select>
          </Field>
          <label className="flex min-h-ds-40 items-center gap-ds-8 text-body-md-medium text-content-primary">
            <input
              type="checkbox"
              checked={showLeftIcon}
              onChange={(event) => setShowLeftIcon(event.target.checked)}
            />
            Left icon
          </label>
          <label className="flex min-h-ds-40 items-center gap-ds-8 text-body-md-medium text-content-primary">
            <input
              type="checkbox"
              checked={showRightIcon}
              onChange={(event) => setShowRightIcon(event.target.checked)}
            />
            Right icon
          </label>
        </div>
      </section>

      <section
        className="content-container flex flex-col gap-ds-12"
        aria-labelledby="preview-title"
      >
        <h2 id="preview-title" className="text-body-lg-bold text-content-primary">
          Live preview
        </h2>
        <div className="flex min-h-40 items-center justify-center rounded-ds-lg bg-surface-primary p-ds-24 shadow-floating">
          <Button
            data-testid="button-preview"
            variant={variant}
            size={size}
            leftIcon={showLeftIcon ? <CheckIcon /> : undefined}
            rightIcon={showRightIcon ? <ChevronDownIcon /> : undefined}
            {...stateProps}
          >
            Button Label
          </Button>
        </div>
        <div className="flex flex-col gap-ds-8 rounded-ds-md bg-surface-primary p-ds-16">
          <code data-testid="prompt-output" className="text-body-sm-regular text-content-secondary">
            {prompt}
          </code>
          <Button size="sm" variant="tertiary" onClick={copyPrompt}>
            {copied ? "Copied!" : "Copy prompt"}
          </Button>
        </div>
      </section>

      <section className="content-container flex flex-col gap-ds-12" aria-labelledby="matrix-title">
        <div className="flex flex-col gap-ds-2">
          <h2 id="matrix-title" className="text-body-lg-bold text-content-primary">
            Button matrix
          </h2>
          <p className="text-body-sm-regular text-content-secondary">
            Type 3 × Size 3 · disabled/loading 상태 포함
          </p>
        </div>
        {buttonVariants.map((buttonVariant) => (
          <div
            key={buttonVariant}
            className="flex flex-col gap-ds-8 rounded-ds-lg bg-surface-primary p-ds-16"
          >
            <span className="text-body-sm-bold text-content-tertiary">{buttonVariant}</span>
            <div className="flex flex-wrap items-center gap-ds-8">
              {buttonSizes.map((buttonSize) => (
                <Button key={buttonSize} variant={buttonVariant} size={buttonSize}>
                  {buttonSize.toUpperCase()}
                </Button>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-ds-8">
              <Button variant={buttonVariant} size="sm" disabled>
                Disabled
              </Button>
              <Button variant={buttonVariant} size="sm" loading>
                Loading
              </Button>
            </div>
          </div>
        ))}
      </section>

      <section className="content-container flex flex-col gap-ds-12" aria-labelledby="stack-title">
        <h2 id="stack-title" className="text-body-lg-bold text-content-primary">
          ButtonStack
        </h2>
        <div className="rounded-ds-lg bg-surface-primary p-ds-16">
          <ButtonStack type={stackDirection} data-testid="button-stack">
            <Button variant="tertiary">Cancel</Button>
            <Button>Confirm</Button>
          </ButtonStack>
        </div>
      </section>

      <section className="flex flex-col gap-ds-12" aria-labelledby="bottom-nav-title">
        <div className="content-container flex flex-col gap-ds-2">
          <h2 id="bottom-nav-title" className="text-body-lg-bold text-content-primary">
            BottomNav
          </h2>
          <p className="text-body-sm-regular text-content-secondary">
            selected: {selectedNav} · create: {createCount}
          </p>
        </div>
        <div className="flex justify-center bg-surface-tertiary px-ds-16 py-ds-24">
          <BottomNav
            data-testid="bottom-nav"
            selected={selectedNav}
            onSelectedChange={setSelectedNav}
            onCreate={() => setCreateCount((count) => count + 1)}
          />
        </div>
      </section>
    </main>
  );
}
