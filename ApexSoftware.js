
const PREFERS_REDUCED_MOTION = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

(function(){
  const splash=document.getElementById('splash-screen');
  if(!splash) return;

  if(sessionStorage.getItem('apex-splash-shown')){
    splash.style.display='none';
    return;
  }

  document.body.style.overflow='hidden';
  const DURATION=PREFERS_REDUCED_MOTION ? 900 : 5000;

  function dismiss(){
    splash.classList.add('hide');
    document.body.style.overflow='';
    sessionStorage.setItem('apex-splash-shown','1');
    setTimeout(()=>{ splash.style.display='none'; },650);
  }

  const timer=setTimeout(dismiss,DURATION);
  splash.addEventListener('click',()=>{ clearTimeout(timer); dismiss(); });
})();

if(typeof THREE!=='undefined' && !PREFERS_REDUCED_MOTION){
try{
(function(){
  const canvas = document.getElementById('canvas3d');
  const renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:true});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, .1, 1000);
  camera.position.set(0,0,18);

  const count=1400;
  const pos=new Float32Array(count*3);
  for(let i=0;i<count*3;i++) pos[i]=(Math.random()-.5)*65;
  const geo=new THREE.BufferGeometry();
  geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
  const mat=new THREE.PointsMaterial({color:0x4F6EF7,size:.1,transparent:true,opacity:.55});
  scene.add(new THREE.Points(geo,mat));

  const cubes=[];
  const cbgeo=new THREE.BoxGeometry(1,1,1);
  const cols=[0x4F6EF7,0x7C3AED,0x06B6D4,0xF59E0B];
  for(let i=0;i<20;i++){
    const edges=new THREE.EdgesGeometry(cbgeo);
    const lm=new THREE.LineBasicMaterial({color:cols[i%4],transparent:true,opacity:.25});
    const c=new THREE.LineSegments(edges,lm);
    const s=.4+Math.random()*1.3;
    c.scale.set(s,s,s);
    c.position.set((Math.random()-.5)*30,(Math.random()-.5)*20,(Math.random()-.5)*10-6);
    c.userData={rx:(Math.random()-.5)*.01,ry:(Math.random()-.5)*.013,vy:(Math.random()-.5)*.005};
    scene.add(c); cubes.push(c);
  }

  const icogeo=new THREE.IcosahedronGeometry(3.5,1);
  const icoedge=new THREE.EdgesGeometry(icogeo);
  const icomat=new THREE.LineBasicMaterial({color:0x4F6EF7,transparent:true,opacity:.1});
  const ico=new THREE.LineSegments(icoedge,icomat);
  scene.add(ico);

  let mouse={x:0,y:0};
  document.addEventListener('mousemove',e=>{
    mouse.x=(e.clientX/window.innerWidth-.5)*2;
    mouse.y=-(e.clientY/window.innerHeight-.5)*2;
  });

  function animate(){
    requestAnimationFrame(animate);
    ico.rotation.x+=.0018; ico.rotation.y+=.0025;
    camera.position.x+=(mouse.x*3-camera.position.x)*.02;
    camera.position.y+=(mouse.y*2-camera.position.y)*.02;
    camera.lookAt(0,0,0);
    cubes.forEach(c=>{
      c.rotation.x+=c.userData.rx;
      c.rotation.y+=c.userData.ry;
      c.position.y+=c.userData.vy;
      if(c.position.y>13) c.position.y=-13;
      if(c.position.y<-13) c.position.y=13;
    });
    renderer.render(scene,camera);
  }
  animate();

  window.addEventListener('resize',()=>{
    camera.aspect=window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth,window.innerHeight);
  });
})();
}catch(e){console.warn('Hero 3D background skipped:',e);}
}

