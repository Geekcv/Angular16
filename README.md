# import MySQLdb
# import psycopg2

# try:
#     # Connect to MySQL
#     mysql_conn = MySQLdb.connect(host="localhost", user="root", passwd="root", db="shtecaoh_jain_board")
#     mysql_cursor = mysql_conn.cursor()

#     # Connect to PostgreSQL
#     pg_conn = psycopg2.connect("dbname=shtecaoh_jain_board user=postgres password=Admin")
#     pg_cursor = pg_conn.cursor()

#     # Create the event table in PostgreSQL if it doesn't exist
#     pg_cursor.execute("""
#     CREATE TABLE IF NOT EXISTS public.event (
#         id SERIAL PRIMARY KEY,
#         event_date DATE,
#         event_time TIME,
#         name VARCHAR(255),
#         address VARCHAR(255),
#         is_Active BOOLEAN,
#         create_date TIMESTAMP,
#         modify_date TIMESTAMP
#     );
#     """)
#     pg_conn.commit()

#     # Fetch data from MySQL
#     mysql_cursor.execute("SELECT id, event_date, event_time, name, address, is_Active, create_date, modify_date FROM event")
#     rows = mysql_cursor.fetchall()

#     # Insert data into PostgreSQL
#     for row in rows:
#         # Debug: Print row data to verify the structure
#         print(f"Row data: {row}")

#         # Handle data conversion if necessary (e.g., converting is_Active to boolean for PostgreSQL)
#         is_active = True if row[5] == 1 else False  # Assuming is_Active is stored as 1 or 0 in MySQL
#         row = (*row[:5], is_active, *row[6:])  # Replace the old is_Active value with the converted boolean

#         # Insert into PostgreSQL
#         pg_cursor.execute("""
#         INSERT INTO public.event (id, event_date, event_time, name, address, is_Active, create_date, modify_date)
#         VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
#         """, row)

#     # Commit changes
#     pg_conn.commit()
#     print("Data migration complete!")

# except Exception as e:
#     # Print any errors that occur
#     print(f"Error: {e}")
#     pg_conn.rollback()

# finally:
#     # Close connections
#     mysql_cursor.close()
#     pg_cursor.close()
#     mysql_conn.close()
#     pg_conn.close()


# import MySQLdb
# import psycopg2

# def create_enum_type(pg_cursor, column_name, values):
#     # Check if ENUM type already exists in PostgreSQL
#     enum_type = f"{column_name}_enum"
#     pg_cursor.execute(f"""
#         DO $$ BEGIN
#             IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = '{enum_type}') THEN
#                 CREATE TYPE {enum_type} AS ENUM ({', '.join([f"'{v}'" for v in values])});
#             END IF;
#         END $$;
#     """)
#     pg_cursor.connection.commit()

# def get_mysql_tables(cursor):
#     # Get all table names from MySQL database
#     cursor.execute("SHOW TABLES")
#     tables = cursor.fetchall()
#     return [table[0] for table in tables]

# def get_mysql_table_schema(cursor, table_name):
#     # Get the schema (columns and data types) of a MySQL table
#     cursor.execute(f"DESCRIBE {table_name}")
#     schema = cursor.fetchall()
#     return schema

# def create_postgresql_table(cursor, table_name, schema):
#     # Create a table in PostgreSQL if it doesn't exist
#     columns = []
#     for column in schema:
#         column_name = column[0]
#         column_type = column[1]

#         # Handle MySQL ENUM type
#         if 'enum' in column_type.lower():
#             # Extract the possible enum values from the column type
#             values = column_type[column_type.find('(') + 1:column_type.rfind(')')].split(',')
#             values = [v.strip().strip("'") for v in values]

#             # Create the ENUM type in PostgreSQL
#             create_enum_type(cursor, column_name, values)

#             # Set the column type to the ENUM in PostgreSQL
#             column_type = f"{column_name}_enum"
        
#         # Convert MySQL data types to PostgreSQL data types
#         if 'int' in column_type.lower():
#             column_type = 'INTEGER'
#         elif 'varchar' in column_type.lower():
#             column_type = 'VARCHAR'
#         elif 'text' in column_type.lower():
#             column_type = 'TEXT'
#         elif 'date' in column_type.lower():
#             column_type = 'DATE'
#         elif 'time' in column_type.lower():
#             column_type = 'TIME'
#         elif 'timestamp' in column_type.lower():
#             column_type = 'TIMESTAMP'
#         elif 'bool' in column_type.lower() or 'tinyint(1)' in column_type.lower():
#             column_type = 'BOOLEAN'
#         elif 'double' in column_type.lower():
#             # Convert 'double' to 'DOUBLE PRECISION' in PostgreSQL
#             column_type = 'DOUBLE PRECISION'
#         elif 'float' in column_type.lower():
#             # If you have float(7,2), use NUMERIC(7,2)
#             if 'float' in column_type and '(' in column_type:
#                 column_type = 'NUMERIC(7,2)'  # PostgreSQL equivalent for float with precision
#             else:
#                 column_type = 'REAL'  # Default float type without precision

