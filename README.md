# Patente Pronta

App web installabile (PWA) per preparare l'esame teorico della **patente B**: quiz Vero/Falso con l'archivio ufficiale del Ministero, simulazione d'esame e test dei riflessi visivi e uditivi. Funziona anche senza rete dopo la prima apertura.

## Cosa contiene

- **7.106 quesiti** del listato ufficiale A/B del 23 aprile 2025, in 25 capitoli, con le **409 figure** originali.
- **Simulazione d'esame**: 30 domande, 20 minuti, massimo 3 errori, con riepilogo e possibilità di cambiare le risposte prima di consegnare.
- **Quiz per argomento**: serie da 20 domande che ripropongono prima errori e domande nuove, ripasso degli errori e serie dedicata ai segnali.
- **Test dei riflessi**: visivo, uditivo e misto, con tempi medi e distanza percorsa a 50 e 130 km/h. È un allenamento, non una visita medica.
- I progressi restano sul dispositivo (localStorage). Nessun account, nessun tracciamento.

## Installazione sul telefono

Apri l'indirizzo dell'app nel browser, poi:

- **iPhone (Safari)**: Condividi → *Aggiungi alla schermata Home*.
- **Android (Chrome)**: menu ⋮ → *Installa app* (o *Aggiungi a schermata Home*).

## Sviluppo

Sono solo file statici, senza passaggi di build. Per provarla in locale:

```
python3 -m http.server 8000
```

e apri http://localhost:8000. Il service worker richiede `localhost` o HTTPS.

### Aggiornare i quiz

```
git clone --depth 1 https://github.com/GoldenNocturne/patente-lab.git
python3 tools/build-data.py patente-lab/dist .
```

Poi cambia `VERSION` in `sw.js` (e `FIGURES` se il numero di figure cambia) per far rinnovare la cache sui dispositivi.

## Fonti e limiti

I quiz e le figure sono materiale del Ministero delle Infrastrutture e dei Trasporti, estratto da [Patente Lab](https://github.com/GoldenNocturne/patente-lab); vedi [THIRD_PARTY.md](THIRD_PARTY.md). L'app non è ufficiale e non è affiliata al Ministero. Il listato può essere aggiornato (per esempio dopo le modifiche al codice della strada): controlla sul [Portale dell'Automobilista](https://www.ilportaledellautomobilista.it) la versione più recente prima dell'esame.

## Licenza

Il codice è sotto licenza MIT (vedi [LICENSE](LICENSE)). La licenza non si estende ai quiz e alle figure.
