// ============================================================
// Vercel Serverless Function - ブリッジページ
// /api/bridge?asin=XXX&name=XXX&price=XXX&img=XXX&tag=XXX
// ============================================================

export default function handler(req, res) {
  const { asin = "", name = "Amazon商品", price = "", img = "", tag = "" } = req.query;

  const amazonUrl  = `https://www.amazon.co.jp/dp/${asin}?tag=${tag}`;
  const title      = `🟢【在庫復活】${name} | Amazon正規品`;
  const description = "Amazon.co.jp（正規）に在庫が入りました！定価販売確認済み。お早めに。";
  const imageUrl   = img || "";

  const html = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- OGP（XクローラーがスキャンしてCardを生成） -->
  <meta property="og:type"         content="website">
  <meta property="og:title"        content="${escHtml(title)}">
  <meta property="og:description"  content="${escHtml(description)}">
  <meta property="og:image"        content="${escHtml(imageUrl)}">
  <meta name="twitter:card"        content="summary_large_image">
  <meta name="twitter:title"       content="${escHtml(title)}">
  <meta name="twitter:description" content="${escHtml(description)}">
  <meta name="twitter:image"       content="${escHtml(imageUrl)}">

  <title>${escHtml(title)}</title>

  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Hiragino Sans", sans-serif;
      background: #0f1117; color: #fff;
      min-height: 100vh; display: flex;
      align-items: center; justify-content: center;
    }
    .container { text-align: center; padding: 40px 20px; max-width: 480px; width: 100%; }
    .badge {
      display: inline-block; background: #22c55e; color: #fff;
      font-size: 13px; font-weight: 700; padding: 4px 14px;
      border-radius: 20px; margin-bottom: 16px;
    }
    .product-image {
      width: 80vw; max-width: 360px; height: 80vw; max-height: 360px;
      object-fit: contain; border-radius: 12px; background: #1e2130; padding: 16px;
      margin: 0 auto 20px; display: block;
    }
    .product-name { font-size: 18px; font-weight: 700; line-height: 1.5; margin-bottom: 10px; }
    .price { font-size: 28px; font-weight: 800; color: #f97316; margin-bottom: 6px; }
    .seller { font-size: 13px; color: #94a3b8; margin-bottom: 24px; }
    .seller span { color: #22c55e; font-weight: 600; }
    .redirect-msg { font-size: 13px; color: #64748b; margin-bottom: 20px; }
    .btn {
      display: inline-block; color: #fff;
      font-size: 16px; font-weight: 700; padding: 14px 36px;
      border-radius: 8px; text-decoration: none;
      width: 100%; max-width: 360px; margin-bottom: 10px;
    }
    .btn-app { background: #f97316; }
    .btn-web { background: #1e293b; border: 1px solid #475569; }
    .btn-web { background: #1e293b; border: 1px solid #475569; }
    .warning { font-size: 11px; color: #475569; margin-top: 16px; }
    .safari-hint { background: #1e293b; border: 1px solid #f97316; border-radius: 8px; padding: 14px; margin-top: 12px; font-size: 14px; color: #f97316; line-height: 1.6; }
  </style>
</head>
<body>
<div class="container">
  <div class="badge">🟢 Amazon正規在庫 確認済み</div>
  <img class="product-image" src="${escHtml(imageUrl)}" alt="${escHtml(name)}" onerror="this.style.display='none'">
  <div class="product-name">${escHtml(name)}</div>
  <div class="price">${escHtml(price)}</div>
  <div class="seller">販売元：<span>Amazon.co.jp（正規）</span></div>
  <div class="redirect-msg">Amazonへ移動しています...</div>
  <a class="btn btn-app" href="amzn://dp/${asin}?tag=${tag}" id="appBtn">
    📱 Amazonアプリで開く
  </a>
  <a class="btn btn-web" href="${amazonUrl}" id="webBtn">
    🌐 ブラウザで開く
  </a>
  <div class="warning">
    ※ 在庫は予告なく終了する場合があります。<br>
    ※ このページはアフィリエイトリンクを含みます。
  </div>
</div>
<script>
  var webUrl     = "${amazonUrl}";
  var iosUrl     = "https://www.amazon.co.jp/dp/${asin}?tag=${tag}";
  var androidUrl = "intent://www.amazon.co.jp/dp/${asin}?tag=${tag}#Intent;scheme=https;package=com.amazon.mShop.android.shopping;end";
  var ua         = navigator.userAgent.toLowerCase();
  var isIOS      = /iphone|ipad|ipod/.test(ua);
  var isAndroid  = /android/.test(ua);

  // アプリボタン：amzn://スキームで直接起動
  // アプリがなければwebUrlにフォールバック
  document.getElementById('appBtn').addEventListener('click', function(e) {
    e.preventDefault();
    window.location.href = "amzn://dp/${asin}?tag=${tag}";
    setTimeout(function() {
      window.location.href = webUrl;
    }, 1500);
  });

  // ブラウザボタン
  document.getElementById('webBtn').addEventListener('click', function(e) {
    e.preventDefault();
    window.location.href = webUrl;
  });
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
