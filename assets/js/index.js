function capturaInformacionUsuario() {
    var numeroSuperheroe = $('#numero-superheroe').val();

    if (isNaN(numeroSuperheroe) || numeroSuperheroe === '') {
        alert('Por favor, ingresa un número válido.');
        return null;
    }

    return {
        numero: numeroSuperheroe
    };
}

function consultaApi(datosSuperheroe) {
    var apiUrl = `https://superheroapi.com/api/69598af3407144a63099dcc6b07749cd/${datosSuperheroe.numero}`;

    return $.ajax({
        url: apiUrl,
        type: 'GET',
        dataType: 'json'
    })
    .then(function(response) {
        var superHeroData = {
            name: response.name, 
            powerstats: response.powerstats,
            biography: response.biography,
            appearance: response.appearance,
            work: response.work,
            connections: response.connections,
            image: response.image.url
        };

        return superHeroData;
    })
    .catch(function(error) {
        console.error('Error al obtener la información del superhéroe:', error);
        $('#superhero-container').html('<div class="alert alert-danger">Error al obtener la información del superhéroe.</div>');
        return null; 
    });
}

function renderSuperHeroName(superHeroData) {
    $('#superhero-name').text(superHeroData.name);
}

function renderSuperHeroCards(superHeroData) {
    $('#superhero-container').html('');

    var name = superHeroData.name || '';
   
   
    var cardHTML = `
        <div class="col-md-4 mb-4">
            <div class="card">
                <img src="${superHeroData.image}" class="card-img-top" alt="${name}">
                <div class="card-body">
                    <h5 class="card-title">${name}</h5>                    
                    <h6 class="card-subtitle mb-2 text-muted">Powerstats</h6>
                    <p>
                        Intelligence: ${superHeroData.powerstats.intelligence}<br>
                        Strength: ${superHeroData.powerstats.strength}<br>
                        Speed: ${superHeroData.powerstats.speed}<br>
                        Durability: ${superHeroData.powerstats.durability}<br>
                        Power: ${superHeroData.powerstats.power}<br>
                        Combat: ${superHeroData.powerstats.combat}
                    </p>
                </div>
                <div id="chart-${name.replace(/\s/g, '-')}" style="height: 200px; width: 100%;"></div>
            </div>
        </div>
    `;

    $('#superhero-container').append(cardHTML);

    var chart = new CanvasJS.Chart(`chart-${name.replace(/\s/g, '-')}`, {
        animationEnabled: true,
        theme: "light2",
        title: {
            text: `${name} Powerstats`
        },
        axisY: {
            maximum: 100,
            interval: 20
        },
        data: [{
            type: "bar",
            dataPoints: [
                { label: "Intelligence", y: parseInt(superHeroData.powerstats.intelligence), color: getBarColor(parseInt(superHeroData.powerstats.intelligence)) },
                { label: "Strength", y: parseInt(superHeroData.powerstats.strength), color: getBarColor(parseInt(superHeroData.powerstats.strength)) },
                { label: "Speed", y: parseInt(superHeroData.powerstats.speed), color: getBarColor(parseInt(superHeroData.powerstats.speed)) },
                { label: "Durability", y: parseInt(superHeroData.powerstats.durability), color: getBarColor(parseInt(superHeroData.powerstats.durability)) },
                { label: "Power", y: parseInt(superHeroData.powerstats.power), color: getBarColor(parseInt(superHeroData.powerstats.power)) },
                { label: "Combat", y: parseInt(superHeroData.powerstats.combat), color: getBarColor(parseInt(superHeroData.powerstats.combat)) }
            ]
        }]
    });
    chart.render();
}

function getBarColor(value) {
    if (value <= 20) {
        return "red";
    } else if (value <= 40) {
        return "orange";
    } else if (value <= 60) {
        return "yellow";
    } else if (value <= 80) {
        return "lightgreen";
    } else {
        return "green";
    }
}

$('#superheroe-form').on('submit', function(event) {
    event.preventDefault();

    var datosUsuario = capturaInformacionUsuario();
    if (datosUsuario) {
        consultaApi(datosUsuario)
            .then(function(superHeroData) {
                if (superHeroData) {
                    renderSuperHeroName(superHeroData);
                    renderSuperHeroCards(superHeroData);
                }
            });
    }
});
