const canvas = document.getElementById('practiceCanvas');

const ctx = canvas.getContext('2d');

const container = document.querySelector('.canvas-container');



// ==========================================

// --- 0. 🌲 妖怪圖片法陣預載入中心 ---

// ==========================================

// 這裡建立一個全域物件來管理所有生靈與心魔的圖片

const monsterImages = {};



function loadMonsterImage(label, src) {

const img = new Image();

img.src = src;

img.onload = () => {

// 圖片載入完成後儲存，Canvas 即可流暢繪製

monsterImages[label] = img;

};

}



// 🚀【你可以在這裡置換成你真正的圖片檔案路徑或網址】

// 需要類別生靈圖片載入

loadMonsterImage("米寶", "https://i.ibb.co/7NrrbZ0V/image.png");

loadMonsterImage("布丁犬", "https://i.ibb.co/sdHJnWr5/image.png");

loadMonsterImage("草靈", "https://i.ibb.co/KxDM4bQM/image.png");

loadMonsterImage("盾御獸", "https://i.ibb.co/x8Hvy6FG/image.png");

// 想要類別心魔圖片載入

loadMonsterImage("癮癮", "https://i.ibb.co/hxbgRp1V/image.png");

loadMonsterImage("剁手怪", "https://i.ibb.co/9kGqNNJ1/image.png");

loadMonsterImage("買買妖", "https://i.ibb.co/hJjQXPrB/image.png");

loadMonsterImage("夜貓鬼", "https://i.ibb.co/k27fLRTC/image.png");

loadMonsterImage("小惡魔", "images/devil.png");



// ==========================================

// --- 1. 全局狀態機與基礎數據 ---

// ==========================================

let currentPage = '修';

let totalAmount = 8800;

let dailyBudget = 400;

let survivalDays = Math.ceil(totalAmount / dailyBudget);



let waveOffset = 0;

let currentSelectedText = "";

let inputAmountText = "輸入金額";

let inputNoteText = "備註";

let currentTypedAmount = "";

let currentTypedNote = "";

let appState = 'MAIN';



let introProgress = 0;

let particles = [];



const categories = ['食', '飲', '購', '娛', '醫', '育', '3C', '交', '衣', '住'];

const pastelColors = ['#FFB7B2', '#FFDAC1', '#E2F0CB', '#B5EAD7', '#C7CEEA', '#FFC6FF', '#FFADAD', '#ffd6a5', '#fdffb6', '#caffbf'];

let miniCircles = [];



const navTabs = ['帳', '圖', '修', '結', '社'];

let navButtons = [];



// ==========================================

// --- 2. 各分頁與新功能專屬數據狀態 ---

// ==========================================

// 【修區：對話泡泡學派】

let userSchool = '鋼鐵自律';

let foxBubbleText = "修行不可欺心，今天也要好好克制物慾喔。";

let foxBubbleTimer = 180;



// 【隨機突襲：飛升試煉】遭遇戰狀態

let trialIndex = 0;

let trialFeedbackTimer = 0;

let trialFeedbackText = "";

let trialScenarios = [

{

question: "癮癮端著買一送一的超肥美芋圓鮮奶茶誘惑你，今日『想』已無額度！",

answerA: "理智斬妖：改喝免費水靈",

answerB: "沉淪魔道：買啦！借下個月額度",

feedbackA: "⚡ 降下天雷把癮癮劈飛！內功靈力+5，信心大增！",

feedbackB: "🦊 癮癮長大三倍發出大笑！帳簿被塞入心魔種子！"

},

{

question: "期末報告還有三千字，但筆電變壓器突然燒掉，本月『3C預算』已歸零！",

answerA: "理智斬妖：超支也是必需！買新變壓器趕快趕報告",

answerB: "沉淪魔道：死不花錢！用手機刻完三千字期末報告",

feedbackA: "🦊 狐仙大人無奈搖頭：「用手機打三千字？道友，這不是自律，這是自虐。小心心魔在鍵盤裡滋生！」",

feedbackB: "🔮 狐仙大人的開示：「工具是你的法器。法器碎了不修，你拿什麼去斬妖除魔？這是高瞻遠矚的需要！」"

},

{

question: "七月酷暑高溫 38°C，租屋處冷氣突然壞掉，但本月並無『維修預算』",

answerA: "理智斬妖：找水電工維修！維持基本生存環境",

answerB: "沉淪魔道：死守財庫！吹電風扇、瘋狂沖冷水澡硬撐",

feedbackA: "⚡ 降下甘霖驅散酷熱！保住身體健康，成功避開更大的因果黑洞！",

feedbackB: "🦟 倒楣鬼在床頭跳舞！隔天中暑送急診，強制扣除生存天數 3 天並付雙倍醫藥費！"

},

{

question: "加班到深夜 2 點外面下暴雨，公車已停駛，坐計程車會嚴重超出『交通預算』！",

answerA: "理智斬妖：花錢買安全與睡眠！搭計程車平安回家",

answerB: "沉淪魔道：省錢萬歲！在暴雨中走路兩小時淋雨回家",

feedbackA: "⚡ 驅魔結界展開！安全抵達家門，換取充足睡眠，明日靈力充沛！",

feedbackB: "👻 濕答答的怨靈附身！感冒發燒加上睡眠不足，明天工作出包被扣薪水！"

},

{

question: "剛進新公司主管邀約迎新聚餐，能快速融入團隊，但本月『社交預算』已歸零！",

answerA: "理智斬妖：戰略性投資！超支卡位建立職場人脈",

answerB: "沉淪魔道：孤傲修行！冷酷拒絕所有人，自己回家吃泡麵",

feedbackA: "⚡ 職場防護罩啟動！與同事打成一片，未來工作阻力大減，靈力+5！",

feedbackB: "🦊 孤僻鬼在背後貼標籤！被當成不合群的邊緣人，未來辦公事處處碰壁！"

}

];



// 【帳區：月度覺醒】狀態

let awakeReportStatus = "";

let awakeDialogueText = "";



// 帳目資料過濾狀態

let ledgerTab = '全部支出';

let dropdownOpen = false;

let balanceTilt = 15;

let currentTilt = 15;

let balanceShockTimer = 0;

let ringShockTimer = 0;

let ringMonsterSilhouette = "";

let ringSilhouetteTimer = 0;

let activeLedgerDialogue = "";

let activeLedgerIndex = -1;



let needLedgerData = [

{ label: "食物", icon: "🍴", count: 1, amount: 120, dialogue: "米寶摸著肚子說：『這頓吃得很踏實，靈力有好好儲存起來！』" },

{ label: "飲品", icon: "🥛", count: 3, amount: 150, dialogue: "水靈微微一笑：『純淨的水分補充，是維持修行的基礎。』" },

{ label: "醫療", icon: "✛", count: 11, amount: 2400, dialogue: "醫護精靈認真叮嚀：『身體的修復是不可省的剛需業障。』" },

{ label: "消費", icon: "🛍️", count: 1, amount: 800, dialogue: "守護貓喵了一聲：『買了必要的日用品，記帳因果很工整。』" },

{ label: "其他", icon: "⚙️", count: 7, amount: 1100, dialogue: "鐵匠米寶敲敲鐵砧：『修繕生活必需品，這筆因果我批准了！』" }

];

let wantLedgerData = [

{ label: "食物", icon: "🍴", count: 5, amount: 1850, dialogue: "爆食魔舔舔嘴唇：『頂級和牛吃到飽！哈哈，你的荷包在哭泣呢！』" },

{ label: "飲品", icon: "🥛", count: 38, amount: 2470, dialogue: "癮癮跳出來大笑：『這 38 杯裡面，有 35 杯都是你內心的貪婪餵飽我的，謝謝招待！』" },

{ label: "醫療", icon: "✛", count: 0, amount: 0, dialogue: "這裡空空如也，看來你在衝動之下倒還沒去過醫護所。" },

{ label: "消費", icon: "🛍️", count: 12, amount: 7500, dialogue: "剁手怪瘋狂揮舞剪刀：『看到限時免運就忍不住對吧？剁！都剁！』" },

{ label: "其他", icon: "⚙️", count: 4, amount: 3200, dialogue: "課金蟲在你耳邊輕語：『十連抽必中限定SSR！再課一單就好嘛～』" }

];



// 圖鑑資料狀態

let currentTab = '需';

let infoAlertText = "";

let infoAlertTimer = 0;

let shockMonsterIndex = -1;

let shockTimer = 0;



let needMonsters = [
    { label: "米寶", unlocked: true, waveCount: 3, hint: "", desc: "基礎生存的溫飽福星。老實又呆萌的白糯稻米化身，只要你老實吃正餐（食），牠的修行靈力就會大增。" },
    { label: "水靈", unlocked: false, waveCount: 0, hint: "未知的心魔尚未甦醒... 需連續 3 天記帳『醫』類別。", desc: "純淨之水的守護者，維持修行的清澈基礎。" },
    { label: "布丁犬", unlocked: true, waveCount: 2, hint: "", desc: "治癒心靈的溫馨陪伴。雖然外表像甜點，但只要是必要的日常開銷，牠都會用無辜的眼神默默治癒你的荷包。" },
    { label: "草靈", unlocked: true, waveCount: 1, hint: "", desc: "充滿生機的綠色醫靈。掌管健康與必要的防禦性支出（醫），只要你按時看醫生、修筆電，牠就會散發草本清香保護你。" },
    { label: "守護貓", unlocked: false, waveCount: 0, hint: "未知的心魔尚未甦醒... 需在『住』維持理性消費 5 次。", desc: "默默守護居家安寧的靈貓。" },
    { label: "光精靈", unlocked: false, waveCount: 0, hint: "未知的心魔尚未甦醒... 需存滿 10000 元資產解鎖。", desc: "耀眼的神聖光芒，照亮財庫。" },
    { label: "鐵匠米寶", unlocked: false, waveCount: 0, hint: "未知的心魔尚未甦醒... 需觸發累積滿 10 次『需』審判。", desc: "負責淬火鍛造神器的終極米寶。" },
    { label: "盾御獸", unlocked: true, waveCount: 2, hint: "", desc: "穩健沉穩的終極防衛。披著重甲的財庫神獸，專門在你抵抗巨大誘惑時現身，用巨盾牢牢鎖住下個月的生存預算。" },
    { label: "小飛俠", unlocked: false, waveCount: 0, hint: "未知的心魔尚未甦醒... 需解鎖全部『需』字生靈。", desc: "翱翔在理性天際的最終生靈。" }
];

