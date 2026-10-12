import fs from 'node:fs/promises';
import { load } from 'cheerio';

// The original LayerNote layout remains an immutable design reference.
try { await fs.access('theme/reference.html'); } catch { await fs.copyFile('theme/index.html','theme/reference.html'); }
const $ = load(await fs.readFile('theme/reference.html','utf8'));
const asset = (s) => $(s).first().attr('src');
const images = {
  freelancer:asset('#who-its-for .swiper-slide:nth-child(1) img'),
  studio:asset('#who-its-for .swiper-slide:nth-child(2) img'),
  product:asset('#who-its-for .swiper-slide:nth-child(3) img'),
  developer:asset('#who-its-for .swiper-slide:nth-child(4) img'),
};
const label=(text)=>`<span class="inline-flex items-center gap-2 text-sm"><span class="size-1.5 rounded-full bg-brand-electric-blue"></span>${text}</span>`;
const check=`<span class="flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-zest text-brand-black-pearl">✓</span>`;
const bullets=(items)=>items.map(t=>`<li class="flex items-start gap-3">${check}<span class="text-body-sm leading-snug text-brand-black-pearl/85">${t}</span></li>`).join('');
const button=(text,href='/join',dark=false)=>`<a href="${href}" class="tpa-button ${dark?'dark':''}">${text}<span aria-hidden="true">↗</span></a>`;
const brand=`<span class="tpa-wordmark">tpa<span>·</span></span>`;

$('title').text('TPA — Good people. Greater possibilities.');
$('meta[name=description]').attr('content','Tollygunge Professional Association. A community to connect, learn, collaborate, grow and contribute.');
$('head').append('<link rel="stylesheet" href="/tpa.css">');
$('body>nav a[href="/"]').first().html(brand).attr('aria-label','TPA home');
const navLinks=$('nav [data-nav-id]');
const nav=[['Our community','#about'],['Membership','#pricing'],['Events','/events'],['Resources','#capabilities'],['Contact','#connect']];
navLinks.each((i,e)=>{if(nav[i])$(e).text(nav[i][0]).attr('href',nav[i][1]);});
$('nav a[href="https://app.layernote.io/"]').text('Member login').attr('href','/login').attr('data-account-link','true');
$('nav a[href="https://app.layernote.io/register"]').html('Join TPA <span aria-hidden="true">↗</span>').attr('href','/join');

// Meaningful TPA content replaces every software-specific headline and action.
$('h1').attr('aria-label','Good people. Shared knowledge. Greater possibilities.');
const heroLines=$('[data-hero-line]');
heroLines.eq(0).html('Good people.<br><span class="hero-mark"><span aria-hidden="true" data-hero-mark-bg class="hero-mark-bg"></span><span class="relative z-10">Shared knowledge.</span><span data-hero-mark-check class="tpa-hero-check" aria-hidden="true">✓</span></span>');
heroLines.eq(1).text('Greater possibilities.');
$('p[data-hero-copy]').html('A professional community where experience meets new ideas. Connect with people who believe that progress is better when we make it together.');
$('[data-hero-copy]').filter((_,e)=>e.tagName==='div').first().html(button('Find your place at TPA','/join',true)+button('Get to know us','#about'));
$('[data-hero-copy]').filter((_,e)=>e.tagName==='div').last().html('<span>For professionals, entrepreneurs &amp; the next generation.</span>');

