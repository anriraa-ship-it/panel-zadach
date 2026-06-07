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
    ideas: ['Геймификация задач','Виджет на экран']
  };

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
    save,
    reset(){ data = JSON.parse(JSON.stringify(seed)); save(); }
  };
})();
