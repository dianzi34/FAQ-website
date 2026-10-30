import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=name=>JSON.parse(readFileSync(new URL('../src/data/'+name,import.meta.url)));
test('all supplied self tips and section ordering are retained',()=>{
 const data=read('self-tips.json');
 assert.deepEqual(data.stress.map(s=>s.title),['Physical and Lifestyle Tips','Mental and Behavioral Strategies','When to Seek Help']);
 assert.deepEqual(data.sleep.map(s=>s.title),['Schedule and Routine','Environment','Diet and Lifestyle']);
 assert.deepEqual(data.stress.map(s=>s.tips.length),[5,5,1]);
 assert.deepEqual(data.sleep.map(s=>s.tips.length),[4,3,4]);
 for(const sections of Object.values(data))for(const section of sections)for(const tip of section.tips)assert.ok(tip.text.trim());
 assert.ok(JSON.stringify(data).includes('65°F–68°F'));
 assert.ok(JSON.stringify(data).includes('[1, 2, 3, 4, 5, 6, 7, 8]'));
});
test('loved-one tips preserve every original stress and sleep answer without truncation',()=>{
 const archive=read('faqs.json');const data=read('loved-one-tips.json');
 const selected=archive.filter(f=>['Stress Management','Sleep Management'].includes(f.category)&&f.audience==='care_recipient');
 const tips=Object.values(data).flatMap(sections=>sections.flatMap(s=>s.tips));
 assert.equal(tips.length,selected.length);
 for(const f of selected)assert.equal(tips.find(t=>t.sourceId===f.id)?.text,f.answerText);
});
