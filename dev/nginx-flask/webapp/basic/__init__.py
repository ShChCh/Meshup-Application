from flask import Flask
from flask import request
import requests
import json 

# directly return json format returned value
def sendJson(url, nameArr, valArr):
    # url = 'http://httpbin.org/post'
    jsonArr = {}
    if nameArr.__len__ != valArr.__len__:
        return ''
    for i in range(0, nameArr.__len__):
        jsonArr[nameArr[i]] = valArr[i]
    s = json.dumps(jsonArr)
    r = requests.post(url, data=s)
    re = json.loads(r.text)
    print re
