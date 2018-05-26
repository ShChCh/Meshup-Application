import re
from urllib.request import Request, urlopen
from io import BytesIO
from flask import Flask, jsonify, request
from urllib.error import HTTPError
import atexit
import string
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.interval import IntervalTrigger

# from auth import login_required, admin_required, SECRET_KEY
# from itsdangerous import (TimedJSONWebSignatureSerializer as Serializer)
from flask_cors import CORS
from mongoengine import connect

from models import Rent, Sales

rent_url = 'https://data.nsw.gov.au/data/dataset/05aaef34-d175-4e0d-9cc1-a70534447495/resource/1ee8e212-732e-47a7-a93f-38881fdef21a/download/GStrategic-PolicyInformationData-NSW2016-Dataset-uploadsFACSRent-tables---March-quarter-2015.xls'
sales_url = 'https://data.nsw.gov.au/data/dataset/05aaef34-d175-4e0d-9cc1-a70534447495/resource/2537fdfa-e256-483a-8de5-a98148bcd306/download/GStrategic-PolicyInformationData-NSW2016-Dataset-uploadsFACSSales-tables-December-qtr.xls'

app = Flask(__name__)
CORS(app)
connect(
    host='mongodb://user:user@ds133360.mlab.com:33360/nsw_rent_and_sales'
)

import xlrd


def sales2db(response):
    bytes_data = response.read()
    wb = xlrd.open_workbook(file_contents=bytes_data)
    ws = wb.sheets()[1]
    for i in range(9, 63):
        cell = ws.cell(i, 0)
        if cell.ctype != 0:
            value = ws.cell(i, 1).value
            if value == 'Sutherland':
                value = 'SutherlandShire'
            value = ''.join(x.lower() for x in value if x.isalpha())
            median = ws.cell(i, 3).value
            annual_rate_median = ws.cell(i, 9).value
            sales = Sales(value, str(median), '{:.4f}'.format(annual_rate_median))
            # print(value,median,annual_rate_median)
            sales.save()


def rent2db(response):
    bytes_data = response.read()
    wb = xlrd.open_workbook(file_contents=bytes_data)
    ws = wb.sheets()[1]
    for i in range(9, 63):
        cell = ws.cell(i, 0)
        if cell.ctype != 0:
            value = ws.cell(i, 1).value
            if value == 'Sutherland':
                value = 'SutherlandShire'
            value = ''.join(x.lower() for x in value if x.isalpha())
            lt = [value]
            for j in [2, 6, 8, 12, 14, 18, 20, 24]:
                data = ws.cell(i, j).value
                if data == '-':
                    data = 'null'
                else:
                    data = str(data)
                lt.append(data)
            rent = Rent(lt[0], lt[1], lt[2], lt[3], lt[4], lt[5], lt[6], lt[7], lt[8])
            rent.save()


@app.route("/nsw_rent_data", methods=["GET"])
# @login_required
def get_rent_collections():
    qs = Rent.objects()
    entries = []
    for rent in qs:
        entries.append({'id': '{}/{}'.format(request.base_url, rent.lga_name),
                        'lga_name': rent.lga_name,
                        'one_bed': rent.one_bed,
                        'annual_rate_one_bed': rent.annual_rate_one_bed,
                        'two_bed': rent.two_bed,
                        'annual_rate_two_bed': rent.annual_rate_two_bed,
                        'three_bed': rent.three_bed,
                        'annual_rate_three_bed': rent.annual_rate_three_bed,
                        'four_bed': rent.four_bed,
                        'annual_rate_four_bed': rent.annual_rate_four_bed
                        })
    return jsonify(title='NSW Rent Data',
                   id=request.base_url,
                   entry=entries), 200


@app.route("/nsw_sales_data", methods=["GET"])
# @login_required
def get_sales_collections():
    qs = Sales.objects()
    entries = []
    for sale in qs:
        entries.append({'id': '{}/{}'.format(request.base_url, sale.lga_name),
                        'lga_name': sale.lga_name,
                        'median': sale.median,
                        'annual_rate_median': sale.annual_rate_median
                        })
    return jsonify(title='NSW Rent Data',
                   id=request.base_url,
                   entry=entries), 200


# @app.route("/nsw_crime_data/<rid>", methods=["DELETE"])
# # @admin_required
# def delete_by_id(rid):
#     lga_qs = LGA.objects(file_name=rid + 'lga.xlsx')
#     if lga_qs.count()!=0:
#         lga = lga_qs[0]
#         lga.delete()
#         return 'Delete Success.', 200
#     else:
#         return "Id not found.", 404


@app.route("/nsw_rent_data/<lga_name>", methods=["GET"])
# @login_required
def get_rent_by_lga(lga_name):
    qs = Rent.objects(lga_name=lga_name)
    if qs.count() != 0:
        rent = qs[0]
        xml_dict = {'id': '{}/{}'.format(request.base_url, rent.lga_name),
                    'lga_name': rent.lga_name,
                    'one_bed': rent.one_bed,
                    'annual_rate_one_bed': rent.annual_rate_one_bed,
                    'two_bed': rent.two_bed,
                    'annual_rate_two_bed': rent.annual_rate_two_bed,
                    'three_bed': rent.three_bed,
                    'annual_rate_three_bed': rent.annual_rate_three_bed,
                    'four_bed': rent.four_bed,
                    'annual_rate_four_bed': rent.annual_rate_four_bed
                    }
        return jsonify(xml_dict), 200
    else:
        return "LGA name not found.", 404


@app.route("/nsw_sales_data/<lga_name>", methods=["GET"])
# @login_required
def get_sales_by_lga(lga_name):
    qs = Rent.objects(lga_name=lga_name)
    if qs.count()!=0:
        sale = qs[0]
        xml_dict = {'id': '{}/{}'.format(request.base_url, sale.lga_name),
                    'lga_name': sale.lga_name,
                    'median': sale.median,
                    'annual_rate_median': sale.annual_rate_median
                    }
        return jsonify(xml_dict), 200
    else:
        return "LGA name not found.", 404


def update_db():
    with urlopen(rent_url) as response:
        rent2db(response)
    with urlopen(sales_url) as response:
        sales2db(response)


if __name__ == "__main__":
    update_db()
    # scheduler = BackgroundScheduler()
    # scheduler.start()
    # scheduler.add_job(
    #     func=update_db,
    #     trigger=IntervalTrigger(hours=1),
    #     id='updating_job',
    #     name='Update database every hour',
    #     replace_existing=True)
    # # Shut down the scheduler when exiting the app
    # atexit.register(lambda: scheduler.shutdown())
    #
    app.run()
