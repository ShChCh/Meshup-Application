from flask import Flask, jsonify,request, send_file
# import math
import os
import numpy as np
import json
import requests
# import argparse
# import operator
# from openpyxl import load_workbook
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

from scipy.interpolate import spline
from flask_cors import *


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

# x1,y1 = -33.5297025187805,148.7673155965424
#
# x2, y2 = -33.529546006456854,148.76623734851842
#
# x0,y0 = -33.529089883212144,148.76858696361546
# d = abs((y2 - y1) * x0 +(x1 - x2) * y0 + ((x2 * y1) -(x1 * y2)))/(math.sqrt(pow(y2 - y1, 2) + pow(x1 - x2, 2)))
# print(d)

#
# url1 = "https://docs.google.com/spreadsheets/d/1tHCxouhyM4edDvF60VG7nzs5QxID3ADwr3DGJh71qFg/export?format=xlsx&id=1tHCxouhyM4edDvF60VG7nzs5QxID3ADwr3DGJh71qFg"
# r = requests.get(url1)
# lga_set = set()
# # lga_mapping = {}
# with open("temp_postcode.xlsx", "wb") as code:
#     code.write(r.content)
# wb = load_workbook(filename=r'temp_postcode.xlsx')
# sheet = wb.get_sheet_by_name('lga_postcode_mappings')
# for i in range(2,1783):
#     lga_set.add(sheet.cell(row=i, column=2).value)
    # lga_mapping[int(sheet.cell(row=i, column=3).value)] = sheet.cell(row=i, column=2).value


# lga_list = {}
# x = open('/Users/wyj/Desktop/geoserver-GetFeature.json','r')
# load_dict = json.load(x)
# #
#
# for i in range(len(load_dict['features'])):
#     if load_dict['features'][i]['properties']['nsw_lga__3'] != 'UNINCORPORATED':
#         t = ''.join([x for x in load_dict['features'][i]['properties']['nsw_lga__3'].lower() if x.isalpha()])
#
#         temp_list = load_dict['features'][i]['geometry']['coordinates'][0][0]
#
#         j =0
#         while j < len(temp_list)-2:
#             x1,y1 = temp_list[j]
#             x2, y2 = temp_list[j+1]
#             x0,y0 = temp_list[j+2]
#             if (abs((y2 - y1) * x0 +(x1 - x2) * y0 + ((x2 * y1) -(x1 * y2)))/(math.sqrt(pow(y2 - y1, 2) + pow(x1 - x2, 2)))) <0.00001:
#
#                 temp_list.pop(j+1)
#             else:
#
#
#                 j += 1
#         # j = 0
#         # while j < len(temp_list) - 2:
#         #     x1, y1 = temp_list[j]
#         #     x2, y2 = temp_list[j + 1]
#         #     x0, y0 = temp_list[j + 2]
#         #     if (abs((y2 - y1) * x0 + (x1 - x2) * y0 + ((x2 * y1) - (x1 * y2))) / (
#         #     math.sqrt(pow(y2 - y1, 2) + pow(x1 - x2, 2)))) < 0.0001:
#         #         temp_list.pop(j + 1)
#         #
#         #     j += 1
#
#
#         lga_list[t] = temp_list


#
#

# with open("/Users/wyj/Desktop/lgalist5.json","w") as f:
#
#     json.dump(lga_list, f)
x = open('./final_lga.json','r')
# x = open('/Users/wyj/Desktop/Meshup-Application/final_lga.json','r')

lga_dic = json.load(x)
lga_set = set()
for key in lga_dic:
    lga_set.add(key)
# print(lga_set)
app = Flask(__name__)
CORS(app, supports_credentials=True)


@app.route('/get_all_crimedata', methods=['GET'])
def get_all_crimedata():

    # response = requests.get("http://localhost:50102/nsw_crime_data", params=None)
    response = requests.get("http://54.252.243.63:50102/nsw_crime_data", params=None)
    # print("statistics:", response.json())
    load_dict = response.json()
    json = {}
    sorted_x = sorted(load_dict['entry'], key=lambda k: k['average'])
