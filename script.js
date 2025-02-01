let participants = JSON.parse(localStorage.getItem('participants')) || [];
let editMode = false;
let deleteMode = false;

// Lista de nombres excluidos (sin distinguir mayúsculas, minúsculas ni acentos)
const excludedParticipants = ["ángel barrera"].map(name => name.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase());

function addParticipant() {
    const nameInput = document.getElementById('name');
    let name = nameInput.value.trim();
    if (name) {
        let normalizedName = name.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
        if (excludedParticipants.includes(normalizedName)) {
            alert("Este participante está excluido del sorteo.");
            return;
        }
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

        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.onclick = () => deleteParticipant(index);
        actions.appendChild(deleteBtn);

        const editBtn = document.createElement('button');
        editBtn.innerHTML = '<i class="fas fa-pencil-alt"></i>';
        editBtn.onclick = () => editParticipant(index);
        actions.appendChild(editBtn);

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
    if (participants.length === 0) {
        alert('No hay participantes para elegir.');
        return;
    }
    let availableParticipants = participants.filter(name => 
        !excludedParticipants.includes(name.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase())
    );
    if (availableParticipants.length === 0) {
        alert("No hay participantes elegibles después de aplicar exclusiones.");
        return;
    }
    const winnerIndex = Math.floor(Math.random() * availableParticipants.length);
    document.getElementById('digitalBoard').textContent = `¡El ganador es: ${availableParticipants[winnerIndex]}!`;
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