let wantMonsters = [
    { label: "癮癮", unlocked: true, waveCount: 3, hint: "", desc: "嘴饞與手癢的化身。專在深夜端著肥美奶茶晃悠，用「買一送一」無情啃食你的生存天數。" },
    { label: "饞饞", unlocked: false, waveCount: 0, hint: "未知的心魔尚未甦醒... 需在『飲』類別放縱消費 3 次以引誘其現身。", desc: "潛伏在甜點與零食背後的貪吃小鬼。" },
    { label: "剁手怪", unlocked: true, waveCount: 2, hint: "", desc: "網購狂熱魔。理智斷線時便會揮舞利刃，一邊咆哮一邊清空購物車，代價是當月預算被無情切碎。" },
    { label: "買買妖", unlocked: true, waveCount: 1, hint: "", desc: "囤積症老妖。口頭禪是「遲早會用到」，擅長用特價糖衣迷惑你，讓財庫塞滿無用的精緻廢物。" },
    { label: "夜貓鬼", unlocked: true, waveCount: 3, hint: "", desc: "熬夜加班或爆肝娛樂的副產物。會幽怨地慫恿你在凌晨兩點點外送、搭昂貴計程車，榨乾你的精神與靈石。" },
    { label: "課金蟲", unlocked: false, waveCount: 0, hint: "未知的心魔尚未甦醒... 需在『3C』放縱破戒一次。", desc: "在虛擬世界中引誘你瘋狂抽卡的電子害蟲。" },
    { label: "爆食魔", unlocked: false, waveCount: 0, hint: "未知的心魔尚未甦醒... 需單筆消費『食』類別超過 1000 元。", desc: "啃食預算底線的巨大暴食怪獸。" },
    { label: "慵懶怪", unlocked: false, waveCount: 0, hint: "未知的心魔尚未甦醒... 需在『交』類別超預算破戒。", desc: "讓你放棄記帳、徹底擺爛的終極惰性怪。" },
    { label: "小惡魔", unlocked: true, waveCount: 2, hint: "", desc: "潛伏在日常細節的享樂心魔。總在你猶豫「需不需要」時，在你耳邊悄悄吹氣：「辛苦了，今天就放縱犒賞自己吧！」" }
];



// 結界與社群資料狀態

let sub结Mode = '卷軸';

let scrollSeal禁Stamped = false;

let scrollSeal獎Stamped = false;

let draggedCircleIndex = -1;

let balanceEcosystem = [];



let socialTab = '排行榜';

let boardShockTimer = 0;

let ghostHideTimer = 0;

let tagHangingShock = 0;



let guildFeeds = [

{ text: "小華成功以『需』注入淨化能量 ✨", style: "normal" },

{ text: "大明觸發了『禁令』，想要妖怪已顯現！ ☠️", style: "curse" },

{ text: "清心居士成功收回了『娛』之業力果實", style: "normal" },

{ text: "欲望奴隸在『購』放縱消費，生存天數急縮中 ⚠️", style: "curse" }

];



let friendRankings = [

{ rank: 1, name: "小華 (省錢大師)", days: 38, icon: "👑" },

{ rank: 2, name: "清心居士", days: 22, icon: "🧘" },

{ rank: 3, name: "大明 (努力中)", days: 11, icon: "🥊" },

{ rank: 4, name: "欲望奴隸", days: 3, icon: "👻" }

];



// ==========================================

// --- 3. 核心資料架構運作函式最頂層宣告 ---

// ==========================================

function getLedgerStats() {

let needTotal = needLedgerData.reduce((sum, item) => sum + item.amount, 0);

let wantTotal = wantLedgerData.reduce((sum, item) => sum + item.amount, 0);

let grandTotal = needTotal + wantTotal;

let needPercent = grandTotal === 0 ? 50 : Math.round((needTotal / grandTotal) * 100);

let wantPercent = grandTotal === 0 ? 50 : Math.round((wantTotal / grandTotal) * 100);

return { needTotal, wantTotal, grandTotal, needPercent, wantPercent };

}



function updateEcosystem守恆(index, newBudget) {

if (newBudget < 20) newBudget = 20;

if (newBudget > 600) newBudget = 600;

let oldBudget = balanceEcosystem[index].budget;

let delta = newBudget - oldBudget;

let remainingSum = 0;

for (let i = 0; i < 10; i++) { if (i !== index) remainingSum += balanceEcosystem[i].budget; }

for (let i = 0; i < 10; i++) {

if (i === index) { balanceEcosystem[i].budget = newBudget; }

else {

let portion = balanceEcosystem[i].budget / remainingSum;

balanceEcosystem[i].budget -= delta * portion;

if (balanceEcosystem[i].budget < 15) balanceEcosystem[i].budget = 15;

}

}

let vitalKarma = balanceEcosystem[0].budget + balanceEcosystem[1].budget + balanceEcosystem[2].budget;

dailyBudget = Math.max(100, Math.round(vitalKarma * 1.2));

}



function initBalanceEcosystem() {

balanceEcosystem = [];

const cx = canvas.width / 2;

const cy = canvas.height / 2 + 32;

for (let i = 0; i < 10; i++) {

let angle = (i * (360 / 10) - 90) * Math.PI / 180;

let initR = 75 + (100 / 300) * 135;

balanceEcosystem.push({

label: categories[i], color: pastelColors[i], angle: angle, budget: 100, currentR: initR,

x: cx + Math.cos(angle) * initR, y: cy + Math.sin(angle) * initR

});

}

}



function initLayout() {

const cx = canvas.width / 2;

const cy = canvas.height / 2 - 25;

const radius = 95;



miniCircles = [];

for (let i = 0; i < 10; i++) {

let angle = (i * (360 / 10) - 90) * Math.PI / 180;

let finalX = cx + Math.cos(angle) * (radius + 48);

let finalY = cy + Math.sin(angle) * (radius + 48);

miniCircles.push({

label: categories[i], color: pastelColors[i],

startX: cx, startY: cy, x: cx, y: cy, finalX: finalX, finalY: finalY, r: 20, scale: 1

});

}



const navY = canvas.height - 40;

const spacing = canvas.width / 6;

navButtons = [];

for (let i = 0; i < 5; i++) {

navButtons.push({ label: navTabs[i], x: spacing * (i + 1), y: navY, r: 18 });

}

initBalanceEcosystem();

}



function drawCuteLine(x1, y1, x2, y2, thickness = 2.5, color = '#4A4A4A') {

let distance = Math.hypot(x2 - x1, y2 - y1);

let segments = Math.max(2, distance / 20);

ctx.beginPath(); ctx.moveTo(x1, y1);

for (let i = 1; i < segments; i++) {

let t = i / segments;

let x = x1 + (x2 - x1) * t + (Math.random() - 0.5) * 1.0;

let y = y1 + (y2 - y1) * t + (Math.random() - 0.5) * 1.0;

ctx.lineTo(x, y);

}

ctx.lineTo(x2, y2);

ctx.lineWidth = thickness; ctx.strokeStyle = color; ctx.lineCap = 'round'; ctx.stroke();

}



function drawCuteCircle(cx, cy, r, thickness = 2.5, color = '#4A4A4A') {

let segments = 16; ctx.beginPath();

for (let i = 0; i <= segments; i++) {

let angle = (i / segments) * Math.PI * 2;

let offsetR = r + (Math.random() - 0.5) * 0.8;

let x = cx + Math.cos(angle) * offsetR; let y = cy + Math.sin(angle) * offsetR;

if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);

}

ctx.lineWidth = thickness; ctx.strokeStyle = color; ctx.stroke();

}



function drawScrollPaperPath(x, y, w, h) {

ctx.beginPath(); ctx.moveTo(x, y);

for (let i = 0; i <= w; i += 20) { ctx.lineTo(x + i, y + Math.sin(i * 0.1) * 1.5); }

for (let j = 0; j <= h; j += 15) { ctx.lineTo(x + w + (Math.random() - 0.5) * 1.2, y + j); }

for (let i = w; i >= 0; i -= 20) { ctx.lineTo(x + i, y + h + Math.cos(i * 0.1) * 1.5); }

for (let j = h; j >= 0; j -= 15) { ctx.lineTo(x + (Math.random() - 0.5) * 1.2, y + j); }

ctx.closePath();

}



function triggerFoxSpeech(eventContext) {

foxBubbleTimer = 220;

if (userSchool === '鋼鐵自律') {

if (eventContext === '想') foxBubbleText = "你這個月已經破戒 3 次了，手是不是癢？再去平衡花園亂拉果實，我就把你的天秤砸了！";

else foxBubbleText = "戒律克制得當，繼續保持清心，莫讓雜念破壞結界。";

} else if (userSchool === '數據分析') {

if (eventContext === '想' || eventContext === '開期') foxBubbleText = "分析結果出來了。你的『飲品』支出佔了總體欲望的 42%，建議將這筆業力轉移到教育果實上。";

else foxBubbleText = "理性數據流轉正常，此乃最優化因果分配。";

} else if (userSchool === '家族守護') {

foxBubbleText = "今天也平平安安地守住財庫呢，真是踏實的修行。記得留點靈石，月底才好幫神器淬火喔。";

}

}



