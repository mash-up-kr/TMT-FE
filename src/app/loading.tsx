import { Spinner } from "@/shared/ui/Spinner";

export default function Loading() {
  return (
    <output className="flex min-h-0 flex-1 items-center justify-center">
      <Spinner size="lg" />
    </output>
  );
}