if(typeof THREE!=='undefined' && !PREFERS_REDUCED_MOTION){
try{
(function(){
  const canvas=document.getElementById('cube-canvas');
  if(!canvas) return;
  const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
  renderer.setSize(400,400);
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(45,1,.1,100);
  camera.position.set(6,5,8); camera.lookAt(0,0,0);

  const geo=new THREE.BoxGeometry(3,3,3);
  const mat=new THREE.MeshStandardMaterial({color:0x4F6EF7,metalness:.8,roughness:.2,transparent:true,opacity:.85});
  const cube=new THREE.Mesh(geo,mat);
  scene.add(cube);
  scene.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo),new THREE.LineBasicMaterial({color:0x7C9EFF})));

  const orbits=[];
  [0x06B6D4,0x7C3AED,0xF59E0B].forEach((c,i)=>{
    const s=new THREE.Mesh(
      new THREE.SphereGeometry(.22,16,16),
      new THREE.MeshStandardMaterial({color:c,emissive:c,emissiveIntensity:.4})
    );
    s.userData={r:2.8+i*.5,speed:.4+i*.2,angle:i*(Math.PI*2/3)};
    scene.add(s); orbits.push(s);
    const ring=new THREE.Mesh(
      new THREE.TorusGeometry(2.8+i*.5,.015,8,60),
      new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:.2})
    );
    ring.rotation.x=i*.4; ring.rotation.z=i*.3;
    scene.add(ring);
  });

  scene.add(new THREE.AmbientLight(0xffffff,.3));
  const pl=new THREE.PointLight(0x4F6EF7,2,20); pl.position.set(5,5,5); scene.add(pl);
  const pl2=new THREE.PointLight(0x7C3AED,1.5,20); pl2.position.set(-5,-3,5); scene.add(pl2);

  let t=0;
  function animate(){
    requestAnimationFrame(animate); t+=.016;
    cube.rotation.x+=.005; cube.rotation.y+=.008;
    orbits.forEach(s=>{
      s.userData.angle+=s.userData.speed*.016;
      s.position.x=Math.cos(s.userData.angle)*s.userData.r;
      s.position.y=Math.sin(s.userData.angle*.7)*1.2;
      s.position.z=Math.sin(s.userData.angle)*s.userData.r*.8;
    });
    pl.position.x=Math.sin(t)*6; pl.position.z=Math.cos(t)*6;
    renderer.render(scene,camera);
  }
  animate();
})();
}catch(e){console.warn('About 3D cube skipped:',e);}
}

let worksSwiper=null;
function initWorksSwiper(){
  if(typeof Swiper==='undefined') return;
  try{
    if(worksSwiper){ worksSwiper.destroy(true,true); worksSwiper=null; }
    worksSwiper=new Swiper('.works-swiper',{
      loop:true,
      effect:'flip',
      flipEffect:{slideShadows:true,limitRotation:true},
      grabCursor:true,
      spaceBetween:0,
      speed:900,
      autoplay:{delay:2800,disableOnInteraction:false,pauseOnMouseEnter:true},
      pagination:{el:'.swiper-pagination',clickable:true},
      observer:true,
      observeParents:true
    });
    worksSwiper.on('slideChangeTransitionStart',()=>{
      const book=document.querySelector('.works-swiper');
      if(!book) return;
      book.classList.remove('turning-next','turning-prev');
      void book.offsetWidth;
      const direction=book.dataset.turnDirection || (worksSwiper.touches.diff <= 0 ? 'next':'prev');
      book.classList.add(direction==='next'?'turning-next':'turning-prev');
      book.removeAttribute('data-turn-direction');
    });
    worksSwiper.on('slideChangeTransitionEnd',()=>{
      document.querySelector('.works-swiper')?.classList.remove('turning-next','turning-prev');
    });
    document.querySelector('.works-swiper .swiper-button-next')?.addEventListener('click',()=>{
      document.querySelector('.works-swiper')?.setAttribute('data-turn-direction','next');
      worksSwiper.slideNext();
    });
    document.querySelector('.works-swiper .swiper-button-prev')?.addEventListener('click',()=>{
      document.querySelector('.works-swiper')?.setAttribute('data-turn-direction','prev');
      worksSwiper.slidePrev();
    });
  }catch(e){console.warn('Swiper init skipped:',e);}
}
initWorksSwiper();

const obs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('visible'); });
},{threshold:.1});
document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));

function runCounters(){
  document.querySelectorAll('[data-count]').forEach(el=>{
    const target=+el.dataset.count;
    const suffix=el.dataset.suffix||'';
    let cur=0; const inc=target/55;
    const t=setInterval(()=>{
      cur+=inc; if(cur>=target){cur=target;clearInterval(t);}
      el.textContent=Math.floor(cur)+suffix;
    },18);
  });
}
new IntersectionObserver(entries=>{
  entries.forEach(e=>{ if(e.isIntersecting){runCounters();} });
},{threshold:.5}).observe(document.querySelector('.stats-bar'));