function drawCommonUI() {

survivalDays = Math.ceil(totalAmount / dailyBudget);


if (currentPage === '修' && appState === 'MAIN') {

if (survivalDays < 7) container.classList.add('curse-shake');

else container.classList.remove('curse-shake');



ctx.fillStyle = '#FFD3B6'; ctx.beginPath(); ctx.arc(45, 45, 22, 0, Math.PI * 2); ctx.fill();

drawCuteCircle(45, 45, 22, 2.5, '#4A4A4A');



waveOffset += 0.05;

ctx.save(); ctx.beginPath(); ctx.rect(130, 48, 210, 16); ctx.clip();

ctx.fillStyle = (survivalDays < 7) ? '#FF8B94' : '#A8E6CF'; ctx.beginPath(); ctx.moveTo(130, 70);

let fillPercent = Math.min(1, Math.max(0.15, totalAmount / 15000));

for (let x = 130; x <= 130 + 210 * fillPercent; x++) {

let y = 56 + Math.sin((x * 0.1) + waveOffset) * 2.5; ctx.lineTo(x, y);

}

ctx.lineTo(130 + 210 * fillPercent, 70); ctx.closePath(); ctx.fill(); ctx.restore();



drawCuteLine(130, 48, 340, 48, 2.5); drawCuteLine(340, 48, 340, 64, 2.5);

drawCuteLine(340, 64, 130, 64, 2.5); drawCuteLine(130, 64, 130, 48, 2.5);



ctx.fillStyle = '#4A4A4A'; ctx.font = 'bold 12px "Microsoft JhengHei", sans-serif'; ctx.fillText("使用者", 27, 49);

ctx.font = 'bold 14px "Microsoft JhengHei", sans-serif'; ctx.fillText("預估還能生存", 135, 35);

ctx.fillStyle = (survivalDays < 7) ? '#FF6B6B' : '#4E9F3D'; ctx.font = 'bold 18px "Comic Sans MS", sans-serif';

let daysStr = String(survivalDays); ctx.fillText(daysStr, 225, 35);

ctx.fillStyle = '#4A4A4A'; ctx.font = 'bold 14px "Microsoft JhengHei", sans-serif';

ctx.fillText("天", 230 + ctx.measureText(daysStr).width, 35);

} else {

container.classList.remove('curse-shake');

}



ctx.strokeStyle = '#4A4A4A'; ctx.lineWidth = 3.5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';

ctx.beginPath();

ctx.moveTo(0, canvas.height - 40);



for (let x = 0; x <= canvas.width; x += 2) {

let matchedBtn = null;

for (let i = 0; i < navButtons.length; i++) {

if (Math.abs(x - navButtons[i].x) <= 18) {

matchedBtn = navButtons[i];

break;

}

}



if (matchedBtn) {

let dx = x - matchedBtn.x;

let hTremble = (Math.random() - 0.5) * 0.4;

let targetY = matchedBtn.y + Math.sqrt(Math.max(0, 18 * 18 - dx * dx)) + hTremble;

ctx.lineTo(x, targetY);

} else {

let hTremble = (Math.random() - 0.5) * 0.6;

ctx.lineTo(x, canvas.height - 40 + hTremble);

}

}

ctx.stroke();



navButtons.forEach(btn => {

if (btn.label === currentPage) ctx.fillStyle = '#FF6B6B';

else ctx.fillStyle = '#DED9FC';

ctx.beginPath(); ctx.arc(btn.x, btn.y, btn.r, 0, Math.PI * 2); ctx.fill();

drawCuteCircle(btn.x, btn.y, btn.r, 2.5, '#4A4A4A');



if (btn.label === currentPage && Math.random() < 0.3) {

particles.push({

x: btn.x + (Math.random() - 0.5) * 16, y: btn.y - 12,

vx: (Math.random() - 0.5) * 1, vy: -Math.random() * 1.5 - 0.5,

alpha: 1, size: Math.random() * 4 + 2, color: '#FF8B94'

});

}

});



for (let i = particles.length - 1; i >= 0; i--) {

let p = particles[i]; p.x += p.vx; p.y += p.vy; p.alpha -= 0.03;

if (p.alpha <= 0) { particles.splice(i, 1); continue; }

ctx.save(); ctx.fillStyle = p.color; ctx.globalAlpha = p.alpha;

ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI*2); ctx.fill(); ctx.restore();

}



ctx.font = 'bold 14px "Microsoft JhengHei", sans-serif';

navButtons.forEach(btn => {

ctx.fillStyle = (btn.label === currentPage) ? '#FFFFFF' : '#4A4A4A';

ctx.fillText(btn.label, btn.x - 7, btn.y + 5);

});

}



// ==========================================

// --- 5. 各個分頁與遭遇戰戰場獨立渲染區 ---

// ==========================================



function renderLedgerPage() {

let stats = getLedgerStats();

let targetTilt = ((stats.wantPercent - stats.needPercent) / 100) * 25;

currentTilt += (targetTilt - currentTilt) * 0.1;

let shakeOffset = 0; if (balanceShockTimer > 0) { shakeOffset = Math.sin(balanceShockTimer * 0.5) * 4; balanceShockTimer--; }



let bx = canvas.width / 2; let by = 135;

drawCuteLine(bx, by, bx, by - 55, 3.5); drawCuteCircle(bx, by - 55, 3, 2);

ctx.save(); ctx.translate(bx, by - 48); ctx.rotate((currentTilt + shakeOffset) * Math.PI / 180);

drawCuteLine(-65, 0, 65, 0, 3);

drawCuteLine(-65, 0, -80, 25, 1.5); drawCuteLine(-65, 0, -50, 25, 1.5);

ctx.fillStyle = '#4A4A4A'; ctx.beginPath(); ctx.arc(-65, 25, 15, 0, Math.PI, false); ctx.fill(); ctx.beginPath(); ctx.arc(-65, 25, 15, 0, Math.PI, false); ctx.stroke();

drawCuteLine(65, 0, 50, 25, 1.5); drawCuteLine(65, 0, 80, 25, 1.5);

ctx.fillStyle = '#4A4A4A'; ctx.beginPath(); ctx.arc(65, 25, 15, 0, Math.PI, false); ctx.fill(); ctx.beginPath(); ctx.arc(65, 25, 15, 0, Math.PI, false); ctx.stroke();


ctx.fillStyle = '#4A90E2'; ctx.font = 'bold 15px "Microsoft JhengHei", sans-serif'; ctx.fillText("需", -72, -8);

ctx.fillStyle = '#FF6B6B'; ctx.fillText("想", 58, -8);

ctx.restore();



ctx.fillStyle = '#FF6B6B'; ctx.beginPath(); ctx.arc(bx, by - 28, 12, 0, Math.PI*2); ctx.fill(); drawCuteCircle(bx, by - 28, 12, 2, '#4A4A4A');

ctx.fillStyle = '#FFFFFF'; ctx.font = 'bold 11px "Comic Sans MS", sans-serif'; ctx.fillText("VS", bx - 7, by - 24);



let pX = 45, pY = 175, pW = 310, pH = 115;

ctx.fillStyle = '#FFFDF9'; ctx.fillRect(pX, pY, pW, pH);

drawCuteLine(pX, pY, pX + pW, pY, 2.5); drawCuteLine(pX + pW, pY, pX + pW, pY + pH, 2.5); drawCuteLine(pX + pW, pY + pH, pX, pY + pH, 2.5); drawCuteLine(pX, pY + pH, pX, pY, 2.5);



let rcx = pX + pW / 2, rcy = pY + pH / 2; let r_out = 42, r_in = 30;

let ringOffset = 0; if (ringShockTimer > 0) { ringOffset = Math.sin(ringShockTimer * 0.8) * 3; ringShockTimer--; }

let needAngle = (stats.needPercent / 100) * Math.PI * 2;


ctx.fillStyle = '#4A90E2';

ctx.beginPath(); ctx.arc(rcx + ringOffset, rcy, r_out, -Math.PI/2, -Math.PI/2 + needAngle);

ctx.arc(rcx + ringOffset, rcy, r_in, -Math.PI/2 + needAngle, -Math.PI/2, true); ctx.fill();


ctx.fillStyle = '#FF6B6B';

ctx.beginPath(); ctx.arc(rcx + ringOffset, rcy, r_out, -Math.PI/2 + needAngle, Math.PI * 1.5);

ctx.arc(rcx + ringOffset, rcy, r_in, Math.PI * 1.5, -Math.PI/2 + needAngle, true); ctx.fill();


drawCuteCircle(rcx + ringOffset, rcy, r_out, 3); drawCuteCircle(rcx + ringOffset, rcy, r_in, 2);



ctx.fillStyle = '#4A4A4A'; ctx.font = 'bold 13px "Microsoft JhengHei", sans-serif'; ctx.fillText("支出", rcx - 13 + ringOffset, rcy - 6);

ctx.font = 'bold 15px "Comic Sans MS", sans-serif'; let totalStr = `$${stats.grandTotal}`; ctx.fillText(totalStr, rcx - ctx.measureText(totalStr).width/2 + ringOffset, rcy + 12);


ctx.font = 'bold 16px "Comic Sans MS", sans-serif';

ctx.fillStyle = '#4A90E2'; ctx.fillText(`${stats.needPercent}%`, pX + 20, rcy + 6);

ctx.fillStyle = '#FF6B6B'; ctx.fillText(`${stats.wantPercent}%`, pX + pW - 55, rcy + 6);



let abX = 140, abY = 296, abW = 120, abH = 26;

ctx.fillStyle = '#FFFEE0'; ctx.fillRect(abX, abY, abW, abH);

drawCuteCircle(abX + 10, abY + 13, 8, 1.5, '#4A4A4A'); drawCuteCircle(abX + abW - 10, abY + 13, 8, 1.5, '#4A4A4A');


// 按鈕手繪四邊形邊框修正咬合

drawCuteLine(abX, abY, abX + abW, abY, 2);

drawCuteLine(abX + abW, abY, abX + abW, abY + abH, 2);

drawCuteLine(abX + abW, abY + abH, abX, abY + abH, 2);

drawCuteLine(abX, abY + abH, abX, abY, 2);



ctx.fillStyle = '#7A001E'; ctx.font = 'bold 12px "Microsoft JhengHei", sans-serif';

ctx.fillText("⚖️ 開啟因果審判", abX + 20, abY + 18);



let lY = 334;

ctx.fillStyle = '#4A4A4A'; ctx.font = 'bold 14px "Microsoft JhengHei", sans-serif'; ctx.fillText(`分類資訊 ｜ ${ledgerTab}`, pX + 5, lY);

ctx.beginPath(); ctx.moveTo(pX + 5 + ctx.measureText(`分類資訊 ｜ ${ledgerTab}`).width + 5, lY - 8); ctx.lineTo(pX + 5 + ctx.measureText(`分類資訊 ｜ ${ledgerTab}`).width + 11, lY - 2); ctx.lineTo(pX + 5 + ctx.measureText(`分類資訊 ｜ ${ledgerTab}`).width + 17, lY - 8); ctx.closePath(); ctx.fill();



let activeData = [];

if (ledgerTab === '全部支出') {

activeData = needLedgerData.map((item, idx) => {

let matchingWant = wantLedgerData[idx];

return {

label: item.label, icon: item.icon,

count: item.count + matchingWant.count,

amount: item.amount + matchingWant.amount,

dialogue: item.amount >= matchingWant.amount ? item.dialogue : matchingWant.dialogue

};

});

} else if (ledgerTab === '需要支出') {

activeData = needLedgerData;

} else if (ledgerTab === '想要支出') {

activeData = wantLedgerData;

}



let rowH = 25;

activeData.forEach((item, index) => {

let itemY = lY + 18 + index * rowH; drawCuteLine(pX, itemY + 6, pX + pW, itemY + 6, 1, 'rgba(74,74,74,0.2)');

ctx.fillStyle = (activeLedgerIndex === index) ? '#FFB7B2' : '#FFFFFF'; ctx.beginPath(); ctx.arc(pX + 15, itemY - 2, 10, 0, Math.PI*2); ctx.fill(); drawCuteCircle(pX + 15, itemY - 2, 10, 1.5);

ctx.fillStyle = '#4A4A4A'; ctx.font = '12px "Microsoft JhengHei", sans-serif'; ctx.fillText(item.icon, pX + 9, itemY + 2); ctx.fillText(item.label, pX + 32, itemY + 2);

ctx.font = '12px "Comic Sans MS", sans-serif'; ctx.fillText(`${item.count} 次`, pX + 130, itemY + 2); ctx.fillText(`$${item.amount}`, pX + pW - 55, itemY + 2);

});



if (activeLedgerDialogue && activeLedgerIndex !== -1) {

let boxY = lY + 20 + 5 * rowH; ctx.fillStyle = '#FFFEE0'; ctx.fillRect(pX, boxY, pW, 40);

drawCuteLine(pX, boxY, pX + pW, boxY, 1.5, '#FF6B6B'); drawCuteLine(pX, boxY + 40, pX + pW, boxY + 40, 1.5, '#FF6B6B');

ctx.fillStyle = '#7A001E'; ctx.font = 'bold 12px "Microsoft JhengHei", sans-serif'; ctx.fillText(activeLedgerDialogue.substring(0, 26), pX + 10, boxY + 16); ctx.fillText(activeLedgerDialogue.substring(26), pX + 10, boxY + 31);

}



if (dropdownOpen) {

let dy = lY + 6; let dropW = 120; let dropX = pX + 75;

ctx.fillStyle = '#FFFFFF'; ctx.fillRect(dropX, dy, dropW, 78);

drawCuteLine(dropX, dy, dropX + dropW, dy, 2); drawCuteLine(dropX + dropW, dy, dropX + dropW, dy + 78, 2); drawCuteLine(dropX + dropW, dy + 78, dropX, dy + 78, 2); drawCuteLine(dropX, dy + 78, dropX, dy, 2);

ctx.fillStyle = '#4A4A4A'; ctx.font = '13px "Microsoft JhengHei", sans-serif';

ctx.fillText("全部支出", dropX + 15, dy + 20); ctx.fillText("需要支出", dropX + 15, dy + 44); ctx.fillText("想要支出", dropX + 15, dy + 68);

}



if (appState === 'MONTH_AWAKE') {

ctx.fillStyle = 'rgba(0, 0, 0, 0.4)'; ctx.fillRect(0,0,canvas.width,canvas.height);

ctx.fillStyle = '#FCF8F2'; drawScrollPaperPath(40, 140, 320, 300); ctx.fill(); ctx.lineWidth = 2.5; ctx.strokeStyle = '#4A4A4A'; ctx.stroke();


ctx.fillStyle = '#4A4A4A'; ctx.font = 'bold 18px "Microsoft JhengHei", sans-serif';

ctx.fillText("📜 業力因果月度覺醒報告", 95, 185);


ctx.font = '14px "Microsoft JhengHei", sans-serif';

if (awakeReportStatus === 'WIN') {

ctx.fillStyle = '#4E9F3D'; ctx.fillText("✨ 審判結果：【理智飛升】", 65, 230);

ctx.fillStyle = '#4A4A4A'; ctx.fillText("本月守護靈米寶能量集體大爆發！", 65, 270);

ctx.fillText("理性支出壓制了無明心魔，吐出聖旨讚美！", 65, 300);

} else {

ctx.fillStyle = '#FF5252'; ctx.fillText("☠️ 審判結果：【終極貪婪欲望魔】", 65, 230);

ctx.fillStyle = '#7A001E'; ctx.fillText("警報！天秤翻倒，心魔陣法完全裂開！", 65, 270);

ctx.fillText("請道友立即點擊下方簽下悔過書，", 65, 300);

ctx.fillText("系統將強制遣送你至花園調低預算！", 65, 330);

}


// 雙按鈕對稱排版：左邊關閉修行，右邊發動法陣導出下載 PDF 冥卷

ctx.fillStyle = '#EAEAEA'; ctx.fillRect(60, 380, 130, 32);

drawCuteLine(60, 380, 190, 380, 2); drawCuteLine(190, 380, 190, 412, 2); drawCuteLine(190, 412, 60, 412, 2); drawCuteLine(60, 412, 60, 380, 2);

ctx.fillStyle = '#4A4A4A'; ctx.font = 'bold 13px "Microsoft JhengHei", sans-serif';

ctx.fillText(awakeReportStatus === 'WIN' ? "🧘 返回修行" : "📜 簽下悔過書", 82, 401);



ctx.fillStyle = '#FFFEE0'; ctx.fillRect(210, 380, 130, 32);

drawCuteLine(210, 380, 340, 380, 2); drawCuteLine(340, 380, 340, 412, 2); drawCuteLine(340, 412, 210, 412, 2); drawCuteLine(210, 412, 210, 380, 2);

ctx.fillStyle = '#7A001E'; ctx.font = 'bold 13px "Microsoft JhengHei", sans-serif';

ctx.fillText("🔮 煉製因果冥卷", 232, 401);

}

}



