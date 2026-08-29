import { ReviewTagIcon } from "@/shared/components/ReviewTagIcon/ReviewTagIcon";
import { Chip } from "@/shared/ui/Chip";
import type { ReviewTagGroup } from "../_model/tag";

type TagGroupFieldProps = Readonly<{
  group: ReviewTagGroup;
  selectedTagIds: ReadonlySet<string>;
  onToggle: (id: string) => void;
  disabled?: boolean;
}>;

/**
 * 태그 한 묶음.
 *
 * `fieldset`/`legend`로 감싸 어떤 질문에 속한 칩인지가 접근성 트리에 남는다. 칩은 눌림 상태를
 * 가진 토글이라 `Chip`이 붙이는 `aria-pressed`가 그대로 맞다.
 */
export function TagGroupField({
  group,
  selectedTagIds,
  onToggle,
  disabled = false,
}: TagGroupFieldProps) {
  return (
    <fieldset disabled={disabled}>
      <legend className="mb-ds-12 flex items-center gap-ds-4 text-body-lg-medium">
        <span className="text-content-primary">{group.label}</span>
        <span className="text-content-tertiary">{group.hint}</span>
      </legend>

      <div className="flex w-full flex-wrap gap-ds-8">
        {group.tags.map((tag) => {
          return (
            <Chip
              key={tag.id}
              size="lg"
              selected={selectedTagIds.has(tag.id)}
              onClick={() => onToggle(tag.id)}
              leftIcon={<ReviewTagIcon tagId={tag.id} />}
            >
              {tag.label}
            </Chip>
          );
        })}
      </div>
    </fieldset>
  );
}
