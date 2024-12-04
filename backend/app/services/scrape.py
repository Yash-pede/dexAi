import requests

host = "brd.superproxy.io"
port = 33335

username = "brd-customer-hl_c43c131c-zone-residential_proxy1"
password = "mavvy6diikw1"

proxy_url = f"http://{username}:{password}@{host}:{port}"

proxies = {
    'http': proxy_url,
    'https': proxy_url
}

response = requests.get("https://wellfound.com/role/l/developer/remote", proxies=proxies,verify=False)
with open('result.html', 'w') as f:
    f.write(response.status_code)

