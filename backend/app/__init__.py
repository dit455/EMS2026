from flask import Flask
from .config import config_by_name
from .extensions import db, migrate, jwt, cors


def create_app(config_name='development'):
    app = Flask(__name__)
    app.config.from_object(config_by_name[config_name])

    # Initialise extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    cors.init_app(app, resources={r'/api/*': {'origins': 'http://localhost:5173'}})

    # Register blueprints — one per module
    from .modules.auth import auth_bp
    from .modules.students import students_bp
    from .modules.examinations import examinations_bp
    from .modules.marks import marks_bp
    from .modules.administration import administration_bp
    from .modules.reports import reports_bp
    from .modules.workflow import workflow_bp
    from .modules.migration import migration_bp

    app.register_blueprint(auth_bp,           url_prefix='/api/auth')
    app.register_blueprint(students_bp,       url_prefix='/api/students')
    app.register_blueprint(examinations_bp,   url_prefix='/api/examinations')
    app.register_blueprint(marks_bp,          url_prefix='/api/marks')
    app.register_blueprint(administration_bp, url_prefix='/api/administration')
    app.register_blueprint(reports_bp,        url_prefix='/api/reports')
    app.register_blueprint(workflow_bp,       url_prefix='/api/workflow')
    app.register_blueprint(migration_bp,      url_prefix='/api/migration')

    return app
