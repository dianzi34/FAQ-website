import React, {useEffect, useState} from 'react';
import selfTips from './data/self-tips.json';
import lovedOneTips from './data/loved-one-tips.json';
function TipText({tip}){
 if(!tip.references?.length)return tip.text;
 const text=tip.text.replace(/\s*\[[\d,\s]+\]\s*$/, '');
 const parts=tip.inlineLink?text.split(tip.inlineLink.text):null;
 return <>{parts?<>{parts[0]}<a className="inline-source" href={tip.inlineLink.url} target="_blank" rel="noopener noreferrer">{tip.inlineLink.text}</a>{parts[1]}</>:text} <span className="references">[{tip.references.map((ref,i)=><React.Fragment key={ref.number}>{i>0?', ':''}<a href={ref.url} target="_blank" rel="noopener noreferrer" aria-label={`${tip.label||'When to Seek Help'}, source ${ref.number} (${new URL(ref.url).hostname}), opens in a new tab`}>{ref.number}</a></React.Fragment>)}]</span></>;
}
function readRoute(){
 const params=new URLSearchParams(location.hash.slice(1));
 return {topic:params.get('topic')==='sleep'?'sleep':'stress',audience:params.get('audience')==='care_recipient'?'care_recipient':'caregiver'};
}
export default function App(){
 const [route,setRoute]=useState(readRoute);
 const [scale,setScale]=useState(0);
 useEffect(()=>{const sync=()=>setRoute(readRoute());addEventListener('hashchange',sync);return()=>removeEventListener('hashchange',sync);},[]);
 useEffect(()=>{document.documentElement.style.fontSize=`${18+scale*2}px`;},[scale]);
 useEffect(()=>{document.title=`Tips for managing ${route.topic}`;},[route.topic]);
 const sections=(route.audience==='caregiver'?selfTips:lovedOneTips)[route.topic];
 const href=(topic,audience=route.audience)=>`#topic=${topic}&audience=${audience}`;
 return <>
  <a className="skip" href="#tips" onClick={e=>{e.preventDefault();document.getElementById('tips').focus();}}>Skip to tips</a>
  <header><nav aria-label="Topics"><a href={href('stress')} aria-current={route.topic==='stress'?'page':undefined}>Stress</a><a href={href('sleep')} aria-current={route.topic==='sleep'?'page':undefined}>Sleep</a></nav><div className="text-controls"><span>Text size</span><button disabled={scale===0} onClick={()=>setScale(s=>s-1)} aria-label="Decrease text size">A−</button><button disabled={scale===3} onClick={()=>setScale(s=>s+1)} aria-label="Increase text size">A+</button></div></header>
  <main id="tips" tabIndex="-1" className={route.topic}>
   <h1>Tips for managing {route.topic}</h1>
   <div className="audience" role="group" aria-label="Choose who the tips are for">
    <a href={href(route.topic,'care_recipient')} aria-current={route.audience==='care_recipient'?'true':undefined}>For My Loved One</a>
    <a href={href(route.topic,'caregiver')} aria-current={route.audience==='caregiver'?'true':undefined}>For Myself</a>
   </div>
   <p className="audience-caption">{route.audience==='care_recipient'?'Supporting a loved one with memory challenges.':'Everyday tips for your own well-being.'}</p>
   <div className="sections" key={`${route.topic}-${route.audience}`}>
    {sections.map((section,i)=><section className="tip-section" key={section.title} aria-labelledby={`section-${i}`}><h2 id={`section-${i}`}>{section.title}</h2><ul>{section.tips.map((tip,j)=><li key={j}>{tip.label&&<strong>{tip.label}: </strong>}<TipText tip={tip}/></li>)}</ul></section>)}
   </div>
  </main>
 </>;
}
