# AI 애플리케이션 배포

## 준비 사항
- 벡터 저장소 : 슈파 베이스
- 모니터링 및 디버깅 : 랭스미스
- 백엔드 API : 랭그래프 플랫폼

### 종속성 설치
`.env` 추가 및 라이브러리 설치

### LLM
api 발금
- https://platform.openai.com/settings/organization/api-keys

### 벡터 저장소
- supabase
  - project : https://supabase.com/dashboard/project/isgsnhxthnlymkrigtng  
  - sql : https://supabase.com/dashboard/porject/isgsnhxthnlymkrigtng/sql/3b819ca4-f2fc-467f-b8a2-1cc36d33968e

#### 슈ㅂ파베이스 임베딩 테스트
- code : learning-langchain/ch9/js/src/supabasStore.ts
- 겪은 이슈
  - open api key 설정 제대로 안됨
    - option 추가
```typescript
const embeddings = new OpenAIEmbeddings({
  openAIApiKey: process.env.OEPN_API_KEY,
});
```

```
file:///Users/user/hs-dev/learning-langchain/ch9/js/node_modules/.pnpm/@langchain+openai@0.3.17_@langchain+core@0.3.77_openai@4.104.0_ws@8.18.3_zod@3.25.76___ws@8.18.3/node_modules/@langchain/openai/dist/embeddings.js:128
            throw new Error("OpenAI or Azure OpenAI API key or Token Provider not found");
                  ^

Error: OpenAI or Azure OpenAI API key or Token Provider not found
    at new OpenAIEmbeddings (file:///Users/user/hs-dev/learning-langchain/ch9/js/node_modules/.pnpm/@langchain+openai@0.3.17_@langchain+core@0.3.77_openai@4.104.0_ws@8.18.3_zod@3.25.76___ws@8.18.3/node_modules/@langchain/openai/dist/embeddings.js:128:19)
    at file:///Users/user/hs-dev/learning-langchain/ch9/js/src/supabasStore.ts:10:20
    at ModuleJob.run (node:internal/modules/esm/module_job:371:25)
    at async onImport.tracePromise.__proto__ (node:internal/modules/esm/loader:702:26)
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5)
```

  - open api key billing 오류...
    - 코인 구매..(?)
```
file:///Users/user/hs-dev/learning-langchain/ch9/js/node_modules/.pnpm/@langchain+openai@0.3.17_@langchain+core@0.3.77_openai@4.104.0_ws@8.18.3_zod@3.25.76___ws@8.18.3/node_modules/@langchain/openai/dist/embeddings.js:128
            throw new Error("OpenAI or Azure OpenAI API key or Token Provider not found");
                  ^

Error: OpenAI or Azure OpenAI API key or Token Provider not found
    at new OpenAIEmbeddings (file:///Users/user/hs-dev/learning-langchain/ch9/js/node_modules/.pnpm/@langchain+openai@0.3.17_@langchain+core@0.3.77_openai@4.104.0_ws@8.18.3_zod@3.25.76___ws@8.18.3/node_modules/@langchain/openai/dist/embeddings.js:128:19)
```

  - sql error
    - cursor에 물어봐서 오타 찾음...
```
file:///Users/user/hs-dev/learning-langchain/ch9/js/node_modules/.pnpm/@langchain+community@0.3.56_@browserbasehq+sdk@2.6.0_@browserbasehq+stagehand@1.14.0_@p_b8f17fe88e66818ff28505c6b02041a5/node_modules/@langchain/community/dist/vectorstores/supabase.js:256
            throw new Error(`Error searching for documents: ${error.code} ${error.message} ${error.details}`);
                  ^

Error: Error searching for documents: PGRST202 Could not find the function public.match_documents(filter, match_count, query_embedding) in the schema cache Searched for the function public.match_documents with parameters filter, match_count, query_embedding or with a single unnamed json/jsonb parameter, but no matches were found in the schema cache.
    at SupabaseVectorStore._searchSupabase (file:///Users/user/hs-dev/learning-langchain/ch9/js/node_modules/.pnpm/@langchain+community@0.3.56_@browserbasehq+sdk@2.6.0_@browserbasehq+stagehand@1.14.0_@p_b8f17fe88e66818ff28505c6b02041a5/node_modules/@langchain/community/dist/vectorstores/supabase.js:256:19)
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
    at async SupabaseVectorStore.similaritySearchVectorWithScore (file:///Users/user/hs-dev/learning-langchain/ch9/js/node_modules/.pnpm/@langchain+community@0.3.56_@browserbasehq+sdk@2.6.0_@browserbasehq+stagehand@1.14.0_@p_b8f17fe88e66818ff28505c6b02041a5/node_modules/@langchain/community/dist/vectorstores/supabase.js:268:26)
    at async SupabaseVectorStore.similaritySearch (file:///Users/user/hs-dev/learning-langchain/ch9/js/node_modules/.pnpm/@langchain+core@0.3.77_openai@4.104.0_ws@8.18.3_zod@3.25.76_/node_modules/@langchain/core/dist/vectorstores.js:260:25)
    at async file:///Users/user/hs-dev/learning-langchain/ch9/js/src/supabasStore.ts:61:33
```

### 벡엔드 API
- 다수의 동시 사용자 요구에 대응하고 대용량 상태 및 스레드를 효율적으로 저장할 수 있또록 수평 확장이 가능한 작업 큐와 서버, 강력한 Postgres 체크포인터를 관리
- 랭그래프 플랫폼 주요기능
  - 스트리밍 기능 및 사용자 개입 
  - 그외
    - 진행 중인 그래프 스레드에서 새로우 ㄴ사용자 입력을 효과적으로 처리하는 이중 전송
    - 오래 걸리는 작업의 비동기 백그라운드 처리
    - 정해진 일저에 따라 기본적인 업무를 자동으로 수행하는 크론 작업

#### 랭스미스
통합 개발자 플랫폼으로 디버깅, 협업, 테스트 및 LLM 애플리케이션 모니터링

### 랭그래프 플랫폼 API 이해하기
#### 데이터 모델
- 어시스턴트 
  - CompiledGraph 기반 인스턴스
- 스텔드
- 실행
- 크론 잡

#### 기능
- 스트리밍
- 사용자 개입
- 이중 텍스트 전송
- 무상태 실행
- 웹훅

### 배포
#### 로컬
- langgraph-cli 설치 `pnpm add @langchain/langgraph-cli`
- 실행 `npx @langchain/langgraph-cli dev`

```bash
# 방법 2: 줄바꿈 사용 (백슬래시 뒤에 공백 없이)
curl -X POST \
--url http://localhost:2024/runs/stream \
--header 'Content-Type: application/json' \
--data '{
  "assistant_id": "retrieval_graph",
  "input": {
    "query": "What is this document about?"
  },
  "metadata": {},
  "config": {
    "configurable": {
    }
  },
  "multitask_strategy": "reject",
  "stream_mode": ["values"]
}'
```