import os
import re

directory = r'C:\Users\simok\Bureau\E-Tactiques LMS\E-MLearning\client\src\app\[locale]\(public)'

pattern = re.compile(r'(<Link[^>]*href=["\'])/pricing(["\'][^>]*>[\s\n]*Browse Courses[\s\n]*</Link>)', re.DOTALL)

for root, dirs, files in os.walk(directory):
    for file in files:
        if file.endswith('.tsx'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            new_content, count = pattern.subn(r'\g<1>/courses\g<2>', content)
            
            if count > 0:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f'Updated {count} links in {os.path.relpath(filepath, directory)}')
