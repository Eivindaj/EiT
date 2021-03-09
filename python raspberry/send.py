import urllib.request
import requests
import json      

body = {'ids': [12, 14, 50]}  
myurl = "http://localhost:8885/users"

r = requests.get(myurl, body)
r.status_code
r.json()