window.addEventListener('scroll',()=>{
  const n=document.getElementById('main-nav');
  n.classList.toggle('scrolled', window.scrollY>60);
});

(function(){
  const btn=document.getElementById('menu-btn');
  const menu=document.getElementById('mobile-menu');
  const overlay=document.getElementById('mobile-menu-overlay');
  if(!btn||!menu||!overlay) return;

  function openMenu(){
    menu.classList.add('open'); overlay.classList.add('open');
    btn.classList.add('active'); btn.setAttribute('aria-expanded','true');
    document.body.style.overflow='hidden';
  }
  function closeMenu(){
    menu.classList.remove('open'); overlay.classList.remove('open');
    btn.classList.remove('active'); btn.setAttribute('aria-expanded','false');
    document.body.style.overflow='';
  }
  btn.addEventListener('click',()=>{
    menu.classList.contains('open') ? closeMenu() : openMenu();
  });
  overlay.addEventListener('click', closeMenu);
  menu.querySelectorAll('a').forEach(a=>a.addEventListener('click', closeMenu));
  window.addEventListener('resize',()=>{ if(window.innerWidth>1100) closeMenu(); });
})();

const T={
  ar:{
    doc_title:"Apex Software",
    nav_home:"الرئيسية",nav_about:"من نحن",nav_products:"منتجاتنا",
    nav_services:"خدماتنا",nav_works:"أعمالنا",nav_testimonials:"آراء العملاء",nav_contact:"اتصل بنا",nav_subs:"تعاقد الآن",
    hero_desc:"نحن لا نبرمج مجرد أنظمة، بل نصنع المحركات الذكية التي تقود الشركات نحو المستقبل",
    hero_btn:"تعاقد الآن",
    about_title:"من نحن",
    about_desc:"تأسست شركة APEX SOFTWARE برؤية طموحة على أيدي مهندسين مصريين يمتلكون خبرة تمتد لأكثر من 6 سنوات في قطاع تكنولوجيا المعلومات وتطوير البرمجيات. نحن فخورون بكوننا شركة مصرية تقدم حلولاً برمجية وأنظمة سحابية متكاملة (ERP, CRM, POS) بمواصفات عالمية، مصممة خصيصاً لتمكين الشركات من إدارة عملياتها بكفاءة وسلاسة. نؤمن بأن نجاح عملائنا هو معيار نمونا.",
    ab1:"حلول سحابية متكاملة بمواصفات عالمية",ab2:"أعلى معايير الأمان والدعم الفني المستمر",
    ab3:"فريق من المهندسين المصريين المتخصصين",ab4:"أنظمة مخصصة تلائم احتياجات سوق B2B",
    products_title:"منتجاتنا",products_subtitle:"حلول برمجية متكاملة ومخصصة لتلبية احتياجات سوق العمل B2B",
    erp_desc:"نظام متكامل لإدارة موارد المؤسسات، الحسابات العامة، المشتريات، والمخازن برؤية تحليلية دقيقة تساعدك على اتخاذ القرار.",
    crm_desc:"أداة ذكية لمتابعة عملائك، إدارة المبيعات، وتنظيم حركات الاتصال والدعم الفني لبناء علاقات مستدامة ومربحة.",
    pos_desc:"نظام نقاط البيع السريع لإدارة الكاشير، الفواتير، وحسابات المستودعات الفورية المتوافقة مع أحدث المتطلبات.",
    talip_desc:"نظام متكامل لإدارة سناتر الدروس وشؤون الطلاب، مع تسجيل الحضور اليومي وتقارير التقييمات أولاً بأول.",
    subs_now:"اطلب عرض سعر ←",
    process_title:"كيف نعمل",
    process_subtitle:"رحلة واضحة من الفكرة إلى الإطلاق، خطوة بخطوة",
    process1_title:"استشارة وتحليل",process1_desc:"بنسمع احتياجاتك ونحلل تحديات عملك عشان نحدد الحل الأنسب لشركتك.",
    process2_title:"تصميم وتخطيط",process2_desc:"نصمم واجهة وتجربة استخدام مريحة، ونرسم خطة تقنية واضحة قبل بداية التنفيذ.",
    process3_title:"تطوير وبناء",process3_desc:"فريقنا بيحول التصميم لنظام شغال فعليًا، مع تحديثات دورية أول بأول.",
    process4_title:"تسليم ودعم مستمر",process4_desc:"إطلاق النظام مع تدريب فريقك، ودعم فني مستمر بعد التسليم.",
    services_title:"خدماتنا",
    svc1_title:"تطوير البرمجيات والأنظمة المخصصة",
    svc1_desc:"نحول أفكار عملك إلى واقع رقمي متكامل — سيستم إداري، منصة خدمات، أو موقع ويب احترافي من الصفر بأحدث التقنيات السحابية.",
    svc2_title:"تطوير تطبيقات الموبايل",svc2_desc:"تطبيقات iOS و Android بأعلى معايير الأداء والتصميم — من الفكرة حتى النشر على المتاجر.",
    svc3_title:"تصميم وتطوير مواقع الويب",svc3_desc:"مواقع احترافية سريعة ومتجاوبة مع جميع الأجهزة — تجارة إلكترونية، مواقع شركات، ومنصات SaaS.",
    contact_now:"تواصل معنا ←",
    works_tag:"قصص نجاحنا",
    works_title:"آخر الأعمال",
    works_subtitle:"مشروعات صنعت فرقًا حقيقيًا لعلامات وشركات في مختلف المجالات",
    work_service_label:"الخدمة المقدمة",
    work1_sector:"تصنيع وتجارة الأدوية والمبيدات الزراعية",
    work1_service:"Apex ERB مستخدم لبرنامج ",
    work2_title:"السعيد ماركت",
    work2_sector:"سلسلة محلات تجارة المواد الغذائية",
    work2_service:"Apex ERB مستخدم لبرنامج ",
    work3_sector:"مركز غسيل وصيانة السيارات",
    work3_service:"Apex ERB مستخدم لبرنامج ",
    work4_title:"سنتر أ/ محمود حسن",
    work4_sector:"سنتر دروس متخصص في مادة الكيمياء",
    work4_service:"Talip مستخدم لبرنامج ",
    work5_title:"عمران للمقاولات",
    work5_sector:"مقاولات وإنشاءات",
    work5_service:"Apex ERB مستخدم لبرنامج ",
    work6_title:"طاسة",
    work6_sector:"مطاعم وتوصيل طلبات",
    work6_service:"Apex POS مستخدم لبرنامج ",
    work7_title:"مجمع الشفاء الطبي",
    work7_sector:"مجمع عيادات طبية",
    work7_service:"نظام CRM لإدارة حجوزات ومتابعة المرضى",
    work8_title:"لمسة",
    work8_sector:"تجارة تجزئة - مستحضرات تجميل",
    work8_service:"نظام نقاط بيع (POS) متكامل للفروع",
    work9_title:"النخبة العقارية",
    work9_sector:"تسويق وسمسرة عقارية",
    work9_service:"تصميم وتطوير موقع إلكتروني لعرض الوحدات العقارية",
    work10_service:"تطوير نظام ERP لإدارة المشروعات والمخازن",
    work11_service:"تصميم وتطوير موقع إلكتروني لعرض المنتجات وإدارة الطلبات",
    testimonials_title:"آراء عملائنا",
    testimonials_subtitle:"ثقة عملائنا هي أكبر دليل على جودة شغلنا",
    t1_quote:"تعاملنا مع Apex Software في تطوير نظام إدارة المخزون، والفريق كان محترف جدًا من أول استشارة لحد التسليم. النظام سهّل علينا متابعة الفروع بشكل كبير.",
    t1_name:"محمد عبد الرحمن",t1_role:"صاحب سلسلة محلات تجارية",t1_initial:"م",
    t2_quote:"موقعنا الجديد اللي عملهولنا فريق Apex غيّر شكل تواصلنا مع عملائنا تمامًا. تصميم عصري وسريع، والدعم الفني بعد التسليم ممتاز.",
    t2_name:"سارة الشريف",t2_role:"مديرة تسويق",t2_initial:"س",
    t3_quote:"نظام Talip ساعدنا كسنتر تعليمي نتابع حضور وتقييمات الطلاب بشكل رقمي بالكامل، ووفر علينا وقت ومجهود كبير كان بيروح في الورق.",
    t3_name:"أ. محمود حسن",t3_role:"مدير سنتر تعليمي",t3_initial:"أ",
    contact_title:"اتصل بنا",address_title:"العنوان",address_desc:"العاشر من رمضان، الشرقية، مصر",
    phone_title:"الهاتف",mail_title:"البريد الإلكتروني",
    subs_title:"تعاقد الآن",
    hire_title:"تعاقد الآن",
    hire_sub:"اكتب تفاصيل مشروعك أو استفسارك وابعتها لينا مباشرة على الواتساب وهنرد عليك في أسرع وقت",
    hire_placeholder:"اكتب رسالتك هنا... مثال: عايز اطلب نظام APEX ERP لشركتي",
    hire_send:"إرسال عبر واتساب",
    cta_title:'جاهز لتحويل <span class="gradient-word">أعمالك رقمياً؟</span>',
    cta_sub:"تواصل معنا اليوم واحصل على استشارة مجانية لاختيار الحل الأنسب لشركتك.",
    stat_proj:"مشروع منجز",stat_sat:"رضا العملاء",stat_yrs:"سنوات خبرة",stat_sup:"دعم فني مستمر",
    f_tagline:"نحن لا نبرمج مجرد أنظمة، بل نصنع المحركات الذكية التي تقود الشركات نحو المستقبل.",
    f_prod:"منتجاتنا",f_svc:"خدماتنا",f_contact:"تواصل معنا",
    footer_text:"جميع الحقوق محفوظة &copy; {YEAR} لـ <strong>Apex Software</strong>",
    footer_loc:"العاشر من رمضان · مصر",
    btn_text:"English"
  },
  en:{
    doc_title:"Apex Software",
    nav_home:"Home",nav_about:"About Us",nav_products:"Our Products",
    nav_services:"Services",nav_works:"Last Works",nav_testimonials:"Testimonials",nav_contact:"Contact Us",nav_subs:"Contract Now",
    hero_desc:"We don't just program systems — we craft the smart engines that drive companies toward the future.",
    hero_btn:"Contract Now",
    about_title:"About Us",
    about_desc:"APEX SOFTWARE was founded with an ambitious vision by expert Egyptian engineers with over 6 years of experience in software development and IT solutions. We deliver world-class cloud systems (ERP, CRM, POS) tailored to empower businesses to manage their operations seamlessly. We believe our clients' success is the true measure of our growth.",
    ab1:"World-class integrated cloud solutions",ab2:"Highest security standards and continuous support",
    ab3:"Team of specialized Egyptian engineers",ab4:"Custom systems tailored to B2B market needs",
    products_title:"Our Products",products_subtitle:"Integrated and customized software solutions to meet B2B market needs",
    erp_desc:"An integrated ERP system for managing enterprise resources, accounts, procurement, and warehouses with precise analytical insights to support decision-making.",
    crm_desc:"A smart tool to follow up with your clients, manage sales, and organize communications and technical support to build sustainable and profitable relationships.",
    pos_desc:"A fast point-of-sale system for managing cashier operations, invoices, and instant warehouse accounts compliant with the latest requirements.",
    talip_desc:"An integrated system for managing tutoring centers and student affairs, with daily attendance tracking and instant evaluation reports.",
    subs_now:"Get a Quote ←",
    process_title:"How We Work",
    process_subtitle:"A clear journey from idea to launch, step by step",
    process1_title:"Consultation & Analysis",process1_desc:"We listen to your needs and analyze your business challenges to define the right solution.",
    process2_title:"Design & Planning",process2_desc:"We design a smooth UX/UI and lay out a clear technical roadmap before development starts.",
    process3_title:"Development & Build",process3_desc:"Our team turns the design into a working system, with regular progress updates.",
    process4_title:"Delivery & Ongoing Support",process4_desc:"We launch the system, train your team, and provide continuous technical support.",
    services_title:"Our Services",
    svc1_title:"Custom Software & Systems Development",
    svc1_desc:"We turn your business requirements into an integrated digital reality — admin system, service platform, or professional website from scratch using the latest cloud technologies.",
    svc2_title:"Mobile App Development",svc2_desc:"iOS & Android apps built to the highest standards of performance and design — from idea to App Store deployment.",
    svc3_title:"Web Design & Development",svc3_desc:"Fast, professional, fully responsive websites — e-commerce, corporate sites, and SaaS platforms.",
    contact_now:"Contact Us →",
    works_tag:"Our Success Stories",
    works_title:"Last Works",
    works_subtitle:"Projects that made a real difference for brands and businesses",
    work_service_label:"Service provided",
    work1_sector:"Pharmaceuticals & Agricultural Pesticides Manufacturing",
    work1_service:"Logo design and a company landing page",
    work2_title:"El Saeed Market",
    work2_sector:"Grocery & Food Retail Chain",
    work2_service:"Logo design and brand color guide for the chain",
    work3_sector:"Car Wash & Maintenance Center",
    work3_service:"Brand logo design",
    work4_title:"Mahmoud Hassan Center",
    work4_sector:"Tutoring Center Specialized in Chemistry",
    work4_service:"Logo design and the Talip center-management system",
    work5_title:"Omran Contracting",
    work5_sector:"Construction & Contracting",
    work5_service:"ERP system for project and warehouse management",
    work6_title:"Tasa",
    work6_sector:"Restaurants & Food Delivery",
    work6_service:"Food ordering mobile app (iOS & Android)",
    work7_title:"Al-Shifa Medical Complex",
    work7_sector:"Medical Clinics Complex",
    work7_service:"CRM system for patient bookings and follow-up",
    work8_title:"Lamsa",
    work8_sector:"Cosmetics & Beauty Retail",
    work8_service:"Integrated point-of-sale (POS) system for branches",
    work9_title:"Al-Nokhba Realty",
    work9_sector:"Real Estate Marketing & Brokerage",
    work9_service:"Website design and development for property listings",
    work10_service:"ERP system development for projects and inventory management",
    work11_service:"Website design and development for product and order management",
    testimonials_title:"What Our Clients Say",
    testimonials_subtitle:"Our clients' trust is the biggest proof of our work quality",
    t1_quote:"We worked with Apex Software on an inventory management system, and the team was highly professional from the first consultation to delivery. The system made tracking our branches so much easier.",
    t1_name:"Mohamed Abdelrahman",t1_role:"Retail Chain Owner",t1_initial:"M",
    t2_quote:"Our new website by the Apex team completely transformed how we connect with our customers. Modern, fast design, and excellent support after delivery.",
    t2_name:"Sara El-Sherif",t2_role:"Marketing Manager",t2_initial:"S",
    t3_quote:"The Talip system helped our tutoring center fully digitize attendance and student evaluations, saving us huge amounts of time that used to go into paperwork.",
    t3_name:"Mahmoud Hassan",t3_role:"Educational Center Director",t3_initial:"M",
    contact_title:"Contact Us",address_title:"Address",address_desc:"10th of Ramadan, Sharqia, Egypt",
    phone_title:"Phone",mail_title:"E-Mail",
    subs_title:"Contract Now",
    hire_title:"Contract Now",
    hire_sub:"Tell us about your project or inquiry and send it straight to us on WhatsApp — we'll reply as fast as possible.",
    hire_placeholder:"Write your message here... e.g. I'd like to request the APEX ERP system for my company",
    hire_send:"Send via WhatsApp",
    cta_title:'Ready to <span class="gradient-word">Go Digital?</span>',
    cta_sub:"Contact us today for a free consultation to choose the right solution for your company.",
    stat_proj:"Projects Delivered",stat_sat:"Client Satisfaction",stat_yrs:"Years Experience",stat_sup:"24/7 Support",
    f_tagline:"We don't just program systems — we craft the smart engines that drive companies toward the future.",
    f_prod:"Products",f_svc:"Services",f_contact:"Contact",
    footer_text:"All Rights Reserved &copy; {YEAR} for <strong>Apex Software</strong>",
    footer_loc:"10th of Ramadan · Egypt",
    btn_text:"العربية"
  }
};