#         columns.append(f"{column_name} {column_type}")
    
#     # Join columns into a create table statement
#     create_statement = f"CREATE TABLE IF NOT EXISTS public.{table_name} ({', '.join(columns)});"
#     cursor.execute(create_statement)

# def migrate_data(mysql_cursor, pg_cursor, table_name, schema):
#     # Fetch data from MySQL
#     mysql_cursor.execute(f"SELECT * FROM {table_name}")
#     rows = mysql_cursor.fetchall()

#     # Insert data into PostgreSQL
#     for row in rows:
#         # Process row to handle empty strings for ENUM columns
#         processed_row = []
#         for column_name, value in zip([col[0] for col in schema], row):
#             # If the column is an ENUM column and the value is an empty string, convert it to NULL
#             if column_name.endswith("_enum") and value == "":
#                 processed_row.append(None)  # Insert NULL for empty strings in ENUM columns
#             else:
#                 processed_row.append(value)

#         # Insert into PostgreSQL
#         placeholders = ', '.join(['%s'] * len(processed_row))
#         insert_statement = f"INSERT INTO public.{table_name} VALUES ({placeholders})"
#         pg_cursor.execute(insert_statement, processed_row)

# def main():
#     try:
#         # Connect to MySQL
#         mysql_conn = MySQLdb.connect(host="localhost", user="root", passwd="root", db="shtecaoh_jain_board")
#         mysql_cursor = mysql_conn.cursor()

#         # Connect to PostgreSQL
#         pg_conn = psycopg2.connect("dbname=shtecaoh_jain_board user=postgres password=Admin")
#         pg_cursor = pg_conn.cursor()

#         # Get all tables from MySQL
#         tables = get_mysql_tables(mysql_cursor)

#         for table in tables:
#             # Get table schema from MySQL
#             schema = get_mysql_table_schema(mysql_cursor, table)

#             # Create corresponding table in PostgreSQL
#             create_postgresql_table(pg_cursor, table, schema)

#             # Migrate data from MySQL to PostgreSQL
#             migrate_data(mysql_cursor, pg_cursor, table, schema)

#             # Commit changes after migrating the table
#             pg_conn.commit()
#             print(f"Data migration for table '{table}' complete!")

#     except Exception as e:
#         # Print any errors that occur
#         print(f"Error: {e}")
#         pg_conn.rollback()

#     finally:
#         # Close connections
#         mysql_cursor.close()
#         pg_cursor.close()
#         mysql_conn.close()
#         pg_conn.close()

# if __name__ == "__main__":
#     main()


# import MySQLdb
# import psycopg2

# def create_enum_type(pg_cursor, column_name, values):
#     # Check if ENUM type already exists in PostgreSQL
#     enum_type = f"{column_name}_enum"
#     pg_cursor.execute(f"""
#         DO $$ BEGIN
#             IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = '{enum_type}') THEN
#                 CREATE TYPE {enum_type} AS ENUM ({', '.join([f"'{v}'" for v in values])});
#             END IF;
#         END $$;
#     """)
#     pg_cursor.connection.commit()

# def get_mysql_tables(cursor):
#     # Get all table names from MySQL database
#     cursor.execute("SHOW TABLES")
#     tables = cursor.fetchall()
#     return [table[0] for table in tables]

# def get_mysql_table_schema(cursor, table_name):
#     # Get the schema (columns and data types) of a MySQL table
#     cursor.execute(f"DESCRIBE {table_name}")
#     schema = cursor.fetchall()
#     return schema

# def create_postgresql_table(cursor, table_name, schema):
#     # Create a table in PostgreSQL if it doesn't exist
#     columns = []
#     for column in schema:
#         column_name = column[0]
#         column_type = column[1]

#         # Handle MySQL ENUM type
#         if 'enum' in column_type.lower():
#             # Extract the possible enum values from the column type
#             values = column_type[column_type.find('(') + 1:column_type.rfind(')')].split(',')
#             values = [v.strip().strip("'") for v in values]

#             # Create the ENUM type in PostgreSQL
#             create_enum_type(cursor, column_name, values)

#             # Set the column type to the ENUM in PostgreSQL
#             column_type = f"{column_name}_enum"
        
