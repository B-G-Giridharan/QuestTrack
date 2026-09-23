const KEY="questtrack-v1";
const goals=[
 {id:"fitness",emoji:"🏋️",name:"Fitness",desc:"Train consistently and track movement."},
 {id:"money",emoji:"💰",name:"Money / Savings",desc:"Build better financial habits."},
 {id:"learning",emoji:"🧠",name:"Learning",desc:"Turn study time into visible progress."},
 {id:"building",emoji:"🛠️",name:"Building / Creating",desc:"Ship useful things instead of waiting."},
 {id:"quitting",emoji:"🚫",name:"Habit Quitting",desc:"Reduce one pattern that holds you back."},
 {id:"writing",emoji:"✍️",name:"Writing",desc:"Keep your words moving every day."},
 {id:"other",emoji:"✨",name:"Something Else",desc:"Define a quest that fits you."}
];
const quotes=[
 "Small actions compound into a visible life.",
 "Your streak is evidence, not pressure.",
 "Make today count, then make tomorrow easier.",
 "Consistency beats intensity when the goal is long-term."
];
const basePosts=[
 {id:"p1",name:"Maya Chen",handle:"mayac",avatar:"MC",category:"Building",streak:12,time:"18m",body:"Shipped the first working version of my study planner today. It is not pretty yet, but it is real.",likes:24,comments:6},
 {id:"p2",name:"Arjun Rao",handle:"arjunr",avatar:"AR",category:"Learning",streak:31,time:"52m",body:"Finished 45 minutes of systems design notes before work. Keeping the daily target intentionally boring this week.",likes:18,comments:4,bookmarked:true},
 {id:"p3",name:"Nia Williams",handle:"niawrites",avatar:"NW",category:"Writing",streak:8,time:"2h",body:"1,000 words done. The trick was opening the draft before opening anything else.",likes:41,comments:9}
];
const baseMessages=[
 {id:"m1",name:"Maya Chen",handle:"mayac",avatar:"MC",online:true,last:"That release checklist idea is solid.",unread:2,messages:[
  {from:"them",text:"Saw your update about the dashboard.",time:"10:03"},
  {from:"me",text:"Yes! I am trying a smaller daily target now.",time:"10:05"},
  {from:"them",text:"That release checklist idea is solid.",time:"10:06"}]},
 {id:"m2",name:"Arjun Rao",handle:"arjunr",avatar:"AR",online:false,last:"Catch up later?",unread:0,messages:[{from:"them",text:"Catch up later?",time:"Yesterday"}]},
 {id:"m3",name:"Nia Williams",handle:"niawrites",avatar:"NW",online:true,last:"High five for day 8!",unread:1,messages:[{from:"them",text:"High five for day 8!",time:"Mon"}]}
];
const defaultState={
 profile:{username:"quester_24",displayName:"Alex Morgan",bio:"Building a calmer system for meaningful progress.",links:"github.com/alexmorgan"},
 quest:{category:"building",why:"I want to keep shipping small, useful things every week."},
 theme:"dark",accent:"#7c5cff",tab:"profile",streak:18,bestStreak:45,totalCheckins:120,completion:88,
 checkins:[],posts:basePosts,messages:baseMessages,
 trophies:[
  {icon:"🔥",name:"7-Day Warrior",desc:"Seven consecutive daily check-ins.",unlocked:true},
  {icon:"🌙",name:"Night Owl",desc:"Five check-ins after 9 PM.",unlocked:true},
  {icon:"⚡",name:"30-Day Master",desc:"Complete a 30-day consistency run.",unlocked:false},
  {icon:"🏆",name:"Category Champion",desc:"Reach 250 points in one quest.",unlocked:false},
  {icon:"🧭",name:"Quest Starter",desc:"Create your first primary quest.",unlocked:true},
  {icon:"🪄",name:"Momentum",desc:"Record 14 active days in 30.",unlocked:true},
  {icon:"📣",name:"Accountability",desc:"Publish five community updates.",unlocked:false},
  {icon:"💎",name:"Proof Keeper",desc:"Attach proof to ten check-ins.",unlocked:false}
 ],
 github:{connected:true,username:"alexmorgan-dev",repos:18,commits:142,prs:12,recent:["questtrack-ui","focus-engine","notes-lab"]},
 toggles:{twofa:false,emailAlerts:true,productTips:false}, activity:[]
};

