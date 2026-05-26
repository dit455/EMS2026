from app.extensions import db
from datetime import datetime


class Student(db.Model):
    __tablename__ = 'students'

    id                    = db.Column(db.Integer, primary_key=True)
    registration_no       = db.Column(db.String(30), unique=True)
    name                  = db.Column(db.String(120), nullable=False)
    dob                   = db.Column(db.Date)
    gender                = db.Column(db.String(10))
    email                 = db.Column(db.String(150), unique=True, nullable=False)
    mobile                = db.Column(db.String(15))
    student_id            = db.Column(db.String(50))
    father_name           = db.Column(db.String(120))
    mother_name           = db.Column(db.String(120))
    address               = db.Column(db.Text)
    place_of_residence    = db.Column(db.String(100))
    state                 = db.Column(db.String(60))
    pin_code              = db.Column(db.String(10))
    college               = db.Column(db.String(150))
    course                = db.Column(db.String(100))
    admission_year        = db.Column(db.Integer)
    # Workflow status: draft | submitted | checker_review | approved | rejected
    status                = db.Column(db.String(30), default='draft')
    identity_number       = db.Column(db.String(20))     # Aadhaar or other ID
    photo_filename        = db.Column(db.String(255))
    created_at            = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at            = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    education_records = db.relationship('EducationRecord', backref='student', lazy=True, cascade='all, delete-orphan')
    documents         = db.relationship('StudentDocument', backref='student', lazy=True, cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id':              self.id,
            'registration_no': self.registration_no,
            'name':            self.name,
            'email':           self.email,
            'mobile':          self.mobile,
            'college':         self.college,
            'course':          self.course,
            'status':          self.status,
            'created_at':      self.created_at.isoformat(),
        }


class EducationRecord(db.Model):
    __tablename__ = 'education_records'

    id                      = db.Column(db.Integer, primary_key=True)
    student_id              = db.Column(db.Integer, db.ForeignKey('students.id'), nullable=False)
    level                   = db.Column(db.String(30))   # X, XII, Diploma, UG, PG
    board_exam              = db.Column(db.String(100))
    institution             = db.Column(db.String(200))
    year_of_passing         = db.Column(db.Integer)
    total_marks             = db.Column(db.Integer)
    marks_obtained          = db.Column(db.Integer)
    grade_percentage        = db.Column(db.String(10))
    registration_number     = db.Column(db.String(60))
    certificate_serial      = db.Column(db.String(60))
    document_filename       = db.Column(db.String(255))
    created_at              = db.Column(db.DateTime, default=datetime.utcnow)


class StudentDocument(db.Model):
    __tablename__ = 'student_documents'

    id            = db.Column(db.Integer, primary_key=True)
    student_id    = db.Column(db.Integer, db.ForeignKey('students.id'), nullable=False)
    # doc_type: id_proof | dob_proof | address_proof | parent_proof | photo
    doc_type      = db.Column(db.String(30), nullable=False)
    filename      = db.Column(db.String(255), nullable=False)
    # status: pending | uploaded | verified | rejected
    status        = db.Column(db.String(20), default='uploaded')
    uploaded_at   = db.Column(db.DateTime, default=datetime.utcnow)
