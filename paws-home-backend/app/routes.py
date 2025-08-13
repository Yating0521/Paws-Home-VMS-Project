from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from models import  db, Volunteer, Schedule, Event, Message, LogHours, User, MessageRecipient, EventSignup
from flask_cors import CORS

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:202025085@localhost/paws_home_vms'
db.init_app(app)
CORS(app)


# API Endpoints
# Login API

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")
    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({"error": "Invalid email or password"}), 401
    if user.password != password:
        return jsonify({"error": "Invalid email or password"}), 401

    return jsonify({
        "success": True,
        "role": user.role.value,
        "user_id": user.user_id  
    }), 200

# Registration API
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    phone = data.get('phone')
    password = data.get('password')

    if not all([name, email, phone, password]):
        return jsonify({"error": "All fields are required"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already registered"}), 409

    try:
        new_user = User(email=email, role="volunteer", password=password)
        db.session.add(new_user)
        db.session.commit()

        new_volunteer = Volunteer(name=name, phone=phone, volunteer_id=new_user.user_id)
        db.session.add(new_volunteer)
        db.session.commit()

        return jsonify({"message": "User registered successfully"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Registration failed", "details": str(e)}), 500

# API for managing volunteers
@app.route('/api/volunteers', methods=['POST'])
def create_volunteer():
    data = request.get_json()
    new_volunteer = Volunteer(name=data['name'], email=data['email'])
    db.session.add(new_volunteer)
    db.session.commit()
    return jsonify(
        {"volunteer_id": new_volunteer.volunteer_id}), 201

@app.route('/api/volunteers', methods=['GET'])
def get_volunteers():
    volunteers = Volunteer.query.all()
    return jsonify([
        {
            "volunteer_id": v.user.user_id,
            "name": v.name,
            "email": v.user.email 
        }
        for v in volunteers
    ])

@app.route('/api/volunteers/<int:volunteer_id>', methods=['GET'])
def get_volunteer(volunteer_id): 
    volunteer = Volunteer.query.get_or_404(volunteer_id)
    return jsonify(
        {
            "volunteer_id": volunteer.user.user_id,
            "name": volunteer.name,
            "email": volunteer.user.email 
        }
         ), 200

@app.route('/api/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    data = request.get_json()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    name = data.get('name')
    email = data.get('email')

    if not name or not email:
        return jsonify({"error": "Name and Email are required"}), 400

    user.email = email

    if name and user.volunteer_profile:
        user.volunteer_profile.name = name

    db.session.commit()

    db.session.commit()

    return jsonify({
        "user_id": user.user_id,
        "name": user.volunteer_profile.name,
        "email": user.email
    }), 200



@app.route('/api/volunteers/<int:volunteer_id>', methods=['DELETE'])
def delete_volunteer(volunteer_id):
    volunteer = Volunteer.query.get_or_404(volunteer_id)

    Schedule.query.filter_by(volunteer_id=volunteer_id).delete()
    LogHours.query.filter_by(volunteer_id=volunteer_id).delete()
    MessageRecipient.query.filter_by(volunteer_id=volunteer_id).delete()
    EventSignup.query.filter_by(user_id=volunteer_id).delete()  # 注意：如果 EventSignup 关联的是 user_id 而不是 volunteer_id，要改这里

    db.session.delete(volunteer)

    if volunteer.user:
        db.session.delete(volunteer.user)

    db.session.commit()
    return jsonify({"message": "Volunteer deleted successfully"}), 200


# API for scheduling shifts
@app.route('/api/schedules', methods=['POST'])
def create_schedule():  
    data = request.get_json()
    shift_date = datetime.strptime(data['shift_date'], '%Y-%m-%d').date()
    start_time = datetime.strptime(data['start_time'], '%H:%M:%S').time()
    end_time = datetime.strptime(data['end_time'], '%H:%M:%S').time()
    new_schedule = Schedule(
        volunteer_id=data['volunteer_id'],
        shift_date=shift_date,
        start_time=start_time,
        end_time=end_time
    )
    db.session.add(new_schedule)
    db.session.commit()
    return jsonify({"schedule_id": new_schedule.schedule_id}), 201

@app.route('/api/schedules', methods=['GET'])
def get_schedules():
    schedules = Schedule.query.all()
    return jsonify([
        {"schedule_id": schedule.schedule_id, 
         "volunteer_id": schedule.volunteer_id, 
         "shift_date": schedule.shift_date.strftime('%Y-%m-%d'), 
         "start_time": schedule.start_time.strftime('%H:%M'), 
         "end_time": schedule.end_time.strftime('%H:%M')
         } for schedule in schedules
         ]), 200

# Event API
@app.route('/api/events', methods=['POST'])
def create_event():     
    data = request.get_json()
    new_event = Event(
        name=data['name'], 
        description=data['description'], 
        date=datetime.strptime(data['date'], '%Y-%m-%d').date(), 
        location=data['location'],
        capacity=data.get('capacity', 0),
        current_signups=0
    )
    db.session.add(new_event)
    db.session.commit()
    return jsonify({"event_id": new_event.event_id}), 201


@app.route('/api/events', methods=['GET'])
def get_events():
    events = Event.query.all()
    return jsonify([
        {
            "event_id": event.event_id, 
            "name": event.name, 
            "description": event.description,
            "date": event.date.strftime('%B %d, %Y'), 
            "location": event.location,
            "capacity": event.capacity,
            "current_signups": event.current_signups
        } for event in events
    ]), 200


@app.route('/api/events/<int:event_id>', methods=['PUT'])
def update_event(event_id):
    data = request.get_json()
    event = Event.query.get(event_id)
    if not event:
        return jsonify({"error": "Event not found"}), 404

    name = data.get('name')
    description = data.get('description')
    date_str = data.get('date')
    location = data.get('location')
    capacity = data.get('capacity')

    if not name or not description or not date_str or not location:
        return jsonify({"error": "All fields are required"}), 400

    if capacity is None:
        return jsonify({"error": "Capacity is required"}), 400
    if not isinstance(capacity, int) or capacity < 0:
        return jsonify({"error": "Capacity must be a non-negative integer"}), 400

    if capacity < 0:
        return jsonify({"error": "Capacity cannot be negative"}), 400

    # Ensure capacity is not less than current signups
    if capacity < event.current_signups:
        return jsonify({"error": f"Capacity cannot be less than current signups ({event.current_signups})"}), 400

    event.name = name
    event.description = description
    event.date = datetime.strptime(date_str, '%Y-%m-%d').date()
    event.location = location
    event.capacity = capacity

    db.session.commit()

    return jsonify({
        "event_id": event.event_id,
        "name": event.name,
        "description": event.description,
        "date": event.date.strftime('%Y-%m-%d'),
        "location": event.location,
        "capacity": event.capacity
    }), 200


@app.route('/api/events/<int:event_id>', methods=['DELETE'])   
def delete_event(event_id):
    event = Event.query.get_or_404(event_id)
    db.session.delete(event)
    db.session.commit()
    return jsonify({"message": "Event deleted successfully"}), 200

@app.route('/api/events/<int:event_id>/signup', methods=['POST'])
def signup_event(event_id):
    data = request.get_json()
    user_id = data.get('user_id')

    if not user_id:
        return jsonify({"error": "Missing user_id"}), 400

    event = Event.query.get(event_id)
    if not event:
        return jsonify({"error": "Event not found"}), 404

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    existing_signup = EventSignup.query.filter_by(event_id=event_id, user_id=user_id).first()
    if existing_signup:
        return jsonify({"error": "Already signed up"}), 400

    if event.current_signups >= event.capacity:
        return jsonify({"error": "Event is full"}), 400
    
    new_signup = EventSignup(event_id=event_id, user_id=user_id)
    event.current_signups += 1
    db.session.add(new_signup)
    db.session.commit()

    return jsonify({"message": "Signed up successfully"}), 201


# Message API
@app.route('/api/messages', methods=['POST'])
def create_message():
    data = request.get_json()
    new_message = Message(
        title=data['title'],
        sender_name=data['sender_name'],
        date=datetime.strptime(data['date'], '%Y-%m-%d').date(),
        content=data['content']
    )

    for vid in data.get("recipient_ids", []):
        recipient = MessageRecipient(volunteer_id=vid)
        new_message.recipients.append(recipient)

    db.session.add(new_message)
    db.session.commit()

    return jsonify({"message_id": new_message.message_id}), 201



@app.route('/api/messages/<int:volunteer_id>', methods=['GET'])
def get_messages_for_volunteer(volunteer_id):
    recipients = MessageRecipient.query.filter_by(volunteer_id=volunteer_id).all()
    messages = [
        {
            "id": r.message.message_id,
            "title": r.message.title,
            "sender_name": r.message.sender_name,
            "date": r.message.date.strftime('%B %d, %Y'),
            "content": r.message.content
        }
        for r in recipients
    ]
    return jsonify(messages), 200


# Log Hours API
@app.route('/api/log_hours', methods=['POST'])
def log_hours():   
    data = request.get_json()
    new_log = LogHours(
        volunteer_id=data['volunteer_id'], 
        hours=data['hours'], 
        assignment_type=data['assignment_type']
        )
    db.session.add(new_log)
    db.session.commit()
    return jsonify({"log_id": new_log.log_id}), 201

@app.route('/api/log_hours', methods=['GET'])
def get_log_hours():
    logs = LogHours.query.all()
    return jsonify([
        {"log_id": log.log_id, 
         "volunteer_id": log.volunteer_id, 
         "hours": log.hours, 
         "assignment_type": log.assignment_type
         } for log in logs
         ]), 200


if __name__ == '__main__':
    # with app.app_context():
    #     db.drop_all()
    #     db.create_all()
    app.run(debug=True)