function renderPracticePage(cx, cy) {

if (introProgress < 1) {

introProgress += 0.025; if (introProgress > 1) introProgress = 1;

}

miniCircles.forEach(circle => {

circle.x = circle.startX + (circle.finalX - circle.startX) * introProgress;

circle.y = circle.startY + (circle.finalY - circle.startY) * introProgress;

if (circle.scale > 1) circle.scale -= 0.05;

});



ctx.fillStyle = '#FFF5B7'; ctx.beginPath(); ctx.arc(cx, cy, 95, 0, Math.PI * 2); ctx.fill();

drawCuteCircle(cx, cy, 95, 3.5, '#4A4A4A');



miniCircles.forEach(circle => {

ctx.fillStyle = circle.color;

ctx.beginPath(); ctx.arc(circle.x, circle.y, circle.r * circle.scale, 0, Math.PI * 2); ctx.fill();

drawCuteCircle(circle.x, circle.y, circle.r * circle.scale, 2.5, '#4A4A4A');

});



ctx.fillStyle = '#EAEAEA'; ctx.fillRect(120, 100, 160, 20); drawCuteLine(120,100,280,100,1); drawCuteLine(120,120,280,120,1);

ctx.fillStyle = '#4A4A4A'; ctx.font = '11px "Microsoft JhengHei", sans-serif';

ctx.fillText("當前理財學派: " + userSchool, 135, 114);



ctx.fillStyle = '#4A4A4A'; ctx.font = 'bold 36px "Microsoft JhengHei", sans-serif'; ctx.fillText("神", cx - 18, cy - 10);

ctx.font = 'bold 22px "Comic Sans MS", sans-serif';

let amountStr = `$${totalAmount}`; ctx.fillText(amountStr, cx - ctx.measureText(amountStr).width / 2, cy + 25);



if (currentSelectedText) {

ctx.fillStyle = '#FF6B6B'; ctx.font = 'bold 16px "Microsoft JhengHei", sans-serif';

ctx.fillText(`【${currentSelectedText}】`, cx - ctx.measureText(`【${currentSelectedText}】`).width / 2, cy + 55);

}



ctx.font = 'bold 15px "Microsoft JhengHei", sans-serif';

miniCircles.forEach(circle => { ctx.fillStyle = '#4A4A4A'; ctx.fillText(circle.label, circle.x - 7, circle.y + 5); });



if (foxBubbleTimer > 0) {

let bx = cx - 120, by = cy - 110, bw = 240, bh = 52;

let bubbleShake = Math.sin(Date.now() * 0.01) * 1.5;


ctx.fillStyle = '#FFFFFF'; ctx.fillRect(bx, by + bubbleShake, bw, bh);

drawCuteLine(bx, by + bubbleShake, bx + bw, by + bubbleShake, 2.5);

drawCuteLine(bx + bw, by + bubbleShake, bx + bw, by + bh + bubbleShake, 2.5);

drawCuteLine(bx + bw, by + bh + bubbleShake, bx, by + bh + bubbleShake, 2.5);

drawCuteLine(bx, by + bh + bubbleShake, bx, by + bubbleShake, 2.5);


ctx.beginPath(); ctx.moveTo(cx - 10, by + bh + bubbleShake); ctx.lineTo(cx, by + bh + 12 + bubbleShake); ctx.lineTo(cx + 10, by + bh + bubbleShake); ctx.fill(); ctx.stroke();


ctx.fillStyle = '#7A001E'; ctx.font = 'bold 11px "Microsoft JhengHei", sans-serif';

ctx.fillText(foxBubbleText.substring(0, 20), bx + 12, by + 22 + bubbleShake);

ctx.fillText(foxBubbleText.substring(20), bx + 12, by + 39 + bubbleShake);

foxBubbleTimer--;

}



ctx.fillStyle = '#FFFEE0'; ctx.fillRect(45, canvas.height - 150, 310, 52);

drawCuteLine(45, canvas.height - 150, 355, canvas.height - 150, 2.5);

drawCuteLine(355, canvas.height - 150, 355, canvas.height - 98, 2.5);

drawCuteLine(355, canvas.height - 98, 45, canvas.height - 98, 2.5);

drawCuteLine(45, canvas.height - 98, 45, canvas.height - 150, 2.5);

drawCuteLine(265, canvas.height - 150, 265, canvas.height - 98, 2);

drawCuteCircle(288, canvas.height - 124, 11, 2); drawCuteCircle(325, canvas.height - 124, 11, 2);



if (!currentTypedAmount) {

ctx.fillStyle = 'rgba(74, 74, 74, 0.4)'; ctx.font = 'bold 14px "Microsoft JhengHei", sans-serif'; ctx.fillText(inputAmountText, 60, canvas.height - 120);

ctx.strokeStyle = 'rgba(74, 74, 74, 0.25)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(60, canvas.height - 112); ctx.lineTo(120, canvas.height - 112); ctx.stroke();

} else {

ctx.fillStyle = '#4A4A4A'; ctx.font = 'bold 16px "Comic Sans MS", sans-serif'; ctx.fillText(currentTypedAmount, 60, canvas.height - 118);

}

if (!currentTypedNote) {

ctx.fillStyle = 'rgba(74, 74, 74, 0.4)'; ctx.font = 'bold 14px "Microsoft JhengHei", sans-serif'; ctx.fillText(inputNoteText, 150, canvas.height - 120);

ctx.strokeStyle = 'rgba(74, 74, 74, 0.25)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(150, canvas.height - 112); ctx.lineTo(185, canvas.height - 112); ctx.stroke();

} else {

ctx.fillStyle = '#4A4A4A'; ctx.font = 'bold 14px "Microsoft JhengHei", sans-serif'; ctx.fillText(currentTypedNote, 150, canvas.height - 118);

}



ctx.strokeStyle = '#4A4A4A'; ctx.lineWidth = 2; ctx.strokeRect(285, canvas.height - 130, 6, 9);

ctx.beginPath(); ctx.moveTo(320, canvas.height - 124); ctx.lineTo(324, canvas.height - 120); ctx.lineTo(330, canvas.height - 127); ctx.stroke();



if (appState === 'JUDGMENT') {

ctx.fillStyle = 'rgba(255, 255, 255, 0.85)'; ctx.fillRect(0, 0, canvas.width, canvas.height);

let jcx = canvas.width / 2; let jcy = canvas.height / 2;

ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.arc(jcx, jcy, 100, 0, Math.PI*2); ctx.fill();

drawCuteCircle(jcx, jcy, 100, 3.5, '#4A4A4A');

ctx.fillStyle = '#4A4A4A'; ctx.font = 'bold 16px "Microsoft JhengHei", sans-serif'; ctx.fillText("修行不可欺心唷", jcx - 56, jcy - 30);

ctx.font = '14px "Comic Sans MS", sans-serif'; ctx.fillText(`這筆花費為 $${currentTypedAmount}`, jcx - 50, jcy - 5);

ctx.fillStyle = '#A8E6CF'; ctx.beginPath(); ctx.arc(jcx - 45, jcy + 40, 25, 0, Math.PI*2); ctx.fill(); drawCuteCircle(jcx - 45, jcy + 40, 25, 2, '#4A4A4A');

ctx.fillStyle = '#4A4A4A'; ctx.font = 'bold 15px "Microsoft JhengHei", sans-serif'; ctx.fillText("需", jcx - 52, jcy + 45);

ctx.fillStyle = '#FF8B94'; ctx.beginPath(); ctx.arc(jcx + 45, jcy + 40, 25, 0, Math.PI*2); ctx.fill(); drawCuteCircle(jcx + 45, jcy + 40, 25, 2, '#4A4A4A');

ctx.fillStyle = '#4A4A4A'; ctx.font = 'bold 15px "Microsoft JhengHei", sans-serif'; ctx.fillText("想", jcx + 38, jcy + 45);

}

}




