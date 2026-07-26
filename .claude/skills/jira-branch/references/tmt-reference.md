# TMT 참고값 · 담당자 지정

## 담당자 지정 (팀원 목록을 하드코딩하지 않는다)

이 레포는 공개 저장소다. 팀원 실명·account ID 표를 파일에 박아두면 개인정보가 공개로 노출되므로 넣지 않는다. 대신 실행 시점에 판별·조회한다.

- **본인 할당 (대부분의 경우)**: 아무것도 필요 없다. 본인 신원은 `atlassianUserInfo`(account ID)와 JQL `currentUser()`가 실행자 본인을 돌려준다. 그래서 팀원 누구에게 공유해도 설정 없이 각자 자기 티켓 기준으로 동작한다.
- **남에게 할당 (드묾)**: 이름/이메일로 `mcp__atlassian__lookupJiraAccountId`(또는 사용자 검색)를 그때그때 호출해 account ID를 얻는다. `createJiraIssue`의 `assignee_account_id`, `editJiraIssue`의 `fields.assignee.accountId`에 그 값을 쓴다.

## TMT 참고값

- cloudId: `43e6771e-52d2-4834-9dc3-cdf7f4975abb` (ttalkkak.atlassian.net)
- project key: `TMT` (project id `10033`)
- 이슈 타입: `작업`(Task) · `스토리`(Story) · `버그`(Bug) · `에픽`(Epic) · `Subtask`
- ⚠️ 이슈 생성 시 **Decision Level(`customfield_10147`) 필수** — 미설정 시 create 실패. 세부 작업 기본값 **L3**(방향성 결정이면 L2): `additional_fields={"customfield_10147":{"value":"L3"}}`
- 상태 전환 ID(전역): `21`=진행 중 · `2`=검토 중(In Review) · `31`=완료 · `11`=해야 할 일 · `3`=Blocked
- 값이 바뀔 수 있으니 실패하면 `getTransitionsForJiraIssue` / `getJiraProjectIssueTypesMetadata`로 재확인
