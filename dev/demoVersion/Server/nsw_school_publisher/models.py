from mongoengine import StringField, Document


class School(Document):
    lga_name = StringField(required=True, max_length=50)
    school_name = StringField(required=True, max_length=100)
    post_code = StringField(required=True, max_length=5)
    latitude = StringField(required=True, max_length=20)
    longitude = StringField(required=True, max_length=20)
    school_type = StringField(required=True, max_length=50)

    def __init__(self, lga_name, school_name, post_code, latitude, longitude, school_type, *args, **values):
        super().__init__(*args, **values)
        self.lga_name = lga_name
        self.school_name = school_name
        self.post_code = post_code
        self.latitude = latitude
        self.longitude = longitude
        self.school_type = school_type