// The animated product window becomes an explicitly illustrative member journey.
const substitutions=new Map([
  ['Comments','Your journey'],['Navis','TPA'],['Version 1','Community'],['Desktop 1440','Tollygunge'],['100%','Explore'],['Review','Community'],['Tasks','Events'],['Finish review','Explore TPA'],
  ['Active','To explore'],['Resolved','Explored'],['Page: Home','Your next steps'],['About','About'],['Services','Learning'],['Case studies','Community'],['Blog','Resources'],['Get started','Join TPA'],
  ['Consulting for modern operations','Connected by curiosity'],['Calm operations','Good people.'],['for growing teams','Greater possibilities.'],
  ['We audit your tooling, tighten your processes, and stay on call while your team scales.','Connect across disciplines. Share perspectives, find collaborators and discover new possibilities.'],
  ['Contact','Connect'],['Trusted by 200+ operations teams','A shared commitment to progress'],['Client satisfaction','Connect'],['Faster onboarding','Learn'],['Years of expertise','Collaborate'],['Support coverage','Contribute'],
  ['Amelia Brandt','Your community'],['Marc de Vries','Your next step'],['Priya Shah','Member'],['Amelia Ward','TPA'],['Nice catch 👀','Welcome to the community ✦'],
  ['Can this heading be the medium weight from the design? It reads too light next to the label.','Bring your experience, your curiosity and your commitment to a stronger professional community.'],
  ['These lines sit too close together. Give the paragraph a bit more air.','Discover seminars, workshops and thoughtful conversations.'],
  ['This grey is too light to read on white. Use the dark text colour.','Find useful resources and a place to contribute.'],
  ['98%','01'],['95%','02'],['10+','03'],['24/7','04'],['Open','To explore'],['section.hero > h1','Connect · Learn · Contribute']
]);
$('[data-hero-visual] *').contents().each((_,node)=>{if(node.type==='text'){let t=node.data;for(const [from,to] of substitutions)t=t.replaceAll(from,to);node.data=t;}});
$('[data-hero-visual]').append('<p class="tpa-demo-label">An illustrative look at your TPA journey</p>');
$('[data-mock-stage] [data-mock-typed]').text('Bring your experience and your curiosity.');
const terminal=[
  'YOUR NEXT CHAPTER AT TPA',
  'A community built around shared progress.',
  '01  Find your membership',
  '    Patron · Annual · Life',
  '02  Create your account',
  '    Your details, together in one place',
  '03  Share your professional background',
  '    Complete the application and required evidence',
  '04  Association review',
  '    Account registration and membership approval are separate',
  '05  Connect. Learn. Contribute.',
  '    Start your next conversation.'
];
$('[data-term-line]').each((i,e)=>$(e).text(terminal[i]||''));
$('[data-scene-terminal]').find('*').contents().each((_,n)=>{if(n.type==='text'&&n.data.includes('navis — claude'))n.data='Your TPA journey';});

// About: retain the moving streams and anchored card choreography.
const about=$('#the-problem-alt').attr('id','about');
about.find('[data-reveal-eyebrow]').html(label('A place to belong'));
about.find('[data-reveal-heading]').text('Professional relationships. With a human foundation.').attr('aria-label','Professional relationships. With a human foundation.');
about.find('h3').eq(0).text('Different backgrounds. Shared curiosity.');
about.find('h3').eq(1).text('One community. More possibilities.');
about.find('ul').eq(0).html(bullets(['Professionals across disciplines','Business leaders and entrepreneurs','Experience alongside new ideas','Knowledge worth sharing','A belief in showing up for one another']));
about.find('ul').eq(1).html(bullets(['Connect with people beyond your own discipline','Participate in knowledge-sharing events','Explore meaningful collaborations','Contribute to professional and community initiatives','Grow through the perspectives around you']));
about.find('[data-you-tip]').text('There’s a place for you here.');about.find('[data-you]').text('you');
const chaos=about.find('[data-chaos-card]');
chaos.html(`<div class="tpa-community-stream" data-you-rows>${[0,1,2].map((r)=>`<div class="tpa-stream-row">${['New ideas','Professionals','Thoughtful conversations','Entrepreneurs','Shared knowledge','Community','New perspectives','Collaboration'].map((x,i)=>`<span data-card><span class="tpa-avatar-chip">${['↗','✦','◎','↔'][(i+r)%4]}</span>${x}</span>`).join('')}</div>`).join('')}</div><span class="tpa-stream-center">Every perspective adds something.</span>`);
about.find('[data-order-card]').html(`<div class="tpa-connection-map"><span class="tpa-orbit-ring one"></span><span class="tpa-orbit-ring two"></span><span class="tpa-orbit-ring three"></span><span class="tpa-orbit-center">tpa<span>·</span></span>${['Connect','Learn','Collaborate','Grow','Contribute'].map((s,i)=>`<span data-order-pin class="tpa-orbit-node node-${i}">${s}</span>`).join('')}<span class="tpa-map-note" data-order-panel>Individual strengths.<br>Collective progress.</span></div>`);

