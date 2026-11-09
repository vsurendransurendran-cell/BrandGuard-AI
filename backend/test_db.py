
from database import engine

try:
    with engine.connect() as connection:
        print("VINSYREX PostgreSQL connection successful!")
except Exception as error:
    print("Database connection failed:", error)
