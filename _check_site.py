import urllib.request

base = "http://127.0.0.1:8765/"
assets = [
    "index.html",
    "style.css",
    "script.js",
    "logo.jpg",
    "images/portfolio/undangan-belakang.png",
    "images/portfolio/undangan-depan.png",
    "images/portfolio/umbul-umbul.png",
    "images/portfolio/desain-grafis.png",
    "images/portfolio/brosur-febi.jpg",
    "images/portfolio/katalog-brosur.jpg",
    "images/portfolio/katalog-produk.jpg",
    "images/portfolio/katalog-bendera.jpg",
    "images/portfolio/desain-brosur-nurul-qodiri-1.jpg",
    "images/portfolio/desain-brosur-nurul-qodiri-2.jpg",
    "images/portfolio/desain-brosur-nurul-qodiri-3.jpg",
    "images/portfolio/desain-brosur-daar-el-fikri-1.jpg",
    "images/portfolio/desain-brosur-daar-el-fikri-2.jpg",
    "images/portfolio/desain-brosur-syifaul-janan.jpg",
]

html = urllib.request.urlopen(base + "index.html", timeout=10).read().decode("utf-8", "replace")
print("title_ok", "Ardy_grafity" in html)
print("desain_brosur_h4", html.count("<h4>Desain Brosur</h4>"))
print("portfolio_items", html.count('class="portfolio-item"'))
print("service_cards", html.count('class="service-card"'))
print("css_linked", 'href="style.css"' in html)
print("js_linked", 'src="script.js"' in html)
print("wa_link", html.count("wa.me/6281572638362"))
print("broken_hash_social", html.count('href="#"'))

print("--- assets ---")
for path in assets:
    try:
        req = urllib.request.Request(base + path, method="HEAD")
        with urllib.request.urlopen(req, timeout=10) as res:
            print(res.status, res.getheader("Content-Type"), res.getheader("Content-Length"), path)
    except Exception as err:
        print("FAIL", path, err)