#    print(len(sorted_x))
    for i in range(len(sorted_x)):
        if sorted_x[i]['lga_name'] in lga_dic:

            # coordinate = lga_dic[sorted_x[i]['lga_name']]
            data = {
                    'average':  sorted_x[i]['average'],
                    'rank': i}
            json[sorted_x[i]['lga_name']] = data
        else:
            print(sorted_x[i]['lga_name'])

    return jsonify(json)

@app.route('/get_one_crimedata/<string:lga_id>', methods=['GET'])
def get_one_crimedata(lga_id):
    lga_name = lga_id
    lga_name = ''.join([x for x in lga_name.lower() if x.isalpha()])
#    print(lga_name)
    # response = requests.get("http://localhost:50102/nsw_crime_data/"+ lga_name, params=None)
    response = requests.get("http://54.252.243.63:50102/nsw_crime_data/" + lga_name, params=None)
    if response.status_code == 404:
        json ={}
        data = {
                'path': '/img/404'}
        json[lga_id] = data
        return jsonify(json)
#    print("statistics:", response.json())
    load_dict = response.json()
    json = {}

    # coordinate = lga_dic[lga_name]
    temp_year_data = load_dict['year_data']
    X_ = []
    Y_ = []
    for key_  in temp_year_data:
        X_.append(int(key_))
        Y_.append(float(temp_year_data[key_]))
    X_ = np.array(X_)
    Y_ = np.array(Y_)
    xnew = np.linspace(min(X_), max(X_), 300)
    t = spline(X_, Y_, xnew)
    plt.plot(xnew, t)
    plt.xlabel("Year")
    plt.ylabel("Crimes")
    plt.title(lga_name+" Recorded Crime Statistics")
    for a, b in zip(X_, Y_):
        plt.text(a, b + 0.1, '%.0f' % b, ha='center', va='bottom', fontsize=11)
    plt.savefig("crimes_" + lga_name + ".png")
    plt.close()
    path = "/img/crimes_" + lga_name
#    print(path)
    data = {'year_data': load_dict['year_data'],
            'average': load_dict['average'],
            'path':path}
    json[load_dict['lga_name']] = data

    return jsonify(json)


@app.route('/get_all_rent', methods=['GET'])
def get_all_rent():
    # response = requests.get("http://localhost:50101/nsw_rent_data", params=None)
    response = requests.get("http://54.252.243.63:50101/nsw_rent_data", params=None)

#    print("statistics:", response.json())
    load_dict = response.json()
    json = {}

    temp_dict = {}
    for x in range(len(load_dict['entry'])):
        temp_list = []
        if load_dict['entry'][x]['one_bed'] != 'null':
            temp_list.append(float(load_dict['entry'][x]['one_bed']))
        if load_dict['entry'][x]['one_bed'] != 'null':
            temp_list.append(float(load_dict['entry'][x]['two_bed'])/2)
        if load_dict['entry'][x]['one_bed'] != 'null':
            temp_list.append(float(load_dict['entry'][x]['three_bed'])/3)
        if load_dict['entry'][x]['one_bed'] != 'null':
            temp_list.append(float(load_dict['entry'][x]['four_bed'])/4)
        if len(temp_list)!= 0:
            temp_dict[load_dict['entry'][x]['lga_name']] = temp_list
    # print(temp_dict.items())
    sort_x = sorted(temp_dict.items(),key=lambda a: float(sum(a[1]))/len(a[1]))
#    print(sort_x)
    rank_list = {}
    for ii in range(len(sort_x)):

        rank_list[sort_x[ii][0]] = ii
#    print(rank_list)
    # sorted_x = sorted(load_dict['entry'], key=lambda k: (float(k['one_bed'])+float(k['two_bed'])/2+float(k['three_bed'])/3+float(k['four_bed'])/4))
    sorted_x = load_dict['entry']

    for i in range(len(sorted_x)):
        if sorted_x[i]['lga_name'] in lga_dic:
            if sorted_x[i]['lga_name'] in rank_list:
                rank = rank_list[sorted_x[i]['lga_name']]
            else:
                rank = len(sorted_x)
            # coordinate = lga_dic[sorted_x[i]['lga_name']]
            data = {
                    'rank': rank }
            json[sorted_x[i]['lga_name']] = data
        else:
            print(sorted_x[i]['lga_name'])


    return jsonify(json)
