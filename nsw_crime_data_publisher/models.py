
from mongoengine import StringField, Document, DictField, FloatField


class LGA(Document):
    # id = IntField(required=True, primary_key=True)
    last_modified = StringField(required=True, max_length=100)
    file_name = StringField(required=True, max_length=50)
    year_data = DictField(required=True)
    average = StringField(required=True, max_length=50)
    # index = 0

    def __init__(self, file_name, years={}, average='', last_modified='', *args, **values):
        super().__init__(*args, **values)
        self.last_modified = last_modified
        self.file_name = file_name
        self.year_data = years
        self.average = average
