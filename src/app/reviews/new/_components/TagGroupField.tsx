import { Chip } from "@/shared/ui/Chip";
import type { ReviewTagGroup } from "../_model/tag";

type TagGroupFieldProps = Readonly<{
  group: ReviewTagGroup;
  selectedTagIds: ReadonlySet<string>;
  onToggle: (id: string) => void;
}>;

/**
 * 태그 한 묶음.
 *
 * `fieldset`/`legend`로 감싸 어떤 질문에 속한 칩인지가 접근성 트리에 남는다. 칩은 눌림 상태를
 * 가진 토글이라 `Chip`이 붙이는 `aria-pressed`가 그대로 맞다.
 */
export function TagGroupField({ group, selectedTagIds, onToggle }: TagGroupFieldProps) {
  return (
    <fieldset>
      {/* legend는 flex 아이템이 되지 않아 fieldset의 gap이 걸리지 않는다. 간격은 legend가 낸다. */}
      <legend className="mb-ds-12 flex items-center gap-ds-4 text-body-lg-medium">
        <span className="text-content-primary">{group.label}</span>
        <span className="text-content-tertiary">{group.hint}</span>
      </legend>

      <div className="flex flex-wrap gap-ds-8">
        {group.tags.map((tag) => (
          <Chip
            key={tag.id}
            size="lg"
            selected={selectedTagIds.has(tag.id)}
            onClick={() => onToggle(tag.id)}
          >
            {tag.label}
          </Chip>
        ))}
      </div>
    </fieldset>
  );
}
