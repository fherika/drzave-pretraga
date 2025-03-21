let debounceTimeout;
const loadingIndikator = document.getElementById('loading');

function potraziDrzave(upit) {
    const rezultatiKontejner = document.getElementById('rezultati-container');

    if (upit.trim() === '') {
        clearTimeout(debounceTimeout);
        rezultatiKontejner.innerHTML = '';
        loadingIndikator.style.display = 'none';
        return;
    }

    console.log('Prikaz loading indikatora.');
    loadingIndikator.style.display = 'block';
    console.log('Loading indikator display:', loadingIndikator.style.display);
    clearTimeout(debounceTimeout);



    debounceTimeout = setTimeout(() => {
        fetch(`https://restcountries.com/v3.1/name/${upit}`)
            .then(response => {
                if (response.status === 404) {
                    return [];
                }
                //console.log('API odgovor:', response);
                return response.json()
            })
            .then(data => {
                const filtriraneDrzave = data.filter(drzava => drzava.name.common.toLowerCase().startsWith(upit.toLowerCase()));
                prikaziDrzave(filtriraneDrzave);
            })
            .catch(error => {
                console.error('Greska kod dohvacanja podataka:', error);
            }).finally(() => {
                loadingIndikator.style.display = 'none';
            });
    }, 300);
}

function prikaziDrzave(drzave) {
    const rezultatiKontejner = document.getElementById('rezultati-container');
    rezultatiKontejner.innerHTML = '';

    if (drzave && drzave.length > 0) {
        drzave.forEach(drzava => {
            const kartica = document.createElement('div');
            kartica.classList.add('card');

            kartica.innerHTML = `<img src="${drzava.flags.png}" alt="Zastava ${drzava.name.common}" class="flag">
            <h3>${drzava.name.common}</h3>
            <p><strong>Glavni grad:</strong> ${drzava.capital.join(', ')}</p>
            <p><strong>Broj stanovnika:</strong> ${drzava.population.toLocaleString()}</p>
            <p><strong>Službeni jezici:</strong> ${Object.values(drzava.languages).join(', ')}</p>`;

            rezultatiKontejner.appendChild(kartica);
        });
    } else {
        rezultatiKontejner.innerHTML = '<p>Nema rezultata pretrage.</p>';
    }
}





document.getElementById('pretraga').addEventListener('input', function (event) { potraziDrzave(event.target.value); });