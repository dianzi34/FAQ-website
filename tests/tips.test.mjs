import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=name=>JSON.parse(readFileSync(new URL('../src/data/'+name,import.meta.url)));
test('each citation has its own ordered direct URL, without mail tracking',()=>{
 const data=read('self-tips.json');
 for(const [topic,count] of [['sleep',16],['stress',21]]){
  const tips=data[topic].flatMap(s=>s.tips);assert.equal(tips.flatMap(t=>t.references||[]).length,count);
  for(const tip of tips){const match=tip.text.match(/\[([\d,\s]+)\]\s*$/);if(!match)continue;
   assert.deepEqual(tip.references.map(r=>r.number),match[1].split(',').map(Number));
   for(const ref of tip.references){const url=new URL(ref.url);assert.equal(url.protocol,'https:');assert.ok(!url.hostname.includes('safelinks'));assert.ok(!url.searchParams.has('sdata'));}
  }
 }
 const sleep=data.sleep[0].tips;assert.notEqual(sleep[0].references[0].url,sleep[1].references[0].url);
 assert.equal(new URL(sleep[1].references[0].url).searchParams.get('t'),'33');
});
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
