from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Enum
import enum

db = SQLAlchemy()

# Models

class RoleEnum(enum.Enum):
    admin = "admin"
    volunteer = "volunteer"

class User(db.Model):
    __tablename__ = 'users'
    
    user_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    role = db.Column(Enum(RoleEnum), nullable=False)
    
    admin_profile = db.relationship('Admin', uselist=False, back_populates='user')
    volunteer_profile = db.relationship('Volunteer', uselist=False, back_populates='user')


class Volunteer(db.Model):
    __tablename__ = 'volunteers'
    
    volunteer_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    phone = db.Column(db.String(20))
    
    user = db.relationship('User', back_populates='volunteer_profile')

class Admin(db.Model):
    __tablename__ = 'admins'
    
    admin_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    
    user = db.relationship('User', back_populates='admin_profile')


class Schedule(db.Model):
    __tablename__ = 'schedules'
    schedule_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    volunteer_id = db.Column(db.Integer, db.ForeignKey('volunteers.volunteer_id'), nullable=False)
    shift_date = db.Column(db.Date, nullable=False)
    start_time = db.Column(db.Time, nullable=False)
    end_time = db.Column(db.Time, nullable=False)

class Event(db.Model):
    __tablename__ = 'events'
    event_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    date = db.Column(db.Date, nullable=False)
    location = db.Column(db.String(200), nullable=False)
    capacity = db.Column(db.Integer, nullable=True)
    current_signups = db.Column(db.Integer, nullable=False, default=0) 
    
    signups = db.relationship('EventSignup', back_populates='event', cascade='all, delete-orphan')

class EventSignup(db.Model):
    __tablename__ = 'event_signups'
    signup_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    event_id = db.Column(db.Integer, db.ForeignKey('events.event_id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)

    event = db.relationship('Event', back_populates='signups')
    user = db.relationship('User')

class Message(db.Model):
    __tablename__ = 'messages'
    message_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(200), nullable=False)
    sender_name = db.Column(db.String(100), nullable=False)
    date = db.Column(db.Date, nullable=False)
    content = db.Column(db.Text, nullable=False)

    recipients = db.relationship('MessageRecipient', back_populates='message', cascade="all, delete-orphan")

class MessageRecipient(db.Model):
    __tablename__ = 'message_recipients'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    message_id = db.Column(db.Integer, db.ForeignKey('messages.message_id'), nullable=False)
    volunteer_id = db.Column(db.Integer, db.ForeignKey('volunteers.volunteer_id'), nullable=False)

    message = db.relationship('Message', back_populates='recipients')
    volunteer = db.relationship('Volunteer')

class LogHours(db.Model):
    __tablename__ = 'log_hours'
    log_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    volunteer_id = db.Column(db.Integer, db.ForeignKey('volunteers.volunteer_id'), nullable=False)
    hours = db.Column(db.Float, nullable=False)
    assignment_type = db.Column(db.String(50), nullable=False)