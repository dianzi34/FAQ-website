import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const faqs=JSON.parse(readFileSync(new URL('../src/data/faqs.json',import.meta.url)));
test('Stress has ten FAQs split five per audience; original questions and sleep remain available',()=>{
 const pilot=JSON.parse(readFileSync(new URL('../src/data/pilot.json',import.meta.url)));
 const added=JSON.parse(readFileSync(new URL('../src/data/resource-faqs.json',import.meta.url)));
 assert.equal(pilot.ids.length,13);assert.equal(new Set(pilot.ids).size,13);
 const selected=[...faqs.filter(f=>pilot.ids.includes(f.id)),...added];assert.equal(selected.length,18);
 assert.equal(new Set(selected.map(f=>f.id)).size,18);
 for(const audience of ['caregiver','care_recipient'])assert.equal(selected.filter(f=>f.category==='Stress Management'&&f.audience===audience).length,5);
 for(const f of added){assert.equal(f.origin,'resource_summary');assert.ok(f.answerText);assert.equal(new URL(f.sourceUrl).hostname,'www.caregiver.org');}
 assert.equal(new Set(selected.map(f=>f.category)).size,6);
 assert.equal(selected.filter(f=>f.category==='Sleep Management').length,3);
 assert.equal(Object.keys(pilot.videos).length,8);
 for(const [id,v] of Object.entries(pilot.videos)){assert.ok(selected.some(f=>f.id===id));assert.equal(new URL(v.url).hostname,'www.youtube.com');assert.match(new URL(v.url).searchParams.get('v'),/^[\w-]{11}$/);assert.equal(new URL(v.resourceUrl).hostname,'www.caregiver.org');assert.ok(v.title);}
 assert.ok(selected.filter(f=>f.category==='Sleep Management').every(f=>!pilot.videos[f.id]));
});
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