#         # Convert MySQL data types to PostgreSQL data types
#         if 'int' in column_type.lower():
#             column_type = 'INTEGER'
#         elif 'varchar' in column_type.lower():
#             column_type = 'VARCHAR'
#         elif 'text' in column_type.lower():
#             column_type = 'TEXT'
#         elif 'date' in column_type.lower():
#             column_type = 'DATE'
#         elif 'time' in column_type.lower():
#             column_type = 'TIME'
#         elif 'timestamp' in column_type.lower():
#             column_type = 'TIMESTAMP'
#         elif 'bool' in column_type.lower() or 'tinyint(1)' in column_type.lower():
#             column_type = 'BOOLEAN'
#         elif 'double' in column_type.lower():
#             # Convert 'double' to 'DOUBLE PRECISION' in PostgreSQL
#             column_type = 'DOUBLE PRECISION'
#         elif 'float' in column_type.lower():
#             # If you have float(7,2), use NUMERIC(7,2)
#             if 'float' in column_type and '(' in column_type:
#                 column_type = 'NUMERIC(7,2)'  # PostgreSQL equivalent for float with precision
#             else:
#                 column_type = 'REAL'  # Default float type without precision

#         columns.append(f"{column_name} {column_type}")
    
#     # Join columns into a create table statement
#     create_statement = f"CREATE TABLE IF NOT EXISTS public.{table_name} ({', '.join(columns)});"
#     cursor.execute(create_statement)

# def migrate_data(mysql_cursor, pg_cursor, table_name, schema):
#     # Fetch data from MySQL
#     mysql_cursor.execute(f"SELECT * FROM {table_name}")
#     rows = mysql_cursor.fetchall()

#     # Insert data into PostgreSQL
#     for row in rows:
#         # Process row to handle empty strings for ENUM columns
#         processed_row = []
#         for column_name, value in zip([col[0] for col in schema], row):
#             # If the column is an ENUM column and the value is an empty string, convert it to NULL
#             if column_name.endswith("_enum") and value == "":
#                 processed_row.append(None)  # Insert NULL for empty strings in ENUM columns
#             else:
#                 processed_row.append(value)

#         # Insert into PostgreSQL
#         placeholders = ', '.join(['%s'] * len(processed_row))
#         insert_statement = f"INSERT INTO public.{table_name} VALUES ({placeholders})"
        
#         try:
#             pg_cursor.execute(insert_statement, processed_row)
#         except psycopg2.Error as e:
#             print(f"Error inserting data into {table_name}: {e}")
#             print(f"Row that caused the error: {processed_row}")
#             pg_cursor.connection.rollback()  # Rollback the transaction on error
#             return  # Exit the migration for this table upon error

#     # Commit the transaction for the table after all rows are inserted
#     pg_cursor.connection.commit()

# def main():
#     try:
#         # Connect to MySQL
#         mysql_conn = MySQLdb.connect(host="localhost", user="root", passwd="root", db="shtecaoh_jain_board")
#         mysql_cursor = mysql_conn.cursor()

#         # Connect to PostgreSQL
#         pg_conn = psycopg2.connect("dbname=shtecaoh_jain_board user=postgres password=Admin")
#         pg_cursor = pg_conn.cursor()

#         # Get all tables from MySQL
#         tables = get_mysql_tables(mysql_cursor)

#         for table in tables:
#             # Get table schema from MySQL
#             schema = get_mysql_table_schema(mysql_cursor, table)

#             # Create corresponding table in PostgreSQL
#             create_postgresql_table(pg_cursor, table, schema)

#             # Migrate data from MySQL to PostgreSQL
#             migrate_data(mysql_cursor, pg_cursor, table, schema)

#             # Commit changes after migrating the table
#             pg_conn.commit()
#             print(f"Data migration for table '{table}' complete!")

#     except Exception as e:
#         # Print any errors that occur
#         print(f"Error: {e}")
#         pg_conn.rollback()

#     finally:
#         # Close connections
#         mysql_cursor.close()
#         pg_cursor.close()
#         mysql_conn.close()
#         pg_conn.close()

# if __name__ == "__main__":
#     main()


import MySQLdb
import psycopg2

def create_enum_type(pg_cursor, column_name, values):
    # Check if ENUM type already exists in PostgreSQL
    enum_type = f"{column_name}_enum"
    pg_cursor.execute(f"""
        DO $$ BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = '{enum_type}') THEN
                CREATE TYPE {enum_type} AS ENUM ({', '.join([f"'{v}'" for v in values])});
            END IF;
        END $$;
    """)
    pg_cursor.connection.commit()

def get_mysql_tables(cursor):
    # Get all table names from MySQL database
    cursor.execute("SHOW TABLES")
    tables = cursor.fetchall()
    return [table[0] for table in tables]