function setLang(lang){
  document.querySelectorAll('[data-key]').forEach(el=>{
    const k=el.getAttribute('data-key');
    if(T[lang]&&T[lang][k]!==undefined){
      if(['cta_title'].includes(k)) el.innerHTML=T[lang][k];
      else el.textContent=T[lang][k];
    }
  });
  document.querySelectorAll('[data-key-placeholder]').forEach(el=>{
    const k=el.getAttribute('data-key-placeholder');
    if(T[lang]&&T[lang][k]!==undefined) el.setAttribute('placeholder',T[lang][k]);
  });
  const ft=document.getElementById('footer-text');
  if(ft) ft.innerHTML=T[lang].footer_text.replace('{YEAR}', new Date().getFullYear());
  const fl=document.getElementById('footer-loc');
  if(fl) fl.textContent=T[lang].footer_loc;
  document.documentElement.dir=lang==='ar'?'rtl':'ltr';
  document.documentElement.lang=lang;
  document.getElementById('lang-btn').textContent=T[lang].btn_text;
  document.title=T[lang].doc_title;
  localStorage.setItem('apex-lang',lang);
  setTimeout(initWorksSwiper,50);
}
document.getElementById('lang-btn').addEventListener('click',()=>{
  setLang(document.documentElement.lang==='ar'?'en':'ar');
});

