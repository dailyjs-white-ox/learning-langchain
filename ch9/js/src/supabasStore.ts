import { SupabaseVectorStore } from '@langchain/community/vectorstores/supabase';
import { OpenAIEmbeddings } from '@langchain/openai';

import {Document}from '@langchain/core/documents';
import {createClient} from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({path: path.resolve(__dirname, '../.env')});

function omit(s, len=20) {
  if (!s) return s
  return s.slice(0, len) + '...'
}

console.log(`OPEN_API_KEY=${omit(process.env.OEPN_API_KEY)}`);

const embeddings = new OpenAIEmbeddings({
  openAIApiKey: process.env.OEPN_API_KEY,
});


const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseClient = createClient(supabaseUrl, supabaseKey);

const vectorStore = new SupabaseVectorStore(embeddings, {
  client: supabaseClient,
  tableName: 'documents',
  queryName: 'match_documents',
});

const document1: Document = new Document({
  pageContent: 'The powerhouse of the cell is the mitochondria',
  metadata: { source: 'https://example.com' },
});

const document2: Document = new Document({
  pageContent: 'Buildings are made of bricks',
  metadata: { source: 'https://example.com' },
});

const documents = [document1, document2];

// 데이터베이스에 데이터 저장
await vectorStore.addDocuments(documents, {
  ids: ['1', '2'],
});

// 벡터 저장소에 쿼리 전송

const filter = {
  source: 'https://example.com',
};

const similaritySearchResults = await vectorStore.similaritySearch("biology", 2, filter);

for (const result of similaritySearchResults) {
  console.log(`* ${result.pageContent} [${JSON.stringify(result.metadata, null)}]`);
}