// The dark photographic interlude retains the reference parallax and text reveal.
$('#the-gap [data-reveal-eyebrow]').html(label('Rooted in Tollygunge'));
$('#the-gap [data-reveal-line]').eq(0).text('Individual strengths.');
$('#the-gap [data-reveal-line]').eq(1).text('Collective progress.');
$('#the-gap [data-reveal-intro]').filter((_,e)=>e.tagName==='p').text('Different disciplines. Shared curiosity. A professional community that creates opportunities to connect, collaborate and grow together.');
$('#the-gap a').attr('href','#how-it-works').contents().filter((_,e)=>e.type==='text').first().replaceWith('Find your next step');
$('#the-gap img').attr('src',images.studio).attr('alt','An illustrative professional setting');

// Reuse the file fan from the removed software feature grid in the resources card.
const filesVisual=$('[data-files-visual]').first().html();
$('#the-solution').remove();

const workflow=$('#how-it-works');
workflow.find('[data-reveal-eyebrow]').html(label('Your TPA journey'));
workflow.find('[data-reveal-heading]').text('Find your community. Make your next move.').attr('aria-label','Find your community. Make your next move.');
workflow.find('[data-reveal-intro]').text('Join the community, make room for learning and bring your experience to something meaningful.');
workflow.find('button').slice(0,3).each((i,e)=>$(e).text(['Join','Learn','Contribute'][i]));
const steps=[
  ['Bring your perspective. Find your place.','Established professional or just getting started—bring your experience and curiosity. Patron, Annual and Life membership options share one application journey.',['Choose a membership that fits your journey','Create your account and complete your details','Share the required professional evidence'],'Your account is the starting point. Membership approval follows association review.'],
  ['Make room for what comes next.','Seminars, workshops and thoughtful conversations turn shared knowledge into professional growth. Explore published events and find a conversation that matters to you.',['Discover seminars, workshops and discussions','Register for published events through your account','Keep your own event and attendance history together'],'Published event dates and registration details appear when confirmed.'],
  ['Contribute something lasting.','Bring your experience to initiatives that create value for the profession and the wider community. Start a conversation, share an idea or find a useful resource.',['Connect across professional disciplines','Explore community and knowledge-sharing initiatives','Speak with the association about your ideas'],'Good conversations lead to greater possibilities.']
];
workflow.find('[data-index]').each((i,e)=>{const p=$(e),left=p.find('h3').first().parent().parent();p.find('h3').first().text(steps[i][0]);p.find('h3').first().next('p').text(steps[i][1]);p.find('ul').first().html(bullets(steps[i][2]));left.children('p').last().text(steps[i][3]);});
$('[data-item]').filter((_,e)=>e.tagName==='p').eq(0).text('Your membership journey');
$('[data-name]').text('Your name').attr('aria-label','Illustrative applicant name');
$('[data-item]').filter((_,e)=>e.tagName==='p').eq(1).text('Your membership');
$('[data-select-value]').text('Choose a membership');
$('[data-option]').each((i,e)=>{if(i>2)$(e).remove();else $(e).text(['Patron','Annual','Life'][i]);});
$('[data-url-row]').find('p').text('Your email address');
$('[data-url-field]').text('you@example.com').attr('aria-label','Illustrative applicant email');
$('[data-item]').filter((_,e)=>e.tagName==='p').last().text('Your professional background');
$('[data-folder-value]').text('Choose a discipline');
$('[data-folder-option]').each((i,e)=>$(e).text(['Finance & accounting','Business & entrepreneurship','Technology & innovation','Other professional discipline'][i]));
$('[data-create-label]').text('Preview your next step');$('[data-create-done]').text('Ready for your next step ✓');
$('[data-wrap]').append('<p class="tpa-form-demo-help">Illustrative preview · no application is submitted here</p>');

// Events illustration: original pinned popup and animated toolbar, new semantics.
$('[data-find-site]').find('img').remove();
$('[data-find-site]').find('span').filter((_,e)=>$(e).text()==='fieldwork.app').text('TPA · Events & learning');
const findToolbar=$('[data-find-toolbar]');
$('[data-find-site]').children().last().find('.relative').first().prepend(`<div class="tpa-event-illustration"><span class="tpa-small-label">EVENTS & LEARNING</span><h4>Knowledge, with a<br>human connection.</h4><div class="tpa-event-symbols"><span>↗</span><span>✦</span><span>◎</span></div><span class="tpa-illustration-caption">Seminars · Workshops · Conversations</span></div>`);
$('[data-find-comment]').html(`<div class="tpa-note"><span class="tpa-note-eyebrow">YOUR NEXT CONVERSATION</span><strong>Find something that moves you forward.</strong><p>Explore confirmed events and registration details.</p><a href="/events">Explore events ↗</a></div>`);

