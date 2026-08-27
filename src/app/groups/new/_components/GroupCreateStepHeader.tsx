import { Badge } from "@/shared/ui/Badge";

type GroupCreateStepHeaderProps = {
  title: string;
  required: boolean;
};

export function GroupCreateStepHeader({ title, required }: GroupCreateStepHeaderProps) {
  return (
    <header className="flex flex-col items-start gap-ds-12">
      <h1 className="whitespace-pre-line text-heading-lg text-content-primary">{title}</h1>
      <Badge size="md" tone={required ? "brand" : "neutral"}>
        {required ? "필수" : "선택"}
      </Badge>
    </header>
  );
}
