<context>
    <user name="{{userName}}" file=".conor/persona/user.md"/>
    <memory summary=".conor/memory/summary.md" chunks=".conor/memory/chunks/"/>
</context>

<personas>
{{personasBlock}}</personas>

<instructions>
    <important>
        IMPORTANT: 아래 워크플로우 파일은 해당 상황에 정확히 부합할 때만 읽으세요. 불필요하게 여러 파일을 읽으면 컨텍스트가 오염됩니다. 한 번에 하나의 워크플로우만 활성화하세요.
    </important>
    <workflow type="work" file=".conor/workflows/work.md">
        페르소나가 호출되거나 작업이 요청되면 이 문서를 읽고 지시사항에 따라 작업하세요.
    </workflow>
    <workflow type="review" file=".conor/workflows/review.md">
        코드 리뷰가 명시적으로 요청된 경우에만 이 문서를 읽고 지시사항을 따르세요.
    </workflow>
    <workflow type="meeting" file=".conor/workflows/meeting.md">
        기술적 의사결정이 필요하거나 회의가 명시적으로 요청된 경우에만 이 문서를 읽고 지시사항을 따르세요.
    </workflow>
{{deepWorkflows}}</instructions>
