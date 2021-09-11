import os

from app.easy_mql.flask_mql import app


if __name__ == '__main__':
    app.run(host=os.getenv('HOST', '0.0.0.0'), port=os.getenv('PORT', '5000'))