@app.route('/get_one_rent/<string:lga_id>', methods=['GET'])
def get_one_rent(lga_id):
    lga_name = lga_id

    lga_name = ''.join([x for x in lga_name.lower() if x.isalpha()])
    # response = requests.get("http://localhost:50101/nsw_rent_data/" + lga_name, params=None)
    response = requests.get("http://54.252.243.63:50101/nsw_rent_data/" + lga_name, params=None)
    if response.status_code == 404:
        json = {}
        data = {
            'path': '/img/404'}
        json[lga_id] = data
        return jsonify(json)
#    print("statistics:", response.json())
    load_dict = response.json()
    json = {}

    # coordinate = lga_dic[lga_name]
    name_list = ['One Bed', 'Two Bed', 'Three Bed', 'Four Bed']
    num_list = [float(load_dict['one_bed']), float(load_dict['two_bed']), float(load_dict['three_bed']), float(load_dict['four_bed'])]
#    print(num_list)
    num_list1 = [float(load_dict['annual_rate_one_bed']), float(load_dict['annual_rate_two_bed']), float(load_dict['annual_rate_three_bed']), float(load_dict['annual_rate_four_bed'])]
#    print(num_list1)

    x = np.arange(len(num_list))
    # x = list(range(len(num_list)))
    # total_width, n = 0.8, 2
    # width = total_width / n
    #
    # a1 = plt.bar(x, num_list, width=width, label='Price',tick_label=name_list, fc='y')
    # for i in range(len(x)):
    #     x[i] = x[i] + width
    # # plt.bar(x, num_list1, width=width, label='annual rate', tick_label=name_list, fc='r')
    #
    # plt.ylabel("Price")
    # plt.title(lga_name+" Recorded RENT Statistics")
    # plt.savefig("rents.png")

    fig = plt.figure()  # Create matplotlib figure

    ax = fig.add_subplot(111)  # Create matplotlib axes
    ax2 = ax.twinx()  # Create another axes that shares the same x-axis as ax.

    width = 0.4
    ax.bar(x, num_list, width,
                    color='yellow',
                    error_kw=dict(elinewidth=2, ecolor='red',), label='Price')
    ax2.bar(x+width, num_list1, width,
                     color='red',
                     error_kw=dict(elinewidth=2, ecolor='black'), label='annual_rate')

    # ax.plot(num_list,kind='bar', color='red', ax=ax, width=width, position=1,tick_label=name_list)
    # ax2.plot(num_list1,kind='bar', color='blue', ax=ax2, width=width, position=0,tick_label=name_list)
    ax.set_xlim(-width, len(x) + width)
    ax.set_ylim(0,max(num_list)+500)
    ax.set_ylabel('Price')
    ax2.set_ylim(min(num_list1)-10,max(num_list1)+10)
    ax2.set_ylabel('rate(%)')
    # ax.set_title('Scores by group and gender')
    xTickMarks = name_list
    ax.set_xticks(x + width)
    xtickNames = ax.set_xticklabels(xTickMarks)
    for a, b in zip(x, num_list):
        ax.text(a, b + 0.1, '%.0f' % b, ha='center', va='bottom', fontsize=11)
    for a, b in zip(x, num_list1):
        ax2.text(a+width, b + 0.1, '%.0f' % b, ha='center', va='bottom', fontsize=11)

    fig.legend()
    # plt.setp(xtickNames, rotation=90, fontsize=10)

    # ax.set_ylabel('Amount')
    # ax2.set_ylabel('Price')
    plt.title(lga_name + " Recorded RENT Statistics")
    plt.savefig("rents_"+lga_name+".png")
    plt.close()
    path = "/img/rents_"+lga_name
    data = {
            'path': path}
    json[load_dict['lga_name']] =data

    return jsonify(json)

@app.route('/get_all_sales', methods=['GET'])
def get_all_sales():
    # response = requests.get("http://localhost:50101/nsw_sales_data", params=None)
    response = requests.get("http://54.252.243.63:50101/nsw_sales_data", params=None)
    # print("statistics:", response.json())
    load_dict = response.json()
    # print(type(response))
    json = {}
    sorted_x = sorted(load_dict['entry'],
                      key=lambda k: k['median'])
    for i in range(len(sorted_x)):
        if sorted_x[i]['lga_name'] in lga_dic:

            # coordinate = lga_dic[sorted_x[i]['lga_name']]
            data = {
                'rank': i}
            json[sorted_x[i]['lga_name']] = data
        else:
            print(sorted_x[i]['lga_name'])

    return jsonify(json)
