class Config:
    DEBUG = True
    TESTING = False
    SQLALCHEMY_DATABASE_URI = 'postgresql://user:password@localhost/pawsdb'
    SQLALCHEMY_TRACK_MODIFICATIONS = False