function esc(x){return String(x==null?"":x).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
function stateLoad(){
 try{
  const raw=localStorage.getItem(KEY);
  if(!raw){const s=JSON.parse(JSON.stringify(defaultState));s.activity=makeActivity();return s}
  const r=JSON.parse(raw);
  const s=Object.assign({},defaultState,r);
  s.profile=Object.assign({},defaultState.profile,r.profile||{});
  s.quest=Object.assign({},defaultState.quest,r.quest||{});
  s.toggles=Object.assign({},defaultState.toggles,r.toggles||{});
  s.posts=r.posts||basePosts;s.messages=r.messages||baseMessages;s.activity=r.activity||makeActivity();
  return s;
 }catch(e){const s=JSON.parse(JSON.stringify(defaultState));s.activity=makeActivity();return s}
}
let S=stateLoad();
function save(){localStorage.setItem(KEY,JSON.stringify(S))}
function goal(){return goals.find(function(g){return g.id===S.quest.category})||goals[3]}
function makeActivity(){
 const arr=[],now=new Date();let n=31;
 for(let i=364;i>=0;i--){
  const d=new Date(now);d.setHours(0,0,0,0);d.setDate(now.getDate()-i);
  n=(n*9301+49297)%233280;
  const q=n/233280;let level=q>.82?3:q>.67?2:q>.55?1:0;
  if(i>=2&&i<=20&&i%3!==0)level=3;
  arr.push({date:d.toISOString().slice(0,10),level:level,note:level?["Build session","Workout logged","Study block","Savings check"][i%4]:""});
 }
 return arr;
}
function icon(n,s){s=s||16;return '<i data-lucide="'+n+'" style="width:'+s+'px;height:'+s+'px"></i>'}
function av(v,sz){return '<div class="avatar '+(sz||"")+'">'+esc(v)+'</div>'}
function route(){return location.hash.replace(/^#\/?|\/?$/g,"")||"dashboard"}
function go(r){location.hash=r;render()}
function pageName(r){return ({dashboard:"Activity Center",community:"Community Pulse",inbox:"Inbox",leaderboard:"Leaderboard",analytics:"Insights",achievements:"Achievements",settings:"Settings"})[r]||"QuestTrack"}
function nav(r,ic,label,count){
 return '<button class="'+(route()===r?"active":"")+'" onclick="go(\''+r+'\')">'+icon(ic,17)+'<span>'+label+'</span>'+(count?'<span class="count">'+count+'</span>':'')+'</button>';
}
function layout(body){
 const unread=S.messages.reduce(function(a,m){return a+(m.unread||0)},0);
 return '<div class="app"><header class="top"><div class="top-inner">'+
 '<div class="brand"><div class="mark">'+icon("swords",17)+'</div><div><div class="brand-name">QuestTrack</div><div class="brand-note">keep showing up</div></div></div>'+
 '<nav class="global-nav">'+
 nav("dashboard","layout-dashboard","Dashboard")+nav("community","messages-square","Community")+nav("inbox","mail","Inbox",unread)+nav("leaderboard","trophy","Leaderboard")+
 '</nav><div class="top-center"><button class="searchbox" onclick="toast(\'Search is staged for the next content pass.\')">'+icon("search",14)+' Search QuestTrack <span>Ctrl K</span></button></div>'+
 '<div class="top-actions"><div style="font-size:8px;color:var(--muted);padding:7px 9px;border:1px solid var(--line);border-radius:999px;background:rgba(255,255,255,.04)">🔥 '+S.streak+' day run</div><button class="iconbtn" onclick="go(\'settings\')">'+icon("settings-2",14)+'</button><button class="iconbtn" onclick="go(\'inbox\')">'+icon("bell",14)+'</button><button class="btn primary" onclick="openCheckin()">'+icon("plus",13)+' Check in</button></div>'+
 '</div></header><main class="main"><div class="content fade"><div style="font-size:8px;letter-spacing:.13em;text-transform:uppercase;color:var(--muted);margin-bottom:13px">QuestTrack / '+pageName(route())+'</div>'+body+'</div></main></div>';
}
function metric(ic,label,value,trend){
 return '<div class="card metric"><div class="metric-top"><span>'+label+'</span><span class="disc">'+icon(ic,14)+'</span></div><div class="value">'+value+'</div><div class="sub">quest performance</div><div class="trend">'+trend+'</div></div>';
}
function trophyCard(t){
 return '<div class="trophy '+(t.unlocked?"":"locked")+'"><div class="medal">'+t.icon+'</div><b>'+esc(t.name)+'</b><span>'+esc(t.desc)+'</span><span class="badge">'+(t.unlocked?"Unlocked":"Locked")+'</span></div>';
}
function timeline(c){
 return '<div class="timeline-item"><div class="time">'+new Date(c.date+"T00:00:00").toLocaleDateString(undefined,{month:"short",day:"numeric"})+'</div><div class="linecol"><span class="tdot"></span><span class="vline"></span></div><div class="event"><div class="event-top"><b>'+esc(c.title||"Daily check-in")+'</b><span class="badge">'+(c.proof?"Proof attached":"Note only")+'</span></div><p>'+esc(c.note||"A consistency entry was recorded.")+'</p></div></div>';
}
function dashboard(){
 const g=goal(),today=new Date().toISOString().slice(0,10),done=S.checkins.some(function(c){return c.date===today});
 const rec=S.checkins.slice(-5).reverse();
 const active=S.activity.filter(function(c){return c.level>0}).length;
 return '<div class="head"><div><div class="eyebrow">Daily consistency / '+esc(g.name)+'</div><div class="h1">Make the work visible.</div><p class="lede">One place for your activity trail, GitHub signal, streak momentum, trophies and proof of the work you have actually done.</p></div><div class="actions"><button class="btn ghost" onclick="go(\'analytics\')">'+icon("chart-no-axes-combined",14)+' View insights</button><button class="btn primary" onclick="openCheckin()">'+icon(done?"check":"circle-plus",14)+' '+(done?"Logged today":"Check-in today")+'</button></div></div>'+
 '<section class="card hero"><div class="hero-row"><div><span class="quest-pill">'+g.emoji+' <strong>'+esc(g.name)+'</strong> · Primary quest</span><div class="quote">“'+esc(quotes[new Date().getDate()%quotes.length])+'”</div></div><div style="text-align:right"><div class="tiny muted">Quest progress</div><div style="font:700 24px Space Grotesk;margin-top:4px">'+Math.min(100,Math.round(S.totalCheckins/1.5))+'%</div></div></div><div class="track"><div class="fill" style="width:'+Math.min(100,Math.round(S.totalCheckins/1.5))+'%"></div></div><div class="hero-foot"><span>'+(done?"Today is on the board.":"Today still has an open square.")+'</span><span>'+esc(S.quest.why)+'</span></div></section>'+
 '<div class="grid g4" style="margin-top:16px">'+metric("flame","Current streak",S.streak+" days","↑ 4 days vs last week")+metric("zap","Longest run",S.bestStreak+" days","Personal record")+metric("target","Check-ins",S.totalCheckins,"Across this quest")+metric("activity","Completion",S.completion+"%","Last 30 days")+'</div>'+
 '<section class="card activity" style="margin-top:16px"><div class="section-head"><div><h2>Activity trail</h2><p>365 days of check-ins, grouped by intensity.</p></div><div class="legend"><span>Less</span><span class="sq"></span><span class="sq l1"></span><span class="sq l2"></span><span class="sq l3"></span><span class="sq l4"></span><span>More</span></div></div><div class="activity-shell"><div><div class="activity-meta"><span class="tiny muted">'+fmtDate(S.activity[0].date)+' — '+fmtDate(S.activity[S.activity.length-1].date)+'</span><span class="badge">'+active+' active days</span></div><div class="heat-scroll"><div class="heatmap">'+S.activity.map(function(c){return '<div class="cell '+(c.level?"l"+c.level:"")+'" title="'+esc(c.date)+' — '+esc(c.note||"No activity")+'" onclick="cellInfo(\''+c.date+'\')"></div>'}).join("")+'</div></div></div><aside class="side-stat"><div class="tiny muted">Last 30 days</div><div class="big">'+S.activity.slice(-30).filter(function(c){return c.level>0}).length+'</div><div class="tiny muted">active days logged</div><div style="margin-top:16px;border-top:1px solid var(--line);padding-top:13px"><div style="font-size:10px;font-weight:700">Ledger status</div><div class="status" style="margin-top:6px"><span class="dot"></span><span class="tiny muted">Local activity is in sync</span></div></div></aside></div></section>'+
 '<div class="split" style="margin-top:16px"><section class="card pad"><div class="section-head"><div><h2>Proof shelf</h2><p>Recent evidence and notes.</p></div><button class="btn ghost" onclick="openCheckin()">Add proof</button></div><div class="timeline">'+(rec.length?rec.map(timeline).join(""):'<div class="empty">Your first check-in will create the timeline.</div>')+'</div></section>'+
 '<section class="card github"><div class="gh-head"><div><div class="eyebrow">Developer sync</div><h2 style="margin-top:5px">GitHub status</h2></div><div class="gh-icon">'+icon("github",19)+'</div></div><div class="status"><span class="dot"></span><span style="font-size:10px">Connected to <b>'+esc(S.github.username)+'</b></span></div><div class="gh-grid"><div class="repo"><b>'+esc(S.github.recent[0])+'</b><span>latest linked repository</span></div><div class="repo"><b>'+S.github.repos+'</b><span>public repositories</span></div></div><div class="mini-stats"><div class="mini"><b>'+S.github.commits+'</b><span>commits / 90d</span></div><div class="mini"><b>'+S.github.prs+'</b><span>pull requests</span></div><div class="mini"><b>94%</b><span>sync health</span></div></div><button class="btn ghost" onclick="toast(\'GitHub status refreshed from mock data.\')">'+icon("refresh-cw",13)+' Refresh status</button></section></div>'+
 '<section class="card pad" style="margin-top:16px"><div class="section-head"><div><h2>Trophy case</h2><p>'+S.trophies.filter(function(t){return t.unlocked}).length+' unlocked · '+S.trophies.filter(function(t){return !t.unlocked}).length+' to chase.</p></div><button class="btn ghost" onclick="go(\'achievements\')">See all achievements</button></div><div class="trophies">'+S.trophies.slice(0,8).map(trophyCard).join("")+'</div></section>';
}
function fmtDate(s){return new Date(s+"T00:00:00").toLocaleDateString(undefined,{month:"short",day:"numeric"})}
function cellInfo(d){const c=S.activity.find(function(x){return x.date===d});toast(fmtDate(d)+" · "+(c&&c.note||"No logged activity"))}
function postCard(p){
 return '<article class="post"><div class="post-head">'+av(p.avatar,"sm")+'<div class="post-meta"><b>'+esc(p.name)+'</b><span>@'+esc(p.handle)+' · '+esc(p.time)+'</span><div style="margin-top:5px"><span class="badge">'+esc(p.category)+'</span> <span class="badge">🔥 '+p.streak+' day streak</span></div></div><button class="iconbtn" style="margin-left:auto;width:31px;height:31px">'+icon("more-horizontal",14)+'</button></div><p class="body">'+esc(p.body)+'</p><div class="post-actions"><button class="post-action '+(p.liked?"active":"")+'" onclick="likePost(\''+p.id+'\')">♡ Kudos '+p.likes+'</button><button class="post-action" onclick="toast(\'Comment thread opened.\')">◎ '+p.comments+' replies</button><button class="post-action '+(p.bookmarked?"active":"")+'" onclick="bookmarkPost(\''+p.id+'\')">'+icon("bookmark",12)+' Save</button></div></article>';
}
function community(){
 return '<div class="head"><div><div class="eyebrow">Accountability network</div><div class="h1">Find people doing the work.</div><p class="lede">Share progress, post proof, ask questions, and keep the feed focused on useful accountability rather than noise.</p></div><button class="btn primary" onclick="focusCompose()">'+icon("pen-line",14)+' Share update</button></div>'+
 '<div class="split"><div class="grid"><section class="card compose" id="compose"><div class="section-head"><div><h2>Progress note</h2><p>A sentence, an image, or a milestone.</p></div><span class="badge">'+goal().emoji+' '+esc(goal().name)+'</span></div><textarea id="postText" placeholder="What moved forward today?"></textarea><div class="compose-foot"><span class="tiny muted">'+icon("paperclip",11)+' Proof upload is simulated in this demo.</span><button class="btn primary" onclick="createPost()">'+icon("send",13)+' Publish</button></div></section><section class="card" style="overflow:hidden"><div style="padding:14px 17px;border-bottom:1px solid var(--line);display:flex;gap:8px;justify-content:space-between;flex-wrap:wrap"><div class="filters" id="feedFilters">'+["Trending","Latest","My quest","Following"].map(function(x,i){return '<button class="chip '+(i===0?"active":"")+'" onclick="activateFeed(this)">'+x+'</button>'}).join("")+'</div><select class="select"><option>All quests</option>'+goals.map(function(g){return '<option>'+esc(g.name)+'</option>'}).join("")+'</select></div>'+S.posts.map(postCard).join("")+'</section></div>'+
 '<aside class="grid"><section class="card pad"><div class="eyebrow">Your corner</div><h2 style="margin-top:6px">Quest rooms</h2><p class="lede" style="font-size:10px">Switch context before you post or browse.</p><div class="rooms" style="margin-top:12px">'+goals.slice(0,5).map(function(g,i){return '<button class="room '+(i===3?"active":"")+'" onclick="toast(\''+esc(g.name)+' room selected\')"><b>'+g.emoji+' '+esc(g.name)+'</b><span>'+[124,86,102,211,64][i]+' active members</span></button>'}).join("")+'</div></section><section class="card pad"><div class="section-head"><div><h2>Community rhythm</h2><p>Last seven days</p></div><span class="badge">+18%</span></div><div class="barwrap">'+[34,47,61,43,69,78,55].map(function(v){return '<span class="bar" style="height:'+v+'%"></span>'}).join("")+'</div><div class="setting"><span class="tiny muted">Posts in your category</span><b style="font-size:10px">34</b></div></section></aside></div>';
}
function inbox(){
 const m=S.messages[0];
 return '<div class="head"><div><div class="eyebrow">Private conversations</div><div class="h1">Stay connected to the people behind the progress.</div><p class="lede">Direct messages and account events share one inbox so encouragement, rank changes and streak reminders do not get lost.</p></div><button class="btn ghost" onclick="toast(\'New conversation composer opened.\')">'+icon("square-pen",14)+' New message</button></div>'+
 '<section class="card inbox"><div class="inbox-list"><div class="ibox-head"><b style="font-size:10px">Conversations</b><span class="badge">'+S.messages.length+'</span></div>'+S.messages.map(function(x,i){return '<div class="conversation '+(i===0?"active":"")+'" onclick="toast(\'Conversation switching is ready for the next pass.\')">'+av(x.avatar,"sm")+'<div class="meta"><b>'+esc(x.name)+'</b><span>'+esc(x.last)+'</span></div>'+(x.unread?'<span class="unread">'+x.unread+'</span>':'')+'</div>'}).join("")+'</div><div class="chat"><div class="chat-head"><div class="chat-user">'+av(m.avatar,"sm")+'<div><b style="font-size:10px">'+esc(m.name)+'</b><div class="online">'+(m.online?"● Active now":"○ Away")+'</div></div></div><div class="top-actions"><button class="iconbtn">'+icon("phone",13)+'</button><button class="iconbtn">'+icon("more-horizontal",13)+'</button></div></div><div class="chat-body">'+m.messages.map(function(x){return '<div class="bubble '+(x.from==="me"?"me":"")+'">'+esc(x.text)+'<div style="font-size:8px;color:var(--muted);margin-top:5px">'+esc(x.time)+'</div></div>'}).join("")+'</div><div class="chat-compose"><input class="input" id="msgInput" placeholder="Write a message..."/><button class="btn primary" onclick="sendMsg()">'+icon("send",13)+'</button></div></div><div class="alerts"><div class="ibox-head"><b style="font-size:10px">Account activity</b></div>'+[
 ["trophy","Achievement unlocked","You earned Quest Starter.","8m"],
 ["trending-up","Leaderboard shift","You moved up three places this week.","2h"],
 ["flame","Streak guard","Tomorrow keeps your 18-day run alive.","4h"],
 ["hand","Kudos received","Maya sent you a high five.","Yesterday"]
].map(function(n){return '<div class="note">'+icon(n[0],13)+'<div><b>'+n[1]+'</b><span>'+n[2]+'</span><small style="color:var(--muted);font-size:8px;display:block;margin-top:5px">'+n[3]+'</small></div></div>'}).join("")+'</div></section>';
}
function sendMsg(){const i=document.getElementById("msgInput");if(!i||!i.value.trim())return;S.messages[0].messages.push({from:"me",text:i.value.trim(),time:new Date().toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"})});S.messages[0].last=i.value.trim();save();render();toast("Message sent.")}
function boardData(){
 return [
  ["Maya Chen","mayac","MC","Building",46,212,18],["Arjun Rao","arjunr","AR","Learning",39,188,15],["Nia Williams","niawrites","NW","Writing",35,176,13],
  ["Leo Martins","leom","LM","Fitness",32,161,11],["Sara Kim","sarak","SK","Money",29,154,10],["Ethan Brooks","ethanb","EB","Learning",27,148,9],
  ["Priya S","priyas","PS","Building",24,141,9],["Jon Bell","jonb","JB","Fitness",22,132,8],["Ava Patel","avap","AP","Writing",20,128,8],
  ["Devon Ellis","devone","DE","Something Else",19,124,7],["Kai Rivera","kair","KR","Building",19,121,7],
  ["Alex Morgan","quester_24","AM",goal().name,S.streak,S.totalCheckins,S.trophies.filter(function(t){return t.unlocked}).length]
 ].map(function(x){return {name:x[0],handle:x[1],avatar:x[2],category:x[3],streak:x[4],checkins:x[5],badges:x[6],you:x[1]===S.profile.username}});
}
function leaderboard(){
 const b=boardData();
 return '<div class="head"><div><div class="eyebrow">Community scoreboard</div><div class="h1">Progress, placed in context.</div><p class="lede">See momentum across the community while keeping your own row close enough to understand your current position.</p></div><div class="filters"><button class="chip active">This week</button><button class="chip">This month</button><button class="chip">All time</button><button class="chip active">Global</button></div></div>'+
 '<section class="card" style="overflow:hidden"><div class="podium">'+b.slice(0,3).map(function(u,i){return '<div class="podium-card '+(i===0?"first":"")+'"><div style="font-size:25px">'+["🥇","🥈","🥉"][i]+'</div>'+av(u.avatar,"lg")+'<div class="rank">#'+(i+1)+'</div><b>'+esc(u.name)+'</b><span>'+esc(u.category)+' · '+u.streak+' day streak</span></div>'}).join("")+'</div>'+
 '<div class="table-wrap"><table><thead><tr><th>Rank</th><th>Person</th><th>Quest</th><th>Streak</th><th>Check-ins</th><th>Badges</th><th></th></tr></thead><tbody>'+b.slice(3).map(function(u,i){return '<tr class="'+(u.you?"you":"")+'"><td><b>#'+(i+4)+'</b></td><td><div class="ucell">'+av(u.avatar,"sm")+'<div><b>'+esc(u.name)+'</b><div class="tiny muted">@'+esc(u.handle)+'</div></div></div></td><td>'+esc(u.category)+'</td><td>🔥 '+u.streak+'</td><td>'+u.checkins+'</td><td>'+u.badges+'</td><td><button class="btn ghost" style="height:29px" onclick="toast(\'Profile preview opened.\')">'+icon("arrow-up-right",11)+'</button></td></tr>'}).join("")+'</tbody></table></div><div class="sticky-you"><div class="ucell">'+av("AM","sm")+'<div><b style="font-size:10px">You · tracked live</b><div class="tiny muted">'+S.streak+' day streak · '+S.totalCheckins+' check-ins</div></div><div style="margin-left:auto;color:#9f92ff;font-size:9px">Next check-in keeps the chain alive →</div></div></div></section>';
}
function analytics(){
 const vals=[48,64,52,75,62,81,72,88,69,94,76,82,96,73,85];
 return '<div class="head"><div><div class="eyebrow">Pattern analysis</div><div class="h1">Turn a streak into a system.</div><p class="lede">Cadence and recovery signals from your activity ledger, arranged for reflection rather than pressure.</p></div><button class="btn ghost" onclick="toast(\'Export prepared as CSV in the next build.\')">'+icon("download",13)+' Export</button></div><div class="grid g2"><section class="card pad"><div class="section-head"><div><h2>Weekly cadence</h2><p>Recent activity</p></div><span class="badge">+12%</span></div><div class="barwrap">'+vals.map(function(v){return '<span class="bar" style="height:'+v+'%"></span>'}).join("")+'</div></section><section class="card pad"><div class="section-head"><div><h2>Quest mix</h2><p>Active days by focus</p></div></div>'+goals.slice(0,5).map(function(g,i){return '<div class="setting" style="padding:10px 0"><span style="font-size:9px">'+g.emoji+' '+esc(g.name)+'</span><span style="font-size:9px">'+[42,21,14,17,6][i]+'%</span></div>'}).join("")+'</section></div><section class="card pad" style="margin-top:16px"><div class="section-head"><div><h2>Health markers</h2><p>Signals for sustainable progress.</p></div></div><div class="health">'+[
 ["Best weekday","Tuesday","21 logs"],["Most consistent hour","7–9 AM","34% of entries"],["Recovery gap","1.8 days","average"],["Proof rate","63%","entries with evidence"],["Momentum","High","14 active days"]
].map(function(x){return '<div class="mini"><span>'+x[0]+'</span><b style="margin-top:8px;display:block">'+x[1]+'</b><small style="display:block;color:var(--muted);font-size:8px;margin-top:5px">'+x[2]+'</small></div>'}).join("")+'</div></section>';
}
function achievements(){
 return '<div class="head"><div><div class="eyebrow">Milestones</div><div class="h1">Collect proof that you kept going.</div><p class="lede">Achievements are tied to behavior: consistency, evidence, community participation and focused follow-through.</p></div><span class="badge">'+S.trophies.filter(function(t){return t.unlocked}).length+'/'+S.trophies.length+' unlocked</span></div><section class="card pad"><div class="trophies">'+S.trophies.map(trophyCard).join("")+'</div></section><div class="grid g3" style="margin-top:16px">'+[
 ["Next up","30-Day Master","12 more consecutive days"],["Near complete","Proof Keeper","6 more proof attachments"],["Community","Accountability","5 community updates"]
].map(function(x){return '<section class="card pad"><div class="eyebrow">'+x[0]+'</div><h2 style="margin-top:6px">'+x[1]+'</h2><p class="lede" style="font-size:10px">'+x[2]+'</p><div class="track"><div class="fill" style="width:64%"></div></div></section>'}).join("")+'</div>';
}
function settings(){
 const tabs=[["profile","user-round","Profile"],["quest","compass","Your Quest"],["security","shield-check","Security"],["appearance","palette","Appearance"]];
 let panel="";
 if(S.tab==="profile")panel='<div class="section-head"><div><h2>Profile settings</h2><p>The identity shown on your posts and leaderboard.</p></div></div><div class="form-grid"><div class="field"><label>Username</label><input class="input" id="username" value="'+esc(S.profile.username)+'"></div><div class="field"><label>Display name</label><input class="input" id="displayName" value="'+esc(S.profile.displayName)+'"></div><div class="field full"><label>Bio</label><textarea class="textarea" id="bio">'+esc(S.profile.bio)+'</textarea></div><div class="field full"><label>Social links</label><input class="input" id="links" value="'+esc(S.profile.links)+'"></div></div>';
 if(S.tab==="quest")panel='<div class="section-head"><div><h2>Your Quest</h2><p>Select one primary focus. Historical check-ins stay intact.</p></div></div><div class="goal-grid">'+goals.map(function(g){return '<div class="goal '+(S.quest.category===g.id?"active":"")+'" onclick="selectGoal(\''+g.id+'\')"><div class="emoji">'+g.emoji+'</div><b>'+esc(g.name)+'</b><span>'+esc(g.desc)+'</span></div>'}).join("")+'</div><div class="field" style="margin-top:17px"><label>Why are you taking on this quest?</label><textarea class="textarea" id="why">'+esc(S.quest.why)+'</textarea></div><div class="card" style="padding:12px;margin-top:13px;background:var(--surface-2)"><div class="status">'+icon("info",13)+'<span class="tiny muted">Changing the category changes the current theme/focus; your existing daily history is preserved.</span></div></div>';
 if(S.tab==="security")panel='<div class="section-head"><div><h2>Security</h2><p>Account access and session controls.</p></div></div><div class="setting"><div><b style="font-size:10px">Passwordless sign-in</b><div class="tiny muted" style="margin-top:3px">Managed by your account provider.</div></div><span class="badge">Enabled</span></div><div class="setting"><div><b style="font-size:10px">Two-factor authentication</b><div class="tiny muted" style="margin-top:3px">Require an additional verification step.</div></div><button class="switch '+(S.toggles.twofa?"on":"")+'" onclick="toggle(\'twofa\')"><i></i></button></div><div class="setting"><div><b style="font-size:10px">Active sessions</b><div class="tiny muted" style="margin-top:3px">2 signed-in devices · last active today.</div></div><button class="btn ghost" onclick="toast(\'Session manager opened.\')">Review</button></div>';
 if(S.tab==="appearance")panel='<div class="section-head"><div><h2>Appearance</h2><p>Choose theme behavior and the accent used for progress.</p></div></div><div class="setting"><div><b style="font-size:10px">Theme</b><div class="tiny muted" style="margin-top:3px">Dark, light or follow system.</div></div><div class="filters">'+["dark","light","system"].map(function(t){return '<button class="chip '+(S.theme===t?"active":"")+'" onclick="setTheme(\''+t+'\')">'+t+'</button>'}).join("")+'</div></div><div class="setting"><div><b style="font-size:10px">Accent color</b><div class="tiny muted" style="margin-top:3px">Progress, focus states and active controls.</div></div><div class="swatches">'+["#7c5cff","#26c6da","#ff7a59","#3ddc97","#f05ca7"].map(function(c){return '<span class="swatch '+(S.accent===c?"active":"")+'" style="background:'+c+'" onclick="setAccent(\''+c+'\')"></span>'}).join("")+'</div></div><div class="setting"><div><b style="font-size:10px">Email product tips</b><div class="tiny muted" style="margin-top:3px">Occasional feature and workflow ideas.</div></div><button class="switch '+(S.toggles.productTips?"on":"")+'" onclick="toggle(\'productTips\')"><i></i></button></div><div class="setting"><div><b style="font-size:10px">Email alerts</b><div class="tiny muted" style="margin-top:3px">Mentions, messages and streak reminders.</div></div><button class="switch '+(S.toggles.emailAlerts?"on":"")+'" onclick="toggle(\'emailAlerts\')"><i></i></button></div>';
 return '<div class="head"><div><div class="eyebrow">Personal controls</div><div class="h1">Make the app fit your routine.</div><p class="lede">Profile, quest focus, security and appearance in one settings surface.</p></div><button class="btn primary" onclick="saveSettings()">'+icon("save",13)+' Save changes</button></div><div class="settings"><section class="card settings-nav">'+tabs.map(function(t){return '<button class="st '+(S.tab===t[0]?"active":"")+'" onclick="setTab(\''+t[0]+'\')">'+icon(t[1],14)+' '+t[2]+'</button>'}).join("")+'</section><section class="card pad">'+panel+'</section></div>';
}
function selectGoal(id){S.quest.category=id;save();render()}
function setTab(t){S.tab=t;save();render()}
function saveSettings(){
 const a=document.getElementById("username"),b=document.getElementById("displayName"),c=document.getElementById("bio"),d=document.getElementById("links"),e=document.getElementById("why");
 if(a)S.profile.username=a.value.trim();if(b)S.profile.displayName=b.value.trim();if(c)S.profile.bio=c.value.trim();if(d)S.profile.links=d.value.trim();if(e)S.quest.why=e.value.trim();
 save();render();toast("Settings saved.")
}
function toggle(k){S.toggles[k]=!S.toggles[k];save();render();toast((S.toggles[k]?"Enabled ":"Disabled ")+k)}
function setTheme(t){S.theme=t;save();applyTheme();render()}
function setAccent(c){S.accent=c;save();applyTheme();render()}
function applyTheme(){let t=S.theme;if(t==="system")t=matchMedia("(prefers-color-scheme:light)").matches?"light":"dark";document.documentElement.dataset.theme=t;document.documentElement.style.setProperty("--accent",S.accent||"#7c5cff")}
function openCheckin(){
 document.getElementById("modal-root").innerHTML='<div class="modal-bg" onclick="closeModal(event)"><div class="modal" onclick="event.stopPropagation()"><div class="modal-head"><div><b style="font-size:11px">Daily check-in</b><div class="tiny muted" style="margin-top:3px">Give today one clear piece of evidence.</div></div><button class="iconbtn" onclick="closeModal()">'+icon("x",14)+'</button></div><div class="modal-body"><div class="field"><label>What did you move forward?</label><textarea class="textarea" id="checkNote" placeholder="Example: Built the auth flow and tested the error state."></textarea></div><div class="form-grid" style="margin-top:13px"><div class="field"><label>Proof file</label><input class="input" id="checkProof" type="file"></div><div class="field"><label>Energy</label><select class="select" id="energy"><option>Steady</option><option>Focused</option><option>Low but done</option><option>High</option></select></div></div></div><div class="modal-foot"><button class="btn ghost" onclick="closeModal()">Cancel</button><button class="btn primary" onclick="submitCheckin()">Log check-in</button></div></div></div>';
 if(window.lucide)lucide.createIcons();
}
function submitCheckin(){
 const note=document.getElementById("checkNote")&&document.getElementById("checkNote").value.trim();if(!note){toast("Add a short note first.");return}
 const proof=!!(document.getElementById("checkProof")&&document.getElementById("checkProof").files.length);
 const date=new Date().toISOString().slice(0,10);
 if(S.checkins.some(function(c){return c.date===date})){toast("Today is already logged.");closeModal();return}
 S.checkins.push({id:Math.random().toString(36).slice(2),date:date,note:note,proof:proof,title:"Daily check-in"});
 let cell=S.activity.find(function(c){return c.date===date});
 if(cell){cell.level=4;cell.note=note}
 S.totalCheckins++;S.streak++;S.completion=Math.min(99,Math.round(S.completion+.7));if(S.streak>S.bestStreak)S.bestStreak=S.streak;
 S.trophies.forEach(function(t){if(t.name==="30-Day Master"&&S.streak>=30)t.unlocked=true;if(t.name==="Proof Keeper"){t.unlocked=S.checkins.filter(function(c){return c.proof}).length>=10}});
 save();closeModal();render();toast("Check-in added to your activity trail.")
}
function closeModal(e){if(!e||e.target===e.currentTarget)document.getElementById("modal-root").innerHTML=""}
function toast(msg){const r=document.getElementById("toast-root");r.innerHTML='<div class="toast">'+esc(msg)+'</div>';setTimeout(function(){r.innerHTML=""},2400)}
function focusCompose(){go("community");setTimeout(function(){const e=document.getElementById("postText");if(e){e.focus();document.getElementById("compose").scrollIntoView({behavior:"smooth"})}},60)}
function createPost(){const e=document.getElementById("postText"),text=e&&e.value.trim();if(!text){toast("Write something before publishing.");return}S.posts.unshift({id:Math.random().toString(36).slice(2),name:S.profile.displayName,handle:S.profile.username,avatar:(S.profile.displayName||"AM").split(" ").map(function(x){return x[0]}).join("").slice(0,2),category:goal().name,streak:S.streak,time:"now",body:text,likes:0,comments:0});const t=S.trophies.find(function(x){return x.name==="Accountability"});if(t)t.unlocked=S.posts.length>=5;save();render();toast("Update published.")}
function likePost(id){const p=S.posts.find(function(x){return x.id===id});if(!p)return;p.liked=!p.liked;p.likes+=p.liked?1:-1;save();render()}
function bookmarkPost(id){const p=S.posts.find(function(x){return x.id===id});if(!p)return;p.bookmarked=!p.bookmarked;save();render();toast(p.bookmarked?"Saved to your shelf.":"Removed from saved posts.")}
function activateFeed(b){document.querySelectorAll("#feedFilters .chip").forEach(function(x){x.classList.remove("active")});b.classList.add("active");toast(b.textContent+" feed loaded.")}
function render(){
 applyTheme();
 const r=route();let body;
 if(r==="dashboard")body=dashboard();else if(r==="community")body=community();else if(r==="inbox")body=inbox();else if(r==="leaderboard")body=leaderboard();else if(r==="analytics")body=analytics();else if(r==="achievements")body=achievements();else body=settings();
 document.getElementById("app").innerHTML=layout(body);
 if(window.lucide)lucide.createIcons();
}
window.addEventListener("hashchange",render);
window.addEventListener("load",function(){S.currentRoute=route();render()});