function renderGalleryPage() {
    let list = (currentTab === '需') ? needMonsters : wantMonsters;
    let tcy = 115;
    
    // 繪製頁籤 (保持原樣)
    ctx.fillStyle = (currentTab === '需') ? '#A8E6CF' : '#EAEAEA'; 
    ctx.beginPath(); ctx.moveTo(100, tcy); ctx.quadraticCurveTo(145, tcy - 35, 190, tcy); ctx.closePath(); ctx.fill(); 
    drawCuteLine(100, tcy, 190, tcy, 2); ctx.stroke();
    ctx.fillStyle = (currentTab === '想') ? '#FF8B94' : '#EAEAEA'; 
    ctx.beginPath(); ctx.moveTo(210, tcy); ctx.quadraticCurveTo(255, tcy - 35, 300, tcy); ctx.closePath(); ctx.fill(); 
    drawCuteLine(210, tcy, 300, tcy, 2); ctx.stroke();
    
    ctx.fillStyle = '#4A4A4A'; ctx.font = 'bold 16px "Microsoft JhengHei", sans-serif'; 
    ctx.fillText("需", 137, tcy - 8); ctx.fillText("想", 247, tcy - 8); 
    drawCuteLine(30, tcy, 370, tcy, 3);

    let startX = 75, startY = 180, gap = 125;
    for (let i = 0; i < 9; i++) {
        let row = Math.floor(i / 3), col = i % 3;
        let cellX = startX + col * gap, cellY = startY + row * gap;
        let monster = list[i];
        let r = 38;
        
        ctx.fillStyle = monster.unlocked ? '#E2F0CB' : '#F3F3F3'; 
        ctx.beginPath(); ctx.arc(cellX, cellY, r, 0, Math.PI * 2); ctx.fill(); 
        drawCuteCircle(cellX, cellY, r, 3, '#4A4A4A');
        
        if (monster.unlocked) {
            ctx.save(); ctx.beginPath(); ctx.arc(cellX, cellY, r, 0, Math.PI * 2); ctx.clip();
            if (monsterImages[monster.label]) {
                ctx.drawImage(monsterImages[monster.label], cellX - r + 6, cellY - r + 6, r * 2 - 12, r * 2 - 12);
            }
            ctx.restore();
            
            // 水波紋特效 (現在正確包在 if 內)
            ctx.strokeStyle = '#4A4A4A'; ctx.lineWidth = 1.5;
            for (let w = 0; w < monster.waveCount; w++) {
                let wy = cellY + 14 + (w * 5); ctx.beginPath();
                for (let wx = cellX - r; wx <= cellX + r; wx += 5) {
                    let waveY = wy + Math.sin(wx * 0.15 + waveOffset) * 1.5;
                    if (wx === cellX - r) ctx.moveTo(wx, waveY); else ctx.lineTo(wx, waveY);
                }
                ctx.stroke();
            }
        } else {
            ctx.fillStyle = 'rgba(74,74,74,0.3)'; ctx.font = 'bold 22px "Comic Sans MS", sans-serif';
            ctx.fillText("?", cellX - 6, cellY + 8);
        }
        
        // 名字顯示
        ctx.fillStyle = '#4A4A4A'; ctx.font = 'bold 14px "Microsoft JhengHei", sans-serif';
        let nameToDisplay = monster.unlocked ? monster.label : "???";
        ctx.fillText(nameToDisplay, cellX - ctx.measureText(nameToDisplay).width / 2, cellY + r + 20);
    }
}

function renderPreceptPage() {

let tY = 115;

ctx.fillStyle = (sub结Mode === '卷軸') ? '#FFFEE0' : '#EAEAEA';

ctx.fillRect(35, tY - 32, 160, 32);

drawCuteLine(35, tY - 32, 195, tY - 32, (sub结Mode === '卷軸') ? 2.5 : 1.5);

drawCuteLine(195, tY - 32, 195, tY, (sub结Mode === '卷軸') ? 2.5 : 1.5);

drawCuteLine(195, tY, 35, tY, 2.5);

drawCuteLine(35, tY, 35, tY - 32, (sub结Mode === '卷軸') ? 2.5 : 1.5);


ctx.fillStyle = (sub结Mode === '平衡儀') ? '#FFF5B7' : '#EAEAEA';

ctx.fillRect(205, tY - 32, 160, 32);

drawCuteLine(205, tY - 32, 365, tY - 32, (sub结Mode === '平衡儀') ? 2.5 : 1.5);

drawCuteLine(365, tY - 32, 365, tY, (sub结Mode === '平衡儀') ? 2.5 : 1.5);

drawCuteLine(365, tY, 205, tY, 2.5);

drawCuteLine(205, tY, 205, tY - 32, (sub结Mode === '平衡儀') ? 2.5 : 1.5);



ctx.fillStyle = '#4A4A4A'; ctx.font = 'bold 13px "Microsoft JhengHei", sans-serif';

ctx.fillText("修煉戒律卷軸", 72, tY - 11); ctx.fillText("平衡儀", 265, tY - 11);



if (sub结Mode === '卷軸') {

let sx1 = 50, sy1 = 150, sw = 135, sh = 300;

ctx.save(); ctx.fillStyle = '#FCF8F2'; drawScrollPaperPath(sx1, sy1, sw, sh); ctx.fill(); ctx.lineWidth = 2.5; ctx.strokeStyle = '#4A4A4A'; ctx.stroke();

ctx.fillStyle = '#D2B48C'; ctx.fillRect(sx1 - 4, sy1 - 12, sw + 8, 12); ctx.fillRect(sx1 - 4, sy1 + sh, sw + 8, 12);

drawCuteLine(sx1 - 4, sy1, sx1 + sw + 4, sy1, 1.5); drawCuteLine(sx1 - 4, sy1 + sh, sx1 + sw + 4, sy1 + sh, 1.5);

ctx.fillStyle = '#4A4A4A'; ctx.font = 'bold 14px "Microsoft JhengHei", sans-serif'; ctx.fillText("【禁慾戒律】", sx1 + 25, sy1 + 40);

ctx.font = '12px "Microsoft JhengHei", sans-serif'; ctx.fillText("・ 飲品上限: 5次", sx1 + 15, sy1 + 85); ctx.fillText("・ 娛樂上限: 3次", sx1 + 15, sy1 + 125); ctx.fillText("・ 購物上限: 2次", sx1 + 15, sy1 + 165);

ctx.fillStyle = '#4A4A4A'; ctx.beginPath(); ctx.arc(sx1 + 22, sy1 + sh - 25, 16, 0, Math.PI *2); ctx.fill(); drawCuteCircle(sx1 + 22, sy1 + sh - 25, 16, 2, '#FFFFFF');

ctx.fillStyle = '#FFFFFF'; ctx.font = 'bold 13px "Microsoft JhengHei", sans-serif'; ctx.fillText("禁", sx1 + 16, sy1 + sh - 21);

if (scrollSeal禁Stamped) { ctx.fillStyle = 'rgba(255, 107, 107, 0.7)'; ctx.beginPath(); ctx.arc(sx1 + sw - 28, sy1 + sh - 32, 18, 0, Math.PI* 2); ctx.fill(); ctx.fillStyle = '#7A001E'; ctx.font = 'bold 11px "Microsoft JhengHei", sans-serif'; ctx.fillText("律令", sx1 + sw - 39, sy1 + sh - 28); }

ctx.restore();



let sx2 = 215, sy2 = 135;

ctx.save(); ctx.fillStyle = '#FCF8F2'; drawScrollPaperPath(sx2, sy2, sw, sh); ctx.fill(); ctx.lineWidth = 2.5; ctx.strokeStyle = '#4A4A4A'; ctx.stroke();

ctx.fillStyle = '#D2B48C'; ctx.fillRect(sx2 - 4, sy2 - 12, sw + 8, 12); ctx.fillRect(sx2 - 4, sy2 + sh, sw + 8, 12);

drawCuteLine(sx2 - 4, sy2, sx2 + sw + 4, sy2, 1.5); drawCuteLine(sx2 - 4, sy2 + sh, sx2 + sw + 4, sy2 + sh, 1.5);

ctx.fillStyle = '#4A4A4A'; ctx.font = 'bold 14px "Microsoft JhengHei", sans-serif'; ctx.fillText("【天道酬勤】", sx2 + 25, sy2 + 40);

ctx.font = '12px "Microsoft JhengHei", sans-serif'; ctx.fillText("・ 理性食記: 10次", sx2 + 15, sy2 + 85); ctx.fillText("・ 醫療剛需: 5次", sx2 + 15, sy2 + 125); ctx.fillText("・ 儲蓄增長: 15%", sx2 + 15, sy2 + 165);

ctx.fillStyle = '#4A4A4A'; ctx.beginPath(); ctx.arc(sx2 + sw - 22, sy2 + 25, 16, 0, Math.PI *2); ctx.fill(); drawCuteCircle(sx2 + sw - 22, sy2 + 25, 16, 2, '#FFFFFF');

ctx.fillStyle = '#FFFFFF'; ctx.font = 'bold 13px "Microsoft JhengHei", sans-serif'; ctx.fillText("獎", sx2 + sw - 28, sy2 + 29);

if (scrollSeal獎Stamped) { ctx.fillStyle = 'rgba(255, 107, 107, 0.7)'; ctx.beginPath(); ctx.arc(sx2 + sw - 32, sy2 + sh - 32, 18, 0, Math.PI* 2); ctx.fill(); ctx.fillStyle = '#7A001E'; ctx.font = 'bold 11px "Microsoft JhengHei", sans-serif'; ctx.fillText("生效", sx2 + sw - 43, sy2 + sh - 28); }

ctx.restore();

}



if (sub结Mode === '平衡儀') {

let cx = canvas.width / 2; let cy = canvas.height / 2 + 32;

ctx.fillStyle = 'rgba(74, 74, 74, 0.05)'; ctx.beginPath(); ctx.arc(cx, cy, 5, 0, Math.PI *2); ctx.fill(); drawCuteCircle(cx, cy, 5, 1.5, '#4A4A4A');

balanceEcosystem.forEach((item, i) => {

item.currentR = 75 + (item.budget / 300) * 135; item.x = cx + Math.cos(item.angle) * item.currentR; item.y = cy + Math.sin(item.angle) * item.currentR;

drawCuteLine(cx, cy, item.x, item.y, 1.5, 'rgba(74, 74, 74, 0.35)');

ctx.fillStyle = item.color; ctx.beginPath(); ctx.arc(item.x, item.y, 30, 0, Math.PI* 2); ctx.fill();

let borderThickness = 2; let borderColor = '#4A4A4A';

if (item.budget < 40) { borderColor = '#A0A0A0'; borderThickness = 1.2; }

else if (item.budget > 220) { borderColor = '#FF3366'; borderThickness = 3; if (Math.random() < 0.15) { particles.push({ x: item.x + (Math.random() - 0.5) * 20, y: item.y - 12, vx: (Math.random() - 0.5) * 0.6, vy: -0.8, alpha: 0.8, size: 2, color: '#FF3366' }); } }

drawCuteCircle(item.x, item.y, 30, borderThickness, borderColor);

ctx.fillStyle = '#4A4A4A'; ctx.font = 'bold 13px "Microsoft JhengHei", sans-serif'; ctx.fillText(item.label, item.x - 7, item.y + 5);

ctx.font = '10px "Comic Sans MS", sans-serif'; ctx.fillText(Math.round(item.budget), item.x - 10, item.y - 24);

});

}

}



