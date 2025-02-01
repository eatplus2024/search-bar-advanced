// Inicializar participantes desde localStorage
let participants = JSON.parse(localStorage.getItem('participants')) || [];
let editMode = false;
let deleteMode = false;
let excludedParticipants = ["Nombre1", "Nombre2"]; // Lista de excluidos

function addParticipant() {
    const nameInput = document.getElementById('name');
    const name = nameInput.value.trim();
    if (name) {
        participants.push(name);
        saveParticipants();
        updateParticipantsList();
        nameInput.value = '';
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
        actions.className = 'actions';

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
    if (confirm("¿Estás seguro de que quieres eliminar a todos los participantes?")) {
        participants = [];
        saveParticipants();
        updateParticipantsList();
    }
}

function pickWinner() {
    let filteredParticipants = participants.filter(p => !excludedParticipants.includes(p));
    if (filteredParticipants.length === 0) {
        alert('No hay participantes elegibles para elegir.');
        return;
    }

    const digitalBoard = document.getElementById('digitalBoard');
    let displayedParticipants = shuffleArray([...filteredParticipants]);
    let currentIndex = 0;
    const speed = 100;
    const duration = 5000;

    digitalBoard.classList.remove('winner');

    const interval = setInterval(() => {
        digitalBoard.textContent = displayedParticipants[currentIndex];
        currentIndex = (currentIndex + 1) % displayedParticipants.length;
    }, speed);

    setTimeout(() => {
        clearInterval(interval);
        const winnerIndex = Math.floor(Math.random() * filteredParticipants.length);
        digitalBoard.textContent = `¡El ganador es: ${filteredParticipants[winnerIndex]}!`;
        digitalBoard.classList.add('winner');
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

window.onload = () => {
    updateParticipantsList();
};