// Retain manual/assisted panel switching as member view / association view.
$('[data-toggle-you]').html('Your perspective').attr('aria-label','Your perspective');
$('[data-toggle-claude]').html('The community').attr('aria-label','The community');
$('[data-fix-caption]').text('One community. Many perspectives.');
$('[data-fix-card]').each((i,e)=>$(e).html(`<span class="tpa-small-label">${['CONNECT','LEARN','CONTRIBUTE'][i]}</span><h4>${['Meet across disciplines','Share useful knowledge','Bring your experience'][i]}</h4><p>${['More perspectives. A wider network.','Ideas become opportunities.','Make something meaningful.'][i]}</p><span class="tpa-card-symbol">${['↔','✦','↗'][i]}</span>`));
$('[data-you-panel]').html(`<div class="tpa-contribution-card"><span class="tpa-small-label">START WITH A CONVERSATION</span><h4>What would you<br>like to contribute?</h4><p>Membership, an event or a potential collaboration—tell us how we can help.</p><button data-you-resolve type="button" aria-label="Preview contribution status">Share your perspective <span>↗</span></button><p data-you-open>Bring an idea. Ask a question.</p><p data-you-done class="opacity-0">Your next step is a conversation with TPA.</p><a href="/contact">Contact the association ↗</a></div>`);
$('[data-claude-panel]').html(`<div class="tpa-community-list"><strong>Ways to contribute</strong>${['Knowledge sharing','Professional collaboration','Community engagement'].map(s=>`<div data-claude-row><span>${s}</span><span data-claude-open>Explore</span><span data-claude-done>✓ Connect</span></div>`).join('')}<a href="/about">Explore our purpose ↗</a></div>`);

const audiences=[['Professionals','Connect across disciplines. Bring your experience, share perspectives and learn from the professional community around you.'],['Business leaders & entrepreneurs','Meet people who bring different perspectives. Find collaborators and make room for new possibilities.'],['The next generation','Bring your curiosity. Learn from shared experience and find a community for the next chapter of your journey.'],['People who want to contribute','Add your perspective to knowledge-sharing and community initiatives that create lasting value.']];
$('#who-its-for [data-reveal-heading]').text('Different paths. A shared possibility.').attr('aria-label','Different paths. A shared possibility.');
$('#who-its-for [data-reveal-intro]').text('For professionals, entrepreneurs and the next generation. There’s a place for your perspective here.');
$('#who-its-for .swiper-slide').each((i,e)=>{const p=$(e);p.find('article>p').eq(0).text(audiences[i][0]);p.find('article>p').eq(1).text(audiences[i][1]);p.find('img').attr('alt','Illustrative professional setting');});
$('#who-its-for').after('<div class="tpa-media-slot" data-media-slot></div>');