// 全新的社群重構渲染區

function renderSocialPage() {

let boardX = 40, boardY = 110, boardW = 320, boardH = 195;

let shakeX = 0; if (boardShockTimer > 0) { shakeX = Math.sin(boardShockTimer * 0.6) * 3; boardShockTimer--; }



drawCuteLine(boardX + 25, boardY + boardH, boardX + 25, canvas.height - 130, 4.5, '#7A583A');

drawCuteLine(boardX + boardW - 25, boardY + boardH, boardX + boardW - 25, canvas.height - 130, 5, '#7A583A');


ctx.fillStyle = '#E3D5CA'; ctx.fillRect(boardX + shakeX, boardY, boardW, boardH);

drawCuteLine(boardX + shakeX, boardY, boardX + boardW + shakeX, boardY, 3);

drawCuteLine(boardX + boardW + shakeX, boardY, boardX + boardW + shakeX, boardY + boardH, 3);

drawCuteLine(boardX + boardW + shakeX, boardY + boardH, boardX + shakeX, boardY + boardH, 3);

drawCuteLine(boardX + shakeX, boardY + boardH, boardX + shakeX, boardY, 3);



ctx.fillStyle = '#FCF8F2'; ctx.save(); ctx.translate(shakeX, 0); ctx.beginPath(); drawScrollPaperPath(boardX + 14, boardY + 14, boardW - 28, boardH - 28); ctx.fill(); ctx.stroke();


ctx.fillStyle = '#4A4A4A';

if (socialTab === '排行榜') {

ctx.font = 'bold 15px "Microsoft JhengHei", sans-serif'; ctx.fillText("🏆 全體好友修行排行榜", boardX + 32, boardY + 40);

ctx.font = '12px "Microsoft JhengHei", sans-serif';

friendRankings.forEach((f, idx) => {

let fy = boardY + 72 + idx * 26; ctx.fillStyle = '#4A4A4A';

ctx.fillText(`${f.rank}. ${f.icon} ${f.name}`, boardX + 32, fy);

ctx.fillStyle = '#4E9F3D'; ctx.fillText("生存 " + f.days + " 天", boardX + boardW - 105, fy);

});

} else {

ctx.font = 'bold 15px "Microsoft JhengHei", sans-serif'; ctx.fillText("📜 好友妖怪動態牆 (公會即時因果)", boardX + 32, boardY + 40);

ctx.font = '12px "Microsoft JhengHei", sans-serif';

guildFeeds.forEach((feed, idx) => {

let fy = boardY + 74 + idx * 28; ctx.fillStyle = (feed.style === 'curse') ? '#FF5252' : '#4A4A4A';

ctx.fillText(feed.text, boardX + 32, fy);

});

}

ctx.restore();



if (ghostHideTimer > 0) ghostHideTimer--;

if (tagHangingShock !== 0) tagHangingShock *= -0.82; if (Math.abs(tagHangingShock) < 0.1) tagHangingShock = 0;



let lpx = 85, lpy = 365;

drawCuteLine(lpx, lpy - 40, lpx + 2, lpy - 4, 3, '#D7C49E');

ctx.fillStyle = (socialTab === '排行榜') ? '#CDA45E' : '#E6CD9C';

ctx.fillRect(lpx - 45, lpy - 30, 90, 26);

drawCuteLine(lpx - 45, lpy - 30, lpx + 45, lpy - 30, 2);

drawCuteLine(lpx + 45, lpy - 30, lpx + 45, lpy - 4, 2);

drawCuteLine(lpx + 45, lpy - 4, lpx - 45, lpy - 4, 2);

drawCuteLine(lpx - 45, lpy - 4, lpx - 45, lpy - 30, 2);

ctx.fillStyle = '#4A4A4A'; ctx.font = 'bold 12px "Microsoft JhengHei", sans-serif';

ctx.fillText("排行榜", lpx - 18, lpy - 12);



let rpx = 285, rpy = 365;

drawCuteLine(rpx, rpy - 40, rpx + 2, rpy - 4, 3, '#D7C49E');

ctx.fillStyle = (socialTab === '動態') ? '#CDA45E' : '#E6CD9C';

ctx.fillRect(rpx - 55, rpy - 30, 110, 26);

drawCuteLine(rpx - 55, rpy - 30, rpx + 55, rpy - 30, 2);

drawCuteLine(rpx + 55, rpy - 30, rpx + 55, rpy - 4, 2);

drawCuteLine(rpx + 55, rpy - 4, rpx - 55, rpy - 4, 2);

drawCuteLine(rpx - 55, rpy - 4, rpx - 55, rpy - 30, 2);

ctx.fillStyle = '#4A4A4A'; ctx.font = 'bold 12px "Microsoft JhengHei", sans-serif';

ctx.fillText("好友動態牆", rpx - 30, rpy - 12);



if (socialTab === '排行榜' && ghostHideTimer === 0) {

let ghostFloat = Math.sin(Date.now() * 0.005) * 2.5;

ctx.save(); ctx.fillStyle = '#FFFFFF'; ctx.globalAlpha = 0.92; ctx.beginPath(); ctx.arc(lpx - 32, lpy - 34 + ghostFloat, 9, Math.PI, 0, false); ctx.lineTo(lpx - 23, lpy - 29 + ghostFloat); ctx.lineTo(lpx - 41, lpy - 29 + ghostFloat); ctx.closePath(); ctx.fill();

ctx.fillStyle = '#000000'; ctx.beginPath(); ctx.arc(lpx - 35, lpy - 36 + ghostFloat, 1.5, 0, Math.PI *2); ctx.arc(lpx - 29, lpy - 36 + ghostFloat, 1.5, 0, Math.PI* 2); ctx.fill(); ctx.restore();

}



let branchY = lpy + 8; drawCuteLine(boardX + 20, branchY, boardX + boardW - 20, branchY, 2);

ctx.save(); ctx.translate(boardX + boardW/2, branchY); ctx.rotate(tagHangingShock * Math.PI / 180);

let t1x = -26, t1y = 22; ctx.strokeStyle = '#757575'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(t1x, t1y - 12, 3, 0, Math.PI *2); ctx.stroke(); ctx.fillStyle = '#E8C547'; ctx.beginPath(); ctx.arc(t1x, t1y, 11, 0, Math.PI* 2); ctx.fill(); drawCuteCircle(t1x, t1y, 11, 1.5); ctx.fillStyle = '#4A4A4A'; ctx.font = 'bold 11px "Comic Sans MS", sans-serif'; ctx.fillText("1", t1x - 3, t1y + 4);

let t2x = 0, t2y = 24; ctx.beginPath(); ctx.arc(t2x, t2y - 12, 3, 0, Math.PI *2); ctx.stroke(); ctx.fillStyle = '#C0C0C0'; ctx.beginPath(); ctx.arc(t2x, t2y, 11, 0, Math.PI* 2); ctx.fill(); drawCuteCircle(t2x, t2y, 11, 1.5); ctx.fillStyle = '#4A4A4A'; ctx.fillText("2", t2x - 3, t2y + 4);

let t3x = 26, t3y = 22; ctx.beginPath(); ctx.arc(t3x, t3y - 12, 3, 0, Math.PI *2); ctx.stroke(); ctx.fillStyle = '#CD7F32'; ctx.beginPath(); ctx.arc(t3x, t3y, 11, 0, Math.PI* 2); ctx.fill(); drawCuteCircle(t3x, t3y, 11, 1.5); ctx.fillStyle = '#4A4A4A'; ctx.fillText("3", t3x - 3, t3y + 4);

ctx.restore();

}



