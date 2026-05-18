from flask import Flask
from flask_cors import CORS
from config import Config
from database import mysql

from modules.examination.routes_subjects import examination_subjects_bp
from modules.examination.routes_schedule import examination_schedule_bp
from modules.examination.routes_attendance import examination_attendance_bp
from modules.marks.routes_subject_marks import marks_subject_bp
from modules.marks.routes_student_marks import marks_student_bp
from modules.marks.routes_marksheet import marksheet_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    app.config['MYSQL_HOST']     = Config.MYSQL_HOST
    app.config['MYSQL_USER']     = Config.MYSQL_USER
    app.config['MYSQL_PASSWORD'] = Config.MYSQL_PASSWORD
    app.config['MYSQL_DB']       = Config.MYSQL_DB
    app.config['MYSQL_CURSORCLASS'] = 'DictCursor'

    CORS(app)
    mysql.init_app(app)

    app.register_blueprint(examination_subjects_bp,  url_prefix='/api')
    app.register_blueprint(examination_schedule_bp,  url_prefix='/api')
    app.register_blueprint(examination_attendance_bp, url_prefix='/api')
    app.register_blueprint(marks_subject_bp,         url_prefix='/api')
    app.register_blueprint(marks_student_bp,         url_prefix='/api')
    app.register_blueprint(marksheet_bp,             url_prefix='/api')

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5000)
