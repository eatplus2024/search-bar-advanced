// Inicializar participantes desde localStorage
let participants = JSON.parse(localStorage.getItem('participants')) || [];
let editMode = false;
let deleteMode = false;

function addParticipant() {
    const nameInput = document.getElementById('name');
    const name = nameInput.value.trim(); // Eliminar espacios innecesarios
    if (name) {
        participants.push(name);
        saveParticipants();
        updateParticipantsList();
        nameInput.value = ''; // Limpiar el campo de entrada
    } else {
        alert("Por favor, ingresa un nombre.");
    }
}

function updateParticipantsList() {
    const list = document.getElementById('participantsList');
    list.innerHTML = '';

    participants.forEach((participant, index) => {
        const li = document.createElement('li');
        li.textContent = participant;

        const actions = document.createElement('div');
        actions.className = 'actions'; // Clase para estilos adicionales

        if (editMode) {
            const editBtn = document.createElement('button');
            editBtn.innerHTML = '<i class="fas fa-edit"></i>';
            editBtn.onclick = () => editParticipant(index);
            actions.appendChild(editBtn);
        }

        if (deleteMode) {
            const deleteBtn = document.createElement('button');
            deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
            deleteBtn.onclick = () => deleteParticipant(index);
            actions.appendChild(deleteBtn);
        }

        li.appendChild(actions);
        list.appendChild(li);
    });

    // Mostrar el logotipo en la parte inferior
    displayLogoAtBottom();
}

function saveParticipants() {
    try {
        localStorage.setItem('participants', JSON.stringify(participants));
    } catch (error) {
        alert("Error al guardar los participantes. Verifica que tu navegador permita el uso de localStorage.");
    }
}

function clearParticipants() {
    if (confirm("¿Estás seguro de que quieres eliminar a todos los participantes?")) {
        participants = [];
        saveParticipants();
        updateParticipantsList();
    }
}

function pickWinner() {
    if (participants.length === 0) {
        alert('No hay participantes para elegir.');
        return;
    }

    const digitalBoard = document.getElementById('digitalBoard');
    digitalBoard.classList.remove('winner');

    const shuffledParticipants = [...participants];
    for (let i = shuffledParticipants.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledParticipants[i], shuffledParticipants[j]] = [shuffledParticipants[j], shuffledParticipants[i]];
    }

    let currentIndex = 0;
    const interval = setInterval(() => {
        digitalBoard.textContent = shuffledParticipants[currentIndex];
        currentIndex = (currentIndex + 1) % shuffledParticipants.length;
    }, 100);

    setTimeout(() => {
        clearInterval(interval);
        const winnerIndex = Math.floor(Math.random() * participants.length);
        const winner = participants[winnerIndex];

        digitalBoard.innerHTML = `
            <img src="logo.png" alt="Logotipo" class="logo-small">
            <p>¡El ganador es: <strong>${winner}</strong>!</p>
        `;
        digitalBoard.classList.add('winner');
    }, 5000); // Mostrar nombres durante 5 segundos antes de mostrar el ganador
}

function toggleEditMode() {
    editMode = !editMode;
    updateParticipantsList();
}

function toggleDeleteMode() {
    deleteMode = !deleteMode;
    updateParticipantsList();
}

function editParticipant(index) {
    const newName = prompt('Ingresa el nuevo nombre:', participants[index]);
    if (newName) {
        participants[index] = newName.trim();
        saveParticipants();
        updateParticipantsList();
    }
}

function deleteParticipant(index) {
    if (confirm(`¿Estás seguro de que quieres eliminar a ${participants[index]}?`)) {
        participants.splice(index, 1);
        saveParticipants();
        updateParticipantsList();
    }
}

// Mostrar el logotipo en la parte inferior
function displayLogoAtBottom() {
    const logoContainer = document.getElementById('logoContainer');
    logoContainer.innerHTML = ''; // Limpiar contenido anterior

    const logo = document.createElement('img');
    logo.src = 'logo.png'; // Reemplaza con la URL o ruta de tu logotipo
    logo.alt = 'Logotipo';
    logo.className = 'logo-bottom'; // Clase para estilos adicionales

    logoContainer.appendChild(logo);
}

// Actualiza la lista de participantes al cargar la página
window.onload = () => {
    updateParticipantsList();
};
