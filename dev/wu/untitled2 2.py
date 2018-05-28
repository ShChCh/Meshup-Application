from flask import Flask, jsonify,request
import googlemaps
from datetime import datetime

import os
import json
import requests
import operator


# def get_js():
#     # f = open("D:/WorkSpace/MyWorkSpace/jsdemo/js/des_rsa.js",'r',encoding='UTF-8')
#     f = open("/Users/wyj/Desktop/comp9321/untitled2/a.js", 'r', encoding='UTF-8')
#     line = f.readline()
#     htmlstr = ''
#     while line:
#         htmlstr = htmlstr + line
#         line = f.readline()
#     return htmlstr
# print(os.getcwd())

# jsstr = get_js()
# ctx = execjs.compile(jsstr)
# print(ctx.call('enString', '123456'))

# lga_list = {}
x = open('/Users/wyj/Desktop/geoserver-GetFeature.json','r')
load_dict = json.load(x)
#
# for i in range(len(load_dict['features'])):
#     if load_dict['features'][i]['properties']['nsw_lga__3'] != 'UNINCORPORATED':
#         t = ''.join([x for x in load_dict['features'][i]['properties']['nsw_lga__3'].lower() if x.isalpha()])
#         lga_list[t] = load_dict['features'][i]['geometry']['coordinates'][0][0]
#
#
# with open("/Users/wyj/Desktop/lgalist.json","w") as f:
#
#     json.dump(lga_list, f)
x = open('/Users/wyj/Desktop/lgalist.json','r')
lga_dic = json.load(x)
app = Flask(__name__)


@app.route('/get_all_crimedata', methods=['GET'])
def get_all_crimedata():
    response = requests.get("http://localhost:5001/nsw_crime_data", params=None)
    # print("statistics:", response.json())
    load_dict = response.json()
    json = {}
    sorted_x = sorted(load_dict['entry'], key=lambda k: k['average'])
    print(sorted_x)
    for i in range(len(sorted_x)):
        if sorted_x[i]['lga_name'] in lga_dic:

            coordinate = lga_dic[sorted_x[i]['lga_name']]
            data = {'year_data': sorted_x[i]['year_data'],
                    'average':  sorted_x[i]['average'],
                    'rank': i}
            json[sorted_x[i]['lga_name']] = {'coordinate':coordinate ,'data':data}
        else:
            print(sorted_x[i]['lga_name'])

    return jsonify(json)

@app.route('/get_one_crimedata/<string:lga_id>', methods=['GET'])
def get_one_crimedata(lga_id):
    response = requests.get("http://localhost:5000/nsw_crime_data", params=None)
    print("statistics:", response.json())
    load_dict = response.json()
    json = {}
    for key in load_dict['entry']:
        coordinate = lga_dic[key['lga_name']]
        data = {'year_data': key['year_data'],
                'average': key['average']}
        json[key['lga_name']] = {'coordinate': coordinate, 'data': data}

    return jsonify(json)


# gmaps = googlemaps.Client(key='AIzaSyBIXqixjK_rQJonOdmCaz9EUy4cGDP-Zws')
#
# # Geocoding an address
# geocode_result = gmaps.geocode('1600 Amphitheatre Parkway, Mountain View, CA')
#
# # Look up an address with reverse geocoding
# reverse_geocode_result = gmaps.reverse_geocode((40.714224, -73.961452))
#
# # Request directions via public transit
# now = datetime.now()
# directions_result = gmaps.directions("Sydney Town Hall",
#                                      "Parramatta, NSW",
#                                      mode="transit",
#                                      departure_time=now)
# print(directions_result)


if __name__ == '__main__':
    app.run()
