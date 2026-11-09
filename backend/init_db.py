
from database import engine, Base
import models

def initialize_database():
    try:
        Base.metadata.create_all(bind=engine)

        print("================================")
        print("VINSYREX DATABASE INITIALIZED")
        print("================================")

        for table in Base.metadata.sorted_tables:
            print(f"[CREATED] {table.name}")

        print("================================")
        print("All database tables are ready!")

    except Exception as error:
        print("Database initialization failed:", error)


if __name__ == "__main__":
    initialize_database()