// The integration marquee becomes trusted reference links, without partner claims.
const institutions=[['ICAI','https://www.icai.org/'],['ICSI','https://www.icsi.edu/'],['Income Tax','https://www.incometax.gov.in/'],['GST','https://www.gst.gov.in/'],['MCA / ROC','https://www.mca.gov.in/'],['RBI','https://www.rbi.org.in/'],['SEBI','https://www.sebi.gov.in/'],['EPFO','https://www.epfindia.gov.in/']];
const marquee=`<div class="tpa-marquee" aria-label="Professional reference links">${[false,true].map((reverse)=>`<div class="tpa-marquee-viewport"><div class="${reverse?'animate-marquee-reverse':'animate-marquee'} tpa-marquee-track">${[...institutions,...institutions].map(([name,url])=>`<a href="${url}" target="_blank" rel="noopener noreferrer"><span class="tpa-institution-mark">${name.slice(0,2)}</span>${name}<span class="tpa-marquee-arrow">↗</span></a>`).join('')}</div></div>`).join('')}<p>Direct links to professional institutions and government portals.</p></div>`;
$('#integrations').remove();
$('#capabilities [data-reveal-eyebrow]').html(label('Knowledge, with context'));
$('#capabilities [data-reveal-heading]').text('A useful place to start. A wider world to explore.').attr('aria-label','A useful place to start. A wider world to explore.');
const capabilityData=[
 ['Events & learning','Meet. Learn. Participate.','Published seminars, workshops and discussions, with their details in one place.','/events','↗'],
 ['Professional resources','Useful knowledge. Thoughtfully shared.','Association insights, documents and trusted professional references.','/resources','✦'],
 ['Your member space','Your journey, together in one place.','Keep your professional profile, application and personal event history together.','/member','◎'],
 ['Membership','A place for your perspective.','Explore Patron, Annual and Life membership options and the shared application journey.','/membership','↔'],
 ['A conversation with TPA','Start with what’s on your mind.','Ask about membership, an event or a potential collaboration. No account needed for an inquiry.','/contact','✳'],
 ['People & purpose','A shared commitment to progress.','Learn about the association, its purpose and published leadership profiles.','/about','↗'],
 ['Responsible stewardship','A clear foundation.','Find published leadership information and approved governing documents when available.','/governance','◈'],
 ['Your next chapter','Bring your curiosity.','Find a membership that fits your professional journey.','/join','✦']
];
$('#capabilities .swiper-slide').each((i,e)=>{const [title,subtitle,text,href,symbol]=capabilityData[i],p=$(e),article=p.find('article');article.html(`<div class="tpa-capability-copy"><h3>${title}</h3><p>${subtitle}</p></div><div class="tpa-capability-art art-${i}">${i===1?`<div class="tpa-files-preview" data-files-visual>${filesVisual}</div>`:`<span class="tpa-capability-symbol">${symbol}</span><div class="tpa-capability-note"><span class="tpa-small-label">TPA · ${title.toUpperCase()}</span><p>${text}</p><a href="${href}">Explore ${title.toLowerCase()} ↗</a></div>`}</div>`);});
$('#capabilities .swiper-slide').eq(2).find('.tpa-capability-art').html(`<div data-compare-visual class="tpa-profile-compare"><div class="tpa-profile-layer"><span class="tpa-small-label">YOUR MEMBER SPACE</span><strong>Your professional<br>journey, together.</strong><span class="tpa-profile-row">Professional profile <b>◎</b></span><span class="tpa-profile-row">Application details <b>↗</b></span><span class="tpa-profile-row">Personal event records <b>✦</b></span></div><div data-compare-clip class="tpa-profile-layer tpa-profile-colored"><span class="tpa-small-label">A PRIVATE SPACE FOR YOUR TPA</span><strong>A wider perspective.<br>A clearer next step.</strong><span class="tpa-profile-row">Your profile <b>◎</b></span><span class="tpa-profile-row">Your application <b>↗</b></span><span class="tpa-profile-row">Your event history <b>✦</b></span></div><span data-compare-divider class="tpa-profile-divider" role="slider" tabindex="0" aria-label="Explore the member space illustration" aria-valuemin="0" aria-valuemax="100" aria-valuenow="52"></span></div>`);
$('#capabilities .swiper').before(marquee);
$('#capabilities a[href="https://app.layernote.io/register"]').attr('href','/resources').text('Explore resources ↗');
$('#capabilities').find('p').filter((_,e)=>$(e).text()==='And there is even more to discover.').text('One community. Many ways to take part.');

// Three verified membership categories, without invented fees or benefits.
$('#pricing [data-reveal-eyebrow]').html(label('Your next chapter'));
$('#pricing [data-reveal-heading]').text('There’s a place for you here.').attr('aria-label','There’s a place for you here.');
const pricingButtons=$('#pricing button');pricingButtons.eq(0).text('Membership options');pricingButtons.eq(1).text('How to apply');
const plans=[['Patron','Support the wider professional community.'],['Annual','A place for your professional journey.'],['Life','A lasting connection with the association.']];
$('#pricing h3').each((i,e)=>{const title=$(e);const target=title.parents().filter((_,a)=>$(a).find('ul').length===1&&$(a).find('h3').length===1).first();target.addClass('tpa-plan-card').attr('data-plan-card','');target.html(`<div class="tpa-plan-heading"><span class="tpa-small-label">TPA MEMBERSHIP</span><h3>${plans[i][0]}</h3>${i===1?'<span class="tpa-plan-pill">Find your place</span>':''}</div><div class="tpa-plan-front"><p class="tpa-plan-intro">${plans[i][1]}</p><span class="tpa-plan-status">Details to be confirmed</span><p class="tpa-plan-info">Plan fees, benefits and eligibility will follow the association’s confirmed membership rules.</p><ul>${bullets(['One shared application journey','Professional details and evidence','Association review before membership approval'])}</ul></div><div class="tpa-plan-back" hidden><span class="tpa-step-number">0${i+1}</span><h4>${['Create your account','Complete your application','Association review'][i]}</h4><p>${['Start with your TPA account. Account registration is separate from membership approval.','Choose a plan, add your details and share the required professional evidence.','Your application is reviewed by the association before approved membership is confirmed.'][i]}</p></div>${button('Start your application','/join')}`);});
$('#pricing').find('p').filter((_,e)=>$(e).text().includes('Need enterprise?')).html('Have a question about membership? <a href="/contact">Start a conversation ↗</a>');

