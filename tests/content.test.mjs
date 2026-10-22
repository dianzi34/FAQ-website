import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {searchFaqs} from '../src/search.js';
const faqs=JSON.parse(readFileSync(new URL('../src/data/faqs.json',import.meta.url)));
test('six categories, unique IDs and questions, complete draft metadata',()=>{
 assert.equal(new Set(faqs.map(f=>f.category)).size,6);
 assert.equal(new Set(faqs.map(f=>f.id)).size,faqs.length);
 assert.equal(new Set(faqs.map(f=>f.question.toLowerCase())).size,faqs.length);
 for(const f of faqs){assert.ok(['caregiver','care_recipient'].includes(f.audience));assert.equal(f.reviewStatus,'needs_clinical_review');assert.ok(f.steps.length>=2&&f.steps.length<=4,f.id);assert.ok(f.question&&f.steps.every(s=>s.trim()));}
});
test('all 44 supplied rows remain traceable exactly once',()=>{
 const rows=faqs.flatMap(f=>f.sourceRows).sort((a,b)=>a-b);
 assert.deepEqual(rows,Array.from({length:44},(_,i)=>i+1));
});
test('12 required new drafts cover both audiences in priority topics',()=>{
 const drafts=faqs.filter(f=>f.origin==='new_draft');assert.equal(drafts.length,12);
 for(const category of ['Stress Management','Sleep Management'])for(const audience of ['caregiver','care_recipient'])assert.equal(drafts.filter(f=>f.category===category&&f.audience===audience).length,3);
});
test('search covers answer text, casing, multiple terms, empty and unmatched queries',()=>{
 assert.deepEqual(searchFaqs(faqs,'SLEEP'),searchFaqs(faqs,'sleep'));
 assert.ok(searchFaqs(faqs,'night lighting').length>0);
 assert.ok(searchFaqs(faqs,'pharmacist').some(f=>f.id==='faq-18'));
 assert.equal(searchFaqs(faqs,'  ').length,faqs.length);
 assert.equal(searchFaqs(faqs,'xyzunmatched987').length,0);
});
