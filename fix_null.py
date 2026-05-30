with open('backend/main.py', 'rb') as f:
    content = f.read()

# Remove null bytes
clean_content = content.replace(b'\x00', b'')

with open('backend/main.py', 'wb') as f:
    f.write(clean_content)