def get_mysql_table_schema(cursor, table_name):
    # Get the schema (columns and data types) of a MySQL table
    cursor.execute(f"DESCRIBE {table_name}")
    schema = cursor.fetchall()
    return schema

def create_postgresql_table(cursor, table_name, schema):
    # Create a table in PostgreSQL if it doesn't exist
    columns = []
    for column in schema:
        column_name = column[0]
        column_type = column[1]

        # Handle MySQL ENUM type
        if 'enum' in column_type.lower():
            # Extract the possible enum values from the column type
            values = column_type[column_type.find('(') + 1:column_type.rfind(')')].split(',')
            values = [v.strip().strip("'") for v in values]

            # Create the ENUM type in PostgreSQL
            create_enum_type(cursor, column_name, values)

            # Set the column type to the ENUM in PostgreSQL
            column_type = f"{column_name}_enum"
        
        # Convert MySQL data types to PostgreSQL data types
        if 'int' in column_type.lower():
            column_type = 'INTEGER'
        elif 'varchar' in column_type.lower():
            column_type = 'VARCHAR'
        elif 'text' in column_type.lower():
            column_type = 'TEXT'
        elif 'date' in column_type.lower():
            column_type = 'DATE'
        elif 'time' in column_type.lower():
            column_type = 'TIME'
        elif 'timestamp' in column_type.lower():
            column_type = 'TIMESTAMP'
        elif 'bool' in column_type.lower() or 'tinyint(1)' in column_type.lower():
            column_type = 'BOOLEAN'
        elif 'double' in column_type.lower():
            # Convert 'double' to 'DOUBLE PRECISION' in PostgreSQL
            column_type = 'DOUBLE PRECISION'
        elif 'float' in column_type.lower():
            # If you have float(7,2), use NUMERIC(7,2)
            if 'float' in column_type and '(' in column_type:
                column_type = 'NUMERIC(7,2)'  # PostgreSQL equivalent for float with precision
            else:
                column_type = 'REAL'  # Default float type without precision

        columns.append(f"{column_name} {column_type}")
    
    # Join columns into a create table statement
    create_statement = f"CREATE TABLE IF NOT EXISTS public.{table_name} ({', '.join(columns)});"
    cursor.execute(create_statement)

def migrate_data(mysql_cursor, pg_cursor, table_name, schema):
    # Fetch data from MySQL
    mysql_cursor.execute(f"SELECT * FROM {table_name}")
    rows = mysql_cursor.fetchall()

    # Insert data into PostgreSQL
    for row in rows:
        # Process row to handle empty strings for ENUM columns
        processed_row = []
        for column_name, value in zip([col[0] for col in schema], row):
            # If the column is an ENUM column and the value is an empty string, convert it to NULL
            if column_name.endswith("_enum") and value == "":
                processed_row.append(None)  # Insert NULL for empty strings in ENUM columns
            else:
                processed_row.append(value)

        # Insert into PostgreSQL
        placeholders = ', '.join(['%s'] * len(processed_row))
        insert_statement = f"INSERT INTO public.{table_name} VALUES ({placeholders})"
        
        try:
            pg_cursor.execute(insert_statement, processed_row)
        except psycopg2.Error as e:
            print(f"Error inserting data into {table_name}: {e}")
            print(f"Row that caused the error: {processed_row}")
            pg_cursor.connection.rollback()  # Rollback the transaction on error
            return  # Exit the migration for this table upon error

    # Commit the transaction for the table after all rows are inserted
    pg_cursor.connection.commit()

def main():
    try:
        # Connect to MySQL
        mysql_conn = MySQLdb.connect(host="localhost", user="root", passwd="root", db="shtecaoh_jain_board")
        mysql_cursor = mysql_conn.cursor()

        # Connect to PostgreSQL
        pg_conn = psycopg2.connect("dbname=shtecaoh_jain_board user=postgres password=Admin")
        pg_cursor = pg_conn.cursor()

        # Get all tables from MySQL
        tables = get_mysql_tables(mysql_cursor)

        for table in tables:
            # Get table schema from MySQL
            schema = get_mysql_table_schema(mysql_cursor, table)

            # Create corresponding table in PostgreSQL
            create_postgresql_table(pg_cursor, table, schema)

            # Migrate data from MySQL to PostgreSQL
            migrate_data(mysql_cursor, pg_cursor, table, schema)

            # Commit changes after migrating the table
            pg_conn.commit()
            print(f"Data migration for table '{table}' complete!")

    except Exception as e:
        # Print any errors that occur
        print(f"Error: {e}")
        pg_conn.rollback()

    finally:
        # Close connections
        mysql_cursor.close()
        pg_cursor.close()
        mysql_conn.close()
        pg_conn.close()

if __name__ == "__main__":
    main()
