export function searchFaqs(faqs, query) {
 const terms=query.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
 return faqs.filter(faq=>terms.every(term=>[faq.question,...faq.steps,faq.note,faq.category,faq.audience==='caregiver'?'myself caregiver':'loved one'].join(' ').toLocaleLowerCase().includes(term)));
}