function renderTrialBattlefield() {

ctx.fillStyle = '#1A1822'; ctx.fillRect(0,0,canvas.width,canvas.height);

let bx = 30, by = 80, bw = 340, bh = 140;

ctx.fillStyle = '#FFFFFF'; ctx.fillRect(bx, by, bw, bh);

drawCuteLine(bx, by, bx+bw, by, 3); drawCuteLine(bx+bw, by, bx+bw, by+bh, 3); drawCuteLine(bx+bw, by+bh, bx, by+bh, 3); drawCuteLine(bx, by+bh, bx, by, 3);


ctx.fillStyle = '#FF5252'; ctx.font = 'bold 16px "Microsoft JhengHei", sans-serif'; ctx.fillText("⚔️ 遭遇突襲！飛升試煉降臨", bx + 20, by + 35);


ctx.fillStyle = '#4A4A4A'; ctx.font = '12px "Microsoft JhengHei", sans-serif';

ctx.fillText(trialScenarios[trialIndex].question.substring(0, 25), bx + 20, by + 75);

ctx.fillText(trialScenarios[trialIndex].question.substring(25), bx + 20, by + 100);



let ax = 70, ay = 280, ar = 24;

let bx2 = 70, by2 = 360;



ctx.fillStyle = '#B5EAD7'; ctx.beginPath(); ctx.arc(ax, ay, ar, 0, Math.PI*2); ctx.fill(); drawCuteCircle(ax, ay, ar, 2.5);

ctx.fillStyle = '#4A4A4A'; ctx.font = 'bold 16px "Microsoft JhengHei", sans-serif'; ctx.fillText("A", ax - 6, ay + 6);

ctx.font = '12px "Microsoft JhengHei", sans-serif'; ctx.fillText(trialScenarios[trialIndex].answerA, ax + 35, ay + 5);



ctx.fillStyle = '#FFB7B2'; ctx.beginPath(); ctx.arc(bx2, by2, ar, 0, Math.PI*2); ctx.fill(); drawCuteCircle(bx2, by2, ar, 2.5);

ctx.fillStyle = '#4A4A4A'; ctx.font = 'bold 16px "Microsoft JhengHei", sans-serif'; ctx.fillText("B", bx2 - 6, by2 + 6);

ctx.fillStyle = '#4A4A4A'; ctx.font = '12px "Microsoft JhengHei", sans-serif';

ctx.fillText(trialScenarios[trialIndex].answerB, bx2 + 35, by2 + 5);



let skX = 295, skY = 515, skW = 85, skH = 28;

ctx.fillStyle = '#EAEAEA'; ctx.fillRect(skX, skY, skW, skH);

drawCuteLine(skX, skY, skX + skW, skY, 2);

drawCuteLine(skX + skW, skY, skX + skW, skY + skH, 2);

drawCuteLine(skX + skW, skY + skH, skX, skY + skH, 2);

drawCuteLine(skX, skY + skH, skX, skY, 2);

ctx.fillStyle = '#757575'; ctx.font = 'bold 12px "Microsoft JhengHei", sans-serif';

ctx.fillText("⏩ 跳過試煉", skX + 10, skY + 18);



if (trialFeedbackTimer > 0) {

ctx.fillStyle = 'rgba(255,255,255,0.95)'; ctx.fillRect(40, 440, 320, 50);

drawCuteLine(40,440,360,440,2); drawCuteLine(40,490,360,490,2);

ctx.fillStyle = '#7A001E'; ctx.font = 'bold 12px "Microsoft JhengHei", sans-serif'; ctx.fillText(trialFeedbackText, 55, 470);

trialFeedbackTimer--; if (trialFeedbackTimer === 0) appState = 'MAIN';

}

}



// ==========================================

// --- 6. 主循環總控系統 ---

// ==========================================

function render() {

ctx.fillStyle = '#FDFAF6'; ctx.fillRect(0, 0, canvas.width, canvas.height);

const cx = canvas.width / 2; const cy = canvas.height / 2 - 25;



if (appState === 'TRIAL') {

renderTrialBattlefield();

} else {

if (currentPage === '帳') renderLedgerPage();

else if (currentPage === '修') renderPracticePage(cx, cy);

else if (currentPage === '圖') renderGalleryPage();

else if (currentPage === '結') renderPreceptPage();

else if (currentPage === '社') renderSocialPage();

}



drawCommonUI();

requestAnimationFrame(render);

}



// ==========================================

// --- 7. 全域互動滑鼠與觸控事件監聽器 ---

// ==========================================

canvas.addEventListener('mousedown', function(e) {

const rect = canvas.getBoundingClientRect();

const mx = e.clientX - rect.left; const my = e.clientY - rect.top;

if (currentPage === '結' && sub结Mode === '平衡儀' && appState === 'MAIN') {

for (let i = 0; i < 10; i++) {

let item = balanceEcosystem[i]; if (Math.hypot(mx - item.x, my - item.y) < 30) { draggedCircleIndex = i; break; }

}

}

});



canvas.addEventListener('mousemove', function(e) {

if (draggedCircleIndex !== -1 && currentPage === '結' && sub结Mode === '平衡儀' && appState === 'MAIN') {

const rect = canvas.getBoundingClientRect();

const mx = e.clientX - rect.left; const my = e.clientY - rect.top;

let cx = canvas.width / 2; let cy = canvas.height / 2 + 32;

let dist = Math.hypot(mx - cx, my - cy);

let targetBudget = Math.round((dist - 75) / 135 * 300);

updateEcosystem守恆(draggedCircleIndex, targetBudget);

}

});



window.addEventListener('mouseup', function() { draggedCircleIndex = -1; });



canvas.addEventListener('dblclick', function(e) {

if (currentPage === '結' && sub结Mode === '平衡儀' && appState === 'MAIN') {

const rect = canvas.getBoundingClientRect();

const mx = e.clientX - rect.left; const my = e.clientY - rect.top;

let cx = canvas.width / 2; let cy = canvas.height / 2 + 32;

if (Math.hypot(mx - cx, my - cy) < 20) { initBalanceEcosystem(); dailyBudget = 400; }

}

});



canvas.addEventListener('click', function(e) {

const rect = canvas.getBoundingClientRect();

const mx = e.clientX - rect.left; const my = e.clientY - rect.top;



if (appState === 'TRIAL') {

let ax = 70, ay = 280, bx2 = 70, by2 = 360, ar = 24;

if (Math.hypot(mx - ax, my - ay) < ar) {

trialFeedbackText = trialScenarios[trialIndex].feedbackA;

trialFeedbackTimer = 180;

return;

}

if (Math.hypot(mx - bx2, my - by2) < ar) {

trialFeedbackText = trialScenarios[trialIndex].feedbackB;

trialFeedbackTimer = 180;

return;

}

let skX = 295, skY = 515, skW = 85, skH = 28;

if (mx > skX && mx < skX + skW && my > skY && my < skY + skH) {

appState = 'MAIN';

return;

}

return;

}



if (appState === 'MONTH_AWAKE' && currentPage === '帳') {

if (mx > 60 && mx < 190 && my > 380 && my < 412) {

if (awakeReportStatus === 'LOSE') { currentPage = '結'; sub结Mode = '平衡儀'; }

appState = 'MAIN';

}

if (mx > 210 && mx < 340 && my > 380 && my < 412) {

exportKarmaReportPDF();

}

return;

}



let clickedNav = false;

navButtons.forEach(btn => {

if (Math.hypot(mx - btn.x, my - btn.y) < btn.r) {

if (['修', '圖', '帳', '結', '社'].includes(btn.label)) {

currentPage = btn.label; clickedNav = true;

dropdownOpen = false; activeLedgerIndex = -1; activeLedgerDialogue = "";

infoAlertText = ""; infoAlertTimer = 0; draggedCircleIndex = -1;

boardShockTimer = 0; ghostHideTimer = 0;

if (currentPage === '修') introProgress = 0;

if (currentPage === '修' && Math.random() < 0.25) {

appState = 'TRIAL';

trialIndex = Math.floor(Math.random() * trialScenarios.length);

}

}

}

});

if (clickedNav) return;



if (currentPage === '社') {

let boardX = 40, boardY = 110, boardW = 320, boardH = 195;

if (mx > 40 && mx < 130 && my > 335 && my < 361) {

boardShockTimer = 15; ghostHideTimer = 0; tagHangingShock = 35;

socialTab = '排行榜';

return;

}

if (mx > 230 && mx < 340 && my > 335 && my < 361) {

boardShockTimer = 15; ghostHideTimer = 90; tagHangingShock = -35;

socialTab = '動態';

return;

}

if (mx > boardX + 12 && mx < boardX + boardW - 12 && my > boardY + 12 && my < boardY + boardH - 12) {

boardShockTimer = 20;

alert(`🔮【因果窺探鏡】當前觀看：${socialTab} ｜ 全體公會道友靈力穩定維持中。`);

return;

}

}



if (currentPage === '結') {

let tY = 115;

if (mx > 35 && mx < 195 && my > tY - 32 && my < tY) { sub结Mode = '卷軸'; return; }

if (mx > 205 && mx < 365 && my > tY - 32 && my < tY) { sub结Mode = '平衡儀'; return; }

if (sub结Mode === '卷軸') {

let sx1 = 50, sy1 = 150, sw = 135, sh = 300;

if (Math.hypot(mx - (sx1 + 22), my - (sy1 + sh - 25)) < 16) { scrollSeal禁Stamped = !scrollSeal禁Stamped; return; }

let sx2 = 215, sy2 = 135;

if (Math.hypot(mx - (sx2 + sw - 22), my - (sy2 + 25)) < 16) { scrollSeal獎Stamped = !scrollSeal獎Stamped; return; }

}

}



if (currentPage === '帳') {

let stats = getLedgerStats(); let bx = canvas.width / 2;

if (mx > 140 && mx < 260 && my > 296 && my < 322) { balanceShockTimer = 40; awakeReportStatus = (stats.needTotal >= stats.wantTotal) ? "WIN" : "LOSE"; appState = 'MONTH_AWAKE'; return; }

if (dropdownOpen) {

let dy = 334 + 6; let dropW = 120; let dropX = pX + 75;

if (mx > dropX && mx < dropX + dropW && my > dy && my < dy + 78) {

ledgerTab = (my < dy + 26) ? '全部支出' : (my < dy + 52) ? '需要支出' : '想要支出';

dropdownOpen = false; activeLedgerIndex = -1; activeLedgerDialogue = ""; return;

}

dropdownOpen = false; return;

}

if (my > 70 && my < 140 && (mx < 100 || mx > 300 || (my < 110))) { if (Math.hypot(mx - bx, my - 107) > 15) { balanceShockTimer = 30; return; } }

if (my > 110 && my < 155) { if ((mx > 80 && mx < 135) || (mx > 265 && mx < 320)) { alert(`【天秤古籍】內心欲望已傾斜 ${stats.wantPercent}%...`); return; } }

let rcx = 45 + 310 / 2, rcy = 175 + 115 / 2;

if (Math.hypot(mx - rcx, my - rcy) < 42) { ringShockTimer = 25; alert(`【修行警示】本月破產赤字界線還剩：$${15000 - stats.grandTotal}元。`); return; }

if (mx > 45 && mx < 250 && my > 334 - 15 && my < 334 + 10) { dropdownOpen = true; return; }


let lY = 334; let rowH = 25;

let activeData = (ledgerTab === '全部支出') ? needLedgerData : (ledgerTab === '需要支出') ? needLedgerData : wantLedgerData;

for (let i = 0; i < 5; i++) {

let itemY = lY + 18 + i * rowH;

if (mx > 45 && mx < 355 && my > itemY - 12 && my < itemY + 14) {

if (activeLedgerIndex === i) { activeLedgerIndex = -1; activeLedgerDialogue = ""; }

else { activeLedgerIndex = i; activeLedgerDialogue = (ledgerTab === '全部支出') ? (needLedgerData[i].amount >= wantLedgerData[i].amount ? needLedgerData[i].dialogue : wantLedgerData[i].dialogue) : activeData[i].dialogue; }

return;

}

}

}



if (currentPage === '修') {

let cx = canvas.width / 2; let cy = canvas.height / 2 - 25;

if (mx > 120 && mx < 280 && my > 100 && my < 120) { userSchool = (userSchool === '鋼鐵自律') ? '數據分析' : (userSchool === '數據分析') ? '家族守護' : '鋼鐵自律'; triggerFoxSpeech('開期'); return; }

if (Math.hypot(mx - cx, my - cy) < 95) { triggerFoxSpeech('開期'); return; }

if (appState === 'JUDGMENT') {

let jcx = canvas.width / 2; let jcy = canvas.height / 2;

if (Math.hypot(mx - (jcx - 45), my - (jcy + 40)) < 25) { totalAmount = Math.max(0, totalAmount - (parseInt(currentTypedAmount) || 150)); triggerFoxSpeech('微'); currentTypedAmount = ""; currentTypedNote = ""; currentSelectedText = ""; appState = 'MAIN'; }

if (Math.hypot(mx - (jcx + 45), my - (jcy + 40)) < 25) { totalAmount = Math.max(0, totalAmount - (parseInt(currentTypedAmount) || 150)); triggerFoxSpeech('想'); currentTypedAmount = ""; currentTypedNote = ""; currentSelectedText = ""; appState = 'MAIN'; }

return;

}

miniCircles.forEach(circle => {

let dist = Math.hypot(mx - circle.x, my - circle.y);

if (dist < circle.r + 5 && introProgress >= 1) { circle.scale = 1.3; currentSelectedText = circle.label; currentTypedAmount = ""; currentTypedNote = ""; }

});

if (mx > 45 && mx < 265 && my > canvas.height - 150 && my < canvas.height - 98) {

if (mx < 140) currentTypedAmount = prompt("請輸入修煉金額：", "150") || "";

else currentTypedNote = prompt("請輸入修行備註：", "日常省思") || "";

}

if (Math.hypot(mx - 288, my - (canvas.height - 124)) < 11) { currentSelectedText = "飲"; currentTypedAmount = "65"; currentTypedNote = "仙草凍奶茶"; triggerFoxSpeech('想'); return; }

if (Math.hypot(mx - 325, my - (canvas.height - 124)) < 11) { if (currentTypedAmount) appState = 'JUDGMENT'; else alert("請先點選分類生靈填入數字！"); return; }

}



if (currentPage === '圖') {
    let tcy = 115;
    // 1. 偵測點擊「需」分頁頁籤 (x: 100~190)
    if (mx > 100 && mx < 190 && my > tcy - 35 && my < tcy) {
        currentTab = '需';
        infoAlertText = ""; infoAlertTimer = 0;
        return;
    }
    // 2. 偵測點擊「想」分頁頁籤 (x: 210~300)
    if (mx > 210 && mx < 300 && my > tcy - 35 && my < tcy) {
        currentTab = '想';
        infoAlertText = ""; infoAlertTimer = 0;
        return;
    }

    // 3. 偵測點擊九宮格妖怪圓圈
    let startX = 75, startY = 180, gap = 125;
    let list = (currentTab === '需') ? needMonsters : wantMonsters;

    for (let i = 0; i < 9; i++) {
        let row = Math.floor(i / 3), col = i % 3;
        let cellX = startX + col * gap, cellY = startY + row * gap;

        // 使用數學距離公式判斷是否點擊到該妖怪圓圈 (半徑 r=38)
        if (Math.hypot(mx - cellX, my - cellY) < 38) {
            let monster = list[i];

            if (monster.unlocked) {
                // 🚀【已解鎖】：產生震動效果，並震盪出名字與詳細修行簡介彈窗
                shockMonsterIndex = i;
                shockTimer = 25;
                
                // 完美的介紹排版彈窗
                alert(`📜 【因果圖鑑 ｜ ${monster.label}】\n\n介紹：${monster.desc}`);
            } else {
                // 🔒【鎖定狀態】：直接跳出警示提示
                alert("【系統提示】還未解鎖喔！\n請繼續維持良好的因果記帳習慣來驅散迷霧吧！");
                infoAlertText = monster.hint;
                infoAlertTimer = 180;
            }
            break; // 成功點擊一隻後即跳出迴圈
        }
    }
} // 🚀 這裡只有一個 }，完美閉合 currentPage === '圖'，絕不溢出！
})



