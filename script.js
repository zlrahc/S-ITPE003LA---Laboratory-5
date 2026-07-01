document.getElementById('bmiForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const age = parseInt(document.getElementById('age').value);
    const sex = document.getElementById('sex').value;
    const weight = parseFloat(document.getElementById('weight').value);
    const heightCm = parseFloat(document.getElementById('height').value);

    // Validation
    if (
        !name ||
        !sex ||
        isNaN(age) || age <= 0 ||
        isNaN(weight) || weight <= 0 ||
        isNaN(heightCm) || heightCm <= 0
    ) {
        alert('Please fill out all fields with valid values.');
        return;
    }

    // BMI Calculation
    const heightM = heightCm / 100;
    const bmi = +(weight / (heightM * heightM)).toFixed(1);

    let category, message, cardClass;

    // BMI Classification
    switch (true) {
        case bmi < 18.5:
            category = 'Underweight';
            cardClass = 'underweight';
            message = 'Consider a balanced, calorie-sufficient diet.';
            break;

        case bmi < 25:
            category = 'Normal';
            cardClass = 'normal';
            message = 'Great! Keep up your healthy habits.';
            break;

        case bmi < 30:
            category = 'Overweight';
            cardClass = 'overweight';
            message = 'Consider more physical activity and mindful eating.';
            break;

        default:
            category = 'Obese';
            cardClass = 'obese';
            message = 'We recommend consulting a healthcare provider.';
    }

    // Display result
    showResult(name, bmi, category, message, cardClass);

    // Save to Google Sheets
    recordSubmission({
        formType: 'bmi',
        name,
        age,
        sex,
        weight,
        heightCm,
        bmi,
        category
    });
});



function showResult(name, bmi, category, message, cardClass) {
    const resultCard = document.getElementById('resultCard');

    const classes = [
        'hidden',
        'underweight',
        'normal',
        'overweight',
        'obese'
    ];

    for (let i = 0; i < classes.length; i++) {
        resultCard.classList.remove(classes[i]);
    }

    resultCard.classList.add(cardClass);

    resultCard.innerHTML = `
        <h2>Hello, ${name}</h2>
        <div class="bmi-value">${bmi}</div>
        <div class="bmi-status">${category}</div>
        <p>${message}</p>
    `;

    resultCard.style.animation = 'none';
    resultCard.offsetHeight;
    resultCard.style.animation = 'resultReveal 0.6s ease-out';
}

function recordSubmission(record) {
    console.log('Sending record:', record);

    fetch(
        'https://script.google.com/macros/s/AKfycbxrScIx4ItkataGWKI_YAJ5-qbWG74p5gaEOIaSa273itkOqv95uvNdvRdPcno0s5ZlDw/exec',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams(record)
        }
    )
        .then(response => response.text())
        .then(data => {
            console.log('Google Sheets response:', data);
        })
        .catch(error => {
            console.error('Could not record submission:', error);
        });
}

document.getElementById('resetBtn').addEventListener('click', function () {
    const resultCard = document.getElementById('resultCard');

    resultCard.classList.add('hidden');
    const classes = [
        'hidden',
        'underweight',
        'normal',
        'overweight',
        'obese'
    ];

    for (let i = 0; i < classes.length; i++) {
        resultCard.classList.remove(classes[i]);
    }

    resultCard.innerHTML = '';
});