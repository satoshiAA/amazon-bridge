export default function handler(req, res) {
  const { asin = "", name = "Amazon商品", price = "", img = "", tag = "" } = req.query;
  const amazonUrl = `https://www.amazon.co.jp/dp/${asin}?tag=${tag}`;
  const title = `🟢【在庫復活】${name} | Amazon正規品`;
  const description = "Amazon.co.jp（正規）に在庫が入りました！定価販売確認済み。お早めに。";

  const html = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${img}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${img}">
  <title>${title}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Hiragino Sans", sans-serif; background: #0f1117; color: #fff; min-height: 100vh; display: flex; align-items: center; justify-content: center; }
    .container { text-align: center; padding: 40px 20px; max-width: 480px; width: 100%; }
    .badge { display: inline-block; background: #22c55e; color: #fff; font-size: 13px; font-weight: 700; padding: 4px 14px; border-radius: 20px; margin-bottom: 16px; }
    .product-image { width: 80vw; max-width: 360px; height: 80vw; max-height: 360px; object-fit: contain; border-radius: 12px; background: #1e2130; padding: 16px; margin: 0 auto 20px; display: block; }
    .product-name { font-size: 18px; font-weight: 700; line-height: 1.5; margin-bottom: 10px; }
    .price { font-size: 28px; font-weight: 800; color: #f97316; margin-bottom: 6px; }
    .seller { font-size: 13px; color: #94a3b8; margin-bottom: 24px; }
    .seller span { color: #22c55e; font-weight: 600; }
    .btn { display: inline-block; background: #f97316; color: #fff; font-size: 18px; font-weight: 700; padding: 16px 36px; border-radius: 8px; text-decoration: none; width: 100%; max-width: 360px; }
    .warning { font-size: 11px; color: #475569; margin-top: 16px; }
  </style>
</head>
<body>
<div class="container">
  <div class="badge">🟢 Amazon正規在庫 確認済み</div>
  <img class="product-image" src="${img}" alt="${name}" onerror="this.style.display='none'">
  <div class="product-name">${name}</div>
  <div class="price">${price}</div>
  <div class="seller">販売元：<span>Amazon.co.jp（正規）</span></div>
  <a class="btn" href="${amazonUrl}">今すぐAmazonで購入 →</a>
  <div class="warning">※ 在庫は予告なく終了する場合があります。<br>※ このページはアフィリエイトリンクを含みます。</div>
</div>
<script>setTimeout(function(){ window.location.href = "${amazonUrl}"; }, 800);</script>
</body>
</html>`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.status(200).send(html);
}