function setTheme(theme){
  document.documentElement.setAttribute('data-theme',theme);
  const icon=document.getElementById('theme-icon');
  if(icon) icon.className = theme==='light' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  localStorage.setItem('apex-theme',theme);
}
document.getElementById('theme-btn').addEventListener('click',()=>{
  const cur=document.documentElement.getAttribute('data-theme')==='light' ? 'light':'dark';
  setTheme(cur==='dark' ? 'light' : 'dark');
});

window.addEventListener('DOMContentLoaded',()=>{
  setLang(localStorage.getItem('apex-lang')||'ar');
  setTheme(localStorage.getItem('apex-theme')||'dark');
});

window.addEventListener('load',()=>{
  const sp=document.querySelector('spline-viewer');
  if(sp) setTimeout(()=>{
    const sr=sp.shadowRoot;
    if(sr){const l=sr.querySelector('#logo')||sr.querySelector('.logo')||sr.querySelector('a');if(l)l.style.display='none';}
  },1500);
});

(function(){
  const btn=document.getElementById('hire-send-btn');
  const box=document.getElementById('hire-message');
  if(!btn||!box) return;
  const WHATSAPP_NUMBER='201009758342';
  btn.addEventListener('click',()=>{
    const msg=box.value.trim();
    if(!msg){
      box.focus();
      box.classList.add('shake');
      setTimeout(()=>box.classList.remove('shake'),500);
      return;
    }
    const url='https://wa.me/'+WHATSAPP_NUMBER+'?text='+encodeURIComponent(msg);
    window.open(url,'_blank');
  });
})();