@app.route('/get_one_sale/<string:lga_id>', methods=['GET'])
def get_one_sale(lga_id):
    lga_name = lga_id
    lga_name = ''.join([x for x in lga_name.lower() if x.isalpha()])
    # print(lga_name)
    # response = requests.get("http://localhost:50101/nsw_sales_data/" + lga_name, params=None)
    response = requests.get("http://54.252.243.63:50101/nsw_sales_data/" + lga_name, params=None)
    if response.status_code == 404:
        return jsonify('wrong lganame'), 404
#    print("statistics:", response.json())
    load_dict = response.json()
    json = {}

    # coordinate = lga_dic[lga_name]

    data = {'median': load_dict['median'],
            'annual_rate_median': load_dict['annual_rate_median'],
            }
    json[load_dict['lga_name']] = data

    return jsonify(json)

@app.route('/get_all_coordinates', methods=['GET'])
def get_all_coordinates():
    coordinate = lga_dic

    return jsonify(coordinate)

# plt.legend()
# plt.show()

@app.route('/get_all_rank', methods=['GET'])
def get_all_set():
    total_rank = {}
    # sale_rank = get_all_sales()
    # response = requests.get("http://localhost:50100/get_all_sales", params=None)
    response = requests.get("http://0.0.0.0:50100/get_all_sales", params=None)
    # print("type",type(sale_rank))
    sale_dic = response.json()
    # print('kkkkkk', sale_dic)
    # response = requests.get("http://localhost:50100/get_all_rent", params=None)
    response = requests.get("http://0.0.0.0:50100/get_all_rent", params=None)
    # rent_rank = get_all_rent()
    rent_dic = response.json()
    response = requests.get("http://0.0.0.0:50100/get_all_crimedata", params=None)
    # response = requests.get("http://localhost:50100/get_all_crimedata", params=None)
    # crime_rank = get_all_crimedata()
    crime_dic = response.json()
    # print(sale_dic)
    for ele in lga_set:
        lga_name = ''.join([x for x in ele.lower() if x.isalpha()])

        all_rank = []
        if lga_name in sale_dic:
            all_rank.append(sale_dic[lga_name]['rank'])
        if lga_name in rent_dic:
            all_rank.append(rent_dic[lga_name]['rank'])
        if lga_name in crime_dic:
            all_rank.append(crime_dic[lga_name]['rank'])
        if len(all_rank) !=0:
            total_rank[lga_name] = sum(all_rank)/len(all_rank)
        else:
            total_rank[lga_name] = len(lga_set)
    rank_list = {}
    sort_x = sorted(total_rank.items(), key=lambda a: a[1])
    for ii in range(len(sort_x)):
        data = {}
        data['rank'] = ii
        rank_list[sort_x[ii][0]] = data
    return jsonify(rank_list)
@app.route('/get_one_school/<string:lga_id>', methods=['GET'])
def get_one_school(lga_id):
    # response = requests.get("http://localhost:50103/nsw_school_data/" + lga_id, params=None)
    response = requests.get("http://54.252.243.63:50103/nsw_school_data/" + lga_id, params=None)
    if response.status_code == 404:
        return jsonify('wrong lganame'), 404
#    print("statistics:", response.json())
    load_dict = response.json()
    json = {}

    for x in range(len(load_dict['entry'])):
        data ={'postcode': load_dict['entry'][x]['post_code'],
               'latitude' :load_dict['entry'][x]['latitude'],
               'longitude':load_dict['entry'][x]['longitude'],
               'school_type':load_dict['entry'][x]['school_type']
               }
        json[load_dict['entry'][x]['school_name']] = data
    json['total_number'] =len(load_dict['entry'])
    return jsonify(json)

@app.route('/img/<file_name>')
def get_img(file_name):
    #with open("{}.png".format(file_name), 'rb') as f:
     #   return f
    return send_file("{}.png".format(file_name),mimetype="image/png")


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=50100)
    # app.run(port=50100)

