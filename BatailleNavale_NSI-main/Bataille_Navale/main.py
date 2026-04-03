from flask import *

app = Flask(__name__)

@app.route("/", methods=["GET"])
def index():
    return render_template("connection/connection.html")

@app.route("/login", methods=["POST"])
def login():
    data = request.json or {}
    pseudo = data.get("message")
    print(pseudo)

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)