(function(){
  if(window.matchMedia && window.matchMedia('(pointer:coarse)').matches) return; if(PREFERS_REDUCED_MOTION) return; const canvas=document.createElement('canvas');
  canvas.id='cursor-fx';
  canvas.style.cssText='position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:9999;';
  document.body.appendChild(canvas);
  const ctx=canvas.getContext('2d');

  function resize(){ canvas.width=window.innerWidth; canvas.height=window.innerHeight; }
  resize();
  window.addEventListener('resize',resize);

  const colors=['79,110,247','124,58,237','6,182,212'];
  let ripples=[];
  let glow={x:window.innerWidth/2,y:window.innerHeight/2};
  let target={x:glow.x,y:glow.y};
  let lastSpawn=0;
  let idle=true;

  window.addEventListener('mousemove',e=>{
    target.x=e.clientX; target.y=e.clientY;
    idle=false;
    const now=performance.now();
    if(now-lastSpawn>55){
      ripples.push({
        x:e.clientX,y:e.clientY,r:2,
        alpha:.28,
        color:colors[Math.floor(Math.random()*colors.length)]
      });
      lastSpawn=now;
    }
  });
  window.addEventListener('mouseleave',()=>{ idle=true; });

  function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);

    glow.x+=(target.x-glow.x)*.12;
    glow.y+=(target.y-glow.y)*.12;
    if(!idle){
      const g=ctx.createRadialGradient(glow.x,glow.y,0,glow.x,glow.y,90);
      g.addColorStop(0,'rgba(79,110,247,.12)');
      g.addColorStop(1,'rgba(79,110,247,0)');
      ctx.fillStyle=g;
      ctx.beginPath();ctx.arc(glow.x,glow.y,90,0,Math.PI*2);ctx.fill();
    }

    ripples.forEach(r=>{
      ctx.beginPath();
      ctx.strokeStyle=`rgba(${r.color},${r.alpha})`;
      ctx.lineWidth=1.4;
      ctx.arc(r.x,r.y,r.r,0,Math.PI*2);
      ctx.stroke();
      r.r+=1.6;
      r.alpha*=.93;
    });
    ripples=ripples.filter(r=>r.alpha>.02);

    requestAnimationFrame(draw);
  }
  draw();
})();