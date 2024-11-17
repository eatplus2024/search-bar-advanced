let participants = JSON.parse(localStorage.getItem('participants')) || [];
let editMode = false;
let deleteMode = false;

function addParticipant() {
    const name = document.getElementById('name').value;
    if (name) {
        participants.push(name);
        updateParticipantsList();
        saveParticipants();
        document.getElementById('name').value = '';  // Limpiar el campo de entrada
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

        // Agregar botones de editar y eliminar en cada participante
        const actions = document.createElement('div');

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
}

function saveParticipants() {
    localStorage.setItem('participants', JSON.stringify(participants));
}

function clearParticipants() {
    participants = [];
    updateParticipantsList();
    saveParticipants();
}

function pickWinner() {
    if (participants.length === 0) {
        alert('No hay participantes para elegir.');
        return;
    }

    const digitalBoard = document.getElementById('digitalBoard');
    let currentIndex = 0;
    const speed = 100;  // Velocidad de cambio de nombre en milisegundos
    const duration = 5000;  // Duración total del efecto en milisegundos

    digitalBoard.classList.remove('winner');

    const pickWinnerBtn = document.getElementById('pickWinnerBtn');
    pickWinnerBtn.style.backgroundColor = 'green';
    pickWinnerBtn.style.color = 'black';

    const interval = setInterval(() => {
        digitalBoard.textContent = participants[currentIndex];
        currentIndex = (currentIndex + 1) % participants.length;
    }, speed);

    setTimeout(() => {
        clearInterval(interval);
        const winnerIndex = Math.floor(Math.random() * participants.length);
        digitalBoard.textContent = `¡El ganador es: ${participants[winnerIndex]}!`;
        digitalBoard.classList.add('winner');

        // Restaurar el color original del botón
        pickWinnerBtn.style.backgroundColor = '#333';
        pickWinnerBtn.style.color = 'white';
    }, duration);
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
        participants[index] = newName;
        updateParticipantsList();
        saveParticipants();
    }
}

function deleteParticipant(index) {
    if (confirm(`¿Estás seguro de que quieres eliminar a ${participants[index]}?`)) {
        participants.splice(index, 1);
        updateParticipantsList();
        saveParticipants();
    }
}

// Actualiza la lista de participantes al cargar la página
window.onload = updateParticipantsList;
