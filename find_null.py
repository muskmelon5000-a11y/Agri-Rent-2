import os

files_to_check = [
    'backend/schemas.py',
    'backend/routers/bookings.py',
    'backend/routers/equipment.py',
    'backend/routers/auth.py',
    'backend/main.py',
    'backend/models.py'
]

for path in files_to_check:
    if os.path.exists(path):
        with open(path, 'rb') as f:
            content = f.read()
            if b'\x00' in content:
                print(f"File with null bytes: {path}")
            else:
                print(f"Clean: {path}")
