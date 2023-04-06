from app_factory import create_flask_app

app = create_flask_app(__name__, 'config.DevelopmentConfig')

# Default port:
if __name__ == '__main__':
    app.run()