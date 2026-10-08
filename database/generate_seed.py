import csv
import sys
import io

def generate_sql(csv_text):
    lines = csv_text.strip().split('\n')
    sections = []
    
    current_section = []
    for line in lines:
        line = line.strip()
        if not line:
            continue
        # detect new section by headers
        if 'waybill_number,ai_title' in line:
            if current_section: sections.append(current_section)
            current_section = [line]
            current_section.append('__TABLE__:ai_narratives')
        elif 'courier_id,courier_name' in line:
            if current_section: sections.append(current_section)
            current_section = [line]
            current_section.append('__TABLE__:couriers')
        elif 'waybill_number,courier_id' in line:
            if current_section: sections.append(current_section)
            current_section = [line]
            current_section.append('__TABLE__:shipment_couriers')
        elif 'waybill_number,service_type' in line:
            if current_section: sections.append(current_section)
            current_section = [line]
            current_section.append('__TABLE__:shipments')
        elif 'waybill_number,latitude' in line:
            if current_section: sections.append(current_section)
            current_section = [line]
            current_section.append('__TABLE__:telemetry_data')
        else:
            current_section.append(line)
            
    if current_section:
        sections.append(current_section)

    sql_statements = []
    sql_statements.append("BEGIN;")
    
    # We should reorder the inserts because of Foreign Keys.
    # 1. shipments
    # 2. couriers
    # 3. shipment_couriers
    # 4. telemetry_data
    # 5. ai_narratives
    
    order = ['shipments', 'couriers', 'shipment_couriers', 'telemetry_data', 'ai_narratives']
    
    # map sections
    tables_data = {}
    for sec in sections:
        header = sec[0]
        table_name = sec[1].split(':')[1]
        data = sec[2:]
        tables_data[table_name] = (header, data)

    for tbl in order:
        if tbl not in tables_data:
            continue
        
        header_line = tables_data[tbl][0]
        cols = header_line.split(',')
        data_lines = tables_data[tbl][1]
        
        # parse with csv
        f = io.StringIO('\n'.join(data_lines))
        reader = csv.reader(f)
        
        for row in reader:
            if not row: continue
            
            # format values
            vals = []
            for v in row:
                if v == '':
                    vals.append('NULL')
                elif v.lower() == 'true':
                    vals.append('true')
                elif v.lower() == 'false':
                    vals.append('false')
                else:
                    # escape single quotes
                    esc_v = v.replace("'", "''")
                    vals.append(f"'{esc_v}'")
                    
            cols_str = ", ".join(cols)
            vals_str = ", ".join(vals)
            stmt = f"INSERT INTO {tbl} ({cols_str}) VALUES ({vals_str}) ON CONFLICT DO NOTHING;"
            sql_statements.append(stmt)
            
    sql_statements.append("COMMIT;")
    return '\n'.join(sql_statements)

with open('database/dataset.csv', 'r') as f:
    text = f.read()

sql_output = generate_sql(text)
with open('database/seed_dataset.sql', 'w') as f:
    f.write(sql_output)
print("seed_dataset.sql generated successfully.")
