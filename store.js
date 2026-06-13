/* ===== Панель Жизни — общее хранилище (localStorage) ===== */
const Store = (() => {
  const KEY = 'panel-zhizni-v1';
  const today = () => new Date().toISOString().slice(0,10);
  const plus = n => { const d=new Date(); d.setDate(d.getDate()+n); return d.toISOString().slice(0,10); };

  // данные по умолчанию (демо-наполнение при первом запуске)
  const seed = {
    tasks: [
      {id:1,text:'Согласовать макеты с арт-дирекшн',prio:'high',status:'prog',date:today(),time:'11:00',desc:'Финальная вычитка перед отправкой клиенту.',subs:[{t:'Собрать правки',d:true},{t:'Обновить прототип',d:false}],reminders:[10,60],repeat:'',linkGoal:'Запуск DesignFlow CRM',linkIdea:''},
      {id:2,text:'Ревью пул-реквеста по Kanban',prio:'mid',status:'plan',date:today(),time:'15:30',desc:'',subs:[],reminders:[10],repeat:'',linkGoal:'Запуск DesignFlow CRM',linkIdea:''},
      {id:3,text:'Тренировка',prio:'low',status:'plan',date:plus(1),time:'08:00',desc:'',subs:[],reminders:[0],repeat:'daily',linkGoal:'Здоровье 2026',linkIdea:''},
      {id:4,text:'Купить кофе и фильтры',prio:'low',status:'plan',date:plus(3),time:'',desc:'',subs:[],reminders:[],repeat:'',linkGoal:'',linkIdea:''},
      {id:5,text:'Прочитать про LexoRank',prio:'low',status:'plan',date:'',time:'',desc:'',subs:[],reminders:[],repeat:'',linkGoal:'',linkIdea:'Геймификация задач'},
      {id:6,text:'Утренняя зарядка',prio:'low',status:'done',date:today(),time:'07:30',desc:'',subs:[],reminders:[0],repeat:'daily',linkGoal:'Здоровье 2026',linkIdea:''}
    ],
    goals: ['Запуск DesignFlow CRM','Английский B2','Здоровье 2026'],
    ideas: ['Геймификация задач','Виджет на экран'],
    projects: [
      {id:1,name:'Кухня Виявир',color:'plan',cover:null,desc:'Референсы и съёмка проекта',media:[],links:[{title:'Pinterest доска',url:'https://pinterest.com'}],created:today()},
      {id:2,name:'Ремонт квартиры',color:'note',cover:null,desc:'',media:[],links:[],created:today()}
    ],
    // ===== Финансы: бюджет поездки + траты по датам =====
    // budget.total — дневной фонд (еда/досуг…), делится на дни; sep — отдельный счёт (транспорт/бензин/дороги)
    // exp[YYYY-MM-DD] = [{c:категория, n:название, a:сумма, t:'чч:мм', off:вне_дневного_бюджета, booking:id_брони}]
    finance: { budget:{total:0,start:'',end:'',sep:0,title:'Поездка',flag:''}, exp:{} }
  };


  // ===== медиа-хранилище (IndexedDB) для фото/видео =====
  const Media = (() => {
    const DB='panel-zhizni-media', STORE='blobs';
    let _db=null;
    function open(){
      return new Promise((res,rej)=>{
        if(_db) return res(_db);
        const r=indexedDB.open(DB,1);
        r.onupgradeneeded=()=>{const db=r.result; if(!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);};
        r.onsuccess=()=>{_db=r.result;res(_db)};
        r.onerror=()=>rej(r.error);
      });
    }
    async function put(key,blob){const db=await open();return new Promise((res,rej)=>{const tx=db.transaction(STORE,'readwrite');tx.objectStore(STORE).put(blob,key);tx.oncomplete=()=>res(key);tx.onerror=()=>rej(tx.error)})}
    async function get(key){const db=await open();return new Promise((res,rej)=>{const tx=db.transaction(STORE,'readonly');const rq=tx.objectStore(STORE).get(key);rq.onsuccess=()=>res(rq.result||null);rq.onerror=()=>rej(rq.error)})}
    async function del(key){const db=await open();return new Promise((res,rej)=>{const tx=db.transaction(STORE,'readwrite');tx.objectStore(STORE).delete(key);tx.oncomplete=()=>res();tx.onerror=()=>rej(tx.error)})}
    // сжатие изображения: ужимаем по большей стороне до maxSide, JPEG quality
    function compress(file,maxSide=1600,quality=0.82){
      return new Promise((res)=>{
        if(!file.type.startsWith('image/')){res(file);return;} // видео не трогаем
        const img=new Image();const url=URL.createObjectURL(file);
        img.onload=()=>{
          let{width:w,height:h}=img;
          if(Math.max(w,h)>maxSide){const k=maxSide/Math.max(w,h);w=Math.round(w*k);h=Math.round(h*k);}
          const cv=document.createElement('canvas');cv.width=w;cv.height=h;
          cv.getContext('2d').drawImage(img,0,0,w,h);
          URL.revokeObjectURL(url);
          cv.toBlob(b=>res(b||file),'image/jpeg',quality);
        };
        img.onerror=()=>{URL.revokeObjectURL(url);res(file)};
        img.src=url;
      });
    }
    return {put,get,del,compress};
  })();

  let data;
  try { data = JSON.parse(localStorage.getItem(KEY)) || seed; }
  catch(e){ data = seed; }

  function save(){ try{ localStorage.setItem(KEY, JSON.stringify(data)); }catch(e){} }

  return {
    today, plus,
    get tasks(){ return data.tasks; },
    set tasks(v){ data.tasks = v; save(); },
    get goals(){ return data.goals; },
    get ideas(){ return data.ideas; },
    get projects(){ return data.projects; },
    set projects(v){ data.projects = v; save(); },
    get finance(){ if(!data.finance){ data.finance = {budget:{total:0,start:'',end:'',sep:0,title:'Поездка',flag:''}, exp:{}}; save(); } return data.finance; },
    set finance(v){ data.finance = v; save(); },
    save,
    reset(){ data = JSON.parse(JSON.stringify(seed)); save(); },
    Media
  };
})();
