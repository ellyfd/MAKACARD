const fs = require("fs");
const path = require("path");

const files = process.argv.slice(2);

const people = {
  "Adia Chien": "adia",
  "Alan Liu": "alan",
  "Alex": "alex",
  "Andy": "andy",
  "Andy Chen": "andy",
  "Chieh Hung": "chieh",
  "Debbie": "debbie",
  "Dianne": "dianne",
  "Doris": "doris",
  "Edison Chen": "edison",
  "Elly Cheng": "elly",
  "Emily Shen": "emily",
  "Jan Tu": "jan",
  "Jean Huang": "jean",
  "Karen King": "karen",
  "Rock Chu": "rock",
  "Rou Lin": "rou",
  "Sixian Wu": "sixian",
  "Tinley Wang": "tinley",
  "Vanessa": "vanessa",
  "Yoko": "yoko",
  "Yota Song": "yota"
};

const buckets = {
  question: /嗎|呢|是不是|可不可以|要不要|怎麼|為什麼|why|how|\?/i,
  clarify: /確認|對齊|釐清|意思是|所以|也就是|先知道|看一下|整理|summary/i,
  action: /要做|先做|上架|推進|處理|開始|交付|deadline|owner|下一步|follow/i,
  risk: /問題|風險|錯|不確定|怕|卡|delay|來不及|限制|不行|缺/i,
  data: /資料|數據|樣本|驗證|測試|分析|模型|平台|系統|GitHub|AI|prototype|demo/i,
  warmth: /謝謝|不好意思|可以|好啊|辛苦|拜拜|歡迎|沒關係|nice/i
};

const stats = {};

function ensure(id) {
  stats[id] ||= {
    turns: 0,
    chars: 0,
    files: new Set(),
    bucketCounts: Object.fromEntries(Object.keys(buckets).map((key) => [key, 0])),
    samples: []
  };
  return stats[id];
}

function parseLine(line) {
  const match = line.match(/(?:上午|下午)?\d{1,2}:\d{2}(?::\d{2})?\s+([^:：]{2,80}?)(?:\s+\([^)]*\))?:\s*(.+)$/);
  if (!match) return null;
  const speaker = match[1].trim();
  const text = match[2].trim();
  const mapped = Object.entries(people).find(([name]) => speaker.includes(name) || name.includes(speaker));
  if (!mapped) return null;
  return { id: mapped[1], speaker, text };
}

for (const file of files) {
  const content = fs.readFileSync(file, "utf8");
  for (const line of content.split(/\r?\n/)) {
    const parsed = parseLine(line);
    if (!parsed) continue;
    const person = ensure(parsed.id);
    person.turns += 1;
    person.chars += parsed.text.length;
    person.files.add(path.basename(file));
    for (const [bucket, pattern] of Object.entries(buckets)) {
      if (pattern.test(parsed.text)) person.bucketCounts[bucket] += 1;
    }
    if (person.samples.length < 3 && parsed.text.length > 18) {
      person.samples.push(parsed.text.slice(0, 100));
    }
  }
}

const result = Object.fromEntries(Object.entries(stats)
  .sort((a, b) => b[1].chars - a[1].chars)
  .map(([id, value]) => [id, {
    turns: value.turns,
    chars: value.chars,
    files: value.files.size,
    bucketRates: Object.fromEntries(Object.entries(value.bucketCounts).map(([key, count]) => [key, Number((count / Math.max(value.turns, 1)).toFixed(2))])),
    samples: value.samples
  }]));

console.log(JSON.stringify(result, null, 2));
