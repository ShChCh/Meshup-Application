from mongoengine import StringField, Document


class Sales(Document):
    lga_name = StringField(required=True, max_length=50)
    median = StringField(required=True, max_length=20)
    annual_rate_median = StringField(required=True, max_length=20)

    def __init__(self, lga_name, median, annual_rate_median, *args, **values):
        super().__init__(*args, **values)
        self.lga_name = lga_name
        self.median = median
        self.annual_rate_median = annual_rate_median


class Rent(Document):
    lga_name = StringField(required=True, max_length=50)
    one_bed = StringField(required=True, max_length=20)
    annual_rate_one_bed = StringField(required=True, max_length=20)
    two_bed = StringField(required=True, max_length=20)
    annual_rate_two_bed = StringField(required=True, max_length=20)
    three_bed = StringField(required=True, max_length=20)
    annual_rate_three_bed = StringField(required=True, max_length=20)
    four_bed = StringField(required=True, max_length=20)
    annual_rate_four_bed = StringField(required=True, max_length=20)

    def __init__(self, lga_name, one_bed, annual_rate_one_bed, two_bed, annual_rate_two_bed, three_bed,
                 annual_rate_three_bed, four_bed, annual_rate_four_bed, *args, **values):
        super().__init__(*args, **values)
        self.lga_name = lga_name
        self.one_bed = one_bed
        self.annual_rate_one_bed = annual_rate_one_bed
        self.two_bed = two_bed
        self.annual_rate_two_bed = annual_rate_two_bed
        self.three_bed = three_bed
        self.annual_rate_three_bed = annual_rate_three_bed
        self.four_bed = four_bed
        self.annual_rate_four_bed = annual_rate_four_bed
