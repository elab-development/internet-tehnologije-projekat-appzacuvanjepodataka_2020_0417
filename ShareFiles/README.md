# ShareFiles

### Description
Naša veb aplikacija služi za upravljanje firmama i zaposlenima i omogućava korisnicima da, putem registracije, formiraju svoje virtuelne firme i dodaju zaposlene u okviru tih firmi. Glavni korisnik, tj. onaj koji kreira firmu, ima administratorska ovlašćenja, što podrazumeva mogućnost dodavanja i uklanjanja zaposlenih, kao i upravljanje njihovim ulogama i privilegijama. Aplikacija pruža funkcionalnost za deljenje fajlova unutar firme, pri čemu se mogu definisati privilegije za pregled i uređivanje, čime se osigurava sigurnost i kontrola nad deljenim dokumentima.
Jedna od ključnih funkcionalnosti aplikacije je integracija sa Google Drive-om, koja omogućava sinhronizaciju i preuzimanje fajlova direktno sa korisničkog naloga Google Drive-a. Na ovaj način, korisnici mogu jednostavno deliti i upravljati dokumentima na centralizovanom mestu bez potrebe za ručnim unosom fajlova u aplikaciju.
Tehnološki stack aplikacije se zasniva na Reactu, za frontend, što pruža interaktivno korisničko iskustvo i dinamične interfejse, dok se za backend koristi Laravel, koji omogućava skalabilnu, sigurnu i brzu obradu podataka i upravljanje bazama podataka.
Korisnici mogu kreirati svoje naloge putem registracije i nakon toga formirati virtuelne firme unutar aplikacije. Kada kreiraju firmu, postaju administratori te firme sa punim ovlašćenjima za upravljanje njenim radom i strukturom. Administrator firme ima potpuna ovlašćenja da kontroliše pristup svakom dokumentu, fajlu ili folderu. Može dodeliti različite nivoe privilegija (npr. pregled, uređivanje, deljenje) zaposlenima u skladu sa njihovim ulogama u firmi. Ovo omogućava sigurnu kolaboraciju, jer samo ovlašćeni zaposleni mogu modifikovati osetljive informacije.

### Prerequisites
- PHP >= 7.3
- Composer
- Node.js >= 12
- NPM 

### Steps to Install
1. Clone the repository:
    ```bash
    git clone https://github.com/elab-development/internet-tehnologije-projekat-appzacuvanjepodataka_2020_0417.git
    cd your-project
    ```

2. Install PHP dependencies:
    ```bash
    composer install
    ```

3. Install JavaScript dependencies:
    ```bash
    npm install
    ```

4. Configure `.env`:
    ```bash
    cp .env.example .env
    ```

5. Build the assets:
    ```bash
    npm run dev
    ```

6. Serve the application:
    ```bash
    php artisan serve --port=8003
    ```

## Usage
Admin (vlasnik kompanije) se postaje nakon kreiranja svoje kompanije, mogu se dodavati clanovi po njihovom email-u odmah nakon njihove registracije na website. Svaki clan moze dodavati fajlove u kompaniju, kao i videti ostale clanove kompanije, samo admin moze brisati fajlove kao i clanove. Na dashboard-u user (member) moze videti kompanije u koje je dodat. 

## Features
- Kreiranje kompanije
- Dodavanje i brisanje clanova kompanije
- Dodavanje i brisanje fajlova u kompaniji koja se skladiste na GoogleDrive
- Sortiranje clanova po abecedi
- Download clanova kompanije u .csv formatu
- Login, Logout, Register

## Technologies Used
- Laravel
- React
- MySQL
- Bootstrap/Tailwind CSS

## License
This project is licensed under the MIT License.