// Preserve the testimonial cross-fade as association values, without fake quotes.
$('#testimonials [data-reveal-eyebrow]').html(label('Our shared purpose'));
$('#testimonials [data-reveal-heading]').text('Good people. Greater possibilities.').attr('aria-label','Good people. Greater possibilities.');
$('#testimonials .swiper-slide').each((i,e)=>$(e).html(`<div class="tpa-value-slide"><div class="tpa-value-art"><span>${i?'✦':'↔'}</span><span class="tpa-value-art-tag">${i?'SHARED KNOWLEDGE':'HUMAN CONNECTION'}</span></div><div><span class="tpa-small-label">OUR ${i?'MISSION':'VISION'}</span><h3 data-quote>${i?'Connect. Learn.<br>Collaborate. Grow.<br>Contribute.':'Individual strengths.<br>Collective progress.'}</h3><p>${i?'We connect professionals, encourage learning, facilitate collaboration, support contribution and create opportunities for growth.':'A vibrant, connected and progressive professional community where people, ideas and opportunities create lasting value.'}</p><a href="/about#section-1">Explore our purpose ↗</a></div></div>`));
$('#testimonials button[aria-label="Previous testimonial"]').attr('aria-label','Previous purpose');
$('#testimonials button[aria-label="Next testimonial"]').attr('aria-label','Next purpose');
$('#testimonials button[aria-label^="Go to"]').each((i,e)=>$(e).attr('aria-label',i?'Go to mission':'Go to vision'));

const faqs=[
 ['Who is TPA for?','TPA brings together professionals, business leaders, entrepreneurs and the next generation from Tollygunge and beyond. Different disciplines, shared curiosity and a commitment to collective growth.'],
 ['How do I become a member?','Start with your TPA account, choose a membership plan and complete your professional details and required evidence. Membership approval follows association review; creating an account does not automatically confer membership.'],
 ['What membership options are available?','TPA’s membership categories are Patron, Annual and Life. Confirmed eligibility, fees and benefits will be published by the association.'],
 ['Where can I find events and learning opportunities?','Published seminars, workshops and discussions appear in Events & Learning. Confirmed dates, speakers and registration details are shown with each published event.'],
 ['Can I contact TPA without an account?','Yes. You can send an inquiry about membership, an event or a potential collaboration without creating an account. Signed-in accounts can also track their own inquiries.'],
 ['What is in my member space?','Your private member space keeps your professional profile, membership application, documents and personal event records together. Staff access and member permissions remain separate.'],
 ['Where is the association based?','TPA is rooted in Tollygunge, Kolkata. Confirmed office details and visiting hours will be published here.'],
 ['How can I contribute?','Bring an idea, share your professional experience or ask about knowledge-sharing and community initiatives. Start a conversation with the association to explore what comes next.']
];
$('#faq button[aria-expanded]').each((i,e)=>{const b=$(e);b.children('span').first().text(faqs[i][0]);b.next('div').find('p').text(faqs[i][1]);});
$('#faq a[href^="mailto"]').attr('href','/contact').text('Reach out');
$('#cta [data-reveal-heading]').text('Your next chapter starts with a conversation.').attr('aria-label','Your next chapter starts with a conversation.');
$('#cta p').text('Bring your experience. Bring your curiosity. Find your place at TPA.');