// ==========================================

// --- 8. 🔮 因果大敕令：三章大一統 PDF 冥卷生成大陣 ---

// ==========================================

function exportKarmaReportPDF() {

const { jsPDF } = window.jspdf;

const doc = new jsPDF('p', 'mm', 'a4');

let stats = getLedgerStats();



doc.setFillColor(252, 248, 242); doc.rect(0, 0, 210, 297, 'F');

doc.setDrawColor(74, 74, 74); doc.setLineWidth(1); doc.rect(10, 10, 190, 277, 'S');



doc.setTextColor(122, 0, 30); doc.setFont("Helvetica", "bold"); doc.setFontSize(22);

doc.text("妖怪修煉場 ｜ 月度業力因果覺醒冥卷", 32, 28);

doc.setDrawColor(122, 0, 30); doc.setLineWidth(0.5); doc.line(20, 34, 190, 34);



doc.setTextColor(74, 74, 74); doc.setFontSize(14); doc.text("【第一章：善惡審判】", 20, 48);


let tiltOffset = ((stats.wantPercent - stats.needPercent) / 100) * 15;

doc.setDrawColor(100, 100, 100); doc.setLineWidth(0.8);

doc.line(105, 58, 105, 80);

doc.line(70, 68 - tiltOffset, 140, 68 + tiltOffset);

doc.line(70, 68 - tiltOffset, 65, 78); doc.line(70, 68 - tiltOffset, 75, 78);

doc.line(140, 68 + tiltOffset, 135, 78); doc.line(140, 68 + tiltOffset, 145, 78);

doc.setFillColor(200, 200, 200); doc.ellipse(70, 78, 12, 2, 'F'); doc.ellipse(140, 78, 12, 2, 'F');



doc.setFontSize(11);

doc.text(`本月消耗靈石總計：$${stats.grandTotal} 元`, 25, 92);

doc.setTextColor(74, 144, 226); doc.text(`守護靈【需要】正氣佔比：${stats.needPercent} %`, 25, 100);

doc.setTextColor(255, 107, 107); doc.text(`欲望魔【想要】業障佔比：${stats.wantPercent} %`, 25, 108);



doc.setTextColor(122, 0, 30); doc.text("守護神狐仙敕令點評：", 25, 118);

doc.setTextColor(74, 74, 74);

let appText = "";

if (userSchool === '鋼鐵自律') {

appText = `「自律流省思：道友本月讓『想要』的比例佔了 ${stats.wantPercent}%，手顯然有些發癢！\n 再去平衡花園亂拉果實，下個月天秤徹底翻倒，財庫將原地崩毀！」`;

} else if (userSchool === '數據分析') {

appText = `「分析流省思：理性靈力佔比為 ${stats.needPercent}%，因果結構尚算工整。\n 你成功以數據天秤壓制了無明衝動心魔，實乃公會合格的清心居士。」`;

} else {

appText = `「守護流省思：本月平平安安地扣鎖財庫，阻絕了大部分的貪戀業障。\n 穩紮穩打守住當下，月底才能幫神器進行完美淬火。」`;

}

doc.text(appText, 25, 126);



doc.setFontSize(14); doc.text("【第二章：百妖現形】", 20, 150);


doc.setDrawColor(180, 180, 180); doc.setLineDashPattern([2, 2], 0); doc.rect(30, 160, 50, 40, 'S');

doc.setDrawColor(74, 74, 74); doc.setLineDashPattern([], 0); doc.setLineWidth(0.6);

doc.rect(28 + Math.random()*4, 162 + Math.random()*3, 52, 36, 'S');



let worstWant = wantLedgerData.reduce((max, item) => item.amount > max.amount ? item : max, wantLedgerData[0]);

let monsterName = worstWant.amount > 0 ? "欲望妖怪・癮癮" : "官方貪嘴饞饞";

if (worstWant.label === "消費") monsterName = "衝動剁手怪";

if (worstWant.label === "食物") monsterName = "暴食大魔王";



doc.setFontSize(11); doc.setTextColor(122, 0, 30);

doc.text(`🚨 本月重災區特寫：【一級通緝 ｜ ${monsterName}】`, 95, 166);

doc.setTextColor(74, 74, 74);

let monsterReport = worstWant.amount > 0 ?

`「此妖本月在『${worstWant.label}』類別被你瘋狂餵食了 ${worstWant.count} 次！\n 牠貪婪地吸飽了你整整 $${worstWant.amount} 元的荷包靈力，體型暴增 200%。\n 因為道友在衝動與破戒之下的餵食，牠已成功啃食了你\n 多天的預估生存壽命，請道友立馬去花園調低預算！」` :

`「本月尚未遭遇巨型欲望魔暴走，守護米寶與水靈安全流轉。\n 但不可掉以輕心，各類別的心魔依然在暗處窺伺你的業力天秤。」`;

doc.text(monsterReport, 95, 176);



doc.setFontSize(14); doc.text("【第三章：下月修煉契約】", 20, 222);

doc.setFontSize(11);

doc.text("・百妖圖鑑解鎖進度：本月成功收服理性生靈，當前靈力防禦塔運作良好。", 25, 232);


let nextMonthGuide = stats.wantPercent > 40 ?

"經系統因果預測，你下個月的物慾有黑化風險。\n敕令：下月平衡儀預算下調 15%，並在戒律卷軸中追加 2 次禁令！" :

"因果流轉穩定。下月修行指引：維持當前平衡結界，容許追加 1 次剛需法器購置。";

doc.setTextColor(122, 0, 30); doc.text("下月修行指引：", 25, 242);

doc.setTextColor(74, 74, 74); doc.text(nextMonthGuide, 25, 250);



doc.setDrawColor(150, 150, 150); doc.setLineDashPattern([3, 3], 0); doc.rect(20, 264, 170, 18, 'S');

doc.setLineDashPattern([], 0); doc.setTextColor(122, 0, 30); doc.setFontSize(11);

doc.text("「修行不可欺心，立字為據。」", 25, 271);

doc.setTextColor(74, 74, 74); doc.text("修行者法號(簽名): ____________________", 25, 278);

doc.setTextColor(122, 0, 30); doc.text("守護神狐仙敕印：[ 留白處 ]", 132, 278);



doc.save(`妖怪修煉場-月度業力報告-${awakeReportStatus}.pdf`);

}



initLayout();
triggerFoxSpeech('開期');
render();
