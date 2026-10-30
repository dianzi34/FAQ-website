import React, {useEffect, useRef, useState} from 'react';
import faqs from './data/faqs.json';
import pilot from './data/pilot.json';
import resourceFaqs from './data/resource-faqs.json';
const visibleFaqs=[...faqs.filter(f=>pilot.ids.includes(f.id)),...resourceFaqs];
function RelatedVideo({id}){
 const video=pilot.videos[id];
 if(!video)return null;
 return <aside className="related-video" aria-label="Related video"><p className="video-label">Related video</p><p className="video-title">{video.title}</p><p className="video-provider">Family Caregiver Alliance</p><a className="video-link" href={video.url} target="_blank" rel="noopener noreferrer">Watch on YouTube ↗</a><p className="video-hint">Opens the video on YouTube in a new tab.</p></aside>;
}
const categories=[
 ['stress','Stress Management','Find calm and support.','leaf'],
 ['sleep','Sleep Management','Get better rest.','moon'],
 ['communication','Communication','Connect with your loved one.','chat'],
 ['daily','Daily Care & Behavior','Make everyday care easier.','sun'],
 ['safety','Health & Safety','Support health and safety.','shield'],
 ['support','Caregiver Support & Planning','Find help and plan ahead.','hands']
];
function Icon({name='heart',...props}){
 const paths={heart:<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>,leaf:<><path d="M20 3C9 2 2 8 5 15s15 4 15-12Z"/><path d="M3 21 15 9M8 16l-1-6m5 2 5 1"/></>,moon:<path d="M20.5 13A8.5 8.5 0 0 1 11 3a9 9 0 1 0 9.5 10Z"/>,chat:<><path d="M21 11a8 8 0 0 1-8 8H7l-5 3 1.5-6A8 8 0 1 1 21 11Z"/><path d="M7 10h10M7 14h6"/></>,sun:<><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/></>,shield:<><path d="m12 2 8 3v6c0 5-4 8-8 11-4-3-8-6-8-11V5Z"/><path d="m8 12 3 3 5-6"/></>,hands:<><circle cx="9" cy="7" r="3"/><path d="M3 18v-2a6 6 0 0 1 10-4m3-8a3 3 0 0 1 0 6M15 20l-3-3a2.5 2.5 0 0 1 3-4 2.5 2.5 0 0 1 4 3Z"/></>,arrow:<path d="M4 12h16m-6-6 6 6-6 6"/>,back:<path d="M20 12H4m6-6-6 6 6 6"/>,plus:<path d="M5 12h14M12 5v14"/>,check:<path d="m5 12 4 4L19 6"/>};
 return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name]||paths.heart}</svg>;
}
function readRoute(){const p=new URLSearchParams(location.hash.slice(1));return {topic:p.get('topic')||'',audience:p.get('audience')==='caregiver'?'caregiver':'care_recipient'};}
function FAQ({faq}){return <details className="faq"><summary><span>{faq.question}</span><Icon name="plus"/></summary><div className="answer">{faq.answerText?<p className="original-answer">{faq.answerText}</p>:<><p className="step-heading">Try these small steps</p><ol>{faq.steps.map((s,i)=><li key={i}>{s}</li>)}</ol></>}{faq.note&&<p className="note">{faq.note}</p>}<RelatedVideo id={faq.id}/><div className="answer-source"><span>Draft · Needs clinical review</span>{faq.sourceUrl&&<a href={faq.sourceUrl} target="_blank" rel="noreferrer">Source information ↗</a>}</div></div></details>}
export default function App(){
 const [route,setRoute]=useState(readRoute),[scale,setScale]=useState(0);
 const heading=useRef(null);
 useEffect(()=>{const sync=()=>{setRoute(readRoute());};addEventListener('hashchange',sync);return()=>removeEventListener('hashchange',sync);},[]);
 useEffect(()=>{document.documentElement.style.fontSize=`${18+scale*2}px`;},[scale]);
 const category=categories.find(c=>c[0]===route.topic);
 const topicTitle=category?`${category[1]} FAQs`:"";
 useEffect(()=>{document.title=category?`${topicTitle} | Caregiving FAQs`:'Caregiving FAQs';if(category){heading.current?.focus();window.scrollTo(0,0);}},[route.topic]);
 function go(topic='',audience='care_recipient'){location.hash=topic?new URLSearchParams({topic,audience}).toString():'';if(!topic){setRoute({topic:'',audience});window.scrollTo(0,0);}}
 const results=category?visibleFaqs.filter(f=>f.category===category[1]&&(!['stress','sleep'].includes(category[0])||f.audience===route.audience)):[];
 const isHome=!category;
 function topicGrid(){return <div className="topic-grid">{categories.map(([id,title,desc,icon],i)=><button key={id} className={`topic-card color-${i}`} onClick={()=>go(id)}><span className="topic-icon"><Icon name={icon}/></span><span className="topic-text"><strong>{title}</strong><span>{desc}</span></span><Icon name="arrow" className="topic-arrow"/></button>)}</div>}
 return <><a className="skip" href="#main" onClick={e=>{e.preventDefault();document.getElementById("main").focus();document.getElementById("main").scrollIntoView();}}>Skip to content</a><header><div className="header-inner"><button className="brand" aria-label="Caregiving FAQs home" onClick={()=>go()}><span>Caregiving FAQs</span></button><div className="text-controls"><span>Text size</span><button aria-label="Decrease text size" disabled={scale===0} onClick={()=>setScale(s=>s-1)}>A−</button><button aria-label="Increase text size" disabled={scale===3} onClick={()=>setScale(s=>s+1)}>A+</button><span className="sr-only" role="status">Text size {100+scale*11} percent</span></div></div></header>
 <main id="main" tabIndex="-1">
 {isHome&&<section className="hero"><h1>You're not alone<br className="hero-break"/> in caring.</h1><p>Everyday tips for caring for your loved one — and yourself.</p></section>}
 {!isHome&&<div className="back-row"><button className="text-button" onClick={()=>go()}><Icon name="back"/>View all topics</button></div>}
 {isHome&&<section className="topics"><div className="section-intro"><h2>What would you like help with?</h2></div>{topicGrid()}</section>}
 {category&&<section className="browse"><div className="browse-heading">{category&&<span className={`topic-icon color-${categories.indexOf(category)}`}><Icon name={category[3]}/></span>}<div><h1 ref={heading} tabIndex="-1">{topicTitle}</h1><p>{category[2]}</p></div></div>{['stress','sleep'].includes(category?.[0])&&<div className="audience"><p>Who would you like help for?</p><div className="segmented" role="group" aria-label="Choose who the guidance is for"><button aria-pressed={route.audience==='care_recipient'} onClick={()=>go(category[0],'care_recipient')}><Icon name="heart"/>For My Loved One</button><button aria-pressed={route.audience==='caregiver'} onClick={()=>go(category[0],'caregiver')}><Icon name="hands"/>For Myself</button></div></div>}<p className="result-count" role="status">{results.length} {results.length===1?'question':'questions'}{category[0]==='stress'&&' · 10 across both groups'}</p>{results.length?<div className="faq-list" key={`${route.topic}-${route.audience}`}>{results.map(f=><div key={f.id}>{!['stress','sleep'].includes(category?.[0])&&<p className="result-meta">{f.audience==='caregiver'?'For Myself':'For My Loved One'}</p>}<FAQ faq={f}/></div>)}</div>:<div className="empty"><h2>No questions in this topic yet</h2><p>Explore another topic for more guidance.</p><button className="primary" onClick={()=>go()}>Explore all topics <Icon name="arrow"/></button>{topicGrid()}</div>}<p className="draft-notice">These tips are drafts awaiting clinical review. A healthcare professional can help you decide what is right for your situation.</p></section>}
 </main></>;
}
