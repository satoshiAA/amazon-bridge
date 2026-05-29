export default function handler(req, res) {
  const { asin = "", name = "Amazon商品", price = "", img = "", tag = "" } = req.query;

  const amazonUrl = `https://www.amazon.co.jp/dp/${asin}?tag=${tag}`;
  const title     = `🟢【在庫復活】${name} | Amazon正規品`;
  const desc      = "Amazon.co.jp（正規）に在庫が入りました！定価販売確認済み。お早めに。";
  const imageUrl  = img || "";

  // ランダムでテーマを決定
  const theme     = Math.random() < 0.5 ? "dark" : "light";
  const isDark    = theme === "dark";

  // テーマ別カラー設定
  const colors = {
    bg:         isDark ? "#0f1117" : "#ffffff",
    text:       isDark ? "#ffffff" : "#111111",
    subtext:    isDark ? "#94a3b8" : "#666666",
    imgBg:      isDark ? "#1e2130" : "#f5f5f5",
    badgeBg:    "#22c55e",
    pricColor:  "#f97316",
    btnBg:      "#f97316",
    sellerText: isDark ? "#94a3b8" : "#666666",
    sellerSpan: "#22c55e",
    warnText:   isDark ? "#475569" : "#999999",
    border:     isDark ? "none" : "1px solid #e5e7eb",
  };

  // GASのWebアプリURLにアクセスログを送信
  const gasLogUrl = process.env.GAS_LOG_URL || "";

  const html = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta property="og:type"         content="website">
  <meta property="og:title"        content="${escHtml(title)}">
  <meta property="og:description"  content="${escHtml(desc)}">
  <meta property="og:image"        content="${escHtml(imageUrl)}">
  <meta name="twitter:card"        content="summary_large_image">
  <meta name="twitter:title"       content="${escHtml(title)}">
  <meta name="twitter:description" content="${escHtml(desc)}">
  <meta name="twitter:image"       content="${escHtml(imageUrl)}">
  <title>${escHtml(title)}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Hiragino Sans", sans-serif;
      background: ${colors.bg};
      color: ${colors.text};
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .container {
      text-align: center;
      padding: 40px 20px;
      max-width: 480px;
      width: 100%;
      ${isDark ? "" : "box-shadow: 0 2px 12px rgba(0,0,0,0.08); border-radius: 16px; margin: 20px;"}
    }
    .badge {
      display: inline-block;
      background: ${colors.badgeBg};
      color: #fff;
      font-size: 13px;
      font-weight: 700;
      padding: 4px 14px;
      border-radius: 20px;
      margin-bottom: 16px;
    }
    .product-image {
      width: 80vw;
      max-width: 360px;
      height: 80vw;
      max-height: 360px;
      object-fit: contain;
      border-radius: 12px;
      background: ${colors.imgBg};
      padding: 16px;
      margin: 0 auto 20px;
      display: block;
      ${isDark ? "" : "border: " + colors.border + ";"}
    }
    .product-name {
      font-size: 18px;
      font-weight: 700;
      line-height: 1.5;
      margin-bottom: 10px;
      color: ${colors.text};
    }
    .price {
      font-size: 28px;
      font-weight: 800;
      color: ${colors.pricColor};
      margin-bottom: 6px;
    }
    .seller {
      font-size: 13px;
      color: ${colors.sellerText};
      margin-bottom: 24px;
    }
    .seller span { color: ${colors.sellerSpan}; font-weight: 600; }
    .btn {
      display: block;
      background: ${colors.btnBg};
      color: #fff;
      font-size: 16px;
      font-weight: 700;
      padding: 14px 36px;
      border-radius: 8px;
      text-decoration: none;
      width: 100%;
      max-width: 360px;
      margin: 0 auto;
    }
    .warning {
      font-size: 11px;
      color: ${colors.warnText};
      margin-top: 16px;
    }
  </style>
</head>
<body>
<div class="container">
  <div class="badge">🟢 Amazon正規在庫 確認済み</div>
  <img
    class="product-image"
    src="${escHtml(imageUrl)}"
    alt="${escHtml(name)}"
    onerror="this.style.display='none'"
  >
  <div class="product-name">${escHtml(name)}</div>
  <div class="price">${escHtml(price)}</div>
  <div class="seller">販売元：<span>Amazon.co.jp（正規）</span></div>
  <a class="btn" href="${amazonUrl}" id="buyBtn">
    📱 Amazonアプリで開く
  </a>
  <div class="warning">
    ※ 在庫は予告なく終了する場合があります。<br>
    ※ 人気商品は数秒で売り切れる場合があります。<br>
    ※ 購入前に販売元が「Amazon.co.jp」であることを必ずご確認ください。<br>
    ※ プレ値・転売品にはご注意ください。<br>
    ※ このページはアフィリエイトリンクを含みます。
  </div>
</div>
<script>
  // GASにアクセスログを送信
  var logUrl = "${gasLogUrl}";
  if (logUrl) {
    fetch(logUrl, {
      method: "POST",
      mode:   "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type:   "ab_view",
        asin:   "${asin}",
        name:   "${escHtml(name)}",
        theme:  "${theme}",
        device: /iphone|ipad|ipod/i.test(navigator.userAgent) ? "iOS"
               : /android/i.test(navigator.userAgent) ? "Android"
               : "PC",
        time:   new Date().toISOString(),
      }),
    }).catch(function() {});
  }

  // ボタンタップ時のログ送信
  var buyBtn = document.getElementById('buyBtn');
  if (buyBtn && logUrl) {
    buyBtn.addEventListener('click', function() {
      fetch(logUrl, {
        method: "POST",
        mode:   "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type:   "ab_tap",
          asin:   "${asin}",
          name:   "${escHtml(name)}",
          theme:  "${theme}",
          device: /iphone|ipad|ipod/i.test(navigator.userAgent) ? "iOS"
                 : /android/i.test(navigator.userAgent) ? "Android"
                 : "PC",
          time:   new Date().toISOString(),
        }),
      }).catch(function() {});
    });
  }
</script>
</body>
</html>`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.status(200).send(html);
}

function escHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
