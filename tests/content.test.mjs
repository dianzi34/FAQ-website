import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const faqs=JSON.parse(readFileSync(new URL('../src/data/faqs.json',import.meta.url)));
test('six categories, unique IDs and questions, complete draft metadata',()=>{
 assert.equal(new Set(faqs.map(f=>f.category)).size,6);
 assert.equal(new Set(faqs.map(f=>f.id)).size,faqs.length);
 assert.equal(new Set(faqs.map(f=>f.question.toLowerCase())).size,faqs.length);
 for(const f of faqs){assert.ok(['caregiver','care_recipient'].includes(f.audience));assert.equal(f.reviewStatus,'needs_clinical_review');assert.ok(f.steps.length>=1&&f.steps.length<=4,f.id);assert.ok(f.question&&f.steps.every(s=>s.trim()));}
});
test('all 44 supplied rows remain traceable exactly once',()=>{
 const rows=faqs.flatMap(f=>f.sourceRows).sort((a,b)=>a-b);
 assert.deepEqual(rows,Array.from({length:44},(_,i)=>i+1));
});
test("Other answers match source text except the documented swallowing exception",()=>{const source=JSON.parse(readFileSync(new URL("../content/source-rows.json",import.meta.url)));for(const f of faqs.filter(f=>!["Stress Management","Sleep Management"].includes(f.category)&&f.id!=="faq-25")){const r=source.find(r=>r.sourceRow===f.sourceRows[0]);assert.equal(f.question,r.question);assert.equal(f.answerText,r.answer);assert.equal(f.note,"");}});

test('Stress and Sleep use only unchanged original answers, with no generated drafts',()=>{const source=JSON.parse(readFileSync(new URL('../content/source-rows.json',import.meta.url)));assert.equal(faqs.length,44);assert.ok(faqs.every(f=>f.origin==='provided_table'));for(const f of faqs.filter(f=>['Stress Management','Sleep Management'].includes(f.category))){const row=source.find(r=>r.sourceRow===f.sourceRows[0]);assert.equal(f.question,row.question);assert.equal(f.answerText,row.answer);assert.equal(f.note,'');assert.equal(f.sourceUrl,null);}assert.equal(faqs.filter(f=>f.category==='Sleep Management'&&f.audience==='caregiver').length,0);});