// Contact remains a real original platform function, presented simply.
$('#cta').before(`<section id="connect" class="tpa-connect-section"><div><span class="tpa-small-label">LET’S CONNECT</span><h2 data-reveal-heading>Start a conversation.</h2><p>Membership, an event or a new collaboration—tell us how we can help.</p><div class="tpa-contact-links"><a href="/contact">Contact the association ↗</a><a href="/events">Explore events & learning ↗</a></div></div><div class="tpa-inquiry-slot" data-inquiry-slot></div></section>`);
$('footer').html(`<div class="tpa-footer-grid"><div><a href="/" aria-label="TPA home">${brand}</a><p>Tollygunge Professional Association.<br>Connect. Learn. Collaborate.<br>Grow. Contribute.</p></div><div><strong>Explore</strong><a href="/about">Our association</a><a href="/membership">Membership</a><a href="/events">Events & learning</a><a href="/resources">Resources</a></div><div><strong>Your TPA</strong><a href="/join">Start your application</a><a href="/login">Member login</a><a href="/governance">Governance</a><a href="/contact">Contact the association</a></div><div><strong>Rooted in Tollygunge</strong><p>Kolkata, India.<br>Open to new perspectives.</p><button type="button">Cookies</button></div></div><div class="tpa-footer-bottom"><span>© 2026 Tollygunge Professional Association</span><span>A shared commitment to progress.</span></div>`);
$('a[href="https://app.layernote.io/register"]').attr('href','/join').contents().filter((_,e)=>e.type==='text').first().replaceWith('Find your place at TPA');
$('a[href="https://app.layernote.io/api/auth/google"]').attr('href','/about').text('Get to know us ↗');
$('a[href="#the-solution"]').attr('href','#how-it-works');
$('a[href^="https://layernote.io"],a[href^="mailto"]').attr('href','/contact');
$('.tpa-files-preview img').remove();
$('.tpa-files-preview [data-file-card]').each((i,e)=>$(e).prepend(`<div class="tpa-resource-cover"><span>${['INSIGHT','GUIDE','NOTE','PDF','LINK'][i]}</span><strong>${['A wider perspective','Knowledge shared','Ideas that connect','Professional learning','Useful references'][i]}</strong><b>tpa·</b></div>`));
$('img').each((_,e)=>{const src=$(e).attr('src');if(src?.startsWith('/assets/'))$(e).attr('src','/theme'+src);});
$('link[href^="/assets/"]').each((_,e)=>$(e).attr('href','/theme'+$(e).attr('href')));
$('script[src="/interactions.js"]').attr('src','/theme/interactions.js');
$('link[href="/behaviors.css"]').attr('href','/theme/behaviors.css');
$('link[href="/tpa.css"]').attr('href','/theme/tpa.css');
$('[data-nimg]').removeAttr('data-nimg');
$('[data-cursor-marker],[data-cursor-reveal]').remove();
$('body *').contents().each((_,n)=>{if(n.type==='text'){n.data=n.data.replaceAll('Figma','Knowledge').replaceAll('layernote','TPA').replaceAll('Frames synced','Resources together').replaceAll('Start your free trial','Find your place at TPA').replaceAll('Calm','Good').replaceAll('operations','people.');}});
$('body>.skip-link').remove();
$('#cookie-banner>p').html('Essential browser storage remembers your display and cookie preferences. <a href="/contact">Questions about privacy? Contact TPA.</a>');
$('img').each((_,e)=>{if(!$(e).attr('alt'))$(e).attr('alt','');});
$('img[alt="Signed-in reviewer"]').attr('alt','Illustrative profile portrait');
$('[data-select-value]').css('color','#05131a');

// Replace the entire original plan column, including its former trial footer.
$('#pricing [data-plan-card]').each((_,e)=>{const card=$(e),outer=card.parent();if((outer.attr('class')||'').includes('justify-between')&&outer.find('[data-plan-card]').length===1){outer.replaceWith(card);}});
await fs.writeFile('theme/index.html',$.html());
const landing = load($.html());
landing('script').remove();
await fs.writeFile('theme/landing.html',landing('body').html());
await fs.mkdir('public/theme',{recursive:true});
await fs.cp('theme','public/theme',{recursive:true,filter:(p)=>!p.endsWith('reference.html')&&!p.endsWith('landing.html')});
console.log('Adapted LayerNote into TPA: '+$('main>section').length+' purposeful sections.');
