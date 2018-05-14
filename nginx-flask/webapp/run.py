from app import create_app
from adaptor import adaptors
from session import sessions

app = create_app()
app.register_blueprint(adaptors)
app.register_blueprint(sessions)

if __name__ == '__main__':
    app.run(debug=True, port=5000)