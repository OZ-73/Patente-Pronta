#!/usr/bin/env python3
"""Converte il bank.json di Patente Lab nel formato compatto usato da questa app.

Uso:
    git clone --depth 1 https://github.com/GoldenNocturne/patente-lab.git
    python3 tools/build-data.py patente-lab/dist .

Scrive ./bank.json e ./f/<n>.jpg. Dopo un aggiornamento dei dati, cambia VERSION in sw.js
e aggiorna FIGURES se il numero delle figure è diverso.
"""
import json, os, shutil, sys

src, out = sys.argv[1], sys.argv[2]
b = json.load(open(os.path.join(src, 'bank.json'), encoding='utf-8'))
chs = b['chapters']
cidx = {c['id']: i for i, c in enumerate(chs)}
imgs, imap = [], {}
for q in b['questions']:
    p = q.get('image')
    if p and p not in imap:
        imap[p] = len(imgs)
        imgs.append(p)
rows = []
for q in b['questions']:
    p = q.get('image')
    # [id ministero, capitolo, risposta (1 = Vero), figura (-1 = nessuna), gruppo, testo]
    rows.append([int(q['id']), cidx[q['chapterId']], 1 if q['answer'] else 0,
                 imap[p] if p else -1, int(q['groupId']), q['text']])
data = {'v': b['metadata']['sourceListDate'],
        'c': [[c['title'], c['count']] for c in chs], 'q': rows}
with open(os.path.join(out, 'bank.json'), 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, separators=(',', ':'))
os.makedirs(os.path.join(out, 'f'), exist_ok=True)
for i, p in enumerate(imgs):
    shutil.copyfile(os.path.join(src, p), os.path.join(out, 'f', f'{i}.jpg'))
print(len(rows), 'domande,', len(imgs), 'figure')
