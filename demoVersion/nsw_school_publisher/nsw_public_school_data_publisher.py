import csv
from urllib.request import urlopen

from flask import Flask, jsonify, request
from io import StringIO
from models import School
from flask_cors import *
from mongoengine import connect

data_url = 'https://data.cese.nsw.gov.au/data/dataset/027493b2-33ad-3f5b-8ed9-37cdca2b8650/resource/2ac19870-44f6' \
           '-443d-a0c3-4c867f04c305/download/masterdatasetnightlybatchcollections.csv '

app = Flask(__name__)
CORS(app, supports_credentials=True)
connect(
    host='mongodb://user:user@ds135760.mlab.com:35760/nsw_school_data'
)



def school2db(response):
    reader = csv.DictReader(StringIO(response.read().decode()))
    for row in reader:
        if row['LGA']:
            lga_name = ''.join(x.lower() for x in row['LGA'] if x.isalpha())
            school_name = row['School_name']
            post_code = str(row['Postcode'])
            latitude = str(row['Latitude'])
            longitude = str(row['Longitude'])
            school_type = str(row['Level_of_schooling'])
            school = School(lga_name, school_name, post_code, latitude, longitude, school_type)
            school.save()


def update_db():
    with urlopen(data_url) as response:
        school2db(response)


@app.route("/nsw_school_data/<lga_name>", methods=["GET"])
# @login_required
def get_school_data_by_lga(lga_name):
    qs = School.objects(lga_name=lga_name)
    entries = []
    if qs.count() != 0:
        for school in qs:
            entries.append({'school_name': school.school_name,
                            'post_code': school.post_code,
                            'latitude': school.latitude,
                            'longitude': school.longitude,
                            'school_type': school.school_type})
        return jsonify(title='School Data in {} Local Government Area'.format(lga_name),
                       lga_name=lga_name,
                       id=request.base_url,
                       entry=entries), 200
    else:
        return "LGA name not found.", 404


@app.route("/nsw_school_data", methods=["GET"])
# @login_required
def get_all_school_data():
    qs = School.objects()
    entries = []
    for school in qs:
        entries.append({'school_name': school.school_name,
                        'lga_name': school.lga_name,
                        'post_code': school.post_code,
                        'latitude': school.latitude,
                        'longitude': school.longitude,
                        'school_type': school.school_type})
    return jsonify(title='NSW School Data',
                   id=request.base_url,
                   entry=entries), 200


if __name__ == "__main__":
    update_db()
    app.run(port=50103)